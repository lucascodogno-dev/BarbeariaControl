import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { create } from "zustand";
import socket from "../services/socket";

const useBlockedSlotStore = create((set, get) => ({
  blockedSlots: [],

  // 🔄 Buscar bloqueios para uma data
  fetchBlockedSlots: async (dateStr) => {
    try {
      const ref = collection(db, "blockedSlots");
      const q = query(ref, where("date", "==", dateStr));
      const snapshot = await getDocs(q);

      const blocks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      set({ blockedSlots: blocks });
    } catch (err) {
      console.error("Erro ao buscar bloqueios:", err);
    }
  },

  // ➕ Bloquear horário
  addBlockedSlot: async ({ date, time }) => {
    const newBlock = {
      date,
      time,
      createdAt: new Date().toISOString(),
    };

    const ref = collection(db, "blockedSlots");
    const docRef = await addDoc(ref, newBlock);
    const fullBlock = { id: docRef.id, ...newBlock };

    // 🔊 Emitir para todos via socket
    socket.emit("blocked-slot-added", fullBlock);

    set((state) => ({
      blockedSlots: [...state.blockedSlots, fullBlock],
    }));

    return fullBlock;
  },

  // ❌ Desbloquear horário
  removeBlockedSlot: async (id) => {
    try {
      const ref = doc(db, "blockedSlots", id);
      await deleteDoc(ref);

      // 🔊 Emitir desbloqueio via socket
      socket.emit("blocked-slot-removed", id);

      set((state) => ({
        blockedSlots: state.blockedSlots.filter((s) => s.id !== id),
      }));
    } catch (err) {
      console.error("Erro ao remover bloqueio:", err);
      throw err;
    }
  },

  // 🧠 Listeners socket
  setupSocketListeners: () => {
    socket.on("blocked-slot-added", (slot) => {
      const state = get();
      const alreadyExists = state.blockedSlots.some(
        (s) => s.id === slot.id || (s.date === slot.date && s.time === slot.time)
      );
      if (!alreadyExists) {
        set({ blockedSlots: [...state.blockedSlots, slot] });
      }
    });

    socket.on("blocked-slot-removed", (id) => {
      set((state) => ({
        blockedSlots: state.blockedSlots.filter((slot) => slot.id !== id),
      }));
    });
  },

  // 🧹 Limpar listeners
  cleanupSocketListeners: () => {
    socket.off("blocked-slot-added");
    socket.off("blocked-slot-removed");
  },
}));

export default useBlockedSlotStore;
