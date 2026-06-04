'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap, Shield, Star, Check, ArrowRight, Play,
  Users, ChevronDown, ChevronUp, Phone, Mail, MapPin,
  Facebook, MessageCircle, Lock, CheckCircle2, Terminal,
  Monitor, Laptop, Smartphone, Gift, Clock, CreditCard
} from 'lucide-react'
import Link from 'next/link'

// ============ BUSINESS INFO ============
const BUSINESS_INFO = {
  company: 'NextGen Digital Studio',
  facebook: 'https://www.facebook.com/nextgendigitalstudio',
  phone: '+880 1711-731354',
  whatsappNumber: '8801711731354',
  email: 'conceptbd.net@gmail.com',
  address: 'NewMarket, Jessore Sadar',
  bkashNumber: '01711731354',
  nagadNumber: '01711731354'
}

// ============ PRICING PLANS ============
const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'বেসিক',
    price: 299,
    originalPrice: 599,
    features: ['১১৫+ টুল অ্যাক্সেস', 'Windows সাপোর্ট', '৩ মাস আপডেট'],
    popular: false
  },
  {
    id: 'professional',
    name: 'প্রফেশনাল',
    price: 499,
    originalPrice: 999,
    features: ['১১৫+ টুল অ্যাক্সেস', 'সকল প্ল্যাটফর্ম', '১ বছর আপডেট', 'ভিডিও টিউটোরিয়াল'],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'এন্টারপ্রাইজ',
    price: 999,
    originalPrice: 1999,
    features: ['সব ফিচার', 'লাইফটাইম আপডেট', 'আনলিমিটেড ডিভাইস', '২৪/৭ সাপোর্ট'],
    popular: false
  },
  {
    id: 'special',
    name: '🎁 স্পেশাল অফার',
    price: 199,
    originalPrice: 599,
    features: ['১১৫+ টুল অ্যাক্সেস', 'Windows সাপোর্ট', '৭ দিনের ট্রায়াল', 'ইমেইল সাপোর্ট'],
    popular: false
  }
]

// ============ MAIN COMPONENT ============
export default function LandingPage() {
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [orderStep, setOrderStep] = useState<'form' | 'payment' | 'success'>('form')
  
  // Form State
  const [formData, setFormData] = useState({ name: '', mobile: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Handle Form Submit
  const handleFormSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      alert('অনুগ্রহ করে নাম ও মোবাইল নম্বর দিন')
      return
    }
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          plan: selectedPlan,
          amount: PRICING_PLANS.find(p => p.id === selectedPlan)?.price || 0
        })
      })
      
      if (response.ok) {
        setOrderStep('payment')
      }
    } catch (error) {
      console.error('Order error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Payment Selection
  const handlePayment = async (method: 'bkash' | 'nagad') => {
    setIsSubmitting(true)
    
    try {
      // Send to WhatsApp
      const plan = PRICING_PLANS.find(p => p.id === selectedPlan)
      const paymentNumber = method === 'bkash' ? BUSINESS_INFO.bkashNumber : BUSINESS_INFO.nagadNumber
      const msg = encodeURIComponent(
        `🛒 *নতুন অর্ডার - System Toolkit*\n\n` +
        `📦 প্ল্যান: ${plan?.name}\n` +
        `💰 মূল্য: ৳${plan?.price}\n` +
        `👤 নাম: ${formData.name}\n` +
        `📱 মোবাইল: ${formData.mobile}\n` +
        `📧 ইমেইল: ${formData.email || 'N/A'}\n` +
        `💳 পেমেন্ট: ${method === 'bkash' ? 'বিকাশ' : 'নগদ'}\n\n` +
        `অর্ডার কনফার্ম করতে পেমেন্ট সম্পন্ন করুন।`
      )
      
      // Track Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          content_name: plan?.name,
          value: plan?.price,
          currency: 'BDT'
        })
      }
      
      // Open WhatsApp
      window.open(`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${msg}`, '_blank')
      
      setOrderStep('success')
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open Order Modal
  const openOrderModal = (planId: string) => {
    setSelectedPlan(planId)
    setOrderStep('form')
    setFormData({ name: '', mobile: '', email: '' })
    setShowOrderModal(true)
    
    // Track Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', { content_name: planId })
    }
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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        
        {/* ===== HEADER ===== */}
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">System Toolkit</h1>
                <p className="text-xs text-gray-500">by {BUSINESS_INFO.company}</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                <Play className="w-4 h-4" /> অ্যাপ খুলুন
              </Button>
            </Link>
          </div>
        </header>

        {/* ===== HERO SECTION ===== */}
        <section className="pt-24 pb-12 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6 border border-white/30"
            >
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="font-medium">১১৫+ প্রফেশনাল টুল এক প্যাকেজে</span>
            </motion.div>
            
            {/* Title - Bangla */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-2"
            >
              সিস্টেম টুলকিট
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-xl md:text-2xl text-yellow-400 font-medium mb-4"
            >
              সকল ডিভাইসের জন্য
            </motion.p>
            
            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/90 mb-6 max-w-2xl mx-auto"
            >
              PC, Mac, Linux, Android ও iOS ডিভাইস অপ্টিমাইজ, ক্লিন, রিপেয়ার ও সিকিউর করুন।
              <br /><strong className="text-yellow-400">৫০০০+</strong> ইউজার বিশ্বস্ত।
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-10 py-7 font-bold rounded-full shadow-xl text-xl"
              >
                🎁 এখনই অর্ডার করুন - ৫০% ছাড় <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
            
            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-green-400" /> ১০০% নিরাপদ</span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Clock className="w-4 h-4 text-blue-400" /> ইনস্ট্যান্ট ডেলিভারি</span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Shield className="w-4 h-4 text-purple-400" /> লাইফটাইম আপডেট</span>
              <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full"><Users className="w-4 h-4 text-pink-400" /> ৫০০০+ ইউজার</span>
            </motion.div>
          </div>
        </section>

        {/* ===== COUNTDOWN TIMER ===== */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 text-center">
          <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold">⏰ অফার শেষ আজ রাত ১২টায়!</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-xl">
              <span className="bg-white/20 px-3 py-1 rounded-lg">{countdown.h}ঘ</span>
              <span>:</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">{countdown.m}মি</span>
              <span>:</span>
              <span className="bg-white/20 px-3 py-1 rounded-lg">{countdown.s}সেকেন্ড</span>
            </div>
          </div>
        </div>

        {/* ===== PLATFORM STATS REMOVED ===== */}

        {/* ===== FEATURES ===== */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center mb-8"
            >
              কেন <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">System Toolkit?</span>
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: 'এক ক্লিক অপ্টিমাইজ', desc: 'সহজে সিস্টেম স্পিড বাড়ান' },
                { icon: Shield, title: '১০০% নিরাপদ', desc: 'কোন ভাইরাস বা ম্যালওয়্যার নেই' },
                { icon: Monitor, title: '১১৫+ টুল', desc: 'সব প্ল্যাটফর্মে কাজ করে' },
                { icon: Lock, title: 'লাইফটাইম আপডেট', desc: 'নতুন টুল পাবেন ফ্রিতে' },
                { icon: Users, title: 'এক্সপার্ট সাপোর্ট', desc: '২৪/৭ হেল্পলাইন' },
                { icon: Star, title: '৫০০০+ ইউজার', desc: 'বিশ্বস্ত কাস্টমার' }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg">
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PRICING ===== */}
        <section id="pricing" className="py-12 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <motion.span 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold mb-4"
              >
                🔥 ৫০% ছাড় - সীমিত সময়ের অফার!
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-bold"
              >
                মূল্য তালিকা
              </motion.h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_PLANS.map((plan, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative rounded-3xl p-6 ${plan.popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'shadow-lg'} bg-white border border-gray-100`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      ⭐ সবচেয়ে জনপ্রিয়
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">৳{plan.price}</span>
                    <span className="line-through text-gray-400 text-lg">৳{plan.originalPrice}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-gray-700">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full py-6 text-lg font-bold rounded-xl ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={() => openOrderModal(plan.id)}
                  >
                    অর্ডার করুন <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== INLINE ORDER FORM ===== */}
        <section id="order-form" className="py-12 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">এখনই অর্ডার করুন</h2>
                <p className="text-gray-500">পেমেন্ট অপশন দেখতে নিচের ফর্মটি পূরণ করুন</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Side - Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">আপনার নাম *</label>
                    <Input
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">মোবাইল নম্বর *</label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      type="tel"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">ইমেইল (ঐচ্ছিক)</label>
                    <Input
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="h-12 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">প্ল্যান নির্বাচন করুন *</label>
                    <select
                      value={selectedPlan || ''}
                      onChange={e => setSelectedPlan(e.target.value)}
                      className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:border-blue-500 focus:ring-blue-500 bg-white"
                    >
                      <option value="">-- প্ল্যান নির্বাচন করুন --</option>
                      {PRICING_PLANS.map(plan => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - ৳{plan.price} (৳{plan.originalPrice} থেকে ৫০% ছাড়)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Side - Plan Preview & CTA */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                  {selectedPlan ? (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-bold mb-2">
                          {PRICING_PLANS.find(p => p.id === selectedPlan)?.name} প্ল্যান
                        </h3>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-bold">৳{PRICING_PLANS.find(p => p.id === selectedPlan)?.price}</span>
                          <span className="line-through text-white/60">৳{PRICING_PLANS.find(p => p.id === selectedPlan)?.originalPrice}</span>
                        </div>
                        <span className="inline-block mt-2 px-3 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                          ৫০% ছাড়!
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {PRICING_PLANS.find(p => p.id === selectedPlan)?.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-300" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="w-16 h-16 mx-auto mb-4 text-white/60" />
                      <p className="text-white/80">বাম পাশে থেকে প্ল্যান নির্বাচন করুন</p>
                    </div>
                  )}

                  <Button
                    className="w-full py-6 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-xl text-lg shadow-xl"
                    onClick={() => {
                      if (!formData.name || !formData.mobile || !selectedPlan) {
                        alert('অনুগ্রহ করে সকল তথ্য পূরণ করুন')
                        return
                      }
                      setOrderStep('form')
                      setShowOrderModal(true)
                    }}
                  >
                    পেমেন্ট অপশন দেখুন <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-100">
                <span className="flex items-center gap-1 text-sm text-gray-600"><CheckCircle2 className="w-4 h-4 text-green-500" /> ১০০% নিরাপদ পেমেন্ট</span>
                <span className="flex items-center gap-1 text-sm text-gray-600"><Clock className="w-4 h-4 text-blue-500" /> ১ ঘন্টায় ডেলিভারি</span>
                <span className="flex items-center gap-1 text-sm text-gray-600"><Shield className="w-4 h-4 text-purple-500" /> ৭ দিনের রিফান্ড</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center mb-8"
            >
              কাস্টমার রিভিউ
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'রাকিবুল হাসান', location: 'ঢাকা', text: 'আমার PC ২ বছর স্লো ছিল, ১ ঘন্টায় ঠিক হয়ে গেল! অসাধারণ সফটওয়্যার।', rating: 5 },
                { name: 'ফাতেমা আক্তার', location: 'চট্টগ্রাম', text: 'Windows activate ৫ মিনিটে হয়ে গেল। সাপোর্ট টিম খুবই হেল্পফুল।', rating: 5 },
                { name: 'মেহেদী হাসান', location: 'যশোর', text: 'প্রফেশনাল টুলকিট! এত সুন্দর সফটওয়্যার আর দেখিনি। Highly recommended!', rating: 5 }
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl bg-white shadow-lg border border-gray-100"
                >
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, s) => (
                      <Star key={s} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="py-12 px-4 bg-white">
          <div className="max-w-3xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-center mb-8"
            >
              সাধারণ প্রশ্ন
            </motion.h2>
            <div className="space-y-3">
              {[
                { q: 'System Toolkit কী?', a: 'এটি একটি সম্পূর্ণ PC মেইনটেন্যান্স সফটওয়্যার। ১১৫+ টুল Windows, Mac, Linux, Android, iOS এ কাজ করে। সিস্টেম অপ্টিমাইজ, ক্লিন, রিপেয়ার ও সিকিউরিটি সব এক জায়গায়।' },
                { q: 'কিভাবে অর্ডার করব?', a: '"অর্ডার করুন" বাটনে ক্লিক করুন → আপনার তথ্য দিন → বিকাশ/নগদ দিয়ে পেমেন্ট করুন → WhatsApp এ স্ক্রিনশট পাঠান। ১ ঘন্টার মধ্যে সফটওয়্যার পাবেন।' },
                { q: 'পেমেন্ট পর কি করব?', a: 'পেমেন্ট স্ক্রিনশট WhatsApp এ পাঠান। আমরা ১ ঘন্টার মধ্যে আপনার সফটওয়্যার অ্যাক্সেস পাঠাব। সাপোর্ট পাবেন ২৪/৭।' },
                { q: 'রিফান্ড পলিসি কী?', a: '৭ দিনের মধ্যে সম্পূর্ণ রিফান্ড পাবেন যদি সফটওয়্যার ঠিকমতো কাজ না করে। কোন প্রশ্ন নেই।' }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-2xl bg-gray-50 overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full px-6 py-4 flex justify-between items-center text-left font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-blue-600" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="px-6 pb-4 text-gray-600"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-12 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                আপনার সিস্টেম অপ্টিমাইজ করতে প্রস্তুত?
              </h2>
              <p className="text-lg text-white/80 mb-6">
                ১১৫+ প্রফেশনাল টুল এখনই পান। সীমিত সময়ের ৫০% ছাড়!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-10 py-7 font-bold rounded-full shadow-xl text-xl"
                >
                  🎁 এখনই অর্ডার করুন <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="bg-slate-900 text-white py-10 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">System Toolkit</h3>
                    <p className="text-xs text-gray-400">by {BUSINESS_INFO.company}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400">
                  সম্পূর্ণ সিস্টেম অপ্টিমাইজেশন ও মেইনটেন্যান্স সফটওয়্যার।
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-4">যোগাযোগ</h3>
                <p className="flex items-center gap-2 text-sm text-gray-400 mb-2"><Phone className="w-4 h-4" /> {BUSINESS_INFO.phone}</p>
                <p className="flex items-center gap-2 text-sm text-gray-400 mb-2"><Mail className="w-4 h-4" /> {BUSINESS_INFO.email}</p>
                <p className="flex items-center gap-2 text-sm text-gray-400"><MapPin className="w-4 h-4" /> {BUSINESS_INFO.address}</p>
              </div>
              <div>
                <h3 className="font-bold mb-4">সোশ্যাল মিডিয়া</h3>
                <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
                  <Facebook className="w-5 h-5" /> NextGen Digital Studio
                </a>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Copyright & Developed by{' '}
              <a href={BUSINESS_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {BUSINESS_INFO.company}
              </a>
            </div>
          </div>
        </footer>

        {/* ===== WHATSAPP FLOAT BUTTON ===== */}
        <a
          href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent('হ্যালো, আমি System Toolkit এ ইন্টারেস্টেড আছি')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 z-40 hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </a>

        {/* ===== STICKY ORDER BUTTON (Mobile) ===== */}
        <div
          onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-600 text-white text-center py-4 font-bold cursor-pointer z-40 md:hidden shadow-2xl"
        >
          🎁 অর্ডার করুন - ৫০% ছাড়
        </div>

        {/* ===== ORDER MODAL ===== */}
        <AnimatePresence>
          {showOrderModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setShowOrderModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                {orderStep === 'form' && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">অর্ডার ফর্ম</h3>
                      <p className="text-gray-500">
                        প্ল্যান: <span className="font-bold text-blue-600">{PRICING_PLANS.find(p => p.id === selectedPlan)?.name}</span> | 
                        মূল্য: <span className="font-bold text-green-600">৳{PRICING_PLANS.find(p => p.id === selectedPlan)?.price}</span>
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">আপনার নাম *</label>
                        <Input
                          placeholder="আপনার পূর্ণ নাম লিখুন"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">মোবাইল নম্বর *</label>
                        <Input
                          placeholder="01XXXXXXXXX"
                          value={formData.mobile}
                          onChange={e => setFormData({...formData, mobile: e.target.value})}
                          className="h-12 rounded-xl"
                          type="tel"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ইমেইল (ঐচ্ছিক)</label>
                        <Input
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="h-12 rounded-xl"
                          type="email"
                        />
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-lg"
                      onClick={handleFormSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'প্রসেসিং...' : 'পেমেন্ট অপশন দেখুন'} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </>
                )}

                {orderStep === 'payment' && (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CreditCard className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">পেমেন্ট অপশন</h3>
                      <p className="text-gray-500">পেমেন্ট করুন ও স্ক্রিনশট পাঠান</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button
                        className="w-full py-6 bg-pink-600 hover:bg-pink-700 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                        onClick={() => handlePayment('bkash')}
                        disabled={isSubmitting}
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <span className="text-pink-600 font-bold text-xs">bKash</span>
                        </div>
                        বিকাশ দিয়ে পেমেন্ট
                      </Button>
                      
                      <Button
                        className="w-full py-6 bg-orange-600 hover:bg-orange-700 rounded-xl font-bold text-lg flex items-center justify-center gap-3"
                        onClick={() => handlePayment('nagad')}
                        disabled={isSubmitting}
                      >
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">N</span>
                        </div>
                        নগদ দিয়ে পেমেন্ট
                      </Button>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
                      <p className="text-sm text-gray-600 mb-2">পেমেন্ট নম্বর:</p>
                      <p className="font-bold text-lg">{BUSINESS_INFO.phone}</p>
                      <p className="text-xs text-gray-500 mt-1">পার্সোনাল নম্বর</p>
                    </div>
                  </>
                )}

                {orderStep === 'success' && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-green-600">অর্ডার সফল!</h3>
                    <p className="text-gray-600 mb-4">
                      WhatsApp এ স্ক্রিনশট পাঠান। ১ ঘন্টার মধ্যে সফটওয়্যার পাবেন।
                    </p>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setShowOrderModal(false)}
                    >
                      ঠিক আছে
                    </Button>
                  </div>
                )}

                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
