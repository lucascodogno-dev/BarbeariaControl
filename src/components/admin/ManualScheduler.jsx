import React, { useEffect, useState } from "react";
import useAppointmentStore from "../../store/appointmentStore";
import useBlockedSlotStore from "../../store/blockedSlotStore";
import TimeSelector from "./TimeSelector";
import { FiPlus, FiLock } from "react-icons/fi";

const ManualScheduler = () => {
  const [mode, setMode] = useState("agendar");
  const [clientName, setClientName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const {
    selectedDate,
    setSelectedDate,
    fetchAppointmentsByDate,
    availableSlots,
    createAppointment,
  } = useAppointmentStore();

  const { fetchBlockedSlots, blockedSlots, addBlockedSlot, removeBlockedSlot } =
    useBlockedSlotStore();

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      fetchAppointmentsByDate(selectedDate);
      fetchBlockedSlots(dateStr);
    }
  }, [selectedDate]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime)
      return alert("Preencha todos os campos obrigatórios.");

    const dateStr = selectedDate.toISOString().split("T")[0];

    const isBlocked = blockedSlots.some((b) => b.time === selectedTime);
    const isUnavailable = availableSlots.some(
      (s) => s.time === selectedTime && s.isBooked
    );

    if (isBlocked) return alert("Esse horário já está bloqueado.");
    if (isUnavailable)
      return alert("Esse horário já está agendado ou indisponível.");

    try {
      if (mode === "agendar") {
        if (!clientName || !serviceName)
          return alert("Preencha cliente e serviço.");

        await createAppointment({
          clientName,
          serviceName,
          date: dateStr,
          time: selectedTime,
        });
        alert("✅ Agendamento criado!");
        setClientName("");
        setServiceName("");
      } else {
        await addBlockedSlot({ date: dateStr, time: selectedTime });
        alert("✅ Horário bloqueado!");
      }

      setSelectedTime("");
    } catch (err) {
      console.error("Erro:", err);
      alert("❌ Erro ao processar ação.");
    }
  };
const handleUnblock = async (id) => {
  try {
    await removeBlockedSlot(id);
    alert("⛔ Horário desbloqueado com sucesso!");
  } catch (err) {
    alert("❌ Erro ao desbloquear horário.");
  }
};

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Agendamento Manual
      </h2>

      <div className="flex gap-2">
        <button
          className={`flex-1 py-2 rounded-lg font-semibold ${
            mode === "agendar"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 dark:bg-gray-700"
          }`}
          onClick={() => setMode("agendar")}
        >
          <FiPlus className="inline mr-2" />
          Criar Agendamento
        </button>
        <button
          className={`flex-1 py-2 rounded-lg font-semibold ${
            mode === "bloquear"
              ? "bg-red-600 text-white"
              : "bg-gray-100 dark:bg-gray-700"
          }`}
          onClick={() => setMode("bloquear")}
        >
          <FiLock className="inline mr-2" />
          Bloquear Horário
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold">Data *</label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
            value={
              selectedDate
                ? `${selectedDate.getFullYear()}-${String(
                    selectedDate.getMonth() + 1
                  ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(
                    2,
                    "0"
                  )}`
                : ""
            }
            onChange={(e) => {
              const [year, month, day] = e.target.value.split("-");
              const selected = new Date(year, month - 1, day, 12); // meio-dia local
              setSelectedDate(selected);
            }}
          />
        </div>

        <TimeSelector
          slots={availableSlots}
          selectedTime={selectedTime}
          onSelect={setSelectedTime}
          label="Horário *"
        />

        {mode === "agendar" && (
          <>
            <input
              type="text"
              placeholder="Nome do cliente"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Serviço"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            />
          </>
        )}
{mode === "bloquear" && blockedSlots.length > 0 && (
  <div className="mt-4 border-t pt-4">
    <h4 className="font-semibold mb-2 text-sm text-gray-700 dark:text-white">Horários bloqueados:</h4>
    <ul className="space-y-1 text-sm text-gray-800 dark:text-gray-300">
      {blockedSlots.map((b) => (
        <li key={b.id} className="flex justify-between items-center">
          <span>{b.time}</span>
          <button
            onClick={() => handleUnblock(b.id)}
            className="text-red-600 hover:underline text-xs"
          >
            Desbloquear
          </button>
        </li>
      ))}
    </ul>
  </div>
)}

        <button
          onClick={handleSubmit}
          className={`w-full py-2 font-semibold rounded-lg text-white ${
            mode === "agendar" ? "bg-indigo-600" : "bg-red-600"
          }`}
        >
          {mode === "agendar" ? "Agendar" : "Bloquear"}
        </button>
      </div>
    </div>
  );
};

export default ManualScheduler;
