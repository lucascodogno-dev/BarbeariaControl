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
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import socket from "../services/socket";
import { generateTimeSlots, isPastTime, isTimeBetween } from "../utils/date";

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
 // Atualize a função fetchAppointmentsByDate
fetchAppointmentsByDate: async (date) => {
  set({ loading: true, error: null });
  try {
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = dayNames[dayOfWeek];

    // Busca os horários de funcionamento
    const scheduleRef = doc(db, "businessHours", dayKey);
    const scheduleSnapshot = await getDoc(scheduleRef);
    const businessHours = scheduleSnapshot.exists() ? scheduleSnapshot.data() : null;

    if (!businessHours || businessHours.isClosed) {
      console.warn(`[Agendamento] Dia fechado (${dayKey}).`);
      set({
        appointments: [],
        availableSlots: [],
        loading: false,
        selectedDate: date
      });
      return;
    }

    // Verificação defensiva de horários válidos
    if (!businessHours.openingTime || !businessHours.closingTime) {
      console.error(`[Agendamento] Horários inválidos para ${dayKey}:`, businessHours);
      set({
        appointments: [],
        availableSlots: [],
        loading: false,
        selectedDate: date
      });
      return;
    }

    // Busca os agendamentos do dia
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

    // Gera todos os horários possíveis
    const allSlots = generateTimeSlots(
      businessHours.openingTime,
      businessHours.closingTime,
      businessHours.slotDuration || 30
    );

    // Remove horário de almoço
    let filteredSlots = allSlots;
    if (
      businessHours.hasLunchBreak &&
      businessHours.lunchStart &&
      businessHours.lunchEnd
    ) {
      filteredSlots = allSlots.filter(
        (slot) => !isTimeBetween(slot, businessHours.lunchStart, businessHours.lunchEnd)
      );
    }

    // Elimina horários já passados (somente se for hoje)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const isToday = dateStr === todayStr;

    const availableSlots = filteredSlots.map((slot) => {
      const [hour, minute] = slot.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hour, minute, 0, 0);

      const isPastSlotToday = isToday && (slotTime <= now);
      const hasAppointment = appointments.some(
        (app) => app.time === slot && app.status !== "cancelado"
      );

      return {
        time: slot,
        isBooked: isPastSlotToday || hasAppointment,
      };
    });

    set({
      appointments,
      availableSlots,
      loading: false,
      selectedDate: date,
    });

    console.log(`[Agendamento] Horários carregados para ${dayKey}:`, availableSlots);
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
  const dayMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

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

  // 🚨 NOVO: escuta alterações no schedule (businessHours)
  socket.on("schedule-updated", ({ day }) => {
    const selectedDate = get().selectedDate;
    if (!selectedDate) return;

    const selectedDayKey = dayMap[selectedDate.getDay()];
    if (selectedDayKey === day) {
      get().fetchAppointmentsByDate(selectedDate); // Recarrega os horários
    }
  });
},

  cleanupSocketListeners: () => {
    socket.off("appointment-created");
    socket.off("appointment-updated");
    socket.off("appointment-deleted");
    socket.off("appointment-status-updated");
    socket.off("schedule-updated");
  },
}));

export default useAppointmentStore;
