import { create } from "zustand";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import socket from "../services/socket";
import { generateTimeSlots, isPastTime } from "../utils/date";

const useAppointmentStore = create((set, get) => ({
  appointments: [],
  loading: false,
  error: null,
  selectedDate: null,
  selectedService: null,
  selectedTime: null,
  availableSlots: [],

  // Carrega todos os agendamentos
  fetchAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const appointmentsRef = collection(db, "appointments");
      const q = query(appointmentsRef, orderBy("date"), orderBy("time"));
      const querySnapshot = await getDocs(q);

      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });

      set({ appointments, loading: false });
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Carrega agendamentos para uma data específica
  fetchAppointmentsByDate: async (date) => {
    set({ loading: true, error: null });
    try {
      const dateStr = date.toISOString().split("T")[0];
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("date", "==", dateStr),
        orderBy("time")
      );

      const querySnapshot = await getDocs(q);

      const appointments = [];
      querySnapshot.forEach((doc) => {
        appointments.push({ id: doc.id, ...doc.data() });
      });

      const allSlots = generateTimeSlots("08:00", "16:00", 30);

      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const isToday = dateStr === todayStr;

      const availableSlots = allSlots.map((slot) => {
        const [hour, minute] = slot.split(":").map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        const after20h = now.getHours() >= 20;
        const isAfter20hToday = isToday && after20h;
        const isPastSlotToday = isToday && (slotTime <= now || hour >= 20);
        const hasAppointment = appointments.some(
          (app) => app.time === slot && app.status !== "cancelado"
        );

        const isSlotUnavailable =
          (isToday && isAfter20hToday) ||
          (isToday && isPastSlotToday) ||
          (!isToday && hasAppointment) ||
          (isToday && hasAppointment);

        return {
          time: slot,
          isBooked: isSlotUnavailable,
        };
      });

      set({
        appointments,
        availableSlots,
        loading: false,
        selectedDate: date,
      });
    } catch (error) {
      console.error("Erro ao buscar agendamentos por data:", error);
      set({ error: error.message, loading: false });
    }
  },

  // Cria um novo agendamento
  createAppointment: async (appointmentData) => {
    set({ loading: true, error: null });
    try {
      const appointmentsRef = collection(db, "appointments");
      const docRef = await addDoc(appointmentsRef, {
        ...appointmentData,
        status: "agendado",
        createdAt: new Date().toISOString(),
      });

      const newAppointment = {
        id: docRef.id,
        ...appointmentData,
        status: "agendado",
        createdAt: new Date().toISOString(),
      };

      // Emite evento para outros clientes
      socket.emit("appointment-created", newAppointment);

      // Atualiza localmente o slot como agendado imediatamente
      const selectedDateStr = newAppointment.date;
      const selectedDate = get().selectedDate;
      const selectedDateLocalStr = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : "";

      if (selectedDateStr === selectedDateLocalStr) {
        const updatedSlots = get().availableSlots.map((slot) => {
          if (slot.time === newAppointment.time) {
            return { ...slot, isBooked: true };
          }
          return slot;
        });

        set({
          availableSlots: updatedSlots,
        });
      }

      // Atualiza o estado de agendamentos
      set((state) => ({
        appointments: [...state.appointments, newAppointment],
        loading: false,
      }));

      return newAppointment;
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAppointment: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, {
        ...data,
        updatedAt: new Date().toISOString(),
      });

      const updatedAppointment = {
        id,
        ...data,
        updatedAt: new Date().toISOString(),
      };

      socket.emit("appointment-updated", updatedAppointment);

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, ...updatedAppointment }
            : appointment
        ),
        loading: false,
      }));

      return updatedAppointment;
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteAppointment: async (id) => {
    set({ loading: true, error: null });
    try {
      const appointmentRef = doc(db, "appointments", id);
      await deleteDoc(appointmentRef);

      socket.emit("appointment-deleted", id);

      set((state) => ({
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== id
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, {
        status,
        updatedAt: new Date().toISOString(),
      });

      const updatedAppointment = {
        id,
        status,
        updatedAt: new Date().toISOString(),
      };

      socket.emit("appointment-status-updated", updatedAppointment);

      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status }
            : appointment
        ),
        loading: false,
      }));
    } catch (error) {
      console.error("Erro ao atualizar status do agendamento:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedTime: (time) => set({ selectedTime: time }),

  // Escuta eventos socket
  setupSocketListeners: () => {
    socket.on("appointment-created", (appointment) => {
      const state = get();

      const selectedStr = state.selectedDate
        ? state.selectedDate.toISOString().split("T")[0]
        : null;

      if (appointment.date === selectedStr) {
        const updatedSlots = state.availableSlots.map((slot) => {
          if (slot.time === appointment.time) {
            return { ...slot, isBooked: true };
          }
          return slot;
        });

        set({
          appointments: [...state.appointments, appointment],
          availableSlots: updatedSlots,
        });
      } else {
        set({
          appointments: [...state.appointments, appointment],
        });
      }
    });

    socket.on("appointment-updated", (updatedAppointment) => {
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? { ...appointment, ...updatedAppointment }
            : appointment
        ),
      }));
    });

    socket.on("appointment-deleted", (id) => {
      set((state) => ({
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== id
        ),
      }));
    });

    socket.on("appointment-status-updated", ({ id, status }) => {
      set((state) => ({
        appointments: state.appointments.map((appointment) =>
          appointment.id === id ? { ...appointment, status } : appointment
        ),
      }));
    });
  },

  cleanupSocketListeners: () => {
    socket.off("appointment-created");
    socket.off("appointment-updated");
    socket.off("appointment-deleted");
    socket.off("appointment-status-updated");
  },
}));

export default useAppointmentStore;
