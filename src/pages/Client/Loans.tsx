import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, AlertTriangle, Clock, RotateCcw, CheckCircle } from 'lucide-react';
import { Loan } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const ClientLoans: React.FC = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadLoans();
    }
  }, [user]);

  const loadLoans = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const data = await apiService.getPretsByProfil(user.id);
      setLoans(data);
    } catch (error) {
      setError('Erreur lors du chargement des prêts : ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestExtension = async (loanId: number) => {
    const nombreJours = prompt('Combien de jours de prolongation souhaitez-vous ? (max 10 jours)');
    
    if (nombreJours === null) return; // Utilisateur a annulé
    
    const jours = parseInt(nombreJours);
    if (isNaN(jours) || jours <= 0) {
      alert('Veuillez entrer un nombre valide de jours');
      return;
    }
    
    if (jours > 10) {
      alert('La prolongation ne peut pas dépasser 10 jours');
      return;
    }
    
    try {
      const response = await apiService.demanderProlongation(loanId, jours);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Prolongation accordée avec succès!');
        loadLoans(); // Recharger les prêts
      }
    } catch (error) {
      console.error('Erreur lors de la demande de prolongation:', error);
      setError('Erreur lors de la demande de prolongation');
    }
  };

  const handleReturn = async (loanId: number) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await apiService.retournerPret(loanId, new Date().toISOString().split('T')[0]);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess('Livre rendu avec succès !');
        loadLoans();
      }
    } catch (error) {
      setError('Erreur lors du retour du livre');
    }
  };

  const getDaysRemaining = (dateFinPret: string) => {
    const today = new Date();
    const dueDate = new Date(dateFinPret);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusInfo = (loan: Loan) => {
    if (loan.rendu) {
      return { color: 'bg-green-100 text-green-800', text: 'Rendu', icon: BookOpen };
    }
    if (loan.enRetard) {
      return { color: 'bg-red-100 text-red-800', text: 'En retard', icon: AlertTriangle };
    }
    const daysRemaining = getDaysRemaining(loan.dateFinPret);
    if (daysRemaining <= 3) {
      return { color: 'bg-yellow-100 text-yellow-800', text: `${daysRemaining} jour(s) restant(s)`, icon: Clock };
    }
    return { color: 'bg-blue-100 text-blue-800', text: 'Actif', icon: BookOpen };
  };

  const activeLoans = loans.filter(loan => !loan.rendu);
  const historyLoans = loans.filter(loan => loan.rendu);

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
        <h2 className="text-2xl font-bold text-gray-900">Mes Prêts</h2>
        <div className="text-sm text-gray-500">
          {activeLoans.length} prêt{activeLoans.length > 1 ? 's' : ''} actif{activeLoans.length > 1 ? 's' : ''}
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

      {/* Prêts actifs */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Prêts en cours</h3>
        {activeLoans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun prêt actif</h3>
            <p className="text-gray-500">Vous n'avez aucun livre emprunté actuellement.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {activeLoans.map((loan) => {
              const status = getStatusInfo(loan);
              const StatusIcon = status.icon;
              
              return (
                <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                          {loan.exemplaire?.livre?.titre || `Livre Emprunté ${loan.id}`}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          Exemplaire: {loan.exemplaire.numExemplaire}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Emprunté le: {new Date(loan.datePret).toLocaleDateString('fr-FR')}</span>
                          <span>•</span>
                          <span>À rendre le: {new Date(loan.dateFinPret).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            loan.type === 'domicile' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {loan.type === 'domicile' ? 'Domicile' : 'Sur place'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{status.text}</span>
                      </div>
                      {!loan.enRetard && (
                        <button
                          onClick={() => handleRequestExtension(loan.id)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                          title="Demander une prolongation"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                      {!loan.rendu && (loan.enRetard || new Date() >= new Date(loan.dateFinPret)) && (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-50"
                          title="Rendre le livre"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {loan.enRetard && (
                    <div className="mt-4 p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <p className="text-sm font-medium text-red-800">
                          Ce livre est en retard
                        </p>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        Veuillez le rendre dès que possible pour éviter des pénalités supplémentaires.
                      </p>
                    </div>
                  )}

                  {!loan.enRetard && getDaysRemaining(loan.dateFinPret) <= 3 && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">
                            Rappel de retour
                          </p>
                          <p className="text-sm text-yellow-700">
                            N'oubliez pas de rendre ce livre avant le {new Date(loan.dateFinPret).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historique des prêts */}
      {historyLoans.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Historique des prêts</h3>
          <div className="grid gap-4">
            {historyLoans.map((loan) => (
              <div key={loan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {loan.exemplaire?.livre?.titre || `Livre ${loan.id}`}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Rendu le: {loan.dateRendu ? new Date(loan.dateRendu).toLocaleDateString('fr-FR') : 'Date inconnue'}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                    Rendu
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLoans;