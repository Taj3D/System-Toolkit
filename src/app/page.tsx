'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Monitor, Laptop, Smartphone, Tablet, Globe, Terminal,
  Zap, Shield, Star, Check, ArrowRight, Play,
  Users, ChevronDown, ChevronUp, Phone, Mail, MapPin,
  Facebook, MessageCircle, Lock, Truck, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

// ============ BUSINESS INFO ============
const BUSINESS_INFO = {
  company: 'NextGen Digital Studio',
  facebook: 'https://www.facebook.com/nextgendigitalstudio',
  phone: '+880 1711-731354',
  whatsappNumber: '8801711731354',
  email: 'conceptbd.net@gmail.com',
  address: 'NewMarket, Jessore Sadar'
}

// ============ PRICING PLANS ============
const PRICING_PLANS = [
  {
    name: 'বেসিক',
    price: '২৯৯',
    originalPrice: '৫৯৯',
    features: ['১১৫+ টুল অ্যাক্সেস', 'Windows সাপোর্ট', '৩ মাস আপডেট'],
    popular: false
  },
  {
    name: 'প্রফেশনাল',
    price: '৪৯৯',
    originalPrice: '৯৯৯',
    features: ['১১৫+ টুল অ্যাক্সেস', 'সকল প্ল্যাটফর্ম', '১ বছর আপডেট', 'ভিডিও টিউটোরিয়াল'],
    popular: true
  },
  {
    name: 'এন্টারপ্রাইজ',
    price: '৯৯৯',
    originalPrice: '১৯৯৯',
    features: ['সব ফিচার', 'লাইফটাইম আপডেট', 'আনলিমিটেড ডিভাইস', '২৪/৭ সাপোর্ট'],
    popular: false
  }
]

// ============ PLATFORM STATS ============
const PLATFORM_STATS = [
  { name: 'Windows', icon: Monitor, count: 41 },
  { name: 'macOS', icon: Laptop, count: 15 },
  { name: 'Linux', icon: Terminal, count: 15 },
  { name: 'Android', icon: Smartphone, count: 13 },
  { name: 'iOS', icon: Tablet, count: 11 },
  { name: 'Cross', icon: Globe, count: 20 }
]

// ============ TESTIMONIALS ============
const TESTIMONIALS = [
  { name: 'রাকিবুল হাসান', location: 'ঢাকা', text: 'আমার PC ২ বছর স্লো ছিল, ১ ঘন্টায় ঠিক হয়ে গেল!' },
  { name: 'ফাতেমা আক্তার', location: 'চট্টগ্রাম', text: 'Windows activate ৫ মিনিটে হয়ে গেল। ধন্যবাদ!' },
  { name: 'মেহেদী হাসান', location: 'যশোর', text: 'Support টিম খুবই হেল্পফুল। Highly recommended!' }
]

// ============ FAQ DATA ============
const FAQ_DATA = [
  { q: 'System Toolkit কী?', a: 'এটি একটি সম্পূর্ণ PC মেইনটেন্যান্স সফটওয়্যার। ১১৫+ টুল Windows, Mac, Linux, Android, iOS এ কাজ করে।' },
  { q: 'কিভাবে কিনব?', a: '"অর্ডার করুন" বাটনে ক্লিক করে WhatsApp এ যোগাযোগ করুন।' },
  { q: 'পেমেন্ট পর কি করব?', a: 'স্ক্রিনশট WhatsApp এ পাঠান। ১ ঘন্টায় সফটওয়্যার পাবেন।' }
]

// ============ MAIN COMPONENT ============
export default function LandingPage() {
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showPopup, setShowPopup] = useState(false)

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const diff = Math.max(0, end.getTime() - now.getTime())
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Exit Popup
  useEffect(() => {
    let shown = false
    const handler = (e: MouseEvent) => {
      if (!shown && e.clientY < 10) {
        setShowPopup(true)
        shown = true
      }
    }
    setTimeout(() => document.addEventListener('mouseout', handler), 5000)
    return () => document.removeEventListener('mouseout', handler)
  }, [])

  // WhatsApp Order
  const orderViaWhatsApp = (plan: string) => {
    const msg = encodeURIComponent(`হ্যালো, আমি ${plan} প্ল্যান অর্ডার করতে চাই।`)
    window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${msg}`, '_blank')
  }

  return (
    <>
      {/* Facebook Pixels - Both IDs */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '918051034554872');
            fbq('init', '1317407319827782');
            fbq('track', 'PageView');
          `
        }}
      />

      <div className="min-h-screen bg-[#fdfaf5]" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        {/* Top Bar */}
        <div className="bg-[#1e272e] text-white py-2 text-sm">
          <div className="max-w-6xl mx-auto px-4 flex justify-between items-center flex-wrap gap-2">
            <span className="flex items-center gap-2"><Phone className="w-4 h-4" />{BUSINESS_INFO.phone}</span>
            <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-yellow-400">
              <Facebook className="w-4 h-4" /> NextGen Digital Studio
            </a>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">System Toolkit</h1>
                <p className="text-xs text-gray-500">by {BUSINESS_INFO.company}</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Play className="w-4 h-4" /> অ্যাপ খুলুন
              </Button>
            </Link>
          </div>
        </header>

        {/* Countdown */}
        <div className="bg-[#2c3e50] text-yellow-400 py-3 text-center font-bold">
          ⏰ অফার শেষ আজ রাত ১২টায়! সময় বাকি: {countdown.h}ঘ {countdown.m}মি {countdown.s}সেকেন্ড
        </div>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>১১৫+ প্রফেশনাল টুল এক প্যাকেজে</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              আপনার সম্পূর্ণ সিস্টেম টুলকিট
              <br /><span className="text-yellow-400">সকল প্ল্যাটফর্মের জন্য</span>
            </h1>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              PC, Mac, Linux, Android ও iOS ডিভাইস অপ্টিমাইজ, ক্লিন, রিপেয়ার ও সিকিউর করুন। ৫০০০+ ইউজার বিশ্বস্ত।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-5 font-bold rounded-full"
              >
                অর্ডার করুন - ৫০% ছাড় <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-6 py-5 rounded-full border-2 border-white text-white hover:bg-white/10">
                  <Play className="mr-2 w-5 h-5" /> ডেমো দেখুন
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-400" /> ১০০% নিরাপদ</span>
              <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-blue-400" /> ইনস্ট্যান্ট ডেলিভারি</span>
              <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-purple-400" /> লাইফটাইম আপডেট</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4 text-pink-400" /> ৫০০০+ ইউজার</span>
            </div>
          </div>
        </section>

        {/* Offer Banner */}
        <div className="bg-red-600 text-white py-3 text-center font-bold text-lg">
          🔥 সীমিত সময়ের অফার! ৫০% ছাড় - আজই অর্ডার করুন!
        </div>

        {/* Platform Stats */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {PLATFORM_STATS.map((p, i) => (
                <div key={i} className="p-3 rounded-xl bg-gray-50 text-center">
                  <p.icon className="w-8 h-8 mx-auto text-blue-600" />
                  <p className="font-bold text-lg">{p.count}+</p>
                  <p className="text-xs text-gray-500">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">কেন System Toolkit?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: 'এক ক্লিক অপ্টিমাইজ' },
                { icon: Shield, title: '১০০% নিরাপদ' },
                { icon: Monitor, title: '১১৫+ টুল' },
                { icon: Lock, title: 'লাইফটাইম আপডেট' },
                { icon: Users, title: 'এক্সপার্ট সাপোর্ট' },
                { icon: Star, title: '৫০০০+ ইউজার' }
              ].map((f, i) => (
                <div key={i} className="p-4 rounded-xl bg-white shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium">{f.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-10 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-red-100 text-red-700 font-medium mb-2">৫০% ছাড়</span>
              <h2 className="text-2xl font-bold">মূল্য তালিকা</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PRICING_PLANS.map((plan, i) => (
                <div key={i} className={`rounded-2xl p-5 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'} bg-white`}>
                  {plan.popular && <div className="text-center text-sm font-medium text-blue-600 mb-2">⭐ সবচেয়ে জনপ্রিয়</div>}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 my-3">
                    <span className="text-3xl font-bold text-blue-600">৳{plan.price}</span>
                    <span className="line-through text-gray-400">৳{plan.originalPrice}</span>
                  </div>
                  <ul className="space-y-2 mb-4 text-sm">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />{f}</li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-800'}`}
                    onClick={() => orderViaWhatsApp(plan.name)}
                  >
                    অর্ডার করুন
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-8 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">কাস্টমার রিভিউ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="p-4 rounded-xl bg-white shadow-sm">
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-500 fill-yellow-500" />)}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">"{t.text}"</p>
                  <p className="font-medium">{t.name} <span className="text-gray-500 font-normal">| {t.location}</span></p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 px-4 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">সাধারণ প্রশ্ন</h2>
            <div className="space-y-2">
              {FAQ_DATA.map((faq, i) => (
                <div key={i} className="rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-4 py-3 flex justify-between items-center text-left font-medium"
                  >
                    {faq.q}
                    {openFaq === i ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openFaq === i && <p className="px-4 pb-3 text-gray-600 text-sm">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 px-4">
          <div className="max-w-3xl mx-auto text-center rounded-2xl p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-2xl font-bold mb-3">আপনার সিস্টেম অপ্টিমাইজ করতে প্রস্তুত?</h2>
            <p className="mb-4 text-white/80">১১৫+ প্রফেশনাল টুল এখনই পান।</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-full"
              >
                এখনই শুরু করুন <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full border-2 border-white text-white hover:bg-white/10">
                  <Play className="mr-2 w-5 h-5" /> ডেমো দেখুন
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#1e272e] text-white py-8 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold mb-2">যোগাযোগ</h3>
              <p className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> {BUSINESS_INFO.phone}</p>
              <p className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> {BUSINESS_INFO.email}</p>
              <p className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4" /> {BUSINESS_INFO.address}</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">ফেসবুক</h3>
              <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-400 hover:underline">
                <Facebook className="w-4 h-4" /> NextGen Digital Studio
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-2">সাপোর্ট</h3>
              <p className="text-sm">২৪/৭ অনলাইন সাপোর্ট</p>
              <p className="text-sm">নিরাপদ লেনদেন</p>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm mt-6">
            © {new Date().getFullYear()} Copyright & Developed by{' '}
            <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {BUSINESS_INFO.company}
            </a>
          </div>
        </footer>

        {/* WhatsApp Float */}
        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('হ্যালো, আমি System Toolkit এ ইন্টারেস্টেড আছি')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 z-40"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>

        {/* Sticky Order Button (Mobile) */}
        <div
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-0 left-0 right-0 bg-red-600 text-white text-center py-3 font-bold cursor-pointer z-40 md:hidden"
        >
          🟢 অর্ডার করুন - ৫০% ছাড়
        </div>

        {/* Exit Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2 text-red-600">🎁 অপেক্ষা করুন!</h3>
                <p className="text-gray-600 mb-4">বিশেষ অফার পেতে এখনই অর্ডার করুন!</p>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 mb-2"
                  onClick={() => { setShowPopup(false); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }) }}
                >
                  অফার দেখুন
                </Button>
                <button onClick={() => setShowPopup(false)} className="text-gray-500 text-sm hover:underline">না, ধন্যবাদ</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
