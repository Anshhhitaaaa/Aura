export const MOCK_CURRENT_USER = {
  uid: 'usr_me_01',
  email: 'alex.vibe@aura.app',
  displayName: 'Alex Rivers',
  username: 'alex_rivers',
  tag: '8492',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  bio: 'designing quiet luxury software ✨ | tea over coffee always',
  status: 'In the flow ☕',
  online: true,
  createdAt: new Date().toISOString(),
};

export const MOCK_FRIENDS = [
  {
    uid: 'usr_chloe_02',
    email: 'chloe.s@aura.app',
    displayName: 'Chloe Chen',
    username: 'chloe_vibes',
    tag: '4210',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    bio: 'film photography, vinyl records & late night convos',
    status: 'Listening to Frank Ocean 🎧',
    online: true,
  },
  {
    uid: 'usr_kai_03',
    email: 'kai.m@aura.app',
    displayName: 'Kai Tanaka',
    username: 'kai_tanaka',
    tag: '9901',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    bio: 'building aesthetic web tools & mechanical keyboards',
    status: 'Coding in VS Code ⚡',
    online: true,
  },
  {
    uid: 'usr_maya_04',
    email: 'maya.v@aura.app',
    displayName: 'Maya Patel',
    username: 'maya_design',
    tag: '1104',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    bio: 'curating color palettes & editorial typography',
    status: 'Away 🌸',
    online: false,
  },
  {
    uid: 'usr_leo_05',
    email: 'leo.d@aura.app',
    displayName: 'Leo Sterling',
    username: 'leo_sterling',
    tag: '3372',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'sound design & ambient electronics',
    status: 'Offline 🌙',
    online: false,
  }
];

export const MOCK_FRIEND_REQUESTS = [
  {
    id: 'req_01',
    from: {
      uid: 'usr_sora_06',
      displayName: 'Sora Takahashi',
      username: 'sora_sky',
      tag: '5519',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
      bio: 'arch & generative art',
    },
    createdAt: '10m ago'
  }
];

export const MOCK_CHATS = [
  {
    id: 'chat_chloe_1to1',
    type: 'direct',
    participants: ['usr_me_01', 'usr_chloe_02'],
    partner: MOCK_FRIENDS[0],
    unreadCount: 1,
    lastMessage: 'Wait look at this color scheme for the new gallery page!',
    lastMessageTime: '3m ago',
    typing: false,
  },
  {
    id: 'chat_group_lounge',
    type: 'group',
    name: '✨ The Lounge',
    avatar: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=300&auto=format&fit=crop&q=80',
    participants: ['usr_me_01', 'usr_chloe_02', 'usr_kai_03', 'usr_maya_04'],
    unreadCount: 0,
    lastMessage: 'Kai: who is down for a quick call later?',
    lastMessageTime: '25m ago',
    typing: true,
    typingUser: 'Kai Tanaka',
  },
  {
    id: 'chat_kai_1to1',
    type: 'direct',
    participants: ['usr_me_01', 'usr_kai_03'],
    partner: MOCK_FRIENDS[1],
    unreadCount: 0,
    lastMessage: 'Voice note (0:14)',
    lastMessageTime: '1h ago',
    typing: false,
  },
  {
    id: 'chat_maya_1to1',
    type: 'direct',
    participants: ['usr_me_01', 'usr_maya_04'],
    partner: MOCK_FRIENDS[2],
    unreadCount: 0,
    lastMessage: 'The soft sage accent is chef\'s kiss 🌿',
    lastMessageTime: 'Yesterday',
    typing: false,
  }
];

export const MOCK_MESSAGES = {
  'chat_chloe_1to1': [
    {
      id: 'msg_1',
      senderId: 'usr_chloe_02',
      senderName: 'Chloe Chen',
      senderAvatar: MOCK_FRIENDS[0].avatar,
      type: 'text',
      content: 'Hey Alex! Are you around? Wanted to show you something cool ✨',
      timestamp: '10:14 AM',
      seen: true,
      reactions: { '❤️': ['usr_me_01'] }
    },
    {
      id: 'msg_2',
      senderId: 'usr_me_01',
      senderName: 'Alex Rivers',
      senderAvatar: MOCK_CURRENT_USER.avatar,
      type: 'text',
      content: 'Yes! Just finishing up some typography adjustments. What is it?',
      timestamp: '10:15 AM',
      seen: true,
      reactions: {}
    },
    {
      id: 'msg_3',
      senderId: 'usr_chloe_02',
      senderName: 'Chloe Chen',
      senderAvatar: MOCK_FRIENDS[0].avatar,
      type: 'image',
      content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
      caption: 'Soft beach sunset palette inspiration 🌅',
      timestamp: '10:18 AM',
      seen: true,
      reactions: { '✨': ['usr_me_01', 'usr_chloe_02'] }
    },
    {
      id: 'msg_4',
      senderId: 'usr_chloe_02',
      senderName: 'Chloe Chen',
      senderAvatar: MOCK_FRIENDS[0].avatar,
      type: 'text',
      content: 'Wait look at this color scheme for the new gallery page!',
      timestamp: '10:20 AM',
      seen: false,
      reactions: {}
    }
  ],

  'chat_group_lounge': [
    {
      id: 'gmsg_1',
      senderId: 'usr_maya_04',
      senderName: 'Maya Patel',
      senderAvatar: MOCK_FRIENDS[2].avatar,
      type: 'text',
      content: 'Good morning everyone! Coffee time ☕',
      timestamp: '9:00 AM',
      seen: true,
      reactions: { '☕': ['usr_me_01', 'usr_kai_03'] }
    },
    {
      id: 'gmsg_2',
      senderId: 'usr_kai_03',
      senderName: 'Kai Tanaka',
      senderAvatar: MOCK_FRIENDS[1].avatar,
      type: 'text',
      content: 'Who is down for a quick call later?',
      timestamp: '9:45 AM',
      seen: true,
      reactions: { '🙌': ['usr_chloe_02'] }
    }
  ],

  'chat_kai_1to1': [
    {
      id: 'kmsg_1',
      senderId: 'usr_kai_03',
      senderName: 'Kai Tanaka',
      senderAvatar: MOCK_FRIENDS[1].avatar,
      type: 'voice',
      audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_synth.ogg',
      duration: 14,
      waveform: [20, 45, 80, 65, 30, 90, 100, 75, 40, 25, 60, 85, 95, 50, 30, 70, 90, 40],
      timestamp: '9:10 AM',
      seen: true,
      reactions: { '🔥': ['usr_me_01'] }
    },
    {
      id: 'kmsg_2',
      senderId: 'usr_me_01',
      senderName: 'Alex Rivers',
      senderAvatar: MOCK_CURRENT_USER.avatar,
      type: 'text',
      content: 'Sounds awesome Kai! Let us test out the WebRTC audio quality on Aura 🔥',
      timestamp: '9:12 AM',
      seen: true,
      reactions: {}
    }
  ],

  'chat_maya_1to1': [
    {
      id: 'mmsg_1',
      senderId: 'usr_maya_04',
      senderName: 'Maya Patel',
      senderAvatar: MOCK_FRIENDS[2].avatar,
      type: 'text',
      content: 'The soft sage accent is chef\'s kiss 🌿',
      timestamp: 'Yesterday',
      seen: true,
      reactions: {}
    }
  ]
};
