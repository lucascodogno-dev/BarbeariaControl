import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./services/firebase";

const createAdminUser = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    name: "Admin",
    phone: "",
    role: "admin",
    createdAt: new Date().toISOString()
  });
  console.log("Admin criado:", uid);
};
