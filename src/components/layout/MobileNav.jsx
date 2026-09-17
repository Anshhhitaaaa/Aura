import React from 'react';
import { MessageCircle, Users, Plus, User, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function MobileNav({ activeTab, setActiveTab, onOpenFriendsModal, onOpenProfileModal, onOpenNewGroupModal }) {
  const { friendRequests } = useChat();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/60 flex items-center justify-around px-4 z-30 shadow-lg">
      <button
        onClick={() => setActiveTab('chats')}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === 'chats' ? 'text-[#E89CAE] font-bold scale-105' : 'text-[#7A726A]'
        }`}
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">Chats</span>
      </button>

      <button
        onClick={() => {
          setActiveTab('friends');
          onOpenFriendsModal();
        }}
        className={`relative flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === 'friends' ? 'text-[#B8A7EA] font-bold scale-105' : 'text-[#7A726A]'
        }`}
      >
        <Users className="w-5 h-5" />
        <span className="text-[10px]">Friends</span>
        {friendRequests.length > 0 && (
          <span className="absolute -top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#E89CAE] ring-2 ring-white" />
        )}
      </button>

      <button
        onClick={onOpenNewGroupModal}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
      </button>

      <button
        onClick={onOpenProfileModal}
        className={`flex flex-col items-center justify-center gap-1 transition-all ${
          activeTab === 'profile' ? 'text-[#98B09A] font-bold scale-105' : 'text-[#7A726A]'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
}
