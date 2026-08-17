import React, { useState, useEffect } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { JoinCommunity } from './pages/JoinCommunity';
import { TeamsHub } from './pages/TeamsHub';
import { SirCorner } from './pages/SirCorner';
import { SkillsAcademy } from './pages/SkillsAcademy';
import { Opportunities } from './pages/Opportunities';
import { Archive } from './pages/Archive';
import { HallOfTalent } from './pages/HallOfTalent';
import { CalendarView } from './pages/CalendarView';
import { Announcements } from './pages/Announcements';
import { AdminDashboard } from './pages/AdminDashboard';
import { storage } from './lib/storage';
import { Sparkles, MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  // Read initial page from hash if available
  const getPageFromHash = (): PageView => {
    const hash = window.location.hash.replace('#', '') as PageView;
    const validPages: PageView[] = [
      'home', 'join', 'teams', 'sircorner', 'skills', 
      'opportunities', 'archive', 'talent', 'calendar', 
      'announcements', 'admin'
    ];
    return validPages.includes(hash) ? hash : 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageView>(getPageFromHash);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('teater_admin_auth') === 'true';
  });

  // Sync hash with browser history
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(getPageFromHash());
      setIsAdminLoggedIn(localStorage.getItem('teater_admin_auth') === 'true');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle page navigation
  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('teater_admin_auth');
    setIsAdminLoggedIn(false);
    handleNavigate('home');
  };

  // Scroll listener for floating actions
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-amber-500 selection:text-black font-sans antialiased">
      
      {/* Top Navbar */}
      <Navbar 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => handleNavigate('admin')}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Dynamic Content View */}
      <main className="flex-1 pb-16">
        {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
        {currentPage === 'join' && <JoinCommunity onSuccessNavigate={() => handleNavigate('teams')} />}
        {currentPage === 'teams' && <TeamsHub onJoinCommunityClick={() => handleNavigate('join')} />}
        {currentPage === 'sircorner' && <SirCorner />}
        {currentPage === 'skills' && <SkillsAcademy />}
        {currentPage === 'opportunities' && <Opportunities />}
        {currentPage === 'archive' && <Archive />}
        {currentPage === 'talent' && <HallOfTalent />}
        {currentPage === 'calendar' && <CalendarView />}
        {currentPage === 'announcements' && <Announcements />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Action Button (Scroll to Top) */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/10 shadow-lg transition-all"
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}
