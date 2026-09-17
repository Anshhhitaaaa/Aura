import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { CallProvider } from './context/CallContext';

import AuthModal from './components/auth/AuthModal';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import ChatList from './components/chat/ChatList';
import ChatWindow from './components/chat/ChatWindow';
import CallOverlay from './components/call/CallOverlay';

import FriendsModal from './components/friends/FriendsModal';
import ProfileModal from './components/profile/ProfileModal';
import NewGroupModal from './components/chat/NewGroupModal';

function MainApp() {
  const { currentUser, loading } = useAuth();
  
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' | 'friends' | 'profile'
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#E89CAE] to-[#B8A7EA] animate-spin mx-auto flex items-center justify-center text-white">
            ✨
          </div>
          <p className="font-display text-sm font-semibold text-[#7A726A]">Loading Aura...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthModal />;
  }

  return (
    <div className="h-full w-full flex flex-col md:flex-row overflow-hidden bg-[#FAF8F5] relative">
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFriendsModal={() => setIsFriendsOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenNewGroupModal={() => setIsNewGroupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-4rem)] md:h-full flex overflow-hidden">
        {/* Chat Sidebar (Hidden on mobile if viewing active chat) */}
        <ChatList
          onOpenNewGroupModal={() => setIsNewGroupOpen(true)}
        />

        {/* Active Chat Window */}
        <ChatWindow />
      </main>

      {/* WebRTC Voice / Video Call Overlay */}
      <CallOverlay />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFriendsModal={() => setIsFriendsOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        onOpenNewGroupModal={() => setIsNewGroupOpen(true)}
      />

      {/* Modals */}
      <FriendsModal
        isOpen={isFriendsOpen}
        onClose={() => setIsFriendsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <NewGroupModal
        isOpen={isNewGroupOpen}
        onClose={() => setIsNewGroupOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <CallProvider>
          <MainApp />
        </CallProvider>
      </ChatProvider>
    </AuthProvider>
  );
}
