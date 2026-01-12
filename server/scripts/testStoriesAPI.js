import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const API_URL = process.env.SERVER_URL || 'http://localhost:5000';

async function testStoriesAPI() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}/api/stories`);
    
    console.log(`\n🧪 Testing Stories API at ${url.toString()}\n`);
    
    const port = url.port || (url.protocol === 'https:' ? 443 : (url.hostname === 'localhost' ? 5000 : 80));
    
    const options = {
      hostname: url.hostname,
      port: port,
      path: url.pathname,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const responseData = JSON.parse(data);
          
          console.log('✅ API Response Status:', res.statusCode);
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
          resolve();
        } catch (error) {
          console.error('\n❌ Error parsing response:', error.message);
          console.error('Raw response:', data);
          // eslint-disable-next-line n/no-process-exit
          process.exit(1);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('\n❌ Error testing API:', error.message);
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
      reject(error);
    });

    req.end();
  });
}

testStoriesAPI();
