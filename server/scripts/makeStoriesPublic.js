import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  console.log('\n🔄 Making all stories public (removing userId)...\n');
  
  // Update all stories to have userId = null (making them public)
  const result = await Story.updateMany(
    {}, // Match all stories
    { $set: { userId: null } }
  );
  
  console.log(`✅ Updated ${result.modifiedCount} stories to be public (userId = null)`);
  
  // Verify the update
  const publicStories = await Story.find({ userId: null });
  const userStories = await Story.find({ userId: { $ne: null } });
  
  console.log(`\n📊 Verification:`);
  console.log(`   Public stories (userId = null): ${publicStories.length}`);
  console.log(`   User-specific stories: ${userStories.length}`);
  
  if (publicStories.length > 0) {
    console.log(`\n📝 Public stories:`);
    publicStories.forEach((story, index) => {
      console.log(`   ${index + 1}. ${story.displayName} - ${story.incidentType} (${story.likes} likes)`);
    });
  }
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error making stories public:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}
