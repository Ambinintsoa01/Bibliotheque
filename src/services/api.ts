const API_BASE_URL = 'http://localhost:8080/api';

interface LoginRequest {
  email: string;
  password: string;
  role: 'admin' | 'client';
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
      }
      return data;
    } catch (error) {
      return { success: false, error: "Impossible de contacter le serveur" };
    }
  }

  async getLivres() {
    const response = await fetch(`${API_BASE_URL}/livres`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async searchLivres(query: string) {
    const response = await fetch(`${API_BASE_URL}/livres/search?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getLivresDisponibles() {
    const response = await fetch(`${API_BASE_URL}/livres/disponibles`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createLivre(livreData: any) {
    const response = await fetch(`${API_BASE_URL}/livres`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(livreData),
    });
    return response.json();
  }

  async updateLivre(id: number, livreData: any) {
    const response = await fetch(`${API_BASE_URL}/livres/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(livreData),
    });
    return response.json();
  }

  async deleteLivre(id: number) {
    const response = await fetch(`${API_BASE_URL}/livres/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  async getReservations() {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getReservationsEnAttente() {
    const response = await fetch(`${API_BASE_URL}/reservations/en-attente`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getReservationsByProfil(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/reservations/profil/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createReservation(livreId: number, profilId: number) {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ livreId, profilId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data } };
    }
    return data;
  }

  async validerReservation(id: number) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/valider`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async rejeterReservation(id: number) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/rejeter`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async annulerReservation(id: number) {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  async getProfils() {
    const response = await fetch(`${API_BASE_URL}/profils`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getProfilsByType(type: string) {
    const response = await fetch(`${API_BASE_URL}/profils/type/${type}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async searchProfils(query: string) {
    const response = await fetch(`${API_BASE_URL}/profils/search?q=${encodeURIComponent(query)}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createProfil(profilData: any) {
    const response = await fetch(`${API_BASE_URL}/profils`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profilData),
    });
    return response.json();
  }

  async updateProfil(id: number, profilData: any) {
    const response = await fetch(`${API_BASE_URL}/profils/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profilData),
    });
    return response.json();
  }

  async deleteProfil(id: number) {
    const response = await fetch(`${API_BASE_URL}/profils/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.ok;
  }

  async getPrets() {
    const response = await fetch(`${API_BASE_URL}/prets`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getPretsActifs() {
    const response = await fetch(`${API_BASE_URL}/prets/actifs`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getPretsEnRetard() {
    const response = await fetch(`${API_BASE_URL}/prets/retard`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async retournerPret(pretId: number, dateRendu: string) {
    const response = await fetch(`${API_BASE_URL}/prets/${pretId}/retour`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ dateRendu }),
    });
    return response.json();
  }

  async getPenalites() {
    const response = await fetch(`${API_BASE_URL}/penalites`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getPenalitesActives() {
    const response = await fetch(`${API_BASE_URL}/penalites/actives`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async marquerPenalitePayee(penaliteId: number) {
    const response = await fetch(`${API_BASE_URL}/penalites/${penaliteId}/payer`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur marquerPenalitePayee:', response.status, errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async annulerPenalite(penaliteId: number) {
    const response = await fetch(`${API_BASE_URL}/penalites/${penaliteId}/annuler`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur annulerPenalite:', response.status, errorText);
      throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async getTotalPenalitesActives() {
    const response = await fetch(`${API_BASE_URL}/penalites/total-actives`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getTotalPenalitesPayees() {
    const response = await fetch(`${API_BASE_URL}/penalites/total-payees`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getPretsByProfil(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/prets/profil/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async demanderProlongation(pretId: number, nombreJours: number) {
    const response = await fetch(`${API_BASE_URL}/prets/${pretId}/prolonger`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ nombreJours }),
    });
    return response.json();
  }

  async getNotificationsByProfil(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/profils/notifications/profil/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async marquerNotificationLue(notificationId: number) {
    const response = await fetch(`${API_BASE_URL}/profils/notifications/${notificationId}/lue`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Si la réponse est vide, retourner un objet vide
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async marquerToutesNotificationsLues(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/profils/notifications/profil/${profilId}/toutes-lues`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    // Si la réponse est vide, retourner un objet vide
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }

  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getActivitesRecentes() {
    const response = await fetch(`${API_BASE_URL}/stats/activites-recentes`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getPretsParMois() {
    const response = await fetch(`${API_BASE_URL}/stats/prets-par-mois`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getDetailedStatistics() {
    const response = await fetch(`${API_BASE_URL}/stats/statistics`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getStatsClient(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/stats/client/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getLivresRecents(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/livres/recents/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getRecommandations(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/livres/recommandations/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async verifierPenalitesProfil(profilId: number) {
    const response = await fetch(`${API_BASE_URL}/prets/verifier-penalites/${profilId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createPret({ exemplaireId, profilId, bibliothequaireId, typePret = 0, dureePret = 14 }: {
    exemplaireId: number;
    profilId: number;
    bibliothequaireId: number;
    typePret?: number;
    dureePret?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/prets`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ exemplaireId, profilId, bibliothequaireId, typePret, dureePret }),
    });
    return response.json();
  }

  async getAllNotifications() {
    const response = await fetch(`${API_BASE_URL}/profils/notifications/all`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    try {
      return await response.json();
    } catch (error) {
      console.error('Erreur lors du parsing de la réponse:', error);
      throw new Error('Erreur lors du traitement de la réponse du serveur');
    }
  }

  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async saveSettings(settings: any) {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return response.json();
  }

  async getInscriptions() {
    const response = await fetch(`${API_BASE_URL}/inscriptions`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getInscription(id: number) {
    const response = await fetch(`${API_BASE_URL}/inscriptions/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async addInscription(inscription: any) {
    const response = await fetch(`${API_BASE_URL}/inscriptions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(inscription),
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data } };
    }
    return data;
  }

  async getTarifsInscription() {
    const response = await fetch(`${API_BASE_URL}/inscriptions/tarifs`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getTarifInscription(id: number) {
    const response = await fetch(`${API_BASE_URL}/inscriptions/tarifs/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async addInscriptionStatus(status: any) {
    const response = await fetch(`${API_BASE_URL}/inscriptions/status`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(status),
    });
    const data = await response.json();
    if (!response.ok) {
      throw { response: { data } };
    }
    return data;
  }

  async getInscriptionStatus() {
    const response = await fetch(`${API_BASE_URL}/inscriptions/status`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async debugInscriptions() {
    const response = await fetch(`${API_BASE_URL}/inscriptions/debug`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }
}

export const apiService = new ApiService();