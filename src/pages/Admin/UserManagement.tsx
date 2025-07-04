import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, UserCheck, UserX, X } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { User } from '../../types';
import { apiService } from '../../services/api';

interface NewUserForm {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  adherantType: string;
  telephone: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    adherantType: 'Etudiant',
    telephone: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfils();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await apiService.searchProfils(searchTerm);
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setError('Erreur lors de la recherche');
      } finally {
        setLoading(false);
      }
    } else {
      loadUsers();
    }
  };

  const handleTypeFilter = async (type: string) => {
    if (type === 'all') {
      loadUsers();
    } else {
      try {
        setLoading(true);
        const data = await apiService.getProfilsByType(type);
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du filtrage par type:', error);
        setError('Erreur lors du filtrage par type');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddUser = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      // Validation basique
      if (!newUser.nom || !newUser.prenom || !newUser.email || !newUser.password) {
        setError('Tous les champs obligatoires doivent être remplis');
        return;
      }

      const response = await apiService.createProfil(newUser);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Utilisateur créé avec succès');
        setShowAddModal(false);
        setNewUser({
          nom: '',
          prenom: '',
          email: '',
          password: '',
          adherantType: 'Etudiant',
          telephone: ''
        });
        loadUsers(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const success = await apiService.deleteProfil(userId);
        if (success) {
          setSuccess('Utilisateur supprimé avec succès');
          loadUsers();
        } else {
          setError('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        setError('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const adherantTypes = [
    { value: 'all', label: 'Tous les types' },
    { value: 'Prof', label: 'Professeur' },
    { value: 'Etudiant', label: 'Étudiant' },
    { value: 'Professionnel', label: 'Professionnel' },
    { value: 'Anonyme', label: 'Anonyme' }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || user.adherantType === selectedType;
    return matchesSearch && matchesType;
  });

  const columns = [
    { key: 'nom', label: 'Nom', sortable: true },
    { key: 'prenom', label: 'Prénom', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'adherantType', label: 'Type', sortable: true },
    { key: 'telephone', label: 'Téléphone' },
    { 
      key: 'dateInscription', 
      label: 'Date d\'inscription',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, user: User) => (
        <div className="flex space-x-2">
          <button 
            className="text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            className="text-green-600 hover:text-green-800"
            title="Activer/Désactiver"
          >
            <UserCheck className="h-4 w-4" />
          </button>
          <button 
            className="text-red-600 hover:text-red-800"
            title="Supprimer"
            onClick={() => handleDeleteUser(user.id)}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Messages d'erreur et de succès */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Rechercher
            </button>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                handleTypeFilter(e.target.value);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {adherantTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredUsers}
          loading={loading}
        />
      </div>

      {/* Modal d'ajout d'utilisateur */}
      <Modal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        title="Nouvel utilisateur"
      >
        <div className="space-y-4">

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                value={newUser.nom}
                onChange={(e) => setNewUser({...newUser, nom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                value={newUser.prenom}
                onChange={(e) => setNewUser({...newUser, prenom: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'adhérent
              </label>
              <select
                value={newUser.adherantType}
                onChange={(e) => setNewUser({...newUser, adherantType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Etudiant">Étudiant</option>
                <option value="Prof">Professeur</option>
                <option value="Professionnel">Professionnel</option>
                <option value="Anonyme">Anonyme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={newUser.telephone}
                onChange={(e) => setNewUser({...newUser, telephone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleAddUser}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Créer
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;