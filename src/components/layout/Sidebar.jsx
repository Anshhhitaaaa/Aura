import React, { useState } from 'react';
import { MessageCircle, Users, Plus, LogOut, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';

export default function Sidebar({ activeTab, setActiveTab, onOpenFriendsModal, onOpenProfileModal, onOpenNewGroupModal }) {
  const { currentUser, logout } = useAuth();
  const { friendRequests } = useChat();

  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sidebar is wide if user pinned it or is hovering over it
  const isExpanded = isPinned || isHovered;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`hidden md:flex flex-col h-full glass-panel border-r border-white/50 p-3 justify-between transition-all duration-300 ease-out z-20 ${
        isExpanded ? 'w-64' : 'w-[76px]'
      }`}
    >
      {/* Top Branding & Navigation */}
      <div className="space-y-6">
        
        {/* Logo & Expand Toggle */}
        <div className="flex items-center justify-between px-1">
          <div 
            onClick={() => setIsPinned(!isPinned)}
            className="flex items-center gap-3 cursor-pointer group/logo"
            title={isPinned ? 'Click to collapse sidebar' : 'Click to pin sidebar open'}
          >
            <div className="w-11 h-11 rounded-2xl p-0.5 shadow-md flex-shrink-0 overflow-hidden ring-2 ring-white/90 group-hover/logo:scale-105 transition-transform">
              <img src="/aura-logo.jpg" alt="Aura Logo" className="w-full h-full object-cover rounded-[14px]" />
            </div>

            <div className={`overflow-hidden transition-all duration-300 ${
              isExpanded ? 'w-36 opacity-100' : 'w-0 opacity-0'
            }`}>
              <h1 className="font-display font-bold text-lg text-[#2A2624] tracking-tight whitespace-nowrap">Aura</h1>
              <p className="text-[9px] text-[#7A726A] font-bold tracking-wider uppercase whitespace-nowrap">Quiet Luxury</p>
            </div>
          </div>

          {/* Toggle Expand/Collapse Pin Button */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`p-1.5 rounded-xl text-[#8C827A] hover:bg-white/80 hover:text-[#2A2624] transition-all ${
              isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar Open'}
          >
            {isPinned ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {/* 1. MESSAGES */}
          <button
            onClick={() => setActiveTab('chats')}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'chats'
                ? 'bg-gradient-to-r from-[#FCE8EC] to-[#F0ECFC] text-[#2A2624] shadow-sm font-semibold'
                : 'text-[#7A726A] hover:bg-white/70 hover:text-[#2A2624]'
            }`}
            title="Messages"
          >
            <MessageCircle className={`w-5 h-5 flex-shrink-0 ${activeTab === 'chats' ? 'text-[#E89CAE]' : ''}`} />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              Messages
            </span>
          </button>

          {/* 2. FRIENDS */}
          <button
            onClick={() => {
              setActiveTab('friends');
              onOpenFriendsModal();
            }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-[#FCE8EC] to-[#F0ECFC] text-[#2A2624] shadow-sm font-semibold'
                : 'text-[#7A726A] hover:bg-white/70 hover:text-[#2A2624]'
            }`}
            title="Friends"
          >
            <div className="flex items-center gap-3.5">
              <Users className={`w-5 h-5 flex-shrink-0 ${activeTab === 'friends' ? 'text-[#B8A7EA]' : ''}`} />
              <span className={`whitespace-nowrap transition-all duration-300 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
              }`}>
                Friends
              </span>
            </div>

            {friendRequests.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E89CAE] text-white shadow-xs flex-shrink-0 ${
                !isExpanded ? 'absolute top-1 right-1' : ''
              }`}>
                {friendRequests.length}
              </span>
            )}
          </button>

          {/* 3. NEW GROUP */}
          <button
            onClick={onOpenNewGroupModal}
            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl font-medium text-sm text-[#7A726A] hover:bg-white/70 hover:text-[#2A2624] transition-all"
            title="New Group"
          >
            <Plus className="w-5 h-5 text-[#98B09A] flex-shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-300 ${
              isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'
            }`}>
              New Group
            </span>
          </button>
        </nav>
      </div>

      {/* Bottom User Card */}
      <div className="space-y-3">
        {currentUser && (
          <div className="flex items-center justify-between p-2 rounded-2xl glass-card overflow-hidden">
            <button 
              onClick={onOpenProfileModal}
              className="flex items-center gap-3 text-left w-full overflow-hidden"
              title="Profile Settings"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#98B09A] ring-2 ring-white" />
              </div>

              <div className={`truncate transition-all duration-300 ${
                isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
              }`}>
                <h4 className="font-semibold text-xs text-[#2A2624] truncate">
                  {currentUser.displayName}
                </h4>
                <p className="text-[10px] text-[#7A726A] truncate">
                  @{currentUser.username}#{currentUser.tag}
                </p>
              </div>
            </button>

            {isExpanded && (
              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-xl text-[#8C827A] hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
