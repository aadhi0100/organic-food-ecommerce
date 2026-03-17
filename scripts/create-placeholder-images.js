const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../public/images/products');

const products = [
  'organic-apples', 'organic-bananas', 'organic-oranges', 'organic-mangoes', 'organic-strawberries',
  'organic-blueberries', 'organic-grapes', 'organic-pineapples', 'organic-papaya', 'organic-watermelon',
  'organic-pomegranate', 'organic-kiwi', 'organic-pears', 'organic-peaches', 'organic-avocado',
  'organic-spinach', 'organic-kale', 'organic-lettuce', 'organic-carrots', 'organic-beetroot',
  'organic-potatoes', 'organic-onions', 'organic-tomatoes', 'organic-cucumbers', 'organic-bell-peppers',
  'organic-broccoli', 'organic-cauliflower', 'organic-sweet-corn', 'organic-ginger', 'organic-garlic',
  'organic-ginger-powder', 'organic-rice', 'organic-brown-rice', 'organic-quinoa', 'organic-millet',
  'organic-barley', 'organic-oats', 'organic-wheat-flour', 'organic-multigrain-flour', 'organic-ragi-flour',
  'organic-semolina', 'organic-pasta', 'organic-toor-dal', 'organic-moong-dal', 'organic-chana-dal',
  'organic-masoor-dal', 'organic-urad-dal', 'organic-rajma', 'organic-black-chana', 'organic-green-gram',
  'organic-horse-gram', 'organic-almonds', 'organic-cashews', 'organic-walnuts', 'organic-peanuts',
  'organic-pistachios', 'organic-chia-seeds', 'organic-flax-seeds', 'organic-pumpkin-seeds', 'organic-sesame-seeds',
  'organic-sunflower-seeds', 'organic-coconut-oil', 'organic-olive-oil', 'organic-mustard-oil', 'organic-sesame-oil',
  'organic-groundnut-oil', 'organic-sunflower-oil', 'organic-flaxseed-oil', 'organic-castor-oil', 'organic-cow-ghee',
  'organic-butter', 'organic-milk', 'organic-paneer', 'organic-curd', 'organic-yogurt',
  'organic-soy-milk', 'organic-peanut-butter', 'organic-turmeric-powder', 'organic-cumin-seeds', 'organic-coriander-powder',
  'organic-garam-masala', 'organic-black-pepper', 'organic-cinnamon', 'organic-cloves', 'organic-cardamom',
  'organic-fenugreek-seeds', 'organic-red-chilli-powder', 'organic-mustard-seeds', 'organic-bay-leaves', 'organic-oregano',
  'organic-basil-leaves', 'organic-granola', 'organic-protein-bars', 'organic-popcorn', 'organic-tortilla-chips',
  'organic-kabuli-chana', 'organic-fruit-jam', 'organic-instant-noodles', 'organic-salad-dressings', 'organic-tea-coffee',
  'organic-green-tea', 'organic-black-tea', 'organic-coffee-beans', 'organic-honey', 'organic-jaggery',
  'organic-apple-cider-vinegar', 'organic-coconut-sugar', 'organic-dark-chocolate', 'organic-trail-mix', 'organic-dried-fruits',
  'organic-coconut-water', 'organic-almond-milk'
];

// Create 1x1 transparent PNG
const transparentPNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}

let created = 0;
products.forEach(product => {
  const filepath = path.join(PRODUCTS_DIR, `${product}.jpg`);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, transparentPNG);
    created++;
    console.log(`✅ Created: ${product}.jpg`);
  } else {
    console.log(`⏭️  Exists: ${product}.jpg`);
  }
});

console.log(`\n✅ Complete! Created ${created} placeholder images`);
console.log(`📁 Total: ${products.length} product images`);
