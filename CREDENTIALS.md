# 🔐 SYSTEM TOOLKIT - CREDENTIALS & CONFIGURATION

**Last Updated:** $(date)
**Project:** System Toolkit Dashboard
**Owner:** Md. Najmul Islam Taj (NextGen Digital Studio)

---

## 📊 GOOGLE SHEETS CONFIGURATION

| Item | Value |
|------|-------|
| **Google Sheet ID** | `1Sa5RxnkJM0VQW72VABhz_z7poGuFb52mD2iDF631EdQ` |
| **Google Sheet URL** | https://docs.google.com/spreadsheets/d/1Sa5RxnkJM0VQW72VABhz_z7poGuFb52mD2iDF631EdQ/edit |
| **Webhook URL** | `https://script.google.com/macros/s/AKfycbwat_qAhK5aOfW67Pv9sUv2L6DyQwOY8f22v85i3aNYm7MhTzDJsshY10aEOXDVZhHM/exec` |
| **Status** | ✅ **WORKING** (Version 2 - June 2026) |

### Google Sheets Setup:
- ✅ New Sheet created
- ✅ Apps Script deployed (Version 2)
- ✅ Webhook tested and working
- ✅ Data saving to Sheet confirmed

---

## 📧 RESEND EMAIL CONFIGURATION

| Item | Value |
|------|-------|
| **API Key** | `re_Gq333Hz1_68k6qaUExt32U5vPri1E43zv` |
| **Verified Domain** | `nextgendigitalstudio.com` |
| **From Email** | `noreply@nextgendigitalstudio.com` |
| **Status** | ✅ Working |

### Email Settings:
- ✅ Customer email only (no admin email)
- ✅ HTML email template with order details
- ✅ WhatsApp link included

---

## 📘 FACEBOOK PIXEL CONFIGURATION

| Pixel Name | Pixel ID | Status |
|------------|----------|--------|
| **Pixel 1** | `918051034554872` | ✅ Active |
| **Pixel 2** | `1317407319827782` | ✅ Active |
| **Pixel 3** | `1055888723429361` | ✅ Active (Conversions API) |

### Facebook Conversions API:
| Item | Value |
|------|-------|
| **Primary Pixel ID** | `1055888723429361` |
| **Access Token** | `EAAXExUUyB1QBRh9bA0s2Wslhsjmaru1h5hdzZBVXJ0kP6XyY7Sv4cJOw9rjZBtdb9QmxT73wJcZBeGSbGkZAkEFfJv9RZBy47T8qLl45ZCqBW45hZBZCdFwbFCt9LmgZAHSMNbGsaHjL1B13Ew63Lss8h06WPqVPlEBd8JT5ZB3PVheY67PMv5ZBUJKZB3rKrzqtAvZBKDQZDZD` |
| **API Version** | v18.0 |

### Events Tracked:
- PageView
- Lead
- InitiateCheckout
- AddPaymentInfo
- Purchase (Server-side via Conversions API)

---

## 📱 WHATSAPP INTEGRATION

| Item | Value |
|------|-------|
| **WhatsApp Number** | `+880 1711-731354` |
| **WhatsApp Link** | https://wa.me/8801711731354 |

---

## 💳 PAYMENT INFORMATION

| Item | Value |
|------|-------|
| **bKash Number** | `01711731354` |
| **Nagad Number** | `01711731354` |

---

## 🌐 DEPLOYMENT INFORMATION

| Item | Value |
|------|-------|
| **GitHub Repository** | https://github.com/Taj3D/System-Toolkit |
| **Live URL (Landing)** | https://system-toolkit.vercel.app |
| **Live URL (Dashboard)** | https://system-toolkit.vercel.app/dashboard |

---

## 🏢 BUSINESS INFORMATION

| Item | Value |
|------|-------|
| **Company Name** | NextGen Digital Studio |
| **Owner** | Md. Najmul Islam Taj |
| **Facebook** | https://www.facebook.com/nextgendigitalstudio |
| **Phone** | +880 1711-731354 |
| **Email** | conceptbd.net@gmail.com |
| **Address** | NewMarket, Jessore Sadar |

---

## 📋 PRICING PLANS

| Plan | Price | Original | Features |
|------|-------|----------|----------|
| **বেসিক** | ৳299 | ৳599 | 115+ Tools, Windows, 3 Months Update |
| **প্রফেশনাল** | ৳499 | ৳999 | 115+ Tools, All Platforms, 1 Year Update, Tutorials |
| **এন্টারপ্রাইজ** | ৳999 | ৳1999 | All Features, Lifetime Update, Unlimited Devices, 24/7 Support |
| **স্পেশাল অফার** | ৳199 | ৳599 | 115+ Tools, Windows, 7 Days Trial, Email Support |

---

## ⚠️ IMPORTANT NOTES

1. **Google Sheets Webhook** - Currently showing "Page not found". Needs re-deployment.
2. **Email** - Only sent to customer, not to admin.
3. **Database** - Using SQLite (not persistent on Vercel serverless).
4. **Facebook Pixels** - 3 pixels installed for maximum tracking.

---

## 🔧 ENVIRONMENT VARIABLES

Create `.env` file with these values:

```env
# Google Sheets
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_URL/exec

# Resend Email
RESEND_API_KEY=re_Gq333Hz1_68k6qaUExt32U5vPri1E43zv

# Facebook
FB_ACCESS_TOKEN=EAAXExUUyB1QBRh9bA0s2Wslhsjmaru1h5hdzZBVXJ0kP6XyY7Sv4cJOw9rjZBtdb9QmxT73wJcZBeGSbGkZAkEFfJv9RZBy47T8qLl45ZCqBW45hZBZCdFwbFCt9LmgZAHSMNbGsaHjL1B13Ew63Lss8h06WPqVPlEBd8JT5ZB3PVheY67PMv5ZBUJKZB3rKrzqtAvZBKDQZDZD

# Database
DATABASE_URL="file:./dev.db"
```

---

*This file contains sensitive information. Keep it secure and do not commit to public repositories.*
