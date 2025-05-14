// src/hooks/useSettings.js
import { useState, useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Configurações padrão como fallback
        const defaultSettings = {
          shopName: "BarberShop",
          address: "Rua da Barbearia, 123",
          hours: "Seg-Sáb: 8h às 20h",
          phone: "(00) 12345-6789",
          logo: "✂️"
        };

        // Listener em tempo real
        const unsubscribe = onSnapshot(
          doc(db, "settings", "homepage"),
          (doc) => {
            if (doc.exists()) {
              setSettings({ ...defaultSettings, ...doc.data() });
            } else {
              setSettings(defaultSettings);
            }
            setLoading(false);
          },
          (err) => {
            console.error("Error listening to settings:", err);
            setSettings(defaultSettings);
            setError(err);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};