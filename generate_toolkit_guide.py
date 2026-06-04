#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
System Toolkit PDF Guide Generator
Generates a comprehensive PDF guide for all tools and software across 6 platforms
"""

import os
import sys

# Setup PDF skill path
PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
scripts_dir = os.path.join(PDF_SKILL_DIR, "scripts")
if scripts_dir not in sys.path:
    sys.path.insert(0, scripts_dir)

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, 
    PageBreak, KeepTogether, Image, ListFlowable, ListItem
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ============ FONT SETUP ============
# Register Chinese fonts - use available fonts
try:
    pdfmetrics.registerFont(TTFont('NotoSansSC', '/usr/share/fonts/truetype/chinese/NotoSansSC[wght].ttf'))
except:
    pass

try:
    pdfmetrics.registerFont(TTFont('NotoSerifSC', '/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Medium.ttf'))
except:
    pass

# Register DejaVu fonts for English/Unicode
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

# Register font families
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# ============ COLOR PALETTE ============
# Professional blue-gray palette
ACCENT = colors.HexColor('#2563eb')
TEXT_PRIMARY = colors.HexColor('#1f2937')
TEXT_MUTED = colors.HexColor('#6b7280')
BG_SURFACE = colors.HexColor('#f3f4f6')
BG_PAGE = colors.HexColor('#ffffff')
TABLE_HEADER = colors.HexColor('#1e40af')
TABLE_ROW_ALT = colors.HexColor('#eff6ff')

# ============ TOOLS DATA ============
TOOLS_DATA = {
    "windows": {
        "name": "Windows",
        "name_bn": "উইন্ডোজ",
        "count": 30,
        "tools": [
            {"id": "w1", "name": "Chris Titus Tech Windows Utility", "desc": "Ultimate Windows debloat and optimization tool. Remove bloatware, optimize settings, install essential apps.", "category": "System Optimization", "risk": "Safe", "install": 'irm "https://christitus.com/win" | iex', "usage": "Run in PowerShell as Administrator. Select options from the GUI menu.", "url": "https://christitus.com/windows-tool/"},
            {"id": "w2", "name": "Windows Debloat Script", "desc": "Remove pre-installed apps, disable telemetry, optimize Windows performance.", "category": "System Optimization", "risk": "Moderate", "install": 'iwr -useb https://git.io/debloat | iex', "usage": "Run in PowerShell as Administrator. Follow on-screen prompts.", "url": "https://github.com/Sycnex/Windows10Debloater"},
            {"id": "w3", "name": "O&O ShutUp10++", "desc": "Free antispy tool for Windows 10 and 11. Control what data Windows sends.", "category": "Privacy", "risk": "Safe", "install": "Download from official website and run the portable executable.", "usage": "Open the application, review each setting, apply recommended settings.", "url": "https://www.oo-software.com/en/shutup10"},
            {"id": "w4", "name": "Bulk Crap Uninstaller", "desc": "Remove large amounts of unwanted programs quickly and thoroughly.", "category": "Uninstaller", "risk": "Safe", "install": "Download from official website or use winget: winget install BCUninstaller", "usage": "Launch the app, scan for programs, select and uninstall.", "url": "https://www.bcuninstaller.com/"},
            {"id": "w5", "name": "SDI (Snappy Driver Installer)", "desc": "Install and update drivers for free. No ads, no bundled software.", "category": "Drivers", "risk": "Safe", "install": "Download from official website, extract and run.", "usage": "Download driver packs, scan system, select drivers to install.", "url": "https://sdi-tool.org/"},
            {"id": "w6", "name": "Microsoft Activation Scripts (MAS)", "desc": "Open-source Windows and Office activator.", "category": "Activation", "risk": "Advanced", "install": 'irm https://massgrave.dev/get | iex', "usage": "Run in PowerShell as Administrator, select activation method.", "url": "https://github.com/massgravel/Microsoft-Activation-Scripts"},
            {"id": "w7", "name": "Chocolatey", "desc": "Package manager for Windows. Install software with one command.", "category": "Package Manager", "risk": "Safe", "install": 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))', "usage": "Use 'choco install <package>' to install software.", "url": "https://chocolatey.org/"},
            {"id": "w8", "name": "Winget", "desc": "Official Windows Package Manager by Microsoft.", "category": "Package Manager", "risk": "Safe", "install": "Pre-installed on Windows 11. On Windows 10, install from Microsoft Store.", "usage": "Open CMD/PowerShell, use 'winget install <package-name>'.", "url": "https://github.com/microsoft/winget-cli"},
            {"id": "w9", "name": "HWiNFO", "desc": "Comprehensive hardware analysis, monitoring and reporting.", "category": "Hardware", "risk": "Safe", "install": "Download from official website and install.", "usage": "Run the application to view detailed hardware information.", "url": "https://www.hwinfo.com/"},
            {"id": "w10", "name": "HWMonitor", "desc": "Hardware monitoring program that reads PC systems health sensors.", "category": "Hardware", "risk": "Safe", "install": "Download from official website and install.", "usage": "Launch to monitor temperatures, voltages, fan speeds.", "url": "https://www.cpuid.com/softwares/hwmonitor.html"},
            {"id": "w11", "name": "CrystalDiskInfo", "desc": "Monitor SSD/HDD health status and temperature.", "category": "Hardware", "risk": "Safe", "install": "Download from official website and install.", "usage": "Open the app to view disk health status.", "url": "https://crystalmark.info/en/software/crystaldiskinfo/"},
            {"id": "w12", "name": "MemTest86", "desc": "Industry standard for RAM memory testing.", "category": "Diagnostics", "risk": "Safe", "install": "Download, create bootable USB, boot from USB.", "usage": "Boot from USB drive, tests run automatically.", "url": "https://www.memtest86.com/"},
            {"id": "w13", "name": "Rufus", "desc": "Create bootable USB drives easily.", "category": "Utilities", "risk": "Safe", "install": "Download from official website (portable or installer).", "usage": "Select ISO file, select USB drive, click Start.", "url": "https://rufus.ie/"},
            {"id": "w14", "name": "Ventoy", "desc": "Bootable USB solution. Just copy ISO files to USB.", "category": "Utilities", "risk": "Safe", "install": "Download, run Ventoy2Disk.exe to install on USB.", "usage": "Copy ISO files to the Ventoy USB drive, boot from it.", "url": "https://www.ventoy.net/"},
            {"id": "w15", "name": "PowerToys", "desc": "Microsoft power user utilities for Windows.", "category": "Utilities", "risk": "Safe", "install": "winget install Microsoft.PowerToys", "usage": "Access via system tray, configure individual tools.", "url": "https://github.com/microsoft/PowerToys"},
            {"id": "w16", "name": "Everything", "desc": "Instant file search for Windows. Lightning fast.", "category": "Search", "risk": "Safe", "install": "Download from official website or winget install voidtools.Everything", "usage": "Open Everything, type filename to search instantly.", "url": "https://www.voidtools.com/"},
            {"id": "w17", "name": "7-Zip", "desc": "Free open-source file archiver with high compression ratio.", "category": "Utilities", "risk": "Safe", "install": "winget install 7zip.7zip", "usage": "Right-click files/folders to compress or extract.", "url": "https://www.7-zip.org/"},
            {"id": "w18", "name": "Malwarebytes", "desc": "Anti-malware software for Windows, Mac, and mobile.", "category": "Security", "risk": "Safe", "install": "Download from official website and install.", "usage": "Run scans to detect and remove malware.", "url": "https://www.malwarebytes.com/"},
            {"id": "w19", "name": "VeraCrypt", "desc": "Free open-source disk encryption software.", "category": "Security", "risk": "Safe", "install": "Download from official website and install.", "usage": "Create encrypted containers or encrypt drives.", "url": "https://www.veracrypt.fr/"},
            {"id": "w20", "name": "BleachBit", "desc": "Clean your system and free disk space.", "category": "Cleanup", "risk": "Moderate", "install": "winget install BleachBit.BleachBit", "usage": "Select items to clean, preview, then delete.", "url": "https://www.bleachbit.org/"},
            {"id": "w21", "name": "Geek Uninstaller", "desc": "Efficient and fast small uninstaller.", "category": "Uninstaller", "risk": "Safe", "install": "Download portable version from official website.", "usage": "Launch, right-click program to uninstall.", "url": "https://geekuninstaller.com/"},
            {"id": "w22", "name": "Tron Script", "desc": "Automatic system cleanup and repair script for Windows.", "category": "System Repair", "risk": "Advanced", "install": "Download from GitHub, extract, run as Admin.", "usage": "Run tron.bat as Administrator, follow prompts.", "url": "https://github.com/bmrf/tron"},
            {"id": "w23", "name": "System File Checker (SFC)", "desc": "Scan and restore corrupted Windows system files.", "category": "System Repair", "risk": "Safe", "install": "sfc /scannow", "usage": "Open CMD as Administrator, run 'sfc /scannow'.", "url": "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc"},
            {"id": "w24", "name": "Disk Check (CHKDSK)", "desc": "Check disk for errors and bad sectors.", "category": "Diagnostics", "risk": "Safe", "install": "chkdsk /r", "usage": "Open CMD as Admin, run 'chkdsk C: /r'.", "url": "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk"},
            {"id": "w25", "name": "DISM System Repair", "desc": "Repair Windows image and component store.", "category": "System Repair", "risk": "Safe", "install": "dism.exe /online /cleanup-image /restorehealth", "usage": "Open CMD as Admin, run DISM commands.", "url": "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/dism-operating-system-package-servicing-command-line-options"},
            {"id": "w26", "name": "GPU Driver Uninstaller (DDU)", "desc": "Display Driver Uninstaller - remove GPU drivers completely.", "category": "Drivers", "risk": "Safe", "install": "Download from official website, extract and run.", "usage": "Run in Safe Mode, select GPU brand, clean and restart.", "url": "https://www.wagnardsoft.com/display-driver-uninstaller-ddu-"},
            {"id": "w27", "name": "Windows Update Reset", "desc": "Reset Windows Update components to fix update issues.", "category": "System Repair", "risk": "Safe", "install": "net stop wuauserv && net stop bits && net stop cryptsvc", "usage": "Run commands in CMD as Administrator.", "url": "https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-resources"},
            {"id": "w28", "name": "DNS Flush & Reset", "desc": "Flush DNS cache and reset network stack.", "category": "Network", "risk": "Safe", "install": "ipconfig /flushdns && ipconfig /registerdns", "usage": "Open CMD as Admin, run the commands.", "url": "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig"},
            {"id": "w29", "name": "Temp File Cleaner", "desc": "Clean all temporary files from Windows.", "category": "Cleanup", "risk": "Safe", "install": "del /q/f/s %TEMP%\\*", "usage": "Run in CMD to clean temp files.", "url": "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/del"},
            {"id": "w30", "name": "PowerPlan Switcher", "desc": "Switch to High Performance power plan.", "category": "Performance", "risk": "Safe", "install": "powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c", "usage": "Run in CMD as Administrator.", "url": "https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options"},
        ]
    },
    "macos": {
        "name": "macOS",
        "name_bn": "ম্যাকওএস",
        "count": 15,
        "tools": [
            {"id": "m1", "name": "AppCleaner", "desc": "Completely uninstall apps from your Mac.", "category": "Uninstaller", "risk": "Safe", "install": "Download from freemacsoft.net, drag to Applications.", "usage": "Drag app to AppCleaner window, click Delete.", "url": "https://freemacsoft.net/appcleaner/"},
            {"id": "m2", "name": "Homebrew", "desc": "The missing package manager for macOS.", "category": "Package Manager", "risk": "Safe", "install": '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', "usage": "Use 'brew install <package>' to install software.", "url": "https://brew.sh/"},
            {"id": "m3", "name": "Onyx", "desc": "Maintenance and optimization tool for macOS.", "category": "System", "risk": "Moderate", "install": "Download from titanium-software.fr, install and run.", "usage": "Select maintenance tasks, execute.", "url": "https://www.titanium-software.fr/en/onyx.html"},
            {"id": "m4", "name": "CleanMyMac X", "desc": "All-in-one package to tidy up your Mac.", "category": "Cleanup", "risk": "Safe", "install": "Download from cleanmymac.com, install.", "usage": "Scan system, review and clean.", "url": "https://cleanmymac.com/"},
            {"id": "m5", "name": "Amphetamine", "desc": "Prevent your Mac from sleeping.", "category": "Utilities", "risk": "Safe", "install": "Install from Mac App Store.", "usage": "Click menu bar icon to start/stop session.", "url": "https://apps.apple.com/us/app/amphetamine/id937984704"},
            {"id": "m6", "name": "AppTrap", "desc": "Automatically remove associated files when uninstalling.", "category": "Uninstaller", "risk": "Safe", "install": "Download from onnati.net, install preference pane.", "usage": "Enable in System Preferences, drag apps to trash.", "url": "https://onnati.net/apptrap/"},
            {"id": "m7", "name": "Tuxera NTFS", "desc": "Full read-write access to NTFS drives on Mac.", "category": "Utilities", "risk": "Safe", "install": "Download from tuxera.com, install.", "usage": "NTFS drives work automatically after install.", "url": "https://www.tuxera.com/products/tuxera-ntfs-for-mac/"},
            {"id": "m8", "name": "Disk Inventory X", "desc": "Disk usage utility for Mac.", "category": "Storage", "risk": "Safe", "install": "Download from derlien.com, install.", "usage": "Open and select drive to analyze.", "url": "http://www.derlien.com/"},
            {"id": "m9", "name": "EtreCheck", "desc": "Diagnose and troubleshoot Mac issues.", "category": "Diagnostics", "risk": "Safe", "install": "Download from etrecheck.com, run.", "usage": "Click 'Start Check' to diagnose issues.", "url": "https://etrecheck.com/"},
            {"id": "m10", "name": "Malwarebytes for Mac", "desc": "Mac anti-malware protection.", "category": "Security", "risk": "Safe", "install": "Download from malwarebytes.com, install.", "usage": "Run scans to detect and remove malware.", "url": "https://www.malwarebytes.com/mac/"},
            {"id": "m11", "name": "Little Snitch", "desc": "Monitor and control network connections.", "category": "Security", "risk": "Safe", "install": "Download from obdev.at, install.", "usage": "Configure rules for app network access.", "url": "https://www.obdev.at/products/littlesnitch/"},
            {"id": "m12", "name": "Carbon Copy Cloner", "desc": "Create bootable backups of your Mac.", "category": "Backup", "risk": "Safe", "install": "Download from bombich.com, install.", "usage": "Select source and destination, clone.", "url": "https://bombich.com/"},
            {"id": "m13", "name": "Stats", "desc": "System monitor in the menu bar.", "category": "Monitoring", "risk": "Safe", "install": "brew install --cask stats", "usage": "View system stats in menu bar.", "url": "https://github.com/exelban/stats"},
            {"id": "m14", "name": "Rectangle", "desc": "Move and resize windows using keyboard shortcuts.", "category": "Window Management", "risk": "Safe", "install": "brew install --cask rectangle", "usage": "Use shortcuts like Ctrl+Option+Arrow to snap windows.", "url": "https://rectangleapp.com/"},
            {"id": "m15", "name": "HiddenBar", "desc": "Hide menu bar items to keep it clean.", "category": "Utilities", "risk": "Safe", "install": "brew install --cask hiddenbar", "usage": "Drag items to hidden section in menu bar.", "url": "https://github.com/dwarvesf/hidden"},
        ]
    },
    "linux": {
        "name": "Linux",
        "name_bn": "লিনাক্স",
        "count": 15,
        "tools": [
            {"id": "l1", "name": "Ubuntu Cleaner", "desc": "Clean up your Ubuntu system.", "category": "Cleanup", "risk": "Safe", "install": "sudo apt install ubuntu-cleaner", "usage": "Launch from applications, select items to clean.", "url": "https://github.com/gerardpuig/ubuntu-cleaner"},
            {"id": "l2", "name": "Stacer", "desc": "Linux system optimizer and monitoring tool.", "category": "System", "risk": "Safe", "install": "sudo apt install stacer", "usage": "Launch Stacer, use dashboard for optimization.", "url": "https://github.com/oguzhaninan/Stacer"},
            {"id": "l3", "name": "BleachBit for Linux", "desc": "Clean your Linux system and free disk space.", "category": "Cleanup", "risk": "Moderate", "install": "sudo apt install bleachbit", "usage": "Run bleachbit, select items, clean.", "url": "https://www.bleachbit.org/"},
            {"id": "l4", "name": "Timeshift", "desc": "System restore tool for Linux.", "category": "Backup", "risk": "Safe", "install": "sudo apt install timeshift", "usage": "Create and restore system snapshots.", "url": "https://github.com/teejee2008/timeshift"},
            {"id": "l5", "name": "GParted", "desc": "Partition editor for graphically managing disk partitions.", "category": "Storage", "risk": "Advanced", "install": "sudo apt install gparted", "usage": "Launch GParted, select disk, modify partitions.", "url": "https://gparted.org/"},
            {"id": "l6", "name": "htop", "desc": "Interactive process viewer for Linux.", "category": "Monitoring", "risk": "Safe", "install": "sudo apt install htop", "usage": "Run 'htop' in terminal to view processes.", "url": "https://htop.dev/"},
            {"id": "l7", "name": "Neofetch", "desc": "Display system information in terminal.", "category": "Utilities", "risk": "Safe", "install": "sudo apt install neofetch", "usage": "Run 'neofetch' in terminal.", "url": "https://github.com/dylanaraps/neofetch"},
            {"id": "l8", "name": "Terminator", "desc": "Terminal emulator with multiple terminals in one window.", "category": "Terminal", "risk": "Safe", "install": "sudo apt install terminator", "usage": "Launch Terminator, use Ctrl+Shift+E/O to split.", "url": "https://gnometerminator.blogspot.com/"},
            {"id": "l9", "name": "ClamAV", "desc": "Open source antivirus engine for detecting trojans and malware.", "category": "Security", "risk": "Safe", "install": "sudo apt install clamav", "usage": "Run 'sudo freshclam' to update, 'clamscan -r /path' to scan.", "url": "https://www.clamav.net/"},
            {"id": "l10", "name": "UFW", "desc": "Uncomplicated Firewall for managing netfilter.", "category": "Security", "risk": "Moderate", "install": "sudo apt install ufw", "usage": "sudo ufw enable, sudo ufw allow <port>.", "url": "https://launchpad.net/ufw"},
            {"id": "l11", "name": "GDebi", "desc": "Install .deb packages with automatic dependency resolution.", "category": "Package Manager", "risk": "Safe", "install": "sudo apt install gdebi", "usage": "sudo gdebi package.deb", "url": "https://launchpad.net/gdebi"},
            {"id": "l12", "name": "Synaptic", "desc": "Graphical package management tool.", "category": "Package Manager", "risk": "Safe", "install": "sudo apt install synaptic", "usage": "Launch Synaptic, search and manage packages.", "url": "https://www.nongnu.org/synaptic/"},
            {"id": "l13", "name": "Hardinfo", "desc": "System profiler and benchmark tool.", "category": "Diagnostics", "risk": "Safe", "install": "sudo apt install hardinfo", "usage": "Launch hardinfo to view system info and run benchmarks.", "url": "https://github.com/lpereira/hardinfo"},
            {"id": "l14", "name": "KSysGuard", "desc": "System monitor for KDE Plasma.", "category": "Monitoring", "risk": "Safe", "install": "sudo apt install ksysguard", "usage": "Launch from applications to monitor system.", "url": "https://apps.kde.org/ksysguard/"},
            {"id": "l15", "name": "Lutris", "desc": "Open gaming platform for Linux.", "category": "Gaming", "risk": "Safe", "install": "sudo apt install lutris", "usage": "Launch Lutris, install games from library.", "url": "https://lutris.net/"},
        ]
    },
    "android": {
        "name": "Android",
        "name_bn": "অ্যান্ড্রয়েড",
        "count": 13,
        "tools": [
            {"id": "a1", "name": "SD Maid SE", "desc": "System cleaning tool for Android.", "category": "Cleanup", "risk": "Safe", "install": "Download from GitHub or Play Store.", "usage": "Grant storage access, run scans to clean.", "url": "https://github.com/d4rken-org/sdmaid-se"},
            {"id": "a2", "name": "Shizuku", "desc": "Use system APIs directly with ADB/root privileges.", "category": "System", "risk": "Moderate", "install": "Install from Play Store, enable via ADB.", "usage": "Enable via wireless debugging, grant apps Shizuku access.", "url": "https://shizuku.rikka.app/"},
            {"id": "a3", "name": "App Manager", "desc": "Full-featured package manager for Android.", "category": "Package Manager", "risk": "Moderate", "install": "Download from GitHub or F-Droid.", "usage": "Grant permissions, manage installed apps.", "url": "https://github.com/MuntashirAkon/AppManager"},
            {"id": "a4", "name": "Termux", "desc": "Terminal emulator and Linux environment app.", "category": "Terminal", "risk": "Safe", "install": "Install from F-Droid or GitHub.", "usage": "Launch Termux, use Linux commands.", "url": "https://termux.com/"},
            {"id": "a5", "name": "ADB AppControl", "desc": "Manage Android apps via ADB from PC.", "category": "Management", "risk": "Moderate", "install": "Download from adbappcontrol.com, run on PC.", "usage": "Enable USB debugging, connect device, manage apps.", "url": "https://adbappcontrol.com/"},
            {"id": "a6", "name": "Universal Android Debloater", "desc": "Remove bloatware from any Android device.", "category": "Debloat", "risk": "Moderate", "install": "Download from GitHub, enable USB debugging.", "usage": "Run on PC with device connected, select packages to remove.", "url": "https://github.com/0x192/universal-android-debloater"},
            {"id": "a7", "name": "Franco Kernel Manager", "desc": "Kernel manager for rooted devices.", "category": "System", "risk": "Advanced", "install": "Install from Play Store (requires root).", "usage": "Grant root access, manage kernel settings.", "url": "https://play.google.com/store/apps/details?id=com.franco.kernel"},
            {"id": "a8", "name": "Magisk", "desc": "Systemless root solution for Android.", "category": "Root", "risk": "Advanced", "install": "Download APK from GitHub, flash via recovery.", "usage": "Install Magisk app, manage modules and root access.", "url": "https://github.com/topjohnwu/Magisk"},
            {"id": "a9", "name": "Greenify", "desc": "Hibernation app to save battery.", "category": "Battery", "risk": "Safe", "install": "Install from Play Store.", "usage": "Select apps to hibernate, enable aggressive doze.", "url": "https://play.google.com/store/apps/details?id=com.oasisfeng.greenify"},
            {"id": "a10", "name": "Blokada", "desc": "Free DNS changer and ad blocker for Android.", "category": "Privacy", "risk": "Safe", "install": "Download from blokada.org or Play Store.", "usage": "Enable VPN, select DNS provider, block ads.", "url": "https://blokada.org/"},
            {"id": "a11", "name": "NetGuard", "desc": "No-root firewall for Android.", "category": "Security", "risk": "Safe", "install": "Install from GitHub or Play Store.", "usage": "Enable VPN, configure per-app firewall rules.", "url": "https://github.com/M66B/NetGuard"},
            {"id": "a12", "name": "CPU Float", "desc": "Monitor CPU, GPU, and RAM usage as overlay.", "category": "Monitoring", "risk": "Safe", "install": "Install from Play Store.", "usage": "Enable overlay permission, view stats on screen.", "url": "https://play.google.com/store/apps/details?id=com.cgw.cputemp"},
            {"id": "a13", "name": "Amarok", "desc": "Hide apps and files on Android.", "category": "Privacy", "risk": "Safe", "install": "Download from GitHub.", "usage": "Select apps/files to hide, toggle visibility.", "url": "https://github.com/deltazefiro/Amarok-Hider"},
        ]
    },
    "ios": {
        "name": "iOS",
        "name_bn": "আইওএস",
        "count": 11,
        "tools": [
            {"id": "i1", "name": "AltStore", "desc": "Alternative App Store for iOS - sideload apps.", "category": "Sideloading", "risk": "Safe", "install": "Download from altstore.io, install via AltServer.", "usage": "Connect to PC/Mac, sideload apps via AltStore.", "url": "https://altstore.io/"},
            {"id": "i2", "name": "Sideloadly", "desc": "Sideload iOS apps without jailbreak.", "category": "Sideloading", "risk": "Safe", "install": "Download from sideloadly.io, install on PC.", "usage": "Connect iOS device, select IPA, start sideload.", "url": "https://sideloadly.io/"},
            {"id": "i3", "name": "TrollStore", "desc": "Install IPAs permanently on iOS 14-16.", "category": "Sideloading", "risk": "Moderate", "install": "Install via TrollHelper or TrollInstaller.", "usage": "Open TrollStore, install IPA files permanently.", "url": "https://github.com/opa334/TrollStore"},
            {"id": "i4", "name": "Checkra1n", "desc": "Jailbreak for iPhone 5s through iPhone X.", "category": "Jailbreak", "risk": "Advanced", "install": "Download from checkra.in, create bootable USB.", "usage": "Boot into DFU mode, run checkra1n.", "url": "https://checkra.in/"},
            {"id": "i5", "name": "Unc0ver", "desc": "Jailbreak for iOS 11.0-14.3.", "category": "Jailbreak", "risk": "Advanced", "install": "Sideload IPA via AltStore or Sideloadly.", "usage": "Open unc0ver app, tap 'Jailbreak'.", "url": "https://unc0ver.dev/"},
            {"id": "i6", "name": "Dopamine", "desc": "Jailbreak for iOS 15.0-16.6.1.", "category": "Jailbreak", "risk": "Advanced", "install": "Sideload via TrollStore or AltStore.", "usage": "Open Dopamine, tap 'Jailbreak'.", "url": "https://github.com/opa334/Dopamine"},
            {"id": "i7", "name": "iMazing", "desc": "iOS device management tool for Mac and PC.", "category": "Management", "risk": "Safe", "install": "Download from imazing.com, install.", "usage": "Connect device, manage backups, transfers, apps.", "url": "https://imazing.com/"},
            {"id": "i8", "name": "3uTools", "desc": "All-in-one tool for iOS devices.", "category": "Management", "risk": "Safe", "install": "Download from 3u.com, install on Windows.", "usage": "Connect device, use various management features.", "url": "https://www.3u.com/"},
            {"id": "i9", "name": "Odysseyn1x", "desc": "Linux-based checkra1n jailbreak live USB.", "category": "Jailbreak", "risk": "Advanced", "install": "Flash ISO to USB, boot from USB.", "usage": "Boot from USB, run checkra1n.", "url": "https://github.com/raspberry-pi-flutter/odysseyn1x"},
            {"id": "i10", "name": "iOS Repo Updater", "desc": "Update jailbreak repos and packages.", "category": "Jailbreak", "risk": "Moderate", "install": "Install from Cydia/Sileo.", "usage": "Run to update package sources.", "url": "https://github.com/Coercions/iOS-Repo-Updater"},
            {"id": "i11", "name": "AltDaemon", "desc": "Enable AltStore refresh without computer.", "category": "Sideloading", "risk": "Moderate", "install": "Install via TrollStore or jailbreak.", "usage": "Enables AltStore to refresh apps wirelessly.", "url": "https://github.com/rileytestut/AltDaemon"},
        ]
    },
    "cross-platform": {
        "name": "Cross Platform",
        "name_bn": "ক্রস প্ল্যাটফর্ম",
        "count": 15,
        "tools": [
            {"id": "c1", "name": "Ventoy", "desc": "Bootable USB solution - just copy ISO files.", "category": "Bootable", "risk": "Safe", "install": "Download from ventoy.net, install on USB.", "usage": "Copy ISO files to Ventoy USB, boot from it.", "url": "https://www.ventoy.net/"},
            {"id": "c2", "name": "BalenaEtcher", "desc": "Flash OS images to SD cards & USB drives.", "category": "Bootable", "risk": "Safe", "install": "Download from balena.io/etcher, install.", "usage": "Select ISO, select drive, click Flash.", "url": "https://www.balena.io/etcher/"},
            {"id": "c3", "name": "RustDesk", "desc": "Open source remote desktop software.", "category": "Remote", "risk": "Safe", "install": "Download from rustdesk.com, install.", "usage": "Enter remote ID, connect for remote access.", "url": "https://rustdesk.com/"},
            {"id": "c4", "name": "AnyDesk", "desc": "Fast remote desktop application.", "category": "Remote", "risk": "Safe", "install": "Download from anydesk.com, install.", "usage": "Share your ID or enter remote ID to connect.", "url": "https://anydesk.com/"},
            {"id": "c5", "name": "VLC Media Player", "desc": "Free open source cross-platform multimedia player.", "category": "Media", "risk": "Safe", "install": "Download from videolan.org, install.", "usage": "Open VLC, drag media files to play.", "url": "https://www.videolan.org/"},
            {"id": "c6", "name": "Obsidian", "desc": "Private and flexible note-taking app.", "category": "Productivity", "risk": "Safe", "install": "Download from obsidian.md, install.", "usage": "Create vault, write notes in Markdown.", "url": "https://obsidian.md/"},
            {"id": "c7", "name": "VS Code", "desc": "Free code editor with debugging and Git.", "category": "Development", "risk": "Safe", "install": "Download from code.visualstudio.com, install.", "usage": "Open folder, edit code, use extensions.", "url": "https://code.visualstudio.com/"},
            {"id": "c8", "name": "Bitwarden", "desc": "Open source password manager.", "category": "Security", "risk": "Safe", "install": "Download from bitwarden.com or use browser extension.", "usage": "Create account, save and autofill passwords.", "url": "https://bitwarden.com/"},
            {"id": "c9", "name": "ProtonVPN", "desc": "Free VPN service with strong privacy.", "category": "VPN", "risk": "Safe", "install": "Download from protonvpn.com, install.", "usage": "Create account, connect to VPN servers.", "url": "https://protonvpn.com/"},
            {"id": "c10", "name": "KeePassXC", "desc": "Cross-platform community-driven password manager.", "category": "Security", "risk": "Safe", "install": "Download from keepassxc.org, install.", "usage": "Create database, store passwords securely.", "url": "https://keepassxc.org/"},
            {"id": "c11", "name": "PeaZip", "desc": "Free file archiver utility for all major archive formats.", "category": "Utilities", "risk": "Safe", "install": "Download from peazip.github.io, install.", "usage": "Right-click files to compress or extract.", "url": "https://peazip.github.io/"},
            {"id": "c12", "name": "Joplin", "desc": "Open source note-taking and to-do application.", "category": "Productivity", "risk": "Safe", "install": "Download from joplinapp.org, install.", "usage": "Create notebooks, write notes in Markdown.", "url": "https://joplinapp.org/"},
            {"id": "c13", "name": "ONLYOFFICE", "desc": "Free office suite for documents, spreadsheets, presentations.", "category": "Productivity", "risk": "Safe", "install": "Download from onlyoffice.com, install.", "usage": "Create and edit office documents.", "url": "https://www.onlyoffice.com/"},
            {"id": "c14", "name": "LibreOffice", "desc": "Free and powerful open source office suite.", "category": "Productivity", "risk": "Safe", "install": "Download from libreoffice.org, install.", "usage": "Open apps for Writer, Calc, Impress, etc.", "url": "https://www.libreoffice.org/"},
            {"id": "c15", "name": "Audacity", "desc": "Free, open source, cross-platform audio editor.", "category": "Media", "risk": "Safe", "install": "Download from audacityteam.org, install.", "usage": "Open audio files, edit, apply effects, export.", "url": "https://www.audacityteam.org/"},
        ]
    }
}

# ============ STYLES ============
def get_styles():
    styles = getSampleStyleSheet()
    
    # Title style
    styles.add(ParagraphStyle(
        name='MainTitle',
        fontName='DejaVuSans-Bold',
        fontSize=28,
        leading=36,
        alignment=TA_CENTER,
        textColor=ACCENT,
        spaceAfter=12
    ))
    
    # Subtitle style
    styles.add(ParagraphStyle(
        name='Subtitle',
        fontName='DejaVuSans',
        fontSize=14,
        leading=20,
        alignment=TA_CENTER,
        textColor=TEXT_MUTED,
        spaceAfter=24
    ))
    
    # Section header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='DejaVuSans-Bold',
        fontSize=18,
        leading=24,
        textColor=ACCENT,
        spaceBefore=18,
        spaceAfter=12
    ))
    
    # Tool name
    styles.add(ParagraphStyle(
        name='ToolName',
        fontName='DejaVuSans',
        fontSize=12,
        leading=16,
        textColor=TEXT_PRIMARY,
        spaceBefore=6,
        spaceAfter=3
    ))
    
    # Tool description
    styles.add(ParagraphStyle(
        name='ToolDesc',
        fontName='DejaVuSans',
        fontSize=10,
        leading=14,
        textColor=TEXT_MUTED,
        spaceAfter=3
    ))
    
    # Code/Command style
    styles.add(ParagraphStyle(
        name='Command',
        fontName='DejaVuSans',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#dc2626'),
        backColor=BG_SURFACE,
        leftIndent=10,
        rightIndent=10,
        spaceBefore=3,
        spaceAfter=3
    ))
    
    # Category style
    styles.add(ParagraphStyle(
        name='Category',
        fontName='DejaVuSans',
        fontSize=10,
        leading=14,
        textColor=ACCENT,
        spaceBefore=6,
        spaceAfter=6
    ))
    
    return styles

# ============ HELPER FUNCTIONS ============
def create_tool_table(tool, styles):
    """Create a table for a single tool"""
    # Risk badge color
    risk_colors = {
        'Safe': colors.HexColor('#22c55e'),
        'Moderate': colors.HexColor('#f59e0b'),
        'Advanced': colors.HexColor('#ef4444')
    }
    risk_color = risk_colors.get(tool['risk'], TEXT_MUTED)
    
    # Build content
    content = []
    
    # Tool name with category
    name_para = Paragraph(f"<b>{tool['name']}</b>", styles['ToolName'])
    category_para = Paragraph(f"<font color='#{ACCENT.hexval()[2:]}'>{tool['category']}</font>", styles['Category'])
    
    # Description
    desc_para = Paragraph(tool['desc'], styles['ToolDesc'])
    
    # Installation command
    install_para = Paragraph(f"<font color='#dc2626'>{tool['install']}</font>", styles['Command'])
    
    # Usage
    usage_para = Paragraph(f"<b>Usage:</b> {tool['usage']}", styles['ToolDesc'])
    
    # URL
    url_para = Paragraph(f"<font color='#{ACCENT.hexval()[2:]}'><link href='{tool['url']}'>{tool['url']}</link></font>", styles['ToolDesc'])
    
    # Create data for table
    data = [
        [Paragraph(f"<b>Tool:</b>", styles['ToolDesc']), name_para],
        [Paragraph(f"<b>Category:</b>", styles['ToolDesc']), category_para],
        [Paragraph(f"<b>Risk:</b>", styles['ToolDesc']), Paragraph(f"<font color='#{risk_color.hexval()[2:]}'>{tool['risk']}</font>", styles['ToolDesc'])],
        [Paragraph(f"<b>Description:</b>", styles['ToolDesc']), desc_para],
        [Paragraph(f"<b>Install:</b>", styles['ToolDesc']), install_para],
        [Paragraph(f"<b>Usage:</b>", styles['ToolDesc']), usage_para],
        [Paragraph(f"<b>URL:</b>", styles['ToolDesc']), url_para],
    ]
    
    table = Table(data, colWidths=[80, 400])
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LINEBELOW', (0, -1), (-1, -1), 0.5, TEXT_MUTED),
    ]))
    
    return table

# ============ MAIN GENERATOR ============
def generate_pdf():
    output_path = "/home/z/my-project/public/System_Toolkit_Complete_Guide.pdf"
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=1*inch,
        rightMargin=1*inch,
        topMargin=1*inch,
        bottomMargin=1*inch
    )
    
    styles = get_styles()
    story = []
    
    # ============ COVER PAGE ============
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("System Toolkit", styles['MainTitle']))
    story.append(Paragraph("Complete Installation & Usage Guide", styles['Subtitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Cross-Platform Tools & Software", styles['Subtitle']))
    story.append(Spacer(1, 1*inch))
    
    # Platform summary
    summary_data = [
        ["Platform", "Tools Count"],
        ["Windows", "30"],
        ["macOS", "15"],
        ["Linux", "15"],
        ["Android", "13"],
        ["iOS", "11"],
        ["Cross Platform", "15"],
        ["Total", "99"]
    ]
    
    summary_table = Table(summary_data, colWidths=[200, 100])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('BACKGROUND', (0, 1), (-1, 1), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 3), (-1, 3), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 5), (-1, 5), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 7), (-1, 7), ACCENT),
        ('TEXTCOLOR', (0, 7), (-1, 7), colors.white),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(summary_table)
    
    story.append(Spacer(1, 1*inch))
    story.append(Paragraph("Developed by NextGen Digital Studio", styles['Subtitle']))
    story.append(Paragraph("https://www.facebook.com/nextgendigitalstudio", styles['Subtitle']))
    
    story.append(PageBreak())
    
    # ============ TABLE OF CONTENTS ============
    story.append(Paragraph("Table of Contents", styles['SectionHeader']))
    story.append(Spacer(1, 12))
    
    toc_data = [["Section", "Platform", "Tools"]]
    page_num = 3
    for idx, (platform_key, platform_data) in enumerate(TOOLS_DATA.items()):
        toc_data.append([str(idx + 1), platform_data['name'], str(platform_data['count'])])
    
    toc_table = Table(toc_data, colWidths=[60, 200, 80])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('BACKGROUND', (0, 1), (-1, 1), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 3), (-1, 3), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 5), (-1, 5), TABLE_ROW_ALT),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(toc_table)
    
    story.append(PageBreak())
    
    # ============ TOOL SECTIONS ============
    for platform_key, platform_data in TOOLS_DATA.items():
        # Section header
        story.append(Paragraph(f"{platform_data['name']} ({platform_data['name_bn']})", styles['SectionHeader']))
        story.append(Paragraph(f"Total Tools: {platform_data['count']}", styles['Subtitle']))
        story.append(Spacer(1, 12))
        
        # Tools
        for idx, tool in enumerate(platform_data['tools'], 1):
            # Tool header with number
            tool_header = Paragraph(f"<b>{idx}. {tool['name']}</b>", styles['ToolName'])
            story.append(tool_header)
            
            # Tool table
            tool_table = create_tool_table(tool, styles)
            story.append(tool_table)
            story.append(Spacer(1, 8))
        
        story.append(PageBreak())
    
    # ============ FOOTER ============
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Thank you for using System Toolkit!", styles['MainTitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Copyright and Developed by NextGen Digital Studio", styles['Subtitle']))
    story.append(Paragraph("https://www.facebook.com/nextgendigitalstudio", styles['Subtitle']))
    
    # Build PDF
    doc.build(story)
    print(f"PDF generated successfully: {output_path}")
    return output_path

if __name__ == "__main__":
    generate_pdf()
