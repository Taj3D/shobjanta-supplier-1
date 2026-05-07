export const WHATSAPP_NUMBER = "8801711731354";
export const BASE_WA_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const FB_PIXEL_ID = "918051034554872";
export const SITE_URL = "https://shobjanta-supplier.vercel.app";

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  priceLabel?: string;
  image: string;
  offerBadge?: string;
  offerLink?: string;
  stockBadge?: string;
  showCod?: boolean;
  showEmi?: boolean;
  emiInfo?: string;
  category?: string;
}

export const PRODUCTS: Product[] = [
  // ─── মুদি পণ্য (Groceries) ───
  {
    id: "prod_rice_001",
    name: "প্রিমিয়াম পাকিস্তানি বাসমতী চাল (৩ কেজি জার)",
    price: 1250,
    oldPrice: 1750,
    image: "/images/rice-jar.webp",
    offerBadge: "BEST OFFER",
    offerLink: "https://shobjanta-supplier.vercel.app/",
    showCod: true,
    category: "grocery",
  },
  {
    id: "prod_dal_oil_001",
    name: "খাঁটি ডাল ও সরিষার তেল প্যাকেজ",
    price: 850,
    oldPrice: 1100,
    image: "/images/dal-oil.webp",
    offerBadge: "SAVE ৳২৫০",
    showCod: true,
    category: "grocery",
  },
  {
    id: "prod_fish_001",
    name: "সতেজ ইলিশ মাছ (১ কেজি)",
    price: 1400,
    oldPrice: 1800,
    image: "/images/fish.webp",
    stockBadge: "সীমিত স্টক!",
    showCod: true,
    category: "grocery",
  },
  {
    id: "prod_meat_001",
    name: "সতেজ গরুর মাংস (১ কেজি)",
    price: 750,
    oldPrice: 900,
    image: "/images/meat.webp",
    showCod: true,
    category: "grocery",
  },
  {
    id: "prod_veg_001",
    name: "তাজা সবজি বাস্কেট (মিশ্র ৩ কেজি)",
    price: 350,
    oldPrice: 450,
    image: "/images/vegetables.webp",
    offerBadge: "FRESH",
    showCod: true,
    category: "grocery",
  },
  // ─── ইলেকট্রনিক্স (কিস্তিতে পাওয়া যায়) ───
  {
    id: "prod_tv_001",
    name: '৪৩" স্মার্ট টিভি',
    price: 37999,
    oldPrice: 45999,
    image: "/images/smart-tv.webp",
    stockBadge: "মাত্র ৫টি বাকি!",
    showCod: true,
    showEmi: true,
    emiInfo: "৳৩,১৬৭/মাস",
    category: "electronics",
  },
  {
    id: "prod_fridge_001",
    name: "ডাবল ডোর ফ্রিজ (২৬০ লিটার)",
    price: 42999,
    oldPrice: 52000,
    image: "/images/fridge.webp",
    showCod: true,
    showEmi: true,
    emiInfo: "৳৩,৫৮৩/মাস",
    category: "electronics",
  },
  {
    id: "prod_ac_001",
    name: "১.৫ টন স্প্লিট AC",
    price: 48999,
    oldPrice: 58000,
    image: "/images/ac.webp",
    stockBadge: "গরমে সেরা ডিল!",
    showCod: true,
    showEmi: true,
    emiInfo: "৳৪,০৮৩/মাস",
    category: "electronics",
  },
  {
    id: "prod_cooler_001",
    name: "এয়ার কুলার (টাওয়ার ফ্যান)",
    price: 8999,
    oldPrice: 12500,
    image: "/images/air-cooler.webp",
    offerBadge: "HOT DEAL",
    showCod: true,
    showEmi: true,
    emiInfo: "৳৭৫০/মাস",
    category: "electronics",
  },
  {
    id: "prod_phone_001",
    name: "স্মার্টফোন (৪GB RAM, 128GB)",
    price: 12999,
    oldPrice: 16999,
    image: "/images/phone.webp",
    showCod: true,
    showEmi: true,
    emiInfo: "৳১,০৮৩/মাস",
    category: "electronics",
  },
  // ─── ফ্যাশন ───
  {
    id: "prod_saree_001",
    name: "ঈদ কালেকশন শাড়ি",
    price: 2190,
    oldPrice: 3200,
    image: "/images/saree.webp",
    showCod: true,
    category: "fashion",
  },
  // ─── ডিজিটাল সার্ভিস ───
  {
    id: "prod_service_001",
    name: "ল্যান্ডিং পেজ + এডস ম্যানেজ + সফটওয়্যার তৈরি",
    price: 4999,
    priceLabel: "প্যাকেজ ৳৪,৯৯৯ থেকে",
    image: "/images/digital-service.webp",
    offerBadge: "PREMIUM",
    category: "digital",
  },
];

export const DISTRICTS = [
  "যশোর সদর", "যশোর (শহরের বাহিরে)", "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চুয়াডাঙ্গা",
  "কুমিল্লা", "কক্সবাজার", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা", "গাজীপুর", "গোপালগঞ্জ",
  "হবিগঞ্জ", "জামালপুর", "ঝালকাঠি", "ঝিনাইদহ", "জয়পুরহাট", "কিশোরগঞ্জ", "কুড়িগ্রাম", "কুষ্টিয়া",
  "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর", "মাগুরা", "মানিকগঞ্জ", "মেহেরপুর", "মৌলভীবাজার",
  "মুন্সীগঞ্জ", "নওগাঁ", "নড়াইল", "নরসিংদী", "নারায়ণগঞ্জ", "নাটোর", "নেত্রকোনা", "নীলফামারী", "নোয়াখালী",
  "পাবনা", "পঞ্চগড়", "পটুয়াখালী", "পিরোজপুর", "রাজবাড়ী", "শরীয়তপুর", "শেরপুর", "সিরাজগঞ্জ",
  "সুনামগঞ্জ", "টাঙ্গাইল", "ঠাকুরগাঁও",
];

export interface Review {
  stars: number;
  text: string;
  author: string;
}

export const REVIEWS: Review[] = [
  {
    stars: 5,
    text: "৩ কেজি বাসমতী ১২৫০ টাকায় অসাধারণ! জার প্যাকিং দারুণ।",
    author: "সাদিয়া জামান, যশোর",
  },
  {
    stars: 5,
    text: "কিস্তিতে স্মার্ট টিভি নিলাম, মাসিক কিস্তি সুবিধা চমৎকার! কোনো ঝামেলা নেই।",
    author: "রাকিব হাসান, ঢাকা",
  },
  {
    stars: 4,
    text: "ইলিশ মাছ ও সবজি অর্ডার করেছিলাম, সতেজ পেয়েছি। ডেলিভারিতে একটু দেরি হলেও মান ভালো।",
    author: "নাসরিন জাহান, চট্টগ্রাম",
  },
  {
    stars: 5,
    text: "এয়ার কুলার কিস্তিতে নিয়েছি, গরমে অনেক আরাম! ডেলিভারিও দ্রুত।",
    author: "মো. আলী হোসেন, রাজশাহী",
  },
  {
    stars: 4,
    text: "ফ্রিজ কিস্তিতে কিনলাম, ডাউন পেমেন্টের পর মাসে মাসে দিচ্ছি। সার্ভিস ভালো, তবে আরেকটু ফোন রেসপন্স দ্রুত হলে ভালো হতো।",
    author: "ফারহানা ইয়াসমিন, খুলনা",
  },
  {
    stars: 5,
    text: "ডাল-তেল প্যাকেজ অর্ডার করেছি, দাম বাজারের চেয়ে কম ও মান ভালো।",
    author: "সাইফুল ইসলাম, যশোর",
  },
];

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "কিভাবে অর্ডার করব?",
    answer: 'পণ্যে "অর্ডার কনফার্ম" ক্লিক করে কার্টে এড করুন এবং চেকআউট করুন। অথবা "সরাসরি অর্ডার" বাটনে ক্লিক করে WhatsApp এ প্রি-ফিল্ড অর্ডার করুন।',
  },
  {
    question: "কিস্তিতে (EMI) কিভাবে কিনব?",
    answer: "ইলেকট্রনিক্স পণ্যে (টিভি, ফ্রিজ, AC, ফোন) কিস্তি সুবিধা আছে। WhatsApp এ আপনার পছন্দের পণ্যের নাম ও 'কিস্তি' লিখুন। ডাউন পেমেন্টের পর মাসিক কিস্তিতে পরিশোধ করতে পারবেন।",
  },
  {
    question: "ডেলিভারি কতদিন লাগে?",
    answer: "যশোর শহরের মধ্যে: ২৪ ঘণ্টা (ফ্রি ডেলিভারি), যশোর শহরের বাহিরে: ২৪ ঘণ্টা (৳৭০), অন্যান্য জেলা: ৩-৫ দিন (৳১৬০, জরুরি পণ্যের কোয়ান্টিটির উপর নির্ভর)। মাছ/মাংস/সবজি: যশোরে একই দিনে। কুরিয়ার পার্টনার: পাথাও, সন্দরবন, রেডএক্স।",
  },
  {
    question: "মাছ, মাংস ও সবজি সতেজ পাবো?",
    answer: "হ্যাঁ! মাছ, মাংস ও সবজি সরাসরি স্থানীয় বাজার থেকে সংগ্রহ করে দ্রুত ডেলিভারি দেওয়া হয়। যশোরে একই দিনে, অন্যান্য জেলায় ফ্রোজেন/প্যাকেজড ডেলিভারি।",
  },
  {
    question: "রিটার্ন পলিসি কী?",
    answer: "পণ্য নষ্ট বা ভুল আসলে ৩ দিনের মধ্যে ফেরত / বিনিময় সুবিধা আছে। পচনশীল পণ্যে (মাছ/মাংস/সবজি) ডেলিভারির সময় চেক করুন।",
  },
  {
    question: "পাইকারি কিনতে চাই?",
    answer: "হোয়াটসঅ্যাপে 'পাইকারি' লিখুন। স্পেশাল কমিশন ও ড্রপশিপিং সুবিধা পাবেন।",
  },
];

export interface Category {
  icon: string;
  name: string;
  filterKey?: string;
}

export const CATEGORIES: Category[] = [
  { icon: "🍚", name: "চাল, ডাল, তেল", filterKey: "grocery" },
  { icon: "🐟", name: "মাছ, মাংস, সবজি", filterKey: "grocery" },
  { icon: "📺", name: "ইলেকট্রনিক্স (কিস্তি)", filterKey: "electronics" },
  { icon: "📱", name: "ফোন (কিস্তি)", filterKey: "electronics" },
  { icon: "👗", name: "ফ্যাশন", filterKey: "fashion" },
  { icon: "💻", name: "ডিজিটাল সার্ভিস", filterKey: "digital" },
];

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("bn-BD")}`;
}

export function generateOrderId(): string {
  return "ORD" + Date.now() + Math.floor(Math.random() * 1000);
}

export function normalizePhone(raw: string): string {
  let phone = raw.replace(/[^0-9]/g, "");
  if (phone.startsWith("880")) phone = "0" + phone.slice(2);
  return phone;
}

export function isValidPhone(phone: string): boolean {
  return /^01[3-9]\d{8}$/.test(phone);
}
