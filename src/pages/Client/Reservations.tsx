import React, { useState, useEffect } from 'react';
import { Clock, X, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import { Reservation, Loan } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ClientReservations: React.FC = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadReservationsAndLoans();
    }
  }, [user]);

  const loadReservationsAndLoans = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const [reservationsData, loansData] = await Promise.all([
        apiService.getReservationsByProfil(user.id),
        apiService.getPretsByProfil(user.id)
      ]);
      setReservations(reservationsData);
      setLoans(loansData);
    } catch (error) {
      setError('Erreur lors du chargement des réservations ou des prêts : ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId: number) => {
    try {
      await apiService.annulerReservation(reservationId);
      alert('Réservation annulée avec succès!');
      loadReservationsAndLoans();
    } catch (error) {
      alert('Erreur lors de l\'annulation de la réservation');
    }
  };

  const handleConfirmRetrait = async (reservation: Reservation) => {
    if (!user) return;
    setError(null);
    setSuccess(null);
    try {
      const response = await apiService.createPret({
        exemplaireId: reservation.exemplaire.id,
        profilId: user.id,
        bibliothequaireId: 1, // ID par défaut, à adapter si besoin
        typePret: 0,
        dureePret: 14
      });
      if (response.error) {
        setError('Erreur lors de la création du prêt : ' + response.error);
      } else {
        setSuccess('Prêt confirmé avec succès !');
        loadReservationsAndLoans();
      }
    } catch (error) {
      setError('Erreur lors de la création du prêt : ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Annulée':
        return 'bg-red-100 text-red-800';
      case 'Expirée':
        return 'bg-gray-100 text-gray-800';
      case 'Prêté':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'En attente':
        return <Clock className="h-4 w-4" />;
      case 'Disponible':
        return <BookOpen className="h-4 w-4" />;
      case 'Prêté':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Pour chaque réservation, vérifier si un prêt existe pour le même exemplaire et profil
  const getReservationStatus = (reservation: Reservation) => {
    const pret = loans.find(
      (loan) =>
        loan.exemplaire.id === reservation.exemplaire.id &&
        loan.profil.id === reservation.profil.id &&
        !loan.rendu
    );
    if (pret) return 'Prêté';
    return reservation.statut;
  };

  const filteredReservations = reservations.filter(reservation => {
    // On masque toute réservation pour laquelle il existe un prêt (rendu ou non)
    const pretAssocie = loans.find(
      (loan) =>
        loan.exemplaire.id === reservation.exemplaire.id &&
        loan.profil.id === reservation.profil.id
    );
    return !pretAssocie;
  });

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
        <h2 className="text-2xl font-bold text-gray-900">Mes Réservations</h2>
        <div className="text-sm text-gray-500">
          {reservations.length} réservation{reservations.length > 1 ? 's' : ''} active{reservations.length > 1 ? 's' : ''}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-2">
          {error}
          {error.includes('Failed to fetch') && (
            <div className="mt-2 text-sm text-red-800">
              Impossible de contacter le serveur. Vérifiez que le backend est bien démarré sur <b>http://localhost:8080</b> et que vous n'avez pas de problème de CORS ou de réseau.
            </div>
          )}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-2">{success}</div>
      )}

      {reservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune réservation</h3>
          <p className="text-gray-500">Vous n'avez aucune réservation en cours.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => {
            const statut = getReservationStatus(reservation);
            const isPret = statut === 'Prêté';
            return (
              <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={`https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=80&h=120&fit=crop`} 
                        alt="Couverture"
                        className="w-16 h-20 object-cover rounded"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reservation.exemplaire && (reservation.exemplaire as any).livre && (reservation.exemplaire as any).livre.titre ? (reservation.exemplaire as any).livre.titre : `Livre Réservé ${reservation.id}`}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Exemplaire: {reservation.exemplaire.numExemplaire}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Réservé le: {new Date(reservation.dateResa).toLocaleDateString('fr-FR')}</span>
                        <span>•</span>
                        <span>Expire le: {new Date(reservation.dateExpiration).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-3`}>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(statut)}`}>
                      {getStatusIcon(statut)}
                      <span className="text-sm font-medium">{statut}</span>
                    </div>
                    {!isPret && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                        title="Annuler la réservation"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {statut === 'Disponible' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Votre livre est disponible !
                        </p>
                        <p className="text-sm text-green-700">
                          Venez le retirer avant le {new Date(reservation.dateExpiration).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      {!isPret && (
                        <button 
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm"
                          onClick={() => handleConfirmRetrait(reservation)}
                        >
                          Confirmer le retrait
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {statut === 'En attente' && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Votre réservation est en attente. Vous serez notifié dès que le livre sera disponible.
                    </p>
                  </div>
                )}

                {statut === 'Prêté' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Ce livre a été prêté. Vous pouvez le retrouver dans la section "Mes Prêts".
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClientReservations;