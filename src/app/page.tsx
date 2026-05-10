"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShoppingCart,
  Phone,
  MessageCircle,
  Minus,
  Plus,
  X,
  Check,
  Truck,
  ShieldCheck,
  Lightbulb,
  Star,
  Gift,
  Zap,
  Clock,
  MapPin,
  CreditCard,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";
import {
  PRODUCTS,
  DISTRICTS,
  REVIEWS,
  FAQ_ITEMS,
  CATEGORIES,
  WHATSAPP_NUMBER,
  BASE_WA_URL,
  formatPrice,
  generateOrderId,
  normalizePhone,
  isValidPhone,
} from "@/lib/constants";

/* ─── Facebook Pixel Event Tracker ─── */
function fbqTrack(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (...args: unknown[]) => void };
  if (typeof w.fbq === "function") {
    w.fbq("track", eventName, params || {});
  }
}

/* ─── Animation Variants ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Section Wrapper with Scroll Animation ─── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Countdown Timer Hook ─── */
function useCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(23, 59, 59, 999);
      const diff = deadline.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("অফার শেষ! আজই যোগাযোগ করুন");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(
        `অফার শেষ হতে বাকি : ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

/* ─── WhatsApp Helper ─── */
function openWhatsApp(message: string) {
  window.open(`${BASE_WA_URL}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

/* ─── Main Page Component ─── */
export default function Home() {
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();

  // Hydration guard: don't render localStorage-dependent UI until client mounts
  const hasMounted = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { queueMicrotask(() => { if (!hasMounted.current) { hasMounted.current = true; setMounted(true); } }); }, []);

  // Modal states
  const [cartOpen, setCartOpen] = useState(false);
  const [qtyModalOpen, setQtyModalOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [codModalOpen, setCodModalOpen] = useState(false);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [abandonModalOpen, setAbandonModalOpen] = useState(false);

  // Form state
  const [qty, setQty] = useState(1);
  const [customerAddress, setCustomerAddress] = useState("");

  // Product being added to cart
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);

  // Order tracking
  const [orderId, setOrderId] = useState("");

  // Category filter
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Delivery - init with SSR-safe defaults, hydrate from localStorage in useEffect
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Sticky bar
  const [showStickyBar, setShowStickyBar] = useState(true);
  const lastScrollY = useRef(0);

  // Exit intent tracking
  const exitMobileShown = useRef(false);
  const abandonTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Countdown
  const countdown = useCountdown();

  // Phone resolve ref
  const resolvePhoneRef = useRef<((phone: string | null) => void) | null>(null);

  // Customer info - init with SSR-safe defaults, hydrate from localStorage in useEffect
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerName, setCustomerName] = useState("");

  /* ─── Delivery Fee ─── */
  const getDeliveryFee = (district: string): number => {
    if (!district) return 0;
    if (district === "যশোর সদর") return 0; // যশোর শহরের মধ্যে ফ্রি
    if (district === "যশোর (শহরের বাহিরে)") return 70; // যশোর শহরের বাহিরে ৭০ টাকা
    return 160; // অন্য সকল জেলায় ১৬০ টাকা (জরুরি পণ্যের কোয়ান্টিটির উপর নির্ভর)
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setDeliveryFee(getDeliveryFee(value));
    localStorage.setItem("selected_district", value);
  };

  /* ─── Hydrate from localStorage after mount (fixes SSR mismatch) ─── */
  useEffect(() => {
    // Using queueMicrotask to avoid React 19 lint rule about synchronous setState in effects
    // This is a legitimate hydration pattern for SSR-compatible localStorage reads
    queueMicrotask(() => {
      const savedDistrict = localStorage.getItem("selected_district");
      if (savedDistrict && DISTRICTS.includes(savedDistrict)) {
        setSelectedDistrict(savedDistrict);
        setDeliveryFee(getDeliveryFee(savedDistrict));
      }
      const savedPhone = localStorage.getItem("customer_phone");
      if (savedPhone) setCustomerPhone(savedPhone);
      const savedName = localStorage.getItem("customer_name");
      if (savedName) setCustomerName(savedName);
    });
  }, []);

  /* ─── Scroll handling for sticky bar ─── */
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY.current && currentScroll > 150) {
        setShowStickyBar(false);
      } else {
        setShowStickyBar(true);
      }
      lastScrollY.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Exit Intent Detection (একবারই দেখাবে, বারবার না) ─── */
  useEffect(() => {
    // আগে দেখালে আর দেখাবে না
    const alreadyShown = sessionStorage.getItem("exit_intent_shown");
    if (alreadyShown) return;

    const isMobile = () => window.innerWidth < 768;
    let desktopShown = false;

    const handleMouseOut = (e: MouseEvent) => {
      if (desktopShown || isMobile() || e.clientY > 10 || e.relatedTarget) return;
      desktopShown = true;
      setExitIntentOpen(true);
      sessionStorage.setItem("exit_intent_shown", "1");
      fbqTrack("ViewContent", { content_name: "exit_intent_popup" });
    };

    const handleMobileScroll = () => {
      if (!isMobile() || exitMobileShown.current) return;
      const scrolled = (window.innerHeight + window.scrollY) / document.body.scrollHeight;
      if (scrolled > 0.7) {
        exitMobileShown.current = true;
        setExitIntentOpen(true);
        sessionStorage.setItem("exit_intent_shown", "1");
        fbqTrack("ViewContent", { content_name: "scroll_depth_popup" });
      }
    };

    // পেজ লোডের ১৫ সেকেন্ড পর থেকে ট্র্যাক শুরু
    const initDelay = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("scroll", handleMobileScroll, { passive: true });
    }, 15000);

    return () => {
      clearTimeout(initDelay);
      document.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleMobileScroll);
    };
  }, []);

  /* ─── Abandoned Cart Timer (একবারই দেখাবে, বারবার না) ─── */
  useEffect(() => {
    if (abandonTimerRef.current) {
      clearTimeout(abandonTimerRef.current);
      abandonTimerRef.current = null;
    }

    // এই সেশনে আগে দেখালে আর দেখাবে না
    const alreadyShown = sessionStorage.getItem("abandon_cart_shown");
    if (alreadyShown) return;

    if (getItemCount() > 0) {
      abandonTimerRef.current = setTimeout(() => {
        if (getItemCount() > 0) {
          setAbandonModalOpen(true);
          sessionStorage.setItem("abandon_cart_shown", "1");
        }
      }, 60000); // ১ মিনিট পর দেখাবে (২৫ সেকেন্ড আগে ছিল, খুব দ্রুত)
    }

    return () => {
      if (abandonTimerRef.current) {
        clearTimeout(abandonTimerRef.current);
      }
    };
  }, [items, getItemCount]);

  /* ─── Phone Modal Promise ─── */
  const askForPhone = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      resolvePhoneRef.current = resolve;
      setPhoneModalOpen(true);
    });
  }, []);

  const handlePhoneSubmit = () => {
    const phone = normalizePhone(customerPhone);
    if (isValidPhone(phone)) {
      localStorage.setItem("customer_phone", phone);
      if (customerName.trim()) localStorage.setItem("customer_name", customerName.trim());
      setPhoneModalOpen(false);
      resolvePhoneRef.current?.(phone);
      resolvePhoneRef.current = null;
    } else {
      alert("সঠিক মোবাইল নম্বর দিন (01xxxxxxxxx)");
    }
  };

  const handlePhoneCancel = () => {
    setPhoneModalOpen(false);
    resolvePhoneRef.current?.(null);
    resolvePhoneRef.current = null;
  };

  /* ─── WhatsApp Order Flow ─── */
  const sendCartOrder = async () => {
    if (items.length === 0) {
      alert("কার্টে কোনো পণ্য নেই।");
      return;
    }

    const phone = await askForPhone();
    if (!phone) return;

    const id = generateOrderId();
    let msg = `🛒 *নতুন অর্ডার* (${id})\n\n`;
    items.forEach((item) => {
      msg += `📦 ${item.name}\n➡ পরিমাণ: ${item.qty} × ${formatPrice(item.price)} = ${formatPrice(item.price * item.qty)}\n`;
    });
    const total = getTotal();
    const grandTotal = total + deliveryFee;
    const deliveryLabel = !selectedDistrict ? "নির্ধারিত হয়নি" : deliveryFee === 0 ? "ফ্রি (যশোর শহর)" : formatPrice(deliveryFee);
    msg += `\n💰 পণ্য মূল্য: ${formatPrice(total)}\n🧾 *সর্বমোট: ${formatPrice(grandTotal)}* (ডেলিভারি চার্জ: ${deliveryLabel})\n`;
    msg += `\n📞 ফোন: ${phone}`;
    if (customerName.trim()) msg += `\n👤 নাম: ${customerName.trim()}`;
    if (customerAddress.trim()) msg += `\n📍 ঠিকানা: ${customerAddress.trim()}`;
    msg += `\n🗺️ জেলা: ${selectedDistrict || "নির্ধারিত হয়নি"}`;
    msg += `\n💵 পেমেন্ট: ক্যাশ অন ডেলিভারি`;
    msg += `\n\n⏳ দ্রুত কনফার্ম করুন। ধন্যবাদ!`;

    openWhatsApp(msg);
    fbqTrack("InitiateCheckout", { currency: "BDT", value: total });
    fbqTrack("Purchase", { currency: "BDT", value: grandTotal });
    setOrderId(id);
    setThankYouOpen(true);
    clearCart();
    setCartOpen(false);
  };

  const sendDirectOrder = async (productName: string, price: number) => {
    const phone = await askForPhone();
    if (!phone) return;

    const id = generateOrderId();
    let msg = `⚡ *সরাসরি অর্ডার* (${id})\n\n📦 পণ্য: ${productName}\n💰 মূল্য: ${formatPrice(price)}\n`;
    msg += `\n📞 ফোন: ${phone}`;
    if (customerName.trim()) msg += `\n👤 নাম: ${customerName.trim()}`;
    if (customerAddress.trim()) msg += `\n📍 ঠিকানা: ${customerAddress.trim()}`;
    msg += `\n🗺️ জেলা: ${selectedDistrict || "নির্ধারিত হয়নি"}`;
    const deliveryLabel2 = !selectedDistrict ? "নির্ধারিত হয়নি" : deliveryFee === 0 ? "ফ্রি (যশোর শহর)" : formatPrice(deliveryFee);
    msg += `\n🚚 ডেলিভারি চার্জ: ${deliveryLabel2}`;
    msg += `\n💵 পেমেন্ট: ক্যাশ অন ডেলিভারি`;
    msg += `\n\n⏳ দ্রুত কনফার্ম করুন। ধন্যবাদ!`;

    openWhatsApp(msg);
    fbqTrack("Lead", { content_name: productName });
    setOrderId(id);
    setThankYouOpen(true);
  };

  const openWhatsAppInquiry = (product = "") => {
    const msg = product
      ? `আসসালামু আলাইকুম,\nআমি "${product}" অর্ডার করতে চাই।\n\nনাম:\nঠিকানা:\nজেলা:\nপরিমাণ:\n\nদয়া করে কনফার্ম করুন।`
      : "আমি সবজান্তা সাপ্লাইয়ার থেকে সাধারণ ইনকোয়ারি করছি।";
    openWhatsApp(msg);
    fbqTrack("Lead", { content_category: "inquiry" });
  };

  /* ─── Add to Cart Flow ─── */
  const handleAddToCart = (product: { id: string; name: string; price: number }) => {
    setSelectedProduct(product);
    setQty(1);
    setQtyModalOpen(true);
    fbqTrack("ViewContent", { content_name: product.name, content_ids: [product.id], value: product.price, currency: "BDT" });
  };

  const confirmAddToCart = () => {
    if (selectedProduct) {
      addItem(selectedProduct.id, selectedProduct.name, selectedProduct.price, qty);
      fbqTrack("AddToCart", { content_name: selectedProduct.name, content_ids: [selectedProduct.id], value: selectedProduct.price * qty, currency: "BDT" });
    }
    setQtyModalOpen(false);
    setQty(1);
    setCartOpen(true);
  };

  /* ─── Category Filter ─── */
  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const itemCount = getItemCount();
  const cartTotal = getTotal();
  const grandTotal = cartTotal + deliveryFee;

  return (
    <div className="min-h-screen flex flex-col pb-20">
      {/* ─── HERO SECTION ─── */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="hero-gradient relative overflow-hidden rounded-b-3xl px-4 py-10 md:py-16 text-center mb-4"
      >
        <div className="absolute inset-0 hero-pattern opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="relative z-10">
          <motion.img
            src="/images/logo.webp"
            alt="সবজান্তা সাপ্লাইয়ার লোগো"
            className="max-w-[180px] mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            width={180}
            height={60}
          />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 max-w-4xl mx-auto leading-tight">
            <span className="gradient-text">সবকিছু এক ছাদের নিচে</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {[
              { icon: "🍚", label: "মুদি" },
              { icon: "🐟", label: "মাছ-মাংস" },
              { icon: "📺", label: "ইলেকট্রনিক্স (কিস্তি)" },
              { icon: "💻", label: "ডিজিটাল সার্ভিস" },
            ].map((cat, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm border border-primary/20 rounded-full px-3 py-1.5 text-xs md:text-sm font-bold text-primary shadow-sm"
              >
                {cat.icon} {cat.label}
              </span>
            ))}
          </div>
          <p className="text-foreground/70 text-sm md:text-base mb-3">
            🚚 সারা দেশে ডেলিভারি &nbsp;|&nbsp; 💵 ক্যাশ অন ডেলিভারি &nbsp;|&nbsp; 🟢 ২৪/৭ হোয়াটসঅ্যাপ সাপোর্ট
          </p>
          <p className="text-primary font-bold text-sm md:text-base mb-6">
            💳 টিভি, ফ্রিজ, AC, ফোন — কিস্তিতে কিনুন, দেশের যেকোনো প্রান্তে!
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={() => openWhatsAppInquiry()}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-6 py-3 text-base font-bold h-auto"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              হোয়াটসঅ্যাপে অর্ডার করুন
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-6 py-3 text-base font-bold h-auto"
            >
              সব পণ্য দেখুন
            </Button>
          </div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 w-full flex-1">
        {/* ─── TRUST BAR ─── */}
        <AnimatedSection>
          <div className="bg-white rounded-full shadow-md py-3 px-4 md:px-6 -mt-8 mb-6 flex flex-wrap justify-center gap-3 md:gap-5">
            {[
              { icon: <Truck className="w-4 h-4" />, text: "সারা দেশে ডেলিভারি" },
              { icon: <span className="text-base">💵</span>, text: "ক্যাশ অন ডেলিভারি" },
              { icon: <CreditCard className="w-4 h-4" />, text: "কিস্তি সুবিধা" },
              { icon: <ShieldCheck className="w-4 h-4" />, text: "১০০% ট্রাস্টেড" },
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5 font-semibold text-xs md:text-sm text-foreground">
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Delivery Partners + Testimonial Count */}
        <AnimatedSection delay={0.1}>
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-xs font-medium text-foreground/70 shadow-sm">
              🚚 Pathao &nbsp;|&nbsp; Sundarban &nbsp;|&nbsp; RedX Delivery Available
            </div>
            <div className="block">
              <span className="inline-block bg-green-50 text-primary font-semibold text-sm px-4 py-1.5 rounded-full">
                ❤️ ২০০০+ সন্তুষ্ট গ্রাহক সারা বাংলাদেশে
              </span>
            </div>
          </div>
        </AnimatedSection>

        {/* ─── DELIVERY CALCULATOR ─── */}
        <AnimatedSection delay={0.15}>
          <div className="bg-white rounded-2xl p-5 md:p-6 text-center shadow-sm mb-8 border border-green-100">
            <label className="font-bold text-sm md:text-base flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              আপনার জেলা নির্বাচন করুন (ডেলিভারি চার্জ জানতে):
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full max-w-xs mx-auto block rounded-full border-2 border-primary/30 bg-white px-4 py-2.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary appearance-none cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%232c7a47' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '12px',
              }}
            >
              <option value="">-- জেলা নির্বাচন করুন --</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <div className="mt-4">
              {!selectedDistrict ? (
                <p className="text-sm text-muted-foreground">👆 জেলা নির্বাচন করুন</p>
              ) : deliveryFee === 0 ? (
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-5 py-2.5 rounded-full">
                  <span className="text-lg">🎉</span>
                  <span className="font-bold text-base text-primary">ফ্রি ডেলিভারি (যশোর শহর)</span>
                </div>
              ) : deliveryFee === 70 ? (
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-5 py-2.5 rounded-full">
                  <span className="text-lg">🚚</span>
                  <span className="font-bold text-base text-blue-700">{formatPrice(deliveryFee)}</span>
                  <span className="text-xs text-muted-foreground">(যশোর শহরের বাহিরে)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-full">
                  <span className="text-lg">🚚</span>
                  <span className="font-bold text-base text-foreground">{formatPrice(deliveryFee)}</span>
                  <span className="text-xs text-muted-foreground">(জরুরি পণ্যের কোয়ান্টিটির উপর নির্ভর)</span>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── CATEGORIES ─── */}
        <AnimatedSection delay={0.2}>
          <section className="mb-8">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-4">📦 ক্যাটাগরি</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
              <button
                onClick={() => setActiveCategory("all")}
                className={`rounded-2xl p-3 md:p-4 text-center shadow-sm transition-all duration-200 border-2 ${activeCategory === "all" ? "bg-primary text-white border-primary" : "bg-white border-transparent hover:shadow-md hover:-translate-y-1"}`}
              >
                <span className="text-2xl md:text-3xl block mb-1">🏪</span>
                <h3 className="text-[10px] md:text-sm font-bold">সব পণ্য</h3>
              </button>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(cat.filterKey || "all")}
                  className={`rounded-2xl p-3 md:p-4 text-center shadow-sm transition-all duration-200 border-2 ${activeCategory === cat.filterKey ? "bg-primary text-white border-primary" : "bg-white border-transparent hover:shadow-md hover:-translate-y-1"}`}
                >
                  <span className="text-2xl md:text-3xl block mb-1">{cat.icon}</span>
                  <h3 className="text-[10px] md:text-sm font-bold">{cat.name}</h3>
                </button>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* ─── PRODUCTS ─── */}
        <AnimatedSection delay={0.1}>
          <section id="products" className="mb-8 scroll-mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold">⚡ স্পেশাল অফার</h2>
              <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
                <Filter className="w-3 h-3 inline mr-1" />
                {filteredProducts.length}টি পণ্য
              </span>
            </div>
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={staggerItem}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden bg-gradient-to-b from-white to-green-50/40 p-3 md:p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                      loading="lazy"
                      width={400}
                      height={400}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-4 flex flex-col flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {product.offerBadge && (
                        <Badge
                          className="bg-[#ff8c1a] text-white rounded-full text-[10px] font-bold px-2.5 py-0.5 cursor-pointer hover:bg-[#e67e22] transition-colors"
                          onClick={() => {
                            if (product.offerLink) {
                              window.open(product.offerLink, "_blank", "noopener,noreferrer");
                            }
                          }}
                        >
                          {product.offerBadge}
                        </Badge>
                      )}
                      {product.stockBadge && (
                        <Badge className="bg-[#e74c3c] text-white rounded-full text-[10px] font-bold px-2.5 py-0.5 animate-stock-pulse">
                          {product.stockBadge}
                        </Badge>
                      )}
                      {product.showCod && (
                        <Badge
                          className="bg-[#0b65c2] text-white rounded-full text-[10px] font-bold px-2.5 py-0.5 cursor-pointer hover:bg-[#094d94]"
                          onClick={() => setCodModalOpen(true)}
                        >
                          💵 COD
                        </Badge>
                      )}
                      {product.showEmi && (
                        <Badge className="bg-primary text-white rounded-full text-[10px] font-bold px-2.5 py-0.5">
                          💳 কিস্তি {product.emiInfo}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm mb-2 flex-1">{product.name}</h3>

                    {/* Price */}
                    <div className="mb-3">
                      <span className="font-extrabold text-lg text-primary">
                        {product.priceLabel || formatPrice(product.price)}
                      </span>
                      {product.oldPrice && (
                        <span className="line-through text-xs text-muted-foreground ml-2">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() =>
                          handleAddToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                          })
                        }
                        className="bg-[#ff8c1a] hover:bg-[#e67e22] text-white rounded-full font-bold text-xs h-9 px-2"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                        অর্ডার
                      </Button>
                      <Button
                        onClick={() => openWhatsAppInquiry(product.name)}
                        className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold text-xs h-9 px-2"
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </Button>
                      <Button
                        onClick={() => sendDirectOrder(product.name, product.price)}
                        className="col-span-2 bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-xs h-9 px-2"
                      >
                        <Zap className="w-3.5 h-3.5 mr-1" />
                        সরাসরি অর্ডার
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Combo Offer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center mt-6 font-bold text-sm">
              🎁 ২টি জার প্রিমিয়াম পাকিস্তানি বাসমতী চাল (৩+৩ কেজি) কিনলে → ফ্রি ডেলিভারি সীমিত সময়ের জন্য
            </div>

            {/* EMI Info Banner */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center mt-4 font-bold text-sm text-primary">
              💳 সকল ইলেকট্রনিক্স পণ্য কিস্তিতে পাওয়া যায় — টিভি, ফ্রিজ, AC, এয়ার কুলার, ফোন। WhatsApp এ জানুন।
            </div>
          </section>
        </AnimatedSection>

        {/* ─── WHY US ─── */}
        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: <ShieldCheck className="w-8 h-8 text-primary" />, title: "১০০% খাঁটি পণ্য", desc: "সতেজ মাছ-মাংস-সবজি ও অরিজিনাল বাসমতী" },
                  { icon: <Truck className="w-8 h-8 text-primary" />, title: "সারা দেশে ডেলিভারি", desc: "যশোর শহরে ফ্রি, শহরের বাহিরে ৳৭০, অন্য জেলায় ৳১৬০" },
                  { icon: <CreditCard className="w-8 h-8 text-primary" />, title: "কিস্তি সুবিধা", desc: "টিভি, ফ্রিজ, AC, ফোন কিস্তিতে কিনুন" },
                  { icon: <Lightbulb className="w-8 h-8 text-primary" />, title: "ডিজিটাল সাপোর্ট", desc: "ওয়েব, এডস, গ্রাফিক্স, সফটওয়্যার" },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ─── OFFER BANNER ─── */}
        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <div className="offer-gradient rounded-3xl p-6 md:p-8 text-center text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">🔥 লিমিটেড টাইম অফার 🔥</h3>
              <p className="text-sm md:text-base opacity-90 mb-1">
                যেকোনো ইলেকট্রনিক্স পণ্যে ৫% ছাড় + যশোর শহরে ফ্রি ডেলিভারি
              </p>
              <p className="text-sm opacity-80 mb-3">
                💳 কিস্তিতে কিনতে চাইলে WhatsApp এ যোগাযোগ করুন
              </p>
              <div className="inline-block bg-black/25 px-4 py-2 rounded-full font-bold text-lg tracking-wider mb-4">
                <Clock className="w-4 h-4 inline mr-2" />
                {countdown}
              </div>
              <div>
                <Button
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-white text-[#da2c2c] hover:bg-gray-100 rounded-full font-bold h-auto py-3 px-6"
                >
                  এখনই অর্ডার করুন
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ─── REVIEWS ─── */}
        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-4">⭐ গ্রাহকদের মতামত</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {REVIEWS.map((review, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: review.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_1px_2px_rgba(251,191,36,0.4)]" />
                    ))}
                  </div>
                  <p className="text-sm mb-2 text-foreground/80">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-xs font-bold text-foreground">- {review.author}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </AnimatedSection>

        {/* ─── FAQ ─── */}
        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <h2 className="text-center text-xl md:text-2xl font-bold mb-4">❓ সাধারণ জিজ্ঞাসা</h2>
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {FAQ_ITEMS.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-sm md:text-base font-bold text-left hover:text-primary hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </AnimatedSection>

        {/* ─── FINAL CTA ─── */}
        <AnimatedSection delay={0.1}>
          <section className="mb-8">
            <div className="cta-gradient rounded-3xl p-6 md:p-8 text-center text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-3">🚀 আজই সেরা অফারটি মিস করবেন না</h2>
              <p className="text-sm opacity-80 mb-1">স্টক সীমিত, অর্ডার করতে দেরি করবেন না।</p>
              <p className="text-sm opacity-80 mb-5">💳 ইলেকট্রনিক্স কিস্তিতে কিনুন — দেশের যেকোনো প্রান্তে ডেলিভারি!</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => window.open("https://shobjanta-supplier.vercel.app/", "_blank", "noopener,noreferrer")}
                  className="bg-[#0b65c2] hover:bg-[#094d94] text-white rounded-full font-bold h-auto py-3 px-6"
                >
                  🔥 বেস্ট অফার লিংক
                </Button>
                <Button
                  onClick={() => openWhatsAppInquiry()}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold h-auto py-3 px-6"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  হোয়াটসঅ্যাপ করুন
                </Button>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </div>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border mt-auto py-6 px-4 text-center text-xs text-muted-foreground bg-white/80" style={{ paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>
        <p>
          © {new Date().getFullYear()} <strong>সবজান্তা সাপ্লাইয়ার</strong> – বিশ্বস্ত মাল্টি-ক্যাটাগরি স্টোর
        </p>
        <p className="mt-1">
          <a href="https://shobjanta-supplier.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">🔥 বেস্ট অফার</a> &nbsp;|&nbsp;
          <a href="#products" className="text-primary hover:underline">প্রিমিয়াম পণ্য</a> &nbsp;|&nbsp;
          <a href="#" onClick={(e) => { e.preventDefault(); setCodModalOpen(true); }} className="text-primary hover:underline">রিটার্ন পলিসি</a> &nbsp;|&nbsp;
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="text-primary hover:underline">যোগাযোগ: +{WHATSAPP_NUMBER}</a>
        </p>
      </footer>

      {/* ═══════════════════ FLOATING ELEMENTS ═══════════════════ */}

      {/* Floating Action Buttons — Order from bottom: WhatsApp → Call → Cart */}
      <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 flex flex-col-reverse gap-3 z-40">
        {/* WhatsApp */}
        <motion.a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openWhatsAppInquiry();
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="WhatsApp এ মেসেজ করুন"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.a>
        {/* Call */}
        <motion.a
          href={`tel:+${WHATSAPP_NUMBER}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#0b65c2] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          aria-label="কল করুন"
        >
          <Phone className="w-6 h-6" />
        </motion.a>
        {/* Cart */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.4, type: "spring", stiffness: 200 }}
          onClick={() => setCartOpen(true)}
          className="bg-primary w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform text-white relative"
          role="button"
          tabIndex={0}
          aria-label="কার্ট খুলুন"
        >
          <ShoppingCart className="w-6 h-6" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#e74c3c] text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </motion.div>
      </div>

      {/* Sticky Bottom Bar */}
      <motion.div
        animate={{ y: showStickyBar ? 0 : 80 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-[0_-2px_10px_rgba(0,0,0,0.1)] px-4 py-3 z-30 flex items-center justify-between gap-2"
      >
        <span className="font-bold text-xs md:text-sm truncate">🔥 আজকের অফার শেষ হতে চলছে – এখনই অর্ডার করুন</span>
        <Button
          onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold text-xs md:text-sm h-8 px-4"
        >
          এখনই অর্ডার
        </Button>
      </motion.div>

      {/* ═══════════════════ MODALS & SHEETS ═══════════════════ */}

      {/* Cart Sidebar Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              আপনার অর্ডার
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar max-h-[50vh]">
            {items.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">কার্ট খালি</p>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-border pb-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold hover:bg-muted/80">−</button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold hover:bg-muted/80">+</button>
                        <span className="text-xs text-muted-foreground ml-1">× {formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{formatPrice(item.price * item.qty)}</span>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-7 h-7 rounded-full"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-4 border-t space-y-3">
              <div className="flex justify-between font-bold text-sm">
                <span>পণ্য মূল্য:</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {/* District selector inside cart */}
              <div className="space-y-2">
                <label className="text-xs font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  জেলা নির্বাচন করুন:
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full rounded-full border-2 border-primary/30 bg-white px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%232c7a47' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    backgroundSize: '12px',
                  }}
                >
                  <option value="">-- জেলা নির্বাচন করুন --</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>ডেলিভারি চার্জ:</span>
                <span className={selectedDistrict === "" ? "text-amber-600 font-semibold" : ""}>
                  {!selectedDistrict
                    ? "জেলা নির্বাচন করুন"
                    : deliveryFee === 0
                      ? "ফ্রি (যশোর শহর)"
                      : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-extrabold text-lg border-t border-border pt-2">
                <span>সর্বমোট:</span>
                <span className="text-primary">{formatPrice(grandTotal)}</span>
              </div>
              <Button
                onClick={sendCartOrder}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold h-12"
              >
                <Check className="w-4 h-4 mr-2" />
                অর্ডার কনফার্ম করুন (WhatsApp)
              </Button>
              <a href={`tel:+${WHATSAPP_NUMBER}`}>
                <Button className="w-full bg-[#0b65c2] hover:bg-[#094d94] text-white rounded-full font-bold h-12">
                  <Phone className="w-4 h-4 mr-2" />
                  কল করে অর্ডার করুন
                </Button>
              </a>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Quantity Modal */}
      <Dialog open={qtyModalOpen} onOpenChange={setQtyModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>পরিমাণ নির্বাচন করুন</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)))}
              className="w-16 text-center rounded-full border-2 font-bold"
              min={1}
              max={99}
            />
            <Button
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full"
              onClick={() => setQty(Math.min(99, qty + 1))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={confirmAddToCart}
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full font-bold"
            >
              <Check className="w-4 h-4 mr-2" />
              কার্টে যুক্ত করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phone Modal */}
      <Dialog open={phoneModalOpen} onOpenChange={(open) => !open && handlePhoneCancel()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              অর্ডার কনফার্মেশন ফর্ম
            </DialogTitle>
            <DialogDescription>
              আমরা আপনার অর্ডার কনফার্ম করতে WhatsApp এ যোগাযোগ করব
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              type="tel"
              placeholder="মোবাইল নম্বর (01xxxxxxxxx)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="rounded-full"
              autoComplete="tel"
            />
            <Input
              type="text"
              placeholder="আপনার নাম"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="rounded-full"
              autoComplete="name"
            />
            <Textarea
              placeholder="ঠিকানা (ঐচ্ছিক)"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="rounded-xl min-h-[60px] resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={handlePhoneSubmit}
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold"
              >
                <Check className="w-4 h-4 mr-2" />
                অর্ডার নিশ্চিত করুন
              </Button>
              <Button
                variant="outline"
                onClick={handlePhoneCancel}
                className="rounded-full"
              >
                বাতিল
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* COD Info Modal */}
      <Dialog open={codModalOpen} onOpenChange={setCodModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>💵 ক্যাশ অন ডেলিভারি (COD)</DialogTitle>
            <DialogDescription>পেমেন্ট পদ্ধতি সম্পর্কে তথ্য</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            পণ্য হাতে পাওয়ার পর টাকা প্রদান করুন। ১০০% নিরাপদ ও বিশ্বস্ত।
          </p>
          <p className="text-xs text-muted-foreground">
            যশোর শহরে ফ্রি ডেলিভারি, অন্যান্য জেলায় ৳১৬০ (জরুরি পণ্যের কোয়ান্টিটির উপর নির্ভর)।
          </p>
          <Button onClick={() => setCodModalOpen(false)} className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold">
            বুঝলাম
          </Button>
        </DialogContent>
      </Dialog>

      {/* Thank You Modal */}
      <Dialog open={thankYouOpen} onOpenChange={setThankYouOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="text-5xl mb-2">✅</div>
          <DialogHeader>
            <DialogTitle>অর্ডার সফলভাবে গৃহীত হয়েছে!</DialogTitle>
            <DialogDescription>আপনার অর্ডার নিশ্চিত হয়েছে</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            আপনার অর্ডার আইডি: <strong className="text-foreground">{orderId}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            শীঘ্রই WhatsApp এ কনফার্ম করা হবে।
          </p>
          <Button onClick={() => setThankYouOpen(false)} className="bg-primary hover:bg-primary/90 text-white rounded-full font-bold">
            ঠিক আছে
          </Button>
        </DialogContent>
      </Dialog>

      {/* Exit Intent Popup */}
      <Dialog open={exitIntentOpen} onOpenChange={setExitIntentOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="text-5xl mb-2">🎁</div>
          <DialogHeader>
            <DialogTitle>যাওয়ার আগে বিশেষ ছাড়!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            এখনই অর্ডার করলে <strong className="text-foreground">যশোর শহরে ফ্রি ডেলিভারি</strong> ও অতিরিক্ত ৫% ছাড়। ইলেকট্রনিক্সে <strong className="text-foreground">কিস্তি সুবিধা</strong>!
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => {
                setExitIntentOpen(false);
                openWhatsAppInquiry("বিশেষ অফার");
              }}
              className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold"
            >
              <Gift className="w-4 h-4 mr-2" />
              অফার নিন
            </Button>
            <Button
              variant="outline"
              onClick={() => setExitIntentOpen(false)}
              className="w-full rounded-full"
            >
              না, ধন্যবাদ
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Abandoned Cart Modal */}
      <Dialog open={abandonModalOpen} onOpenChange={setAbandonModalOpen}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="text-5xl mb-2">🛒</div>
          <DialogHeader>
            <DialogTitle>আপনার কার্টে পণ্য পড়ে আছে!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            আপনার অর্ডার সম্পন্ন করতে এখনই চেকআউট করুন। 💵 ক্যাশ অন ডেলিভারি সুবিধা!
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => {
                setAbandonModalOpen(false);
                setCartOpen(true);
              }}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold"
            >
              কার্ট দেখুন
            </Button>
            <Button
              variant="outline"
              onClick={() => setAbandonModalOpen(false)}
              className="w-full rounded-full"
            >
              পরে মনে করিয়ে দিন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
