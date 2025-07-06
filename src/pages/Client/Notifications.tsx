import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { Notification } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ClientNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await apiService.getNotificationsByProfil(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await apiService.marquerNotificationLue(notificationId);
      loadNotifications(); // Recharger les notifications
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      alert(`Erreur lors du marquage comme lu: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!user) return;
    
    try {
      await apiService.marquerToutesNotificationsLues(user.id);
      loadNotifications(); // Recharger les notifications
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      alert(`Erreur lors du marquage de toutes les notifications: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Rappel':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Penalite':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Disponibilite':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Information':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Rappel':
        return 'border-l-yellow-500';
      case 'Penalite':
        return 'border-l-red-500';
      case 'Disponibilite':
        return 'border-l-green-500';
      case 'Information':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => n.statut === 'Non lu').length;

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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-sm text-gray-500">
            {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
          <p className="text-gray-500">Vous n'avez aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm border-l-4 border-gray-200 p-4 ${getNotificationColor(notification.type)} ${
                notification.statut === 'Non lu' ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm ${
                        notification.statut === 'Non lu' ? 'font-medium text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.type === 'Rappel' ? 'bg-yellow-100 text-yellow-800' :
                          notification.type === 'Penalite' ? 'bg-red-100 text-red-800' :
                          notification.type === 'Disponibilite' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {notification.statut === 'Non lu' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      {notification.statut === 'Non lu' && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-xs"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientNotifications;