import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import Table from '../../components/Common/Table';
import Modal from '../../components/Common/Modal';
import { Book } from '../../types';
import { apiService } from '../../services/api';

const BookManagement: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('titre');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLivres();
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

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (bookId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      try {
        await apiService.deleteLivre(bookId);
        loadBooks();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du livre');
      }
    }
  };

  const filteredBooks = books.filter(book =>
    book.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (book.auteurs && book.auteurs.some(author => 
      `${author.prenom} ${author.nom}`.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    book.isbn.includes(searchTerm)
  );

  const columns = [
    {
      key: 'imageCouverture',
      label: 'Couverture',
      render: (value: string) => (
        <img 
          src={value || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=60&h=80&fit=crop'} 
          alt="Couverture" 
          className="w-10 h-14 object-cover rounded"
        />
      )
    },
    { key: 'titre', label: 'Titre', sortable: true },
    { 
      key: 'auteurs', 
      label: 'Auteur(s)',
      render: (auteurs: any[]) => auteurs ? auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ') : 'Aucun auteur'
    },
    { key: 'isbn', label: 'ISBN' },
    { 
      key: 'exemplaires',
      label: 'Exemplaires',
      render: (exemplaires: any[]) => {
        if (!exemplaires) return '0 total';
        const disponibles = exemplaires.filter(e => e.disponible).length;
        return (
          <div className="flex space-x-2">
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
              {disponibles} disponible(s)
            </span>
            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded">
              {exemplaires.length} total
            </span>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, book: Book) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => {
              setSelectedBook(book);
              setShowModal(true);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button className="text-yellow-600 hover:text-yellow-800">
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDelete(book.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Livres</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Ajouter un livre</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un livre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Rechercher
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <Filter className="h-4 w-4" />
              <span>Filtres</span>
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={filteredBooks}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Détails du Livre"
        size="lg"
      >
        {selectedBook && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <img 
                src={selectedBook.imageCouverture || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop'} 
                alt={selectedBook.titre}
                className="w-32 h-48 object-cover rounded-lg mx-auto sm:mx-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedBook.titre}</h3>
                <p className="text-gray-600 mb-2">
                  <strong>Auteur(s):</strong> {selectedBook.auteurs ? selectedBook.auteurs.map(a => `${a.prenom} ${a.nom}`).join(', ') : 'Aucun auteur'}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>ISBN:</strong> {selectedBook.isbn}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Édition:</strong> {selectedBook.edition || 'Non spécifiée'}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Date de publication:</strong> {selectedBook.datePublication || 'Non spécifiée'}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Description:</strong> {selectedBook.description || 'Aucune description'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Exemplaires</h4>
              <div className="space-y-2">
                {selectedBook.exemplaires && selectedBook.exemplaires.length > 0 ? (
                  selectedBook.exemplaires.map((exemplaire) => (
                    <div key={exemplaire.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{exemplaire.numExemplaire}</span>
                        <span className="mx-2">•</span>
                        <span className="text-sm text-gray-600">État: {exemplaire.etat}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        exemplaire.disponible 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exemplaire.disponible ? 'Disponible' : 'Emprunté'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Aucun exemplaire disponible</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookManagement;