import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Plus, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs = [
    { id: 'general', label: 'Général' },
    { id: 'loans', label: 'Prêts' },
    { id: 'penalties', label: 'Pénalités' },
    { id: 'quotas', label: 'Quotas' },
    { id: 'holidays', label: 'Jours Fériés' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await apiService.getSettings();
      // Si pas de données, utiliser des valeurs par défaut
      if (!data || Object.keys(data).length === 0) {
        setSettings({
          general: {
            libraryName: 'Bibliothèque Municipale',
            address: '123 Rue de la Bibliothèque, 75001 Paris',
            phone: '01 23 45 67 89',
            email: 'contact@bibliotheque.fr',
            openingHours: '9h-18h du lundi au vendredi'
          },
          loans: {
            defaultLoanDuration: 14,
            maxRenewals: 2,
            reminderDays: 3
          },
          penalties: {
            dailyPenalty: 0.5,
            maxPenalty: 50,
            gracePeriod: 1
          },
          quotas: {
            student: 5,
            professor: 10,
            professional: 3,
            anonymous: 2
          }
        });
      } else {
        setSettings({
          general: {
            libraryName: data.libraryName || 'Bibliothèque Municipale',
            address: data.address || '123 Rue de la Bibliothèque, 75001 Paris',
            phone: data.phone || '01 23 45 67 89',
            email: data.email || 'contact@bibliotheque.fr',
            openingHours: data.openingHours || '9h-18h du lundi au vendredi'
          },
          loans: {
            defaultLoanDuration: data.defaultLoanDuration || 14,
            maxRenewals: data.maxRenewals || 2,
            reminderDays: data.reminderDays || 3
          },
          penalties: {
            dailyPenalty: data.dailyPenalty || 0.5,
            maxPenalty: data.maxPenalty || 50,
            gracePeriod: data.gracePeriod || 1
          },
          quotas: {
            student: data.studentQuota || 5,
            professor: data.professorQuota || 10,
            professional: data.professionalQuota || 3,
            anonymous: data.anonymousQuota || 2
          }
        });
      }
      setHolidays(data?.holidays || []);
      setLoading(false);
    } catch (error) {
      // En cas d'erreur, utiliser des valeurs par défaut
      setSettings({
        general: {
          libraryName: 'Bibliothèque Municipale',
          address: '123 Rue de la Bibliothèque, 75001 Paris',
          phone: '01 23 45 67 89',
          email: 'contact@bibliotheque.fr',
          openingHours: '9h-18h du lundi au vendredi'
        },
        loans: {
          defaultLoanDuration: 14,
          maxRenewals: 2,
          reminderDays: 3
        },
        penalties: {
          dailyPenalty: 0.5,
          maxPenalty: 50,
          gracePeriod: 1
        },
        quotas: {
          student: 5,
          professor: 10,
          professional: 3,
          anonymous: 2
        }
      });
      setHolidays([]);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    setLoading(true);
    setSaveSuccess(false);
    const payload = {
      dailyPenalty: settings.penalties.dailyPenalty,
      maxPenalty: settings.penalties.maxPenalty,
      gracePeriod: settings.penalties.gracePeriod,
      defaultLoanDuration: settings.loans.defaultLoanDuration,
      maxRenewals: settings.loans.maxRenewals,
      reminderDays: settings.loans.reminderDays,
      studentQuota: settings.quotas.student,
      professorQuota: settings.quotas.professor,
      professionalQuota: settings.quotas.professional,
      anonymousQuota: settings.quotas.anonymous
    };
    try {
      await apiService.saveSettings(payload);
      setSaveSuccess(true);
      await loadSettings();
    } catch (error) {
      // Gérer l'erreur
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const addHoliday = () => {
    const newHoliday = {
      id: Date.now(),
      date: '',
      description: ''
    };
    setHolidays([...holidays, newHoliday]);
  };

  const removeHoliday = (id: number) => {
    setHolidays(holidays.filter(h => h.id !== id));
  };

  const updateHoliday = (id: number, field: string, value: string) => {
    setHolidays(holidays.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  };

  if (loading || !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Configuration</h2>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Sauvegarder</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Succès!</strong>
          <span className="block sm:inline">Les modifications ont été sauvegardées avec succès.</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Informations Générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de la bibliothèque
                  </label>
                  <input
                    type="text"
                    value={settings.general.libraryName}
                    onChange={(e) => handleSettingChange('general', 'libraryName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={settings.general.phone}
                    onChange={(e) => handleSettingChange('general', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.general.email}
                    onChange={(e) => handleSettingChange('general', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horaires d'ouverture
                  </label>
                  <input
                    type="text"
                    value={settings.general.openingHours}
                    onChange={(e) => handleSettingChange('general', 'openingHours', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'loans' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Paramètres des Prêts</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée par défaut (jours)
                  </label>
                  <input
                    type="number"
                    value={settings.loans.defaultLoanDuration}
                    onChange={(e) => handleSettingChange('loans', 'defaultLoanDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prolongations max
                  </label>
                  <input
                    type="number"
                    value={settings.loans.maxRenewals}
                    onChange={(e) => handleSettingChange('loans', 'maxRenewals', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rappel avant (jours)
                  </label>
                  <input
                    type="number"
                    value={settings.loans.reminderDays}
                    onChange={(e) => handleSettingChange('loans', 'reminderDays', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'penalties' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Paramètres des Pénalités</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pénalité quotidienne (€)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={settings.penalties.dailyPenalty}
                    onChange={(e) => handleSettingChange('penalties', 'dailyPenalty', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pénalité maximum (€)
                  </label>
                  <input
                    type="number"
                    value={settings.penalties.maxPenalty}
                    onChange={(e) => handleSettingChange('penalties', 'maxPenalty', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Délai de grâce (jours)
                  </label>
                  <input
                    type="number"
                    value={settings.penalties.gracePeriod}
                    onChange={(e) => handleSettingChange('penalties', 'gracePeriod', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quotas' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Quotas de Prêt par Type d'Utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Étudiants
                  </label>
                  <input
                    type="number"
                    value={settings.quotas.student}
                    onChange={(e) => handleSettingChange('quotas', 'student', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professeurs
                  </label>
                  <input
                    type="number"
                    value={settings.quotas.professor}
                    onChange={(e) => handleSettingChange('quotas', 'professor', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professionnels
                  </label>
                  <input
                    type="number"
                    value={settings.quotas.professional}
                    onChange={(e) => handleSettingChange('quotas', 'professional', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Anonymes
                  </label>
                  <input
                    type="number"
                    value={settings.quotas.anonymous}
                    onChange={(e) => handleSettingChange('quotas', 'anonymous', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'holidays' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Jours Fériés</h3>
                <button
                  onClick={addHoliday}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Ajouter</span>
                </button>
              </div>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center space-x-3">
                    <input
                      type="date"
                      value={holiday.date}
                      onChange={(e) => updateHoliday(holiday.id, 'date', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={holiday.description}
                      onChange={(e) => updateHoliday(holiday.id, 'description', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => removeHoliday(holiday.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;