import React, { useState, useEffect } from 'react';
import { AlertTriangle, Search, CheckCircle, XCircle } from 'lucide-react';
import Table from '../../components/Common/Table';
import { Penalty } from '../../types';
import { apiService } from '../../services/api';

const PenaltyManagement: React.FC = () => {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalActive, setTotalActive] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadPenalties();
    loadTotals();
  }, []);

  const loadPenalties = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPenalites();
      if (Array.isArray(data)) {
        setPenalties(data);
      } else {
        console.error('Données invalides reçues:', data);
        setPenalties([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des pénalités:', error);
      setPenalties([]);
    } finally {
      setLoading(false);
    }
  };

  const loadTotals = async () => {
    try {
      const [activeTotal, paidTotal] = await Promise.all([
        apiService.getTotalPenalitesActives(),
        apiService.getTotalPenalitesPayees()
      ]);
      setTotalActive(typeof activeTotal === 'number' ? activeTotal : 0);
      setTotalPaid(typeof paidTotal === 'number' ? paidTotal : 0);
    } catch (error) {
      console.error('Erreur lors du chargement des totaux:', error);
      setTotalActive(0);
      setTotalPaid(0);
    }
  };

  const handleMarkAsPaid = async (penaltyId: number) => {
    try {
      await apiService.marquerPenalitePayee(penaltyId);
      loadPenalties();
      loadTotals();
    } catch (error) {
      console.error('Erreur lors du marquage comme payée:', error);
      alert(`Erreur lors du marquage comme payée: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleCancel = async (penaltyId: number) => {
    try {
      await apiService.annulerPenalite(penaltyId);
      loadPenalties();
      loadTotals();
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      alert(`Erreur lors de l'annulation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Active', label: 'Active' },
    { value: 'Payée', label: 'Payée' },
    { value: 'Annulée', label: 'Annulée' }
  ];

  const filteredPenalties = (Array.isArray(penalties) ? penalties : []).filter(penalty => {
    const matchesSearch = penalty.profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.profil.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         penalty.profil.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || penalty.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      key: 'profil', 
      label: 'Utilisateur',
      render: (profil: any) => `${profil.prenom} ${profil.nom}`
    },
    { 
      key: 'dateDebut', 
      label: 'Date de début',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    { 
      key: 'dateFin', 
      label: 'Date de fin',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    { 
      key: 'montant', 
      label: 'Montant',
      render: (montant: number) => `${montant.toFixed(2)} €`
    },
    { key: 'raisons', label: 'Raisons' },
    {
      key: 'statut',
      label: 'Statut',
      render: (statut: string) => {
        const colors = {
          'Active': 'bg-red-100 text-red-800',
          'Payée': 'bg-green-100 text-green-800',
          'Annulée': 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${colors[statut as keyof typeof colors]}`}>
            {statut}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, penalty: Penalty) => (
        <div className="flex space-x-2">
          {penalty.statut === 'Active' && (
            <>
              <button 
                onClick={() => handleMarkAsPaid(penalty.id)}
                className="text-green-600 hover:text-green-800"
                title="Marquer comme payée"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleCancel(penalty.id)}
                className="text-red-600 hover:text-red-800"
                title="Annuler"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Pénalités</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pénalités Actives</p>
              <p className="text-2xl font-bold text-red-600">{totalActive.toFixed(2)} €</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pénalités Payées</p>
              <p className="text-2xl font-bold text-green-600">{totalPaid.toFixed(2)} €</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total des Pénalités</p>
              <p className="text-2xl font-bold text-gray-900">{(totalActive + totalPaid).toFixed(2)} €</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une pénalité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Table
          columns={columns}
          data={filteredPenalties}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default PenaltyManagement;