import React, { useState } from 'react';
import { Check, CheckCheck, Smile } from 'lucide-react';
import WaveformPlayer from './WaveformPlayer';

const EMOJI_LIST = ['❤️', '✨', '🔥', '🙌', '☕', '😍'];

export default function MessageBubble({ message, isSelf, onToggleReaction }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const reactions = message.reactions || {};

  return (
    <div className={`group relative flex items-end gap-2 my-2.5 ${isSelf ? 'justify-end' : 'justify-start'}`}>
      
      {/* Partner Avatar */}
      {!isSelf && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-white/80 mb-1 flex-shrink-0"
        />
      )}

      {/* Bubble Container */}
      <div className="relative max-w-[85%] sm:max-w-[70%]">
        
        {/* Hover Emoji Reaction Trigger */}
        <div
          className={`absolute -top-3.5 ${
            isSelf ? 'right-2' : 'left-2'
          } hidden group-hover:flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-white/80 z-10 animate-fade-in`}
        >
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onToggleReaction(message.id, emoji)}
              className="hover:scale-125 transition-transform text-xs p-0.5"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Sender Name in Group Chat */}
        {!isSelf && (
          <span className="block text-[10px] font-bold text-[#8C827A] mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        {/* Content Body */}
        <div className={`p-3.5 rounded-2xl ${isSelf ? 'bubble-self' : 'bubble-other'}`}>
          
          {/* TEXT MESSAGE */}
          {message.type === 'text' && (
            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words font-medium">
              {message.content}
            </p>
          )}

          {/* IMAGE ATTACHMENT */}
          {message.type === 'image' && (
            <div className="space-y-1.5">
              <img
                src={message.content}
                alt="Attachment"
                className="max-h-64 rounded-xl object-cover w-full shadow-sm hover:opacity-95 transition-opacity cursor-pointer"
                onClick={() => window.open(message.content, '_blank')}
              />
              {message.caption && (
                <p className="text-xs pt-1 font-medium">{message.caption}</p>
              )}
            </div>
          )}

          {/* VOICE NOTE */}
          {message.type === 'voice' && (
            <WaveformPlayer
              audioUrl={message.audioUrl || message.content}
              duration={message.duration}
              waveform={message.waveform}
            />
          )}

          {/* Timestamp & Read Receipt */}
          <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
            isSelf ? 'text-[#2A2624]/70' : 'text-[#8C827A]'
          }`}>
            <span>{message.timestamp}</span>
            {isSelf && (
              message.seen ? (
                <CheckCheck className="w-3 h-3 text-[#B8A7EA]" />
              ) : (
                <Check className="w-3 h-3 text-[#8C827A]" />
              )
            )}
          </div>
        </div>

        {/* Emoji Reactions Badges */}
        {Object.keys(reactions).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-1 ${isSelf ? 'justify-end' : 'justify-start'}`}>
            {Object.entries(reactions).map(([emoji, userUids]) => (
              <button
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 border border-white/80 text-[11px] font-semibold text-[#2A2624] shadow-xs hover:scale-105 transition-transform"
              >
                <span>{emoji}</span>
                <span className="text-[10px] text-[#8C827A]">{userUids.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
