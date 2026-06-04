#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
System Toolkit Complete Guide - Bengali PDF Generator
Total Tools: 115 (Windows 41, macOS 15, Linux 15, Android 13, iOS 11, Cross Platform 20)
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, ListFlowable, ListItem
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Register Bengali font
FONT_PATH = "/home/z/my-project/fonts/NotoSansBengali-Regular.ttf"
pdfmetrics.registerFont(TTFont('Bengali', FONT_PATH))

# Define colors
PRIMARY_COLOR = HexColor('#1e40af')
SECONDARY_COLOR = HexColor('#3b82f6')
ACCENT_COLOR = HexColor('#10b981')
DARK_COLOR = HexColor('#1f2937')
LIGHT_BG = HexColor('#f3f4f6')

# Create styles
styles = getSampleStyleSheet()

# Custom Bengali styles
title_style = ParagraphStyle(
    'BengaliTitle',
    parent=styles['Title'],
    fontName='Bengali',
    fontSize=24,
    textColor=PRIMARY_COLOR,
    alignment=TA_CENTER,
    spaceAfter=20,
)

heading1_style = ParagraphStyle(
    'BengaliH1',
    parent=styles['Heading1'],
    fontName='Bengali',
    fontSize=18,
    textColor=PRIMARY_COLOR,
    spaceBefore=20,
    spaceAfter=12,
)

heading2_style = ParagraphStyle(
    'BengaliH2',
    parent=styles['Heading2'],
    fontName='Bengali',
    fontSize=14,
    textColor=SECONDARY_COLOR,
    spaceBefore=15,
    spaceAfter=8,
)

body_style = ParagraphStyle(
    'BengaliBody',
    parent=styles['Normal'],
    fontName='Bengali',
    fontSize=11,
    textColor=DARK_COLOR,
    alignment=TA_JUSTIFY,
    spaceBefore=6,
    spaceAfter=6,
    leading=16,
)

tool_name_style = ParagraphStyle(
    'ToolName',
    parent=styles['Normal'],
    fontName='Bengali',
    fontSize=12,
    textColor=PRIMARY_COLOR,
    spaceBefore=8,
    spaceAfter=4,
)

desc_style = ParagraphStyle(
    'Desc',
    parent=styles['Normal'],
    fontName='Bengali',
    fontSize=10,
    textColor=DARK_COLOR,
    leftIndent=20,
    spaceBefore=2,
    spaceAfter=8,
)

# All Tools Data
TOOLS_DATA = {
    'windows': {
        'name': 'Windows',
        'name_bn': 'উইন্ডোজ',
        'count': 41,
        'tools': [
            {'id': 'w1', 'name': 'Chris Titus Tech Windows Utility', 'desc': 'আল্টিমেট উইন্ডোজ ডিব্লোট এবং অপ্টিমাইজেশন টুল। ব্লোটওয়্যার সরান, সেটিংস অপ্টিমাইজ করুন, প্রয়োজনীয় অ্যাপ ইনস্টল করুন।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://christitus.com/windows-tool/', 'install': 'PowerShell খুলুন এবং রান করুন: irm "https://christitus.com/win" | iex'},
            {'id': 'w1b', 'name': 'Windows Optimizer Script', 'desc': 'উইন্ডোজ 10/11 অপ্টিমাইজেশন স্ক্রিপ্ট। টেলিমেট্রি নিষ্ক্রিয় করে, ব্লোটওয়্যার সরায়, পারফরম্যান্স উন্নত করে।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://github.com/ChrisTitusTech/winutil', 'install': 'PowerShell এ রান করুন: irm "https://christitus.com/win" | iex'},
            {'id': 'w2', 'name': 'Windows Debloat Script', 'desc': 'পূর্ব-ইনস্টলকৃত অ্যাপ সরান, টেলিমেট্রি নিষ্ক্রিয় করুন, উইন্ডোজ পারফরম্যান্স অপ্টিমাইজ করুন।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://github.com/Sycnex/Windows10Debloater', 'install': 'PowerShell এ রান করুন: iwr -useb https://git.io/debloat | iex'},
            {'id': 'w3', 'name': 'O&O ShutUp10++', 'desc': 'উইন্ডোজ 10 এবং 11 এর জন্য ফ্রি অ্যান্টিস্পাই টুল। উইন্ডোজ কী ডাটা পাঠায় তা নিয়ন্ত্রণ করুন।', 'category': 'প্রাইভেসি', 'url': 'https://www.oo-software.com/en/shutup10', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w4', 'name': 'Bulk Crap Uninstaller', 'desc': 'অনাকাঙ্ক্ষিত প্রোগ্রাম দ্রুত এবং সম্পূর্ণরূপে সরান।', 'category': 'আনইনস্টলার', 'url': 'https://www.bcuninstaller.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন বা winget install BCUninstaller'},
            {'id': 'w5', 'name': 'SDI (Snappy Driver Installer)', 'desc': 'ফ্রিতে ড্রাইভার ইনস্টল এবং আপডেট করুন। কোন বিজ্ঞাপন নেই, কোন বান্ডেলড সফটওয়্যার নেই।', 'category': 'ড্রাইভার', 'url': 'https://sdi-tool.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে রান করুন (পোর্টেবল)'},
            {'id': 'w6', 'name': 'Microsoft Activation Scripts', 'desc': 'ওপেন-সোর্স উইন্ডোজ এবং অফিস অ্যাক্টিভেটর (MAS)।', 'category': 'অ্যাক্টিভেশন', 'url': 'https://github.com/massgravel/Microsoft-Activation-Scripts', 'install': 'PowerShell এ রান করুন: irm https://massgrave.dev/get | iex'},
            {'id': 'w7', 'name': 'Chocolatey', 'desc': 'উইন্ডোজের জন্য প্যাকেজ ম্যানেজার। এক কমান্ডে সফটওয়্যার ইনস্টল করুন।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://chocolatey.org/', 'install': 'PowerShell (Admin) এ ইনস্টলেশন কমান্ড রান করুন'},
            {'id': 'w8', 'name': 'Winget', 'desc': 'মাইক্রোসফটের অফিসিয়াল উইন্ডোজ প্যাকেজ ম্যানেজার।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://github.com/microsoft/winget-cli', 'install': 'উইন্ডোজ 10/11 এ পূর্ব-ইনস্টলকৃত। না থাকলে Microsoft Store থেকে ইনস্টল করুন'},
            {'id': 'w9', 'name': 'HWiNFO', 'desc': 'বিস্তৃত হার্ডওয়্যার বিশ্লেষণ, মনিটরিং এবং রিপোর্টিং।', 'category': 'হার্ডওয়্যার', 'url': 'https://www.hwinfo.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w10', 'name': 'HWMonitor', 'desc': 'হার্ডওয়্যার মনিটরিং প্রোগ্রাম যা পিসি সিস্টেমের হেলথ সেন্সর পড়ে।', 'category': 'হার্ডওয়্যার', 'url': 'https://www.cpuid.com/softwares/hwmonitor.html', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w11', 'name': 'CrystalDiskInfo', 'desc': 'SSD/HDD হেলথ স্ট্যাটাস এবং তাপমাত্রা মনিটর করুন।', 'category': 'হার্ডওয়্যার', 'url': 'https://crystalmark.info/en/software/crystaldiskinfo/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w12', 'name': 'MemTest86', 'desc': 'RAM মেমোরি টেস্টিংয়ের জন্য ইন্ডাস্ট্রি স্ট্যান্ডার্ড।', 'category': 'ডায়াগনস্টিক্স', 'url': 'https://www.memtest86.com/', 'install': 'USB বুটেবল তৈরি করে বুট করুন'},
            {'id': 'w13', 'name': 'Rufus', 'desc': 'সহজে বুটেবল USB ড্রাইভ তৈরি করুন।', 'category': 'ইউটিলিটি', 'url': 'https://rufus.ie/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে রান করুন (পোর্টেবল)'},
            {'id': 'w14', 'name': 'Ventoy', 'desc': 'বুটেবল USB সমাধান। শুধু USB তে ISO ফাইল কপি করুন।', 'category': 'ইউটিলিটি', 'url': 'https://www.ventoy.net/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে USB তে ইনস্টল করুন'},
            {'id': 'w15', 'name': 'PowerToys', 'desc': 'উইন্ডোজের জন্য মাইক্রোসফট পাওয়ার ইউজার ইউটিলিটিস।', 'category': 'ইউটিলিটি', 'url': 'https://github.com/microsoft/PowerToys', 'install': 'winget install Microsoft.PowerToys'},
            {'id': 'w16', 'name': 'Everything', 'desc': 'উইন্ডোজের জন্য তাৎক্ষণিক ফাইল সার্চ। অত্যন্ত দ্রুত।', 'category': 'সার্চ', 'url': 'https://www.voidtools.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w17', 'name': '7-Zip', 'desc': 'উচ্চ কম্প্রেশন রেশিও সহ ফ্রি ওপেন-সোর্স ফাইল আর্কাইভার।', 'category': 'ইউটিলিটি', 'url': 'https://www.7-zip.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন বা winget install 7zip.7zip'},
            {'id': 'w18', 'name': 'Malwarebytes', 'desc': 'উইন্ডোজ, ম্যাক এবং মোবাইলের জন্য অ্যান্টি-ম্যালওয়্যার সফটওয়্যার।', 'category': 'সিকিউরিটি', 'url': 'https://www.malwarebytes.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w19', 'name': 'VeraCrypt', 'desc': 'ফ্রি ওপেন-সোর্স ডিস্ক এনক্রিপশন সফটওয়্যার।', 'category': 'সিকিউরিটি', 'url': 'https://www.veracrypt.fr/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w20', 'name': 'BleachBit', 'desc': 'আপনার সিস্টেম পরিষ্কার করুন এবং ডিস্ক স্পেস ফ্রি করুন।', 'category': 'ক্লিনআপ', 'url': 'https://www.bleachbit.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w21', 'name': 'Geek Uninstaller', 'desc': 'দক্ষ এবং দ্রুত ছোট আনইনস্টলার।', 'category': 'আনইনস্টলার', 'url': 'https://geekuninstaller.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে রান করুন (পোর্টেবল)'},
            {'id': 'w22', 'name': 'Tron Script', 'desc': 'উইন্ডোজের জন্য স্বয়ংক্রিয় সিস্টেম ক্লিনআপ এবং রিপেয়ার স্ক্রিপ্ট।', 'category': 'সিস্টেম রিপেয়ার', 'url': 'https://github.com/bmrf/tron', 'install': 'GitHub থেকে ডাউনলোড করে tron.bat রান করুন'},
            {'id': 'w23', 'name': 'System File Checker (SFC)', 'desc': 'ক্ষতিগ্রস্ত উইন্ডোজ সিস্টেম ফাইল স্ক্যান এবং রিস্টোর করুন। সিস্টেম স্থিতিশীলতার জন্য অপরিহার্য।', 'category': 'সিস্টেম রিপেয়ার', 'url': 'https://learn.microsoft.com/', 'install': 'CMD (Admin) এ রান করুন: sfc /scannow'},
            {'id': 'w24', 'name': 'Disk Check (CHKDSK)', 'desc': 'ডিস্কে ত্রুটি এবং ব্যাড সেক্টর চেক করুন। ফাইল সিস্টেম সমস্যা মেরামত করে।', 'category': 'ডায়াগনস্টিক্স', 'url': 'https://learn.microsoft.com/', 'install': 'CMD (Admin) এ রান করুন: chkdsk /r'},
            {'id': 'w25', 'name': 'DISM System Repair', 'desc': 'উইন্ডোজ ইমেজ এবং কম্পোনেন্ট স্টোর রিপেয়ার করুন। উইন্ডোজ আপডেট সমস্যা সমাধান করে।', 'category': 'সিস্টেম রিপেয়ার', 'url': 'https://learn.microsoft.com/', 'install': 'CMD (Admin) এ রান করুন: dism.exe /online /cleanup-image /restorehealth'},
            {'id': 'w26', 'name': 'Windows Server Setup', 'desc': 'উইন্ডোজ 11 কে উইন্ডোজ সার্ভার এডিশনে রূপান্তর করুন। উন্নত সেটআপ টুল।', 'category': 'সিস্টেম সেটআপ', 'url': 'https://learn.microsoft.com/', 'install': 'উন্নত ব্যবহারকারীদের জন্য'},
            {'id': 'w27', 'name': 'Windows Activation (MAS)', 'desc': 'ওপেন-সোর্স উইন্ডোজ এবং অফিস অ্যাক্টিভেটর। HWID এবং KMS অ্যাক্টিভেশন।', 'category': 'অ্যাক্টিভেশন', 'url': 'https://github.com/massgravel/Microsoft-Activation-Scripts', 'install': 'PowerShell এ রান করুন: irm https://get.activated.win | iex'},
            {'id': 'w28', 'name': 'RaphiRe Debloat', 'desc': 'আধুনিক উইন্ডোজ ডিব্লোট টুল। পরিষ্কার, দ্রুত এবং কার্যকর।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://github.com/Raphire/Win11Debloat', 'install': 'PowerShell এ রান করুন: & ([scriptblock]::Create((irm "https://debloat.raphi.re/")))'},
            {'id': 'w29', 'name': 'Chris Titus Dev Tool', 'desc': 'উন্নত সিস্টেম ম্যানেজমেন্ট এবং টুইকসের জন্য উইন্ডোজ ডেভ ইউটিলিটি।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://github.com/ChrisTitusTech/winutil', 'install': 'PowerShell এ রান করুন: irm "https://christitus.com/windev" | iex'},
            {'id': 'w30', 'name': 'Windows Update Reset', 'desc': 'আপডেট সমস্যা সমাধানে উইন্ডোজ আপডেট কম্পোনেন্ট রিসেট করুন। ক্যাশে ক্লিয়ার করে এবং সার্ভিস রিসেট করে।', 'category': 'সিস্টেম রিপেয়ার', 'url': 'https://learn.microsoft.com/', 'install': 'CMD (Admin) এ কমান্ড রান করুন'},
            {'id': 'w31', 'name': 'DNS Flush & Reset', 'desc': 'DNS ক্যাশে ফ্লাশ করুন এবং নেটওয়ার্ক স্ট্যাক রিসেট করুন। নেটওয়ার্ক সংযোগ সমস্যা সমাধান করে।', 'category': 'নেটওয়ার্ক', 'url': 'https://learn.microsoft.com/', 'install': 'CMD এ রান করুন: ipconfig /flushdns && netsh winsock reset'},
            {'id': 'w32', 'name': 'GPU Driver Uninstaller (DDU)', 'desc': 'ডিসপ্লে ড্রাইভার আনইনস্টলার - ক্লিন ইনস্টলের জন্য GPU ড্রাইভার সম্পূর্ণরূপে সরান।', 'category': 'ড্রাইভার', 'url': 'https://www.wagnardsoft.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে সেফ মোডে রান করুন'},
            {'id': 'w33', 'name': 'NVCleanstall', 'desc': 'কাস্টম NVIDIA ড্রাইভার ইনস্টলার। টেলিমেট্রি সরান, শুধুমাত্র প্রয়োজনীয় কম্পোনেন্ট ইনস্টল করুন।', 'category': 'ড্রাইভার', 'url': 'https://www.techpowerup.com/nvcleanstall/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w34', 'name': 'Windows Tweaker (SophiApp)', 'desc': '100+ অপশন সহ আধুনিক উইন্ডোজ 10/11 টুইকার। ওপেন সোর্স এবং নিরাপদ।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://github.com/Sophia-Community/SophiApp', 'install': 'PowerShell এ রান করুন: irm https://sophia.community/install | iex'},
            {'id': 'w35', 'name': 'Glary Utilities', 'desc': 'PC অপ্টিমাইজেশন, রিপেয়ার এবং মেইনটেন্যান্সের জন্য অল-ইন-ওয়ান সিস্টেম ইউটিলিটিস।', 'category': 'সিস্টেম অপ্টিমাইজেশন', 'url': 'https://www.glarysoft.com/glary-utilities/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'w36', 'name': 'Windows Defender Configurator', 'desc': 'উইন্ডোজ ডিফেন্ডার সেটিংস কনফিগার করুন। রিয়েল-টাইম প্রোটেকশন চালু/বন্ধ করুন।', 'category': 'সিকিউরিটি', 'url': 'https://github.com/AndyFul/ConfigureDefender', 'install': 'GitHub থেকে ডাউনলোড করুন'},
            {'id': 'w37', 'name': 'Temp File Cleaner', 'desc': 'উইন্ডোজ থেকে সব টেম্পোরারি ফাইল পরিষ্কার করুন। তাৎক্ষণিকভাবে ডিস্ক স্পেস ফ্রি করুন।', 'category': 'ক্লিনআপ', 'url': 'https://learn.microsoft.com/', 'install': 'CMD এ রান করুন: del /q/f/s %TEMP%\\*'},
            {'id': 'w38', 'name': 'PowerPlan Switcher', 'desc': 'সর্বোচ্চ সিস্টেম পারফরম্যান্সের জন্য হাই পারফরম্যান্স পাওয়ার প্ল্যানে সুইচ করুন।', 'category': 'পারফরম্যান্স', 'url': 'https://learn.microsoft.com/', 'install': 'CMD (Admin) এ রান করুন: powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c'},
            {'id': 'w39', 'name': 'Privazer', 'desc': 'আপনার কার্যকলাপের সব চিহ্ন স্থায়ীভাবে সরিয়ে দেয় এমন ডিপ সিস্টেম ক্লিনার।', 'category': 'প্রাইভেসি', 'url': 'https://privazer.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
        ]
    },
    'macos': {
        'name': 'macOS',
        'name_bn': 'ম্যাকওএস',
        'count': 15,
        'tools': [
            {'id': 'm1', 'name': 'AppCleaner', 'desc': 'আপনার ম্যাক থেকে সম্পূর্ণরূপে অ্যাপ আনইনস্টল করুন।', 'category': 'আনইনস্টলার', 'url': 'https://freemacsoft.net/appcleaner/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে Applications ফোল্ডারে ড্র্যাগ করুন'},
            {'id': 'm2', 'name': 'Homebrew', 'desc': 'ম্যাকওএসের জন্য প্যাকেজ ম্যানেজার।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://brew.sh/', 'install': 'Terminal এ রান করুন: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'},
            {'id': 'm3', 'name': 'Onyx', 'desc': 'ম্যাকওএসের জন্য মেইনটেন্যান্স এবং অপ্টিমাইজেশন টুল।', 'category': 'সিস্টেম', 'url': 'https://www.titanium-software.fr/en/onyx.html', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm4', 'name': 'CleanMyMac X', 'desc': 'আপনার ম্যাক পরিপাটি করার জন্য অল-ইন-ওয়ান প্যাকেজ।', 'category': 'ক্লিনআপ', 'url': 'https://cleanmymac.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন (পেইড)'},
            {'id': 'm5', 'name': 'Amphetamine', 'desc': 'আপনার ম্যাককে স্লিপ হতে বাধা দিন।', 'category': 'ইউটিলিটি', 'url': 'https://apps.apple.com/us/app/amphetamine/id937984704', 'install': 'App Store থেকে ইনস্টল করুন'},
            {'id': 'm6', 'name': 'AppTrap', 'desc': 'অ্যাপ আনইনস্টল করার সময় স্বয়ংক্রিয়ভাবে সম্পর্কিত ফাইল সরান।', 'category': 'আনইনস্টলার', 'url': 'https://onnati.net/apptrap/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm7', 'name': 'Tuxera NTFS', 'desc': 'ম্যাকে NTFS ড্রাইভে পূর্ণ রিড-রাইট অ্যাক্সেস।', 'category': 'ইউটিলিটি', 'url': 'https://www.tuxera.com/products/tuxera-ntfs-for-mac/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm8', 'name': 'Disk Inventory X', 'desc': 'ম্যাকের জন্য ডিস্ক ইউসেজ ইউটিলিটি।', 'category': 'স্টোরেজ', 'url': 'http://www.derlien.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm9', 'name': 'EtreCheck', 'desc': 'ম্যাক সমস্যা নির্ণয় এবং সমাধান করুন।', 'category': 'ডায়াগনস্টিক্স', 'url': 'https://etrecheck.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে রান করুন'},
            {'id': 'm10', 'name': 'Malwarebytes for Mac', 'desc': 'ম্যাক অ্যান্টি-ম্যালওয়্যার প্রোটেকশন।', 'category': 'সিকিউরিটি', 'url': 'https://www.malwarebytes.com/mac/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm11', 'name': 'Little Snitch', 'desc': 'নেটওয়ার্ক সংযোগ মনিটর এবং নিয়ন্ত্রণ করুন।', 'category': 'সিকিউরিটি', 'url': 'https://www.obdev.at/products/littlesnitch/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm12', 'name': 'Carbon Copy Cloner', 'desc': 'আপনার ম্যাকের বুটেবল ব্যাকআপ তৈরি করুন।', 'category': 'ব্যাকআপ', 'url': 'https://bombich.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে ইনস্টল করুন'},
            {'id': 'm13', 'name': 'Stats', 'desc': 'মেনু বারে সিস্টেম মনিটর।', 'category': 'মনিটরিং', 'url': 'https://github.com/exelban/stats', 'install': 'brew install --cask stats'},
            {'id': 'm14', 'name': 'Rectangle', 'desc': 'কীবোর্ড শর্টকাট ব্যবহার করে উইন্ডো মুভ এবং রিসাইজ করুন।', 'category': 'উইন্ডো ম্যানেজমেন্ট', 'url': 'https://rectangleapp.com/', 'install': 'brew install --cask rectangle'},
            {'id': 'm15', 'name': 'HiddenBar', 'desc': 'পরিষ্কার রাখতে মেনু বার আইটেম লুকান।', 'category': 'ইউটিলিটি', 'url': 'https://github.com/dwarvesf/hidden', 'install': 'brew install --cask hiddenbar'},
        ]
    },
    'linux': {
        'name': 'Linux',
        'name_bn': 'লিনাক্স',
        'count': 15,
        'tools': [
            {'id': 'l1', 'name': 'Ubuntu Cleaner', 'desc': 'আপনার উবুন্টু সিস্টেম পরিষ্কার করুন।', 'category': 'ক্লিনআপ', 'url': 'https://github.com/gerardpuig/ubuntu-cleaner', 'install': 'sudo apt install ubuntu-cleaner'},
            {'id': 'l2', 'name': 'Stacer', 'desc': 'লিনাক্স সিস্টেম অপ্টিমাইজার এবং মনিটরিং টুল।', 'category': 'সিস্টেম', 'url': 'https://github.com/oguzhaninan/Stacer', 'install': 'sudo apt install stacer'},
            {'id': 'l3', 'name': 'BleachBit for Linux', 'desc': 'আপনার লিনাক্স সিস্টেম পরিষ্কার করুন এবং ডিস্ক স্পেস ফ্রি করুন।', 'category': 'ক্লিনআপ', 'url': 'https://www.bleachbit.org/', 'install': 'sudo apt install bleachbit'},
            {'id': 'l4', 'name': 'Timeshift', 'desc': 'লিনাক্সের জন্য সিস্টেম রিস্টোর টুল।', 'category': 'ব্যাকআপ', 'url': 'https://github.com/teejee2008/timeshift', 'install': 'sudo apt install timeshift'},
            {'id': 'l5', 'name': 'GParted', 'desc': 'গ্রাফিক্যালি ডিস্ক পার্টিশন ম্যানেজ করার জন্য পার্টিশন এডিটর।', 'category': 'স্টোরেজ', 'url': 'https://gparted.org/', 'install': 'sudo apt install gparted'},
            {'id': 'l6', 'name': 'htop', 'desc': 'লিনাক্সের জন্য ইন্টারঅ্যাক্টিভ প্রসেস ভিউয়ার।', 'category': 'মনিটরিং', 'url': 'https://htop.dev/', 'install': 'sudo apt install htop'},
            {'id': 'l7', 'name': 'Neofetch', 'desc': 'টার্মিনালে সিস্টেম তথ্য প্রদর্শন করুন।', 'category': 'ইউটিলিটি', 'url': 'https://github.com/dylanaraps/neofetch', 'install': 'sudo apt install neofetch'},
            {'id': 'l8', 'name': 'Terminator', 'desc': 'এক উইন্ডোতে একাধিক টার্মিনাল সহ টার্মিনাল ইমুলেটর।', 'category': 'টার্মিনাল', 'url': 'https://gnometerminator.blogspot.com/', 'install': 'sudo apt install terminator'},
            {'id': 'l9', 'name': 'ClamAV', 'desc': 'ট্রোজান এবং ম্যালওয়্যার সনাক্ত করার জন্য ওপেন সোর্স অ্যান্টিভাইরাস ইঞ্জিন।', 'category': 'সিকিউরিটি', 'url': 'https://www.clamav.net/', 'install': 'sudo apt install clamav'},
            {'id': 'l10', 'name': 'UFW', 'desc': 'নেটফিল্টার ম্যানেজ করার জন্য আনকম্প্লিকেটেড ফায়ারওয়াল।', 'category': 'সিকিউরিটি', 'url': 'https://launchpad.net/ufw', 'install': 'sudo apt install ufw'},
            {'id': 'l11', 'name': 'GDebi', 'desc': 'স্বয়ংক্রিয় ডিপেন্ডেন্সি রেজোলিউশন সহ .deb প্যাকেজ ইনস্টল করুন।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://launchpad.net/gdebi', 'install': 'sudo apt install gdebi'},
            {'id': 'l12', 'name': 'Synaptic', 'desc': 'গ্রাফিক্যাল প্যাকেজ ম্যানেজমেন্ট টুল।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://www.nongnu.org/synaptic/', 'install': 'sudo apt install synaptic'},
            {'id': 'l13', 'name': 'Hardinfo', 'desc': 'সিস্টেম প্রোফাইলার এবং বেঞ্চমার্ক টুল।', 'category': 'ডায়াগনস্টিক্স', 'url': 'https://github.com/lpereira/hardinfo', 'install': 'sudo apt install hardinfo'},
            {'id': 'l14', 'name': 'KSysGuard', 'desc': 'KDE প্লাজমার জন্য সিস্টেম মনিটর।', 'category': 'মনিটরিং', 'url': 'https://apps.kde.org/ksysguard/', 'install': 'sudo apt install ksysguard'},
            {'id': 'l15', 'name': 'Lutris', 'desc': 'লিনাক্সের জন্য ওপেন গেমিং প্ল্যাটফর্ম।', 'category': 'গেমিং', 'url': 'https://lutris.net/', 'install': 'sudo apt install lutris অথবা flatpak install flathub net.lutris.Lutris'},
        ]
    },
    'android': {
        'name': 'Android',
        'name_bn': 'অ্যান্ড্রয়েড',
        'count': 13,
        'tools': [
            {'id': 'a1', 'name': 'SD Maid SE', 'desc': 'অ্যান্ড্রয়েডের জন্য সিস্টেম ক্লিনিং টুল।', 'category': 'ক্লিনআপ', 'url': 'https://github.com/d4rken-org/sdmaid-se', 'install': 'Play Store বা F-Droid থেকে ইনস্টল করুন'},
            {'id': 'a2', 'name': 'Shizuku', 'desc': 'ADB/রুট প্রিভিলেজ সহ সরাসরি সিস্টেম API ব্যবহার করুন।', 'category': 'সিস্টেম', 'url': 'https://shizuku.rikka.app/', 'install': 'Play Store থেকে ইনস্টল করুন, তারপর ADB দিয়ে সেটআপ করুন'},
            {'id': 'a3', 'name': 'App Manager', 'desc': 'অ্যান্ড্রয়েডের জন্য ফুল-ফিচার্ড প্যাকেজ ম্যানেজার।', 'category': 'প্যাকেজ ম্যানেজার', 'url': 'https://github.com/MuntashirAkon/AppManager', 'install': 'F-Droid বা GitHub থেকে ইনস্টল করুন'},
            {'id': 'a4', 'name': 'Termux', 'desc': 'টার্মিনাল ইমুলেটর এবং লিনাক্স এনভায়রনমেন্ট অ্যাপ।', 'category': 'টার্মিনাল', 'url': 'https://termux.com/', 'install': 'F-Droid থেকে ইনস্টল করুন (Play Store ভার্সন পুরনো)'},
            {'id': 'a5', 'name': 'ADB AppControl', 'desc': 'PC থেকে ADB এর মাধ্যমে অ্যান্ড্রয়েড অ্যাপ ম্যানেজ করুন।', 'category': 'ম্যানেজমেন্ট', 'url': 'https://adbappcontrol.com/', 'install': 'ওয়েবসাইট থেকে PC তে ডাউনলোড করুন'},
            {'id': 'a6', 'name': 'Universal Android Debloater', 'desc': 'যেকোনো অ্যান্ড্রয়েড ডিভাইস থেকে ব্লোটওয়্যার সরান।', 'category': 'ডিব্লোট', 'url': 'https://github.com/0x192/universal-android-debloater', 'install': 'GitHub থেকে ডাউনলোড করুন (PC তে রান হয়)'},
            {'id': 'a7', 'name': 'Franco Kernel Manager', 'desc': 'রুটকৃত ডিভাইসের জন্য কার্নেল ম্যানেজার।', 'category': 'সিস্টেম', 'url': 'https://play.google.com/store/apps/details?id=com.franco.kernel', 'install': 'Play Store থেকে ইনস্টল করুন (রুট প্রয়োজন)'},
            {'id': 'a8', 'name': 'Magisk', 'desc': 'অ্যান্ড্রয়েডের জন্য সিস্টেমলেস রুট সমাধান।', 'category': 'রুট', 'url': 'https://github.com/topjohnwu/Magisk', 'install': 'GitHub থেকে APK ডাউনলোড করুন, বুটলোডার আনলক করে ফ্লাশ করুন'},
            {'id': 'a9', 'name': 'Greenify', 'desc': 'ব্যাটারি বাঁচাতে হাইবারনেশন অ্যাপ।', 'category': 'ব্যাটারি', 'url': 'https://play.google.com/store/apps/details?id=com.oasisfeng.greenify', 'install': 'Play Store থেকে ইনস্টল করুন'},
            {'id': 'a10', 'name': 'Blokada', 'desc': 'অ্যান্ড্রয়েডের জন্য ফ্রি DNS চেঞ্জার এবং অ্যাড ব্লকার।', 'category': 'প্রাইভেসি', 'url': 'https://blokada.org/', 'install': 'ওয়েবসাইট বা F-Droid থেকে ইনস্টল করুন'},
            {'id': 'a11', 'name': 'NetGuard', 'desc': 'অ্যান্ড্রয়েডের জন্য নো-রুট ফায়ারওয়াল।', 'category': 'সিকিউরিটি', 'url': 'https://github.com/M66B/NetGuard', 'install': 'GitHub বা F-Droid থেকে ইনস্টল করুন'},
            {'id': 'a12', 'name': 'CPU Float', 'desc': 'ওভারলে হিসেবে CPU, GPU এবং RAM ইউসেজ মনিটর করুন।', 'category': 'মনিটরিং', 'url': 'https://play.google.com/store/apps/details?id=com.cgw.cputemp', 'install': 'Play Store থেকে ইনস্টল করুন'},
            {'id': 'a13', 'name': 'Amarok', 'desc': 'অ্যান্ড্রয়েডে অ্যাপ এবং ফাইল লুকান।', 'category': 'প্রাইভেসি', 'url': 'https://github.com/deltazefiro/Amarok-Hider', 'install': 'GitHub থেকে ইনস্টল করুন'},
        ]
    },
    'ios': {
        'name': 'iOS',
        'name_bn': 'আইওএস',
        'count': 11,
        'tools': [
            {'id': 'i1', 'name': 'AltStore', 'desc': 'আইওএসের জন্য অল্টারনেটিভ অ্যাপ স্টোর - অ্যাপ সাইডলোড করুন।', 'category': 'সাইডলোডিং', 'url': 'https://altstore.io/', 'install': 'ওয়েবসাইট থেকে PC/Mac এ AltServer ইনস্টল করুন, তারপর ডিভাইসে AltStore সাইডলোড করুন'},
            {'id': 'i2', 'name': 'Sideloadly', 'desc': 'জেলব্রেক ছাড়া আইওএস অ্যাপ সাইডলোড করুন।', 'category': 'সাইডলোডিং', 'url': 'https://sideloadly.io/', 'install': 'PC তে ইনস্টল করুন, Apple ID দিয়ে IPA সাইন করুন'},
            {'id': 'i3', 'name': 'TrollStore', 'desc': 'আইওএস 14-16 এ IPA স্থায়ীভাবে ইনস্টল করুন।', 'category': 'সাইডলোডিং', 'url': 'https://github.com/opa334/TrollStore', 'install': 'iOS ভার্সন অনুযায়ী ইনস্টল গাইড দেখুন'},
            {'id': 'i4', 'name': 'Checkra1n', 'desc': 'iPhone 5s থেকে iPhone X পর্যন্ত জেলব্রেক।', 'category': 'জেলব্রেক', 'url': 'https://checkra.in/', 'install': 'Mac/Linux এ ইনস্টল করুন, ডিভাইস DFU মোডে করুন'},
            {'id': 'i5', 'name': 'Unc0ver', 'desc': 'iOS 11.0-14.3 এর জন্য জেলব্রেক।', 'category': 'জেলব্রেক', 'url': 'https://unc0ver.dev/', 'install': 'AltStore/Sideloadly দিয়ে সাইডলোড করুন'},
            {'id': 'i6', 'name': 'Dopamine', 'desc': 'iOS 15.0-16.6.1 এর জন্য জেলব্রেক।', 'category': 'জেলব্রেক', 'url': 'https://github.com/opa334/Dopamine', 'install': 'TrollStore বা সাইডলোড দিয়ে ইনস্টল করুন'},
            {'id': 'i7', 'name': 'iMazing', 'desc': 'ম্যাক এবং PC এর জন্য আইওএস ডিভাইস ম্যানেজমেন্ট টুল।', 'category': 'ম্যানেজমেন্ট', 'url': 'https://imazing.com/', 'install': 'ওয়েবসাইট থেকে PC/Mac এ ইনস্টল করুন'},
            {'id': 'i8', 'name': '3uTools', 'desc': 'আইওএস ডিভাইসের জন্য অল-ইন-ওয়ান টুল।', 'category': 'ম্যানেজমেন্ট', 'url': 'https://www.3u.com/', 'install': 'ওয়েবসাইট থেকে Windows এ ইনস্টল করুন'},
            {'id': 'i9', 'name': 'Odysseyn1x', 'desc': 'লিনাক্স-ভিত্তিক checkra1n জেলব্রেক লাইভ USB।', 'category': 'জেলব্রেক', 'url': 'https://github.com/raspberry-pi-flutter/odysseyn1x', 'install': 'USB তে ফ্লাশ করে বুট করুন'},
            {'id': 'i10', 'name': 'iOS Repo Updater', 'desc': 'জেলব্রেক রেপো এবং প্যাকেজ আপডেট করুন।', 'category': 'জেলব্রেক', 'url': 'https://github.com/Coercions/iOS-Repo-Updater', 'install': 'Cydia/Sileo থেকে ইনস্টল করুন'},
            {'id': 'i11', 'name': 'AltDaemon', 'desc': 'কম্পিউটার ছাড়া AltStore রিফ্রেশ করুন।', 'category': 'সাইডলোডিং', 'url': 'https://github.com/rileytestut/AltDaemon', 'install': 'জেলব্রেককৃত ডিভাইসে Cydia থেকে ইনস্টল করুন'},
        ]
    },
    'cross-platform': {
        'name': 'Cross Platform',
        'name_bn': 'ক্রস প্ল্যাটফর্ম',
        'count': 20,
        'tools': [
            {'id': 'c1', 'name': 'Ventoy', 'desc': 'বুটেবল USB সমাধান - শুধু ISO ফাইল কপি করুন।', 'category': 'বুটেবল', 'url': 'https://www.ventoy.net/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করে USB তে ইনস্টল করুন'},
            {'id': 'c2', 'name': 'BalenaEtcher', 'desc': 'SD কার্ড এবং USB ড্রাইভে OS ইমেজ ফ্লাশ করুন।', 'category': 'বুটেবল', 'url': 'https://www.balena.io/etcher/', 'install': 'ওয়েবসাইট থেকে আপনার OS এর জন্য ডাউনলোড করুন'},
            {'id': 'c3', 'name': 'RustDesk', 'desc': 'ওপেন সোর্স রিমোট ডেস্কটপ সফটওয়্যার।', 'category': 'রিমোট', 'url': 'https://rustdesk.com/', 'install': 'ওয়েবসাইট থেকে আপনার OS এর জন্য ডাউনলোড করুন'},
            {'id': 'c4', 'name': 'AnyDesk', 'desc': 'দ্রুত রিমোট ডেস্কটপ অ্যাপ্লিকেশন।', 'category': 'রিমোট', 'url': 'https://anydesk.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c5', 'name': 'VLC Media Player', 'desc': 'ফ্রি ওপেন সোর্স ক্রস-প্ল্যাটফর্ম মাল্টিমিডিয়া প্লেয়ার।', 'category': 'মিডিয়া', 'url': 'https://www.videolan.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন বা প্যাকেজ ম্যানেজার ব্যবহার করুন'},
            {'id': 'c6', 'name': 'Obsidian', 'desc': 'ব্যক্তিগত এবং নমনীয় নোট-টেকিং অ্যাপ।', 'category': 'প্রোডাক্টিভিটি', 'url': 'https://obsidian.md/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c7', 'name': 'VS Code', 'desc': 'ডিবাগিং এবং Git সহ ফ্রি কোড এডিটর।', 'category': 'ডেভেলপমেন্ট', 'url': 'https://code.visualstudio.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c8', 'name': 'Bitwarden', 'desc': 'ওপেন সোর্স পাসওয়ার্ড ম্যানেজার।', 'category': 'সিকিউরিটি', 'url': 'https://bitwarden.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন বা ব্রাউজার এক্সটেনশন ইনস্টল করুন'},
            {'id': 'c9', 'name': 'ProtonVPN', 'desc': 'শক্তিশালী প্রাইভেসি সহ ফ্রি VPN সার্ভিস।', 'category': 'VPN', 'url': 'https://protonvpn.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c10', 'name': 'KeePassXC', 'desc': 'ক্রস-প্ল্যাটফর্ম কমিউনিটি-চালিত পাসওয়ার্ড ম্যানেজার।', 'category': 'সিকিউরিটি', 'url': 'https://keepassxc.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন বা প্যাকেজ ম্যানেজার ব্যবহার করুন'},
            {'id': 'c11', 'name': 'PeaZip', 'desc': 'সব প্রধান আর্কাইভ ফরম্যাটের জন্য ফ্রি ফাইল আর্কাইভার ইউটিলিটি।', 'category': 'ইউটিলিটি', 'url': 'https://peazip.github.io/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c12', 'name': 'Joplin', 'desc': 'ওপেন সোর্স নোট-টেকিং এবং টু-ডু অ্যাপ্লিকেশন।', 'category': 'প্রোডাক্টিভিটি', 'url': 'https://joplinapp.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c13', 'name': 'ONLYOFFICE', 'desc': 'ডকুমেন্ট, স্প্রেডশীট, প্রেজেন্টেশনের জন্য ফ্রি অফিস স্যুট।', 'category': 'প্রোডাক্টিভিটি', 'url': 'https://www.onlyoffice.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c14', 'name': 'LibreOffice', 'desc': 'ফ্রি এবং শক্তিশালী ওপেন সোর্স অফিস স্যুট।', 'category': 'প্রোডাক্টিভিটি', 'url': 'https://www.libreoffice.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন বা প্যাকেজ ম্যানেজার ব্যবহার করুন'},
            {'id': 'c15', 'name': 'Audacity', 'desc': 'ফ্রি, ওপেন সোর্স, ক্রস-প্ল্যাটফর্ম অডিও এডিটর।', 'category': 'মিডিয়া', 'url': 'https://www.audacityteam.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c16', 'name': 'KeePass', 'desc': 'ফ্রি, ওপেন সোর্স, লাইট-ওয়েট পাসওয়ার্ড ম্যানেজার। প্লাগইন সহ ক্রস-প্ল্যাটফর্ম।', 'category': 'সিকিউরিটি', 'url': 'https://keepass.info/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c17', 'name': 'GIMP', 'desc': 'ফ্রি এবং ওপেন-সোর্স ইমেজ এডিটর। প্রফেশনাল-গ্রেড ফটো ম্যানিপুলেশন।', 'category': 'মিডিয়া', 'url': 'https://www.gimp.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c18', 'name': 'Inkscape', 'desc': 'ফ্রি ভেক্টর গ্রাফিক্স এডিটর। পেশাদারভাবে SVG ফাইল তৈরি এবং সম্পাদনা করুন।', 'category': 'মিডিয়া', 'url': 'https://inkscape.org/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c19', 'name': 'OBS Studio', 'desc': 'ভিডিও রেকর্ডিং এবং লাইভ স্ট্রিমিংয়ের জন্য ফ্রি এবং ওপেন সোর্স সফটওয়্যার।', 'category': 'মিডিয়া', 'url': 'https://obsproject.com/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
            {'id': 'c20', 'name': 'Veracrypt', 'desc': 'শক্তিশালী সিকিউরিটি সহ ফ্রি ওপেন সোর্স ডিস্ক এনক্রিপশন। ক্রস-প্ল্যাটফর্ম।', 'category': 'সিকিউরিটি', 'url': 'https://www.veracrypt.fr/', 'install': 'ওয়েবসাইট থেকে ডাউনলোড করুন'},
        ]
    }
}

def create_pdf():
    """Create the complete guide PDF in Bengali"""
    
    output_path = "/home/z/my-project/public/System_Toolkit_Complete_Guide_V3.pdf"
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=1.5*cm,
        leftMargin=1.5*cm,
        topMargin=2*cm,
        bottomMargin=2*cm,
        title="সিস্টেম টুলকিট সম্পূর্ণ গাইড",
        author="NextGen Digital Studio"
    )
    
    story = []
    
    # Cover Page
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("সিস্টেম টুলকিট সম্পূর্ণ গাইড", title_style))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("ক্রস-প্ল্যাটফর্ম সিস্টেম ইউটিলিটি ড্যাশবোর্ড", heading2_style))
    story.append(Spacer(1, 0.3*inch))
    
    # Summary box
    summary_text = """
    এই গাইডে আপনি পাবেন: উইন্ডোজ (৪১টি), ম্যাকওএস (১৫টি), লিনাক্স (১৫টি), 
    অ্যান্ড্রয়েড (১৩টি), আইওএস (১১টি) এবং ক্রস প্ল্যাটফর্ম (২০টি) - সর্বমোট ১১৫টি টুলস ও সফটওয়্যার।
    প্রতিটি টুলের ইনস্টলেশন পদ্ধতি এবং ব্যবহারবিধি বাংলায় বিস্তারিত আলোচনা করা হয়েছে।
    """
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 0.5*inch))
    
    # Stats table
    stats_data = [
        ['প্ল্যাটফর্ম', 'টুলস সংখ্যা'],
        ['উইন্ডোজ', '৪১'],
        ['ম্যাকওএস', '১৫'],
        ['লিনাক্স', '১৫'],
        ['অ্যান্ড্রয়েড', '১৩'],
        ['আইওএস', '১১'],
        ['ক্রস প্ল্যাটফর্ম', '২০'],
        ['সর্বমোট', '১১৫'],
    ]
    
    stats_table = Table(stats_data, colWidths=[3*inch, 2*inch])
    stats_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Bengali'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, PRIMARY_COLOR),
        ('BACKGROUND', (0, -1), (-1, -1), ACCENT_COLOR),
        ('TEXTCOLOR', (0, -1), (-1, -1), white),
        ('ROWHEIGHT', (0, 0), (-1, -1), 25),
    ]))
    story.append(stats_table)
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Paragraph("সূচিপত্র", heading1_style))
    story.append(Spacer(1, 0.2*inch))
    
    toc_items = [
        "১. উইন্ডোজ টুলস (৪১টি)",
        "২. ম্যাকওএস টুলস (১৫টি)",
        "৩. লিনাক্স টুলস (১৫টি)",
        "৪. অ্যান্ড্রয়েড টুলস (১৩টি)",
        "৫. আইওএস টুলস (১১টি)",
        "৬. ক্রস প্ল্যাটফর্ম টুলস (২০টি)",
    ]
    
    for item in toc_items:
        story.append(Paragraph(f"• {item}", body_style))
    
    story.append(PageBreak())
    
    # Generate content for each platform
    section_num = 1
    for platform_key, platform_data in TOOLS_DATA.items():
        # Section header
        story.append(Paragraph(
            f"{section_num}. {platform_data['name_bn']} টুলস ({platform_data['count']}টি)",
            heading1_style
        ))
        story.append(Spacer(1, 0.2*inch))
        
        # Group tools by category
        categories = {}
        for tool in platform_data['tools']:
            cat = tool['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(tool)
        
        # Tools by category
        for category, tools in categories.items():
            story.append(Paragraph(f"◆ {category}", heading2_style))
            
            for tool in tools:
                # Tool name
                story.append(Paragraph(
                    f"<b>{tool['name']}</b>",
                    tool_name_style
                ))
                
                # Description
                story.append(Paragraph(
                    f"<b>বিবরণ:</b> {tool['desc']}",
                    desc_style
                ))
                
                # Installation
                story.append(Paragraph(
                    f"<b>ইনস্টলেশন:</b> {tool['install']}",
                    desc_style
                ))
                
                # URL
                story.append(Paragraph(
                    f"<b>লিংক:</b> {tool['url']}",
                    desc_style
                ))
                
                story.append(Spacer(1, 0.1*inch))
        
        story.append(PageBreak())
        section_num += 1
    
    # Important Notes Section
    story.append(Paragraph("গুরুত্বপূর্ণ নোট", heading1_style))
    story.append(Spacer(1, 0.2*inch))
    
    notes = [
        "সকল টুল ব্যবহারের আগে আপনার গুরুত্বপূর্ণ ডাটা ব্যাকআপ করুন।",
        "অ্যাডভান্সড রিস্ক লেভেলের টুলস ব্যবহারে সতর্ক থাকুন।",
        "জেলব্রেক/রুট করার আগে ডিভাইসের ওয়ারেন্টি সম্পর্কে জানুন।",
        "ফ্রি সফটওয়্যার ব্যবহার করুন এবং ওপেন সোর্স কমিউনিটিকে সাপোর্ট করুন।",
        "নিয়মিত আপডেট রাখুন আপনার সকল সফটওয়্যার।",
    ]
    
    for note in notes:
        story.append(Paragraph(f"• {note}", body_style))
    
    story.append(Spacer(1, 0.3*inch))
    
    # Footer
    story.append(Paragraph(
        "এই গাইড NextGen Digital Studio দ্বারা প্রস্তুতকৃত।",
        ParagraphStyle('Footer', fontName='Bengali', fontSize=10, textColor=ACCENT_COLOR, alignment=TA_CENTER)
    ))
    
    # Build PDF
    doc.build(story)
    print(f"PDF generated: {output_path}")
    return output_path

if __name__ == "__main__":
    create_pdf()
