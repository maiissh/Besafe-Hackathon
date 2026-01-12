import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = process.env.SERVER_URL || 'http://localhost:5000';

async function testStoriesAPI() {
  try {
    console.log(`\n🧪 Testing Stories API at ${API_URL}/api/stories\n`);
    
    const response = await axios.get(`${API_URL}/api/stories`);
    
    console.log('✅ API Response Status:', response.status);
    console.log('✅ Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log(`\n✅ Success! Found ${response.data.data.length} stories\n`);
      response.data.data.forEach((story, index) => {
        console.log(`${index + 1}. ${story.displayName} - ${story.incidentType} (${story.likes} likes)`);
      });
    } else {
      console.log('\n❌ API returned success=false\n');
    }
    
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
}

testStoriesAPI();
