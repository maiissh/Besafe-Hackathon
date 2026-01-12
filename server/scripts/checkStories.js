import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  const stories = await Story.find({}).lean();
  console.log(`\nTotal stories in database: ${stories.length}\n`);
  
  stories.forEach((story, index) => {
    console.log(`${index + 1}. DisplayName: "${story.displayName}"`);
    console.log(`   IncidentType: "${story.incidentType}"`);
    console.log(`   Likes: ${story.likes}`);
    console.log(`   userId: ${story.userId}`);
    console.log(`   Story: ${story.story.substring(0, 80)}...`);
    console.log('');
  });

  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error checking stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

