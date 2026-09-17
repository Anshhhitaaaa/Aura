import React, { useState } from 'react';
import { X, UserPlus, Check, Trash2, Search, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function FriendsModal({ isOpen, onClose }) {
  const { friends, friendRequests, searchUsers, sendFriendRequest, acceptFriendRequest, declineFriendRequest } = useChat();
  
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearching(true);
    const results = await searchUsers(searchInput.trim());
    setSearchResults(results);
    setSearching(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2624]/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 relative border border-white/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#F0ECFC] text-[#B8A7EA]">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2A2624]">Find & Add Friends</h3>
              <p className="text-xs text-[#7A726A]">Search users by email, phone, or username</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Search Input */}
        <form onSubmit={handleSearch} className="space-y-2">
          <label className="block text-xs font-semibold text-[#4A423D]">Search Database</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C827A]" />
              <input
                type="text"
                placeholder="email, phone, or username..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
              />
            </div>
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white font-semibold text-xs shadow-sm hover:scale-105 transition-transform"
            >
              {searching ? '...' : 'Search'}
            </button>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
              Search Results ({searchResults.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {searchResults.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/80 border border-white/90"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-semibold text-xs text-[#2A2624]">{user.displayName}</h5>
                      <p className="text-[10px] text-[#7A726A]">{user.email || user.phoneNumber || `@${user.username}`}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => sendFriendRequest(user)}
                    className="px-3 py-1.5 rounded-xl bg-[#E89CAE] text-white font-semibold text-xs hover:opacity-90 transition-opacity"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests Section */}
        {friendRequests.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
              Pending Requests ({friendRequests.length})
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {friendRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/70 border border-white/80"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.from?.avatar}
                      alt={req.from?.displayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-semibold text-xs text-[#2A2624]">{req.from?.displayName}</h5>
                      <p className="text-[10px] text-[#7A726A]">@{req.from?.username}#{req.from?.tag}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => acceptFriendRequest(req.id)}
                      className="p-2 rounded-xl bg-[#98B09A] text-white hover:opacity-90 transition-opacity"
                      title="Accept"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => declineFriendRequest(req.id)}
                      className="p-2 rounded-xl bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                      title="Decline"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            Connected Friends ({friends.length})
          </h4>
          {friends.length === 0 ? (
            <p className="text-xs text-[#8C827A] italic text-center py-4">No friends added yet. Use search above!</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.map((friend) => (
                <div
                  key={friend.uid}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/60 border border-white/80"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={friend.avatar}
                      alt={friend.displayName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-semibold text-xs text-[#2A2624]">{friend.displayName}</h5>
                      <p className="text-[10px] text-[#7A726A]">@{friend.username}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
