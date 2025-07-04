import React, { useState } from 'react';
import { User, Edit, Save, X, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ClientProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    adherantType: user?.adherantType || 'Etudiant'
  });

  const handleSave = () => {
    // Logique pour sauvegarder les modifications
    console.log('Sauvegarder les modifications:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      nom: user?.nom || '',
      prenom: user?.prenom || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      adherantType: user?.adherantType || 'Etudiant'
    });
    setIsEditing(false);
  };

  const stats = {
    booksRead: 24,
    activeLoans: 3,
    totalReservations: 12,
    penalties: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Mon Profil</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.nom}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 py-2">{user?.prenom}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 py-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 py-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user?.telephone || 'Non renseigné'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'adhérent
                </label>
                {isEditing ? (
                  <select
                    value={formData.adherantType}
                    onChange={(e) => setFormData({ ...formData, adherantType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Etudiant">Étudiant</option>
                    <option value="Prof">Professeur</option>
                    <option value="Professionnel">Professionnel</option>
                    <option value="Anonyme">Anonyme</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2 py-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{user?.adherantType}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'inscription
                </label>
                <div className="flex items-center space-x-2 py-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {user?.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Annuler</span>
                </button>
                <button
                  onClick={handleSave}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mes statistiques</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Livres lus</span>
                <span className="text-lg font-semibold text-gray-900">{stats.booksRead}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Prêts actifs</span>
                <span className="text-lg font-semibold text-blue-600">{stats.activeLoans}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Réservations totales</span>
                <span className="text-lg font-semibold text-gray-900">{stats.totalReservations}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pénalités</span>
                <span className={`text-lg font-semibold ${stats.penalties === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.penalties === 0 ? 'Aucune' : `${stats.penalties}€`}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Abonnement</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Abonnement annuel</span>
              </div>
              <div className="text-sm text-gray-600">
                Expire le: <span className="font-medium">31/12/2024</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-gray-500">9 mois restants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;