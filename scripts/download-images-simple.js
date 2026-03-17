const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../public/images/products');

const PRODUCTS = [
  'organic-tomatoes', 'organic-carrots', 'organic-apples', 'organic-bananas',
  'organic-spinach', 'organic-kale', 'organic-broccoli', 'organic-cauliflower',
  'organic-potatoes', 'organic-onions', 'organic-garlic', 'organic-ginger',
  'organic-rice', 'organic-wheat', 'organic-oats', 'organic-quinoa',
  'organic-almonds', 'organic-walnuts', 'organic-cashews', 'organic-dates',
  'organic-milk', 'organic-eggs', 'organic-cheese', 'organic-yogurt',
  'organic-tea', 'organic-coffee', 'organic-honey', 'organic-olive-oil',
  'fresh-lettuce', 'fresh-cucumber', 'fresh-peppers', 'fresh-mushrooms',
  'organic-strawberries', 'organic-blueberries', 'organic-grapes', 'organic-oranges',
  'organic-lemons', 'organic-avocados', 'organic-mangoes', 'organic-pineapple',
  'organic-beans', 'organic-lentils', 'organic-chickpeas', 'organic-peas',
  'organic-corn', 'organic-pumpkin', 'organic-zucchini', 'organic-eggplant',
  'organic-basil', 'organic-cilantro', 'organic-parsley', 'organic-mint',
  'organic-turmeric', 'organic-cinnamon', 'organic-pepper', 'organic-cumin',
  'organic-butter', 'organic-cream', 'organic-paneer', 'organic-ghee',
  'organic-bread', 'organic-pasta', 'organic-noodles', 'organic-flour',
  'organic-sugar', 'organic-jaggery', 'organic-maple-syrup', 'organic-agave',
  'organic-coconut', 'organic-coconut-oil', 'organic-sesame-oil', 'organic-mustard-oil',
  'organic-chia-seeds', 'organic-flax-seeds', 'organic-pumpkin-seeds', 'organic-sunflower-seeds',
  'organic-raisins', 'organic-figs', 'organic-prunes', 'organic-apricots',
  'organic-green-tea', 'organic-black-tea', 'organic-herbal-tea', 'organic-matcha',
  'organic-dark-chocolate', 'organic-cocoa', 'organic-vanilla', 'organic-cardamom',
  'organic-saffron', 'organic-cloves', 'organic-nutmeg', 'organic-bay-leaves',
  'organic-beetroot', 'organic-radish', 'organic-turnip', 'organic-cabbage',
  'organic-celery', 'organic-asparagus', 'organic-artichoke', 'organic-brussels-sprouts',
  'organic-sweet-potato', 'organic-yam', 'organic-cassava', 'organic-taro',
  'organic-watermelon', 'organic-cantaloupe', 'organic-papaya', 'organic-guava',
  'organic-pomegranate', 'organic-kiwi', 'organic-dragon-fruit', 'organic-passion-fruit'
];

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (res) => {
          const fileStream = fs.createWriteStream(filepath);
          res.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function downloadAllImages() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('Downloading 100+ organic food images...\n');

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const filename = `${product}-${i + 1}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);

    if (fs.existsSync(filepath)) {
      console.log(`⏭️  ${i + 1}/${PRODUCTS.length}: ${filename} (exists)`);
      continue;
    }

    try {
      const imageUrl = `https://picsum.photos/800/600?random=${i + Date.now()}`;
      await downloadImage(imageUrl, filepath);
      console.log(`✅ ${i + 1}/${PRODUCTS.length}: ${filename}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (err) {
      console.log(`❌ ${i + 1}/${PRODUCTS.length}: ${filename} - ${err.message}`);
    }
  }

  console.log(`\n✅ Complete! Downloaded ${PRODUCTS.length} images`);
  console.log(`📁 ${OUTPUT_DIR}`);
}

downloadAllImages().catch(console.error);
