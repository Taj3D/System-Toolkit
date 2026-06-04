#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
System Toolkit Complete PDF Guide Generator V2
Comprehensive guide for 114 tools across 6 platforms
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
    PageBreak, KeepTogether, ListFlowable, ListItem
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ============ FONT SETUP ============
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans-Bold', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
registerFontFamily('DejaVuSans', normal='DejaVuSans', bold='DejaVuSans-Bold')

# ============ COLOR PALETTE ============
ACCENT = colors.HexColor('#2563eb')
TEXT_PRIMARY = colors.HexColor('#1f2937')
TEXT_MUTED = colors.HexColor('#6b7280')
BG_SURFACE = colors.HexColor('#f3f4f6')
BG_PAGE = colors.HexColor('#ffffff')
TABLE_HEADER = colors.HexColor('#1e40af')
TABLE_ROW_ALT = colors.HexColor('#eff6ff')
SAFE_GREEN = colors.HexColor('#22c55e')
MODERATE_YELLOW = colors.HexColor('#f59e0b')
ADVANCED_RED = colors.HexColor('#ef4444')

# ============ COMPLETE TOOLS DATA ============
WINDOWS_TOOLS = [
    {"id": "w1", "name": "Chris Titus Tech Windows Utility", "desc": "Ultimate Windows debloat and optimization tool. Remove bloatware, optimize settings, install essential apps.", "category": "System Optimization", "risk": "safe", "rating": 5.0, "downloads": "2M+", "install": 'PowerShell: irm "https://christitus.com/win" | iex', "usage": "Run in PowerShell as Administrator. A GUI will open with various options for debloating, tweaking, and installing apps. Select the options you want and click Apply."},
    {"id": "w1b", "name": "Windows Optimizer Script", "desc": "Comprehensive Windows 10/11 optimization script. Disables telemetry, removes bloatware, improves performance.", "category": "System Optimization", "risk": "safe", "rating": 4.9, "downloads": "1M+", "install": 'PowerShell: irm "https://christitus.com/win" | iex', "usage": "Run in PowerShell as Admin. Follow the on-screen menu to select optimization options."},
    {"id": "w2", "name": "Windows Debloat Script", "desc": "Remove pre-installed apps, disable telemetry, optimize Windows performance.", "category": "System Optimization", "risk": "moderate", "rating": 4.8, "downloads": "1.5M+", "install": 'PowerShell: iwr -useb https://git.io/debloat | iex', "usage": "Run in PowerShell as Administrator. The script will present options for removing bloatware and disabling telemetry."},
    {"id": "w3", "name": "O&O ShutUp10++", "desc": "Free antispy tool for Windows 10 and 11. Control what data Windows sends to Microsoft.", "category": "Privacy", "risk": "safe", "rating": 4.9, "downloads": "3M+", "install": "Download from oo-software.com, run the portable executable.", "usage": "Open the application, review each privacy setting, apply recommended or custom settings to disable telemetry."},
    {"id": "w4", "name": "Bulk Crap Uninstaller", "desc": "Remove large amounts of unwanted programs quickly and thoroughly.", "category": "Uninstaller", "risk": "safe", "rating": 4.7, "downloads": "2M+", "install": "winget install BCUninstaller OR download from bcuninstaller.com", "usage": "Launch the app, let it scan for programs, select multiple programs, and uninstall them in batch."},
    {"id": "w5", "name": "SDI (Snappy Driver Installer)", "desc": "Install and update drivers for free. No ads, no bundled software.", "category": "Drivers", "risk": "safe", "rating": 4.6, "downloads": "5M+", "install": "Download from sdi-tool.org, extract and run.", "usage": "Download driver packs via the app, scan your system, select drivers to install, and click Install."},
    {"id": "w6", "name": "Microsoft Activation Scripts (MAS)", "desc": "Open-source Windows and Office activator using HWID/KMS methods.", "category": "Activation", "risk": "advanced", "rating": 4.9, "downloads": "10M+", "install": 'PowerShell: irm https://massgrave.dev/get | iex', "usage": "Run in PowerShell as Admin, select activation method (HWID for permanent, KMS for renewal), follow prompts."},
    {"id": "w7", "name": "Chocolatey", "desc": "Package manager for Windows. Install software with one command.", "category": "Package Manager", "risk": "safe", "rating": 4.8, "downloads": "8M+", "install": 'PowerShell: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))', "usage": "Use 'choco install <package>' to install software. Example: choco install firefox, choco install vscode"},
    {"id": "w8", "name": "Winget", "desc": "Official Windows Package Manager by Microsoft.", "category": "Package Manager", "risk": "safe", "rating": 4.5, "downloads": "50M+", "install": "Pre-installed on Windows 11. Windows 10: Install from Microsoft Store or via Windows Update.", "usage": "Open CMD/PowerShell and use: winget search <app>, winget install <app>, winget update --all"},
    {"id": "w9", "name": "HWiNFO", "desc": "Comprehensive hardware analysis, monitoring and reporting tool.", "category": "Hardware", "risk": "safe", "rating": 4.8, "downloads": "4M+", "install": "Download from hwinfo.com, install or run portable version.", "usage": "Run the application to see detailed hardware info, sensors, and monitoring. Use logging for long-term monitoring."},
    {"id": "w10", "name": "HWMonitor", "desc": "Hardware monitoring program that reads PC health sensors (temps, voltages, fans).", "category": "Hardware", "risk": "safe", "rating": 4.6, "downloads": "3M+", "install": "Download from cpuid.com, install and run.", "usage": "Launch to monitor CPU/GPU temperatures, voltages, fan speeds in real-time."},
    {"id": "w11", "name": "CrystalDiskInfo", "desc": "Monitor SSD/HDD health status, temperature, and S.M.A.R.T. attributes.", "category": "Hardware", "risk": "safe", "rating": 4.7, "downloads": "6M+", "install": "Download from crystalmark.info, install or run portable.", "usage": "Open the app to view disk health status (Good/Caution/Bad) and detailed S.M.A.R.T. data."},
    {"id": "w12", "name": "MemTest86", "desc": "Industry standard for RAM memory testing. Boots from USB.", "category": "Diagnostics", "risk": "safe", "rating": 4.9, "downloads": "4M+", "install": "Download from memtest86.com, create bootable USB using Rufus.", "usage": "Boot from the USB drive. Tests run automatically. Let it complete at least 4 passes for reliable results."},
    {"id": "w13", "name": "Rufus", "desc": "Create bootable USB drives from ISO files easily and quickly.", "category": "Utilities", "risk": "safe", "rating": 4.9, "downloads": "20M+", "install": "Download from rufus.ie (portable or installer).", "usage": "Insert USB, select ISO file, select USB drive, configure options, click Start."},
    {"id": "w14", "name": "Ventoy", "desc": "Bootable USB solution. Just copy ISO files to USB - no need to reformat.", "category": "Utilities", "risk": "safe", "rating": 4.8, "downloads": "8M+", "install": "Download from ventoy.net, run Ventoy2Disk.exe to install on USB.", "usage": "After installing Ventoy on USB, simply copy ISO files to the USB drive. Boot from USB and select ISO from menu."},
    {"id": "w15", "name": "PowerToys", "desc": "Microsoft power user utilities: FancyZones, PowerRename, Shortcut Guide, etc.", "category": "Utilities", "risk": "safe", "rating": 4.7, "downloads": "15M+", "install": "winget install Microsoft.PowerToys OR Microsoft Store", "usage": "Access via system tray. Enable/disable individual tools. FancyZones for window management, PowerRename for batch renaming."},
    {"id": "w16", "name": "Everything", "desc": "Instant file search for Windows. Lightning fast indexing and search.", "category": "Search", "risk": "safe", "rating": 4.9, "downloads": "10M+", "install": "winget install voidtools.Everything OR download from voidtools.com", "usage": "Open Everything, start typing filename. Results appear instantly. Use operators like AND, OR, NOT for advanced search."},
    {"id": "w17", "name": "7-Zip", "desc": "Free open-source file archiver with high compression ratio.", "category": "Utilities", "risk": "safe", "rating": 4.9, "downloads": "50M+", "install": "winget install 7zip.7zip OR download from 7-zip.org", "usage": "Right-click files/folders to compress or extract. Supports 7z, ZIP, RAR, TAR, and many more formats."},
    {"id": "w18", "name": "Malwarebytes", "desc": "Anti-malware software for Windows, Mac, and mobile.", "category": "Security", "risk": "safe", "rating": 4.6, "downloads": "25M+", "install": "Download from malwarebytes.com, install and run.", "usage": "Run a scan to detect malware. Use real-time protection (Premium) for ongoing protection."},
    {"id": "w19", "name": "VeraCrypt", "desc": "Free open-source disk encryption software. Successor to TrueCrypt.", "category": "Security", "risk": "safe", "rating": 4.8, "downloads": "5M+", "install": "Download from veracrypt.fr, install and run.", "usage": "Create encrypted file containers or encrypt entire partitions/drives. Use strong passwords."},
    {"id": "w20", "name": "BleachBit", "desc": "Clean your system and free disk space. Similar to CCleaner but open source.", "category": "Cleanup", "risk": "moderate", "rating": 4.5, "downloads": "8M+", "install": "winget install BleachBit.BleachBit OR download from bleachbit.org", "usage": "Select items to clean (cache, temp files, etc.), preview, then delete. Be careful with application data."},
    {"id": "w21", "name": "Geek Uninstaller", "desc": "Efficient and fast small uninstaller. Portable, no installation needed.", "category": "Uninstaller", "risk": "safe", "rating": 4.6, "downloads": "3M+", "install": "Download portable version from geekuninstaller.com", "usage": "Launch, find program in list, right-click to uninstall or force uninstall."},
    {"id": "w22", "name": "Tron Script", "desc": "Automatic system cleanup and repair script for Windows. Comprehensive repair tool.", "category": "System Repair", "risk": "advanced", "rating": 4.4, "downloads": "2M+", "install": "Download from github.com/bmrf/tron, extract, run as Admin.", "usage": "Run tron.bat as Administrator. Script runs through multiple cleanup and repair stages automatically."},
    {"id": "w23", "name": "System File Checker (SFC)", "desc": "Scan and restore corrupted Windows system files. Built-in Windows tool.", "category": "System Repair", "risk": "safe", "rating": 5.0, "downloads": "50M+", "install": "Built-in Windows command. No installation needed.", "usage": "Open Command Prompt as Administrator, run: sfc /scannow. Wait for scan to complete and follow instructions."},
    {"id": "w24", "name": "Disk Check (CHKDSK)", "desc": "Check disk for errors and bad sectors. Repairs file system issues.", "category": "Diagnostics", "risk": "safe", "rating": 4.9, "downloads": "30M+", "install": "Built-in Windows command. No installation needed.", "usage": "Open CMD as Admin: chkdsk C: /r (replace C: with desired drive). May require restart for system drive."},
    {"id": "w25", "name": "DISM System Repair", "desc": "Repair Windows image and component store. Fixes Windows Update issues.", "category": "System Repair", "risk": "safe", "rating": 4.8, "downloads": "20M+", "install": "Built-in Windows command. No installation needed.", "usage": "CMD as Admin: dism.exe /online /cleanup-image /restorehealth. Then: dism.exe /online /cleanup-image /startcomponentcleanup"},
    {"id": "w26", "name": "Windows Server Setup", "desc": "Convert Windows 11 to Windows Server edition. Advanced setup tool.", "category": "System Setup", "risk": "advanced", "rating": 4.5, "downloads": "1M+", "install": "Requires Windows 11 installation media and specific setup files.", "usage": "Advanced: Run setup.exe with /product server switch. Requires specific Windows build."},
    {"id": "w27", "name": "Windows Activation (MAS)", "desc": "Open-source Windows and Office activator. HWID and KMS activation methods.", "category": "Activation", "risk": "advanced", "rating": 5.0, "downloads": "15M+", "install": 'PowerShell: irm https://get.activated.win | iex', "usage": "Run as Admin in PowerShell. Select activation type: HWID (permanent), Ohook (Office), KMS (renewal)."},
    {"id": "w28", "name": "RaphiRe Debloat", "desc": "Modern Windows debloat tool. Clean, fast, and effective for Windows 10/11.", "category": "System Optimization", "risk": "safe", "rating": 4.9, "downloads": "500K+", "install": 'PowerShell: & ([scriptblock]::Create((irm "https://debloat.raphi.re/")))', "usage": "Run in PowerShell as Admin. Select options to debloat, remove bloatware, and optimize Windows."},
    {"id": "w29", "name": "Chris Titus Dev Tool", "desc": "Windows Dev utility for advanced system management and tweaks.", "category": "System Optimization", "risk": "safe", "rating": 4.9, "downloads": "3M+", "install": 'PowerShell: irm "https://christitus.com/windev" | iex', "usage": "Run as Admin. Access developer-focused tools, advanced tweaks, and system configurations."},
    {"id": "w30", "name": "Windows Update Reset", "desc": "Reset Windows Update components to fix update issues.", "category": "System Repair", "risk": "safe", "rating": 4.8, "downloads": "10M+", "install": "Built-in commands. No installation needed.", "usage": "CMD as Admin: net stop wuauserv && net stop bits && net stop cryptsvc, then rename folders, then start services."},
    {"id": "w31", "name": "DNS Flush & Reset", "desc": "Flush DNS cache and reset network stack. Fixes network connectivity issues.", "category": "Network", "risk": "safe", "rating": 4.9, "downloads": "20M+", "install": "Built-in Windows commands.", "usage": "CMD as Admin: ipconfig /flushdns && ipconfig /registerdns && ipconfig /release && ipconfig /renew && netsh winsock reset"},
    {"id": "w32", "name": "GPU Driver Uninstaller (DDU)", "desc": "Display Driver Uninstaller - Completely remove GPU drivers for clean install.", "category": "Drivers", "risk": "safe", "rating": 4.9, "downloads": "15M+", "install": "Download from wagnardsoft.com, extract and run.", "usage": "Best in Safe Mode. Select GPU type (NVIDIA/AMD/Intel), click 'Clean and restart'. Install new drivers after."},
    {"id": "w33", "name": "NVCleanstall", "desc": "Custom NVIDIA driver installer. Remove telemetry, install only needed components.", "category": "Drivers", "risk": "safe", "rating": 4.7, "downloads": "5M+", "install": "Download from techpowerup.com, run the installer.", "usage": "Select driver version, customize components to install (remove telemetry, HD audio, etc.), install."},
    {"id": "w34", "name": "Windows Tweaker (SophiApp)", "desc": "Modern Windows 10/11 tweaker with 100+ options. Open source and safe.", "category": "System Optimization", "risk": "safe", "rating": 4.8, "downloads": "2M+", "install": 'PowerShell: irm https://sophia.community/install | iex', "usage": "Run as Admin. Select tweaks from categories: Privacy, System, UWP Apps, etc. Apply selected tweaks."},
    {"id": "w35", "name": "Glary Utilities", "desc": "All-in-one system utilities for PC optimization, repair, and maintenance.", "category": "System Optimization", "risk": "safe", "rating": 4.6, "downloads": "25M+", "install": "Download from glarysoft.com, install and run.", "usage": "One-click maintenance for quick cleanup, or use individual tools for specific tasks."},
    {"id": "w36", "name": "Windows Defender Configurator", "desc": "Configure Windows Defender settings. Enable/disable real-time protection.", "category": "Security", "risk": "moderate", "rating": 4.5, "downloads": "1M+", "install": "Download from github.com/AndyFul/ConfigureDefender, run portable executable.", "usage": "Select protection level or customize individual Defender settings."},
    {"id": "w37", "name": "Temp File Cleaner", "desc": "Clean all temporary files from Windows. Free up disk space instantly.", "category": "Cleanup", "risk": "safe", "rating": 4.7, "downloads": "30M+", "install": "Built-in Windows commands.", "usage": "CMD: del /q/f/s %TEMP%\\* && del /q/f/s C:\\Windows\\Temp\\* OR use Disk Cleanup (cleanmgr)"},
    {"id": "w38", "name": "PowerPlan Switcher", "desc": "Switch to High Performance power plan for maximum system performance.", "category": "Performance", "risk": "safe", "rating": 4.6, "downloads": "15M+", "install": "Built-in Windows powercfg command.", "usage": "CMD as Admin: powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c (High Performance GUID)"},
    {"id": "w39", "name": "Privazer", "desc": "Deep system cleaner that removes traces of your activities permanently.", "category": "Privacy", "risk": "moderate", "rating": 4.7, "downloads": "8M+", "install": "Download from privazer.com, install and run.", "usage": "Select areas to clean, choose cleaning level, run scan and clean. Can securely delete files."},
]

MACOS_TOOLS = [
    {"id": "m1", "name": "AppCleaner", "desc": "Completely uninstall apps from your Mac along with associated files.", "category": "Uninstaller", "risk": "safe", "rating": 4.9, "downloads": "5M+", "install": "Download from freemacsoft.net, drag to Applications.", "usage": "Drag app to AppCleaner window, it finds related files, click Delete to remove completely."},
    {"id": "m2", "name": "Homebrew", "desc": "The missing package manager for macOS. Install software via command line.", "category": "Package Manager", "risk": "safe", "rating": 4.9, "downloads": "20M+", "install": 'Terminal: /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"', "usage": "brew install <package> to install, brew uninstall <package> to remove, brew search <name> to find packages."},
    {"id": "m3", "name": "Onyx", "desc": "Maintenance and optimization tool for macOS. Access hidden system settings.", "category": "System", "risk": "moderate", "rating": 4.5, "downloads": "3M+", "install": "Download from titanium-software.fr for your macOS version, install and run.", "usage": "Select maintenance tasks, verify disk, clean caches, configure hidden settings. Use with caution."},
    {"id": "m4", "name": "CleanMyMac X", "desc": "All-in-one package to tidy up your Mac. Cleanup, optimization, protection.", "category": "Cleanup", "risk": "safe", "rating": 4.4, "downloads": "10M+", "install": "Download from cleanmymac.com, install (paid with free trial).", "usage": "Scan system, review items to clean, click Clean. Also has optimization and malware removal features."},
    {"id": "m5", "name": "Amphetamine", "desc": "Prevent your Mac from sleeping. Keep system awake for downloads, tasks.", "category": "Utilities", "risk": "safe", "rating": 4.8, "downloads": "2M+", "install": "Install from Mac App Store.", "usage": "Click menu bar icon to start session. Set duration or trigger-based conditions to keep Mac awake."},
    {"id": "m6", "name": "AppTrap", "desc": "Automatically remove associated files when uninstalling apps.", "category": "Uninstaller", "risk": "safe", "rating": 4.3, "downloads": "500K+", "install": "Download from onnati.net, install as preference pane.", "usage": "Enable in System Preferences. When you drag apps to trash, it prompts to remove related files."},
    {"id": "m7", "name": "Tuxera NTFS", "desc": "Full read-write access to NTFS drives on Mac.", "category": "Utilities", "risk": "safe", "rating": 4.5, "downloads": "2M+", "install": "Download from tuxera.com, install (paid with trial).", "usage": "After installation, NTFS drives work with full read-write access automatically."},
    {"id": "m8", "name": "Disk Inventory X", "desc": "Disk usage utility for Mac. Visualize what's taking up space.", "category": "Storage", "risk": "safe", "rating": 4.4, "downloads": "1M+", "install": "Download from derlien.com, install.", "usage": "Open and select drive to analyze. Visual map shows file sizes. Click to navigate folders."},
    {"id": "m9", "name": "EtreCheck", "desc": "Diagnose and troubleshoot Mac issues. Generate system reports.", "category": "Diagnostics", "risk": "safe", "rating": 4.7, "downloads": "1M+", "install": "Download from etrecheck.com, run (no installation needed).", "usage": "Click 'Start Check' to scan system. Review report for issues, adware, hardware problems."},
    {"id": "m10", "name": "Malwarebytes for Mac", "desc": "Mac anti-malware protection. Scan and remove malware.", "category": "Security", "risk": "safe", "rating": 4.5, "downloads": "5M+", "install": "Download from malwarebytes.com/mac, install.", "usage": "Run scan to detect malware. Premium offers real-time protection."},
    {"id": "m11", "name": "Little Snitch", "desc": "Monitor and control network connections. See what apps connect where.", "category": "Security", "risk": "safe", "rating": 4.8, "downloads": "1M+", "install": "Download from obdev.at, install (paid with trial).", "usage": "Configure rules for each app's network access. Monitor connections in real-time."},
    {"id": "m12", "name": "Carbon Copy Cloner", "desc": "Create bootable backups of your Mac. Disaster recovery solution.", "category": "Backup", "risk": "safe", "rating": 4.9, "downloads": "2M+", "install": "Download from bombich.com, install (paid with trial).", "usage": "Select source and destination drive, configure schedule, create bootable backup."},
    {"id": "m13", "name": "Stats", "desc": "System monitor in the menu bar. Free and open source.", "category": "Monitoring", "risk": "safe", "rating": 4.8, "downloads": "3M+", "install": "brew install --cask stats OR download from GitHub.", "usage": "Displays CPU, memory, disk, network stats in menu bar. Customizable sensors."},
    {"id": "m14", "name": "Rectangle", "desc": "Move and resize windows using keyboard shortcuts or snap areas.", "category": "Window Management", "risk": "safe", "rating": 4.9, "downloads": "5M+", "install": "brew install --cask rectangle OR download from rectangleapp.com.", "usage": "Use shortcuts like Ctrl+Option+Arrow to snap windows. Drag windows to edges for snapping."},
    {"id": "m15", "name": "HiddenBar", "desc": "Hide menu bar items to keep it clean and organized.", "category": "Utilities", "risk": "safe", "rating": 4.6, "downloads": "1M+", "install": "brew install --cask hiddenbar OR download from GitHub.", "usage": "Drag items between visible and hidden sections. Click the arrow to show/hide hidden items."},
]

LINUX_TOOLS = [
    {"id": "l1", "name": "Ubuntu Cleaner", "desc": "Clean up your Ubuntu system. Remove cache, old kernels, unused packages.", "category": "Cleanup", "risk": "safe", "rating": 4.4, "downloads": "500K+", "install": "sudo apt install ubuntu-cleaner", "usage": "Launch from applications, select items to clean, click Clean."},
    {"id": "l2", "name": "Stacer", "desc": "Linux system optimizer and monitoring tool with modern UI.", "category": "System", "risk": "safe", "rating": 4.7, "downloads": "1M+", "install": "sudo apt install stacer", "usage": "Dashboard shows system info. Use tabs for cleanup, startup apps, services, uninstaller."},
    {"id": "l3", "name": "BleachBit for Linux", "desc": "Clean your Linux system and free disk space. Open source.", "category": "Cleanup", "risk": "moderate", "rating": 4.5, "downloads": "2M+", "install": "sudo apt install bleachbit", "usage": "Run bleachbit (or sudo bleachbit for system), select items, preview then clean."},
    {"id": "l4", "name": "Timeshift", "desc": "System restore tool for Linux. Create and restore snapshots.", "category": "Backup", "risk": "safe", "rating": 4.8, "downloads": "3M+", "install": "sudo apt install timeshift", "usage": "Configure backup location, create snapshots, restore when needed. Like System Restore in Windows."},
    {"id": "l5", "name": "GParted", "desc": "Partition editor for graphically managing disk partitions.", "category": "Storage", "risk": "advanced", "rating": 4.7, "downloads": "5M+", "install": "sudo apt install gparted", "usage": "Launch GParted, select disk, create/delete/resize/move partitions. Backup data first!"},
    {"id": "l6", "name": "htop", "desc": "Interactive process viewer for Linux. Better than top.", "category": "Monitoring", "risk": "safe", "rating": 4.9, "downloads": "10M+", "install": "sudo apt install htop", "usage": "Run 'htop' in terminal. Use arrow keys to navigate, F6 to sort, F9 to kill processes."},
    {"id": "l7", "name": "Neofetch", "desc": "Display system information in terminal with ASCII logo.", "category": "Utilities", "risk": "safe", "rating": 4.6, "downloads": "8M+", "install": "sudo apt install neofetch", "usage": "Run 'neofetch' in terminal. Shows OS, kernel, CPU, GPU, memory, and more."},
    {"id": "l8", "name": "Terminator", "desc": "Terminal emulator with multiple terminals in one window.", "category": "Terminal", "risk": "safe", "rating": 4.5, "downloads": "2M+", "install": "sudo apt install terminator", "usage": "Ctrl+Shift+E split vertically, Ctrl+Shift+O split horizontally. Save layouts."},
    {"id": "l9", "name": "ClamAV", "desc": "Open source antivirus engine for detecting trojans and malware.", "category": "Security", "risk": "safe", "rating": 4.4, "downloads": "3M+", "install": "sudo apt install clamav clamtk", "usage": "sudo freshclam to update, clamscan -r /path to scan. Use clamtk for GUI."},
    {"id": "l10", "name": "UFW", "desc": "Uncomplicated Firewall for managing netfilter. Easy firewall setup.", "category": "Security", "risk": "moderate", "rating": 4.6, "downloads": "10M+", "install": "sudo apt install ufw", "usage": "sudo ufw enable, sudo ufw allow <port>, sudo ufw status. GUI: sudo apt install gufw"},
    {"id": "l11", "name": "GDebi", "desc": "Install .deb packages with automatic dependency resolution.", "category": "Package Manager", "risk": "safe", "rating": 4.4, "downloads": "5M+", "install": "sudo apt install gdebi", "usage": "sudo gdebi package.deb OR right-click .deb and open with GDebi."},
    {"id": "l12", "name": "Synaptic", "desc": "Graphical package management tool. Advanced apt frontend.", "category": "Package Manager", "risk": "safe", "rating": 4.6, "downloads": "8M+", "install": "sudo apt install synaptic", "usage": "Launch Synaptic, search, install, remove, lock packages. View package details and dependencies."},
    {"id": "l13", "name": "Hardinfo", "desc": "System profiler and benchmark tool.", "category": "Diagnostics", "risk": "safe", "rating": 4.4, "downloads": "1M+", "install": "sudo apt install hardinfo", "usage": "Launch hardinfo to view hardware info, run benchmarks, generate reports."},
    {"id": "l14", "name": "KSysGuard", "desc": "System monitor for KDE Plasma.", "category": "Monitoring", "risk": "safe", "rating": 4.3, "downloads": "2M+", "install": "sudo apt install ksysguard", "usage": "Launch from applications to monitor CPU, memory, network, processes."},
    {"id": "l15", "name": "Lutris", "desc": "Open gaming platform for Linux. Manage games from multiple sources.", "category": "Gaming", "risk": "safe", "rating": 4.7, "downloads": "3M+", "install": "sudo apt install lutris OR flatpak install flathub net.lutris.Lutris", "usage": "Add games, configure Wine/DXVK for Windows games, sync with Steam, Epic, etc."},
]

ANDROID_TOOLS = [
    {"id": "a1", "name": "SD Maid SE", "desc": "System cleaning tool for Android. Find and clean orphaned files.", "category": "Cleanup", "risk": "safe", "rating": 4.7, "downloads": "5M+", "install": "Download from GitHub or Play Store.", "usage": "Grant storage access, run scans to find and clean cache, corpses, duplicates, and more."},
    {"id": "a2", "name": "Shizuku", "desc": "Use system APIs directly with ADB/root privileges. No root needed.", "category": "System", "risk": "moderate", "rating": 4.8, "downloads": "10M+", "install": "Install from Play Store. Enable via Wireless Debugging.", "usage": "Enable Wireless Debugging in Developer Options, pair with Shizuku, start service. Compatible apps can use elevated permissions."},
    {"id": "a3", "name": "App Manager", "desc": "Full-featured package manager for Android. Advanced app management.", "category": "Package Manager", "risk": "moderate", "rating": 4.5, "downloads": "1M+", "install": "Download from GitHub or F-Droid.", "usage": "View, export, block, disable, uninstall apps. View permissions, trackers, components."},
    {"id": "a4", "name": "Termux", "desc": "Terminal emulator and Linux environment app. Run Linux commands.", "category": "Terminal", "risk": "safe", "rating": 4.8, "downloads": "50M+", "install": "Install from F-Droid (recommended) or GitHub.", "usage": "Launch Termux, use Linux commands. Install packages with pkg install. Can run Python, Node.js, etc."},
    {"id": "a5", "name": "ADB AppControl", "desc": "Manage Android apps via ADB from PC. Disable bloatware, backup apps.", "category": "Management", "risk": "moderate", "rating": 4.6, "downloads": "2M+", "install": "Download from adbappcontrol.com, run on PC.", "usage": "Enable USB debugging on phone, connect to PC, manage apps via ADB."},
    {"id": "a6", "name": "Universal Android Debloater", "desc": "Remove bloatware from any Android device via PC.", "category": "Debloat", "risk": "moderate", "rating": 4.7, "downloads": "3M+", "install": "Download from GitHub, enable USB debugging on phone.", "usage": "Run on PC with phone connected via ADB. Select packages to remove. Has presets for carriers/manufacturers."},
    {"id": "a7", "name": "Franco Kernel Manager", "desc": "Kernel manager for rooted devices. Tune CPU, GPU, I/O settings.", "category": "System", "risk": "advanced", "rating": 4.6, "downloads": "1M+", "install": "Install from Play Store (requires root).", "usage": "Grant root access, adjust CPU frequencies, governor, GPU settings, I/O scheduler."},
    {"id": "a8", "name": "Magisk", "desc": "Systemless root solution for Android. Root without modifying system partition.", "category": "Root", "risk": "advanced", "rating": 4.9, "downloads": "50M+", "install": "Download APK from GitHub, flash via custom recovery or patch boot image.", "usage": "Install Magisk app, manage root access, install modules for system modifications."},
    {"id": "a9", "name": "Greenify", "desc": "Hibernation app to save battery. Stop background apps.", "category": "Battery", "risk": "safe", "rating": 4.5, "downloads": "50M+", "install": "Install from Play Store.", "usage": "Add apps to hibernate list. Works better with ADB/Root. Enable aggressive doze for more battery savings."},
    {"id": "a10", "name": "Blokada", "desc": "Free DNS changer and ad blocker for Android. System-wide ad blocking.", "category": "Privacy", "risk": "safe", "rating": 4.7, "downloads": "10M+", "install": "Download from blokada.org or Play Store (Lite version).", "usage": "Enable VPN, select DNS provider (or use built-in blocklists). Blocks ads system-wide."},
    {"id": "a11", "name": "NetGuard", "desc": "No-root firewall for Android. Block internet access per-app.", "category": "Security", "risk": "safe", "rating": 4.6, "downloads": "5M+", "install": "Install from GitHub or Play Store.", "usage": "Enable VPN, toggle internet access per app. Can block WiFi and mobile data separately."},
    {"id": "a12", "name": "CPU Float", "desc": "Monitor CPU, GPU, and RAM usage as overlay on screen.", "category": "Monitoring", "risk": "safe", "rating": 4.3, "downloads": "1M+", "install": "Install from Play Store.", "usage": "Enable overlay permission, floating widget shows real-time system stats."},
    {"id": "a13", "name": "Amarok", "desc": "Hide apps and files on Android. Privacy protection tool.", "category": "Privacy", "risk": "safe", "rating": 4.4, "downloads": "500K+", "install": "Download from GitHub.", "usage": "Select apps/files to hide. They become invisible in launcher and file managers."},
]

IOS_TOOLS = [
    {"id": "i1", "name": "AltStore", "desc": "Alternative App Store for iOS. Sideload apps without jailbreak.", "category": "Sideloading", "risk": "safe", "rating": 4.6, "downloads": "5M+", "install": "Download from altstore.io, install via AltServer on PC/Mac.", "usage": "Connect iOS device to PC/Mac running AltServer, sideload apps. Refresh every 7 days (free dev account)."},
    {"id": "i2", "name": "Sideloadly", "desc": "Sideload iOS apps without jailbreak. Windows and macOS.", "category": "Sideloading", "risk": "safe", "rating": 4.5, "downloads": "3M+", "install": "Download from sideloadly.io, install on Windows or macOS.", "usage": "Connect iOS device, select IPA file, enter Apple ID, start sideload. 7-day limit on free account."},
    {"id": "i3", "name": "TrollStore", "desc": "Install IPAs permanently on iOS 14-16. No 7-day limit.", "category": "Sideloading", "risk": "moderate", "rating": 4.8, "downloads": "2M+", "install": "Install via TrollHelper (Tips app exploit) or TrollInstaller.", "usage": "After installation, open TrollStore and install any IPA permanently. No 7-day refresh needed."},
    {"id": "i4", "name": "Checkra1n", "desc": "Jailbreak for iPhone 5s through iPhone X (A7-A11). checkm8 exploit.", "category": "Jailbreak", "risk": "advanced", "rating": 4.7, "downloads": "10M+", "install": "Download from checkra.in, create bootable USB on PC/Mac.", "usage": "Boot device into DFU mode, run checkra1n. Semi-tethered (need computer to re-jailbreak after reboot)."},
    {"id": "i5", "name": "Unc0ver", "desc": "Jailbreak for iOS 11.0-14.3. Semi-untethered.", "category": "Jailbreak", "risk": "advanced", "rating": 4.6, "downloads": "8M+", "install": "Sideload IPA via AltStore or Sideloadly.", "usage": "Open unc0ver app, tap Jailbreak. Re-jailbreak after reboot. Install Cydia."},
    {"id": "i6", "name": "Dopamine", "desc": "Jailbreak for iOS 15.0-16.6.1. Rootless jailbreak.", "category": "Jailbreak", "risk": "advanced", "rating": 4.8, "downloads": "3M+", "install": "Sideload via TrollStore or AltStore.", "usage": "Open Dopamine, tap Jailbreak. Rootless design, Sileo package manager."},
    {"id": "i7", "name": "iMazing", "desc": "iOS device management tool for Mac and PC. Backup, transfer, manage.", "category": "Management", "risk": "safe", "rating": 4.7, "downloads": "5M+", "install": "Download from imazing.com, install on PC/Mac.", "usage": "Connect iOS device, manage backups, transfer photos/music/files, extract data."},
    {"id": "i8", "name": "3uTools", "desc": "All-in-one tool for iOS devices. Windows only.", "category": "Management", "risk": "safe", "rating": 4.5, "downloads": "10M+", "install": "Download from 3u.com, install on Windows.", "usage": "Flash firmware, backup/restore, manage files, view device info, jailbreak tools included."},
    {"id": "i9", "name": "Odysseyn1x", "desc": "Linux-based checkra1n jailbreak live USB. Boot and jailbreak.", "category": "Jailbreak", "risk": "advanced", "rating": 4.4, "downloads": "500K+", "install": "Flash ISO to USB, boot from USB.", "usage": "Boot from USB on PC/Mac, connect iOS device in DFU mode, run checkra1n."},
    {"id": "i10", "name": "iOS Repo Updater", "desc": "Update jailbreak repos and packages. Cydia/Sileo helper.", "category": "Jailbreak", "risk": "moderate", "rating": 4.2, "downloads": "200K+", "install": "Install from Cydia/Sileo repository.", "usage": "Run to update package sources, fix broken repos."},
    {"id": "i11", "name": "AltDaemon", "desc": "Enable AltStore refresh without computer. Requires jailbreak.", "category": "Sideloading", "risk": "moderate", "rating": 4.5, "downloads": "1M+", "install": "Install via TrollStore or Cydia (jailbreak required).", "usage": "Enables AltStore to refresh apps wirelessly without connecting to computer."},
]

CROSSPLATFORM_TOOLS = [
    {"id": "c1", "name": "Ventoy", "desc": "Bootable USB solution. Just copy ISO files to USB. Supports multiple ISOs.", "category": "Bootable", "risk": "safe", "rating": 4.9, "downloads": "15M+", "install": "Download from ventoy.net, run installer to set up USB.", "usage": "Install Ventoy on USB, copy ISO files to the USB drive. Boot from USB and select ISO from menu."},
    {"id": "c2", "name": "BalenaEtcher", "desc": "Flash OS images to SD cards & USB drives. Cross-platform.", "category": "Bootable", "risk": "safe", "rating": 4.7, "downloads": "20M+", "install": "Download from balena.io/etcher, install.", "usage": "Select ISO/IMG file, select target drive, click Flash. Validates after writing."},
    {"id": "c3", "name": "RustDesk", "desc": "Open source remote desktop software. Self-hosted alternative to TeamViewer.", "category": "Remote", "risk": "safe", "rating": 4.8, "downloads": "10M+", "install": "Download from rustdesk.com for your platform.", "usage": "Enter remote device's ID, connect. Can set up own server for privacy."},
    {"id": "c4", "name": "AnyDesk", "desc": "Fast remote desktop application. Cross-platform.", "category": "Remote", "risk": "safe", "rating": 4.5, "downloads": "100M+", "install": "Download from anydesk.com, install.", "usage": "Share your ID with remote user, or enter their ID to connect. Accept connection requests."},
    {"id": "c5", "name": "VLC Media Player", "desc": "Free open source cross-platform multimedia player. Plays almost everything.", "category": "Media", "risk": "safe", "rating": 4.9, "downloads": "500M+", "install": "Download from videolan.org or use package manager.", "usage": "Open VLC, drag media files or use Ctrl+N for network streams. Supports almost all formats."},
    {"id": "c6", "name": "Obsidian", "desc": "Private and flexible note-taking app. Markdown-based, local storage.", "category": "Productivity", "risk": "safe", "rating": 4.9, "downloads": "10M+", "install": "Download from obsidian.md, install.", "usage": "Create a vault (folder), write notes in Markdown. Use links to connect notes. Extensive plugin ecosystem."},
    {"id": "c7", "name": "VS Code", "desc": "Free code editor with debugging and Git. Extensible with extensions.", "category": "Development", "risk": "safe", "rating": 4.9, "downloads": "200M+", "install": "Download from code.visualstudio.com or use package manager.", "usage": "Open folder, edit code, use terminal, debug, install extensions from marketplace."},
    {"id": "c8", "name": "Bitwarden", "desc": "Open source password manager. Free with premium options.", "category": "Security", "risk": "safe", "rating": 4.9, "downloads": "50M+", "install": "Download from bitwarden.com or use browser extension.", "usage": "Create account, save passwords, use autofill. Sync across devices. Self-host option available."},
    {"id": "c9", "name": "ProtonVPN", "desc": "Free VPN service with strong privacy. No logs policy.", "category": "VPN", "risk": "safe", "rating": 4.7, "downloads": "30M+", "install": "Download from protonvpn.com, install.", "usage": "Create account, connect to free servers (3 locations). Paid plans have more servers and features."},
    {"id": "c10", "name": "KeePassXC", "desc": "Cross-platform community-driven password manager. Offline storage.", "category": "Security", "risk": "safe", "rating": 4.8, "downloads": "10M+", "install": "Download from keepassxc.org or use package manager.", "usage": "Create database with master password, store passwords locally. No cloud sync (manual)."},
    {"id": "c11", "name": "PeaZip", "desc": "Free file archiver utility. Supports 200+ archive formats.", "category": "Utilities", "risk": "safe", "rating": 4.6, "downloads": "5M+", "install": "Download from peazip.github.io or use package manager.", "usage": "Right-click files to compress/extract. Supports 7z, ZIP, RAR, TAR, and many more."},
    {"id": "c12", "name": "Joplin", "desc": "Open source note-taking and to-do application. Markdown support.", "category": "Productivity", "risk": "safe", "rating": 4.7, "downloads": "5M+", "install": "Download from joplinapp.org or use package manager.", "usage": "Create notebooks, write notes in Markdown. Sync with Dropbox, Nextcloud, etc."},
    {"id": "c13", "name": "ONLYOFFICE", "desc": "Free office suite for documents, spreadsheets, presentations.", "category": "Productivity", "risk": "safe", "rating": 4.5, "downloads": "15M+", "install": "Download from onlyoffice.com or use package manager.", "usage": "Create and edit documents, spreadsheets, presentations. MS Office compatible."},
    {"id": "c14", "name": "LibreOffice", "desc": "Free and powerful open source office suite.", "category": "Productivity", "risk": "safe", "rating": 4.6, "downloads": "50M+", "install": "Download from libreoffice.org or use package manager.", "usage": "Writer for documents, Calc for spreadsheets, Impress for presentations. MS Office compatible."},
    {"id": "c15", "name": "Audacity", "desc": "Free, open source, cross-platform audio editor. Record and edit audio.", "category": "Media", "risk": "safe", "rating": 4.7, "downloads": "100M+", "install": "Download from audacityteam.org or use package manager.", "usage": "Record audio, edit tracks, apply effects, export in various formats."},
    {"id": "c16", "name": "KeePass", "desc": "Free, open source, light-weight password manager. Windows-focused with plugins.", "category": "Security", "risk": "safe", "rating": 4.8, "downloads": "20M+", "install": "Download from keepass.info or use package manager.", "usage": "Create database, store passwords. Many plugins available. Cross-platform via ports."},
    {"id": "c17", "name": "GIMP", "desc": "Free and open-source image editor. Professional-grade photo manipulation.", "category": "Media", "risk": "safe", "rating": 4.6, "downloads": "50M+", "install": "Download from gimp.org or use package manager.", "usage": "Open images, use tools for editing, layers, filters. Alternative to Photoshop."},
    {"id": "c18", "name": "Inkscape", "desc": "Free vector graphics editor. Create and edit SVG files professionally.", "category": "Media", "risk": "safe", "rating": 4.7, "downloads": "15M+", "install": "Download from inkscape.org or use package manager.", "usage": "Create vector graphics, logos, illustrations. Alternative to Illustrator."},
    {"id": "c19", "name": "OBS Studio", "desc": "Free software for video recording and live streaming.", "category": "Media", "risk": "safe", "rating": 4.9, "downloads": "100M+", "install": "Download from obsproject.com or use package manager.", "usage": "Set up scenes with sources, configure audio, start recording or streaming to Twitch/YouTube."},
    {"id": "c20", "name": "VeraCrypt", "desc": "Free open source disk encryption. Cross-platform, strong security.", "category": "Security", "risk": "safe", "rating": 4.9, "downloads": "10M+", "install": "Download from veracrypt.fr, install.", "usage": "Create encrypted containers or encrypt drives/partitions. Use strong passwords."},
]

# ============ STYLES ============
def get_styles():
    styles = getSampleStyleSheet()
    
    styles.add(ParagraphStyle(
        name='MainTitle',
        fontName='DejaVuSans-Bold',
        fontSize=24,
        leading=30,
        alignment=TA_CENTER,
        textColor=ACCENT,
        spaceAfter=12
    ))
    
    styles.add(ParagraphStyle(
        name='Subtitle',
        fontName='DejaVuSans',
        fontSize=12,
        leading=18,
        alignment=TA_CENTER,
        textColor=TEXT_MUTED,
        spaceAfter=18
    ))
    
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='DejaVuSans-Bold',
        fontSize=16,
        leading=22,
        textColor=ACCENT,
        spaceBefore=18,
        spaceAfter=10
    ))
    
    styles.add(ParagraphStyle(
        name='ToolName',
        fontName='DejaVuSans-Bold',
        fontSize=11,
        leading=15,
        textColor=TEXT_PRIMARY,
        spaceBefore=6,
        spaceAfter=3
    ))
    
    styles.add(ParagraphStyle(
        name='ToolDesc',
        fontName='DejaVuSans',
        fontSize=9,
        leading=13,
        textColor=TEXT_MUTED,
        spaceAfter=3
    ))
    
    styles.add(ParagraphStyle(
        name='Command',
        fontName='DejaVuSans',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#b91c1c'),
        backColor=BG_SURFACE,
        leftIndent=6,
        rightIndent=6,
        spaceBefore=2,
        spaceAfter=2
    ))
    
    styles.add(ParagraphStyle(
        name='Category',
        fontName='DejaVuSans',
        fontSize=9,
        leading=12,
        textColor=ACCENT,
        spaceBefore=4,
        spaceAfter=4
    ))
    
    styles.add(ParagraphStyle(
        name='TableHeader',
        fontName='DejaVuSans-Bold',
        fontSize=10,
        leading=14,
        textColor=colors.white,
        alignment=TA_CENTER
    ))
    
    styles.add(ParagraphStyle(
        name='TableCell',
        fontName='DejaVuSans',
        fontSize=9,
        leading=12,
        textColor=TEXT_PRIMARY
    ))
    
    return styles

# ============ HELPER FUNCTIONS ============
def get_risk_color(risk):
    risk_colors = {
        'safe': SAFE_GREEN,
        'moderate': MODERATE_YELLOW,
        'advanced': ADVANCED_RED
    }
    return risk_colors.get(risk.lower(), TEXT_MUTED)

def create_tool_entry(tool, styles):
    """Create a formatted tool entry"""
    risk_color = get_risk_color(tool.get('risk', 'safe'))
    
    elements = []
    
    # Tool name and rating
    name_text = f"{tool['name']}"
    if tool.get('rating'):
        name_text += f"  (Rating: {tool['rating']}/5)"
    elements.append(Paragraph(f"<b>{name_text}</b>", styles['ToolName']))
    
    # Category and Risk
    cat_risk = f"Category: {tool['category']} | Risk: {tool['risk'].upper()} | Downloads: {tool.get('downloads', 'N/A')}"
    elements.append(Paragraph(cat_risk, styles['Category']))
    
    # Description
    elements.append(Paragraph(tool['desc'], styles['ToolDesc']))
    
    # Installation
    elements.append(Paragraph(f"<b>Installation:</b>", styles['ToolDesc']))
    elements.append(Paragraph(tool['install'], styles['Command']))
    
    # Usage
    elements.append(Paragraph(f"<b>Usage:</b> {tool['usage']}", styles['ToolDesc']))
    
    # Separator
    elements.append(Spacer(1, 8))
    
    return elements

def create_tool_table_row(tool, styles):
    """Create a table row for a tool"""
    risk_color = get_risk_color(tool.get('risk', 'safe'))
    
    # Tool info
    info = f"<b>{tool['name']}</b><br/>"
    info += f"<font size='8' color='#{ACCENT.hexval()[2:]}'>{tool['category']}</font> | "
    info += f"<font size='8' color='#{risk_color.hexval()[2:]}'>{tool['risk'].upper()}</font> | "
    info += f"<font size='8'>{tool.get('downloads', 'N/A')}</font><br/>"
    info += f"<font size='8'>{tool['desc']}</font><br/>"
    info += f"<b>Install:</b> <font color='#b91c1c'>{tool['install'][:100]}{'...' if len(tool['install']) > 100 else ''}</font><br/>"
    info += f"<font size='8'>{tool['usage'][:150]}{'...' if len(tool['usage']) > 150 else ''}</font>"
    
    return Paragraph(info, styles['TableCell'])

# ============ MAIN GENERATOR ============
def generate_pdf():
    output_path = "/home/z/my-project/public/System_Toolkit_Complete_Guide_V2.pdf"
    
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=0.75*inch,
        rightMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    styles = get_styles()
    story = []
    
    # ============ COVER PAGE ============
    story.append(Spacer(1, 1.5*inch))
    story.append(Paragraph("System Toolkit", styles['MainTitle']))
    story.append(Paragraph("Complete Installation & Usage Guide", styles['Subtitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("Version 2.0 - 114 Tools Across 6 Platforms", styles['Subtitle']))
    story.append(Spacer(1, 0.5*inch))
    
    # Platform summary
    summary_data = [
        ["Platform", "Tools"],
        ["Windows", "40"],
        ["macOS", "15"],
        ["Linux", "15"],
        ["Android", "13"],
        ["iOS", "11"],
        ["Cross Platform", "20"],
        ["Total", "114"]
    ]
    
    summary_table = Table(summary_data, colWidths=[180, 80])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('BACKGROUND', (0, 1), (-1, 1), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 3), (-1, 3), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 5), (-1, 5), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 7), (-1, 7), ACCENT),
        ('TEXTCOLOR', (0, 7), (-1, 7), colors.white),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    
    story.append(Spacer(1, 0.5*inch))
    
    # Risk level legend
    legend_data = [
        ["Risk Level Legend", "", ""],
        ["SAFE", "Moderate", "Advanced"],
        ["Green - Safe for all users", "Yellow - Some caution needed", "Red - Advanced users only"],
    ]
    
    legend_table = Table(legend_data, colWidths=[140, 140, 140])
    legend_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BACKGROUND', (0, 1), (0, 1), SAFE_GREEN),
        ('TEXTCOLOR', (0, 1), (0, 1), colors.white),
        ('BACKGROUND', (1, 1), (1, 1), MODERATE_YELLOW),
        ('BACKGROUND', (2, 1), (2, 1), ADVANCED_RED),
        ('TEXTCOLOR', (2, 1), (2, 1), colors.white),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(legend_table)
    
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Copyright and Developed by NextGen Digital Studio", styles['Subtitle']))
    story.append(Paragraph("https://www.facebook.com/nextgendigitalstudio", styles['Subtitle']))
    
    story.append(PageBreak())
    
    # ============ TABLE OF CONTENTS ============
    story.append(Paragraph("Table of Contents", styles['SectionHeader']))
    story.append(Spacer(1, 12))
    
    toc_data = [
        ["Part", "Platform", "Tools", "Page"],
        ["1", "Windows Tools", "40", "3"],
        ["2", "macOS Tools", "15", "13"],
        ["3", "Linux Tools", "15", "16"],
        ["4", "Android Tools", "13", "19"],
        ["5", "iOS Tools", "11", "21"],
        ["6", "Cross Platform Tools", "20", "23"],
    ]
    
    toc_table = Table(toc_data, colWidths=[40, 180, 50, 50])
    toc_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'DejaVuSans-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'DejaVuSans'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('BACKGROUND', (0, 1), (-1, 1), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 3), (-1, 3), TABLE_ROW_ALT),
        ('BACKGROUND', (0, 5), (-1, 5), TABLE_ROW_ALT),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(toc_table)
    
    story.append(PageBreak())
    
    # ============ WINDOWS TOOLS SECTION ============
    story.append(Paragraph("Part 1: Windows Tools (40 Tools)", styles['SectionHeader']))
    story.append(Paragraph("System optimization, repair, security, and utility tools for Windows 10/11", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for idx, tool in enumerate(WINDOWS_TOOLS, 1):
        story.extend(create_tool_entry(tool, styles))
        # Add page break every 8 tools to avoid overflow
        if idx % 8 == 0 and idx < len(WINDOWS_TOOLS):
            story.append(PageBreak())
    
    story.append(PageBreak())
    
    # ============ macOS TOOLS SECTION ============
    story.append(Paragraph("Part 2: macOS Tools (15 Tools)", styles['SectionHeader']))
    story.append(Paragraph("Essential utilities, system tools, and applications for Mac users", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for tool in MACOS_TOOLS:
        story.extend(create_tool_entry(tool, styles))
    
    story.append(PageBreak())
    
    # ============ LINUX TOOLS SECTION ============
    story.append(Paragraph("Part 3: Linux Tools (15 Tools)", styles['SectionHeader']))
    story.append(Paragraph("System management, monitoring, and utility tools for Linux distributions", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for tool in LINUX_TOOLS:
        story.extend(create_tool_entry(tool, styles))
    
    story.append(PageBreak())
    
    # ============ ANDROID TOOLS SECTION ============
    story.append(Paragraph("Part 4: Android Tools (13 Tools)", styles['SectionHeader']))
    story.append(Paragraph("System management, security, and optimization tools for Android devices", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for tool in ANDROID_TOOLS:
        story.extend(create_tool_entry(tool, styles))
    
    story.append(PageBreak())
    
    # ============ iOS TOOLS SECTION ============
    story.append(Paragraph("Part 5: iOS Tools (11 Tools)", styles['SectionHeader']))
    story.append(Paragraph("Sideloading, jailbreak, and management tools for iPhone and iPad", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for tool in IOS_TOOLS:
        story.extend(create_tool_entry(tool, styles))
    
    story.append(PageBreak())
    
    # ============ CROSS PLATFORM TOOLS SECTION ============
    story.append(Paragraph("Part 6: Cross Platform Tools (20 Tools)", styles['SectionHeader']))
    story.append(Paragraph("Universal tools that work on Windows, macOS, Linux, and more", styles['Subtitle']))
    story.append(Spacer(1, 12))
    
    for idx, tool in enumerate(CROSSPLATFORM_TOOLS, 1):
        story.extend(create_tool_entry(tool, styles))
        if idx % 8 == 0 and idx < len(CROSSPLATFORM_TOOLS):
            story.append(PageBreak())
    
    # ============ FOOTER ============
    story.append(PageBreak())
    story.append(Spacer(1, 2*inch))
    story.append(Paragraph("Thank you for using System Toolkit!", styles['MainTitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("For the latest updates and more tools, visit the dashboard.", styles['Subtitle']))
    story.append(Spacer(1, 0.5*inch))
    story.append(Paragraph("Copyright and Developed by NextGen Digital Studio", styles['Subtitle']))
    story.append(Paragraph("https://www.facebook.com/nextgendigitalstudio", styles['Subtitle']))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("Version 2.0 - 114 Tools - 6 Platforms", styles['Subtitle']))
    
    # Build PDF
    doc.build(story)
    print(f"PDF generated successfully: {output_path}")
    print(f"Total tools: 114 (Windows: 40, macOS: 15, Linux: 15, Android: 13, iOS: 11, Cross Platform: 20)")
    return output_path

if __name__ == "__main__":
    generate_pdf()
