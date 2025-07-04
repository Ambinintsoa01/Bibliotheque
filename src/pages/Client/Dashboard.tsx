import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import StatsCard from '../../components/Common/StatsCard';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    activeLoans: 0,
    reservations: 0,
    overdueLoans: 0,
    totalBooksRead: 0
  });
  const [recentBooks, setRecentBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recommandations, setRecommandations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [statsData, livresData, notifsData, recsData] = await Promise.all([
        apiService.getStatsClient(user.id),
        apiService.getLivresRecents(user.id),
        apiService.getNotificationsByProfil(user.id),
        apiService.getRecommandations(user.id)
      ]);
      setUserStats(statsData);
      setRecentBooks(livresData);
      setNotifications(notifsData.slice(0, 3));
      setRecommandations(recsData);
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Bienvenue dans votre bibliothèque</h2>
        <p className="text-blue-100">Découvrez de nouveaux livres et gérez vos emprunts facilement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Prêts Actifs"
          value={userStats.activeLoans}
          icon={BookOpen}
          color="blue"
        />
        <StatsCard
          title="Réservations"
          value={userStats.reservations}
          icon={Clock}
          color="yellow"
        />
        <StatsCard
          title="Retards"
          value={userStats.overdueLoans}
          icon={AlertTriangle}
          color="red"
        />
        <StatsCard
          title="Livres Lus"
          value={userStats.totalBooksRead}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mes Livres</h3>
          <div className="space-y-4">
            {recentBooks.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucun livre récent</p>
            ) : (
              recentBooks.map((book: any) => (
                <div key={book.id} className="flex items-center space-x-4">
                  <img 
                    src={book.imageCouverture || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=150&h=200&fit=crop'} 
                    alt={book.titre}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.titre}</h4>
                    <p className="text-sm text-gray-600">
                      {book.auteurs ? book.auteurs.map((a: any) => `${a.prenom} ${a.nom}`).join(', ') : 'Auteur inconnu'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {book.status === 'active' && `Retour: ${book.dateRetour}`}
                      {book.status === 'overdue' && `En retard depuis: ${book.dateRetour}`}
                      {book.status === 'reserved' && 'Réservé'}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.status === 'active' ? 'bg-green-100 text-green-800' :
                      book.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {book.status === 'active' ? 'Actif' :
                       book.status === 'overdue' ? 'Retard' :
                       'Réservé'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">Aucune notification</p>
            ) : (
              notifications.map((notification: any) => (
                <div key={notification.id} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'Disponibilite' ? 'bg-green-500' :
                    notification.type === 'Rappel' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recommandations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommandations.length === 0 ? (
            <p className="text-gray-500 text-sm col-span-3">Aucune recommandation disponible</p>
          ) : (
            recommandations.map((livre: any) => (
              <div key={livre.id} className="group cursor-pointer">
                <div className="aspect-w-3 aspect-h-4 mb-3">
                  <img 
                    src={livre.imageCouverture || `https://images.unsplash.com/photo-${1500000000000 + livre.id}?w=200&h=300&fit=crop`}
                    alt={livre.titre}
                    className="w-full h-48 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                  />
                </div>
                <h4 className="font-medium text-gray-900">{livre.titre}</h4>
                <p className="text-sm text-gray-600">
                  {livre.auteurs ? livre.auteurs.map((a: any) => `${a.prenom} ${a.nom}`).join(', ') : 'Auteur inconnu'}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;