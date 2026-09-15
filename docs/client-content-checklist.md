# Ungalil Oruvan — Consolidated Client Content Confirmation Sheet

This document consolidates every piece of customer-facing business, legal, brand, and catalog content across the **Ungalil Oruvan** platform. Any item marked `[PENDING CLIENT CONFIRMATION]` must be confirmed or updated by the client before official production launch.

---

## 1. BRAND IDENTITY

| Parameter | Current System Value | Client Status | Client Approved / Updated Value |
|---|---|---|---|
| **Tamil Brand Name** | `உங்களில் ஒருவன்` | Confirmed | |
| **English Brand Name** | `Ungalil Oruvan` | Confirmed | |
| **English Tagline** | `One among you` | Confirmed | |
| **Homepage Hero Tamil Headline** | `நமது மண்ணிலிருந்து உங்கள் மேசைக்கு` | Confirmed | |
| **Homepage Hero English Line** | `From Our Soil to Your Table` | Confirmed | |
| **Homepage Hero Supporting Copy** | `Millets, cold-pressed oils, spices, and honey — packed with the patience of the land they grew on.` | Confirmed | |
| **Brand Color Accent** | `#B85C38` (Terracotta) | Confirmed | |

---

## 2. COMPANY & ORIGINS

| Field | Current System Copy | Client Status | Client Approved / Updated Value |
|---|---|---|---|
| **Official Legal Entity Name** | `Ungalil Oruvan Organics` | `[PENDING CLIENT CONFIRMATION]` | |
| **About Us Title (Tamil)** | `நம் பாரம்பர்யம்` | Confirmed | |
| **About Us Title (English)** | `Ungalil Oruvan Organic Farm` | Confirmed | |
| **About Us Narrative** | `Traditional roots, modern commerce. The storefront carries honest soil in its details — millet names, farm lots, terracotta accents — bringing authentic native harvests directly from small family farms to your kitchen table.` | Confirmed | |
| **Farm Sourcing Regions** | Madurai, Thanjavur, Erode, Western Ghats | Confirmed | |

---

## 3. CONTACT & CUSTOMER SUPPORT

| Channel | Current Value | Environment Override | Client Status | Client Approved Value |
|---|---|---|---|---|
| **Support Email** | `care@ungaliloruvan.com` | `CONTACT_EMAIL` | `[PENDING CLIENT CONFIRMATION]` | |
| **Support Phone** | `+91 94430 12345` | `CONTACT_PHONE` | `[PENDING CLIENT CONFIRMATION]` | |
| **Official WhatsApp** | `+91 94430 12345` | `WHATSAPP_NUMBER` | `[PENDING CLIENT CONFIRMATION]` | |
| **Working Hours** | `Mon – Sat: 9:00 AM – 6:00 PM IST` | `SUPPORT_HOURS` | `[PENDING CLIENT CONFIRMATION]` | |
| **Physical Address** | `Anna Nagar, Chennai, Tamil Nadu 600040` | `BUSINESS_ADDRESS` | `[PENDING CLIENT CONFIRMATION]` | |
| **Instagram** | `https://instagram.com/ungaliloruvan` | Configurable | `[PENDING CLIENT CONFIRMATION]` | |
| **Facebook** | `https://facebook.com/ungaliloruvan` | Configurable | `[PENDING CLIENT CONFIRMATION]` | |

---

## 4. PRODUCT CATALOGUE & LOT DATA

| ID | Tamil Name | English Name | Pack Sizes & Pricing | Shelf Life | Ingredients | Cert / License |
|---|---|---|---|---|---|---|
| `prod-honey` | **காட்டு தேன்** | Organic Raw Forest Honey | 250g (₹349), 500g (₹649), 1kg (₹1,199) | 18 months | Organic raw honey | India Organic (NPOP) |
| `prod-oil` | **நிலக்கடலை எண்ணெய்** | Cold Pressed Groundnut Oil | 500ml (₹289), 1L (₹529) | 9 months | Organic groundnuts | PGS-India Organic |
| `prod-sesame` | **நல்லெண்ணெய்** | Cold Pressed Sesame Oil | 250ml (₹249), 500ml (₹449) | 8 months | Organic sesame seeds | `[CLIENT INPUT REQUIRED]` |
| `prod-turmeric` | **மஞ்சள் தூள்** | Organic Turmeric Powder | 100g (₹129), 250g (₹249) | 12 months | Organic turmeric rhizome | India Organic (NPOP) |
| `prod-pepper` | **கருமிளகு** | Organic Black Pepper | 100g (₹189), 250g (₹429) | 24 months | Organic black peppercorns | `[CLIENT INPUT REQUIRED]` |
| `prod-foxtail` | **தினை** | Organic Foxtail Millet | 500g (₹149), 1kg (₹279) | 10 months | Organic foxtail millet | `[CLIENT INPUT REQUIRED]` |
| `prod-little` | **சாமை** | Organic Little Millet | 500g (₹159), 1kg (₹299) | 10 months | Organic little millet | `[CLIENT INPUT REQUIRED]` |
| `prod-cashew` | **முந்திரி** | Organic Cashews | 250g (₹429), 500g (₹799) | 8 months | Organic cashew kernels | `[CLIENT INPUT REQUIRED]` |
| `prod-almond` | **பாதாம்** | Organic Almonds | 250g (₹449), 500g (₹849) | 8 months | Organic raw almonds | `[CLIENT INPUT REQUIRED]` |
| `prod-tea` | **மூலிகை தேநீர்** | Organic Herbal Evening Tea | 50g (₹249), 100g (₹449) | 14 months | Tulsi, lemongrass, dried ginger, mint | `[CLIENT INPUT REQUIRED]` |
| `prod-jaggery` | **வெல்லம்** | Organic Jaggery Blocks | 500g (₹179), 1kg (₹329) | 12 months | Organic sugarcane juice | `[CLIENT INPUT REQUIRED]` |
| `prod-rice` | **பொன்னி அரிசி** | Organic Ponni Rice | 1kg (₹189), 5kg (₹849) | 12 months | Organic Ponni rice | India Organic (NPOP) |
| `prod-ragi` | **கேழ்வரகு** | Organic Finger Millet (Ragi) | 500g (₹99), 1kg (₹179) | 10 months | Organic finger millet | `[CLIENT INPUT REQUIRED]` |

---

## 5. BUSINESS, LEGAL & COMPLIANCE

| Policy / Record | Route | Current Status | Client Approval Required |
|---|---|---|---|
| **GSTIN** | Footer & Invoices | Null / Configurable (`BUSINESS_GSTIN`) | Provide active GSTIN |
| **FSSAI License** | Footer & Products | Null / Configurable (`BUSINESS_FSSAI`) | Provide active 14-digit FSSAI number |
| **Shipping Policy** | `/policies/shipping` | Free shipping above ₹999, ₹79 flat courier fee | Confirm rates & dispatch timelines (24-48h) |
| **Cancellation & Damage** | `/policies/cancellation` | Free cancellation before dispatch; 48h unboxing video for transit damage | Confirm unboxing video & replacement terms |
| **Refunds & Returns** | `/policies/refunds` | Perishable food items non-returnable; refunds for verified transit damage | Confirm banking refund turnaround (5-7 days) |
| **Terms of Service** | `/policies/terms` | Standard e-commerce terms governing retail purchases | Confirm terms of service |
| **Privacy Policy** | `/policies/privacy` | Standard Indian IT Act & DPDP compliance | Confirm privacy disclosures |

---

## 6. MARKETING & SOCIAL PROOF

| Item | Current Production State | Production Policy |
|---|---|---|
| **Customer Reviews** | Cleaned; zero fake reviews | Displays *"Be the first to review this product"* until genuine customer reviews are submitted. |
| **Testimonials** | None active | Must be genuine, client-approved customer quotes with verified purchase tags. |
| **Nutritional & Health Claims** | Standard FSSAI-compliant macro breakdowns | No unverified medical or disease-curing claims. |
