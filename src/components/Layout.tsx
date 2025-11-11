import { ReactNode } from 'react';
import { Home, List, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'main' | 'states' | 'profile';
  onNavigate: (page: 'main' | 'states' | 'profile') => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-orange-500">WSET</h1>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">로그아웃</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around">
            <button
              onClick={() => onNavigate('main')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition ${
                currentPage === 'main'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">메인</span>
            </button>

            <button
              onClick={() => onNavigate('states')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition ${
                currentPage === 'states'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="w-6 h-6" />
              <span className="text-xs font-medium">상태관리</span>
            </button>

            <button
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center gap-1 py-3 px-6 transition ${
                currentPage === 'profile'
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">프로필</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
