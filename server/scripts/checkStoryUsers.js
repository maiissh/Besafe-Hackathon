import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  // Get all stories with their userId
  const stories = await Story.find({}).populate('userId', 'username full_name email');
  
  console.log('\n📊 Stories in Database:\n');
  console.log(`Total stories: ${stories.length}\n`);
  
  // Group stories by userId
  const storiesByUser = {};
  
  stories.forEach(story => {
    const userId = story.userId?._id?.toString() || story.userId?.toString() || 'null';
    const username = story.userId?.username || 'Unknown';
    const fullName = story.userId?.full_name || 'Unknown';
    
    if (!storiesByUser[userId]) {
      storiesByUser[userId] = {
        userId,
        username,
        fullName,
        stories: []
      };
    }
    
    storiesByUser[userId].stories.push({
      id: story._id.toString(),
      displayName: story.displayName,
      incidentType: story.incidentType,
      likes: story.likes
    });
  });
  
  // Display stories grouped by user
  Object.values(storiesByUser).forEach(userData => {
    console.log(`\n👤 User: ${userData.fullName} (${userData.username})`);
    console.log(`   UserId: ${userData.userId}`);
    console.log(`   Stories count: ${userData.stories.length}`);
    userData.stories.forEach((story, index) => {
      console.log(`   ${index + 1}. ${story.displayName} - ${story.incidentType} (${story.likes} likes)`);
    });
  });
  
  // Check for stories with "mais" or "meso" in username
  console.log('\n\n🔍 Checking for stories by "mais" or "meso" users:\n');
  const maisMesoUsers = Object.values(storiesByUser).filter(user => 
    user.username?.toLowerCase().includes('mais') || 
    user.username?.toLowerCase().includes('meso') ||
    user.fullName?.toLowerCase().includes('mais') ||
    user.fullName?.toLowerCase().includes('meso')
  );
  
  if (maisMesoUsers.length > 0) {
    maisMesoUsers.forEach(userData => {
      console.log(`\n✅ Found user: ${userData.fullName} (${userData.username})`);
      console.log(`   UserId: ${userData.userId}`);
      console.log(`   Stories count: ${userData.stories.length}`);
      userData.stories.forEach((story, index) => {
        console.log(`   ${index + 1}. ${story.displayName} - ${story.incidentType} (${story.likes} likes)`);
      });
    });
  } else {
    console.log('❌ No stories found for users with "mais" or "meso" in username/fullName');
  }
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error checking stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}
