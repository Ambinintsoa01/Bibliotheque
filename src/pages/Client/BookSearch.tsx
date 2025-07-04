import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Calendar } from 'lucide-react';
import { Book } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const BookSearch: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', nom: 'Toutes les catégories' },
    { id: 1, nom: 'Littérature' },
    { id: 2, nom: 'Science-Fiction' },
    { id: 3, nom: 'Philosophie' },
    { id: 4, nom: 'Histoire' },
    { id: 5, nom: 'Sciences' }
  ];

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLivresDisponibles();
      setBooks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        setLoading(true);
        const data = await apiService.searchLivres(searchTerm);
        setBooks(data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setLoading(false);
      }
    } else {
      loadBooks();
    }
  };

  const handleReserve = async (bookId: number) => {
    if (!user) return;
    setError(null);
    try {
      await apiService.createReservation(bookId, user.id);
      alert('Réservation créée avec succès!');
      loadBooks();
    } catch (error: any) {
      console.error('Erreur lors de la réservation:', error);
      let message = 'Erreur lors de la réservation';
      if (error?.response?.data?.message) {
        message = error.response.data.message;
      } else if (error?.response?.data?.error) {
        message = error.response.data.error;
      } else if (error?.message) {
        message = error.message;
      }
      setError(message);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesCategory =
      selectedCategory === 'all' ||
      (book.categories &&
        book.categories.some(cat => String(cat.id) === String(selectedCategory)));
    return matchesCategory;
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
        <h2 className="text-2xl font-bold text-gray-900">Rechercher des Livres</h2>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, auteur, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Rechercher
          </button>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disponibilité
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Tous</option>
                  <option>Disponible</option>
                  <option>Emprunté</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année de publication
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toutes</option>
                  <option>2020-2024</option>
                  <option>2015-2019</option>
                  <option>2010-2014</option>
                  <option>Avant 2010</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Toutes</option>
                  <option>Français</option>
                  <option>Anglais</option>
                  <option>Espagnol</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const availableCount = book.exemplaires ? book.exemplaires.filter(e => e.disponible).length : 0;
            const isAvailable = availableCount > 0;

            return (
              <div key={book.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-3 aspect-h-4">
                  <img
                    src={book.imageCouverture || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop'}
                    alt={book.titre}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{book.titre}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {book.auteurs ? book.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ') : 'Auteur inconnu'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {book.description || 'Aucune description disponible'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {isAvailable ? `${availableCount} disponible(s)` : 'Indisponible'}
                    </span>
                    <div className="flex items-center space-x-1">
                      {book.categories && book.categories.map(cat => (
                        <span key={cat.id} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {cat.nom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleReserve(book.id)}
                      disabled={!isAvailable}
                      className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isAvailable
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {isAvailable ? 'Réserver' : 'Indisponible'}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <Heart className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun livre trouvé pour votre recherche</p>
            <p className="text-sm text-gray-400">Essayez avec d'autres mots-clés</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearch;