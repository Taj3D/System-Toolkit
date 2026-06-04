'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Monitor, Laptop, Smartphone, Tablet, Globe, Terminal,
  Zap, Shield, Star, Check, ArrowRight, Play, Clock,
  Users, Award, ChevronDown, ChevronUp, Heart,
  X, ExternalLink, CheckCircle2, Phone, Mail, MapPin,
  Facebook, MessageCircle, HeadphonesIcon, Lock, Truck
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ============ BUSINESS INFO ============
const BUSINESS_INFO = {
  company: 'NextGen Digital Studio',
  facebook: 'https://www.facebook.com/nextgendigitalstudio',
  founder: 'Md. Najmul Islam Taj',
  address: 'NewMarket, Jessore Sadar Bangladesh',
  email: 'conceptbd.net@gmail.com',
  phone: '+880 1711-731354',
  whatsappNumber: '8801711731354'
}

// ============ PRICING PLANS ============
const PRICING_PLANS = [
  {
    name: 'বেসিক',
    nameEn: 'Basic',
    price: '২৯৯',
    originalPrice: '৫৯৯',
    features: [
      '১১৫+ টুল অ্যাক্সেস',
      'Windows প্ল্যাটফর্ম সাপোর্ট',
      'বেসিক ইমেইল সাপোর্ট',
      '৩ মাস আপডেট',
      '১ ডিভাইস লাইসেন্স'
    ],
    popular: false
  },
  {
    name: 'প্রফেশনাল',
    nameEn: 'Professional',
    price: '৪৯৯',
    originalPrice: '৯৯৯',
    features: [
      '১১৫+ টুল অ্যাক্সেস',
      'সকল ৬ প্ল্যাটফর্ম সাপোর্ট',
      'প্রায়োরিটি ইমেইল সাপোর্ট',
      '১ বছর ফ্রি আপডেট',
      '৩ ডিভাইস লাইসেন্স',
      'স্ক্রিপ্ট এক্সিকিউশন গাইড',
      'ভিডিও টিউটোরিয়াল'
    ],
    popular: true
  },
  {
    name: 'এন্টারপ্রাইজ',
    nameEn: 'Enterprise',
    price: '৯৯৯',
    originalPrice: '১৯৯৯',
    features: [
      '১১৫+ টুল অ্যাক্সেস',
      'সকল ৬ প্ল্যাটফর্ম সাপোর্ট',
      '২৪/৭ প্রায়োরিটি সাপোর্ট',
      'লাইফটাইম ফ্রি আপডেট',
      'আনলিমিটেড ডিভাইস',
      'কাস্টম স্ক্রিপ্ট সাপোর্ট',
      'অন-সাইট ইন্সটলেশন',
      'ট্রেনিং সেশন'
    ],
    popular: false
  }
]

// ============ FEATURES DATA ============
const FEATURES = [
  {
    icon: Zap,
    title: 'এক ক্লিকে অপ্টিমাইজেশন',
    description: 'মাত্র এক ক্লিকে আপনার সিস্টেম অপ্টিমাইজ করুন। কোনো টেকনিক্যাল জ্ঞানের প্রয়োজন নেই।'
  },
  {
    icon: Shield,
    title: '১০০% নিরাপদ ও সিকিউর',
    description: 'সকল টুল টেস্টেড ও ভেরিফাইড। কোনো ম্যালওয়্যার নেই, কোনো ব্লোটওয়্যার নেই।'
  },
  {
    icon: Monitor,
    title: '১১৫+ প্রফেশনাল টুল',
    description: 'Windows, macOS, Linux, Android, iOS ও Cross-platform এর জন্য সম্পূর্ণ টুলকিট।'
  },
  {
    icon: Clock,
    title: 'রেগুলার আপডেট',
    description: 'প্রতি মাসে নতুন টুল ও ফিচার সহ কন্টিনিউয়াস আপডেট।'
  },
  {
    icon: Users,
    title: 'এক্সপার্ট সাপোর্ট',
    description: '২৪/৭ সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।'
  },
  {
    icon: Award,
    title: '৫০০০+ ইউজার বিশ্বস্ত',
    description: 'বিশ্বজুড়ে হাজার হাজার সন্তুষ্ট কাস্টমারের সাথে যুক্ত হন।'
  }
]

// ============ PLATFORM STATS ============
const PLATFORM_STATS = [
  { name: 'Windows', icon: Monitor, count: 41, color: 'from-blue-500 to-cyan-500' },
  { name: 'macOS', icon: Laptop, count: 15, color: 'from-gray-600 to-gray-800' },
  { name: 'Linux', icon: Terminal, count: 15, color: 'from-orange-500 to-yellow-500' },
  { name: 'Android', icon: Smartphone, count: 13, color: 'from-green-500 to-emerald-500' },
  { name: 'iOS', icon: Tablet, count: 11, color: 'from-purple-500 to-pink-500' },
  { name: 'Cross Platform', icon: Globe, count: 20, color: 'from-indigo-500 to-purple-500' }
]

// ============ TESTIMONIALS ============
const TESTIMONIALS = [
  {
    name: 'রাকিবুল হাসান',
    location: 'ঢাকা',
    rating: 5,
    text: 'এত সুন্দর সফটওয়্যার! আমার PC গত ২ বছর ধরে স্লো ছিল, ১ ঘন্টায় সম্পূর্ণ ঠিক হয়ে গেল!'
  },
  {
    name: 'ফাতেমা আক্তার',
    location: 'চট্টগ্রাম',
    rating: 5,
    text: 'Windows activate করতে অনেক ঘুরেছি। এই টুল দিয়ে ৫ মিনিটে হয়ে গেল। ধন্যবাদ!'
  },
  {
    name: 'মেহেদী হাসান',
    location: 'যশোর',
    rating: 5,
    text: 'Professional version কিনেছি। Support টিম খুবই হেল্পফুল। Highly recommended!'
  }
]

// ============ FAQ DATA ============
const FAQ_DATA = [
  {
    question: 'System Toolkit কী?',
    answer: 'System Toolkit হল একটি সম্পূর্ণ PC মেইনটেন্যান্স ও অপ্টিমাইজেশন সফটওয়্যার। এতে ১১৫+ প্রফেশনাল টুল আছে যা Windows, macOS, Linux, Android, iOS এবং Cross-platform সাপোর্ট করে।'
  },
  {
    question: 'কিভাবে কিনব?',
    answer: '"অর্ডার করুন" বাটনে ক্লিক করে আপনার পছন্দের প্ল্যান সিলেক্ট করুন। তারপর আমাদের Facebook Page বা WhatsApp এ যোগাযোগ করুন।'
  },
  {
    question: 'পেমেন্ট করার পর কি করব?',
    answer: 'পেমেন্ট করার পর স্ক্রিনশট আমাদের Facebook Page বা WhatsApp এ পাঠান। আমরা ১ ঘন্টার মধ্যে সফটওয়্যার ডাউনলোড লিংক পাঠাব।'
  },
  {
    question: 'রিফান্ড পলিসি কি?',
    answer: 'সফটওয়্যার ডেমো ভার্সন দেখে কিনুন। ক্রয়ের ২৪ ঘন্টার মধ্যে কোনো সমস্যা হলে ফুল রিফান্ড পাবেন।'
  },
  {
    question: 'আপডেট কিভাবে পাব?',
    answer: 'Professional ও Enterprise প্ল্যানে ফ্রি আপডেট পাবেন। নতুন টুল যোগ হলে আপনাকে ইমেইল করে জানানো হবে।'
  },
  {
    question: 'সাপোর্ট কিভাবে পাব?',
    answer: 'Facebook Page, WhatsApp অথবা ইমেইলের মাধ্যমে যেকোনো সময় সাপোর্ট পাবেন। Enterprise প্ল্যানে ২৪/৭ ফোন সাপোর্ট পাবেন।'
  }
]

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// ============ MAIN COMPONENT ============
export default function LandingPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [showExitPopup, setShowExitPopup] = useState(false)
  const exitPopupShownRef = useRef(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    plan: ''
  })

  // Countdown Timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const diff = Math.max(0, end.getTime() - now.getTime())
      
      setCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  // Exit Intent Popup
  useEffect(() => {
    const handleMouseOut = (e: MouseEvent) => {
      if (exitPopupShownRef.current) return
      if (e.clientY < 10) {
        setShowExitPopup(true)
        exitPopupShownRef.current = true
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseout', handleMouseOut)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [])

  // Facebook Pixel Track
  useEffect(() => {
    // Track PageView on mount
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'PageView')
    }
  }, [])

  // Navigate to dashboard
  const goToDashboard = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  // Handle order click
  const handleOrderClick = (plan: typeof PRICING_PLANS[0]) => {
    setSelectedPlan(plan)
    setCustomerInfo(prev => ({ ...prev, plan: plan.name }))
    setShowOrderModal(true)
    
    // Track InitiateCheckout
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'InitiateCheckout', {
        content_name: plan.nameEn,
        value: parseInt(plan.price),
        currency: 'BDT'
      })
    }
  }

  // Handle form submit
  const handleOrderSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone) {
      alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন')
      return
    }

    // Track Lead
    if (typeof window !== 'undefined' && (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq) {
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq('track', 'Lead')
    }

    // Open WhatsApp with order details
    const message = encodeURIComponent(
      `নতুন অর্ডার:\n\nপ্ল্যান: ${selectedPlan?.name}\nনাম: ${customerInfo.name}\nফোন: ${customerInfo.phone}\nইমেইল: ${customerInfo.email || 'N/A'}`
    )
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${message}`, '_blank')

    setShowThankYou(true)
    setTimeout(() => {
      setShowOrderModal(false)
      setShowThankYou(false)
      setCustomerInfo({ name: '', phone: '', email: '', plan: '' })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-gray-800">
      {/* Facebook Pixel */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '918051034554872');
            fbq('track', 'PageView');
          `
        }}
      />

      {/* Top Bar */}
      <div className="bg-[#1e272e] text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {BUSINESS_INFO.phone}
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {BUSINESS_INFO.email}
            </span>
          </div>
          <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
            <Facebook className="w-4 h-4" />
            NextGen Digital Studio
          </a>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Terminal className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">System Toolkit</h1>
              <p className="text-xs text-gray-500">by {BUSINESS_INFO.company}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">ফিচারসমূহ</a>
            <a href="#platforms" className="text-gray-600 hover:text-blue-600 transition-colors">প্ল্যাটফর্ম</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">মূল্য</a>
            <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">রিভিউ</a>
            <a href="#faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
            <Button onClick={goToDashboard} className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Play className="w-4 h-4" />
              অ্যাপ খুলুন
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-50 border-t"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">ফিচারসমূহ</a>
                <a href="#platforms" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">প্ল্যাটফর্ম</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">মূল্য</a>
                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">রিভিউ</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600">FAQ</a>
                <Button onClick={() => { setMobileMenuOpen(false); goToDashboard(); }} className="w-full gap-2">
                  <Play className="w-4 h-4" />
                  অ্যাপ খুলুন
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Countdown Timer */}
      <div className="bg-[#2c3e50] text-yellow-400 py-3 text-center font-bold text-lg">
        ⏰ অফার শেষ আজ রাত ১২টায়! সময় বাকি: {countdown.hours}ঘ {countdown.minutes}মি {countdown.seconds}সেকেন্ড
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>১১৫+ প্রফেশনাল টুল এক প্যাকেজে</span>
            <Badge className="bg-green-500 text-white">NEW</Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
          >
            আপনার সম্পূর্ণ সিস্টেম টুলকিট
            <br />
            <span className="text-yellow-400">সকল প্ল্যাটফর্মের জন্য</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto"
          >
            আপনার PC, Mac, Linux, Android ও iOS ডিভাইস অপ্টিমাইজ, ক্লিন, রিপেয়ার ও সিকিউর করুন।
            এক টুলকিট, অসীম সম্ভাবনা। ৫০০০+ ইউজার বিশ্বস্ত।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-bold rounded-full shadow-lg"
            >
              অর্ডার করুন - ৫০% ছাড়
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              onClick={goToDashboard}
              variant="outline"
              className="px-8 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white/10"
            >
              <Play className="mr-2 w-5 h-5" />
              ডেমো দেখুন
            </Button>
          </motion.div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span>১০০% নিরাপদ</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              <span>ইনস্ট্যান্ট ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>লাইফটাইম আপডেট</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-400" />
              <span>৫০০০+ ইউজার</span>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <div className="bg-red-600 text-white py-4 text-center font-bold text-xl">
        🔥 সীমিত সময়ের অফার! ৫০% ছাড় - আজই অর্ডার করুন!
      </div>

      {/* Platform Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLATFORM_STATS.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-gray-50 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-3`}>
                  <platform.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{platform.name}</h3>
                <p className={`text-2xl font-bold bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>{platform.count}+</p>
                <p className="text-xs text-gray-500">টুল</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-blue-100 text-blue-700">ফিচারসমূহ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              কেন System Toolkit বেছে নেবেন?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              আপনার ডিভাইস সর্বোচ্চ পারফরম্যান্সে রাখতে যা যা দরকার
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-purple-100 text-purple-700">প্ল্যাটফর্ম</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              প্রতিটি প্ল্যাটফর্মের জন্য টুল
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Windows থেকে iOS পর্যন্ত, প্রতিটি প্ল্যাটফর্মের জন্য বিশেষায়িত টুল রয়েছে
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLATFORM_STATS.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                    <platform.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{platform.name}</h3>
                    <p className="text-gray-500">{platform.count}+ টুল</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(platform.count / 45) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${platform.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-red-100 text-red-700">৫০% ছাড় - সীমিত সময়</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              সহজ, স্বচ্ছ মূল্য
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              আপনার প্রয়োজন অনুযায়ী প্ল্যান বেছে নিন। সকল প্ল্যানে মূল ফিচার অন্তর্ভুক্ত।
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'} bg-white overflow-hidden`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    সবচেয়ে জনপ্রিয়
                  </div>
                )}
                <div className={`p-6 ${plan.popular ? 'pt-8' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-blue-600">৳{plan.price}</span>
                    <span className="text-lg line-through text-gray-400">৳{plan.originalPrice}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
                    onClick={() => handleOrderClick(plan)}
                  >
                    অর্ডার করুন
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-green-100 text-green-700">রিভিউ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              কাস্টমাররা যা বলছেন
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              System Toolkit এ বিশ্বস্ত হাজার হাজার কাস্টমারের সাথে যুক্ত হন
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 border shadow-sm"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-orange-100 text-orange-700">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              সাধারণ প্রশ্নাবলী
            </h2>
            <p className="text-gray-600">
              প্রশ্ন আছে? উত্তর দিয়ে দিচ্ছি।
            </p>
          </motion.div>

          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl overflow-hidden bg-white border shadow-sm"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFaqIndex === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-4 text-gray-600 whitespace-pre-line">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-10 md:p-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              আপনার সিস্টেম অপ্টিমাইজ করতে প্রস্তুত?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              সকল ডিভাইসের জন্য ১১৫+ প্রফেশনাল টুল এখনই পান।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-6 text-lg font-bold rounded-full"
              >
                এখনই শুরু করুন
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                onClick={goToDashboard}
                variant="outline"
                className="px-8 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white/10"
              >
                <Play className="mr-2 w-5 h-5" />
                ডেমো দেখুন
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1e272e] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">যোগাযোগ</h3>
              <p className="flex items-center gap-2 mb-2"><Phone className="w-4 h-4" /> {BUSINESS_INFO.phone}</p>
              <p className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4" /> {BUSINESS_INFO.email}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {BUSINESS_INFO.address}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">ফেসবুক</h3>
              <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                <Facebook className="w-5 h-5" />
                NextGen Digital Studio
              </a>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">সাপোর্ট</h3>
              <p className="flex items-center gap-2"><HeadphonesIcon className="w-4 h-4" /> ২৪/৭ অনলাইন সাপোর্ট</p>
              <p className="flex items-center gap-2"><Lock className="w-4 h-4" /> নিরাপদ লেনদেন</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f1519] text-gray-400 py-6 px-4 text-center">
        <p>© {new Date().getFullYear()} Copyright & Developed by{' '}
          <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {BUSINESS_INFO.company}
          </a>
        </p>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('হ্যালো, আমি System Toolkit এ ইন্টারেস্টেড আছি')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-40"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>

      {/* Sticky Order Button */}
      <div
        onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
        className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center py-4 font-bold text-lg cursor-pointer shadow-lg z-40 md:hidden"
      >
        🟢 অর্ডার করুন - ৫০% ছাড়
      </div>

      {/* Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>অর্ডার সম্পূর্ণ করুন</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span className="font-medium text-blue-600">
                  {selectedPlan.name} প্ল্যান - ৳{selectedPlan.price}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {!showThankYou ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-sm text-gray-700">
                  <strong>অর্ডার করতে:</strong> আপনার তথ্য দিন এবং WhatsApp এ পাঠান। আমরা ১ ঘন্টার মধ্যে যোগাযোগ করব।
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="আপনার নাম *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="bg-gray-50"
                />
                <Input
                  placeholder="ফোন নম্বর *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="bg-gray-50"
                />
                <Input
                  placeholder="ইমেইল (ঐচ্ছিক)"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="bg-gray-50"
                />
              </div>

              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleOrderSubmit}>
                WhatsApp এ পাঠান
                <MessageCircle className="ml-2 w-4 h-4" />
              </Button>

              <p className="text-xs text-center text-gray-500">
                অথবা সরাসরি কল করুন: {BUSINESS_INFO.phone}
              </p>
            </div>
          ) : (
            <div className="py-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500 flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">ধন্যবাদ!</h3>
              <p className="text-gray-600">
                আপনার অর্ডার গৃহীত হয়েছে। শীঘ্রই যোগাযোগ করা হবে।
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exit Intent Popup */}
      <AnimatePresence>
        {showExitPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExitPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-2 text-red-600">🎁 অপেক্ষা করুন!</h3>
              <p className="text-gray-600 mb-4">বিশেষ অফার পেতে এখনই অর্ডার করুন!</p>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 mb-3"
                onClick={() => {
                  setShowExitPopup(false)
                  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                অফার দেখুন
              </Button>
              <button
                onClick={() => setShowExitPopup(false)}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                না, ধন্যবাদ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
