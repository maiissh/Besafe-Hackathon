import dotenv from 'dotenv';
import Story from '../models/Story.js';
import Student from '../models/Student.js';
import connectDB from '../config/database.js';

dotenv.config();

// Connect to database
await connectDB();

// Stories to add
const newStories = [
  {
    story: "I noticed someone was using my pictures to create fake profiles on different social media platforms. I reported all of them and changed my privacy settings to friends only. It's important to regularly check if your photos are being misused online.",
    incidentType: "Fake Accounts",
    displayName: "Rania M.",
    likes: 19
  },
  {
    story: "A person I didn't know started commenting inappropriate things on all my posts. I blocked them, but they created another account. I learned to make my account private and only accept requests from people I actually know. Safety first!",
    incidentType: "Harassment or Bullying",
    displayName: "Khalid J.",
    likes: 26
  },
  {
    story: "I received a message saying I won a prize and needed to click a link to claim it. It looked suspicious, so I asked my older sibling. They told me it was a phishing scam. Never click links from unknown sources, even if they promise something good!",
    incidentType: "Scams or Fraud",
    displayName: "Sara A.",
    likes: 33
  },
  {
    story: "Someone I thought was my friend online started asking for my passwords and personal details. I felt uncomfortable and told my parents. They helped me understand this was a red flag. Real friends never ask for passwords!",
    incidentType: "Privacy Violation",
    displayName: "Ahmed F.",
    likes: 28
  },
  {
    story: "A stranger sent me a message pretending to be from my school's admin team, asking for my student ID and home address. I checked with the school office first and found out it was fake. Always verify official requests through proper channels!",
    incidentType: "Impersonation",
    displayName: "Fatima L.",
    likes: 21
  }
];

try {
  // Find or create a default user for stories (or use existing users)
  let defaultUser = await Student.findOne();
  
  if (!defaultUser) {
    // Create a default user if none exists
    defaultUser = await Student.create({
      full_name: "Default User",
      username: "default_user",
      email: "default@example.com",
      password: "default_password_hash", // In production, this should be hashed
      grade_level: "middle"
    });
    console.log('Created default user for stories');
  }

  // Check which stories already exist (by story text)
  const existingStories = await Story.find({});
  const existingStoryTexts = new Set(existingStories.map(s => s.story.trim().toLowerCase()));

  let addedCount = 0;
  let skippedCount = 0;

  for (const storyData of newStories) {
    // Check if story already exists
    const storyTextLower = storyData.story.trim().toLowerCase();
    if (existingStoryTexts.has(storyTextLower)) {
      console.log(`Story already exists: ${storyData.displayName}`);
      skippedCount++;
      continue;
    }

    // Create the story
    await Story.create({
      ...storyData,
      userId: defaultUser._id,
      likes: storyData.likes || 0
    });

    console.log(`✓ Added story from ${storyData.displayName} (${storyData.incidentType})`);
    addedCount++;
  }

  console.log(`\n✅ Done! Added ${addedCount} new stories, skipped ${skippedCount} existing stories.`);
  
  // eslint-disable-next-line n/no-process-exit
  process.exit(0);
} catch (error) {
  console.error('Error seeding stories:', error);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

