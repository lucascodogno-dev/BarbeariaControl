// store/scheduleStore.js
import { create } from "zustand";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import socket from "../services/socket";

const useScheduleStore = create((set, get) => ({
  schedule: null,
  loading: false,
  error: null,

  // Carrega os horários do banco de dados
  fetchSchedule: async () => {
    set({ loading: true, error: null });
    try {
      const scheduleRef = collection(db, "businessHours");
      const querySnapshot = await getDocs(scheduleRef);

      const scheduleData = {};
      querySnapshot.forEach((doc) => {
        scheduleData[doc.id] = doc.data();
      });

      set({ schedule: scheduleData, loading: false });
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Atualiza os horários no banco de dados
updateSchedule: async (day, data) => {
  set({ loading: true, error: null });
  try {
    const dayRef = doc(db, "businessHours", day);
    await setDoc(dayRef, data, { merge: true });

    set(state => ({
      schedule: {
        ...state.schedule,
        [day]: data
      },
      loading: false
    }));

    // ✅ Emitir atualização para clientes conectados
    socket.emit("schedule-updated", { day, data });

    return true;
  } catch (error) {
    console.error("Erro ao atualizar horários:", error);
    set({ error: error.message, loading: false });
    throw error;
  }
},


  // Escuta atualizações externas de horários
  setupSocketListeners: () => {
    socket.on("schedule-updated", ({ day, data }) => {
      set((state) => ({
        schedule: {
          ...state.schedule,
          [day]: data
        }
      }));
    });
  },

  cleanupSocketListeners: () => {
    socket.off("schedule-updated");
  }
}));

export default useScheduleStore;
