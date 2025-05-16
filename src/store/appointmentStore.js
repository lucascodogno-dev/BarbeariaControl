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
import { generateTimeSlots, isTimeBetween } from "../utils/date";

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
  // Dentro de appointmentStore.js
  fetchAppointmentsByDate: async (date) => {
    set({ loading: true, error: null });
    try {
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();
      const dayNames = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const dayKey = dayNames[dayOfWeek];
 
      const scheduleRef = doc(db, "businessHours", dayKey);
      const scheduleSnapshot = await getDoc(scheduleRef);
      const businessHours = scheduleSnapshot.exists()
        ? scheduleSnapshot.data()
        : null;

      if (
        !businessHours ||
        businessHours.isClosed ||
        !businessHours.openingTime ||
        !businessHours.closingTime
      ) {
        set({
          appointments: [],
          availableSlots: [],
          loading: false,
          selectedDate: date,
        });
        return;
      }

      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("date", "==", dateStr),
        orderBy("time")
      );
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 🧱 Busca horários bloqueados
      const blockedRef = collection(db, "blockedSlots");
      const blockedQuery = query(blockedRef, where("date", "==", dateStr));
      const blockedSnapshot = await getDocs(blockedQuery);
      const blockedTimes = blockedSnapshot.docs.map((doc) => doc.data().time);

      const allSlots = generateTimeSlots(
        businessHours.openingTime,
        businessHours.closingTime,
        businessHours.slotDuration || 30
      );

      let filteredSlots = allSlots;
      if (
        businessHours.hasLunchBreak &&
        businessHours.lunchStart &&
        businessHours.lunchEnd
      ) {
        filteredSlots = allSlots.filter(
          (slot) =>
            !isTimeBetween(
              slot,
              businessHours.lunchStart,
              businessHours.lunchEnd
            )
        );
      }

      const now = new Date();
      const isToday = dateStr === now.toISOString().split("T")[0];

      const availableSlots = filteredSlots.map((slot) => {
        const [hour, minute] = slot.split(":").map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        const isPastSlotToday = isToday && slotTime <= now;
        const hasAppointment = appointments.some(
          (app) => app.time === slot && app.status !== "cancelado"
        );
        const isBlocked = blockedTimes.includes(slot);

        return {
          time: slot,
          isBooked: isPastSlotToday || hasAppointment || isBlocked,
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
          appointment.id === id ? { ...appointment, status } : appointment
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
  const get = useAppointmentStore.getState;

  // 📅 Novo agendamento criado
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

  // 🔄 Agendamento atualizado
  socket.on("appointment-updated", (updatedAppointment) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === updatedAppointment.id
          ? { ...appointment, ...updatedAppointment }
          : appointment
      ),
    }));
  });

  // ❌ Agendamento deletado
  socket.on("appointment-deleted", (id) => {
    set((state) => ({
      appointments: state.appointments.filter(
        (appointment) => appointment.id !== id
      ),
    }));
  });

  // 🟡 Status do agendamento alterado
  socket.on("appointment-status-updated", ({ id, status }) => {
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      ),
    }));
  });

  // 🕐 Atualização de horários comerciais
  socket.on("schedule-updated", ({ day }) => {
    const selectedDate = get().selectedDate;
    if (!selectedDate) return;

    const selectedDayKey = dayMap[selectedDate.getDay()];
    if (selectedDayKey === day) {
      get().fetchAppointmentsByDate(selectedDate); // recarrega horários disponíveis
    }
  });

  // ⛔ Bloqueio de horário em tempo real
  socket.on("slot-blocked", (blocked) => {
    const selected = get().selectedDate;
    if (!selected) return;

    const selectedStr = selected.toISOString().split("T")[0];
    if (blocked.date === selectedStr) {
      const updatedSlots = get().availableSlots.map((slot) => {
        if (slot.time === blocked.time) {
          return { ...slot, isBooked: true };
        }
        return slot;
      });

      set({ availableSlots: updatedSlots });
    }
  });

  // ✅ Desbloqueio de horário em tempo real
  socket.on("slot-unblocked", () => {
    const selected = get().selectedDate;
    if (!selected) return;

    // 🔄 Refaz o fetch completo para garantir consistência
    get().fetchAppointmentsByDate(selected);
  });
}
,
  getAvailableSlotsForDate: async (date) => {
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const dayKey = dayNames[dayOfWeek];

    // Get schedule
    const scheduleRef = doc(db, "businessHours", dayKey);
    const scheduleSnap = await getDoc(scheduleRef);
    if (!scheduleSnap.exists() || scheduleSnap.data().isClosed) return [];

    const schedule = scheduleSnap.data();
    const allSlots = generateTimeSlots(
      schedule.openingTime,
      schedule.closingTime,
      schedule.slotDuration || 30
    );

    // filter lunch break
    let filteredSlots = allSlots;
    if (schedule.hasLunchBreak && schedule.lunchStart && schedule.lunchEnd) {
      filteredSlots = allSlots.filter(
        (slot) => !isTimeBetween(slot, schedule.lunchStart, schedule.lunchEnd)
      );
    }

    // appointments
    const q = query(
      collection(db, "appointments"),
      where("date", "==", dateStr)
    );
    const bookedSnapshot = await getDocs(q);
    const bookedTimes = bookedSnapshot.docs.map((doc) => doc.data().time);

    // blocks
    const blocksQuery = query(collection(db, "blockedSlots"));
    const blocksSnapshot = await getDocs(blocksQuery);
    const blockedTimes = blocksSnapshot.docs
      .filter((doc) => {
        const d = doc.data();
        return d.date === dateStr || (d.repeatWeekly && d.weekday === dayKey);
      })
      .map((doc) => doc.data().time);

    // build final list
    return filteredSlots.filter(
      (slot) => !bookedTimes.includes(slot) && !blockedTimes.includes(slot)
    );
  },

  cleanupSocketListeners: () => {
    socket.off("appointment-created");
    socket.off("appointment-updated");
    socket.off("appointment-deleted");
    socket.off("appointment-status-updated");
    socket.off("schedule-updated");
    socket.emit("slot-unblocked");
    socket.emit("slot-blocked");
  },
}));

export default useAppointmentStore;
