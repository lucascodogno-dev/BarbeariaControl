import React, { useEffect, useState } from 'react';
import useAppointmentStore from '../../store/appointmentStore';
import useServiceStore from '../../store/serviceStore';
import useUiStore from '../../store/uiStore';
import socket from '../../services/socket';
import { formatDateToBR } from '../../utils/date';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  FiUsers,
  FiDollarSign,
  FiCalendar,
  FiActivity,
  FiTrendingUp,
  FiPieChart,
  FiScissors,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
} from 'react-icons/fi';

// Cores para gráficos
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

// Componente de cartão de estatísticas
const StatCard = ({ title, value, icon, trend, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    amber: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6 h-full">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colors[color]} mr-4`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {title}
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          {trend && (
            <div className={`text-xs mt-1 flex items-center ${trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs. período anterior</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente de gráfico de receita
const RevenueChart = ({ data, period = 'daily' }) => {
  // Formatador de valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  // Componente personalizado para o tooltip do gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md">
          <p className="font-medium text-gray-900 dark:text-white mb-1">{formatDateToBR(label)}</p>
          <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" strokeOpacity={0.5} />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDateToBR}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="revenue" 
            fill="#4F46E5"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente de gráfico de distribuição de serviços
const ServiceDistributionChart = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [value, name]}
            contentStyle={{
              backgroundColor: '#FFF',
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Componente principal do Dashboard
const Dashboard = () => {
  const { appointments, fetchAppointments } = useAppointmentStore();
  const { services, fetchServices } = useServiceStore();
  const { showAlert } = useUiStore();
  
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalRevenue: 0,
    activeAppointments: 0,
    cancellationRate: 0,
  });
  
  const [revenueData, setRevenueData] = useState([]);
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly'); // daily, weekly, monthly
  
  // Busca os dados necessários ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchAppointments(),
          fetchServices()
        ]);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        showAlert('Erro ao carregar dados do dashboard. Tente novamente.', 'error');
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Configura listeners de socket para atualizações em tempo real
    socket.on('appointment-created', fetchAppointments);
    socket.on('appointment-updated', fetchAppointments);
    socket.on('appointment-deleted', fetchAppointments);
    socket.on('appointment-status-updated', fetchAppointments);
    socket.on('service-created', fetchServices);
    socket.on('service-updated', fetchServices);
    socket.on('service-deleted', fetchServices);
    
    return () => {
      socket.off('appointment-created', fetchAppointments);
      socket.off('appointment-updated', fetchAppointments);
      socket.off('appointment-deleted', fetchAppointments);
      socket.off('appointment-status-updated', fetchAppointments);
      socket.off('service-created', fetchServices);
      socket.off('service-updated', fetchServices);
      socket.off('service-deleted', fetchServices);
    };
  }, [fetchAppointments, fetchServices, showAlert]);
  
  // Processa os dados para as estatísticas e gráficos
  useEffect(() => {
    if (appointments.length === 0 || services.length === 0) return;
    
    // Mapeamento de serviços por ID para acesso rápido
    const serviceMap = services.reduce((acc, service) => {
      acc[service.id] = service;
      return acc;
    }, {});
    
    // Calcula estatísticas gerais
    const totalAppointments = appointments.length;
    const activeAppointments = appointments.filter(app => app.status === 'agendado').length;
    const canceledAppointments = appointments.filter(app => app.status === 'cancelado').length;
    const cancellationRate = totalAppointments > 0 
      ? Math.round((canceledAppointments / totalAppointments) * 100) 
      : 0;
    
    // Calcula receita total
    let totalRevenue = 0;
    
    // Agrupa serviços por tipo para distribuição
    const serviceCountMap = {};
    
    // Agrupa receita por data
    const revenueByDate = {};
    
    // Processa cada agendamento
    appointments.forEach(appointment => {
      // Pula agendamentos cancelados para cálculo de receita
      if (appointment.status !== 'cancelado') {
        const revenue = appointment.servicePrice || 
          (serviceMap[appointment.serviceId]?.price || 0);
        
        totalRevenue += revenue;
        
        // Agrupa por data para o gráfico de receita
        if (!revenueByDate[appointment.date]) {
          revenueByDate[appointment.date] = 0;
        }
        revenueByDate[appointment.date] += revenue;
      }
      
      // Conta serviços para o gráfico de distribuição
      const serviceId = appointment.serviceId;
      if (serviceId) {
        if (!serviceCountMap[serviceId]) {
          serviceCountMap[serviceId] = 0;
        }
        serviceCountMap[serviceId] += 1;
      }
    });
    
    // Formata dados para o gráfico de receita
    const revenueChartData = Object.keys(revenueByDate)
      .sort()
      .map(date => ({
        date,
        revenue: revenueByDate[date]
      }));
    
    // Formata dados para o gráfico de distribuição de serviços
    const serviceDistributionData = Object.keys(serviceCountMap).map(serviceId => {
      const service = serviceMap[serviceId];
      return {
        name: service?.name || 'Desconhecido',
        value: serviceCountMap[serviceId]
      };
    });
    
    // Atualiza os estados
    setStats({
      totalAppointments,
      totalRevenue,
      activeAppointments,
      cancellationRate
    });
    
    setRevenueData(revenueChartData);
    setServiceDistribution(serviceDistributionData);
  }, [appointments, services]);
  
  // Formata valores monetários
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Atualiza dados ao mudar o período
  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    // Aqui poderia filtrar os dados por período, se necessário
  };
  
  // Renderiza skeleton loader durante o carregamento
  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        
        <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Agendamentos"
          value={stats.totalAppointments}
          icon={<FiCalendar size={24} />}
          trend={{ direction: 'up', value: 12 }}
          color="indigo"
        />
        
        <StatCard
          title="Receita Total"
          value={formatCurrency(stats.totalRevenue)}
          icon={<FiDollarSign size={24} />}
          trend={{ direction: 'up', value: 8 }}
          color="green"
        />
        
        <StatCard
          title="Agendamentos Ativos"
          value={stats.activeAppointments}
          icon={<FiUsers size={24} />}
          color="amber"
        />
        
        <StatCard
          title="Taxa de Cancelamento"
          value={`${stats.cancellationRate}%`}
          icon={<FiActivity size={24} />}
          trend={stats.cancellationRate > 10 ? { direction: 'up', value: 3 } : { direction: 'down', value: 2 }}
          color={stats.cancellationRate > 15 ? "red" : "green"}
        />
      </div>
      
      {/* Gráfico de Receita */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FiTrendingUp className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Receita
            </h3>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => handlePeriodChange('daily')}
              className={`px-3 py-1 text-xs rounded-full ${
                period === 'daily'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => handlePeriodChange('weekly')}
              className={`px-3 py-1 text-xs rounded-full ${
                period === 'weekly'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => handlePeriodChange('monthly')}
              className={`px-3 py-1 text-xs rounded-full ${
                period === 'monthly'
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>
        
        {revenueData.length > 0 ? (
          <RevenueChart data={revenueData} period={period} />
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="text-gray-400 dark:text-gray-500 mb-3">
                <FiAlertCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                Sem dados de receita
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Não há dados de receita disponíveis para o período selecionado.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Gráficos de análise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Serviços */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center mb-6">
            <FiPieChart className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Distribuição de Serviços
            </h3>
          </div>
          
          {serviceDistribution.length > 0 ? (
            <ServiceDistributionChart data={serviceDistribution} />
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <FiScissors size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Sem dados de serviços
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Nenhum serviço foi agendado ainda.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Agendamentos Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FiClock className="text-indigo-500 dark:text-indigo-400 mr-2" size={20} />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Agendamentos Recentes
              </h3>
            </div>
            
            <button
              onClick={fetchAppointments}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Atualizar"
            >
              <FiRefreshCw size={16} />
            </button>
          </div>
          
          {appointments.length > 0 ? (
            <div className="space-y-4 max-h-[calc(80vh-12rem)] overflow-y-auto pr-2">
              {appointments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map(appointment => (
                  <div 
                    key={appointment.id}
                    className="border border-gray-100 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {appointment.clientName}
                        </h4>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {appointment.serviceName || 'Serviço desconhecido'} - {formatCurrency(appointment.servicePrice)}
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <FiCalendar size={14} className="mr-1 text-gray-400 dark:text-gray-500" />
                          <span>{formatDateToBR(appointment.date)} às {appointment.time}</span>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'agendado'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : appointment.status === 'cancelado'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      }`}>
                        {appointment.status === 'agendado' ? 'Agendado' : 
                         appointment.status === 'cancelado' ? 'Cancelado' : 
                         appointment.status === 'concluido' ? 'Concluído' : 
                         appointment.status}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-3">
                  <FiCalendar size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  Nenhum agendamento
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Não há agendamentos recentes para exibir.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;