const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/allProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace placehold.co URLs with picsum.photos (actual images)
content = content.replace(/https:\/\/placehold\.co\/400x400\/e8f5e9\/2e7d32\?text=[^"]+/g, (match, offset) => {
  const id = Math.floor(Math.random() * 1000) + 1;
  return `https://picsum.photos/seed/${id}/400/400`;
});

fs.writeFileSync(filePath, content);
console.log('✅ Updated all image URLs to use picsum.photos');
