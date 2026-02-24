const fs = require('fs');
const path = require('path');

// SVG placeholder generator
function generateSVG(text, bgColor, textColor, width = 400, height = 400) {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

const products = [
  { name: 'apples', color: '#ff6b6b', text: '🍎 Apples' },
  { name: 'bananas', color: '#ffe66d', text: '🍌 Bananas' },
  { name: 'carrots', color: '#ff8c42', text: '🥕 Carrots' },
  { name: 'spinach', color: '#4ecdc4', text: '🥬 Spinach' },
  { name: 'tomatoes', color: '#ff6b6b', text: '🍅 Tomatoes' },
  { name: 'milk', color: '#f0f0f0', text: '🥛 Milk' },
  { name: 'eggs', color: '#ffe5b4', text: '🥚 Eggs' },
  { name: 'bread', color: '#d4a574', text: '🍞 Bread' },
  { name: 'honey', color: '#ffd700', text: '🍯 Honey' },
  { name: 'quinoa', color: '#e8d5b7', text: '🌾 Quinoa' },
];

const productsDir = path.join(__dirname, 'public', 'images', 'products');

products.forEach(product => {
  const svg = generateSVG(product.text, product.color, '#333');
  fs.writeFileSync(path.join(productsDir, `${product.name}.jpg`), svg);
  console.log(`Created ${product.name}.jpg`);
});

console.log('All product images created!');
