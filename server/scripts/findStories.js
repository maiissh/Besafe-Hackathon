import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  // Find all stories with "mais" in displayName
  const maisStories = await Story.find({
    displayName: { $regex: /mais/i }
  });

  // Find all stories with "Fake Accounts"
  const fakeAccountStories = await Story.find({
    incidentType: "Fake Accounts"
  });

  console.log('=== Stories with "mais" in displayName ===');
  if (maisStories.length === 0) {
    console.log('No stories found');
  } else {
    maisStories.forEach((story, index) => {
      console.log(`\n${index + 1}. ID: ${story._id}`);
      console.log(`   DisplayName: "${story.displayName}"`);
      console.log(`   IncidentType: "${story.incidentType}"`);
      console.log(`   Likes: ${story.likes}`);
      console.log(`   Story: ${story.story.substring(0, 100)}...`);
    });
  }

  console.log('\n=== All "Fake Accounts" stories ===');
  if (fakeAccountStories.length === 0) {
    console.log('No stories found');
  } else {
    fakeAccountStories.forEach((story, index) => {
      console.log(`\n${index + 1}. ID: ${story._id}`);
      console.log(`   DisplayName: "${story.displayName}"`);
      console.log(`   IncidentType: "${story.incidentType}"`);
      console.log(`   Likes: ${story.likes}`);
      console.log(`   Story: ${story.story.substring(0, 100)}...`);
    });
  }

  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error finding stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

