import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, User, Clock } from 'lucide-react';
import { apiService } from '../../services/api';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';

interface Inscription {
  id: number;
  profil: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  tarif: {
    tarifId: number;
    description: string;
    montant: number;
    nbMois: number;
  };
  dateDebut: string;
  dateFin: string;
  statut?: string;
}

const InscriptionAdd: React.FC = () => {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [profils, setProfils] = useState<any[]>([]);
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    profilId: '',
    tarifId: '',
    dateDebut: '',
    dateFin: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadInscriptions();
  }, []);

  const loadInscriptions = async () => {
    try {
      setLoading(true);
      console.log('Chargement des inscriptions...');
      
      const data = await apiService.getInscriptions();
      console.log('Inscriptions reçues:', data);
      setInscriptions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfilesAndTarifs = async () => {
    try {
      console.log('Chargement des profils...');
      const profilsData = await apiService.getProfils();
      console.log('Profils reçus:', profilsData);
      setProfils(profilsData);
      
      console.log('Chargement des tarifs...');
      const tarifsData = await apiService.getTarifsInscription();
      console.log('Tarifs reçus:', tarifsData);
      setTarifs(tarifsData);
    } catch (error) {
      console.error('Erreur lors du chargement des profils ou tarifs:', error);
      setFormError('Erreur lors du chargement des profils ou tarifs');
    }
  };

  const openModal = () => {
    setShowModal(true);
    setForm({ profilId: '', tarifId: '', dateDebut: '', dateFin: '' });
    setFormError(null);
    setFormSuccess(null);
    loadProfilesAndTarifs();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    setLoading(true);
    
    if (!form.profilId || !form.tarifId || !form.dateDebut || !form.dateFin) {
      setFormError('Veuillez remplir tous les champs.');
      setLoading(false);
      return;
    }

    try {
      await apiService.addInscription({
        profil: { profilId: Number(form.profilId) },
        tarif: { tarifId: Number(form.tarifId) },
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
      });
      setFormSuccess('Inscription ajoutée avec succès !');
      setShowModal(false);
      loadInscriptions();
    } catch (e: any) {
      let msg = 'Erreur lors de l\'ajout';
      if (e?.response?.data?.message) msg = e.response.data.message;
      else if (e?.response?.data?.error) msg = e.response.data.error;
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  const getInscriptionStatus = (inscription: Inscription) => {
    const today = new Date();
    const dateFin = new Date(inscription.dateFin);
    const dateDebut = new Date(inscription.dateDebut);
    
    if (today < dateDebut) {
      return { status: 'future', label: 'À venir', color: 'bg-blue-100 text-blue-800' };
    } else if (today >= dateDebut && today <= dateFin) {
      return { status: 'active', label: 'Active', color: 'bg-green-100 text-green-800' };
    } else {
      return { status: 'expired', label: 'Expirée', color: 'bg-red-100 text-red-800' };
    }
  };

  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = 
      inscription.profil.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.profil.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.profil.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inscription.tarif.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getInscriptionStatus(inscription);
    const matchesStatus = statusFilter === 'all' || status.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'profil',
      label: 'Adhérent',
      render: (profil: any) => (
        <div>
          <div className="font-medium">{profil.prenom} {profil.nom}</div>
          <div className="text-sm text-gray-500">{profil.email}</div>
        </div>
      )
    },
    {
      key: 'tarif',
      label: 'Tarif',
      render: (tarif: any) => (
        <div>
          <div className="font-medium">{tarif.description}</div>
          <div className="text-sm text-gray-500">{tarif.nbMois} mois - {tarif.montant}€</div>
        </div>
      )
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
      key: 'status',
      label: 'Statut',
      render: (value: any, inscription: Inscription) => {
        const status = getInscriptionStatus(inscription);
        return (
          <span className={`px-2 py-1 rounded text-xs ${status.color}`}>
            {status.label}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, inscription: Inscription) => (
        <div className="flex space-x-2">
          <button className="text-green-600 hover:text-green-800" title="Renouveler">
            <Clock className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actives' },
    { value: 'future', label: 'À venir' },
    { value: 'expired', label: 'Expirées' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Inscriptions</h2>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          onClick={openModal}
        >
          <Plus className="h-4 w-4" />
          <span>Nouvelle inscription</span>
        </button>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvelle inscription">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">{formError}</div>}
          {formSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">{formSuccess}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profil</label>
            <select
              name="profilId"
              value={form.profilId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un profil</option>
              {Array.isArray(profils) && profils
                .filter((p: any) => p && p.id !== undefined && p.id !== null)
                .map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} {p.prenom} ({p.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tarif</label>
            <select
              name="tarifId"
              value={form.tarifId}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un tarif</option>
              {Array.isArray(tarifs) && tarifs
                .filter((t: any) => t && t.tarifId !== undefined && t.tarifId !== null)
                .map((t: any) => (
                  <option key={t.tarifId} value={t.tarifId}>
                    {t.nbMois} mois - {t.montant}€ ({t.description})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={form.dateDebut}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={form.dateFin}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Ajout en cours...' : 'Créer l\'inscription'}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une inscription..."
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
          data={filteredInscriptions}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default InscriptionAdd; 