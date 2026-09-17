import React, { useState } from 'react';
import { Search, Plus, MessageSquare, Users, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function ChatList({ onOpenNewGroupModal }) {
  const { chats, activeChatId, setActiveChatId, typingUsers } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'direct' | 'group'

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name
      ? chat.name.toLowerCase().includes(searchTerm.toLowerCase())
      : chat.partner?.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterType === 'direct') return chat.type === 'direct';
    if (filterType === 'group') return chat.type === 'group';
    return true;
  });

  return (
    <div className="w-full md:w-80 lg:w-96 h-full flex flex-col glass-panel border-r border-white/50 p-4 space-y-4 flex-shrink-0">
      
      {/* Header & New Group Button */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-display font-bold text-xl text-[#2A2624] tracking-tight">Vibes</h2>
          <p className="text-xs text-[#7A726A]">Your conversations & spaces</p>
        </div>
        <button
          onClick={onOpenNewGroupModal}
          className="p-2 rounded-2xl bg-[#FCE8EC] text-[#E89CAE] hover:bg-[#E89CAE] hover:text-white transition-all shadow-sm"
          title="Create Group Chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
        <input
          type="text"
          placeholder="Search chats or friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#F3EFEA]">
        <button
          onClick={() => setFilterType('all')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'all'
              ? 'bg-white text-[#2A2624] shadow-xs'
              : 'text-[#7A726A] hover:text-[#2A2624]'
          }`}
        >
          All ({chats.length})
        </button>
        <button
          onClick={() => setFilterType('direct')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'direct'
              ? 'bg-white text-[#2A2624] shadow-xs'
              : 'text-[#7A726A] hover:text-[#2A2624]'
          }`}
        >
          Direct
        </button>
        <button
          onClick={() => setFilterType('group')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
            filterType === 'group'
              ? 'bg-white text-[#2A2624] shadow-xs'
              : 'text-[#7A726A] hover:text-[#2A2624]'
          }`}
        >
          Groups
        </button>
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filteredChats.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Sparkles className="w-8 h-8 text-[#B8A7EA] mx-auto mb-2 opacity-60 animate-bounce" />
            <p className="text-xs text-[#7A726A] font-medium">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isGroup = chat.type === 'group';
            const title = isGroup ? chat.name : chat.partner?.displayName;
            const avatar = isGroup ? chat.avatar : chat.partner?.avatar;
            const online = isGroup ? false : chat.partner?.online;
            const isTyping = typingUsers[chat.id];

            return (
              <button
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200 glass-card-hover ${
                  isActive
                    ? 'bg-gradient-to-r from-[#FCE8EC] to-[#F0ECFC] border-[#E89CAE]/40 shadow-sm'
                    : 'bg-white/60 hover:bg-white/90 border-white/60'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={avatar}
                    alt={title}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/80"
                  />
                  {!isGroup && (
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                        online ? 'bg-[#98B09A]' : 'bg-slate-300'
                      }`}
                    />
                  )}
                  {isGroup && (
                    <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#B8A7EA] text-white ring-2 ring-white">
                      <Users className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-xs text-[#2A2624] truncate">
                      {title}
                    </h3>
                    <span className="text-[10px] text-[#8C827A] font-medium">
                      {chat.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-[#7A726A] truncate">
                    {isTyping ? (
                      <span className="text-[#E89CAE] font-medium animate-pulse flex items-center gap-1">
                        <span>typing...</span>
                        <Sparkles className="w-3 h-3" />
                      </span>
                    ) : (
                      chat.lastMessage
                    )}
                  </p>
                </div>

                {/* Unread Badge */}
                {chat.unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E89CAE] text-white shadow-xs">
                    {chat.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
