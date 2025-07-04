import React, { useState, useEffect } from 'react';
import { Calendar, Search, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { Loan } from '../../types';
import { apiService } from '../../services/api';

const LoanManagement: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [exemplaires, setExemplaires] = useState<any[]>([]);
  const [form, setForm] = useState({
    profilId: '',
    exemplaireId: '',
    typePret: '0',
    dureePret: '14',
    bibliothequaireId: '1',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState<string>(new Date().toISOString().slice(0, 10)); // format YYYY-MM-DD

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPrets();
      setLoans(data);
    } catch (error) {
      console.error('Erreur lors du chargement des prêts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfilesAndExemplaires = async () => {
    try {
      const profils = await apiService.getProfils();
      setProfiles(profils);
      const exs = await apiService.getLivresDisponibles();
      // Aplatir tous les exemplaires disponibles de tous les livres
      const allExemplaires = exs.flatMap((livre: any) => livre.exemplaires.filter((ex: any) => ex.disponible));
      setExemplaires(allExemplaires);
    } catch (error) {
      setFormError('Erreur lors du chargement des profils ou exemplaires');
    }
  };

  const handleStatusFilter = async (status: string) => {
    try {
      setLoading(true);
      let data;
      switch (status) {
        case 'active':
          data = await apiService.getPretsActifs();
          break;
        case 'overdue':
          data = await apiService.getPretsEnRetard();
          break;
        default:
          data = await apiService.getPrets();
      }
      setLoans(data);
    } catch (error) {
      console.error('Erreur lors du filtrage des prêts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: number, dateRendu: string) => {
    try {
      await apiService.retournerPret(loanId, dateRendu);
      loadLoans();
    } catch (error) {
      console.error('Erreur lors du retour du prêt:', error);
      alert('Erreur lors du retour du prêt');
    }
  };

  const openModal = () => {
    setShowModal(true);
    setForm({ profilId: '', exemplaireId: '', typePret: '0', dureePret: '14', bibliothequaireId: '1' });
    setFormError(null);
    setFormSuccess(null);
    loadProfilesAndExemplaires();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!form.profilId || !form.exemplaireId) {
      setFormError('Veuillez sélectionner un utilisateur et un exemplaire.');
      return;
    }
    try {
      const response = await apiService.createPret({
        profilId: Number(form.profilId),
        exemplaireId: Number(form.exemplaireId),
        bibliothequaireId: Number(form.bibliothequaireId),
        typePret: Number(form.typePret),
        dureePret: Number(form.dureePret)
      });
      if (response.error) {
        setFormError('Erreur lors de la création du prêt : ' + response.error);
      } else {
        setFormSuccess('Prêt créé avec succès !');
        setShowModal(false);
        loadLoans();
      }
    } catch (error) {
      setFormError('Erreur lors de la création du prêt : ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'overdue', label: 'En retard' },
    { value: 'returned', label: 'Rendus' }
  ];

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.profil.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.exemplaire.numExemplaire.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && !loan.rendu && !loan.enRetard) ||
                         (statusFilter === 'overdue' && loan.enRetard && !loan.rendu) ||
                         (statusFilter === 'returned' && loan.rendu);
    
    return matchesSearch && matchesStatus;
  });

  const getDaysRemaining = (dateFinPret: string) => {
    const today = new Date();
    const dueDate = new Date(dateFinPret);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const columns = [
    {
      key: 'exemplaire.numExemplaire',
      label: 'Exemplaire',
      render: (value: any, loan: Loan) =>
        loan.exemplaire && (loan.exemplaire as any).livre && (loan.exemplaire as any).livre.titre
          ? `${(loan.exemplaire as any).livre.titre} (Ex: ${loan.exemplaire.numExemplaire})`
          : loan.exemplaire.numExemplaire
    },
    {
      key: 'profil',
      label: 'Emprunteur',
      render: (profil: any) => `${profil.prenom} ${profil.nom}`
    },
    {
      key: 'datePret',
      label: 'Date de prêt',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      key: 'dateFinPret',
      label: 'Date de retour',
      render: (date: string) => new Date(date).toLocaleDateString('fr-FR')
    },
    {
      key: 'dateRendu',
      label: 'Date de rendu',
      render: (date: string, loan: Loan) => loan.rendu && date ? new Date(date).toLocaleDateString('fr-FR') : '-'
    },
    {
      key: 'type',
      label: 'Type',
      render: (type: string) => (
        <span className={`px-2 py-1 rounded text-xs ${
          type === 'domicile' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {type === 'domicile' ? 'Domicile' : 'Sur place'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: any, loan: Loan) => {
        if (loan.rendu) {
          return <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Rendu</span>;
        }
        if (loan.enRetard) {
          return <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">En retard</span>;
        }
        const days = getDaysRemaining(loan.dateFinPret);
        if (days <= 3 && days >= 0) {
          return <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">À rendre bientôt ({days}j)</span>;
        }
        return <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">Actif</span>;
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, loan: Loan) => (
        <div className="flex space-x-2">
          {!loan.rendu && (
            <button
              onClick={() => {
                setSelectedLoanId(loan.id);
                setReturnDate(new Date().toISOString().slice(0, 10));
                setShowReturnModal(true);
              }}
              className="text-green-600 hover:text-green-800"
              title="Marquer comme rendu"
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button className="text-blue-600 hover:text-blue-800">
            <Clock className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Prêts</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau prêt</span>
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouveau prêt">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{formError}</div>}
          {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{formSuccess}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
            <select
              name="profilId"
              value={form.profilId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un utilisateur</option>
              {profiles.map((profil) => (
                <option key={profil.id} value={profil.id}>{profil.prenom} {profil.nom} ({profil.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exemplaire</label>
            <select
              name="exemplaireId"
              value={form.exemplaireId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un exemplaire</option>
              {exemplaires.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.numExemplaire}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de prêt</label>
            <select
              name="typePret"
              value={form.typePret}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0">Domicile</option>
              <option value="1">Sur place</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Durée (jours)</label>
            <input
              type="number"
              name="dureePret"
              value={form.dureePret}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              max={60}
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Créer le prêt
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showReturnModal} onClose={() => setShowReturnModal(false)} title="Saisir la date de rendu">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (selectedLoanId) {
              await handleReturn(selectedLoanId, returnDate);
              setShowReturnModal(false);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de rendu</label>
            <input
              type="date"
              value={returnDate}
              onChange={e => setReturnDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setShowReturnModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un prêt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleStatusFilter(e.target.value);
            }}
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
          data={filteredLoans}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default LoanManagement;