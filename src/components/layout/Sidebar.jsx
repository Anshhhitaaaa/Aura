import React from 'react';
import { Sparkles, MessageCircle, Users, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenFriendsModal, onOpenProfileModal, onOpenNewGroupModal }) {
  const { currentUser, logout } = useAuth();
  const { friendRequests } = useChat();

  return (
    <aside className="hidden md:flex flex-col w-20 xl:w-64 h-full glass-panel border-r border-white/50 p-4 justify-between transition-all duration-300 z-20">
      
      {/* Branding & Nav */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-2xl p-0.5 shadow-md flex-shrink-0 overflow-hidden ring-2 ring-white">
            <img src="/aura-logo.jpg" alt="Aura Logo" className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div className="hidden xl:block">
            <h1 className="font-display font-bold text-lg text-[#2A2624] tracking-tight">Aura</h1>
            <p className="text-[10px] text-[#7A726A] font-medium tracking-wider uppercase">Quiet Luxury Social</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-[#FCE8EC] to-[#F0ECFC] text-[#2A2624] shadow-sm font-semibold'
                : 'text-[#7A726A] hover:bg-white/60 hover:text-[#2A2624]'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${activeTab === 'chats' ? 'text-[#E89CAE]' : ''}`} />
            <span className="hidden xl:inline">Messages</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('friends');
              onOpenFriendsModal();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-[#FCE8EC] to-[#F0ECFC] text-[#2A2624] shadow-sm font-semibold'
                : 'text-[#7A726A] hover:bg-white/60 hover:text-[#2A2624]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <Users className={`w-5 h-5 ${activeTab === 'friends' ? 'text-[#B8A7EA]' : ''}`} />
              <span className="hidden xl:inline">Friends</span>
            </div>
            {friendRequests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E89CAE] text-white shadow-sm">
                {friendRequests.length}
              </span>
            )}
          </button>

          <button
            onClick={onOpenNewGroupModal}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm text-[#7A726A] hover:bg-white/60 hover:text-[#2A2624] transition-all"
          >
            <Plus className="w-5 h-5 text-[#98B09A]" />
            <span className="hidden xl:inline">New Group</span>
          </button>
        </nav>
      </div>

      {/* User Controls */}
      <div className="space-y-3">
        {currentUser && (
          <div className="flex items-center justify-between p-2.5 rounded-2xl glass-card">
            <button 
              onClick={onOpenProfileModal}
              className="flex items-center gap-3 text-left w-full overflow-hidden"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#98B09A] ring-2 ring-white" />
              </div>

              <div className="hidden xl:block truncate">
                <h4 className="font-semibold text-xs text-[#2A2624] truncate">
                  {currentUser.displayName}
                </h4>
                <p className="text-[11px] text-[#7A726A] truncate">
                  @{currentUser.username}#{currentUser.tag}
                </p>
              </div>
            </button>

            <button
              onClick={logout}
              title="Sign Out"
              className="hidden xl:flex p-2 rounded-xl text-[#8C827A] hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
