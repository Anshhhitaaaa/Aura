import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  Search, 
  MoreVertical, 
  Smile, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Send, 
  Sparkles,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useCall } from '../../context/CallContext';
import MessageBubble from './MessageBubble';
import VoiceRecorder from './VoiceRecorder';

export default function ChatWindow() {
  const { currentUser } = useAuth();
  const { activeChat, messages, sendMessage, sendAttachment, toggleReaction, typingUsers } = useChat();
  const { initiateCall } = useCall();

  const [inputMessage, setInputMessage] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showEmojiQuick, setShowEmojiQuick] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!activeChat) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center glass-panel">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FCE8EC] to-[#F0ECFC] flex items-center justify-center text-[#E89CAE] mb-4 shadow-inner animate-float">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="font-display font-bold text-xl text-[#2A2624]">Select a vibe to start chatting</h3>
        <p className="text-xs text-[#7A726A] mt-1 max-w-sm">
          Connect 1:1 with friends or join a group channel for quiet luxury conversations & WebRTC calls.
        </p>
      </div>
    );
  }

  const isGroup = activeChat.type === 'group';
  const title = isGroup ? activeChat.name : activeChat.partner?.displayName;
  const avatar = isGroup ? activeChat.avatar : activeChat.partner?.avatar;
  const online = isGroup ? false : activeChat.partner?.online;
  const isTyping = typingUsers[activeChat.id];

  const handleSendText = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleImageFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sendAttachment(file, 'image');
    }
  };

  const handleVoiceSend = (blob, metadata) => {
    sendAttachment(blob, 'voice', metadata);
    setIsRecordingVoice(false);
  };

  return (
    <div className="flex-1 h-full flex flex-col glass-panel relative overflow-hidden">
      
      {/* 1. HEADER BAR */}
      <header className="h-16 px-6 glass-panel border-b border-white/60 flex items-center justify-between z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={avatar}
              alt={title}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/80"
            />
            {!isGroup && (
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                online ? 'bg-[#98B09A]' : 'bg-slate-300'
              }`} />
            )}
          </div>

          <div>
            <h2 className="font-display font-bold text-sm text-[#2A2624] tracking-tight">{title}</h2>
            <p className="text-[11px] text-[#7A726A] flex items-center gap-1 font-medium">
              {isGroup ? (
                <>
                  <Users className="w-3 h-3 text-[#B8A7EA]" />
                  <span>{activeChat.participants?.length || 4} members</span>
                </>
              ) : (
                online ? (
                  <span className="text-[#98B09A] font-semibold">Online</span>
                ) : (
                  <span>Offline</span>
                )
              )}
            </p>
          </div>
        </div>

        {/* WebRTC Call & Action Triggers */}
        <div className="flex items-center gap-1 sm:gap-2">
          {!isGroup && activeChat.partner && (
            <>
              <button
                onClick={() => initiateCall(activeChat.partner, 'voice')}
                className="p-2.5 rounded-2xl bg-white/70 text-[#2A2624] hover:bg-[#FCE8EC] hover:text-[#E89CAE] transition-all shadow-xs border border-white/80"
                title="Start Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => initiateCall(activeChat.partner, 'video')}
                className="p-2.5 rounded-2xl bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white hover:opacity-95 transition-all shadow-xs"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          <button className="p-2.5 rounded-2xl text-[#8C827A] hover:bg-white transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2.5 rounded-2xl text-[#8C827A] hover:bg-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MESSAGE TIMELINE */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl bg-[#F0ECFC] text-[#B8A7EA] mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <p className="text-xs text-[#7A726A] font-medium">Beginning of your conversation ✨</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSelf={msg.senderId === currentUser?.uid}
              onToggleReaction={toggleReaction}
            />
          ))
        )}

        {/* Typing Banner */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#E89CAE] font-medium py-2 px-3 rounded-2xl bg-white/70 w-max border border-white/80 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Someone is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT FOOTER */}
      <footer className="p-4 glass-panel border-t border-white/60">
        
        {isRecordingVoice ? (
          <VoiceRecorder
            onSendVoice={handleVoiceSend}
            onCancel={() => setIsRecordingVoice(false)}
          />
        ) : (
          <form onSubmit={handleSendText} className="flex items-center gap-2">
            
            {/* Attachment Actions */}
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-2xl text-[#8C827A] hover:bg-white hover:text-[#2A2624] transition-colors"
                title="Send Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsRecordingVoice(true)}
                className="p-2.5 rounded-2xl text-[#8C827A] hover:bg-white hover:text-[#E89CAE] transition-colors"
                title="Record Voice Note"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            {/* Input Field */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Message ${title}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="w-full pl-4 pr-10 py-3 rounded-2xl glass-input text-xs sm:text-sm text-[#2A2624] placeholder-[#8C827A]"
              />

              {/* Emoji quick trigger */}
              <button
                type="button"
                onClick={() => setInputMessage(prev => prev + ' ✨')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#E89CAE] transition-colors text-xs"
              >
                ✨
              </button>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className={`p-3 rounded-2xl transition-all shadow-xs flex items-center justify-center ${
                inputMessage.trim()
                  ? 'bg-gradient-to-r from-[#E89CAE] to-[#B8A7EA] text-white hover:scale-105 active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </footer>
    </div>
  );
}
