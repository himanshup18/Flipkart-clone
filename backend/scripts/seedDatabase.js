import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// Use service role key for admin operations like truncating tables
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const categories = [
  { name: "Mobiles & Tablets", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Electronics", slug: "electronics" },
  { name: "TVs & Appliances", slug: "home-furniture" },
  { name: "Home & Furniture", slug: "home-furniture" },
  { name: "Beauty, Food & More", slug: "beauty" },
  { name: "Grocery", slug: "grocery" },
];

const products = [
  // Electronics
  {
    name: "Samsung Galaxy S23 Ultra",
    description:
      "Latest flagship smartphone with 200MP camera, 12GB RAM, 256GB storage",
    price: 124999,
    original_price: 139999,
    discount_percent: 11,
    category: "electronics",
    stock: 50,
    rating: 4.5,
    review_count: 1234,
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500",
    ],
    specifications: {
      display: "6.8 inch Dynamic AMOLED",
      processor: "Snapdragon 8 Gen 2",
      ram: "12GB",
      storage: "256GB",
      camera: "200MP + 12MP + 10MP",
      battery: "5000mAh",
    },
  },
  {
    name: "Apple iPhone 15 Pro",
    description: "Titanium design, A17 Pro chip, Pro camera system",
    price: 134900,
    original_price: 149900,
    discount_percent: 10,
    category: "electronics",
    stock: 30,
    rating: 4.7,
    review_count: 2345,
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    ],
    specifications: {
      display: "6.1 inch Super Retina XDR",
      processor: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      camera: "48MP + 12MP + 12MP",
      battery: "3274mAh",
    },
  },
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    description:
      "Industry-leading noise cancellation with premium sound quality",
    price: 29990,
    original_price: 34990,
    discount_percent: 14,
    category: "electronics",
    stock: 100,
    rating: 4.6,
    review_count: 567,
    brand: "Sony",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    specifications: {
      type: "Over-ear",
      connectivity: "Bluetooth 5.2",
      battery: "30 hours",
      noise_cancellation: "Yes",
      weight: "250g",
    },
  },
  {
    name: "MacBook Pro 14-inch M3",
    description: "Powerful laptop with M3 chip, 16GB RAM, 512GB SSD",
    price: 199900,
    original_price: 219900,
    discount_percent: 9,
    category: "electronics",
    stock: 25,
    rating: 4.8,
    review_count: 890,
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
    ],
    specifications: {
      processor: "Apple M3",
      ram: "16GB",
      storage: "512GB SSD",
      display: "14.2 inch Liquid Retina XDR",
      graphics: "10-core GPU",
    },
  },
  // Fashion
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max cushioning",
    price: 8999,
    original_price: 10999,
    discount_percent: 18,
    category: "fashion",
    stock: 150,
    rating: 4.4,
    review_count: 234,
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500",
    ],
    specifications: {
      material: "Mesh and Synthetic",
      sole: "Rubber",
      closure: "Lace-up",
      color: "Black/White",
      size: "Available in all sizes",
    },
  },
  {
    name: "Levi's 501 Original Jeans",
    description: "Classic straight-fit jeans, 100% cotton",
    price: 3999,
    original_price: 4999,
    discount_percent: 20,
    category: "fashion",
    stock: 200,
    rating: 4.3,
    review_count: 456,
    brand: "Levi's",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
    ],
    specifications: {
      material: "100% Cotton",
      fit: "Straight",
      wash: "Dark Blue",
      sizes: "28-40",
    },
  },
  {
    name: "Adidas Originals T-Shirt",
    description: "Classic cotton t-shirt with iconic three stripes",
    price: 1299,
    original_price: 1799,
    discount_percent: 28,
    category: "fashion",
    stock: 300,
    rating: 4.2,
    review_count: 123,
    brand: "Adidas",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500",
    ],
    specifications: {
      material: "100% Cotton",
      fit: "Regular",
      color: "Black",
      sizes: "S, M, L, XL",
    },
  },
  // Home & Furniture
  {
    name: "IKEA MALM Bed Frame",
    description: "Modern bed frame with storage drawers, Queen size",
    price: 24999,
    original_price: 29999,
    discount_percent: 17,
    category: "home-furniture",
    stock: 40,
    rating: 4.5,
    review_count: 234,
    brand: "IKEA",
    images: [
      "https://images.unsplash.com/photo-1631889993954-0b6a0e126b87?w=500",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    ],
    specifications: {
      material: "Particleboard",
      size: "Queen (160x200 cm)",
      color: "White",
      weight_capacity: "200 kg",
    },
  },
  {
    name: "Samsung 55-inch 4K Smart TV",
    description: "Crystal UHD 4K Smart TV with Tizen OS",
    price: 54999,
    original_price: 69999,
    discount_percent: 21,
    category: "home-furniture",
    stock: 60,
    rating: 4.6,
    review_count: 567,
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500",
    ],
    specifications: {
      screen_size: "55 inch",
      resolution: "4K UHD (3840x2160)",
      smart_platform: "Tizen OS",
      hdr: "HDR10+",
      ports: "3x HDMI, 2x USB",
    },
  },
  // Books
  {
    name: "The Psychology of Money",
    description:
      "Timeless lessons on wealth, greed, and happiness by Morgan Housel",
    price: 299,
    original_price: 399,
    discount_percent: 25,
    category: "books",
    stock: 500,
    rating: 4.7,
    review_count: 1234,
    brand: "HarperCollins",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    ],
    specifications: {
      author: "Morgan Housel",
      pages: "256",
      language: "English",
      format: "Paperback",
      isbn: "978-9390166268",
    },
  },
  {
    name: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    price: 399,
    original_price: 499,
    discount_percent: 20,
    category: "books",
    stock: 400,
    rating: 4.8,
    review_count: 2345,
    brand: "Penguin",
    images: [
      "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
    ],
    specifications: {
      author: "James Clear",
      pages: "320",
      language: "English",
      format: "Paperback",
      isbn: "978-1847941831",
    },
  },
  // Sports
  {
    name: "Yonex Badminton Racket",
    description: "Professional grade badminton racket with carbon fiber frame",
    price: 3999,
    original_price: 5499,
    discount_percent: 27,
    category: "sports",
    stock: 80,
    rating: 4.5,
    review_count: 345,
    brand: "Yonex",
    images: [
      "https://images.unsplash.com/photo-1622163642993-93b2c7e4d0a6?w=500",
      "https://images.unsplash.com/photo-1622163642993-93b2c7e4d0a6?w=500",
    ],
    specifications: {
      material: "Carbon Fiber",
      weight: "85g",
      grip_size: "G4",
      string_tension: "20-28 lbs",
    },
  },
  {
    name: "Nike Basketball",
    description: "Official size basketball with premium grip",
    price: 1999,
    original_price: 2499,
    discount_percent: 20,
    category: "sports",
    stock: 120,
    rating: 4.4,
    review_count: 234,
    brand: "Nike",
    images: [
      "https://images.unsplash.com/photo-1546519638-70e1e6c5c5c3?w=500",
      "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=500",
    ],
    specifications: {
      size: "Size 7 (Official)",
      material: "Composite Leather",
      weight: "600g",
      color: "Orange",
    },
  },
  // Beauty
  {
    name: "L'Oreal Paris Revitalift Serum",
    description: "Anti-aging face serum with hyaluronic acid",
    price: 899,
    original_price: 1299,
    discount_percent: 31,
    category: "beauty",
    stock: 200,
    rating: 4.3,
    review_count: 567,
    brand: "L'Oreal",
    images: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500",
    ],
    specifications: {
      volume: "30ml",
      skin_type: "All",
      key_ingredient: "Hyaluronic Acid",
      spf: "No",
    },
  },
  {
    name: "Maybelline New York Mascara",
    description: "Volumizing mascara for dramatic lashes",
    price: 499,
    original_price: 699,
    discount_percent: 29,
    category: "beauty",
    stock: 250,
    rating: 4.5,
    review_count: 890,
    brand: "Maybelline",
    images: [
      "https://images.unsplash.com/photo-1631210862125-6914e1d7b1e3?w=500",
      "https://images.unsplash.com/photo-1631210862125-6914e1d7b1e3?w=500",
    ],
    specifications: {
      volume: "9.2ml",
      color: "Black",
      waterproof: "No",
      brush_type: "Volumizing",
    },
  },
];

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Clear existing data (using RPC or direct deletes)
    console.log("Clearing existing data...");
    await supabase.from("order_items").delete().neq("id", 0);
    await supabase.from("orders").delete().neq("id", 0);
    await supabase.from("cart").delete().neq("id", 0);
    await supabase.from("products").delete().neq("id", 0);
    await supabase.from("categories").delete().neq("id", 0);

    // Insert categories
    console.log("Inserting categories...");
    const { data: insertedCategories, error: categoriesError } = await supabase
      .from("categories")
      .insert(categories)
      .select();

    if (categoriesError) {
      throw categoriesError;
    }

    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      const originalCat = categories.find((c) => c.slug === cat.slug);
      if (originalCat) {
        categoryMap[originalCat.slug] = cat.id;
      }
    });

    // Insert products
    console.log("Inserting products...");
    const productsToInsert = products.map((product) => {
      const categoryId = categoryMap[product.category];
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        original_price: product.original_price,
        discount_percent: product.discount_percent,
        category_id: categoryId,
        stock: product.stock,
        rating: product.rating,
        review_count: product.review_count,
        brand: product.brand,
        images: product.images,
        specifications: product.specifications,
      };
    });

    const { error: productsError } = await supabase
      .from("products")
      .insert(productsToInsert);

    if (productsError) {
      throw productsError;
    }

    console.log("Database seeded successfully!");
    console.log(
      `Inserted ${categories.length} categories and ${products.length} products`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
