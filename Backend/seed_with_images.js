import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dbConnection from "./src/config/database.js";
import Category from "./src/models/categories.model.js";
import Product from "./src/models/product.model.js";
import ProductImage from "./src/models/productImage.model.js";
import User from "./src/models/user.model.js";
import Address from "./src/models/address.model.js";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Download image helper with retry and timeout
async function downloadImage(url, filename) {
  const destPath = path.join(uploadDir, filename);
  if (fs.existsSync(destPath)) {
    const stat = fs.statSync(destPath);
    if (stat.size > 2000) {
      console.log(`[EXISTS] ${filename} (${stat.size} bytes)`);
      return `/public/uploads/${filename}`;
    }
  }

  console.log(`[DOWNLOADING] ${filename} from ${url.slice(0, 70)}...`);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length < 1000) {
      throw new Error(`Downloaded buffer too small (${buffer.length} bytes)`);
    }

    fs.writeFileSync(destPath, buffer);
    console.log(`[SAVED] ${filename} (${buffer.length} bytes)`);
    return `/public/uploads/${filename}`;
  } catch (err) {
    console.error(`[DOWNLOAD FAILED] ${filename}:`, err.message);
    // If download fails, return the external URL as fallback so images always render
    return url;
  }
}

// Complete Catalog Specification with Real Photos and Rich Details
const catalogData = {
  categories: [
    {
      name: "Lovable Plushies",
      description: "Cute, huggable companions made with extra soft plush fabrics and baby-safe materials.",
      coverImage: {
        filename: "cat-plushies-cover.jpg",
        url: "https://images.unsplash.com/photo-1760699128374-e4a4b8a7402e?w=1000&q=85"
      }
    },
    {
      name: "Velvety Blankets",
      description: "Luxurious, double-layered wraps for ultimate warmth, comfort, and peaceful lounging.",
      coverImage: {
        filename: "cat-blankets-cover.jpg",
        url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&q=85"
      }
    },
    {
      name: "Cozy Pillows",
      description: "Cloud-like support for sweet dreams, deep relaxation, and ergonomic daily comfort.",
      coverImage: {
        filename: "cat-pillows-cover.jpg",
        url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=85"
      }
    }
  ],

  products: [
    // --- CATEGORY: Lovable Plushies ---
    {
      category: "Lovable Plushies",
      name: "Marshmallow Boba Kitty Plushie",
      description: "An incredibly squishy, round kitten plushie with cute embroidered whiskers and rosy cheeks. Crafted from ultra-stretchy mochi fabric filled with down-alternative microfibers, it feels like squeezing a giant, fluffy marshmallow. Perfect for relaxing, desk comfort, or bedtime cuddles.",
      cost_price: 450.00,
      selling_price: 599.00,
      discount: 15.00,
      stock: 120,
      badge: "Bestseller",
      rating: 4.9,
      number_of_ratings: 312,
      sizes: "Small (10\"), Medium (14\"), Jumbo (20\")",
      colors: "Mochi Cream, Calico Patch, Matcha Green",
      material: "Silky stretch spandex velour with 100% hypoallergenic siliconized down-alternative fiberfill",
      care: "Machine wash cold on gentle cycle inside a laundry pouch. Air dry or tumble dry low without heat.",
      featured_on_homepage: true,
      images: [
        { filename: "plush-kitty-main.jpg", url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800&q=80" },
        { filename: "plush-kitty-1.jpg", url: "https://images.unsplash.com/photo-1565945985114-e6bbcd56282b?w=800&q=80" },
        { filename: "plush-kitty-2.jpg", url: "https://images.unsplash.com/photo-1546450985-dda6db4b7ec2?w=800&q=80" }
      ]
    },
    {
      category: "Lovable Plushies",
      name: "Honey Bear Hugging Cushion",
      description: "Meet your forever cuddle buddy. The Honey Bear plush features a velvety warm honey coat, weighted paws for relaxing embraces, and extra plush stuffing that keeps its shape day after day. Ideal for kids and adults needing warmth and comfort.",
      cost_price: 600.00,
      selling_price: 899.00,
      discount: 10.00,
      stock: 85,
      badge: "Fan Favorite",
      rating: 4.9,
      number_of_ratings: 245,
      sizes: "Standard (16\"), Jumbo (24\")",
      colors: "Warm Honey, Cinnamon Brown, Milk Tea",
      material: "Premium faux-rabbit fur, resilient 3D hollow conjugate microfiber stuffing",
      care: "Spot clean with damp cloth or gentle machine wash delicate cycle. Fluff dry.",
      featured_on_homepage: true,
      images: [
        { filename: "plush-bear-main.jpg", url: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&q=80" },
        { filename: "plush-bear-1.jpg", url: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800&q=80" },
        { filename: "plush-bear-2.jpg", url: "https://images.unsplash.com/photo-1676704904112-f16de142d28c?w=800&q=80" }
      ]
    },
    {
      category: "Lovable Plushies",
      name: "Pink Fluffy Bunny with Floppy Ears",
      description: "Delightfully soft bunny plushie with extra long, floppy ears and a fuzzy pom-pom tail. Made with certified organic cotton fibers and embroidered child-safe eyes, making it safe and gentle for all ages from newborn up.",
      cost_price: 500.00,
      selling_price: 699.00,
      discount: 20.00,
      stock: 95,
      badge: "New Arrival",
      rating: 4.8,
      number_of_ratings: 180,
      sizes: "12 inch, 18 inch",
      colors: "Blush Pink, Snow White, Lavender Mist",
      material: "100% Organic combed cotton plush, embroidered face detailing (zero hard plastic)",
      care: "Machine washable at 30°C on delicate cycle. Lay flat to air dry.",
      featured_on_homepage: true,
      images: [
        { filename: "plush-bunny-main.jpg", url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80" },
        { filename: "plush-bunny-1.jpg", url: "https://images.unsplash.com/photo-1747999613498-897c83219d1e?w=800&q=80" },
        { filename: "plush-bunny-2.jpg", url: "https://images.unsplash.com/photo-1747999613824-b87a97de88f8?w=800&q=80" }
      ]
    },
    {
      category: "Lovable Plushies",
      name: "Sleepy Puppy Snuggle Pillow",
      description: "An elongated sleeping puppy plush crafted to serve as an armrest, knee cushion, or cozy embrace pillow. Its super-stretchy fabric conforms gently to your contours, melting away tension.",
      cost_price: 550.00,
      selling_price: 799.00,
      discount: 0.00,
      stock: 60,
      badge: "Trending",
      rating: 4.7,
      number_of_ratings: 132,
      sizes: "Medium (20\"), Long (32\")",
      colors: "Caramel Brown, Toasted Almond, Charcoal Grey",
      material: "Super-soft spandex fleece with high-rebound cloud cotton",
      care: "Machine wash cold inside laundry bag. Tumble dry on lowest heat.",
      featured_on_homepage: false,
      images: [
        { filename: "plush-puppy-main.jpg", url: "https://images.pexels.com/photos/15130371/pexels-photo-15130371.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "plush-puppy-1.jpg", url: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "plush-puppy-2.jpg", url: "https://images.unsplash.com/photo-1675622988617-793a6dac8778?w=800&q=80" }
      ]
    },
    {
      category: "Lovable Plushies",
      name: "Pudgy Penguin Cozy Friend",
      description: "This plump little penguin companion features adorable mini wings, an orange beak, and an ultra-squishy belly. Soft as a cloud and guaranteed to bring a smile to anyone's face.",
      cost_price: 380.00,
      selling_price: 599.00,
      discount: 10.00,
      stock: 110,
      badge: "Staff Pick",
      rating: 4.9,
      number_of_ratings: 94,
      sizes: "Compact (10\"), Huggable (16\")",
      colors: "Classic Slate & Ice White, Glacier Blue",
      material: "Velveteen fleece, high-density squashy core",
      care: "Hand wash or gentle machine wash, line dry in shade.",
      featured_on_homepage: true,
      images: [
        { filename: "plush-penguin-main.jpg", url: "https://images.unsplash.com/photo-1716823813533-8f9fce997420?w=800&q=80" },
        { filename: "plush-penguin-1.jpg", url: "https://images.unsplash.com/photo-1686151271777-12efa81f65e0?w=800&q=80" },
        { filename: "plush-penguin-2.jpg", url: "https://images.pexels.com/photos/5240467/pexels-photo-5240467.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ]
    },

    // --- CATEGORY: Velvety Blankets ---
    {
      category: "Velvety Blankets",
      name: "CloudSherpa Dual-Sided Flannel Throw",
      description: "Experience the ultimate cocoon of warmth. Designed with 300 GSM silky flannel fleece on one side and ultra-lofty 300 GSM fluffy sherpa on the other. Non-shedding, anti-static, and delightfully cozy for movie nights and lazy Sunday mornings.",
      cost_price: 1100.00,
      selling_price: 1599.00,
      discount: 15.00,
      stock: 50,
      badge: "Bestseller",
      rating: 4.9,
      number_of_ratings: 420,
      sizes: "Throw (50x60\"), Queen (60x80\"), King (90x90\")",
      colors: "Creamy Ivory, Slate Grey, Dusty Rose, Midnight Navy",
      material: "Dual-sided 600 GSM composite: Microfiber flannel fleece front, plush sherpa reverse",
      care: "Machine wash cold separately on gentle cycle. Tumble dry on low heat. No bleach or iron.",
      featured_on_homepage: true,
      images: [
        { filename: "blanket-sherpa-main.jpg", url: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&q=80" },
        { filename: "blanket-sherpa-1.jpg", url: "https://images.unsplash.com/photo-1657582649918-6811f92e6ca0?w=800&q=80" },
        { filename: "blanket-sherpa-2.jpg", url: "https://images.pexels.com/photos/8481449/pexels-photo-8481449.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ]
    },
    {
      category: "Velvety Blankets",
      name: "Chunky Hand-Knit Chenille Blanket",
      description: "Elevate your living space with this artisanal hand-knitted chenille throw. The jumbo cable knit weave offers breathable, comforting weight and decadent texture that instantly transforms any couch or bed into a sanctuary.",
      cost_price: 1500.00,
      selling_price: 2199.00,
      discount: 10.00,
      stock: 35,
      badge: "Luxury",
      rating: 4.9,
      number_of_ratings: 178,
      sizes: "Medium Throw (48x60\"), Full (60x70\")",
      colors: "Oatmeal Beige, Cloud White, Sage Whisper",
      material: "100% Non-shedding vegan polyester chenille yarn, thick 2-inch tubular knit",
      care: "Machine washable in large mesh laundry bag on gentle cycle; lay flat to dry.",
      featured_on_homepage: true,
      images: [
        { filename: "blanket-knit-main.jpg", url: "https://images.unsplash.com/photo-1737061336164-e0bf05a0539b?w=800&q=80" },
        { filename: "blanket-knit-1.jpg", url: "https://images.pexels.com/photos/27471098/pexels-photo-27471098.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "blanket-knit-2.jpg", url: "https://images.pexels.com/photos/6633533/pexels-photo-6633533.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ]
    },
    {
      category: "Velvety Blankets",
      name: "Heritage Cozy Waffle Cotton Quilt",
      description: "Crafted from 100% pre-washed ring-spun long-staple cotton, this blanket features a dimensional honeycomb waffle weave. Provides optimal thermal regulation, keeping you cool in summer and cozy in winter.",
      cost_price: 900.00,
      selling_price: 1299.00,
      discount: 20.00,
      stock: 70,
      badge: "Staff Pick",
      rating: 4.8,
      number_of_ratings: 156,
      sizes: "Twin (66x90\"), Queen (90x90\"), King (108x90\")",
      colors: "Warm Sand, Terracotta, Olive Drab, Cloud White",
      material: "100% Long-staple combed cotton in breathable waffle weave, pre-shrunk",
      care: "Machine wash warm on normal cycle. Tumble dry medium. Softens with every wash.",
      featured_on_homepage: false,
      images: [
        { filename: "blanket-waffle-main.jpg", url: "https://images.unsplash.com/photo-1594526761005-4ccdbd608d2b?w=800&q=80" },
        { filename: "blanket-waffle-1.jpg", url: "https://images.pexels.com/photos/8266835/pexels-photo-8266835.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "blanket-waffle-2.jpg", url: "https://images.pexels.com/photos/27471098/pexels-photo-27471098.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ]
    },
    {
      category: "Velvety Blankets",
      name: "Weighted Calming Velvet Blanket",
      description: "Engineered for deep restorative rest. Non-toxic, hypoallergenic micro-glass beads are evenly distributed across 4x4 inch quilted pockets to provide therapeutic deep pressure stimulation that soothes anxiety and promotes peaceful sleep.",
      cost_price: 1700.00,
      selling_price: 2499.00,
      discount: 15.00,
      stock: 40,
      badge: "Top Rated",
      rating: 5.0,
      number_of_ratings: 289,
      sizes: "12 lbs (48x72\"), 15 lbs (60x80\"), 20 lbs (60x80\")",
      colors: "Deep Charcoal, Soft Lavender, Ocean Teal",
      material: "7-layer construction with crystal velvet exterior and odorless micro-glass bead interior",
      care: "Removable plush cover is machine washable; spot clean inner weighted core.",
      featured_on_homepage: true,
      images: [
        { filename: "blanket-weighted-main.jpg", url: "https://images.pexels.com/photos/8481449/pexels-photo-8481449.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "blanket-weighted-1.jpg", url: "https://images.pexels.com/photos/6633533/pexels-photo-6633533.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "blanket-weighted-2.jpg", url: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&q=80" }
      ]
    },
    {
      category: "Velvety Blankets",
      name: "Faux Rabbit Fur Ripple Throw",
      description: "Indulge in pure tactile extravagance with our faux rabbit fur throw. Boasting a rich 550 GSM plush pile that mimics real fur with zero cruelty, backed by velvety brushed micro-mink.",
      cost_price: 1250.00,
      selling_price: 1799.00,
      discount: 0.00,
      stock: 45,
      badge: "New Arrival",
      rating: 4.8,
      number_of_ratings: 88,
      sizes: "Standard Throw (50x60\"), Extra Large (60x80\")",
      colors: "Champagne, Smoky Quartz, Pure Snow White",
      material: "550 GSM High-density faux rabbit fur with 180 GSM micro-mink reverse",
      care: "Machine wash cold gentle cycle. Shake out and line dry or air fluff with no heat.",
      featured_on_homepage: false,
      images: [
        { filename: "blanket-fur-main.jpg", url: "https://images.pexels.com/photos/27471098/pexels-photo-27471098.jpeg?auto=compress&cs=tinysrgb&w=800" },
        { filename: "blanket-fur-1.jpg", url: "https://images.unsplash.com/photo-1657582649918-6811f92e6ca0?w=800&q=80" },
        { filename: "blanket-fur-2.jpg", url: "https://images.pexels.com/photos/8481449/pexels-photo-8481449.jpeg?auto=compress&cs=tinysrgb&w=800" }
      ]
    },

    // --- CATEGORY: Cozy Pillows ---
    {
      category: "Cozy Pillows",
      name: "Cloud Cuddle Ergonomic Pillow",
      description: "Sleep on a cloud — literally. An ultra-soft ergonomic pillow filled with hypoallergenic microfibers that conform to your shape without flattening out. Ideal for side, back, and stomach sleepers craving gentle neck support.",
      cost_price: 550.00,
      selling_price: 799.00,
      discount: 10.00,
      stock: 65,
      badge: "Bestseller",
      rating: 4.9,
      number_of_ratings: 402,
      sizes: "Standard (20x26\"), Queen (20x30\"), King (20x36\")",
      colors: "Pure White, Soft Grey, Pale Sky",
      material: "300-Thread-count breathable bamboo-cotton shell, micro-gel down alternative",
      care: "Machine wash gentle in warm water. Tumble dry low with dryer balls to restore fluff.",
      featured_on_homepage: true,
      images: [
        { filename: "pillow-cloud-main.jpg", url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&q=80" },
        { filename: "pillow-cloud-1.jpg", url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80" },
        { filename: "pillow-cloud-2.jpg", url: "https://images.unsplash.com/photo-1629949008790-ca50382f7f98?w=800&q=80" }
      ]
    },
    {
      category: "Cozy Pillows",
      name: "Starry Night Glowing LED Pillow",
      description: "A magical star-shaped plush cushion with integrated child-safe warm glow LEDs. Gently illuminates with comforting starlight hues at the tap of a button, creating the dreamiest bedroom ambiance.",
      cost_price: 650.00,
      selling_price: 999.00,
      discount: 20.00,
      stock: 40,
      badge: "Magical",
      rating: 4.9,
      number_of_ratings: 215,
      sizes: "16x16 inch Star Shape",
      colors: "Starlight Yellow, Dreamy Cyan, Twilight Pink",
      material: "Soft crystal velvet, child-safe battery-pack LED fiber optic lighting",
      care: "Spot clean only; internal electronics protected by zippered casing.",
      featured_on_homepage: true,
      images: [
        { filename: "pillow-star-main.jpg", url: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80" },
        { filename: "pillow-star-1.jpg", url: "https://images.unsplash.com/photo-1676454000663-643ab3995b55?w=800&q=80" },
        { filename: "pillow-star-2.jpg", url: "https://images.unsplash.com/photo-1557502236-b389b3a38a7d?w=800&q=80" }
      ]
    },
    {
      category: "Cozy Pillows",
      name: "Memory Foam Neck Contour Pillow",
      description: "Scientifically engineered cervical contour design follows the natural curve of your spine to reduce neck stiffness and back tension. Crafted with slow-rebound cooling gel-infused memory foam that stays fresh all night long.",
      cost_price: 800.00,
      selling_price: 1199.00,
      discount: 15.00,
      stock: 55,
      badge: "Orthopedic",
      rating: 4.8,
      number_of_ratings: 198,
      sizes: "Standard Contour (24x14x4.5\")",
      colors: "Cooling Ice Silk White, Heather Grey",
      material: "Slow-rebound CertiPUR-US cooling gel memory foam, washable jacquard air-layer cover",
      care: "Zippered outer cover is machine washable; do not wash memory foam core.",
      featured_on_homepage: false,
      images: [
        { filename: "pillow-contour-main.jpg", url: "https://images.unsplash.com/photo-1629949008790-ca50382f7f98?w=800&q=80" },
        { filename: "pillow-contour-1.jpg", url: "https://images.unsplash.com/photo-1544582207-9bd1b74b1596?w=800&q=80" },
        { filename: "pillow-contour-2.jpg", url: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80" }
      ]
    },
    {
      category: "Cozy Pillows",
      name: "Daisy Bloom Tufted Floor & Sofa Cushion",
      description: "Charming flower-shaped cushion with sculpted petals and cheerful contrasting center. Thickly padded for comfortable seating on chairs, floors, bay windows, or reading nooks.",
      cost_price: 580.00,
      selling_price: 899.00,
      discount: 0.00,
      stock: 75,
      badge: "Trending",
      rating: 4.9,
      number_of_ratings: 167,
      sizes: "Small (16\"), Medium (22\"), Giant (28\")",
      colors: "Sunny Yellow & White, Pastel Pink, Sage & Cream",
      material: "Elastic spandex velour outer, ultra-plush resilient PP cotton fill",
      care: "Machine wash cold gentle cycle inside pillowcase, tumble dry low.",
      featured_on_homepage: true,
      images: [
        { filename: "pillow-daisy-main.jpg", url: "https://images.unsplash.com/photo-1557502236-b389b3a38a7d?w=800&q=80" },
        { filename: "pillow-daisy-1.jpg", url: "https://images.unsplash.com/photo-1531592762598-58a792d73aed?w=800&q=80" },
        { filename: "pillow-daisy-2.jpg", url: "https://images.unsplash.com/photo-1598295094949-829796d200d1?w=800&q=80" }
      ]
    },
    {
      category: "Cozy Pillows",
      name: "Velvet Round Bolster Roll Cushion",
      description: "A classic cylindrical bolster pillow upholstered in lustrous Dutch velvet with central button-tufting and gathered side rosettes. Offers firm, soothing lumbar and leg support.",
      cost_price: 450.00,
      selling_price: 699.00,
      discount: 10.00,
      stock: 50,
      badge: "Aesthetic",
      rating: 4.7,
      number_of_ratings: 92,
      sizes: "Standard (6x16\"), Long (8x24\")",
      colors: "Mustard Gold, Forest Green, Dusty Mauve, Midnight Navy",
      material: "Plush Dutch velvet cover with button-tufted detailing, firm poly-fill",
      care: "Spot clean with mild fabric cleaner, air dry.",
      featured_on_homepage: false,
      images: [
        { filename: "pillow-bolster-main.jpg", url: "https://images.unsplash.com/photo-1598295094949-829796d200d1?w=800&q=80" },
        { filename: "pillow-bolster-1.jpg", url: "https://images.unsplash.com/photo-1557502236-b389b3a38a7d?w=800&q=80" },
        { filename: "pillow-bolster-2.jpg", url: "https://images.unsplash.com/photo-1544582207-9bd1b74b1596?w=800&q=80" }
      ]
    }
  ]
};

async function executeSeed() {
  console.log("==================================================");
  console.log("🧸 MyFluffy Shop - Comprehensive Seeder Starting");
  console.log("==================================================");

  try {
    // 1. Authenticate & Sync DB
    console.log("Connecting to PostgreSQL...");
    await dbConnection.authenticate();
    console.log("PostgreSQL connection verified.");

    console.log("Syncing database models...");
    await dbConnection.sync({ alter: true });
    console.log("Database models synchronized.");

    // 2. Download and Seed Categories
    console.log("\n--- Processing Categories ---");
    const categoryMap = {};

    for (const cat of catalogData.categories) {
      console.log(`Processing category: ${cat.name}...`);
      const coverPath = await downloadImage(cat.coverImage.url, cat.coverImage.filename);

      let record = await Category.findOne({ where: { name: cat.name } });
      if (record) {
        await record.update({
          description: cat.description,
          image_url: coverPath
        });
        console.log(`[UPDATED] Category: ${cat.name} -> ID: ${record.id}`);
      } else {
        record = await Category.create({
          name: cat.name,
          description: cat.description,
          image_url: coverPath
        });
        console.log(`[CREATED] Category: ${cat.name} -> ID: ${record.id}`);
      }
      categoryMap[cat.name] = record.id;
    }

    // 3. Download and Seed Products
    console.log("\n--- Processing Products ---");
    let productCount = 0;
    let imageRecordCount = 0;

    for (const prod of catalogData.products) {
      console.log(`\nProcessing product [${prod.name}]...`);

      // Download Main Image
      const mainImg = prod.images[0];
      const mainImgPath = await downloadImage(mainImg.url, mainImg.filename);

      // Download Additional Gallery Images
      const galleryPaths = [];
      for (let i = 1; i < prod.images.length; i++) {
        const galImg = prod.images[i];
        const galPath = await downloadImage(galImg.url, galImg.filename);
        galleryPaths.push(galPath);
      }

      const slug = slugify(prod.name, { lower: true, strict: true });
      const categoryId = categoryMap[prod.category];

      const productPayload = {
        name: prod.name,
        slug: slug,
        description: prod.description,
        cost_price: prod.cost_price,
        selling_price: prod.selling_price,
        discount: prod.discount,
        stock: prod.stock,
        category_id: categoryId,
        image_url: mainImgPath,
        badge: prod.badge,
        rating: prod.rating,
        number_of_ratings: prod.number_of_ratings,
        sizes: prod.sizes,
        colors: prod.colors,
        material: prod.material,
        care: prod.care,
        featured_on_homepage: prod.featured_on_homepage,
        is_active: true
      };

      // Check if product already exists
      let productRecord = await Product.findOne({ where: { slug: slug } });
      if (!productRecord) {
        productRecord = await Product.findOne({ where: { name: prod.name } });
      }

      if (productRecord) {
        await productRecord.update(productPayload);
        console.log(`[UPDATED] Product: ${prod.name} (ID: ${productRecord.id})`);
      } else {
        productRecord = await Product.create(productPayload);
        console.log(`[CREATED] Product: ${prod.name} (ID: ${productRecord.id})`);
      }
      productCount++;

      // Remove existing images for this product to prevent duplicate accumulation
      await ProductImage.destroy({ where: { product_id: productRecord.id } });

      // Insert gallery images into product_images table
      const imageRecordsToInsert = galleryPaths.map(imgPath => ({
        product_id: productRecord.id,
        image_url: imgPath
      }));

      if (imageRecordsToInsert.length > 0) {
        await ProductImage.bulkCreate(imageRecordsToInsert);
        imageRecordCount += imageRecordsToInsert.length;
        console.log(`[ATTACHED] ${imageRecordsToInsert.length} gallery images to ${prod.name}`);
      }
    }

    // 4. Seed Essential Accounts
    console.log("\n--- Checking Essential Users ---");
    const [normalUser] = await User.findOrCreate({
      where: { email: "user@myfluffy.com" },
      defaults: {
        email: "user@myfluffy.com",
        password: "password123",
        role: "user",
        is_active: true,
        is_email_verified: true
      }
    });

    await User.findOrCreate({
      where: { email: "admin@myfluffy.shop" },
      defaults: {
        email: "admin@myfluffy.shop",
        password: "admin123",
        role: "admin",
        is_active: true,
        is_email_verified: true
      }
    });

    await User.findOrCreate({
      where: { email: "admin@myfluffy.com" },
      defaults: {
        email: "admin@myfluffy.com",
        password: "password123",
        role: "admin",
        is_active: true,
        is_email_verified: true
      }
    });

    // Default address for testing checkout
    await Address.findOrCreate({
      where: { user_id: normalUser.id },
      defaults: {
        user_id: normalUser.id,
        full_name: "John Fluffy Doe",
        phone: "9876543210",
        address_line: "123 Fluffy Clouds Lane, Dreamland",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        is_default: true
      }
    });
    console.log("Essential users and address verified.");

    console.log("\n==================================================");
    console.log("🎉 SEEDING & IMAGE DOWNLOAD COMPLETED SUCCESSFULLY!");
    console.log(`- Categories Seeded: ${Object.keys(categoryMap).length}`);
    console.log(`- Products Seeded:   ${productCount}`);
    console.log(`- Gallery Images:    ${imageRecordCount}`);
    console.log("==================================================");
  } catch (error) {
    console.error("FATAL ERROR during seeding:", error);
    process.exit(1);
  } finally {
    await dbConnection.close();
  }
}

executeSeed();

