// In-memory database for stories
// In production, this would be replaced with a real database (MongoDB, PostgreSQL, etc.)

let stories = [
  {
    id: 1,
    story: "I received a friend request from someone I didn't know. They kept messaging me asking for personal information. I blocked them immediately and told my parents. Always trust your instincts!",
    incidentType: "Unwanted Contact",
    displayName: "Sarah M.",
    userId: 1,
    likes: 12,
    date: "2 weeks ago",
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    story: "Someone created a fake account using my photos and was pretending to be me. I reported it to the platform and it was removed within 24 hours. Don't hesitate to report!",
    incidentType: "Fake Accounts",
    displayName: "Alex T.",
    userId: 2,
    likes: 8,
    date: "1 week ago",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    story: "A classmate was posting mean comments about me on every photo I shared. At first I tried to ignore it, but it got worse. I documented everything and showed a trusted teacher. Speaking up was hard but worth it.",
    incidentType: "Harassment or Bullying",
    displayName: "Anonymous",
    userId: 3,
    likes: 24,
    date: "3 weeks ago",
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 4,
    story: "I got a message from someone claiming to be a friend asking for money urgently. They said their account was hacked. I called my friend directly and found out it was a scam. Always verify through another channel before sending money!",
    incidentType: "Scams or Fraud",
    displayName: "Maya K.",
    userId: 4,
    likes: 18,
    date: "5 days ago",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 5,
    story: "Someone was sending me screenshots of my private messages and threatening to share them. I immediately changed all my passwords, enabled two-factor authentication, and reported the account. Privacy settings matter!",
    incidentType: "Privacy Violation",
    displayName: "Omar R.",
    userId: 5,
    likes: 31,
    date: "4 days ago",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 6,
    story: "A stranger kept creating new accounts to message me after I blocked them. I learned to report each account and never respond. My school counselor helped me understand this was harassment. You don't have to deal with this alone.",
    incidentType: "Harassment or Bullying",
    displayName: "Layla H.",
    userId: 6,
    likes: 27,
    date: "6 days ago",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 7,
    story: "I received a message from an account that looked exactly like my best friend's profile, but something felt off. I asked them a question only my real friend would know, and they couldn't answer. It was an impersonation account trying to get personal info.",
    incidentType: "Impersonation",
    displayName: "Yusuf A.",
    userId: 7,
    likes: 15,
    date: "3 days ago",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 8,
    story: "A random person kept sending me friend requests and messages asking where I go to school and where I live. I never responded and blocked them immediately. I also told my parents. Remember: never share personal information with strangers online!",
    incidentType: "Unwanted Contact",
    displayName: "Noor S.",
    userId: 8,
    likes: 22,
    date: "2 days ago",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 9,
    story: "I noticed someone was using my pictures to create fake profiles on different social media platforms. I reported all of them and changed my privacy settings to friends only. It's important to regularly check if your photos are being misused online.",
    incidentType: "Fake Accounts",
    displayName: "Rania M.",
    userId: 9,
    likes: 19,
    date: "1 week ago",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 10,
    story: "A person I didn't know started commenting inappropriate things on all my posts. I blocked them, but they created another account. I learned to make my account private and only accept requests from people I actually know. Safety first!",
    incidentType: "Harassment or Bullying",
    displayName: "Khalid J.",
    userId: 10,
    likes: 26,
    date: "5 days ago",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 11,
    story: "I received a message saying I won a prize and needed to click a link to claim it. It looked suspicious, so I asked my older sibling. They told me it was a phishing scam. Never click links from unknown sources, even if they promise something good!",
    incidentType: "Scams or Fraud",
    displayName: "Sara A.",
    userId: 11,
    likes: 33,
    date: "4 days ago",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 12,
    story: "Someone I thought was my friend online started asking for my passwords and personal details. I felt uncomfortable and told my parents. They helped me understand this was a red flag. Real friends never ask for passwords!",
    incidentType: "Privacy Violation",
    displayName: "Ahmed F.",
    userId: 12,
    likes: 28,
    date: "3 days ago",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 13,
    story: "A stranger sent me a message pretending to be from my school's admin team, asking for my student ID and home address. I checked with the school office first and found out it was fake. Always verify official requests through proper channels!",
    incidentType: "Impersonation",
    displayName: "Fatima L.",
    userId: 13,
    likes: 21,
    date: "6 days ago",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let nextId = 14;

// Get all stories
export const getAllStories = () => {
  return [...stories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Get story by ID
export const getStoryById = (id) => {
  return stories.find(s => s.id === id);
};

// Get stories by user ID
export const getStoriesByUserId = (userId) => {
  return stories.filter(s => s.userId === userId);
};

// Create a new story
export const createStory = (storyData) => {
  const newStory = {
    id: nextId++,
    ...storyData,
    likes: 0,
    createdAt: new Date().toISOString(),
    date: "Just now"
  };
  stories.push(newStory);
  return newStory;
};

// Update story (for likes, etc.)
export const updateStory = (id, updates) => {
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) return null;
  
  stories[storyIndex] = { ...stories[storyIndex], ...updates };
  return stories[storyIndex];
};

// Delete story
export const deleteStory = (id) => {
  const storyIndex = stories.findIndex(s => s.id === id);
  if (storyIndex === -1) return false;
  
  stories.splice(storyIndex, 1);
  return true;
};

// Like/Unlike story
export const toggleStoryLike = (id) => {
  const story = getStoryById(id);
  if (!story) return null;
  
  story.likes = (story.likes || 0) + 1;
  return story;
};

// Unlike story
export const unlikeStory = (id) => {
  const story = getStoryById(id);
  if (!story) return null;
  
  story.likes = Math.max(0, (story.likes || 0) - 1);
  return story;
};

