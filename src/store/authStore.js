// src/store/authStore.js
import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  isAdmin: false,

  // Inicializa listener de autenticação
  initAuth: () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca o perfil do usuário
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const userProfile = userSnap.data();
            set({ 
              user,
              userProfile,
              loading: false,
              isAdmin: userProfile.role === 'admin'
            });
          } else {
            // Se for a primeira vez que o usuário faz login, cria um perfil básico
            const newUserProfile = {
              uid: user.uid,
              email: user.email,
              name: user.displayName || '',
              phone: user.phoneNumber || '',
              role: 'client', // Por padrão, novos usuários são clientes
              createdAt: new Date().toISOString()
            };
            
            await setDoc(userRef, newUserProfile);
            set({ 
              user,
              userProfile: newUserProfile,
              loading: false,
              isAdmin: false
            });
          }
        } catch (error) {
          console.error("Erro ao carregar perfil do usuário:", error);
          set({ 
            user, 
            userProfile: null,
            loading: false,
            error: "Erro ao carregar perfil do usuário"
          });
        }
      } else {
        set({ 
          user: null,
          userProfile: null,
          loading: false,
          isAdmin: false 
        });
      }
    });
    
    return unsubscribe;
  },

  // Login de administrador
// In your loginAdmin function, add more detailed error handling
loginAdmin: async (email, password) => {
  set({ loading: true, error: null });
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('User authenticated:', user.uid); // Debug log
    
    // Verifica se o usuário é administrador
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
  const newUserProfile = {
    uid: user.uid,
    email: user.email,
    name: user.displayName || '',
    phone: user.phoneNumber || '',
    role: 'admin', // 👈 ou você pode checar se é o primeiro user
    createdAt: new Date().toISOString()
  };
  
  await setDoc(userRef, newUserProfile);
  set({
    user,
    userProfile: newUserProfile,
    loading: false,
    isAdmin: true
  });
  return true;
}

    if (!userSnap.exists()) {
      await firebaseSignOut(auth);
      set({ 
        loading: false, 
        error: "Perfil de usuário não encontrado. Contate o administrador.",
        user: null,
        userProfile: null,
        isAdmin: false
      });
      return false;
    }

    const userProfile = userSnap.data();
    console.log('User profile:', userProfile); // Debug log
    
    if (userProfile.role !== 'admin') {
      await firebaseSignOut(auth);
      set({ 
        loading: false, 
        error: "Acesso não autorizado. Seu usuário não tem privilégios de administrador.",
        user: null,
        userProfile: null,
        isAdmin: false
      });
      return false;
    }
    
    set({ 
      user,
      userProfile,
      loading: false,
      isAdmin: true
    });
    return true;
  } catch (error) {
    console.error("Erro detalhado no login:", error); // More detailed logging
    
    let errorMessage = "Erro ao fazer login";
    if (error.code === 'auth/invalid-credential') {
      errorMessage = "Email ou senha incorretos";
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = "Usuário não encontrado";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Senha incorreta";
    } else {
      errorMessage = error.message;
    }
    
    set({ 
      loading: false, 
      error: errorMessage,
      user: null,
      userProfile: null,
      isAdmin: false
    });
    return false;
  }
},
// Add this to your authStore.js
// Add this to your authStore.js
createAdminUser: async (email, password, name = 'Admin') => {
  try {
    // 1. Create authentication user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Create admin profile in Firestore
    const userRef = doc(db, "users", userCredential.user.uid);
    await setDoc(userRef, {
      email,
      name,
      role: 'admin',
      createdAt: new Date().toISOString(),
      phone: ''
    });
    
    return true;
  } catch (error) {
    console.error('Error creating admin:', error);
    return false;
  }
},
  // Logout
  signOut: async () => {
    set({ loading: true });
    try {
      await firebaseSignOut(auth);
      set({ 
        user: null,
        userProfile: null,
        loading: false,
        isAdmin: false
      });
      return true;
    } catch (error) {
      console.error("Erro no logout:", error);
      set({ loading: false, error: error.message });
      return false;
    }
  },
// Temporary function - remove after use
upgradeToAdmin: async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { role: 'admin' }, { merge: true });
    console.log('User upgraded to admin');
    return true;
  } catch (error) {
    console.error('Error upgrading user:', error);
    return false;
  }
},
  // Atualiza o perfil do usuário
  updateUserProfile: async (data) => {
    const { user } = get();
    if (!user) return false;

    set({ loading: true, error: null });
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, data, { merge: true });
      
      set(state => ({ 
        userProfile: { ...state.userProfile, ...data },
        loading: false
      }));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      set({ loading: false, error: error.message });
      return false;
    }
  },

  // Verifica se o usuário está logado e é admin
  checkAdminAuth: () => {
    const { user, userProfile } = get();
    return user !== null && userProfile?.role === 'admin';
  }
}));

export default useAuthStore;