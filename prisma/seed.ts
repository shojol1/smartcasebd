import { PrismaClient, Role, ProductStatus, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SMARTCASEBD database seed...");

  // 1. Seed Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.upsert({
    where: { phone: "01700000000" },
    update: {},
    create: {
      name: "SmartCaseBD Super Admin",
      phone: "01700000000",
      email: "admin@smartcasebd.com",
      passwordHash: adminPasswordHash,
      role: Role.SUPER_ADMIN,
      status: true,
    },
  });
  console.log("✅ Seeded Admin User:", adminUser.email);

  // 2. Seed Categories
  const categories = [
    {
      name: "Aramid Fiber (Kevlar)",
      slug: "aramid-fiber",
      description: "Ultra-slim, aerospace-grade Kevlar protection with matte grip.",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "MagSafe Heavy Armor",
      slug: "magsafe-armor",
      description: "Military grade drop tested cases with integrated strong N52 neodymium magnets.",
      image: "https://images.unsplash.com/photo-1541877206-e066060c5db6?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Leather Luxury",
      slug: "leather-luxury",
      description: "Handcrafted full-grain leather cases that age gracefully over time.",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Anti-Yellowing Clear Shield",
      slug: "clear-shield",
      description: "Crystal clear polycarbonate with UV-resisting coating to showcase device color.",
      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log("✅ Seeded Categories:", Object.keys(categoryMap).length);

  // 3. Seed Phone Brands, Series, and Phone Models
  const brandsData = [
    {
      name: "Apple",
      slug: "apple",
      logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=80",
      series: [
        {
          name: "iPhone 17 Series",
          slug: "iphone-17-series",
          models: [
            { name: "iPhone 17 Pro Max", slug: "iphone-17-pro-max", releaseYear: 2025 },
            { name: "iPhone 17 Pro", slug: "iphone-17-pro", releaseYear: 2025 },
            { name: "iPhone 17 Air", slug: "iphone-17-air", releaseYear: 2025 },
            { name: "iPhone 17", slug: "iphone-17", releaseYear: 2025 },
          ],
        },
        {
          name: "iPhone 16 Series",
          slug: "iphone-16-series",
          models: [
            { name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", releaseYear: 2024 },
            { name: "iPhone 16 Pro", slug: "iphone-16-pro", releaseYear: 2024 },
            { name: "iPhone 16 Plus", slug: "iphone-16-plus", releaseYear: 2024 },
            { name: "iPhone 16", slug: "iphone-16", releaseYear: 2024 },
          ],
        },
      ],
    },
    {
      name: "Samsung",
      slug: "samsung",
      logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=300&auto=format&fit=crop&q=80",
      series: [
        {
          name: "Galaxy S Series",
          slug: "galaxy-s-series",
          models: [
            { name: "Samsung Galaxy S26 Ultra", slug: "galaxy-s26-ultra", releaseYear: 2026 },
            { name: "Samsung Galaxy S26+", slug: "galaxy-s26-plus", releaseYear: 2026 },
            { name: "Samsung Galaxy S26", slug: "galaxy-s26", releaseYear: 2026 },
            { name: "Samsung Galaxy S25 Ultra", slug: "galaxy-s25-ultra", releaseYear: 2025 },
            { name: "Samsung Galaxy S25+", slug: "galaxy-s25-plus", releaseYear: 2025 },
          ],
        },
        {
          name: "Galaxy Z Fold & Flip",
          slug: "galaxy-z-series",
          models: [
            { name: "Samsung Galaxy Z Fold 7", slug: "galaxy-z-fold-7", releaseYear: 2025 },
            { name: "Samsung Galaxy Z Flip 7", slug: "galaxy-z-flip-7", releaseYear: 2025 },
          ],
        },
      ],
    },
    {
      name: "Google Pixel",
      slug: "google-pixel",
      logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80",
      series: [
        {
          name: "Pixel 9 Series",
          slug: "pixel-9-series",
          models: [
            { name: "Google Pixel 9 Pro XL", slug: "pixel-9-pro-xl", releaseYear: 2024 },
            { name: "Google Pixel 9 Pro", slug: "pixel-9-pro", releaseYear: 2024 },
            { name: "Google Pixel 9", slug: "pixel-9", releaseYear: 2024 },
          ],
        },
      ],
    },
    {
      name: "OnePlus",
      slug: "oneplus",
      logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&auto=format&fit=crop&q=80",
      series: [
        {
          name: "OnePlus Flagships",
          slug: "oneplus-flagships",
          models: [
            { name: "OnePlus 13", slug: "oneplus-13", releaseYear: 2025 },
            { name: "OnePlus 12", slug: "oneplus-12", releaseYear: 2024 },
          ],
        },
      ],
    },
  ];

  const brandMap: Record<string, string> = {};
  const modelMap: Record<string, { id: string; name: string }> = {};

  for (const b of brandsData) {
    const brandCreated = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        logo: b.logo,
        description: `Official Flagship Cases for ${b.name} devices in Bangladesh.`,
      },
    });
    brandMap[b.slug] = brandCreated.id;

    for (const s of b.series) {
      const seriesCreated = await prisma.series.upsert({
        where: { slug: s.slug },
        update: {},
        create: {
          brandId: brandCreated.id,
          name: s.name,
          slug: s.slug,
        },
      });

      for (const m of s.models) {
        const modelCreated = await prisma.phoneModel.upsert({
          where: { slug: m.slug },
          update: {},
          create: {
            seriesId: seriesCreated.id,
            name: m.name,
            slug: m.slug,
            releaseYear: m.releaseYear,
          },
        });
        modelMap[m.slug] = { id: modelCreated.id, name: modelCreated.name };
      }
    }
  }

  console.log("✅ Seeded Brands, Series & Phone Models:", Object.keys(modelMap).length, "models total.");

  // 4. Seed Products with Variants & Images
  const sampleProducts = [
    {
      name: "Carbon Shield Kevlar MagSafe Case",
      slug: "carbon-shield-kevlar-magsafe",
      sku: "CS-KEV-001",
      categorySlug: "aramid-fiber",
      brandSlug: "apple",
      modelSlug: "iphone-17-pro-max",
      description: "Crafted from 1500D aerospace-grade real Aramid Fiber. Features zero signal interference, 3D grip texture, elevated metal camera ring protection, and built-in N52 strong MagSafe magnet array.",
      shortDescription: "Ultra-thin 0.85mm Kevlar Case with MagSafe for iPhone 17 Pro Max.",
      basePrice: 2450,
      compareAtPrice: 2850,
      costPrice: 1300,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      material: "Aramid Fiber (Kevlar)",
      color: "Obsidian Black",
      finish: "Matte 3D Grip",
      magSafeCompatible: true,
      warrantyInfo: "1 Year Fit & Magnetic Strength Guarantee",
      images: [
        "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541877206-e066060c5db6?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { colorName: "Obsidian Black", colorHex: "#111111", price: 2450, compareAtPrice: 2850, stock: 35, sku: "CS-KEV-17PM-BLK" },
        { colorName: "Titanium Gray", colorHex: "#4B5563", price: 2450, compareAtPrice: 2850, stock: 18, sku: "CS-KEV-17PM-GRY" },
        { colorName: "Midnight Navy", colorHex: "#1E3A8A", price: 2450, compareAtPrice: 2850, stock: 12, sku: "CS-KEV-17PM-NVY" },
      ],
    },
    {
      name: "Apex Armor Shockproof Stand Case",
      slug: "apex-armor-shockproof-stand",
      sku: "APX-ARM-002",
      categorySlug: "magsafe-armor",
      brandSlug: "samsung",
      modelSlug: "galaxy-s26-ultra",
      description: "Dual-layer TPU and polycarbonate hybrid case engineered for 12ft drop protection. Features a recessed zinc-alloy kickstand, camera barrier bezel, and tactile metallic buttons.",
      shortDescription: "12ft Drop Tested Heavy Duty Stand Case for Galaxy S26 Ultra.",
      basePrice: 1950,
      compareAtPrice: 2400,
      costPrice: 950,
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      material: "MagSafe Armor Polycarbonate",
      color: "Stealth Black",
      finish: "Textured Armor",
      magSafeCompatible: true,
      warrantyInfo: "6 Months Replacement Warranty",
      images: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { colorName: "Stealth Black", colorHex: "#09090B", price: 1950, compareAtPrice: 2400, stock: 42, sku: "APX-S26U-BLK" },
        { colorName: "Army Green", colorHex: "#365314", price: 1950, compareAtPrice: 2400, stock: 15, sku: "APX-S26U-GRN" },
      ],
    },
    {
      name: "Royal Horween Leather MagSafe Sleeve",
      slug: "royal-horween-leather-magsafe",
      slugSuffix: "iphone-17-pro",
      sku: "RYL-LTH-003",
      categorySlug: "leather-luxury",
      brandSlug: "apple",
      modelSlug: "iphone-17-pro",
      description: "Handcrafted from genuine full-grain Horween leather imported from USA. Develops a rich custom patina over months of use. Lined with soft microfiber to protect phone finish.",
      shortDescription: "Handcrafted Full-Grain Leather Case with Patina finish for iPhone 17 Pro.",
      basePrice: 3200,
      compareAtPrice: 3800,
      costPrice: 1800,
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      material: "Premium Genuine Leather",
      color: "Cognac Tan",
      finish: "Natural Leather Patina",
      magSafeCompatible: true,
      warrantyInfo: "1 Year Craftsmanship Warranty",
      images: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { colorName: "Cognac Tan", colorHex: "#9A3412", price: 3200, compareAtPrice: 3800, stock: 10, sku: "RYL-17P-TAN" },
        { colorName: "Rustic Brown", colorHex: "#78350F", price: 3200, compareAtPrice: 3800, stock: 8, sku: "RYL-17P-BRN" },
      ],
    },
    {
      name: "Lucid Clarity Anti-Yellowing Crystal Case",
      slug: "lucid-clarity-anti-yellowing",
      sku: "LCD-CLR-004",
      categorySlug: "clear-shield",
      brandSlug: "google-pixel",
      modelSlug: "pixel-9-pro",
      description: "Engineered with anti-yellowing Bayer polycarbonate from Germany. Crystal clear transparency allows Pixel 9 Pro signature color design to shine through while offering raised screen corners.",
      shortDescription: "Crystal Clear Non-Yellowing Protective Case for Google Pixel 9 Pro.",
      basePrice: 1450,
      compareAtPrice: 1800,
      costPrice: 600,
      isFeatured: false,
      isBestseller: true,
      isNewArrival: true,
      material: "Anti-Yellowing Crystal Clear",
      color: "Ultra Clear",
      finish: "Glossy Optical Glass",
      magSafeCompatible: true,
      warrantyInfo: "6 Months Anti-Yellowing Guarantee",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80",
      ],
      variants: [
        { colorName: "Ultra Clear", colorHex: "#F8FAFC", price: 1450, compareAtPrice: 1800, stock: 50, sku: "LCD-PX9P-CLR" },
        { colorName: "Smokey Black", colorHex: "#334155", price: 1450, compareAtPrice: 1800, stock: 22, sku: "LCD-PX9P-SMK" },
      ],
    },
  ];

  for (const prod of sampleProducts) {
    const categoryId = categoryMap[prod.categorySlug];
    const brandId = brandMap[prod.brandSlug];
    const model = modelMap[prod.modelSlug];

    if (!categoryId || !brandId || !model) continue;

    const createdProd = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        categoryId: categoryId,
        brandId: brandId,
        phoneModelId: model.id,
        description: prod.description,
        shortDescription: prod.shortDescription,
        basePrice: prod.basePrice,
        compareAtPrice: prod.compareAtPrice,
        costPrice: prod.costPrice,
        status: ProductStatus.PUBLISHED,
        isFeatured: prod.isFeatured,
        isBestseller: prod.isBestseller,
        isNewArrival: prod.isNewArrival,
        material: prod.material,
        color: prod.color,
        finish: prod.finish,
        magSafeCompatible: prod.magSafeCompatible,
        warrantyInfo: prod.warrantyInfo,
        seoTitle: `${prod.name} for ${model.name} | SmartCaseBD`,
        seoDescription: prod.shortDescription,
      },
    });

    // Add Images
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProd.id,
          url: prod.images[i],
          altText: `${prod.name} ${i + 1}`,
          isThumbnail: i === 0,
          sortOrder: i,
        },
      });
    }

    // Add Variants
    for (const v of prod.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProd.id,
          phoneModelId: model.id,
          colorName: v.colorName,
          colorHex: v.colorHex,
          sku: v.sku,
          price: v.price,
          compareAtPrice: v.compareAtPrice,
          stock: v.stock,
          image: prod.images[0],
        },
      });
    }
  }

  console.log("✅ Seeded Sample Flagship Products & Variants.");

  // 5. Seed Coupons
  await prisma.coupon.upsert({
    where: { code: "WELCOME100" },
    update: {},
    create: {
      code: "WELCOME100",
      discountType: DiscountType.FIXED,
      discountValue: 100,
      minOrderValue: 1000,
      usageLimit: 500,
      status: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: "FLAGSHIP10" },
    update: {},
    create: {
      code: "FLAGSHIP10",
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderValue: 2000,
      maxDiscountAmount: 400,
      usageLimit: 200,
      status: true,
    },
  });

  console.log("✅ Seeded Promo Coupons.");

  // 6. Seed Banners
  await prisma.banner.create({
    data: {
      title: "PREMIUM PROTECTION FOR FLAGSHIP PHONES",
      subtitle: "Aerospace-grade Kevlar, MagSafe Armor & Genuine Horween Leather cases crafted for perfection.",
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=1600&auto=format&fit=crop&q=80",
      buttonText: "EXPLORE CASES",
      position: "HERO",
      sortOrder: 1,
    },
  });

  console.log("✅ Seeded Banners.");
  console.log("🎉 SMARTCASEBD Database Seed Complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
