
import React from 'react';
import { Home, User, Plus, Search, MessageSquare } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'home' | 'search' | 'create' | 'messages' | 'profile';
  onTabChange: (tab: 'home' | 'search' | 'create' | 'messages' | 'profile') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'search', icon: Search, label: 'Cerca' },
    { id: 'create', icon: Plus, label: 'Crea' },
    { id: 'messages', icon: MessageSquare, label: 'Messaggi' },
    { id: 'profile', icon: User, label: 'Profilo' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-2 shadow-lg z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as any)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-blue text-white shadow-lg transform scale-105' 
                  : 'text-neutral-500 hover:text-primary-blue hover:bg-primary-blue/10'
              }`}
            >
              <Icon size={24} className={isActive ? 'animate-pulse' : ''} />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
