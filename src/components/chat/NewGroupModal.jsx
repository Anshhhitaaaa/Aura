import React, { useState } from 'react';
import { X, Users, Sparkles, Check } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

export default function NewGroupModal({ isOpen, onClose }) {
  const { friends, createGroupChat } = useChat();
  const [groupName, setGroupName] = useState('');
  const [selectedUids, setSelectedUids] = useState([]);

  if (!isOpen) return null;

  const toggleSelect = (uid) => {
    setSelectedUids(prev =>
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUids.length === 0) return;
    createGroupChat(groupName.trim(), selectedUids);
    setGroupName('');
    setSelectedUids([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2624]/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 relative border border-white/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#F0ECFC] text-[#B8A7EA]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2A2624]">Create New Group</h3>
              <p className="text-xs text-[#7A726A]">Gather your circle in a shared space</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Group Channel Name</label>
            <input
              type="text"
              required
              placeholder="e.g. 🎨 Design & Vibe"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624] placeholder-[#8C827A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Select Members</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.map((friend) => {
                const isSelected = selectedUids.includes(friend.uid);
                return (
                  <div
                    key={friend.uid}
                    onClick={() => toggleSelect(friend.uid)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-[#FCE8EC] border-[#E89CAE]'
                        : 'bg-white/60 border-white/80 hover:bg-white'
                    }`}
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

                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#E89CAE] border-[#E89CAE] text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={!groupName.trim() || selectedUids.length === 0}
            className={`w-full py-3 px-4 rounded-2xl text-white font-semibold text-xs transition-all shadow-sm ${
              groupName.trim() && selectedUids.length > 0
                ? 'bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] hover:scale-105'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            Create Group ({selectedUids.length} selected)
          </button>
        </form>

      </div>
    </div>
  );
}
