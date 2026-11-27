export const categories = [
  {
    id: "mens-fashion",
    name: "Men's Fashion",
    slug: "men",
    itemCount: "42+ Items",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    description: "Refined silhouettes, sharp tailoring, and essential modern staples."
  },
  {
    id: "womens-fashion",
    name: "Women's Fashion",
    slug: "women",
    itemCount: "58+ Items",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    description: "Contemporary chic elegance, effortless dresses, and everyday luxury."
  },
  {
    id: "t-shirts",
    name: "T-Shirts",
    slug: "t-shirts",
    itemCount: "35+ Items",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    description: "Heavyweight organic cotton, breathable relaxed fits, and minimalist graphics."
  },
  {
    id: "hoodies",
    name: "Hoodies",
    slug: "hoodies",
    itemCount: "24+ Items",
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    description: "Ultra-plush French terry fleece, dropped shoulders, and cozy warmth."
  }
];

export const products = [
  {
    id: 1,
    name: "Oversized Minimalist Boxy Tee",
    category: "t-shirts",
    gender: "men",
    price: 1299,
    originalPrice: 2199,
    rating: 4.8,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: true,
    description: "Crafted from dense 260 GSM combed organic cotton, this signature tee offers a clean boxy drape with dropped shoulders. Engineered for all-day comfort and timeless minimalism.",
    details: [
      "100% Combed Heavyweight Organic Cotton",
      "Pre-shrunk fabric to preserve fit",
      "Ribbed collar with reinforced neckline",
      "Machine wash cold, tumble dry low"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Luxe Heavyweight French Terry Hoodie",
    category: "hoodies",
    gender: "men",
    price: 2899,
    originalPrice: 4499,
    rating: 4.9,
    reviewsCount: 198,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: false,
    description: "Our premium pullover hoodie built from 450 GSM French terry fleece. Features a double-layered hood without drawstrings for a sleek architectural profile and kangaroo pocket.",
    details: [
      "450 GSM Ultra-dense French Terry",
      "Seamless double-layered structured hood",
      "Ribbed side gussets for enhanced mobility",
      "Custom metal branding badge at hem"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Tailored Linen Blend Double-Breasted Blazer",
    category: "women",
    gender: "women",
    price: 4999,
    originalPrice: 7999,
    rating: 4.9,
    reviewsCount: 86,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: true,
    description: "Sophisticated beige double-breasted silhouette made from breathable Italian linen blend. Features notched lapels, horn buttons, and subtle shoulder pads for sharp structure.",
    details: [
      "65% Flax Linen, 35% Viscose blend",
      "Full satin cupro lining for smooth layering",
      "Dual flap front pockets and welt chest pocket",
      "Professional dry clean only"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 4,
    name: "Classic Cashmere Ribbed Knit Cardigan",
    category: "women",
    gender: "women",
    price: 3499,
    originalPrice: 5299,
    rating: 4.7,
    reviewsCount: 114,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: false,
    description: "An everyday luxury layer spun from an exceptionally soft wool-cashmere blend. Detailed with genuine mother-of-pearl buttons and deep ribbing on cuffs and hemline.",
    details: [
      "70% Extra Fine Merino Wool, 30% Mongolian Cashmere",
      "Tortoiseshell resin button closure",
      "Relaxed dropped shoulder fit",
      "Hand wash cold, dry flat"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 5,
    name: "Architectural Trench Coat in Sand Beige",
    category: "women",
    gender: "women",
    price: 5999,
    originalPrice: 9499,
    rating: 4.9,
    reviewsCount: 92,
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: true,
    description: "The modern trench coat reimagined in durable water-resistant cotton twill. Detailed with storm flaps, belted waist, adjustable cuff buckles, and horn closures.",
    details: [
      "100% Water-repellent Cotton Twill",
      "Removable buckle tie belt",
      "Double breasted with deep welt pockets",
      "Ventilated back storm flap"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 6,
    name: "Pleated Relaxed Wide-Leg Trousers",
    category: "men",
    gender: "men",
    price: 2499,
    originalPrice: 3999,
    rating: 4.6,
    reviewsCount: 75,
    image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: false,
    description: "Effortlessly suave trousers cut with a roomy wide-leg drape and double front pleats. Designed with side adjuster tabs and internal hook-and-bar fastening.",
    details: [
      "78% Polyester, 18% Rayon, 4% Spandex drape fabric",
      "Crease-resistant finish",
      "Concealed button and hook closure",
      "Front pleats and back besom pockets"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 7,
    name: "Vintage Washed Acid Wash Graphic Tee",
    category: "t-shirts",
    gender: "men",
    price: 1199,
    originalPrice: 1899,
    rating: 4.8,
    reviewsCount: 164,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: false,
    description: "Sun-faded mineral wash t-shirt featuring subtle typographic heritage insignia on the back and chest. Soft vintage hand-feel created through an artisan stone-washing process.",
    details: [
      "100% Ring-spun Vintage Cotton",
      "Pigment dyed for unique lived-in color",
      "Blind-stitched sleeves and hem",
      "Anti-pilling treatment"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 8,
    name: "Minimalist Zip-Up Fleece Hoodie",
    category: "hoodies",
    gender: "women",
    price: 2699,
    originalPrice: 4199,
    rating: 4.8,
    reviewsCount: 133,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: true,
    isNew: true,
    description: "Clean aesthetic cropped zip-up hoodie featuring a dual YKK matte silver zipper, brushed fleece interior, and relaxed balloon sleeves for effortless street-luxe layering.",
    details: [
      "80% Organic Cotton, 20% Brushed Poly Fleece",
      "Two-way premium metallic zipper",
      "Ribbed knit cuffs and extended waist hem",
      "Side hidden seam pockets"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 9,
    name: "Crisp Poplin Button-Down Oxford Shirt",
    category: "men",
    gender: "men",
    price: 1899,
    originalPrice: 2999,
    rating: 4.7,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isNew: false,
    description: "The quintessential formal-to-casual button-down. Woven from Egyptian long-staple cotton with a crisp yet breathable feel and neat button-down point collar.",
    details: [
      "100% Giza Cotton Poplin",
      "Reinforced gussets and mother-of-pearl buttons",
      "Box pleat back yoke for unrestricted movement",
      "Easy-iron finish"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 10,
    name: "Satin Bias-Cut Slip Midi Dress",
    category: "women",
    gender: "women",
    price: 3199,
    originalPrice: 4999,
    rating: 4.9,
    reviewsCount: 154,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isNew: true,
    description: "An effortlessly sensual silhouette cut on the bias to skim the curves naturally. Features delicate adjustable spaghetti straps and a subtle cowl neckline.",
    details: [
      "Premium silky heavyweight satin with liquid shine",
      "Bias cut for flattering natural drape",
      "Hidden side zipper closure",
      "Hand wash delicate or dry clean"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 11,
    name: "Heavyweight Boxy Striped Nautical Tee",
    category: "t-shirts",
    gender: "men",
    price: 1399,
    originalPrice: 2199,
    rating: 4.6,
    reviewsCount: 67,
    image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isNew: false,
    description: "Inspired by French maritime workwear, this heavyweight Breton striped tee combines classic horizontal stripes with an updated loose streetwear fit.",
    details: [
      "100% Yarn-dyed organic jersey cotton",
      "Structured boat-crew neck fusion",
      "Side slit vents at hem",
      "Colorfast yarn processing"
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 12,
    name: "Cozy Sherpa-Lined Oversized Winter Hoodie",
    category: "hoodies",
    gender: "women",
    price: 3299,
    originalPrice: 4899,
    rating: 4.9,
    reviewsCount: 178,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop"
    ],
    isFeatured: false,
    isNew: true,
    description: "Insulated with cloud-soft thermal sherpa fleece lining inside, this oversized hoodie is designed to keep you snug and stylish through chilly evenings and outdoor strolls.",
    details: [
      "Plush sherpa fleece interior lining",
      "Thick rib-knit cuffs and waist",
      "Reinforced heavy-duty stitching",
      "Deep side warming pockets"
    ],
    sizes: ["S", "M", "L", "XL"]
  }
];
