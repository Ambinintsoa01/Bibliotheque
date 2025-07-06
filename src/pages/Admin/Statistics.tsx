import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';
import StatsCard from '../../components/Common/StatsCard';
import { apiService } from '../../services/api';

const Statistics: React.FC = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [generalStats, setGeneralStats] = useState({
    totalLoans: 0,
    returnRate: 0,
    mostPopularBookLoans: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDetailedStatistics();
      
      setMonthlyData(data.monthlyData || []);
      setTopBooks(data.topBooks || []);
      setUserStats(data.userStats || []);
      setGeneralStats({
        totalLoans: data.totalLoans || 0,
        returnRate: data.returnRate || 0,
        mostPopularBookLoans: data.mostPopularBookLoans || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Derniers 6 mois</option>
          <option>Dernière année</option>
          <option>Tout</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Prêts Mensuels"
          value={generalStats.totalLoans.toString()}
          icon={Calendar}
          color="blue"
        />
        <StatsCard
          title="Nouveaux Utilisateurs"
          value={monthlyData.length > 0 ? monthlyData[monthlyData.length - 1]?.newUsers?.toString() || "0" : "0"}
          icon={Users}
          color="green"
        />
        <StatsCard
          title="Taux de Retour"
          value={`${generalStats.returnRate}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Livres Populaires"
          value={generalStats.mostPopularBookLoans.toString()}
          icon={BookOpen}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des Prêts</h3>
          <div className="h-64">
            <div className="h-full flex items-end justify-between space-x-2">
              {monthlyData.length > 0 ? (
                monthlyData.map((data: any, index) => {
                  const maxLoans = Math.max(...monthlyData.map((d: any) => d.loans || 0));
                  const height = maxLoans > 0 ? ((data.loans || 0) / maxLoans) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                        <div 
                          className="w-full bg-blue-600 rounded-t absolute bottom-0" 
                          style={{ height: `${height}%` }}
                        ></div>
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600">
                          {data.loans || 0}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                    </div>
                  );
                })
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  Aucune donnée disponible
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Livres les Plus Empruntés</h3>
          <div className="space-y-3">
            {topBooks.length > 0 ? (
              topBooks.map((book: any, index) => {
                const maxEmprunts = Math.max(...topBooks.map((b: any) => b.emprunts || 0));
                const width = maxEmprunts > 0 ? ((book.emprunts || 0) / maxEmprunts) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{book.titre}</h4>
                      <p className="text-sm text-gray-600">{book.auteur || 'Auteur inconnu'}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{book.emprunts}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-4">
                Aucun livre emprunté
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des Utilisateurs</h3>
          <div className="space-y-4">
            {userStats.length > 0 ? (
              userStats.map((stat: any, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{stat.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{stat.count}</span>
                    <span className="text-sm text-gray-500">({stat.percentage}%)</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Aucun utilisateur enregistré
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            <div className="text-center text-gray-500 py-4">
              Les activités récentes sont disponibles dans le Dashboard principal
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;