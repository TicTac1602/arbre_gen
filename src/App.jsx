import './App.css'
import ProjectSidebar from './components/ProjectSidebar'
import MainContent from './components/MainContent'

function App() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation Component */}
      <ProjectSidebar />
      {/* Main Content Area */}
      <MainContent />
    </div>
  )
}

export default App
