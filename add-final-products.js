const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'data', 'products');

const newProducts = [
  {
    id: '111',
    name: 'Organic Matcha Tea',
    price: 250,
    description: 'Premium organic matcha tea sourced from certified organic farms. Refreshing and healthy.',
    image: '/images/products/product-111.jpg',
    category: 'Beverages',
    stock: 85,
    rating: 4.8,
    reviews: 42,
    organic: true,
    featured: true,
    shopId: '3',
    images: ['/images/products/product-111.jpg'],
    warehouseLocation: 'Tamil Nadu Central Warehouse',
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '112',
    name: 'Organic Herbal Mix',
    price: 180,
    description: 'Premium organic herbal mix sourced from certified organic farms. Refreshing and healthy.',
    image: '/images/products/product-112.jpg',
    category: 'Beverages',
    stock: 120,
    rating: 4.7,
    reviews: 35,
    organic: true,
    featured: false,
    shopId: '5',
    images: ['/images/products/product-112.jpg'],
    warehouseLocation: 'Karnataka Regional Hub',
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

newProducts.forEach(product => {
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

const catalogPath = path.join(basePath, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const updatedCatalog = [...catalog, ...newProducts];
fs.writeFileSync(catalogPath, JSON.stringify(updatedCatalog, null, 2));

const indexPath = path.join(basePath, 'index.json');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const updatedIndex = [...index, '111', '112'];
fs.writeFileSync(indexPath, JSON.stringify(updatedIndex, null, 2));

console.log(`✓ Added 2 more products with local image paths. Total: ${updatedCatalog.length} products!`);
