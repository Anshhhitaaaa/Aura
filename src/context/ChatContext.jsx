import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  setDoc,
  doc, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});

  // 1. Subscribe to Live Firestore Chats
  useEffect(() => {
    if (!currentUser?.uid) {
      setChats([]);
      setActiveChatId(null);
      return;
    }

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (snapshot) => {
      const chatList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let partnerData = null;

          if (data.type === 'direct') {
            const partnerUid = data.participants.find(uid => uid !== currentUser.uid);
            if (partnerUid) {
              const partnerDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', partnerUid)));
              if (!partnerDoc.empty) {
                partnerData = partnerDoc.docs[0].data();
              }
            }
          }

          return {
            id: docSnap.id,
            ...data,
            partner: partnerData || {
              displayName: 'Aura Member',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
              online: true
            },
            lastMessageTime: data.updatedAt ? new Date(data.updatedAt?.toDate?.() || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'New'
          };
        })
      );

      setChats(chatList);
      if (!activeChatId && chatList.length > 0) {
        setActiveChatId(chatList[0].id);
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // 2. Subscribe to Active Chat Messages
  useEffect(() => {
    if (!currentUser?.uid || !activeChatId) return;

    const messagesQuery = query(
      collection(db, 'chats', activeChatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgList = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: data.timestamp?.toDate ? new Date(data.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (data.formattedTime || 'Just now')
        };
      });

      setMessages(prev => ({
        ...prev,
        [activeChatId]: msgList
      }));
    });

    return () => unsubscribe();
  }, [currentUser?.uid, activeChatId]);

  // 3. Subscribe to Friend Requests
  useEffect(() => {
    if (!currentUser?.uid) return;

    const reqQuery = query(
      collection(db, 'friends'),
      where('recipientId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(reqQuery, (snapshot) => {
      const reqs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFriendRequests(reqs);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Active chat object
  const activeChat = chats.find(c => c.id === activeChatId) || (chats.length > 0 ? chats[0] : null);
  const activeMessages = activeChatId ? (messages[activeChatId] || []) : [];

  // Send Text Message
  const sendMessage = async (text) => {
    if (!text.trim() || !activeChatId || !currentUser) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsgData = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.username,
      senderAvatar: currentUser.avatar,
      type: 'text',
      content: text.trim(),
      timestamp: serverTimestamp(),
      formattedTime: timeString,
      seen: false,
      reactions: {}
    };

    try {
      await addDoc(collection(db, 'chats', activeChatId, 'messages'), newMsgData);
      await updateDoc(doc(db, 'chats', activeChatId), {
        lastMessage: text.trim(),
        lastMessageTime: timeString,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Firestore send message error:', err);
    }
  };

  // Upload Attachment (Image file or Voice Audio Blob)
  const sendAttachment = async (fileOrBlob, type, metadata = {}) => {
    if (!activeChatId || !currentUser) return;

    const tempId = `msg_${Date.now()}`;
    let fileUrl = null;

    try {
      const fileRef = ref(storage, `chats/${activeChatId}/${tempId}_${type}`);
      await uploadBytes(fileRef, fileOrBlob);
      fileUrl = await getDownloadURL(fileRef);
    } catch (err) {
      console.warn('Storage upload error, using local Data URL fallback:', err);
      if (typeof fileOrBlob === 'string') {
        fileUrl = fileOrBlob;
      } else {
        fileUrl = URL.createObjectURL(fileOrBlob);
      }
    }

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const attachmentMsg = {
      senderId: currentUser.uid,
      senderName: currentUser.displayName || currentUser.username,
      senderAvatar: currentUser.avatar,
      type: type,
      content: fileUrl,
      audioUrl: fileUrl,
      duration: metadata.duration || 5,
      waveform: metadata.waveform || [30, 60, 90, 45, 80, 50, 75, 40],
      caption: metadata.caption || '',
      timestamp: serverTimestamp(),
      formattedTime: timeString,
      seen: false,
      reactions: {}
    };

    try {
      await addDoc(collection(db, 'chats', activeChatId, 'messages'), attachmentMsg);
      await updateDoc(doc(db, 'chats', activeChatId), {
        lastMessage: type === 'voice' ? `Voice note (${metadata.duration || 5}s)` : 'Sent an image 📷',
        lastMessageTime: timeString,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Firestore attachment send error:', err);
    }
  };

  // Toggle Reaction
  const toggleReaction = async (messageId, emoji) => {
    if (!activeChatId || !currentUser) return;
    try {
      const msgRef = doc(db, 'chats', activeChatId, 'messages', messageId);
      const currentMsg = activeMessages.find(m => m.id === messageId);
      if (!currentMsg) return;

      const currentReactions = currentMsg.reactions || {};
      const userList = currentReactions[emoji] || [];
      const hasReacted = userList.includes(currentUser.uid);

      let newUsers;
      if (hasReacted) {
        newUsers = userList.filter(uid => uid !== currentUser.uid);
      } else {
        newUsers = [...userList, currentUser.uid];
      }

      const newReactions = { ...currentReactions };
      if (newUsers.length > 0) {
        newReactions[emoji] = newUsers;
      } else {
        delete newReactions[emoji];
      }

      await updateDoc(msgRef, { reactions: newReactions });
    } catch (err) {
      console.error('Toggle reaction error:', err);
    }
  };

  // Live User Search in Firestore
  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.trim().toLowerCase();

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, limit(10));
      const snap = await getDocs(q);

      return snap.docs
        .map(d => d.data())
        .filter(u => 
          u.uid !== currentUser.uid && (
            (u.email && u.email.toLowerCase().includes(term)) ||
            (u.username && u.username.toLowerCase().includes(term)) ||
            (u.phoneNumber && u.phoneNumber.includes(term)) ||
            (u.tag && u.tag.includes(term))
          )
        );
    } catch (err) {
      console.error('Search users error:', err);
      return [];
    }
  };

  // Send Friend Request in Firestore
  const sendFriendRequest = async (targetUser) => {
    if (!currentUser || !targetUser?.uid) return;

    try {
      const friendDocRef = doc(collection(db, 'friends'));
      await setDoc(friendDocRef, {
        id: friendDocRef.id,
        requesterId: currentUser.uid,
        recipientId: targetUser.uid,
        status: 'pending',
        from: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          username: currentUser.username,
          tag: currentUser.tag,
          avatar: currentUser.avatar,
        },
        createdAt: serverTimestamp()
      });
      alert(`✨ Friend request sent to ${targetUser.displayName}!`);
    } catch (err) {
      console.error('Send friend request error:', err);
    }
  };

  // Accept Friend Request
  const acceptFriendRequest = async (reqId) => {
    try {
      const reqRef = doc(db, 'friends', reqId);
      await updateDoc(reqRef, { status: 'accepted' });

      const req = friendRequests.find(r => r.id === reqId);
      if (req) {
        // Create 1:1 direct chat channel
        const newChatRef = doc(collection(db, 'chats'));
        await setDoc(newChatRef, {
          id: newChatRef.id,
          type: 'direct',
          participants: [currentUser.uid, req.from.uid],
          lastMessage: 'You are now friends! Say hi ✨',
          lastMessageTime: 'Just now',
          updatedAt: serverTimestamp()
        });
        setActiveChatId(newChatRef.id);
      }
    } catch (err) {
      console.error('Accept friend request error:', err);
    }
  };

  // Decline Friend Request
  const declineFriendRequest = async (reqId) => {
    try {
      await updateDoc(doc(db, 'friends', reqId), { status: 'declined' });
    } catch (err) {
      console.error('Decline friend request error:', err);
    }
  };

  // Create Group Chat
  const createGroupChat = async (groupName, selectedFriendUids) => {
    if (!currentUser) return;
    try {
      const newGroupRef = doc(collection(db, 'chats'));
      await setDoc(newGroupRef, {
        id: newGroupRef.id,
        type: 'group',
        name: groupName,
        avatar: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&auto=format&fit=crop&q=80',
        participants: [currentUser.uid, ...selectedFriendUids],
        lastMessage: `Group "${groupName}" created 🎉`,
        lastMessageTime: 'Just now',
        updatedAt: serverTimestamp()
      });
      setActiveChatId(newGroupRef.id);
    } catch (err) {
      console.error('Create group chat error:', err);
    }
  };

  const value = {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    messages: activeMessages,
    friends,
    friendRequests,
    typingUsers,
    sendMessage,
    sendAttachment,
    toggleReaction,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    createGroupChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
