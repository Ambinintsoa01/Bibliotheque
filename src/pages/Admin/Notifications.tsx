import React, { useState, useEffect } from 'react';
import { Bell, Send, Search, Filter } from 'lucide-react';
import Table from '../../components/Common/Table';
import { Notification } from '../../types';
import { apiService } from '../../services/api';

const AdminNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showNewNotification, setShowNewNotification] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await apiService.getAllNotifications();
      setNotifications(data);
    } catch (error) {
      // Optionally handle error
    }
  };

  const typeOptions = [
    { value: 'all', label: 'Tous les types' },
    { value: 'Rappel', label: 'Rappel' },
    { value: 'Penalite', label: 'Pénalité' },
    { value: 'Disponibilite', label: 'Disponibilité' },
    { value: 'Information', label: 'Information' }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.profil.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const columns = [
    { 
      key: 'profil', 
      label: 'Destinataire',
      render: (profil: any) => `${profil.prenom} ${profil.nom}`
    },
    { key: 'message', label: 'Message' },
    {
      key: 'type',
      label: 'Type',
      render: (type: string) => {
        const colors = {
          'Rappel': 'bg-yellow-100 text-yellow-800',
          'Penalite': 'bg-red-100 text-red-800',
          'Disponibilite': 'bg-green-100 text-green-800',
          'Information': 'bg-blue-100 text-blue-800'
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${colors[type as keyof typeof colors]}`}>
            {type}
          </span>
        );
      }
    },
    { 
      key: 'dateEnvoi', 
      label: 'Date d\'envoi',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (statut: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          statut === 'Lu' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {statut}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <button 
          onClick={() => setShowNewNotification(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>Nouvelle notification</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Table
          columns={columns}
          data={filteredNotifications}
        />
      </div>

      {showNewNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nouvelle Notification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de notification
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="Information">Information</option>
                  <option value="Rappel">Rappel</option>
                  <option value="Penalite">Pénalité</option>
                  <option value="Disponibilite">Disponibilité</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tapez votre message..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNewNotification(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;