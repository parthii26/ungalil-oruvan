import { hashPassword } from "@/lib/auth/password";
import { nowIso, uid } from "@/lib/utils";
import { DEFAULT_SITE_SETTINGS } from "@/lib/brand/defaults";
import type { Database } from "./types";

const T = nowIso();

export const DEV_ACCOUNTS = {
  admin: { email: "admin@varizel.dev", password: "Admin123!Dev", name: "Store Owner" },
  customerA: { email: "ananya@varizel.dev", password: "Customer123!", name: "Ananya Rao" },
  customerB: { email: "kabir@varizel.dev", password: "Customer123!", name: "Kabir Mehta" },
} as const;

export function createSeed(): Database {
  const adminProfileId = "11111111-1111-4111-8111-111111111111";
  const custAProfileId = "22222222-2222-4222-8222-222222222222";
  const custBProfileId = "33333333-3333-4333-8333-333333333333";
  const custAId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
  const custBId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

  const cats = [
    { id: "cat-honey", name: "Organic Honey", slug: "organic-honey", description: "Unheated, unfiltered honey from small apiaries.", image_path: "/images/honey.jpg", position: 1 },
    { id: "cat-oils", name: "Cold Pressed Oils", slug: "cold-pressed-oils", description: "Slow-pressed oils that keep their character.", image_path: "/images/oil.jpg", position: 2 },
    { id: "cat-millets", name: "Millets", slug: "millets", description: "Climate-wise grains for everyday cooking.", image_path: "/images/millet-foxtail.jpg", position: 3 },
    { id: "cat-grains", name: "Organic Grains", slug: "organic-grains", description: "Whole grains grown without synthetic inputs.", image_path: "/images/millet-little.jpg", position: 4 },
    { id: "cat-spices", name: "Spices", slug: "spices", description: "Single-origin spices, stone-ground when needed.", image_path: "/images/turmeric.jpg", position: 5 },
    { id: "cat-dry", name: "Dry Fruits", slug: "dry-fruits", description: "Naturally dried nuts and fruits.", image_path: "/images/almonds.jpg", position: 6 },
    { id: "cat-snacks", name: "Healthy Snacks", slug: "healthy-snacks", description: "Simple snacks with short ingredient lists.", image_path: "/images/cashews.jpg", position: 7 },
    { id: "cat-herbal", name: "Herbal Products", slug: "herbal-products", description: "Teas and botanicals for daily rituals.", image_path: "/images/tea.jpg", position: 8 },
  ];

  const tags = [
    { id: "tag-vegan", name: "Vegan", slug: "vegan" },
    { id: "tag-gf", name: "Gluten Free", slug: "gluten-free" },
    { id: "tag-raw", name: "Raw", slug: "raw" },
    { id: "tag-nf", name: "No Added Sugar", slug: "no-added-sugar" },
    { id: "tag-ayur", name: "Ayurvedic", slug: "ayurvedic" },
    { id: "tag-organic", name: "Organic", slug: "organic" },
    { id: "tag-cold", name: "Cold Pressed", slug: "cold-pressed" },
    { id: "tag-trad", name: "Traditional", slug: "traditional" },
    { id: "tag-farmer", name: "Farmer Sourced", slug: "farmer-sourced" },
    { id: "tag-nopres", name: "No Added Preservatives", slug: "no-added-preservatives" },
  ];

  type PSeed = {
    id: string;
    category_id: string;
    name: string;
    slug: string;
    short: string;
    description: string;
    ingredients: string;
    origin: string;
    storage: string;
    shelf: string;
    featured?: boolean;
    bestseller?: boolean;
    image: string;
    tamil?: string;
    tags: string[];
    variants: { title: string; sku: string; grams: number; price: number; compare?: number }[];
    nutrition: { serving: string; energy: number; protein: number; carbs: number; fat: number; fiber: number; sugar: number };
    cert?: { name: string; number: string };
  };

  const productSeeds: PSeed[] = [
    {
      id: "prod-honey",
      category_id: "cat-honey",
      name: "Organic Raw Forest Honey",
      tamil: "காட்டு தேன்",
      slug: "organic-raw-forest-honey",
      short: "Unheated multifloral honey with a deep, resinous finish.",
      description:
        "Collected from mixed forest forage and packed without heating. The texture is naturally thick; crystals may form over time — a sign it has not been ultra-filtered. Stir gently and use as you would any raw honey.",
      ingredients: "Organic raw honey.",
      origin: "Western Ghats apiaries, Karnataka",
      storage: "Store at room temperature, away from direct sun. Do not refrigerate.",
      shelf: "18 months",
      featured: true,
      bestseller: true,
      image: "/images/honey.jpg",
      tags: ["tag-gf", "tag-raw", "tag-nf", "tag-organic", "tag-farmer"],
      variants: [
        { title: "250 g", sku: "VZ-HON-250", grams: 250, price: 34900, compare: 39900 },
        { title: "500 g", sku: "VZ-HON-500", grams: 500, price: 64900, compare: 74900 },
        { title: "1 kg", sku: "VZ-HON-1000", grams: 1000, price: 119900, compare: 139900 },
      ],
      nutrition: { serving: "20 g", energy: 64, protein: 0.1, carbs: 17.5, fat: 0, fiber: 0, sugar: 16.2 },
      cert: { name: "India Organic (NPOP)", number: "ORG-HON-2025-014" },
    },
    {
      id: "prod-oil",
      category_id: "cat-oils",
      name: "Cold Pressed Groundnut Oil",
      tamil: "நிலக்கடலை எண்ணெய்",
      slug: "cold-pressed-groundnut-oil",
      short: "Wooden-ghani pressed peanuts. Clean nut aroma, high smoke point.",
      description:
        "Single-ingredient oil pressed in small batches. No hexane, no blending with refined oils. Suitable for everyday tempering and shallow frying.",
      ingredients: "Organic groundnuts (peanuts).",
      origin: "Saurashtra, Gujarat",
      storage: "Keep sealed, away from heat. Use within 90 days of opening.",
      shelf: "9 months",
      featured: true,
      bestseller: true,
      image: "/images/oil.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-nf", "tag-organic", "tag-cold", "tag-nopres"],
      variants: [
        { title: "500 ml", sku: "VZ-OIL-500", grams: 460, price: 28900, compare: 32900 },
        { title: "1 L", sku: "VZ-OIL-1000", grams: 920, price: 52900, compare: 59900 },
      ],
      nutrition: { serving: "10 ml", energy: 88, protein: 0, carbs: 0, fat: 10, fiber: 0, sugar: 0 },
      cert: { name: "PGS-India Organic", number: "PGS-OIL-8821" },
    },
    {
      id: "prod-turmeric",
      category_id: "cat-spices",
      name: "Organic Turmeric Powder",
      tamil: "மஞ்சள் தூள்",
      slug: "organic-turmeric-powder",
      short: "High-curcumin Lakadong-style grind. Warm, earthy, slightly bitter.",
      description:
        "Rhizomes are solar-dried and stone-ground. Colour is naturally deep; no added colour. Use in dals, milk, and marinades.",
      ingredients: "Organic turmeric rhizome.",
      origin: "Meghalaya hills",
      storage: "Airtight, away from moisture and light.",
      shelf: "12 months",
      featured: true,
      image: "/images/turmeric.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-ayur", "tag-organic", "tag-trad"],
      variants: [
        { title: "100 g", sku: "VZ-TUR-100", grams: 100, price: 12900 },
        { title: "250 g", sku: "VZ-TUR-250", grams: 250, price: 24900, compare: 27900 },
      ],
      nutrition: { serving: "5 g", energy: 18, protein: 0.4, carbs: 3.4, fat: 0.2, fiber: 1.1, sugar: 0.2 },
      cert: { name: "India Organic (NPOP)", number: "ORG-TUR-2025-003" },
    },
    {
      id: "prod-pepper",
      category_id: "cat-spices",
      name: "Organic Black Pepper",
      tamil: "கருமிளகு",
      slug: "organic-black-pepper",
      short: "Tellicherry-grade peppercorns with a slow, citrus heat.",
      description:
        "Sun-dried on the vine-side estates. Sold whole so you can crack fresh. The aroma is pine and orange peel rather than dusty heat.",
      ingredients: "Organic black peppercorns.",
      origin: "Wayanad, Kerala",
      storage: "Airtight glass, away from steam.",
      shelf: "24 months",
      bestseller: true,
      image: "/images/pepper.jpg",
      tags: ["tag-vegan", "tag-gf"],
      variants: [
        { title: "100 g", sku: "VZ-PEP-100", grams: 100, price: 18900 },
        { title: "250 g", sku: "VZ-PEP-250", grams: 250, price: 42900 },
      ],
      nutrition: { serving: "2 g", energy: 5, protein: 0.2, carbs: 1.3, fat: 0.1, fiber: 0.5, sugar: 0 },
    },
    {
      id: "prod-foxtail",
      category_id: "cat-millets",
      name: "Organic Foxtail Millet",
      tamil: "தினை",
      slug: "organic-foxtail-millet",
      short: "Light, quick-cooking millet for pongal, upma, and bowls.",
      description:
        "Dehulled foxtail millet with a mild, nutty flavour. Rinse twice. Cooks in about 12 minutes. A everyday grain, not a novelty.",
      ingredients: "Organic foxtail millet (Setaria italica).",
      origin: "Anantapur, Andhra Pradesh",
      storage: "Cool, dry cupboard. Refrigerate in humid months.",
      shelf: "10 months",
      featured: true,
      image: "/images/millet-foxtail.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-organic", "tag-trad", "tag-farmer"],
      variants: [
        { title: "500 g", sku: "VZ-FOX-500", grams: 500, price: 14900 },
        { title: "1 kg", sku: "VZ-FOX-1000", grams: 1000, price: 27900 },
      ],
      nutrition: { serving: "50 g uncooked", energy: 166, protein: 6.1, carbs: 30.5, fat: 2.1, fiber: 4, sugar: 0.3 },
    },
    {
      id: "prod-little",
      category_id: "cat-millets",
      name: "Organic Little Millet",
      tamil: "சாமை",
      slug: "organic-little-millet",
      short: "Soft-cooking millet that stands in for rice.",
      description:
        "Smaller grain, gentler bite. Works in lemon rice, khichdi, and porridge. Grown in rain-fed plots without synthetic pesticides.",
      ingredients: "Organic little millet (Panicum sumatrense).",
      origin: "Dharmapuri, Tamil Nadu",
      storage: "Airtight tin, away from moisture.",
      shelf: "10 months",
      image: "/images/millet-little.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-organic", "tag-trad", "tag-farmer"],
      variants: [
        { title: "500 g", sku: "VZ-LIT-500", grams: 500, price: 15900 },
        { title: "1 kg", sku: "VZ-LIT-1000", grams: 1000, price: 29900 },
      ],
      nutrition: { serving: "50 g uncooked", energy: 164, protein: 4.8, carbs: 33, fat: 1.5, fiber: 3.8, sugar: 0.2 },
    },
    {
      id: "prod-cashew",
      category_id: "cat-dry",
      name: "Organic Cashews",
      tamil: "முந்திரி",
      slug: "organic-cashews",
      short: "W240 whole kernels. Creamy, lightly sweet, never oiled.",
      description:
        "Steam-opened kernels, graded by hand. No added oil or salt. Use as they are, or soak for milks and gravies.",
      ingredients: "Organic cashew kernels.",
      origin: "Coastal Karnataka",
      storage: "Refrigerate after opening. Use within 60 days.",
      shelf: "8 months",
      featured: true,
      bestseller: true,
      image: "/images/cashews.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-nf"],
      variants: [
        { title: "250 g", sku: "VZ-CAS-250", grams: 250, price: 42900, compare: 47900 },
        { title: "500 g", sku: "VZ-CAS-500", grams: 500, price: 79900, compare: 89900 },
      ],
      nutrition: { serving: "30 g", energy: 166, protein: 5.5, carbs: 9, fat: 13.2, fiber: 1, sugar: 1.8 },
    },
    {
      id: "prod-almond",
      category_id: "cat-dry",
      name: "Organic Almonds",
      tamil: "பாதாம்",
      slug: "organic-almonds",
      short: "California-style long almonds, raw and unblanched.",
      description:
        "Whole natural almonds with skin on. Crunchy, clean finish. No roasting oil. A daily handful, or soak overnight.",
      ingredients: "Organic raw almonds.",
      origin: "Kashmir orchards",
      storage: "Cool and dry. Refrigerate in summer.",
      shelf: "8 months",
      image: "/images/almonds.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-nf"],
      variants: [
        { title: "250 g", sku: "VZ-ALM-250", grams: 250, price: 44900 },
        { title: "500 g", sku: "VZ-ALM-500", grams: 500, price: 84900, compare: 94900 },
      ],
      nutrition: { serving: "30 g", energy: 174, protein: 6.3, carbs: 6.5, fat: 15, fiber: 3.7, sugar: 1.2 },
    },
    {
      id: "prod-tea",
      category_id: "cat-herbal",
      name: "Organic Herbal Evening Tea",
      tamil: "மூலிகை தேநீர்",
      slug: "organic-herbal-evening-tea",
      short: "Tulsi, lemongrass, and ginger. Caffeine-free.",
      description:
        "A quiet evening blend. Leaves are shade-dried and cut, not powdered into dust. Steep 4 minutes covered.",
      ingredients: "Organic tulsi, lemongrass, dried ginger, mint.",
      origin: "Nilgiris, Tamil Nadu",
      storage: "Airtight, away from spices.",
      shelf: "14 months",
      featured: true,
      image: "/images/tea.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-ayur"],
      variants: [
        { title: "50 g", sku: "VZ-TEA-050", grams: 50, price: 24900 },
        { title: "100 g", sku: "VZ-TEA-100", grams: 100, price: 44900 },
      ],
      nutrition: { serving: "2 g (brewed)", energy: 2, protein: 0, carbs: 0.4, fat: 0, fiber: 0, sugar: 0 },
    },
    {
      id: "prod-jaggery",
      category_id: "cat-snacks",
      name: "Organic Jaggery Blocks",
      tamil: "வெல்லம்",
      slug: "organic-jaggery-blocks",
      short: "Set cane jaggery with mineral depth. No sulphur.",
      description:
        "Clarified over a wood fire and poured into blocks. Colour varies by harvest — that is expected. Grate into dals, or eat a sliver after meals.",
      ingredients: "Organic sugarcane juice.",
      origin: "Kolhapur, Maharashtra",
      storage: "Wrap tightly. Softens in humidity — refrigerate if needed.",
      shelf: "12 months",
      bestseller: true,
      image: "/images/honey.jpg",
      tags: ["tag-vegan", "tag-gf"],
      variants: [
        { title: "500 g", sku: "VZ-JAG-500", grams: 500, price: 17900 },
        { title: "1 kg", sku: "VZ-JAG-1000", grams: 1000, price: 32900, compare: 36900 },
      ],
      nutrition: { serving: "20 g", energy: 76, protein: 0.1, carbs: 19.5, fat: 0, fiber: 0, sugar: 17 },
    },
    {
      id: "prod-rice",
      category_id: "cat-grains",
      name: "Organic Ponni Rice",
      tamil: "பொன்னி அரிசி",
      slug: "organic-ponni-rice",
      short: "Single-estate Ponni from the Cauvery delta. Soft, everyday rice.",
      description:
        "Boiled and raw lots from named Thanjavur plots. No blending with broken grain from elsewhere. Rinse twice; cook at 1:2. The grain stays separate, with a mild, clean aroma.",
      ingredients: "Organic Ponni rice (Oryza sativa).",
      origin: "Cauvery delta, Thanjavur, Tamil Nadu",
      storage: "Airtight tin, away from moisture. Check in monsoon.",
      shelf: "12 months",
      featured: true,
      bestseller: true,
      image: "/images/harvest-grain.jpg",
      tags: ["tag-vegan", "tag-gf", "tag-organic", "tag-trad", "tag-farmer"],
      variants: [
        { title: "1 kg", sku: "VZ-RIC-1000", grams: 1000, price: 18900 },
        { title: "5 kg", sku: "VZ-RIC-5000", grams: 5000, price: 84900, compare: 94900 },
      ],
      nutrition: { serving: "50 g uncooked", energy: 178, protein: 3.4, carbs: 39, fat: 0.3, fiber: 0.6, sugar: 0.1 },
      cert: { name: "India Organic (NPOP)", number: "ORG-RIC-2025-021" },
    },
    {
      id: "prod-ragi",
      category_id: "cat-grains",
      name: "Organic Finger Millet (Ragi)",
      tamil: "கேழ்வரகு",
      slug: "organic-finger-millet-ragi",
      short: "Whole ragi for porridge, roti, and malt.",
      description:
        "Unpolished finger millet with bran intact. Earthy flavour, good for everyday breakfast porridge. Wash and soak if grinding at home.",
      ingredients: "Organic finger millet (Eleusine coracana).",
      origin: "Hassan, Karnataka",
      storage: "Airtight jar. Check for moisture in monsoon.",
      shelf: "10 months",
      image: "/images/millet-little.jpg",
      tags: ["tag-vegan", "tag-gf"],
      variants: [
        { title: "500 g", sku: "VZ-RAG-500", grams: 500, price: 9900 },
        { title: "1 kg", sku: "VZ-RAG-1000", grams: 1000, price: 17900 },
      ],
      nutrition: { serving: "50 g uncooked", energy: 164, protein: 3.6, carbs: 36, fat: 0.7, fiber: 5.6, sugar: 0.3 },
    },
    {
      id: "prod-sesame",
      category_id: "cat-oils",
      name: "Cold Pressed Sesame Oil",
      slug: "cold-pressed-sesame-oil",
      short: "Gingelly oil with toasted depth. For tadka and pickles.",
      description:
        "Pressed from unroasted white sesame. The flavour is round rather than bitter. A finishing oil as much as a cooking oil.",
      ingredients: "Organic sesame seeds.",
      origin: "Salem, Tamil Nadu",
      storage: "Dark bottle, cool shelf. Sediment is natural.",
      shelf: "8 months",
      image: "/images/oil.jpg",
      tags: ["tag-vegan", "tag-gf"],
      variants: [
        { title: "250 ml", sku: "VZ-SES-250", grams: 230, price: 24900 },
        { title: "500 ml", sku: "VZ-SES-500", grams: 460, price: 44900 },
      ],
      nutrition: { serving: "10 ml", energy: 88, protein: 0, carbs: 0, fat: 10, fiber: 0, sugar: 0 },
    },
  ];

  const products: Database["products"] = [];
  const variants: Database["product_variants"] = [];
  const images: Database["product_images"] = [];
  const nutrition: Database["product_nutrition"] = [];
  const certs: Database["product_certifications"] = [];
  const pdt: Database["product_dietary_tags"] = [];

  for (const p of productSeeds) {
    const search = [p.name, p.short, p.ingredients, p.origin].join(" ").toLowerCase();
    products.push({
      id: p.id,
      category_id: p.category_id,
      name: p.name,
      slug: p.slug,
      short_description: p.short,
      description: p.description,
      ingredients: p.ingredients,
      origin: p.origin,
      storage_instructions: p.storage,
      shelf_life: p.shelf,
      status: "published",
      is_featured: Boolean(p.featured),
      is_bestseller: Boolean(p.bestseller),
      hsn: "0409",
      tax_rate_bps: 500,
      fssai_license: "10021000000000",
      seo_title: p.name,
      seo_description: p.short,
      tamil_name: p.tamil ?? null,
      search_text: search,
      created_at: T,
      updated_at: T,
    });
    p.variants.forEach((v, i) => {
      variants.push({
        id: `${p.id}-v${i + 1}`,
        product_id: p.id,
        sku: v.sku,
        barcode: null,
        title: v.title,
        weight_grams: v.grams,
        price_paise: v.price,
        compare_at_paise: v.compare ?? null,
        cost_paise: Math.trunc(v.price * 0.55),
        status: "active",
        position: i,
        created_at: T,
        updated_at: T,
      });
    });
    images.push({
      id: `${p.id}-img1`,
      product_id: p.id,
      path: p.image,
      alt: p.name,
      position: 0,
      is_thumbnail: true,
      created_at: T,
    });
    nutrition.push({
      id: `${p.id}-nut`,
      product_id: p.id,
      serving: p.nutrition.serving,
      energy_kcal: p.nutrition.energy,
      protein_g: p.nutrition.protein,
      carbohydrates_g: p.nutrition.carbs,
      fat_g: p.nutrition.fat,
      fiber_g: p.nutrition.fiber,
      sugar_g: p.nutrition.sugar,
      extra: {},
    });
    if (p.cert) {
      certs.push({
        id: `${p.id}-cert`,
        product_id: p.id,
        name: p.cert.name,
        number: p.cert.number,
        valid_from: "2025-04-01",
        valid_until: "2026-03-31",
        document_path: null,
        created_at: T,
      });
    }
    for (const tag of p.tags) pdt.push({ product_id: p.id, tag_id: tag });
  }

  const addrA = {
    id: "addr-a1",
    customer_id: custAId,
    name: "Ananya Rao",
    phone: "9876500001",
    line1: "12, 3rd Cross, Indiranagar",
    line2: "Near 100 Feet Road",
    landmark: "Metro station",
    city: "Bengaluru",
    state: "Karnataka",
    postal_code: "560038",
    country: "IN",
    is_default: true,
    created_at: T,
    updated_at: T,
  };

  const addrB = {
    id: "addr-b1",
    customer_id: custBId,
    name: "Kabir Mehta",
    phone: "9876500002",
    line1: "44 Pali Hill",
    line2: null,
    landmark: null,
    city: "Mumbai",
    state: "Maharashtra",
    postal_code: "400050",
    country: "IN",
    is_default: true,
    created_at: T,
    updated_at: T,
  };

  const cartA = { id: "cart-a", customer_id: custAId, session_id: null, created_at: T, updated_at: T };
  const wishA = { id: "wish-a", customer_id: custAId, created_at: T };
  const wishB = { id: "wish-b", customer_id: custBId, created_at: T };

  const orderId = "order-demo-1";
  const order = {
    id: orderId,
    order_number: "VZ-2026-000001",
    customer_id: custAId,
    email: DEV_ACCOUNTS.customerA.email,
    status: "pending_payment" as const,
    coupon_code: null,
    subtotal_paise: 34900,
    discount_paise: 0,
    tax_paise: 0,
    shipping_paise: 0,
    grand_total_paise: 34900,
    shipping_address: {
      name: addrA.name,
      phone: addrA.phone,
      line1: addrA.line1,
      line2: addrA.line2,
      landmark: addrA.landmark,
      city: addrA.city,
      state: addrA.state,
      postal_code: addrA.postal_code,
      country: addrA.country,
    },
    billing_address: {
      name: addrA.name,
      phone: addrA.phone,
      line1: addrA.line1,
      line2: addrA.line2,
      landmark: addrA.landmark,
      city: addrA.city,
      state: addrA.state,
      postal_code: addrA.postal_code,
      country: addrA.country,
    },
    notes: "Development seed — pending payment. Not a paid order.",
    idempotency_key: "seed-order-1",
    created_at: T,
    updated_at: T,
  };

  return {
    profiles: [
      {
        id: adminProfileId,
        email: DEV_ACCOUNTS.admin.email,
        full_name: DEV_ACCOUNTS.admin.name,
        phone: "9800000000",
        role: "admin",
        password_hash: hashPassword(DEV_ACCOUNTS.admin.password),
        created_at: T,
        updated_at: T,
      },
      {
        id: custAProfileId,
        email: DEV_ACCOUNTS.customerA.email,
        full_name: DEV_ACCOUNTS.customerA.name,
        phone: "9876500001",
        role: "customer",
        password_hash: hashPassword(DEV_ACCOUNTS.customerA.password),
        created_at: T,
        updated_at: T,
      },
      {
        id: custBProfileId,
        email: DEV_ACCOUNTS.customerB.email,
        full_name: DEV_ACCOUNTS.customerB.name,
        phone: "9876500002",
        role: "customer",
        password_hash: hashPassword(DEV_ACCOUNTS.customerB.password),
        created_at: T,
        updated_at: T,
      },
    ],
    customers: [
      { id: custAId, profile_id: custAProfileId, notes: "Development customer A", created_at: T },
      { id: custBId, profile_id: custBProfileId, notes: "Development customer B", created_at: T },
    ],
    admin_users: [{ id: uid(), profile_id: adminProfileId, created_at: T }],
    addresses: [addrA, addrB],
    categories: cats.map((c) => ({
      ...c,
      parent_id: null,
      is_active: true,
      created_at: T,
      updated_at: T,
    })),
    products,
    product_variants: variants,
    product_images: images,
    product_certifications: certs,
    product_nutrition: nutrition,
    dietary_tags: tags,
    product_dietary_tags: pdt,
    carts: [cartA],
    cart_items: [
      {
        id: "ci-a1",
        cart_id: "cart-a",
        variant_id: "prod-honey-v1",
        quantity: 1,
        created_at: T,
        updated_at: T,
      },
    ],
    wishlists: [wishA, wishB],
    wishlist_items: [
      { id: "wi-a1", wishlist_id: "wish-a", variant_id: "prod-oil-v1", created_at: T },
    ],
    coupons: [
      {
        id: "coupon-welcome",
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        min_subtotal_paise: 50000,
        max_discount_paise: 20000,
        starts_at: "2026-01-01T00:00:00.000Z",
        ends_at: "2026-12-31T23:59:59.000Z",
        usage_limit: 1000,
        per_customer_limit: 1,
        product_ids: [],
        category_ids: [],
        is_active: true,
        created_at: T,
      },
      {
        id: "coupon-flat",
        code: "FLAT100",
        type: "fixed",
        value: 10000,
        min_subtotal_paise: 79900,
        max_discount_paise: 10000,
        starts_at: "2026-01-01T00:00:00.000Z",
        ends_at: "2026-12-31T23:59:59.000Z",
        usage_limit: 200,
        per_customer_limit: 2,
        product_ids: [],
        category_ids: [],
        is_active: true,
        created_at: T,
      },
      {
        id: "coupon-expired",
        code: "OLD50",
        type: "percentage",
        value: 50,
        min_subtotal_paise: 0,
        max_discount_paise: null,
        starts_at: "2024-01-01T00:00:00.000Z",
        ends_at: "2024-12-31T23:59:59.000Z",
        usage_limit: 10,
        per_customer_limit: 1,
        product_ids: [],
        category_ids: [],
        is_active: true,
        created_at: T,
      },
    ],
    coupon_redemptions: [],
    orders: [order],
    order_items: [
      {
        id: "oi-1",
        order_id: orderId,
        variant_id: "prod-honey-v1",
        product_name: "Organic Raw Forest Honey",
        variant_title: "250 g",
        sku: "VZ-HON-250",
        quantity: 1,
        unit_price_paise: 34900,
        discount_paise: 0,
        tax_paise: 0,
        line_total_paise: 34900,
      },
    ],
    order_events: [
      {
        id: "oe-1",
        order_id: orderId,
        type: "created",
        message: "Order created. Payment pending.",
        created_at: T,
      },
    ],
    order_sequence: 1,
    site_settings: { ...DEFAULT_SITE_SETTINGS },
    blog_posts: [
      {
        id: "blog-1",
        slug: "how-to-read-an-organic-label",
        title: "How to read an organic label",
        excerpt: "NPOP, PGS, FSSAI — what actually appears on a honest pack.",
        body: "A certification mark is a process claim, not a flavour guarantee. Look for the licence number, the crop year if offered, and whether the product is single-ingredient. This article is educational seed content for Stage 1.",
        cover_path: "/images/turmeric.jpg",
        published: true,
        created_at: T,
      },
      {
        id: "blog-2",
        slug: "cooking-millets-without-fuss",
        title: "Cooking millets without fuss",
        excerpt: "Ratios, rinsing, and why they sometimes stay firm.",
        body: "Most dehulled millets cook at 1:2 grain to water. Rinse until the water runs clearer. Rest five minutes off the heat. Seed article — replace in Stage 2 with editorial calendar.",
        cover_path: "/images/millet-foxtail.jpg",
        published: true,
        created_at: T,
      },
      {
        id: "blog-3",
        slug: "why-honey-crystallises",
        title: "Why honey crystallises",
        excerpt: "Glucose, temperature, and why we do not reheat it.",
        body: "Raw honey often sets. Warm the jar in a water bath below 40°C if you prefer it pourable. Seed content.",
        cover_path: "/images/honey.jpg",
        published: true,
        created_at: T,
      },
    ],
    faqs: [
      { id: "faq-1", question: "Do you ship across India?", answer: "Shipping providers are connected in Stage 2. Stage 1 checkout creates a pending-payment order only.", position: 1, published: true },
      { id: "faq-2", question: "Is payment live?", answer: "No. Razorpay is intentionally deferred. Checkout ends at PENDING_PAYMENT.", position: 2, published: true },
      { id: "faq-3", question: "Are prices inclusive of tax?", answer: "Listed prices are what you pay at Stage 1. Tax breakdown is a placeholder until GST settings are configured.", position: 3, published: true },
      { id: "faq-4", question: "Can I return opened food?", answer: "Return policy will be published with the legal pages once the client confirms terms.", position: 4, published: true },
    ],
    pages: [
      { id: "pg-privacy", slug: "privacy", title: "Privacy policy", body: "Development placeholder. Customer data is isolated by account. Do not treat this as a legal policy.", published: true },
      { id: "pg-terms", slug: "terms", title: "Terms of use", body: "Development placeholder terms for the Ungalil Oruvan Stage 1 storefront.", published: true },
      { id: "pg-shipping", slug: "shipping", title: "Shipping", body: "Live shipping is a Stage 2 integration. Orders remain pending payment in Stage 1.", published: true },
      { id: "pg-refunds", slug: "refunds", title: "Refunds", body: "Refunds are not processed in Stage 1 because payments are not captured.", published: true },
    ],
    reviews: [
      {
        id: "rev-1",
        product_id: "prod-honey",
        customer_id: custAId,
        rating: 5,
        title: "Thick, not syrupy",
        body: "Development review — tastes like forest, not candy. Seeded for layout only.",
        published: true,
        created_at: T,
      },
    ],
    webhook_events: [],
    outbox_events: [],
  };
}
