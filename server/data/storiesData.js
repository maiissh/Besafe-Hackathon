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
  }
];

let nextId = 4;

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

