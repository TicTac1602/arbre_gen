import { useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useProjectStore } from './store/projectStore';
import ProjectSidebar from './components/ProjectSidebar';
import MainContent from './components/MainContent';
import Auth from './components/Auth';

function AppContent() {
  const { user, loading } = useAuth();
  const setUser = useProjectStore((state) => state.setUser);
  const loadProjects = useProjectStore((state) => state.loadProjects);

  useEffect(() => {
    if (user) {
      setUser(user.id);
      loadProjects();
    } else {
      setUser(null);
    }
  }, [user, setUser, loadProjects]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation Component */}
      <ProjectSidebar />
      {/* Main Content Area */}
      <MainContent />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
