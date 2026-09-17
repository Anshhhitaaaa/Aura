import React, { useState } from 'react';
import { X, User, Sparkles, Check, Copy, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80'
];

export default function ProfileModal({ isOpen, onClose }) {
  const { currentUser, updateUserProfile, logout } = useAuth();
  
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [status, setStatus] = useState(currentUser?.status || 'In the flow ☕');
  const [avatar, setAvatar] = useState(currentUser?.avatar || PRESET_AVATARS[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ displayName, bio, status, avatar });
    onClose();
  };

  const copyFriendCode = () => {
    const code = `@${currentUser.username}#${currentUser.tag}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2624]/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md glass-card rounded-3xl p-6 relative border border-white/80 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-[#FCE8EC] text-[#E89CAE]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2A2624]">Your Profile</h3>
              <p className="text-xs text-[#7A726A]">Customize your quiet luxury presence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:bg-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Friend Code */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <img
              src={avatar}
              alt={displayName}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-[#E89CAE]/50 shadow-md mx-auto"
            />
          </div>

          <div>
            <h4 className="font-display font-bold text-base text-[#2A2624]">{currentUser.displayName}</h4>
            <button
              onClick={copyFriendCode}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F3EFEA] text-xs font-semibold text-[#4A423D] hover:bg-[#EFEAE1] transition-colors mt-1"
            >
              <span>@{currentUser.username}#{currentUser.tag}</span>
              {copied ? <Check className="w-3 h-3 text-[#98B09A]" /> : <Copy className="w-3 h-3 text-[#8C827A]" />}
            </button>
          </div>
        </div>

        {/* Preset Avatar Chooser */}
        <div>
          <label className="block text-xs font-semibold text-[#4A423D] mb-1.5">Choose Avatar</label>
          <div className="flex items-center justify-center gap-3">
            {PRESET_AVATARS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Preset"
                onClick={() => setAvatar(url)}
                className={`w-12 h-12 rounded-2xl object-cover cursor-pointer transition-all ${
                  avatar === url ? 'ring-4 ring-[#E89CAE] scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#4A423D] mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A423D] mb-1">Status Tagline</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#4A423D] mb-1">Bio</label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl glass-input text-xs text-[#2A2624]"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={logout}
              className="flex-1 py-3 px-4 rounded-2xl border border-red-200 text-red-500 font-semibold text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white font-semibold text-xs shadow-sm hover:scale-105 transition-transform"
            >
              Save Profile
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
