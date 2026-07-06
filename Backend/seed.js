import dbConnection from "./src/config/database.js";
import Category from "./src/models/categories.model.js";
import Product from "./src/models/product.model.js";
import User from "./src/models/user.model.js";
import Address from "./src/models/address.model.js";

const categoriesData = [
  {
    name: "Cozy Pillows",
    description: "Cloud-like support for sweet dreams and deep relaxation.",
  },
  {
    name: "Lovable Plushies",
    description: "Cute, huggable companions made with extra soft plush fabrics.",
  },
  {
    name: "Velvety Blankets",
    description: "Luxurious, double-layered wraps for ultimate warmth.",
  }
];

const productsData = (categoryIds) => [
  {
    name: "Cloud Cuddle Pillow",
    description: "An ultra-soft ergonomic pillow filled with hypoallergenic microfibers that conform to your shape. Perfect for side and back sleepers.",
    cost_price: 600.00,
    selling_price: 799.00,
    discount: 10,
    stock: 50,
    category_id: categoryIds["Cozy Pillows"],
    image_url: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Marshmallow Kitty Plushie",
    description: "An incredibly squishy, round kitten plushie. So soft it feels like squeezing a giant marshmallow! Safe for all ages.",
    cost_price: 450.00,
    selling_price: 599.00,
    discount: 0,
    stock: 120,
    category_id: categoryIds["Lovable Plushies"],
    image_url: "https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Pink Fluffy Bunny",
    description: "A lovely bunny plushie with extra long, floppy ears and a fuzzy cotton tail. Crafted from premium organic cotton threads.",
    cost_price: 500.00,
    selling_price: 699.00,
    discount: 15,
    stock: 80,
    category_id: categoryIds["Lovable Plushies"],
    image_url: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Velvet Dream Blanket",
    description: "Wrap yourself in pure comfort. This blanket features a dual-sided design with silky flannel fleece on one side and fluffy sherpa on the other.",
    cost_price: 1200.00,
    selling_price: 1599.00,
    discount: 5,
    stock: 35,
    category_id: categoryIds["Velvety Blankets"],
    image_url: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Starry Night Glowing Pillow",
    description: "A beautiful star-shaped cushion with tiny integrated LED bulbs that glow in alternating warm colors when tapped. Cozy nightlight!",
    cost_price: 750.00,
    selling_price: 999.00,
    discount: 20,
    stock: 25,
    category_id: categoryIds["Cozy Pillows"],
    image_url: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    is_active: true,
  }
];

async function seed() {
  try {
    console.log("Checking DB connection...");
    await dbConnection.authenticate();
    console.log("DB connection established successfully. Syncing database schema...");
    
    // Sync models
    await dbConnection.sync({ alter: true });
    console.log("Database schema synchronized.");

    // 1. Seed Categories
    console.log("Seeding categories...");
    const categoryMap = {};
    for (const cat of categoriesData) {
      const [record] = await Category.findOrCreate({
        where: { name: cat.name },
        defaults: cat
      });
      categoryMap[cat.name] = record.id;
    }
    console.log("Categories seeded successfully.");

    // 2. Seed Products
    console.log("Seeding products...");
    const productsToCreate = productsData(categoryMap);
    for (const prod of productsToCreate) {
      await Product.findOrCreate({
        where: { name: prod.name },
        defaults: prod
      });
    }
    console.log("Products seeded successfully.");

    // 3. Seed Users
    console.log("Seeding users...");
    
    // Test normal user
    const [normalUser] = await User.findOrCreate({
      where: { email: "user@myfluffy.com" },
      defaults: {
        email: "user@myfluffy.com",
        password: "password123", // Will be hashed by hooks
        role: "user",
        is_active: true,
        is_email_verified: true,
      }
    });

    // Test admin user
    await User.findOrCreate({
      where: { email: "admin@myfluffy.com" },
      defaults: {
        email: "admin@myfluffy.com",
        password: "password123",
        role: "admin",
        is_active: true,
        is_email_verified: true,
      }
    });

    // Seed admin@myfluffy.shop with admin123
    await User.findOrCreate({
      where: { email: "admin@myfluffy.shop" },
      defaults: {
        email: "admin@myfluffy.shop",
        password: "admin123",
        role: "admin",
        is_active: true,
        is_email_verified: true,
      }
    });
    console.log("Users seeded successfully.");

    // 4. Seed default address for normal user
    console.log("Seeding default address...");
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
    console.log("Default address seeded successfully.");

    console.log("SEEDING COMPLETED SUCCESSFULLY!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await dbConnection.close();
  }
}

seed();
