const https = require('https');
const fs = require('fs');
const path = require('path');

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const OUTPUT_DIR = path.join(__dirname, '../public/images/products');

const ORGANIC_FOOD_QUERIES = [
  'organic vegetables', 'organic fruits', 'organic grains', 'organic dairy',
  'organic nuts', 'organic seeds', 'organic spices', 'organic herbs',
  'fresh vegetables', 'fresh fruits', 'whole grains', 'natural honey',
  'organic tomatoes', 'organic carrots', 'organic apples', 'organic bananas',
  'organic spinach', 'organic kale', 'organic broccoli', 'organic cauliflower',
  'organic potatoes', 'organic onions', 'organic garlic', 'organic ginger',
  'organic rice', 'organic wheat', 'organic oats', 'organic quinoa',
  'organic almonds', 'organic walnuts', 'organic cashews', 'organic dates',
  'organic milk', 'organic eggs', 'organic cheese', 'organic yogurt',
  'organic tea', 'organic coffee', 'organic olive oil', 'organic coconut oil'
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function searchPexels(query, perPage = 3) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.pexels.com',
      path: `/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
      headers: { 'Authorization': PEXELS_API_KEY }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`API Error: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

async function downloadAllImages() {
  if (!PEXELS_API_KEY) {
    throw new Error('Missing PEXELS_API_KEY environment variable.')
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let imageCount = 0;
  const targetCount = 100;

  console.log('Starting download of 100+ organic food images...\n');

  for (const query of ORGANIC_FOOD_QUERIES) {
    if (imageCount >= targetCount) break;

    try {
      console.log(`Searching: ${query}...`);
      const result = await searchPexels(query, 3);

      if (result.photos && result.photos.length > 0) {
        for (const photo of result.photos) {
          if (imageCount >= targetCount) break;

          const filename = `${query.replace(/\s+/g, '-')}-${photo.id}.jpg`;
          const filepath = path.join(OUTPUT_DIR, filename);

          if (fs.existsSync(filepath)) {
            console.log(`  ⏭️  Skipped: ${filename} (already exists)`);
            continue;
          }

          try {
            await downloadImage(photo.src.medium, filepath);
            imageCount++;
            console.log(`  ✅ Downloaded: ${filename} (${imageCount}/${targetCount})`);
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (err) {
            console.log(`  ❌ Failed: ${filename} - ${err.message}`);
          }
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.log(`  ❌ Search failed for "${query}": ${err.message}`);
    }
  }

  console.log(`\n✅ Download complete! Total images: ${imageCount}`);
  console.log(`📁 Location: ${OUTPUT_DIR}`);
}

downloadAllImages().catch(console.error);
