export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: 'admin' | 'client';
  telephone?: string;
  dateInscription: string;
  adherantType?: 'Prof' | 'Etudiant' | 'Professionnel' | 'Anonyme';
}

export interface Book {
  id: number;
  titre: string;
  isbn: string;
  auteurs: Author[];
  editeur?: Publisher;
  categories: Category[];
  description?: string;
  datePublication?: string;
  imageCouverture?: string;
  exemplaires: Exemplaire[];
  edition?: string;
}

export interface Author {
  id: number;
  nom: string;
  prenom?: string;
  nationalite?: string;
  dateNaissance?: string;
  dateDeces?: string;
  biographie?: string;
}

export interface Publisher {
  id: number;
  nom: string;
  adresse?: string;
  contact?: string;
  siteWeb?: string;
}

export interface Category {
  id: number;
  nom: string;
  description?: string;
  parentId?: number;
}

export interface Exemplaire {
  id: number;
  numExemplaire: string;
  etat: 'Neuf' | 'Bon' | 'Moyen' | 'Mauvais' | 'Hors service';
  dateAcquisition: string;
  emplacement?: Location;
  disponible: boolean;
  livre?: {
    id: number;
    titre: string;
    isbn: string;
  };
}

export interface Location {
  id: number;
  nom: string;
  description?: string;
  salle: string;
  etagere: string;
  position: string;
}

export interface Loan {
  id: number;
  exemplaire: Exemplaire;
  profil: User;
  bibliothequaire: User;
  datePret: string;
  dateFinPret: string;
  dateRendu?: string;
  type: 'domicile' | 'sur_place';
  enRetard: boolean;
  rendu: boolean;
  prolongations: Extension[];
}

export interface Extension {
  id: number;
  datedemande: string;
  nouvelleDateFin: string;
  statut: 'En attente' | 'Approuvé' | 'Refusé';
  motifRefus?: string;
}

export interface Reservation {
  id: number;
  exemplaire: Exemplaire;
  profil: User;
  dateResa: string;
  dateExpiration: string;
  statut: 'En attente' | 'Disponible' | 'Annulée' | 'Expirée';
}

export interface Penalty {
  id: number;
  profil: User;
  dateDebut: string;
  dateFin: string;
  montant: number;
  raisons: string;
  statut: 'Active' | 'Payée' | 'Annulée';
  pret?: Loan;
}

export interface Notification {
  id: number;
  profil: User;
  message: string;
  dateEnvoi: string;
  type: 'Rappel' | 'Penalite' | 'Disponibilite' | 'Information';
  statut: 'Non lu' | 'Lu';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Stats {
  totalBooks: number;
  totalUsers: number;
  activeLoans: number;
  pendingReservations: number;
  overdueLoans: number;
  totalPenalties: number;
}