const fs = require('fs');
const path = require('path');

// Product image mapping from allProducts.ts
const productImages = {
  "1": "/images/products/organic-apples.jpg",
  "2": "/images/products/organic-bananas.jpg",
  "3": "/images/products/organic-oranges.jpg",
  "4": "/images/products/organic-mangoes.jpg",
  "5": "/images/products/organic-strawberries.jpg",
  "6": "/images/products/organic-blueberries.jpg",
  "7": "/images/products/organic-grapes.jpg",
  "8": "/images/products/organic-pineapples.jpg",
  "9": "/images/products/organic-papaya.jpg",
  "10": "/images/products/organic-watermelon.jpg",
  "11": "/images/products/organic-pomegranate.jpg",
  "12": "/images/products/organic-kiwi.jpg",
  "13": "/images/products/organic-pears.jpg",
  "14": "/images/products/organic-peaches.jpg",
  "15": "/images/products/organic-avocado.jpg",
  "16": "/images/products/organic-spinach.jpg",
  "17": "/images/products/organic-kale.jpg",
  "18": "/images/products/organic-lettuce.jpg",
  "19": "/images/products/organic-carrots.jpg",
  "20": "/images/products/organic-beetroot.jpg",
  "21": "/images/products/organic-potatoes.jpg",
  "22": "/images/products/organic-onions.jpg",
  "23": "/images/products/organic-tomatoes.jpg",
  "24": "/images/products/organic-cucumbers.jpg",
  "25": "/images/products/organic-bell-peppers.jpg",
  "26": "/images/products/organic-broccoli.jpg",
  "27": "/images/products/organic-cauliflower.jpg",
  "28": "/images/products/organic-sweet-corn.jpg",
  "29": "/images/products/organic-ginger.jpg",
  "30": "/images/products/organic-garlic.jpg",
  "31": "/images/products/organic-ginger-powder.jpg",
  "32": "/images/products/organic-rice.jpg",
  "33": "/images/products/organic-brown-rice.jpg",
  "34": "/images/products/organic-quinoa.jpg",
  "35": "/images/products/organic-millet.jpg",
  "36": "/images/products/organic-barley.jpg",
  "37": "/images/products/organic-oats.jpg",
  "38": "/images/products/organic-wheat-flour.jpg",
  "39": "/images/products/organic-multigrain-flour.jpg",
  "40": "/images/products/organic-ragi-flour.jpg",
  "41": "/images/products/organic-semolina.jpg",
  "42": "/images/products/organic-pasta.jpg",
  "43": "/images/products/organic-toor-dal.jpg",
  "44": "/images/products/organic-moong-dal.jpg",
  "45": "/images/products/organic-chana-dal.jpg",
  "46": "/images/products/organic-masoor-dal.jpg",
  "47": "/images/products/organic-urad-dal.jpg",
  "48": "/images/products/organic-rajma.jpg",
  "49": "/images/products/organic-black-chana.jpg",
  "50": "/images/products/organic-green-gram.jpg",
  "51": "/images/products/organic-horse-gram.jpg",
  "52": "/images/products/organic-almonds.jpg",
  "53": "/images/products/organic-cashews.jpg",
  "54": "/images/products/organic-walnuts.jpg",
  "55": "/images/products/organic-peanuts.jpg",
  "56": "/images/products/organic-pistachios.jpg",
  "57": "/images/products/organic-chia-seeds.jpg",
  "58": "/images/products/organic-flax-seeds.jpg",
  "59": "/images/products/organic-pumpkin-seeds.jpg",
  "60": "/images/products/organic-sesame-seeds.jpg",
  "61": "/images/products/organic-sunflower-seeds.jpg",
  "62": "/images/products/organic-coconut-oil.jpg",
  "63": "/images/products/organic-olive-oil.jpg",
  "64": "/images/products/organic-mustard-oil.jpg",
  "65": "/images/products/organic-sesame-oil.jpg",
  "66": "/images/products/organic-groundnut-oil.jpg",
  "67": "/images/products/organic-sunflower-oil.jpg",
  "68": "/images/products/organic-flaxseed-oil.jpg",
  "69": "/images/products/organic-castor-oil.jpg",
  "70": "/images/products/organic-cow-ghee.jpg",
  "71": "/images/products/organic-butter.jpg",
  "72": "/images/products/organic-milk.jpg",
  "73": "/images/products/organic-paneer.jpg",
  "74": "/images/products/organic-curd.jpg",
  "75": "/images/products/organic-yogurt.jpg",
  "76": "/images/products/organic-soy-milk.jpg",
  "77": "/images/products/organic-peanut-butter.jpg",
  "78": "/images/products/organic-turmeric-powder.jpg",
  "79": "/images/products/organic-cumin-seeds.jpg",
  "80": "/images/products/organic-coriander-powder.jpg",
  "81": "/images/products/organic-garam-masala.jpg",
  "82": "/images/products/organic-black-pepper.jpg",
  "83": "/images/products/organic-cinnamon.jpg",
  "84": "/images/products/organic-cloves.jpg",
  "85": "/images/products/organic-cardamom.jpg",
  "86": "/images/products/organic-fenugreek-seeds.jpg",
  "87": "/images/products/organic-red-chilli-powder.jpg",
  "88": "/images/products/organic-mustard-seeds.jpg",
  "89": "/images/products/organic-bay-leaves.jpg",
  "90": "/images/products/organic-oregano.jpg",
  "91": "/images/products/organic-basil-leaves.jpg",
  "92": "/images/products/organic-granola.jpg",
  "93": "/images/products/organic-protein-bars.jpg",
  "94": "/images/products/organic-popcorn.jpg",
  "95": "/images/products/organic-tortilla-chips.jpg",
  "96": "/images/products/organic-kabuli-chana.jpg",
  "97": "/images/products/organic-fruit-jam.jpg",
  "98": "/images/products/organic-instant-noodles.jpg",
  "99": "/images/products/organic-salad-dressings.jpg",
  "100": "/images/products/organic-tea-coffee.jpg"
};

const CARTS_DIR = path.join(__dirname, '../data/carts');

function updateCartFiles() {
  if (!fs.existsSync(CARTS_DIR)) {
    console.log('No carts directory found');
    return;
  }

  const files = fs.readdirSync(CARTS_DIR);
  
  if (files.length === 0) {
    console.log('No cart files found');
    return;
  }

  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(CARTS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const cart = JSON.parse(content);
      let updated = false;

      if (cart.items && Array.isArray(cart.items)) {
        cart.items.forEach(item => {
          if (item.id && productImages[item.id]) {
            item.image = productImages[item.id];
            updated = true;
          }
        });
      }

      if (updated) {
        fs.writeFileSync(filePath, JSON.stringify(cart, null, 2));
        updatedCount++;
        console.log(`✅ Updated: ${file}`);
      } else {
        console.log(`⏭️  Skipped: ${file} (no changes needed)`);
      }
    } catch (err) {
      console.log(`❌ Error processing ${file}: ${err.message}`);
    }
  });

  console.log(`\n✅ Complete! Updated ${updatedCount} cart file(s)`);
}

updateCartFiles();
