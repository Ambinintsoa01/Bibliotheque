import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, BookOpenCheck } from 'lucide-react';
import Table from '../../components/Common/Table';
import { Reservation } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ReservationValidation: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getReservations();
      setReservations(data);
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error);
      setError('Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reservationId: number) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await apiService.validerReservation(reservationId);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Réservation validée avec succès');
        loadReservations(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      setError('Erreur lors de la validation de la réservation');
    }
  };

  const handleReject = async (reservationId: number) => {
    try {
      setError(null);
      setSuccess(null);
      
      const response = await apiService.rejeterReservation(reservationId);
      
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Réservation rejetée avec succès');
        loadReservations(); // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      setError('Erreur lors du rejet de la réservation');
    }
  };

  const handleCancel = async (reservationId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      try {
        setError(null);
        setSuccess(null);
        
        const success = await apiService.annulerReservation(reservationId);
        
        if (success) {
          setSuccess('Réservation annulée avec succès');
          loadReservations();
        } else {
          setError('Erreur lors de l\'annulation');
        }
      } catch (error) {
        console.error('Erreur lors de l\'annulation:', error);
        setError('Erreur lors de l\'annulation de la réservation');
      }
    }
  };

  const handleConfirmLoan = async (reservation: Reservation) => {
    if (!user) {
      setError('Vous devez être connecté en tant que bibliothécaire pour confirmer un prêt.');
      return;
    }
    try {
      setError(null);
      setSuccess(null);
      const response = await apiService.createPret({
        exemplaireId: reservation.exemplaire.id,
        profilId: reservation.profil.id,
        bibliothequaireId: user.id,
        typePret: 0, // ou autre selon logique métier
        dureePret: 14
      });
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Prêt confirmé avec succès');
        loadReservations();
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation du prêt:', error);
      setError('Erreur lors de la confirmation du prêt');
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'En attente', label: 'En attente' },
    { value: 'Disponible', label: 'Disponible' },
    { value: 'Annulée', label: 'Annulée' },
    { value: 'Expirée', label: 'Expirée' }
  ];

  const filteredReservations = reservations.filter(reservation => {
    // On ne garde que les réservations qui sont dans les statuts connus
    const statutsVisibles = ['En attente', 'Disponible', 'Annulée', 'Expirée'];
    if (!statutsVisibles.includes(reservation.statut)) {
      return false;
    }
    const matchesSearch = reservation.profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.profil.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.exemplaire.numExemplaire.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || reservation.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { key: 'exemplaire.numExemplaire', label: 'Exemplaire' },
    { 
      key: 'profil', 
      label: 'Demandeur',
      render: (profil: any) => `${profil.prenom} ${profil.nom}`
    },
    { 
      key: 'dateResa', 
      label: 'Date de réservation',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    { 
      key: 'dateExpiration', 
      label: 'Date d\'expiration',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      key: 'statut',
      label: 'Statut',
      render: (statut: string) => {
        const colors = {
          'En attente': 'bg-yellow-100 text-yellow-800',
          'Disponible': 'bg-green-100 text-green-800',
          'Annulée': 'bg-red-100 text-red-800',
          'Expirée': 'bg-gray-100 text-gray-800'
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
      render: (value: any, reservation: Reservation) => (
        <div className="flex space-x-2">
          {reservation.statut === 'En attente' && (
            <>
              <button 
                onClick={() => handleApprove(reservation.id)}
                className="text-green-600 hover:text-green-800"
                title="Approuver"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleReject(reservation.id)}
                className="text-red-600 hover:text-red-800"
                title="Refuser"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
          {reservation.statut === 'Disponible' && (
            <button
              onClick={() => handleConfirmLoan(reservation)}
              className="text-blue-600 hover:text-blue-800"
              title="Confirmer le prêt"
            >
              <BookOpenCheck className="h-4 w-4" />
            </button>
          )}
          <button 
            onClick={() => handleCancel(reservation.id)}
            className="text-orange-600 hover:text-orange-800"
            title="Annuler"
          >
            <Clock className="h-4 w-4" />
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
        <h2 className="text-2xl font-bold text-gray-900">Validation des Réservations</h2>
        <button 
          onClick={loadReservations}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Actualiser
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une réservation..."
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
          data={filteredReservations}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ReservationValidation;