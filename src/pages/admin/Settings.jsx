import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import useAuthStore from '../../store/authStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';
import { Navigate } from 'react-router-dom';
import { 
  FiSave, 
  FiMapPin, 
  FiClock, 
  FiEdit3, 
  FiCheck, 
  FiInfo, 
  FiImage, 
  FiAlertCircle, 
  FiRefreshCw
} from 'react-icons/fi';

// Configurações padrão
const DEFAULT_SETTINGS = {
  // Informações da barbearia
  shopName: "BarberShop",
  address: "Rua da Barbearia, 123",
  hours: "Segunda a Sábado: 8h às 20h",
  phone: "(00) 12345-6789",
  
  // Textos da página inicial
  heroTitle: "Agende seu horário na barbearia com facilidade",
  heroDescription: "Cortes modernos, ambiente agradável e atendimento de qualidade. Agende seu horário em poucos cliques.",
  
  // Seção sobre nós
  aboutTitle: "Excelência em barbearia desde 2015",
  aboutDescription: "Nossa barbearia oferece serviços de alta qualidade em um ambiente descontraído e profissional. Nossos barbeiros são altamente qualificados e estão sempre atualizados com as últimas tendências.",
  aboutSecondaryDescription: "Buscamos proporcionar a melhor experiência possível para nossos clientes, com atendimento personalizado e resultados que superam as expectativas.",
  
  // Recursos destacados
  features: [
    "Profissionais experientes",
    "Ambiente aconchegante e moderno",
    "Produtos de alta qualidade"
  ],
  
  // CTA 
  ctaTitle: "Pronto para um novo visual?",
  ctaDescription: "Agende seu horário agora mesmo e experimente nossos serviços. Transformamos seu visual com qualidade e profissionalismo."
};

const SettingsPage = () => {
  const { isAdmin, loading } = useAuthStore();
  const { showAlert } = useUiStore();
  
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [features, setFeatures] = useState(DEFAULT_SETTINGS.features.join('\n'));
  const [hasChanges, setHasChanges] = useState(false);
  
  // Busca as configurações existentes
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);
        const settingsDoc = await getDoc(doc(db, "settings", "homepage"));
        
        if (settingsDoc.exists()) {
          const settingsData = settingsDoc.data();
          setSettings(settingsData);
          
          if (settingsData.features && Array.isArray(settingsData.features)) {
            setFeatures(settingsData.features.join('\n'));
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        showAlert("Erro ao carregar configurações. Tente novamente.", "error");
      } finally {
        setLoadingSettings(false);
      }
    };
    
    fetchSettings();
  }, [showAlert]);
  
  // Manipulador para alterações nos campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setHasChanges(true);
  };
  
  // Manipulador para alterações no campo de recursos
  const handleFeaturesChange = (e) => {
    setFeatures(e.target.value);
    setHasChanges(true);
  };
  
  // Salva as configurações no Firebase
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Processa os recursos (split nas quebras de linha e remove linhas vazias)
      const featuresArray = features
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      // Prepara os dados para salvar
      const settingsData = {
        ...settings,
        features: featuresArray,
        updatedAt: new Date().toISOString()
      };
      
      // Salva no Firestore
      await setDoc(doc(db, "settings", "homepage"), settingsData);
      
      // Emite evento via Socket.io para atualizar os clientes
      socket.emit("settings-updated", { type: "homepage", data: settingsData });
      
      showAlert("Configurações salvas com sucesso!", "success");
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      showAlert("Erro ao salvar configurações. Tente novamente.", "error");
    } finally {
      setSaving(false);
    }
  };
  
  // Resetar para os valores padrão
  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja redefinir todas as configurações para os valores padrão? Esta ação não pode ser desfeita.")) {
      setSettings(DEFAULT_SETTINGS);
      setFeatures(DEFAULT_SETTINGS.features.join('\n'));
      setHasChanges(true);
    }
  };
  
  // Se estiver carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Se não for admin, redireciona para a página de login
  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }
  
  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configurações
        </h1>
        
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            disabled={saving || loadingSettings}
          >
            <FiRefreshCw className="mr-2" size={16} />
            Redefinir
          </button>
          
          <button
            onClick={handleSave}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              hasChanges
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed'
            }`}
            disabled={!hasChanges || saving || loadingSettings}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="mr-2" size={16} />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
      
      {loadingSettings ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Informações da Barbearia */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <FiInfo className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Informações da Barbearia
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nome da Barbearia
                </label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={settings.shopName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Endereço
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horário de Funcionamento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiClock className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="text"
                    id="hours"
                    name="hours"
                    value={settings.hours}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telefone para Contato
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Banner principal */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <FiImage className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Banner Principal
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título Principal
                </label>
                <input
                  type="text"
                  id="heroTitle"
                  name="heroTitle"
                  value={settings.heroTitle}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição Principal
                </label>
                <textarea
                  id="heroDescription"
                  name="heroDescription"
                  value={settings.heroDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FiAlertCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      Pré-visualização
                    </h3>
                    <div className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                      <p className="font-bold text-lg">{settings.heroTitle}</p>
                      <p className="text-indigo-500 dark:text-indigo-300">{settings.heroDescription}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Seção Sobre Nós */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <FiEdit3 className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Seção "Sobre Nós"
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título da Seção
                </label>
                <input
                  type="text"
                  id="aboutTitle"
                  name="aboutTitle"
                  value={settings.aboutTitle}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="aboutDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição Principal
                </label>
                <textarea
                  id="aboutDescription"
                  name="aboutDescription"
                  value={settings.aboutDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="aboutSecondaryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição Secundária
                </label>
                <textarea
                  id="aboutSecondaryDescription"
                  name="aboutSecondaryDescription"
                  value={settings.aboutSecondaryDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recursos Destacados (um por linha)
                </label>
                <textarea
                  id="features"
                  name="features"
                  value={features}
                  onChange={handleFeaturesChange}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-750 p-4 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FiCheck className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recursos que serão exibidos:
                    </h3>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <ul className="space-y-1">
                        {features
                          .split('\n')
                          .map(line => line.trim())
                          .filter(line => line.length > 0)
                          .map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <FiCheck className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chamada para Ação (CTA) */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <FiAlertCircle className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Chamada para Ação (CTA)
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="ctaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Título do CTA
                </label>
                <input
                  type="text"
                  id="ctaTitle"
                  name="ctaTitle"
                  value={settings.ctaTitle}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="ctaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição do CTA
                </label>
                <textarea
                  id="ctaDescription"
                  name="ctaDescription"
                  value={settings.ctaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              
              <div className="bg-indigo-600 p-4 rounded-lg text-white">
                <h3 className="font-bold">{settings.ctaTitle}</h3>
                <p className="text-indigo-200 text-sm">{settings.ctaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Botão flutuante para salvar (aparece quando há alterações) */}
      {hasChanges && (
        <div className="fixed bottom-6 right-6 z-10 animate-fade-in">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition-colors"
            disabled={saving}
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <FiSave className="mr-2" size={16} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;