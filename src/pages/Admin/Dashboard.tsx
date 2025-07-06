import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Calendar, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatsCard from '../../components/Common/StatsCard';
import { Stats } from '../../types';
import { apiService } from '../../services/api';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    totalUsers: 0,
    activeLoans: 0,
    pendingReservations: 0,
    overdueLoans: 0,
    totalPenalties: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pretsParMois, setPretsParMois] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitesData, pretsData] = await Promise.all([
        apiService.getStats(),
        apiService.getActivitesRecentes(),
        apiService.getPretsParMois()
      ]);
      
      setStats(statsData);
      setRecentActivities(activitesData);
      setPretsParMois(pretsData);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Total des Livres"
          value={stats.totalBooks}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Utilisateurs Actifs"
          value={stats.totalUsers}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Prêts Actifs"
          value={stats.activeLoans}
          icon={Calendar}
          color="yellow"
        />
        <StatsCard
          title="Réservations en Attente"
          value={stats.pendingReservations}
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Prêts en Retard"
          value={stats.overdueLoans}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Pénalités (€)"
          value={typeof stats.totalPenalties === 'number' ? stats.totalPenalties.toFixed(2) : stats.totalPenalties}
          icon={TrendingUp}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activités Récentes</h3>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune activité récente</p>
            ) : (
              recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">Il y a {activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Prêts par Mois</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {pretsParMois.length > 0 ? (
              pretsParMois.map((mois: any, index: number) => (
                <div key={index} className="flex-1 bg-blue-200 rounded-t relative" style={{ height: `${mois.pourcentage}%` }}>
                  <div className="w-full bg-blue-600 rounded-t" style={{ height: '100%' }}></div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                    {mois.count}
                  </div>
                </div>
              ))
            ) : (
              // Fallback si pas de données
              [65, 78, 90, 85, 92, 88, 95, 102, 88, 76, 89, 94].map((value, index) => (
                <div key={index} className="flex-1 bg-blue-200 rounded-t" style={{ height: `${value}%` }}>
                  <div className="w-full bg-blue-600 rounded-t" style={{ height: '60%' }}></div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jan</span>
            <span>Fév</span>
            <span>Mar</span>
            <span>Avr</span>
            <span>Mai</span>
            <span>Juin</span>
            <span>Juil</span>
            <span>Aoû</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Déc</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;