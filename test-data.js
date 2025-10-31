// Synthetic test data based on real e-commerce websites
// This data simulates actual page content for demo purposes

const syntheticPageData = {
  apple: {
    title: "Apple - iPhone 15 Pro",
    url: "https://www.apple.com/iphone-15-pro/",
    summary: "Apple introduces iPhone 15 Pro with titanium design, A17 Pro chip, and Action button. Features advanced camera system with 5x optical zoom, USB-C connectivity, and all-day battery life.",
    keyPoints: [
      "Titanium design - lightest Pro models ever",
      "A17 Pro chip - breakthrough performance with hardware-accelerated ray tracing",
      "Advanced camera system with 5x Telephoto camera (iPhone 15 Pro Max)",
      "Action button - customizable shortcut to your favorite features",
      "USB-C connectivity with USB 3 speeds up to 10Gb/s",
      "All-day battery life with up to 29 hours video playback"
    ],
    links: [
      { text: "Buy iPhone 15 Pro", url: "https://www.apple.com/shop/buy-iphone/iphone-15-pro" },
      { text: "Compare all iPhone models", url: "https://www.apple.com/iphone/compare/" },
      { text: "iPhone accessories", url: "https://www.apple.com/shop/iphone/accessories" },
      { text: "Trade in your current device", url: "https://www.apple.com/shop/trade-in" },
      { text: "AppleCare+ for iPhone", url: "https://www.apple.com/support/products/iphone/" }
    ],
    category: "Technology",
    sentiment: "positive",
    priceRange: "$999 - $1,199"
  },

  aloYoga: {
    title: "Alo Yoga - Mindful Movement & Premium Activewear",
    url: "https://www.aloyoga.com/",
    summary: "Alo Yoga offers premium activewear designed for yoga, studio workouts, and everyday wear. Features sustainable fabrics, fashion-forward designs, and performance technology. Shop new arrivals including the Airlift collection and cozy loungewear.",
    keyPoints: [
      "Airlift fabric - weightless, buttery-soft performance material",
      "New Fall Collection - earthy tones and cozy layers",
      "Sustainable practices - eco-friendly materials and ethical manufacturing",
      "Yoga essentials - mats, blocks, and accessories",
      "Free shipping on orders over $150",
      "Extended sizes available - XS to XXL in most styles"
    ],
    links: [
      { text: "Shop New Arrivals", url: "https://www.aloyoga.com/collections/new-arrivals" },
      { text: "Bestselling Leggings", url: "https://www.aloyoga.com/collections/womens-leggings" },
      { text: "Yoga Mats & Accessories", url: "https://www.aloyoga.com/collections/yoga-accessories" },
      { text: "Men's Collection", url: "https://www.aloyoga.com/collections/mens" },
      { text: "Sale - Up to 50% Off", url: "https://www.aloyoga.com/collections/sale" }
    ],
    category: "Fashion & Wellness",
    sentiment: "positive",
    priceRange: "$68 - $128"
  },

  nike: {
    title: "Nike - Just Do It",
    url: "https://www.nike.com/",
    summary: "Nike's latest collection features the new Air Max Dn, running innovations, and Jordan Brand releases. Explore performance gear for every sport, sustainable Move to Zero initiative, and exclusive member benefits with Nike Membership.",
    keyPoints: [
      "New Air Max Dn - Dynamic Air unit provides incredible bounce",
      "Nike Run Division - weather-resistant gear for all conditions",
      "Jordan Holiday 2024 Collection - iconic styles reimagined",
      "Move to Zero - sustainable materials in 75% of footwear",
      "Nike Membership - free shipping, exclusive products, and birthday rewards",
      "Nike By You - customize your own sneakers"
    ],
    links: [
      { text: "Shop Air Max", url: "https://www.nike.com/w/air-max-shoes" },
      { text: "Jordan Collection", url: "https://www.nike.com/jordan" },
      { text: "Running Shoes", url: "https://www.nike.com/w/running-shoes" },
      { text: "Nike Membership", url: "https://www.nike.com/membership" },
      { text: "Sale & Offers", url: "https://www.nike.com/w/sale" }
    ],
    category: "Athletic Apparel",
    sentiment: "positive",
    priceRange: "$60 - $200"
  },

  patagonia: {
    title: "Patagonia - Outdoor Clothing & Gear",
    url: "https://www.patagonia.com/",
    summary: "Patagonia provides durable outdoor clothing and gear built for adventure while protecting the planet. Features Worn Wear program for used gear, 1% for the Planet donations, and Fair Trade Certified products. Shop winter essentials and fleece collections.",
    keyPoints: [
      "Better Sweater Fleece - classic warmth with recycled materials",
      "Nano Puff Jacket - lightweight insulation for any adventure",
      "Worn Wear - buy and sell used Patagonia gear",
      "1% for the Planet - supporting environmental organizations since 1985",
      "Fair Trade Certified - ethical manufacturing practices",
      "Lifetime guarantee - repair, reuse, recycle philosophy"
    ],
    links: [
      { text: "Shop Winter Collection", url: "https://www.patagonia.com/shop/winter" },
      { text: "Worn Wear Used Gear", url: "https://www.patagonia.com/worn-wear/" },
      { text: "Better Sweater Fleece", url: "https://www.patagonia.com/shop/better-sweater" },
      { text: "Activism & Environmental Grants", url: "https://www.patagonia.com/activism/" },
      { text: "Repair & Care", url: "https://www.patagonia.com/repairs/" }
    ],
    category: "Outdoor & Sustainability",
    sentiment: "positive",
    priceRange: "$89 - $599"
  },

  warbyParker: {
    title: "Warby Parker - Designer Eyewear at Revolutionary Prices",
    url: "https://www.warbyparker.com/",
    summary: "Warby Parker offers designer-quality prescription glasses and sunglasses starting at $95, including lenses. Features Home Try-On program, virtual try-on with AR, free shipping both ways, and Buy a Pair, Give a Pair program supporting vision care worldwide.",
    keyPoints: [
      "Prescription glasses starting at $95 including lenses",
      "Home Try-On - test 5 frames at home for free",
      "Virtual Try-On - see frames on your face using your camera",
      "Free shipping and returns - no questions asked",
      "Buy a Pair, Give a Pair - over 10 million pairs distributed",
      "Progressive lenses available starting at $295"
    ],
    links: [
      { text: "Shop Eyeglasses", url: "https://www.warbyparker.com/eyeglasses/women" },
      { text: "Shop Sunglasses", url: "https://www.warbyparker.com/sunglasses" },
      { text: "Home Try-On", url: "https://www.warbyparker.com/home-try-on" },
      { text: "Virtual Try-On", url: "https://www.warbyparker.com/app" },
      { text: "Find a Store", url: "https://www.warbyparker.com/retail" }
    ],
    category: "Eyewear & Accessories",
    sentiment: "positive",
    priceRange: "$95 - $295"
  },

  allbirds: {
    title: "Allbirds - Sustainable Shoes & Apparel",
    url: "https://www.allbirds.com/",
    summary: "Allbirds creates comfortable, sustainable footwear using natural materials like merino wool, eucalyptus tree fiber, and sugarcane. Carbon neutral with transparent carbon footprint labeling. Shop the iconic Wool Runners, Tree Runners, and new Trail Runner collection.",
    keyPoints: [
      "Made from natural materials - wool, eucalyptus, sugarcane",
      "Carbon neutral - every product labeled with carbon footprint",
      "Wool Runners - breathable, moisture-wicking, temperature-regulating",
      "Tree Runners - lightweight, cooling eucalyptus tree fiber",
      "Machine washable - easy care for everyday comfort",
      "Free returns within 30 days"
    ],
    links: [
      { text: "Shop Men's Shoes", url: "https://www.allbirds.com/collections/mens" },
      { text: "Shop Women's Shoes", url: "https://www.allbirds.com/collections/womens" },
      { text: "Trail Runner Collection", url: "https://www.allbirds.com/collections/trail-runner" },
      { text: "Sustainability Report", url: "https://www.allbirds.com/pages/sustainability" },
      { text: "Our Materials", url: "https://www.allbirds.com/pages/materials" }
    ],
    category: "Sustainable Fashion",
    sentiment: "positive",
    priceRange: "$98 - $135"
  }
};

// Export for use in demo pages
if (typeof module !== 'undefined' && module.exports) {
  module.exports = syntheticPageData;
}
