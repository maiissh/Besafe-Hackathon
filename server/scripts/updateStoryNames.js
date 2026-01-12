import dotenv from 'dotenv';
import Story from '../models/Story.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

try {
  // Delete Khalid J.'s story
  const deleteResult = await Story.deleteMany({
    displayName: "Khalid J."
  });
  console.log(`Deleted ${deleteResult.deletedCount} story/stories from Khalid J.`);

  // Update male names to female names
  const nameUpdates = [
    { oldName: "Ahmed F.", newName: "Amina F." },
    { oldName: "Yusuf A.", newName: "Yasmin A." },
    { oldName: "Omar R.", newName: "Ola R." },
    { oldName: "Alex T.", newName: "Alexa T." } // Alex could be male
  ];

  let updatedCount = 0;
  for (const update of nameUpdates) {
    const result = await Story.updateMany(
      { displayName: update.oldName },
      { $set: { displayName: update.newName } }
    );
    if (result.modifiedCount > 0) {
      console.log(`Updated ${result.modifiedCount} story/stories from "${update.oldName}" to "${update.newName}"`);
      updatedCount += result.modifiedCount;
    }
  }

  console.log(`\n✅ Done! Updated ${updatedCount} stories.`);
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error updating stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

