# 🔐 SYSTEM TOOLKIT - CREDENTIALS & API KEYS
## সংরক্ষিত তথ্য - NextGen Digital Studio

---

## 📱 BUSINESS INFORMATION

| Field | Value |
|-------|-------|
| **Company** | NextGen Digital Studio |
| **Founder & CEO** | Md. Najmul Islam Taj |
| **Phone** | +880 1711-731354 |
| **WhatsApp** | 8801711731354 |
| **Email** | conceptbd.net@gmail.com |
| **Address** | NewMarket, Jessore Sadar, Bangladesh |
| **Facebook** | https://www.facebook.com/nextgendigitalstudio |
| **bKash/Nagad** | 01711731354 |

---

## 🌐 DOMAIN & HOSTING

| Field | Value |
|-------|-------|
| **Domain** | nextgendigitalstudio.com |
| **Purchased From** | Spaceship ($9.08/year) |
| **Hosting** | Vercel (Free Tier) |
| **Live URL** | https://system-toolkit.vercel.app |
| **Dashboard** | https://system-toolkit.vercel.app/dashboard |
| **GitHub** | https://github.com/Taj3D/System-Toolkit |

---

## 📧 EMAIL SERVICE (Resend)

| Field | Value |
|-------|-------|
| **Provider** | Resend (resend.com) |
| **API Key** | `re_Gq333Hz1_68k6qaUExt32U5vPri1E43zv` |
| **Sender Email** | noreply@nextgendigitalstudio.com |
| **Verified Domain** | nextgendigitalstudio.com |
| **DKIM Status** | ✅ Verified |
| **SPF Status** | ✅ Verified |
| **Free Tier** | 3,000 emails/month, 100 emails/day |

### DNS Records for Email:
```
TXT @ v=spf1 include:spf.resend.com ~all
TXT resend._domainkey p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCbN/aNBP/9fAvq...
MX @ mail.resend.com (Priority: 10)
```

---

## 📊 GOOGLE SHEETS WEBHOOK

| Field | Value |
|-------|-------|
| **Webhook URL** | `https://script.google.com/macros/s/AKfycbxtduCMu00-kLmAQtkbDT5re0HgWdUeBx-ZmXeQm6Hu9erdKMHDYVwvyENGiXwtNBIRfA/exec` |
| **Status** | ✅ Working |
| **Sheet Columns** | Timestamp, Order ID, Name, Mobile, Email, Plan, Amount, Status |

### Google Apps Script Code:
```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp,
      data.orderId,
      data.name,
      data.mobile,
      data.email,
      data.plan,
      data.amount,
      data.status
    ]);
    return ContentService.createTextOutput(
      JSON.stringify({success: true, message: 'Order saved'})
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({success: false, error: error.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 📘 FACEBOOK PIXELS

### Pixel IDs:
| Pixel ID | Purpose |
|----------|---------|
| `918051034554872` | Primary Pixel |
| `1317407319827782` | Secondary Pixel |
| `1055888723429361` | Main + Conversions API |

### Conversions API (Pixel: 1055888723429361):
| Field | Value |
|-------|-------|
| **Pixel ID** | `1055888723429361` |
| **Access Token** | `EAAXExUUyB1QBRh9bA0s2Wslhsjmaru1h5hdzZBVXJ0kP6XyY7Sv4cJOw9rjZBtdb9QmxT73wJcZBeGSbGkZAkEFfJv9RZBy47T8qLl45ZCqBW45hZBZCdFwbFCt9LmgZAHSMNbGsaHjL1B13Ew63Lss8h06WPqVPlEBd8JT5ZB3PVheY67PMv5ZBUJKZB3rKrzqtAvZBKDQZDZD` |
| **API Version** | v18.0 |
| **Events Tracked** | PageView, InitiateCheckout, AddPaymentInfo, Purchase |

### Events Setup:
- **Browser-side**: PageView, InitiateCheckout, AddPaymentInfo, Lead
- **Server-side (Conversions API)**: Purchase
- **Deduplication**: Unique eventId matching

---

## 🔐 DASHBOARD PASSWORDS

| Password | Purpose |
|----------|---------|
| `admin123` | Default admin password |
| `nextgen2025` | NextGen Digital Studio password |
| `toolkit@123` | Toolkit password |
| `secure#pass` | Secure password |
| `master@key` | Master key password |

**Session Timeout**: 30 minutes

---

## 🗄️ DATABASE

| Field | Value |
|-------|-------|
| **Type** | SQLite |
| **File Path** | `/db/custom.db` |
| **ORM** | Prisma |
| **Models** | User, Post, Order |

### Order Model:
```prisma
model Order {
  id            String   @id @default(cuid())
  name          String
  mobile        String
  email         String?
  plan          String
  amount        Int
  status        String   @default("pending")
  paymentMethod String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Required for Vercel:
```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxtduCMu00-kLmAQtkbDT5re0HgWdUeBx-ZmXeQm6Hu9erdKMHDYVwvyENGiXwtNBIRfA/exec
RESEND_API_KEY=re_Gq333Hz1_68k6qaUExt32U5vPri1E43zv
FB_ACCESS_TOKEN=EAAXExUUyB1QBRh9bA0s2Wslhsjmaru1h5hdzZBVXJ0kP6XyY7Sv4cJOw9rjZBtdb9QmxT73wJcZBeGSbGkZAkEFfJv9RZBy47T8qLl45ZCqBW45hZBZCdFwbFCt9LmgZAHSMNbGsaHjL1B13Ew63Lss8h06WPqVPlEBd8JT5ZB3PVheY67PMv5ZBUJKZB3rKrzqtAvZBKDQZDZD
DATABASE_URL=file:./db/custom.db
```

---

## 📁 IMPORTANT FILES

| File | Purpose |
|------|---------|
| `/src/app/page.tsx` | Landing page with order form |
| `/src/app/dashboard/page.tsx` | Dashboard with 115+ tools |
| `/src/app/api/order/route.ts` | Order API (all integrations) |
| `/src/app/api/facebook-event/route.ts` | Facebook Conversions API |
| `/prisma/schema.prisma` | Database schema |
| `/.env` | Environment variables |
| `/worklog.md` | Project documentation |

---

## 📞 SUPPORT CONTACTS

| Service | Contact |
|---------|---------|
| **Resend Support** | support@resend.com |
| **Facebook Business** | business.facebook.com |
| **Vercel Support** | vercel.com/support |
| **Google Sheets** | support.google.com |

---

## 📅 LAST UPDATED
- **Date**: 2025-06-06
- **Updated By**: Main Agent
- **Status**: All integrations working ✅

---

## ⚠️ SECURITY NOTES

1. **Never commit** `.env` file to GitHub (already in .gitignore)
2. **Rotate API keys** periodically for security
3. **Facebook Access Token** expires - needs refresh
4. **Resend API Key** should be kept secret
5. **Dashboard passwords** can be changed in `/src/app/dashboard/page.tsx`

---

*This file contains sensitive information. Keep it secure and do not share publicly.*
