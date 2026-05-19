import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ShortTermRentalsPage from './pages/ShortTermRentalsPage';
import LongTermRentalsPage from './pages/LongTermRentalsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import FindAgentPage from './pages/FindAgentPage';
import AgentProfilePage from './pages/AgentProfilePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rentals/short-term" element={<ShortTermRentalsPage />} />
            <Route path="/rentals/long-term" element={<LongTermRentalsPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/find-agent" element={<FindAgentPage />} />
            <Route path="/agent/:id" element={<AgentProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}
