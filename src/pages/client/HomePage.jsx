
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import socket from "../../services/socket";
import {
  FiCalendar,
  FiClock,
  FiScissors,
  FiChevronRight,
  FiUser,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import useServiceStore from "../../store/serviceStore";
import { cleanExpiredBookings, getBookings } from "../../utils/localStorage";
import { formatDateToBR } from "../../utils/date";
import { FaMapSigns } from "react-icons/fa";

// Configurações padrão para a página inicial
const DEFAULT_SETTINGS = {
  // Informações da barbearia
  shopName: "BarberShop",
  address: "Rua da Barbearia, 123",
  hours: "Segunda a Sábado: 8h às 20h",
  phone: "(00) 12345-6789",

  // Textos da página inicial
  heroTitle: "Agende seu horário na barbearia com facilidade",
  heroDescription:
    "Cortes modernos, ambiente agradável e atendimento de qualidade. Agende seu horário em poucos cliques.",

  // Seção sobre nós
  aboutTitle: "Excelência em barbearia desde 2015",
  aboutDescription:
    "Nossa barbearia oferece serviços de alta qualidade em um ambiente descontraído e profissional. Nossos barbeiros são altamente qualificados e estão sempre atualizados com as últimas tendências.",
  aboutSecondaryDescription:
    "Buscamos proporcionar a melhor experiência possível para nossos clientes, com atendimento personalizado e resultados que superam as expectativas.",

  // Recursos destacados
  features: [
    "Profissionais experientes",
    "Ambiente aconchegante e moderno",
    "Produtos de alta qualidade",
  ],

  // CTA
  ctaTitle: "Pronto para um novo visual?",
  ctaDescription:
    "Agende seu horário agora mesmo e experimente nossos serviços. Transformamos seu visual com qualidade e profissionalismo.",
};

const HomePage = () => {
  const { services, fetchServices, loading } = useServiceStore();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Carrega as configurações e serviços quando a página monta
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoadingSettings(true);
        const settingsDoc = await getDoc(doc(db, "settings", "homepage"));

        if (settingsDoc.exists()) {
          setSettings(settingsDoc.data());
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
    fetchServices();

    // Limpa agendamentos expirados no localStorage
    cleanExpiredBookings();

    // Configura o listener para atualizações em tempo real das configurações
    socket.on("settings-updated", (data) => {
      if (data.type === "homepage") {
        setSettings(data.data);
      }
    });

    // Limpa o listener quando o componente desmonta
    return () => {
      socket.off("settings-updated");
    };
  }, [fetchServices]);

  // Obtém os agendamentos futuros do localStorage
  const upcomingBookings = getBookings(false, true).slice(0, 2);
  const handleAddressClick = () => {
    if (!settings?.address) return;

    // Codifica o endereço para URL
    const encodedAddress = encodeURIComponent(settings.address);

    // Abre o Google Maps
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      "_blank"
    );
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {settings.heroTitle}
          </h1>
          <p className="text-lg text-indigo-100 mb-8">
            {settings.heroDescription}
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium shadow-lg hover:bg-indigo-50 transition-colors"
          >
            <FiCalendar className="mr-2" />
            Agendar Agora
          </Link>
        </div>
      </div>

      {/* Próximos Agendamentos */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Seus próximos agendamentos
          </h2>
          <Link
            to="/profile"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center text-sm font-medium"
          >
            Ver todos <FiChevronRight className="ml-1" />
          </Link>
        </div>

        {upcomingBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <FiScissors size={24} />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                      {booking.serviceName}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" size={14} />
                        {formatDateToBR(booking.date)}
                      </div>
                      <div className="hidden sm:block text-gray-300 dark:text-gray-600">
                        •
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        {booking.time}
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Confirmado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl text-gray-300 dark:text-gray-600 mb-3">
              <FiCalendar className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum agendamento futuro
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
              Você não tem nenhum agendamento marcado. Que tal agendar um corte
              agora?
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <FiCalendar className="mr-2" size={16} />
              Agendar
            </Link>
          </div>
        )}
      </section>

      {/* Nossos Serviços */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Nossos serviços
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col h-full"
              >
                <div className="bg-indigo-600 h-2"></div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <FiScissors size={22} />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm flex-1">
                    {service.description ||
                      "Um serviço de qualidade para você ficar com o visual impecável."}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FiClock className="mr-1" />
                      {service.duration || 30} min
                    </div>
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      R$ {service.price.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <FiCalendar className="mr-2" />
            Agendar um serviço
          </Link>
        </div>
      </section>

      {/* Sobre Nós */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sobre nós
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {settings.aboutTitle}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {settings.aboutDescription}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {settings.aboutSecondaryDescription}
              </p>
              <div className="space-y-2">
                {settings.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 h-5 w-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                      <FiCheck size={12} />
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="text-5xl mb-4 text-indigo-600 dark:text-indigo-400">
                  ✂️
                </div>
                {/* <div className="text-gray-500 dark:text-gray-400 text-sm"> */}
                <button
                  onClick={handleAddressClick}
                  className="flex items-center mb-2 md:mb-0 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                 
                >
                  
                  <img
                   style={{marginRight: '10px'}}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAE0UlEQVR4nKWU21MTZxjGc9eZ3vVPsHeCp4teOUAggByklCkolUM4Gg4hhAQMIlid3vTCix4sJ0GspTIdRTslCYSod56nIiR4yKYQJGR3wylkQzEgmafzfcnGjdBxpt2Z927n+f32/Z5vZbL/+HjOqT5erlR2LH517Bl/LG+Dz8/b4AvyJpZKT5xmMjM/kv2fhysp2eM9nv+Cz80Gn5MFLicTXPYRcFnpdPi8nGlfdfUe+vK5u98Unb1z3nv27nl03P0a7XfO4sydDrTdbker9QxarW0wjJ9Gy3grWiwGGMwtmFYVgv/iKPjPI4CjGeCyIoCMVHDpCrA5mTb6JW3Wdq/B2oZTJMRiQLPFAP1YC3SjzWga1UNr1kFjboLGpIXa1IjBC1XEELvaZ6aBO6IAl54CNi0ZfHa6TmaQGJLwzkc9GLbfQtejHjSNNqORhJub0GBqhNqowcTJghj7Fwo5jAcPwnjgAKblCdSeAlLlYFPkj2VS+4euR3DyToy/suKZexJnbnfE2NcbNZgvyI2xNx46hOF9+zAcF4eR+PjwetKSwSrk8KQkBmSifdfjXhreMm6g69GO6nfY1xNAfk7M7on9cHw8buzdiz/i4t7ZK5KwkJL4t0y0v2n/HVbHbejGWuju19fX6dy036L2BFBnbMCfVV9SgLj75ylJGNm/n9o/TzwctaeA5IQnMrEdnQ+76ReQcyD2BMRwDL6//2PUvm5EjZvthevR5mRLmiMeLrUn+0/EfPLhbylAbM6D2YcUYnFYwfAM7s3cj7FvMDbw7ntFXi5XbM4RSXMUMfae5IQtR8Jnn8qIvd5yKlrNiw86cX3qBn64fzG8e1P4cEk4y5R7Qq5irF7I/aD9bNLh7+hFi/Y+snvS+0ZJc9RGDTQmTTh8rgQhVxHevjwB9njGNrUXLxaxjxzuXE4mbAkJn1CA1F4ruViivdak5VmmIhJejJDrBIIzddyrS90r/2Y/3duN6H8lxl6spklLAVqzlmedJLwUov32vIb3ry3Zpu32hdla1Q77mQolJp4+fQ+wi32TuYlnnVWS8GK8fV2/HBB8c4FAAIIgcM8tY142Iy16uAupckyOjOCpFLCbvc6s41mmig3NKSECVhya5VXfko2EiyMIgmfmtGFdtHe0GTAxMfEe4L2fmm6UhFdHwpU03MeoVzSDW66269vcmj+wIIWs2u2LnlQ5PIokTFosNDwGILWn4U4SXhYJL8Ua07CqGdx0qa4AJ68Arb/thLBlJVtzxYWbov1OgFlH1uJlnSo2NFceCVdizaFebRwMump+DodXD4THMLTNra0JUYi3rxferp/8NpvNvQNA7PWjei/rrGFDrysg2gvOWr/+WtBJwkV7El51Gai8DDQTiD/glpwH/H4/Ozk5SSHvWhQTHrYXnHVC89AbpvYqINqLABJOprwf0F/bZgmEhEvGMzU1NR8F8EwNF3pdCdFecNb79UMb0XDVLvYV/UB5H6DsEyHCghTi9/vdUcDWbAUn2gf+qhNODW046q4CH7IviwBKLwHaX2MhPp/v3Rf4Xpbkv2GUrO9lTaD5l1WmdmATqsvhqe7fRHXfJir7NlFxKYjy3iDKeoJQ9gRR2h1ESVcQRZ3hUQ9ssN7FpYXFxUW32+0+KgL+AYEDsusQSqyqAAAAAElFTkSuQmCC"
                    alt="external-Google-Maps-logos-and-brands-those-icons-flat-those-icons"
                  />
                  {/* <FaMapSigns className="mr-1" size={14} /> */}
                  {settings?.address || "Endereço não disponível"}
                </button>

                {/* </div> */}
                {/* <div className="mt-4 font-medium text-gray-900 dark:text-white text-lg">
                  {settings.address}
                </div> */}
                <div className="text-gray-500 dark:text-gray-400">
                  {settings.hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="bg-indigo-600 rounded-lg shadow-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">{settings.ctaTitle}</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            {settings.ctaDescription}
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium shadow-lg hover:bg-indigo-50 transition-colors"
          >
            <FiCalendar className="mr-2" />
            Agendar Agora
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
