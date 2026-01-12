import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  const stories = await Story.find({}).sort({ createdAt: -1 }).lean();
  console.log(`\n═══════════════════════════════════════════════════════════`);
  console.log(`📚 Total Stories in Database: ${stories.length}`);
  console.log(`═══════════════════════════════════════════════════════════\n`);
  
  if (stories.length === 0) {
    console.log('No stories found in database.');
  } else {
    stories.forEach((story, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📖 Story #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`ID: ${story._id}`);
      console.log(`Display Name: "${story.displayName}"`);
      console.log(`Incident Type: "${story.incidentType}"`);
      console.log(`Likes: ${story.likes || 0}`);
      console.log(`User ID: ${story.userId}`);
      console.log(`Created At: ${story.createdAt}`);
      console.log(`Updated At: ${story.updatedAt || 'N/A'}`);
      console.log(`\nStory Text:`);
      console.log(`"${story.story}"`);
      console.log(`\n`);
    });
  }
  
  console.log(`═══════════════════════════════════════════════════════════`);
  console.log(`✅ Displayed ${stories.length} story/stories`);
  console.log(`═══════════════════════════════════════════════════════════\n`);
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error showing stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}
