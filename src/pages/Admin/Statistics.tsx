import React from 'react';
import { TrendingUp, Users, BookOpen, Calendar } from 'lucide-react';
import StatsCard from '../../components/Common/StatsCard';

const Statistics: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', loans: 120, returns: 115, newUsers: 25 },
    { month: 'Fév', loans: 135, returns: 130, newUsers: 30 },
    { month: 'Mar', loans: 150, returns: 145, newUsers: 28 },
    { month: 'Avr', loans: 140, returns: 142, newUsers: 32 },
    { month: 'Mai', loans: 160, returns: 155, newUsers: 35 },
    { month: 'Juin', loans: 155, returns: 150, newUsers: 29 }
  ];

  const topBooks = [
    { titre: 'Le Petit Prince', emprunts: 45, auteur: 'Saint-Exupéry' },
    { titre: '1984', emprunts: 38, auteur: 'George Orwell' },
    { titre: 'L\'Étranger', emprunts: 32, auteur: 'Albert Camus' },
    { titre: 'Harry Potter', emprunts: 29, auteur: 'J.K. Rowling' },
    { titre: 'Le Seigneur des Anneaux', emprunts: 25, auteur: 'J.R.R. Tolkien' }
  ];

  const userStats = [
    { type: 'Étudiants', count: 450, percentage: 60 },
    { type: 'Professeurs', count: 180, percentage: 24 },
    { type: 'Professionnels', count: 90, percentage: 12 },
    { type: 'Anonymes', count: 30, percentage: 4 }
  ];

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
          value="160"
          icon={Calendar}
          color="blue"
          trend={{ value: 14.3, isPositive: true }}
        />
        <StatsCard
          title="Nouveaux Utilisateurs"
          value="35"
          icon={Users}
          color="green"
          trend={{ value: 20.7, isPositive: true }}
        />
        <StatsCard
          title="Taux de Retour"
          value="96.9%"
          icon={TrendingUp}
          color="purple"
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatsCard
          title="Livres Populaires"
          value="45"
          icon={BookOpen}
          color="yellow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Évolution des Prêts</h3>
          <div className="h-64">
            <div className="h-full flex items-end justify-between space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '200px' }}>
                    <div 
                      className="w-full bg-blue-600 rounded-t absolute bottom-0" 
                      style={{ height: `${(data.loans / 160) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Livres les Plus Empruntés</h3>
          <div className="space-y-3">
            {topBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{book.titre}</h4>
                  <p className="text-sm text-gray-600">{book.auteur}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(book.emprunts / 45) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{book.emprunts}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Répartition des Utilisateurs</h3>
          <div className="space-y-4">
            {userStats.map((stat, index) => (
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
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Activité Récente</h3>
          <div className="space-y-3">
            {[
              { action: 'Nouveau prêt', details: 'Le Petit Prince emprunté', time: '2h' },
              { action: 'Retour', details: '1984 rendu par Pierre Martin', time: '3h' },
              { action: 'Inscription', details: 'Nouvel utilisateur Marie Dubois', time: '4h' },
              { action: 'Réservation', details: 'Harry Potter réservé', time: '5h' },
              { action: 'Paiement', details: 'Pénalité payée (5€)', time: '6h' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500">Il y a {activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;