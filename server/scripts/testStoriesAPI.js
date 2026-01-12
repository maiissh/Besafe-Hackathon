import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const API_URL = process.env.SERVER_URL || 'http://localhost:5000';

async function testStoriesAPI() {
  try {
    const url = `${API_URL}/api/stories`;
    console.log(`\n🧪 Testing Stories API at ${url}\n`);
    
    const response = await fetch(url);
    const responseData = await response.json();
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(responseData, null, 2));
    
    if (responseData.success) {
      console.log(`\n✅ Success! Found ${responseData.data.length} stories\n`);
      responseData.data.forEach((story, index) => {
        console.log(`${index + 1}. ${story.displayName} - ${story.incidentType} (${story.likes} likes)`);
      });
    } else {
      console.log('\n❌ API returned success=false\n');
    }
    
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
}

testStoriesAPI();
