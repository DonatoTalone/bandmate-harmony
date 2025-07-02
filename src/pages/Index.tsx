
import React, { useState, useEffect } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import HomeScreen from '@/components/screens/HomeScreen';
import SearchScreen from '@/components/screens/SearchScreen';
import CreateScreen from '@/components/screens/CreateScreen';
import MessagesScreen from '@/components/screens/MessagesScreen';
import ProfileScreen from '@/components/screens/ProfileScreen';
import LoginScreen from '@/components/LoginScreen';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'create' | 'messages' | 'profile'>('home');
  const { user, isLoading } = useAuth();

  // Render lo schermo attivo
  const renderActiveScreen = () => {
    if (!user) {
      return <LoginScreen onLoginSuccess={() => setActiveTab('home')} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onTabChange={setActiveTab} />;
      case 'search':
        return <SearchScreen />;
      case 'create':
        return <CreateScreen />;
      case 'messages':
        return <MessagesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onTabChange={setActiveTab} />;
    }
  };

  // Se è in caricamento, mostra un indicatore di caricamento
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16">
        {renderActiveScreen()}
      </main>
      {user && (
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
};

export default Index;
