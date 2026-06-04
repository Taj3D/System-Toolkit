'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Monitor, Laptop, Smartphone, Tablet, Globe, Terminal,
  Zap, Shield, Star, Check, ArrowRight, Play, Clock,
  Users, Download, Award, Heart, ChevronDown, ChevronUp,
  Menu, X, Moon, Sun, ExternalLink, Copy, CheckCircle2,
  Phone, Mail, MapPin, Facebook, MessageCircle
} from 'lucide-react'
import Link from 'next/link'

// ============ BUSINESS INFO ============
const BUSINESS_INFO = {
  company: 'NextGen Digital Studio',
  facebook: 'https://www.facebook.com/nextgendigitalstudio',
  founder: 'Md. Najmul Islam Taj',
  address: 'NewMarket, Jessore Sadar Bangladesh',
  email: 'conceptbd.net@gmail.com',
  phone: '+880 1711-731354',
  bkashNumber: '01711731354',
  nagadNumber: '01711731354'
}

// ============ PRICING PLANS ============
const PRICING_PLANS = [
  {
    name: 'Basic',
    price: '299',
    originalPrice: '599',
    features: [
      'All 115+ Tools Access',
      'Windows Platform Support',
      'Basic Email Support',
      '3 Months Updates',
      'Single Device License'
    ],
    popular: false
  },
  {
    name: 'Professional',
    price: '499',
    originalPrice: '999',
    features: [
      'All 115+ Tools Access',
      'All 6 Platforms Support',
      'Priority Email Support',
      '1 Year Free Updates',
      '3 Device License',
      'Script Execution Guide',
      'Video Tutorials'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '999',
    originalPrice: '1999',
    features: [
      'All 115+ Tools Access',
      'All 6 Platforms Support',
      '24/7 Priority Support',
      'Lifetime Free Updates',
      'Unlimited Devices',
      'Custom Script Support',
      'On-site Installation',
      'Training Session'
    ],
    popular: false
  }
]

// ============ FEATURES DATA ============
const FEATURES = [
  {
    icon: Zap,
    title: 'One-Click Optimization',
    description: 'Optimize your system with a single click. No technical knowledge required.'
  },
  {
    icon: Shield,
    title: '100% Safe & Secure',
    description: 'All tools are tested and verified. No malware, no bloatware, no hidden fees.'
  },
  {
    icon: Monitor,
    title: '115+ Professional Tools',
    description: 'Complete toolkit for Windows, macOS, Linux, Android, iOS & Cross-platform.'
  },
  {
    icon: Clock,
    title: 'Regular Updates',
    description: 'Continuous updates with new tools and features every month.'
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: 'Dedicated support team ready to help you 24/7.'
  },
  {
    icon: Award,
    title: 'Trusted by 5000+ Users',
    description: 'Join thousands of satisfied customers worldwide.'
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
    name: 'Rakibul Hassan',
    location: 'Dhaka',
    rating: 5,
    text: 'এত সুন্দর সফটওয়্যার! আমার PC গত ২ বছর ধরে স্লো ছিল, ১ ঘন্টায় সম্পূর্ণ ঠিক হয়ে গেল!',
    image: '/testimonial1.jpg'
  },
  {
    name: 'Fatima Akter',
    location: 'Chittagong',
    rating: 5,
    text: 'Windows activate করতে অনেক ঘুরেছি। এই টুল দিয়ে ৫ মিনিটে হয়ে গেল। ধন্যবাদ!',
    image: '/testimonial2.jpg'
  },
  {
    name: 'Mehedi Hasan',
    location: 'Jessore',
    rating: 5,
    text: 'Professional version কিনেছি। Support টিম খুবই হেল্পফুল। Highly recommended!',
    image: '/testimonial3.jpg'
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
    answer: 'আপনি Bkash অথবা Nagad দিয়ে পেমেন্ট করতে পারবেন। "Order Now" বাটনে ক্লিক করে আপনার পছন্দের প্ল্যান সিলেক্ট করুন, তারপর পেমেন্ট করুন। পেমেন্ট সম্পন্ন হলে সফটওয়্যার পেয়ে যাবেন।'
  },
  {
    question: 'পেমেন্ট করার পর কি করব?',
    answer: 'পেমেন্ট করার পর স্ক্রিনশট আমাদের Facebook Page বা WhatsApp এ পাঠান। আমরা ১ ঘন্টার মধ্যে সফটওয়্যার ডাউনলোড লিংক পাঠাব।'
  },
  {
    question: 'কি কি পেমেন্ট মেথড আছে?',
    answer: `Bkash: ${BUSINESS_INFO.bkashNumber}\nNagad: ${BUSINESS_INFO.nagadNumber}\nBank Transfer (জন্য যোগাযোগ করুন)`
  },
  {
    question: 'রিফান্ড পলিসি কি?',
    answer: 'সফটওয়্যার ডেমো ভার্সন দেখে কিনুন। ক্রয়ের ২৪ ঘন্টার মধ্যে কোনো সমস্যা হলে ফুল রিফান্ড পাবেন।'
  },
  {
    question: 'আপডেট কিভাবে পাব?',
    answer: 'Professional ও Enterprise প্ল্যানে ফ্রি আপডেট পাবেন। নতুন টুল যোগ হলে আপনাকে ইমেইল করে জানানো হবে।'
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
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<typeof PRICING_PLANS[0] | null>(null)
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [showThankYou, setShowThankYou] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    plan: '',
    transactionId: ''
  })

  // Copy phone number to clipboard
  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedNumber(id)
      setTimeout(() => setCopiedNumber(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Handle order submission
  const handleOrderSubmit = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.transactionId) {
      alert('Please fill in all required fields')
      return
    }
    setShowThankYou(true)
    setTimeout(() => {
      setShowOrderModal(false)
      setShowThankYou(false)
      setCustomerInfo({ name: '', phone: '', email: '', plan: '', transactionId: '' })
    }, 3000)
  }

  // Open order modal with selected plan
  const openOrderModal = (plan: typeof PRICING_PLANS[0]) => {
    setSelectedPlan(plan)
    setCustomerInfo(prev => ({ ...prev, plan: plan.name }))
    setShowOrderModal(true)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-gray-950/90' : 'bg-white/90'} backdrop-blur-md border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">System Toolkit</h1>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>by NextGen Digital Studio</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
              <a href="#platforms" className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Platforms</a>
              <a href="#pricing" className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
              <a href="#testimonials" className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</a>
              <a href="#faq" className={`hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>FAQ</a>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2">
                  <Play className="w-4 h-4" />
                  Launch App
                </Button>
              </Link>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
            >
              <div className="px-4 py-4 space-y-4">
                <a href="#features" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</a>
                <a href="#platforms" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Platforms</a>
                <a href="#pricing" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</a>
                <a href="#testimonials" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Reviews</a>
                <a href="#faq" className={`block py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>FAQ</a>
                <Link href="/dashboard" className="block">
                  <Button className="w-full gap-2">
                    <Play className="w-4 h-4" />
                    Launch App
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-8"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">115+ Professional Tools in One Package</span>
              <Badge className="bg-green-500 text-white text-xs">NEW</Badge>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Your Complete{' '}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                System Toolkit
              </span>
              <br />
              for All Platforms
            </h1>

            {/* Subheadline */}
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Optimize, Clean, Repair & Secure your PC, Mac, Linux, Android & iOS devices.
              One toolkit, unlimited possibilities. Trusted by 5000+ users worldwide.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Order Now - 50% OFF
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-xl"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Try Demo
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>100% Safe & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Lifetime Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>5000+ Users</span>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className={`rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className={`h-8 flex items-center gap-2 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="p-4 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {PLATFORM_STATS.map((platform, index) => (
                    <motion.div
                      key={platform.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg text-center`}
                    >
                      <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center mb-3`}>
                        <platform.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">{platform.name}</h3>
                      <p className={`text-2xl font-bold mt-1 bg-gradient-to-r ${platform.color} bg-clip-text text-transparent`}>{platform.count}+</p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tools</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose System Toolkit?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to keep your devices running at peak performance
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border shadow-lg`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platforms Section */}
      <section id="platforms" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Platforms</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tools for Every Platform
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              From Windows to iOS, we have got you covered with specialized tools for each platform
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
                whileHover={{ scale: 1.02 }}
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                    <platform.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{platform.name}</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{platform.count}+ Tools</p>
                  </div>
                </div>
                <div className={`h-2 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} overflow-hidden`}>
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
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-red-500 text-white">50% OFF - Limited Time</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose the plan that fits your needs. All plans include core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl ${plan.popular ? 'ring-2 ring-blue-500' : ''} ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} shadow-xl overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`p-6 ${plan.popular ? 'pt-10' : ''}`}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold">৳{plan.price}</span>
                    <span className={`text-lg line-through ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>৳{plan.originalPrice}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => openOrderModal(plan)}
                  >
                    Order Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Payment Methods:</p>
            <div className="flex justify-center gap-4">
              <div className={`px-6 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center gap-3`}>
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-xs font-bold">bK</div>
                <span className="font-medium">Bkash</span>
              </div>
              <div className={`px-6 py-3 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center gap-3`}>
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">N</div>
                <span className="font-medium">Nagad</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join thousands of satisfied customers who trust System Toolkit
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
                className={`p-6 rounded-2xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} shadow-lg`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4" variant="outline">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Got questions? We have got answers.
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
                className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className={`w-full px-6 py-4 flex justify-between items-center text-left ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
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
                      <p className={`px-6 pb-4 whitespace-pre-line ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Optimize Your System?
            </h2>
            <p className="text-xl mb-8 text-white/80">
              Get instant access to 115+ professional tools for all your devices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-transparent border-white text-white hover:bg-white/10"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">System Toolkit</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>by {BUSINESS_INFO.company}</p>
                </div>
              </div>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Complete system optimization toolkit with 115+ professional tools for Windows, macOS, Linux, Android, iOS & Cross-platform.
              </p>
              <div className="flex gap-4">
                <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href={`mailto:${BUSINESS_INFO.email}`} className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#features" className="hover:text-blue-500 transition-colors">Features</a></li>
                <li><a href="#platforms" className="hover:text-blue-500 transition-colors">Platforms</a></li>
                <li><a href="#pricing" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-blue-500 transition-colors">Reviews</a></li>
                <li><a href="#faq" className="hover:text-blue-500 transition-colors">FAQ</a></li>
                <li><Link href="/dashboard" className="hover:text-blue-500 transition-colors">Launch App</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <ul className={`space-y-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{BUSINESS_INFO.phone}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{BUSINESS_INFO.email}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{BUSINESS_INFO.address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Numbers */}
          <div className={`py-6 px-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} mb-8`}>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm font-bold">bK</div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bkash</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{BUSINESS_INFO.bkashNumber}</span>
                    <button onClick={() => copyToClipboard(BUSINESS_INFO.bkashNumber, 'bkash')} className="p-1">
                      {copiedNumber === 'bkash' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold">N</div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nagad</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{BUSINESS_INFO.nagadNumber}</span>
                    <button onClick={() => copyToClipboard(BUSINESS_INFO.nagadNumber, 'nagad')} className="p-1">
                      {copiedNumber === 'nagad' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className={`pt-8 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-200'} text-center`}>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              © {new Date().getFullYear()} Copyright & Developed by{' '}
              <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {BUSINESS_INFO.company}
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Order Modal */}
      <Dialog open={showOrderModal} onOpenChange={setShowOrderModal}>
        <DialogContent className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'} max-w-md`}>
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  {selectedPlan.name} Plan - ৳{selectedPlan.price}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {!showThankYou ? (
            <div className="space-y-4">
              {/* Payment Info */}
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <p className="text-sm mb-2">Send payment to:</p>
                <div className="flex gap-4">
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bkash</p>
                    <p className="font-bold">{BUSINESS_INFO.bkashNumber}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nagad</p>
                    <p className="font-bold">{BUSINESS_INFO.nagadNumber}</p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3">
                <Input
                  placeholder="Your Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
                />
                <Input
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
                />
                <Input
                  placeholder="Email (Optional)"
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
                />
                <Input
                  placeholder="Transaction ID *"
                  value={customerInfo.transactionId}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, transactionId: e.target.value })}
                  className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}
                />
              </div>

              <Button className="w-full" onClick={handleOrderSubmit}>
                Submit Order
              </Button>

              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                You can also send screenshot to our Facebook page or WhatsApp
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
              <h3 className="text-xl font-bold mb-2">Thank You!</h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Your order has been received. We will contact you shortly.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating WhatsApp Button */}
      <a
        href={`https://wa.me/${BUSINESS_INFO.phone.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in System Toolkit`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors z-40"
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </a>
    </div>
  )
}
