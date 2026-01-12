import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  // Find story with "mais" in the story text, "Fake Accounts" type, and 0 likes
  const matchingStories = await Story.find({
    story: { $regex: /^mais/i },
    incidentType: "Fake Accounts",
    likes: 0
  });

  console.log(`Found ${matchingStories.length} story/stories matching criteria:`);
  matchingStories.forEach((story, index) => {
    console.log(`  ${index + 1}. DisplayName: "${story.displayName}", Likes: ${story.likes}, ID: ${story._id}`);
    console.log(`     Story: ${story.story.substring(0, 100)}...`);
  });

  if (matchingStories.length === 0) {
    // Try without the story text requirement
    const allFakeAccounts = await Story.find({
      incidentType: "Fake Accounts",
      likes: 0
    });
    
    console.log(`\nFound ${allFakeAccounts.length} "Fake Accounts" stories with 0 likes:`);
    allFakeAccounts.forEach((story, index) => {
      console.log(`  ${index + 1}. DisplayName: "${story.displayName}", ID: ${story._id}`);
      console.log(`     Story: ${story.story.substring(0, 100)}...`);
    });
  }

  // Delete story with "mais" at the start of story text, "Fake Accounts" type, and 0 likes
  const result = await Story.deleteMany({
    story: { $regex: /^mais/i },
    incidentType: "Fake Accounts",
    likes: 0
  });

  console.log(`\nDeleted ${result.deletedCount} story/stories`);
  
  if (result.deletedCount === 0) {
    console.log('\nNo stories deleted. If you want to delete by ID, use:');
    console.log('Story.findByIdAndDelete("ID_HERE")');
  }
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error deleting story:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

