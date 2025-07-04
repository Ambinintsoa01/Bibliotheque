import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Settings,
  BarChart3,
  Bell,
  CreditCard,
  Search,
  BookmarkPlus,
  Home,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  role: 'admin' | 'client';
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout }) => {
  const adminMenuItems = [
    { to: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/admin/books', icon: BookOpen, label: 'Gestion des Livres' },
    { to: '/admin/users', icon: Users, label: 'Gestion des Utilisateurs' },
    { to: '/admin/loans', icon: Calendar, label: 'Gestion des Prêts' },
    { to: '/admin/reservations', icon: Clock, label: 'Validation Réservations' },
    { to: '/admin/penalties', icon: AlertTriangle, label: 'Gestion des Pénalités' },
    { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { to: '/admin/inscriptions', icon: Calendar, label: 'Inscriptions' },
    { to: '/admin/stats', icon: BarChart3, label: 'Statistiques' },
    { to: '/admin/settings', icon: Settings, label: 'Configuration' }
  ];

  const clientMenuItems = [
    { to: '/client/dashboard', icon: Home, label: 'Accueil' },
    { to: '/client/books', icon: Search, label: 'Rechercher des Livres' },
    { to: '/client/reservations', icon: BookmarkPlus, label: 'Mes Réservations' },
    { to: '/client/loans', icon: Calendar, label: 'Mes Prêts' },
    { to: '/client/notifications', icon: Bell, label: 'Notifications' },
    { to: '/client/profile', icon: Users, label: 'Mon Profil' }
  ];

  const menuItems = role === 'admin' ? adminMenuItems : clientMenuItems;

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-gray-900">BiblioManager</h2>
            <p className="text-sm text-gray-500 capitalize">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;