const fs = require('fs');
const path = require('path');

const categories = {
  'Fruits': [
    'Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes', 'Strawberries', 'Blueberries', 'Kiwi', 'Papaya', 'Pineapples', 'Peaches', 'Pears', 'Watermelon', 'Pomegranate', 'Avocado'
  ],
  'Vegetables': [
    'Carrots', 'Broccoli', 'Spinach', 'Tomatoes', 'Potatoes', 'Onions', 'Garlic', 'Bell Peppers', 'Cucumbers', 'Cauliflower', 'Lettuce', 'Kale', 'Beetroot', 'Sweet Corn', 'Ginger'
  ],
  'Grains': [
    'Brown Rice', 'White Rice', 'Wheat Flour', 'Oats', 'Barley', 'Millet', 'Quinoa', 'Ragi Flour', 'Semolina', 'Multigrain Flour'
  ],
  'Pulses': [
    'Moong Dal', 'Masoor Dal', 'Toor Dal', 'Urad Dal', 'Chana Dal', 'Black Chana', 'Kabuli Chana', 'Rajma', 'Green Gram', 'Horse Gram'
  ],
  'Nuts': [
    'Almonds', 'Cashews', 'Walnuts', 'Peanuts', 'Pistachios'
  ],
  'Seeds': [
    'Chia Seeds', 'Flax Seeds', 'Sunflower Seeds', 'Pumpkin Seeds', 'Sesame Seeds'
  ],
  'Oils': [
    'Coconut Oil', 'Olive Oil', 'Mustard Oil', 'Groundnut Oil', 'Sesame Oil', 'Sunflower Oil', 'Flaxseed Oil', 'Castor Oil'
  ],
  'Spices': [
    'Turmeric Powder', 'Red Chilli Powder', 'Coriander Powder', 'Cumin Seeds', 'Mustard Seeds', 'Fenugreek Seeds', 'Cardamom', 'Cinnamon', 'Cloves', 'Black Pepper', 'Garam Masala', 'Bay Leaves', 'Basil Leaves', 'Oregano'
  ],
  'Dairy': [
    'Milk', 'Curd', 'Paneer', 'Butter', 'Cow Ghee', 'Yogurt', 'Almond Milk', 'Soy Milk'
  ],
  'Pantry': [
    'Honey', 'Jaggery', 'Coconut Sugar', 'Apple Cider Vinegar', 'Pasta', 'Instant Noodles', 'Granola', 'Peanut Butter', 'Fruit Jam', 'Salad Dressings'
  ],
  'Snacks': [
    'Popcorn', 'Trail Mix', 'Protein Bars', 'Tortilla Chips', 'Dark Chocolate', 'Dried Fruits'
  ],
  'Beverages': [
    'Green Tea', 'Black Tea', 'Coffee Beans', 'Coconut Water'
  ]
};

const prices = {
  'Fruits': { min: 30, max: 150 },
  'Vegetables': { min: 20, max: 100 },
  'Grains': { min: 50, max: 200 },
  'Pulses': { min: 60, max: 250 },
  'Nuts': { min: 200, max: 600 },
  'Seeds': { min: 80, max: 300 },
  'Oils': { min: 150, max: 500 },
  'Spices': { min: 40, max: 300 },
  'Dairy': { min: 40, max: 200 },
  'Pantry': { min: 50, max: 300 },
  'Snacks': { min: 60, max: 250 },
  'Beverages': { min: 80, max: 300 }
};

const descriptions = {
  'Fruits': 'Fresh organic fruits sourced from certified organic farms. Premium quality guaranteed.',
  'Vegetables': 'Fresh organic vegetables sourced from certified organic farms. Premium quality guaranteed.',
  'Grains': 'Premium organic grains sourced from certified organic farms. Perfect for healthy cooking.',
  'Pulses': 'High-quality organic pulses sourced from certified organic farms. Rich in protein and nutrients.',
  'Nuts': 'Premium organic nuts sourced from certified organic farms. Perfect for snacking and cooking.',
  'Seeds': 'Nutritious organic seeds sourced from certified organic farms. Rich in minerals and vitamins.',
  'Oils': 'Pure organic oils sourced from certified organic farms. Perfect for cooking and health.',
  'Spices': 'Aromatic organic spices sourced from certified organic farms. Enhance your cooking.',
  'Dairy': 'Fresh organic dairy products sourced from certified organic farms. Pure and nutritious.',
  'Pantry': 'Premium organic pantry items sourced from certified organic farms. Essential for your kitchen.',
  'Snacks': 'Healthy organic snacks sourced from certified organic farms. Perfect for guilt-free snacking.',
  'Beverages': 'Premium organic beverages sourced from certified organic farms. Refreshing and healthy.'
};

function generateProducts() {
  const products = [];
  let productId = 1;

  for (const [category, items] of Object.entries(categories)) {
    for (const item of items) {
      if (productId > 112) break;
      
      const priceRange = prices[category];
      const price = Math.floor(Math.random() * (priceRange.max - priceRange.min + 1)) + priceRange.min;
      
      products.push({
        id: String(productId),
        name: `Organic ${item}`,
        price,
        description: descriptions[category],
        image: `/images/products/product-${productId}.jpg`,
        category,
        stock: Math.floor(Math.random() * 200) + 50,
        rating: Math.round((Math.random() * 1 + 4) * 10) / 10,
        reviews: Math.floor(Math.random() * 100) + 10,
        organic: true,
        featured: Math.random() > 0.7,
        shopId: String(Math.floor(Math.random() * 10) + 1),
        images: [`/images/products/product-${productId}.jpg`],
        warehouseLocation: ['Tamil Nadu Central Warehouse', 'Karnataka Regional Hub', 'Maharashtra Distribution Center', 'Delhi North Warehouse'][Math.floor(Math.random() * 4)],
        updatedAt: new Date().toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      productId++;
    }
    if (productId > 112) break;
  }

  return products;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function saveProducts() {
  const products = generateProducts();
  const basePath = path.join(__dirname, 'data', 'products');

  products.forEach(product => {
    const byIdPath = path.join(basePath, 'by-id', product.id);
    ensureDir(byIdPath);
    fs.writeFileSync(path.join(byIdPath, 'product.json'), JSON.stringify(product, null, 2));

    const byCategoryPath = path.join(basePath, 'by-category', product.category);
    ensureDir(byCategoryPath);
    fs.writeFileSync(path.join(byCategoryPath, `${product.id}.json`), JSON.stringify(product, null, 2));

    const byNamePath = path.join(basePath, 'by-name');
    ensureDir(byNamePath);
    const nameSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    fs.writeFileSync(path.join(byNamePath, `${nameSlug}.json`), JSON.stringify(product, null, 2));
  });

  const indexPath = path.join(basePath, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(products.map(p => p.id), null, 2));

  const catalogPath = path.join(basePath, 'catalog.json');
  fs.writeFileSync(catalogPath, JSON.stringify(products, null, 2));

  console.log(`✓ Generated ${products.length} products with local image paths!`);
}

saveProducts();
