export const WHATSAPP_NUMBER = "8801711731354";
export const BASE_WA_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  priceLabel?: string;
  image: string;
  offerBadge?: string;
  stockBadge?: string;
  showCod?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: "prod_rice_001",
    name: "প্রিমিয়াম পাকিস্তানি বাসমতী চাল (৩ কেজি জার)",
    price: 1250,
    oldPrice: 1750,
    image: "/images/rice-jar.png",
    offerBadge: "BEST OFFER",
    stockBadge: "মাত্র ১৫টি বাকি!",
    showCod: true,
  },
  {
    id: "prod_tv_001",
    name: '৪৩" স্মার্ট টিভি',
    price: 37999,
    oldPrice: 45999,
    image: "/images/smart-tv.png",
    stockBadge: "মাত্র ৫টি বাকি!",
    showCod: true,
  },
  {
    id: "prod_saree_001",
    name: "ঈদ কালেকশন শাড়ি",
    price: 2190,
    oldPrice: 3200,
    image: "/images/saree.png",
    showCod: true,
  },
  {
    id: "prod_service_001",
    name: "ল্যান্ডিং পেজ + এডস ম্যানেজ + সফটওয়্যার তৈরি",
    price: 4999,
    priceLabel: "প্যাকেজ ৳৪,৯৯৯ থেকে",
    image: "/images/digital-service.png",
    offerBadge: "PREMIUM",
  },
];

export const DISTRICTS = [
  "যশোর সদর", "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ",
  "বাগেরহাট", "বান্দরবান", "বরগুনা", "ভোলা", "বগুড়া", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "চুয়াডাঙ্গা",
  "কুমিল্লা", "কক্সবাজার", "দিনাজপুর", "ফরিদপুর", "ফেনী", "গাইবান্ধা", "গাজীপুর", "গোপালগঞ্জ",
  "হবিগঞ্জ", "জামালপুর", "ঝালকাঠি", "ঝিনাইদহ", "জয়পুরহাট", "কিশোরগঞ্জ", "কুড়িগ্রাম", "কুষ্টিয়া",
  "লক্ষ্মীপুর", "লালমনিরহাট", "মাদারীপুর", "মাগুরা", "মানিকগঞ্জ", "মেহেরপুর", "মৌলভীবাজার",
  "মুন্সীগঞ্জ", "নওগাঁ", "নড়াইল", "নরসিংদী", "নাটোর", "নেত্রকোনা", "নীলফামারী", "নোয়াখালী",
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
    text: "ল্যান্ডিং পেজ + এডস ম্যানেজ সফটওয়্যার তৈরি বেস্ট ছিল। NextGen টিমও চমৎকার।",
    author: "রাফি হোসেন, ঢাকা",
  },
  {
    stars: 5,
    text: "শাড়ির কালেকশন অসাধারণ, ক্যাশ অন ডেলিভারি ঝামেলামুক্ত।",
    author: "তানিয়া সুলতানা, চট্টগ্রাম",
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
    question: "ডেলিভারি কতদিন লাগে?",
    answer: "যশোর: ২৪ ঘণ্টা, ঢাকা/চট্টগ্রাম: ২-৩ দিন, অন্যান্য জেলা: ৩-৫ দিন। কুরিয়ার পার্টনার: পাথাও, সন্দরবন, রেডএক্স।",
  },
  {
    question: "রিটার্ন পলিসি কী?",
    answer: "পণ্য নষ্ট বা ভুল আসলে ৩ দিনের মধ্যে ফেরত / বিনিময় সুবিধা আছে।",
  },
  {
    question: "পাইকারি কিনতে চাই?",
    answer: "হোয়াটসঅ্যাপে 'পাইকারি' লিখুন। স্পেশাল কমিশন ও ড্রপশিপিং সুবিধা পাবেন।",
  },
];

export interface Category {
  icon: string;
  name: string;
}

export const CATEGORIES: Category[] = [
  { icon: "🍚", name: "চাল, ডাল, তেল" },
  { icon: "📺", name: "ইলেকট্রনিক্স" },
  { icon: "👗", name: "ফ্যাশন" },
  { icon: "💻", name: "ডিজিটাল সার্ভিস" },
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
