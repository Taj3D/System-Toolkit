'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  Lock, Unlock, Shield, Zap, Star, ExternalLink, Copy, Check, Search, 
  Moon, Sun, Monitor, Trash2, Download, Settings, Info, AlertTriangle,
  Terminal, Cpu, HardDrive, Wifi, Battery, Globe, Smartphone, Tablet,
  ChevronUp, Heart, Bookmark, Share2, RefreshCw, Clock, User, LogOut,
  KeyRound, Fingerprint, Eye, EyeOff, Sparkles, Award, TrendingUp,
  Laptop, Play, Pause, RotateCcw, CheckCircle2, XCircle, Loader2, Keyboard,
  Grid, List, SortAsc, Filter, X, Plus, Minus, ChevronDown, MoreVertical
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// ============ TYPES ============
interface Tool {
  id: string
  name: string
  description: string
  category: string
  platform: 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'cross-platform'
  url: string
  risk: 'safe' | 'moderate' | 'advanced'
  rating: number
  downloads: string
  tags: string[]
  isScript?: boolean
  scriptCommand?: string
  scriptInstructions?: string[]
  lastUpdated?: string
  author?: string
  isNew?: boolean
  isFeatured?: boolean
}

interface UserSession {
  isAuthenticated: boolean
  loginTime: number
  lastActivity: number
  userName: string
}

// ============ CONSTANTS ============
// Password from environment variable for security (fallback for demo)
const MASTER_PASSWORD = process.env.NEXT_PUBLIC_MASTER_PASSWORD || 'admin123'

// Time constants
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const ACTIVITY_CHECK_INTERVAL_MS = 60 * 1000 // 1 minute
const COPY_SUCCESS_DURATION_MS = 2000 // 2 seconds
const SCRIPT_PROGRESS_INTERVAL_MS = 200 // 200ms

const PLATFORMS = [
  { id: 'windows', name: 'Windows', icon: Monitor, color: 'from-blue-500 to-cyan-500' },
  { id: 'macos', name: 'macOS', icon: Laptop, color: 'from-gray-600 to-gray-800' },
  { id: 'linux', name: 'Linux', icon: Terminal, color: 'from-orange-500 to-yellow-500' },
  { id: 'android', name: 'Android', icon: Smartphone, color: 'from-green-500 to-emerald-500' },
  { id: 'ios', name: 'iOS', icon: Tablet, color: 'from-purple-500 to-pink-500' },
  { id: 'cross-platform', name: 'Cross Platform', icon: Globe, color: 'from-indigo-500 to-purple-500' },
] as const

// ============ TOOLS DATA ============
const TOOLS: Tool[] = [
  // Windows Tools - System Optimization & Debloat
  { id: 'w1', name: 'Chris Titus Tech Windows Utility', description: 'Ultimate Windows debloat and optimization tool. Remove bloatware, optimize settings, install essential apps.', category: 'System Optimization', platform: 'windows', url: 'https://christitus.com/windows-tool/', risk: 'safe', rating: 5, downloads: '2M+', tags: ['debloat', 'optimization', 'essential'], isScript: true, scriptCommand: 'irm "https://christitus.com/win" | iex', isFeatured: true },
  { id: 'w1b', name: 'Windows Optimizer Script', description: 'Comprehensive Windows 10/11 optimization script. Disables telemetry, removes bloatware, improves performance.', category: 'System Optimization', platform: 'windows', url: 'https://github.com/ChrisTitusTech/winutil', risk: 'safe', rating: 4.9, downloads: '1M+', tags: ['optimize', 'debloat', 'performance'], isScript: true, scriptCommand: 'irm "https://christitus.com/win" | iex' },
  { id: 'w2', name: 'Windows Debloat Script', description: 'Remove pre-installed apps, disable telemetry, optimize Windows performance.', category: 'System Optimization', platform: 'windows', url: 'https://github.com/Sycnex/Windows10Debloater', risk: 'moderate', rating: 4.8, downloads: '1.5M+', tags: ['debloat', 'privacy', 'telemetry'], isScript: true, scriptCommand: 'iwr -useb https://git.io/debloat | iex' },
  { id: 'w3', name: 'O&O ShutUp10++', description: 'Free antispy tool for Windows 10 and 11. Control what data Windows sends.', category: 'Privacy', platform: 'windows', url: 'https://www.oo-software.com/en/shutup10', risk: 'safe', rating: 4.9, downloads: '3M+', tags: ['privacy', 'telemetry', 'antispy'] },
  { id: 'w4', name: 'Bulk Crap Uninstaller', description: 'Remove large amounts of unwanted programs quickly and thoroughly.', category: 'Uninstaller', platform: 'windows', url: 'https://www.bcuninstaller.com/', risk: 'safe', rating: 4.7, downloads: '2M+', tags: ['uninstaller', 'cleanup', 'bloatware'] },
  { id: 'w5', name: 'SDI (Snappy Driver Installer)', description: 'Install and update drivers for free. No ads, no bundled software.', category: 'Drivers', platform: 'windows', url: 'https://sdi-tool.org/', risk: 'safe', rating: 4.6, downloads: '5M+', tags: ['drivers', 'update', 'hardware'] },
  { id: 'w6', name: 'Microsoft Activation Scripts', description: 'Open-source Windows and Office activator (MAS).', category: 'Activation', platform: 'windows', url: 'https://github.com/massgravel/Microsoft-Activation-Scripts', risk: 'advanced', rating: 4.9, downloads: '10M+', tags: ['activation', 'windows', 'office'], isNew: true, isScript: true, scriptCommand: 'irm https://massgrave.dev/get | iex' },
  { id: 'w7', name: 'Chocolatey', description: 'Package manager for Windows. Install software with one command.', category: 'Package Manager', platform: 'windows', url: 'https://chocolatey.org/', risk: 'safe', rating: 4.8, downloads: '8M+', tags: ['package-manager', 'automation'], isScript: true, scriptCommand: 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString(\'https://community.chocolatey.org/install.ps1\'))' },
  { id: 'w8', name: 'Winget', description: 'Official Windows Package Manager by Microsoft.', category: 'Package Manager', platform: 'windows', url: 'https://github.com/microsoft/winget-cli', risk: 'safe', rating: 4.5, downloads: '50M+', tags: ['package-manager', 'microsoft'] },
  { id: 'w9', name: 'HWiNFO', description: 'Comprehensive hardware analysis, monitoring and reporting.', category: 'Hardware', platform: 'windows', url: 'https://www.hwinfo.com/', risk: 'safe', rating: 4.8, downloads: '4M+', tags: ['hardware', 'monitoring', 'diagnostics'] },
  { id: 'w10', name: 'HWMonitor', description: 'Hardware monitoring program that reads PC systems health sensors.', category: 'Hardware', platform: 'windows', url: 'https://www.cpuid.com/softwares/hwmonitor.html', risk: 'safe', rating: 4.6, downloads: '3M+', tags: ['monitoring', 'temperature', 'sensors'] },
  { id: 'w11', name: 'CrystalDiskInfo', description: 'Monitor SSD/HDD health status and temperature.', category: 'Hardware', platform: 'windows', url: 'https://crystalmark.info/en/software/crystaldiskinfo/', risk: 'safe', rating: 4.7, downloads: '6M+', tags: ['storage', 'health', 'ssd'] },
  { id: 'w12', name: 'MemTest86', description: 'Industry standard for RAM memory testing.', category: 'Diagnostics', platform: 'windows', url: 'https://www.memtest86.com/', risk: 'safe', rating: 4.9, downloads: '4M+', tags: ['memory', 'ram', 'testing'] },
  { id: 'w13', name: 'Rufus', description: 'Create bootable USB drives easily.', category: 'Utilities', platform: 'windows', url: 'https://rufus.ie/', risk: 'safe', rating: 4.9, downloads: '20M+', tags: ['usb', 'bootable', 'iso'] },
  { id: 'w14', name: 'Ventoy', description: 'Bootable USB solution. Just copy ISO files to USB.', category: 'Utilities', platform: 'windows', url: 'https://www.ventoy.net/', risk: 'safe', rating: 4.8, downloads: '8M+', tags: ['usb', 'multiboot', 'iso'], isFeatured: true },
  { id: 'w15', name: 'PowerToys', description: 'Microsoft power user utilities for Windows.', category: 'Utilities', platform: 'windows', url: 'https://github.com/microsoft/PowerToys', risk: 'safe', rating: 4.7, downloads: '15M+', tags: ['utilities', 'microsoft', 'productivity'] },
  { id: 'w16', name: 'Everything', description: 'Instant file search for Windows. Lightning fast.', category: 'Search', platform: 'windows', url: 'https://www.voidtools.com/', risk: 'safe', rating: 4.9, downloads: '10M+', tags: ['search', 'files', 'indexing'], isFeatured: true },
  { id: 'w17', name: '7-Zip', description: 'Free open-source file archiver with high compression ratio.', category: 'Utilities', platform: 'windows', url: 'https://www.7-zip.org/', risk: 'safe', rating: 4.9, downloads: '50M+', tags: ['archive', 'compression', 'free'] },
  { id: 'w18', name: 'Malwarebytes', description: 'Anti-malware software for Windows, Mac, and mobile.', category: 'Security', platform: 'windows', url: 'https://www.malwarebytes.com/', risk: 'safe', rating: 4.6, downloads: '25M+', tags: ['antivirus', 'malware', 'security'] },
  { id: 'w19', name: 'VeraCrypt', description: 'Free open-source disk encryption software.', category: 'Security', platform: 'windows', url: 'https://www.veracrypt.fr/', risk: 'safe', rating: 4.8, downloads: '5M+', tags: ['encryption', 'privacy', 'security'] },
  { id: 'w20', name: 'BleachBit', description: 'Clean your system and free disk space.', category: 'Cleanup', platform: 'windows', url: 'https://www.bleachbit.org/', risk: 'moderate', rating: 4.5, downloads: '8M+', tags: ['cleanup', 'privacy', 'free-space'] },
  { id: 'w21', name: 'Geek Uninstaller', description: 'Efficient and fast small uninstaller.', category: 'Uninstaller', platform: 'windows', url: 'https://geekuninstaller.com/', risk: 'safe', rating: 4.6, downloads: '3M+', tags: ['uninstaller', 'lightweight', 'portable'] },
  { id: 'w22', name: 'Tron Script', description: 'Automatic system cleanup and repair script for Windows.', category: 'System Repair', platform: 'windows', url: 'https://github.com/bmrf/tron', risk: 'advanced', rating: 4.4, downloads: '2M+', tags: ['repair', 'cleanup', 'automation'] },

  // macOS Tools
  { id: 'm1', name: 'AppCleaner', description: 'Completely uninstall apps from your Mac.', category: 'Uninstaller', platform: 'macos', url: 'https://freemacsoft.net/appcleaner/', risk: 'safe', rating: 4.9, downloads: '5M+', tags: ['uninstaller', 'cleanup'], isFeatured: true },
  { id: 'm2', name: 'Homebrew', description: 'The missing package manager for macOS.', category: 'Package Manager', platform: 'macos', url: 'https://brew.sh/', risk: 'safe', rating: 4.9, downloads: '20M+', tags: ['package-manager', 'terminal', 'automation'] },
  { id: 'm3', name: 'Onyx', description: 'Maintenance and optimization tool for macOS.', category: 'System', platform: 'macos', url: 'https://www.titanium-software.fr/en/onyx.html', risk: 'moderate', rating: 4.5, downloads: '3M+', tags: ['maintenance', 'optimization'] },
  { id: 'm4', name: 'CleanMyMac X', description: 'All-in-one package to tidy up your Mac.', category: 'Cleanup', platform: 'macos', url: 'https://cleanmymac.com/', risk: 'safe', rating: 4.4, downloads: '10M+', tags: ['cleanup', 'optimization', 'paid'] },
  { id: 'm5', name: 'Amphetamine', description: 'Prevent your Mac from sleeping.', category: 'Utilities', platform: 'macos', url: 'https://apps.apple.com/us/app/amphetamine/id937984704', risk: 'safe', rating: 4.8, downloads: '2M+', tags: ['power', 'sleep', 'productivity'] },
  { id: 'm6', name: 'AppTrap', description: 'Automatically remove associated files when uninstalling apps.', category: 'Uninstaller', platform: 'macos', url: 'https://onnati.net/apptrap/', risk: 'safe', rating: 4.3, downloads: '500K+', tags: ['uninstaller', 'cleanup'] },
  { id: 'm7', name: 'Tuxera NTFS', description: 'Full read-write access to NTFS drives on Mac.', category: 'Utilities', platform: 'macos', url: 'https://www.tuxera.com/products/tuxera-ntfs-for-mac/', risk: 'safe', rating: 4.5, downloads: '2M+', tags: ['ntfs', 'filesystem'] },
  { id: 'm8', name: 'Disk Inventory X', description: 'Disk usage utility for Mac.', category: 'Storage', platform: 'macos', url: 'http://www.derlien.com/', risk: 'safe', rating: 4.4, downloads: '1M+', tags: ['storage', 'disk-usage'] },
  { id: 'm9', name: 'EtreCheck', description: 'Diagnose and troubleshoot Mac issues.', category: 'Diagnostics', platform: 'macos', url: 'https://etrecheck.com/', risk: 'safe', rating: 4.7, downloads: '1M+', tags: ['diagnostics', 'troubleshoot'] },
  { id: 'm10', name: 'Malwarebytes for Mac', description: 'Mac anti-malware protection.', category: 'Security', platform: 'macos', url: 'https://www.malwarebytes.com/mac/', risk: 'safe', rating: 4.5, downloads: '5M+', tags: ['security', 'antivirus'] },
  { id: 'm11', name: 'Little Snitch', description: 'Monitor and control network connections.', category: 'Security', platform: 'macos', url: 'https://www.obdev.at/products/littlesnitch/', risk: 'safe', rating: 4.8, downloads: '1M+', tags: ['firewall', 'network', 'privacy'] },
  { id: 'm12', name: 'Carbon Copy Cloner', description: 'Create bootable backups of your Mac.', category: 'Backup', platform: 'macos', url: 'https://bombich.com/', risk: 'safe', rating: 4.9, downloads: '2M+', tags: ['backup', 'clone', 'recovery'] },
  { id: 'm13', name: 'Stats', description: 'System monitor in the menu bar.', category: 'Monitoring', platform: 'macos', url: 'https://github.com/exelban/stats', risk: 'safe', rating: 4.8, downloads: '3M+', tags: ['monitoring', 'menu-bar'], isNew: true },
  { id: 'm14', name: 'Rectangle', description: 'Move and resize windows using keyboard shortcuts.', category: 'Window Management', platform: 'macos', url: 'https://rectangleapp.com/', risk: 'safe', rating: 4.9, downloads: '5M+', tags: ['windows', 'productivity'], isFeatured: true },
  { id: 'm15', name: 'HiddenBar', description: 'Hide menu bar items to keep it clean.', category: 'Utilities', platform: 'macos', url: 'https://github.com/dwarvesf/hidden', risk: 'safe', rating: 4.6, downloads: '1M+', tags: ['menu-bar', 'minimalist'] },

  // Linux Tools
  { id: 'l1', name: 'Ubuntu Cleaner', description: 'Clean up your Ubuntu system.', category: 'Cleanup', platform: 'linux', url: 'https://github.com/gerardpuig/ubuntu-cleaner', risk: 'safe', rating: 4.4, downloads: '500K+', tags: ['cleanup', 'ubuntu'] },
  { id: 'l2', name: 'Stacer', description: 'Linux system optimizer and monitoring tool.', category: 'System', platform: 'linux', url: 'https://github.com/oguzhaninan/Stacer', risk: 'safe', rating: 4.7, downloads: '1M+', tags: ['optimizer', 'monitoring'], isFeatured: true },
  { id: 'l3', name: 'BleachBit for Linux', description: 'Clean your Linux system and free disk space.', category: 'Cleanup', platform: 'linux', url: 'https://www.bleachbit.org/', risk: 'moderate', rating: 4.5, downloads: '2M+', tags: ['cleanup', 'privacy'] },
  { id: 'l4', name: 'Timeshift', description: 'System restore tool for Linux.', category: 'Backup', platform: 'linux', url: 'https://github.com/teejee2008/timeshift', risk: 'safe', rating: 4.8, downloads: '3M+', tags: ['backup', 'restore', 'snapshot'] },
  { id: 'l5', name: 'GParted', description: 'Partition editor for graphically managing disk partitions.', category: 'Storage', platform: 'linux', url: 'https://gparted.org/', risk: 'advanced', rating: 4.7, downloads: '5M+', tags: ['partition', 'disk', 'storage'] },
  { id: 'l6', name: 'htop', description: 'Interactive process viewer for Linux.', category: 'Monitoring', platform: 'linux', url: 'https://htop.dev/', risk: 'safe', rating: 4.9, downloads: '10M+', tags: ['process', 'monitoring', 'terminal'] },
  { id: 'l7', name: 'Neofetch', description: 'Display system information in terminal.', category: 'Utilities', platform: 'linux', url: 'https://github.com/dylanaraps/neofetch', risk: 'safe', rating: 4.6, downloads: '8M+', tags: ['system-info', 'terminal'] },
  { id: 'l8', name: 'Terminator', description: 'Terminal emulator with multiple terminals in one window.', category: 'Terminal', platform: 'linux', url: 'https://gnometerminator.blogspot.com/', risk: 'safe', rating: 4.5, downloads: '2M+', tags: ['terminal', 'tiling'] },
  { id: 'l9', name: 'ClamAV', description: 'Open source antivirus engine for detecting trojans and malware.', category: 'Security', platform: 'linux', url: 'https://www.clamav.net/', risk: 'safe', rating: 4.4, downloads: '3M+', tags: ['antivirus', 'security'] },
  { id: 'l10', name: 'UFW', description: 'Uncomplicated Firewall for managing netfilter.', category: 'Security', platform: 'linux', url: 'https://launchpad.net/ufw', risk: 'moderate', rating: 4.6, downloads: '10M+', tags: ['firewall', 'security'] },
  { id: 'l11', name: 'GDebi', description: 'Install .deb packages with automatic dependency resolution.', category: 'Package Manager', platform: 'linux', url: 'https://launchpad.net/gdebi', risk: 'safe', rating: 4.4, downloads: '5M+', tags: ['packages', 'debian'] },
  { id: 'l12', name: 'Synaptic', description: 'Graphical package management tool.', category: 'Package Manager', platform: 'linux', url: 'https://www.nongnu.org/synaptic/', risk: 'safe', rating: 4.6, downloads: '8M+', tags: ['packages', 'apt'] },
  { id: 'l13', name: 'Hardinfo', description: 'System profiler and benchmark tool.', category: 'Diagnostics', platform: 'linux', url: 'https://github.com/lpereira/hardinfo', risk: 'safe', rating: 4.4, downloads: '1M+', tags: ['benchmark', 'system-info'] },
  { id: 'l14', name: 'KSysGuard', description: 'System monitor for KDE Plasma.', category: 'Monitoring', platform: 'linux', url: 'https://apps.kde.org/ksysguard/', risk: 'safe', rating: 4.3, downloads: '2M+', tags: ['monitoring', 'kde'] },
  { id: 'l15', name: 'Lutris', description: 'Open gaming platform for Linux.', category: 'Gaming', platform: 'linux', url: 'https://lutris.net/', risk: 'safe', rating: 4.7, downloads: '3M+', tags: ['gaming', 'wine', 'steam'], isFeatured: true },

  // Android Tools
  { id: 'a1', name: 'SD Maid SE', description: 'System cleaning tool for Android.', category: 'Cleanup', platform: 'android', url: 'https://github.com/d4rken-org/sdmaid-se', risk: 'safe', rating: 4.7, downloads: '5M+', tags: ['cleanup', 'system'], isFeatured: true },
  { id: 'a2', name: 'Shizuku', description: 'Use system APIs directly with ADB/root privileges.', category: 'System', platform: 'android', url: 'https://shizuku.rikka.app/', risk: 'moderate', rating: 4.8, downloads: '10M+', tags: ['adb', 'system', 'root'] },
  { id: 'a3', name: 'App Manager', description: 'Full-featured package manager for Android.', category: 'Package Manager', platform: 'android', url: 'https://github.com/MuntashirAkon/AppManager', risk: 'moderate', rating: 4.5, downloads: '1M+', tags: ['packages', 'management'] },
  { id: 'a4', name: 'Termux', description: 'Terminal emulator and Linux environment app.', category: 'Terminal', platform: 'android', url: 'https://termux.com/', risk: 'safe', rating: 4.8, downloads: '50M+', tags: ['terminal', 'linux'], isFeatured: true },
  { id: 'a5', name: 'ADB AppControl', description: 'Manage Android apps via ADB from PC.', category: 'Management', platform: 'android', url: 'https://adbappcontrol.com/', risk: 'moderate', rating: 4.6, downloads: '2M+', tags: ['adb', 'management', 'bloatware'] },
  { id: 'a6', name: 'Universal Android Debloater', description: 'Remove bloatware from any Android device.', category: 'Debloat', platform: 'android', url: 'https://github.com/0x192/universal-android-debloater', risk: 'moderate', rating: 4.7, downloads: '3M+', tags: ['debloat', 'bloatware', 'privacy'] },
  { id: 'a7', name: 'Franco Kernel Manager', description: 'Kernel manager for rooted devices.', category: 'System', platform: 'android', url: 'https://play.google.com/store/apps/details?id=com.franco.kernel', risk: 'advanced', rating: 4.6, downloads: '1M+', tags: ['kernel', 'root', 'performance'] },
  { id: 'a8', name: 'Magisk', description: 'Systemless root solution for Android.', category: 'Root', platform: 'android', url: 'https://github.com/topjohnwu/Magisk', risk: 'advanced', rating: 4.9, downloads: '50M+', tags: ['root', 'systemless', 'modules'], isFeatured: true },
  { id: 'a9', name: 'Greenify', description: 'Hibernation app to save battery.', category: 'Battery', platform: 'android', url: 'https://play.google.com/store/apps/details?id=com.oasisfeng.greenify', risk: 'safe', rating: 4.5, downloads: '50M+', tags: ['battery', 'hibernation'] },
  { id: 'a10', name: 'Blokada', description: 'Free DNS changer and ad blocker for Android.', category: 'Privacy', platform: 'android', url: 'https://blokada.org/', risk: 'safe', rating: 4.7, downloads: '10M+', tags: ['adblock', 'privacy', 'dns'] },
  { id: 'a11', name: 'NetGuard', description: 'No-root firewall for Android.', category: 'Security', platform: 'android', url: 'https://github.com/M66B/NetGuard', risk: 'safe', rating: 4.6, downloads: '5M+', tags: ['firewall', 'privacy', 'no-root'] },
  { id: 'a12', name: 'CPU Float', description: 'Monitor CPU, GPU, and RAM usage as overlay.', category: 'Monitoring', platform: 'android', url: 'https://play.google.com/store/apps/details?id=com.cgw.cputemp', risk: 'safe', rating: 4.3, downloads: '1M+', tags: ['monitoring', 'overlay'] },
  { id: 'a13', name: 'Amarok', description: 'Hide apps and files on Android.', category: 'Privacy', platform: 'android', url: 'https://github.com/deltazefiro/Amarok-Hider', risk: 'safe', rating: 4.4, downloads: '500K+', tags: ['privacy', 'hide', 'security'], isNew: true },

  // iOS Tools
  { id: 'i1', name: 'AltStore', description: 'Alternative App Store for iOS - sideload apps.', category: 'Sideloading', platform: 'ios', url: 'https://altstore.io/', risk: 'safe', rating: 4.6, downloads: '5M+', tags: ['sideload', 'ipa', 'free'], isFeatured: true },
  { id: 'i2', name: 'Sideloadly', description: 'Sideload iOS apps without jailbreak.', category: 'Sideloading', platform: 'ios', url: 'https://sideloadly.io/', risk: 'safe', rating: 4.5, downloads: '3M+', tags: ['sideload', 'ipa', 'windows'] },
  { id: 'i3', name: 'TrollStore', description: 'Install IPAs permanently on iOS 14-16.', category: 'Sideloading', platform: 'ios', url: 'https://github.com/opa334/TrollStore', risk: 'moderate', rating: 4.8, downloads: '2M+', tags: ['permanent', 'ipa', 'no-jailbreak'], isNew: true },
  { id: 'i4', name: 'Checkra1n', description: 'Jailbreak for iPhone 5s through iPhone X.', category: 'Jailbreak', platform: 'ios', url: 'https://checkra.in/', risk: 'advanced', rating: 4.7, downloads: '10M+', tags: ['jailbreak', 'checkm8', 'untethered'] },
  { id: 'i5', name: 'Unc0ver', description: 'Jailbreak for iOS 11.0-14.3.', category: 'Jailbreak', platform: 'ios', url: 'https://unc0ver.dev/', risk: 'advanced', rating: 4.6, downloads: '8M+', tags: ['jailbreak', 'cydia'] },
  { id: 'i6', name: 'Dopamine', description: 'Jailbreak for iOS 15.0-16.6.1.', category: 'Jailbreak', platform: 'ios', url: 'https://github.com/opa334/Dopamine', risk: 'advanced', rating: 4.8, downloads: '3M+', tags: ['jailbreak', 'rootless'], isNew: true },
  { id: 'i7', name: 'iMazing', description: 'iOS device management tool for Mac and PC.', category: 'Management', platform: 'ios', url: 'https://imazing.com/', risk: 'safe', rating: 4.7, downloads: '5M+', tags: ['backup', 'transfer', 'management'] },
  { id: 'i8', name: '3uTools', description: 'All-in-one tool for iOS devices.', category: 'Management', platform: 'ios', url: 'https://www.3u.com/', risk: 'safe', rating: 4.5, downloads: '10M+', tags: ['flash', 'backup', 'management'] },
  { id: 'i9', name: 'Odysseyn1x', description: 'Linux-based checkra1n jailbreak live USB.', category: 'Jailbreak', platform: 'ios', url: 'https://github.com/raspberry-pi-flutter/odysseyn1x', risk: 'advanced', rating: 4.4, downloads: '500K+', tags: ['jailbreak', 'linux', 'usb'] },
  { id: 'i10', name: 'iOS Repo Updater', description: 'Update jailbreak repos and packages.', category: 'Jailbreak', platform: 'ios', url: 'https://github.com/Coercions/iOS-Repo-Updater', risk: 'moderate', rating: 4.2, downloads: '200K+', tags: ['cydia', 'repos', 'packages'] },
  { id: 'i11', name: 'AltDaemon', description: 'Enable AltStore refresh without computer.', category: 'Sideloading', platform: 'ios', url: 'https://github.com/rileytestut/AltDaemon', risk: 'moderate', rating: 4.5, downloads: '1M+', tags: ['altstore', 'refresh', 'jailbreak'] },

  // Cross Platform Tools
  { id: 'c1', name: 'Ventoy', description: 'Bootable USB solution - just copy ISO files.', category: 'Bootable', platform: 'cross-platform', url: 'https://www.ventoy.net/', risk: 'safe', rating: 4.9, downloads: '15M+', tags: ['usb', 'bootable', 'multiboot'], isFeatured: true },
  { id: 'c2', name: 'BalenaEtcher', description: 'Flash OS images to SD cards & USB drives.', category: 'Bootable', platform: 'cross-platform', url: 'https://www.balena.io/etcher/', risk: 'safe', rating: 4.7, downloads: '20M+', tags: ['flash', 'usb', 'sd-card'] },
  { id: 'c3', name: 'RustDesk', description: 'Open source remote desktop software.', category: 'Remote', platform: 'cross-platform', url: 'https://rustdesk.com/', risk: 'safe', rating: 4.8, downloads: '10M+', tags: ['remote', 'desktop', 'open-source'], isFeatured: true },
  { id: 'c4', name: 'AnyDesk', description: 'Fast remote desktop application.', category: 'Remote', platform: 'cross-platform', url: 'https://anydesk.com/', risk: 'safe', rating: 4.5, downloads: '100M+', tags: ['remote', 'desktop'] },
  { id: 'c5', name: 'VLC Media Player', description: 'Free open source cross-platform multimedia player.', category: 'Media', platform: 'cross-platform', url: 'https://www.videolan.org/', risk: 'safe', rating: 4.9, downloads: '500M+', tags: ['media', 'video', 'audio'] },
  { id: 'c6', name: 'Obsidian', description: 'Private and flexible note-taking app.', category: 'Productivity', platform: 'cross-platform', url: 'https://obsidian.md/', risk: 'safe', rating: 4.9, downloads: '10M+', tags: ['notes', 'markdown', 'productivity'] },
  { id: 'c7', name: 'VS Code', description: 'Free code editor with debugging and Git.', category: 'Development', platform: 'cross-platform', url: 'https://code.visualstudio.com/', risk: 'safe', rating: 4.9, downloads: '200M+', tags: ['editor', 'ide', 'development'] },
  { id: 'c8', name: 'Bitwarden', description: 'Open source password manager.', category: 'Security', platform: 'cross-platform', url: 'https://bitwarden.com/', risk: 'safe', rating: 4.9, downloads: '50M+', tags: ['password', 'security', 'encryption'], isFeatured: true },
  { id: 'c9', name: 'ProtonVPN', description: 'Free VPN service with strong privacy.', category: 'VPN', platform: 'cross-platform', url: 'https://protonvpn.com/', risk: 'safe', rating: 4.7, downloads: '30M+', tags: ['vpn', 'privacy', 'free'] },
  { id: 'c10', name: 'KeePassXC', description: 'Cross-platform community-driven password manager.', category: 'Security', platform: 'cross-platform', url: 'https://keepassxc.org/', risk: 'safe', rating: 4.8, downloads: '10M+', tags: ['password', 'offline', 'security'] },
]

// ============ MAIN COMPONENT ============
export default function SystemToolkitDashboard() {
  const { toast } = useToast()
  
  // Auth State
  const [session, setSession] = useState<UserSession | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // UI State
  const [activeTab, setActiveTab] = useState('windows')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [sessionTime, setSessionTime] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads'>('rating')
  
  // Script Execution State
  const [executingScript, setExecutingScript] = useState<string | null>(null)
  const [scriptProgress, setScriptProgress] = useState(0)
  const [showScriptModal, setShowScriptModal] = useState(false)
  const [selectedScriptTool, setSelectedScriptTool] = useState<Tool | null>(null)
  
  // Quick Filters State
  const [quickFilter, setQuickFilter] = useState<'all' | 'favorites' | 'scripts' | 'featured' | 'new' | 'recent'>('all')
  const [riskFilter, setRiskFilter] = useState<'all' | 'safe' | 'moderate' | 'advanced'>('all')
  const [showShortcuts, setShowShortcuts] = useState(false)
  
  // Phase 3: Collections & Statistics State
  const [collections, setCollections] = useState<{ id: string; name: string; toolIds: string[]; color: string; createdAt: number }[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([])
  const [toolViewCounts, setToolViewCounts] = useState<Record<string, number>>({})
  const [showCollectionsModal, setShowCollectionsModal] = useState(false)
  const [showStatsModal, setShowStatsModal] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [selectedToolForCollection, setSelectedToolForCollection] = useState<string | null>(null)
  
  // Phase 4: Advanced Features State
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [history, setHistory] = useState<{ toolId: string; timestamp: number; action: 'view' | 'run' | 'favorite' | 'collection' }[]>([])
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showAddToCollectionMenu, setShowAddToCollectionMenu] = useState<string | null>(null)
  const [batchScriptProgress, setBatchScriptProgress] = useState<Record<string, number>>({})
  
  // Check session on mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('toolkit_session')
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession) as UserSession
          // Validate parsed object has required fields
          if (parsed.isAuthenticated && parsed.lastActivity && parsed.loginTime) {
            if (Date.now() - parsed.lastActivity < SESSION_TIMEOUT_MS) {
              setSession(parsed)
            } else {
              localStorage.removeItem('toolkit_session')
            }
          }
        } catch (parseError) {
          console.warn('Failed to parse session:', parseError)
          localStorage.removeItem('toolkit_session')
        }
      }
      
      const savedFavorites = localStorage.getItem('toolkit_favorites')
      if (savedFavorites) {
        try {
          const parsedFavorites = JSON.parse(savedFavorites)
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites)
          }
        } catch (parseError) {
          console.warn('Failed to parse favorites:', parseError)
          localStorage.removeItem('toolkit_favorites')
        }
      }
      
      const savedTheme = localStorage.getItem('toolkit_theme')
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark')
      }
      
      // Load Phase 3 data
      const savedCollections = localStorage.getItem('toolkit_collections')
      if (savedCollections) {
        try {
          const parsedCollections = JSON.parse(savedCollections)
          if (Array.isArray(parsedCollections)) {
            setCollections(parsedCollections)
          }
        } catch (parseError) {
          console.warn('Failed to parse collections:', parseError)
        }
      }
      
      const savedRecentlyViewed = localStorage.getItem('toolkit_recently_viewed')
      if (savedRecentlyViewed) {
        try {
          const parsedRecent = JSON.parse(savedRecentlyViewed)
          if (Array.isArray(parsedRecent)) {
            setRecentlyViewed(parsedRecent)
          }
        } catch (parseError) {
          console.warn('Failed to parse recently viewed:', parseError)
        }
      }
      
      const savedViewCounts = localStorage.getItem('toolkit_view_counts')
      if (savedViewCounts) {
        try {
          const parsedCounts = JSON.parse(savedViewCounts)
          if (typeof parsedCounts === 'object') {
            setToolViewCounts(parsedCounts)
          }
        } catch (parseError) {
          console.warn('Failed to parse view counts:', parseError)
        }
      }
      
      // Load Phase 4 data - History
      const savedHistory = localStorage.getItem('toolkit_history')
      if (savedHistory) {
        try {
          const parsedHistory = JSON.parse(savedHistory)
          if (Array.isArray(parsedHistory)) {
            setHistory(parsedHistory)
          }
        } catch (parseError) {
          console.warn('Failed to parse history:', parseError)
        }
      }
    } catch (error) {
      console.error('Error loading session data:', error)
    } finally {
      setIsLoadingSession(false)
    }
  }, [])
  
  // Session timer update
  useEffect(() => {
    if (!session) return
    
    const updateTimer = () => {
      setSessionTime(Math.round((Date.now() - session.loginTime) / 60000))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 60000)
    return () => clearInterval(interval)
  }, [session])
  
  // Logout handler - defined first as it's used in useEffect
  const handleLogout = useCallback(() => {
    setSession(null)
    localStorage.removeItem('toolkit_session')
    setPasswordInput('')
    toast({
      title: '🔒 Logged Out',
      description: 'Session ended successfully'
    })
  }, [toast])
  
  // Activity tracking
  useEffect(() => {
    if (!session) return
    
    const interval = setInterval(() => {
      const storedSession = localStorage.getItem('toolkit_session')
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession) as UserSession
          if (Date.now() - parsed.lastActivity > SESSION_TIMEOUT_MS) {
            handleLogout()
          }
        } catch {
          // Ignore parse errors in interval
        }
      }
    }, ACTIVITY_CHECK_INTERVAL_MS)
    
    return () => clearInterval(interval)
  }, [session, handleLogout])
  
  // Toggle theme - defined early as it's used in keyboard shortcuts
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newTheme = !prev
      localStorage.setItem('toolkit_theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }, [])
  
  // Keyboard shortcuts
  useEffect(() => {
    if (!session) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      
      switch (e.key.toLowerCase()) {
        case '/':
          e.preventDefault()
          document.querySelector<HTMLInputElement>('input[placeholder*="Search"]')?.focus()
          break
        case 'd':
          toggleTheme()
          break
        case 'f':
          e.preventDefault()
          setQuickFilter(prev => prev === 'favorites' ? 'all' : 'favorites')
          break
        case 's':
          e.preventDefault()
          setQuickFilter(prev => prev === 'scripts' ? 'all' : 'scripts')
          break
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          const platformIndex = parseInt(e.key) - 1
          const platforms = ['windows', 'macos', 'linux', 'android', 'ios', 'cross-platform']
          if (platforms[platformIndex]) {
            setActiveTab(platforms[platformIndex] as typeof activeTab)
          }
          break
        case '?':
          setShowShortcuts(prev => !prev)
          break
        case 'escape':
          setShowShortcuts(false)
          setShowScriptModal(false)
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [session])
  
  // Update activity
  const updateActivity = useCallback(() => {
    if (session) {
      const newSession = { ...session, lastActivity: Date.now() }
      setSession(newSession)
      localStorage.setItem('toolkit_session', JSON.stringify(newSession))
    }
  }, [session])
  
  // Login handler
  const handleLogin = useCallback(async () => {
    setIsLoading(true)
    setLoginError('')
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (passwordInput === MASTER_PASSWORD) {
      const newSession: UserSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        userName: 'Administrator'
      }
      setSession(newSession)
      localStorage.setItem('toolkit_session', JSON.stringify(newSession))
      toast({
        title: '🔓 Login Successful',
        description: 'Welcome to System Toolkit Dashboard'
      })
    } else {
      setLoginError('Invalid password. Please try again.')
      toast({
        variant: 'destructive',
        title: '❌ Login Failed',
        description: 'Invalid credentials'
      })
    }
    
    setIsLoading(false)
  }, [passwordInput, toast])
  
  // Toggle favorite
  const toggleFavorite = useCallback((toolId: string) => {
    updateActivity()
    setFavorites(prev => {
      const isAdding = !prev.includes(toolId)
      const newFavorites = isAdding
        ? [...prev, toolId]
        : prev.filter(id => id !== toolId)
      try {
        localStorage.setItem('toolkit_favorites', JSON.stringify(newFavorites))
      } catch (e) {
        console.warn('Failed to save favorites:', e)
      }
      
      // Add to history
      setHistory(h => {
        const newEntry = { toolId, timestamp: Date.now(), action: 'favorite' as const }
        const updated = [newEntry, ...h].slice(0, 100)
        return updated
      })
      
      return newFavorites
    })
  }, [updateActivity])
  
  // Phase 3: Collection management
  const createCollection = useCallback((name: string, color: string = 'blue') => {
    const newCollection = {
      id: `collection-${Date.now()}`,
      name,
      toolIds: [],
      color,
      createdAt: Date.now()
    }
    setCollections(prev => {
      const updated = [...prev, newCollection]
      localStorage.setItem('toolkit_collections', JSON.stringify(updated))
      return updated
    })
    toast({
      title: '📁 Collection Created',
      description: `"${name}" has been created`
    })
  }, [toast])
  
  const deleteCollection = useCallback((collectionId: string) => {
    setCollections(prev => {
      const updated = prev.filter(c => c.id !== collectionId)
      localStorage.setItem('toolkit_collections', JSON.stringify(updated))
      return updated
    })
    toast({
      title: '🗑️ Collection Deleted',
      description: 'Collection has been removed'
    })
  }, [toast])
  
  const addToCollection = useCallback((collectionId: string, toolId: string) => {
    setCollections(prev => {
      const updated = prev.map(c => {
        if (c.id === collectionId && !c.toolIds.includes(toolId)) {
          return { ...c, toolIds: [...c.toolIds, toolId] }
        }
        return c
      })
      localStorage.setItem('toolkit_collections', JSON.stringify(updated))
      return updated
    })
    toast({
      title: '➕ Added to Collection',
      description: 'Tool has been added'
    })
  }, [toast])
  
  const removeFromCollection = useCallback((collectionId: string, toolId: string) => {
    setCollections(prev => {
      const updated = prev.map(c => {
        if (c.id === collectionId) {
          return { ...c, toolIds: c.toolIds.filter(id => id !== toolId) }
        }
        return c
      })
      localStorage.setItem('toolkit_collections', JSON.stringify(updated))
      return updated
    })
  }, [])
  
  // Track tool view for statistics
  const trackToolView = useCallback((toolId: string, action: 'view' | 'run' = 'view') => {
    // Update view counts
    setToolViewCounts(prev => {
      const updated = { ...prev, [toolId]: (prev[toolId] || 0) + 1 }
      localStorage.setItem('toolkit_view_counts', JSON.stringify(updated))
      return updated
    })
    
    // Update recently viewed (keep last 20)
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== toolId)
      const updated = [toolId, ...filtered].slice(0, 20)
      localStorage.setItem('toolkit_recently_viewed', JSON.stringify(updated))
      return updated
    })
    
    // Add to history
    setHistory(prev => {
      const newEntry = { toolId, timestamp: Date.now(), action }
      const updated = [newEntry, ...prev].slice(0, 100)
      return updated
    })
  }, [])
  
  // Export data
  const exportData = useCallback(() => {
    const data = {
      favorites,
      collections,
      recentlyViewed,
      toolViewCounts,
      history,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `toolkit-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      title: '📤 Export Successful',
      description: 'Your data has been exported'
    })
  }, [favorites, collections, recentlyViewed, toolViewCounts, history, toast])
  
  // Import data
  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.favorites && Array.isArray(data.favorites)) {
          setFavorites(data.favorites)
          localStorage.setItem('toolkit_favorites', JSON.stringify(data.favorites))
        }
        if (data.collections && Array.isArray(data.collections)) {
          setCollections(data.collections)
          localStorage.setItem('toolkit_collections', JSON.stringify(data.collections))
        }
        if (data.recentlyViewed && Array.isArray(data.recentlyViewed)) {
          setRecentlyViewed(data.recentlyViewed)
          localStorage.setItem('toolkit_recently_viewed', JSON.stringify(data.recentlyViewed))
        }
        if (data.toolViewCounts && typeof data.toolViewCounts === 'object') {
          setToolViewCounts(data.toolViewCounts)
          localStorage.setItem('toolkit_view_counts', JSON.stringify(data.toolViewCounts))
        }
        if (data.history && Array.isArray(data.history)) {
          setHistory(data.history)
        }
        
        toast({
          title: '📥 Import Successful',
          description: 'Your data has been restored'
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          title: '❌ Import Failed',
          description: 'Invalid backup file format'
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }, [toast])
  
  // Get recommended tools based on usage
  const getRecommendedTools = useMemo(() => {
    if (Object.keys(toolViewCounts).length === 0) return []
    
    // Get most viewed tools
    const sortedByViews = Object.entries(toolViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => TOOLS.find(t => t.id === id))
      .filter(Boolean) as Tool[]
    
    return sortedByViews
  }, [toolViewCounts])
  
  // Phase 4: Advanced Features Functions
  
  // Toggle tool selection for comparison
  const toggleToolSelection = useCallback((toolId: string) => {
    setSelectedTools(prev => {
      if (prev.includes(toolId)) {
        return prev.filter(id => id !== toolId)
      }
      if (prev.length >= 4) {
        toast({
          variant: 'destructive',
          title: '⚠️ Maximum 4 tools',
          description: 'You can compare up to 4 tools at a time'
        })
        return prev
      }
      return [...prev, toolId]
    })
  }, [toast])
  
  // Add to history
  const addToHistory = useCallback((toolId: string, action: 'view' | 'run' | 'favorite' | 'collection') => {
    setHistory(prev => {
      const newEntry = { toolId, timestamp: Date.now(), action }
      const updated = [newEntry, ...prev].slice(0, 100) // Keep last 100 entries
      localStorage.setItem('toolkit_history', JSON.stringify(updated))
      return updated
    })
  }, [])
  
  // Get tools for comparison
  const toolsForComparison = useMemo(() => {
    return selectedTools.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as Tool[]
  }, [selectedTools])
  
  // Clear comparison selection
  const clearComparison = useCallback(() => {
    setSelectedTools([])
    setShowComparison(false)
  }, [])
  
  // Get history with tool details
  const historyWithTools = useMemo(() => {
    return history.map(entry => ({
      ...entry,
      tool: TOOLS.find(t => t.id === entry.toolId)
    })).filter(entry => entry.tool)
  }, [history])
  
  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('toolkit_history')
    toast({
      title: '🗑️ History Cleared',
      description: 'All history has been removed'
    })
  }, [toast])
  
  // Copy to clipboard with fallback for older browsers
  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for older browsers or non-HTTPS contexts
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), COPY_SUCCESS_DURATION_MS)
      toast({
        title: '📋 Copied!',
        description: 'Command copied to clipboard'
      })
    } catch (error) {
      console.error('Copy failed:', error)
      toast({
        variant: 'destructive',
        title: '❌ Copy Failed',
        description: 'Could not copy to clipboard'
      })
    }
  }, [toast])
  
  // Batch run scripts (must be after copyToClipboard)
  const runBatchScripts = useCallback(async () => {
    const scriptTools = selectedTools
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is Tool => !!t && !!t.scriptCommand)
    
    if (scriptTools.length === 0) {
      toast({
        variant: 'destructive',
        title: '❌ No Scripts',
        description: 'None of the selected tools have scripts'
      })
      return
    }
    
    toast({
      title: '🚀 Batch Script Mode',
      description: `${scriptTools.length} scripts ready. Copy each command and run in PowerShell (Admin)`
    })
    
    // Show all script commands in a modal or toast
    for (const tool of scriptTools) {
      if (tool.scriptCommand) {
        await copyToClipboard(tool.scriptCommand, `batch-${tool.id}`)
      }
    }
  }, [selectedTools, copyToClipboard, toast])
  
  // Execute script simulation
  const executeScript = useCallback((tool: Tool) => {
    updateActivity()
    if (!tool.scriptCommand) return
    
    trackToolView(tool.id)
    setSelectedScriptTool(tool)
    setShowScriptModal(true)
  }, [updateActivity, trackToolView])
  
  // Run script with progress
  const runScriptWithProgress = useCallback((tool: Tool) => {
    if (!tool.scriptCommand) return
    
    setExecutingScript(tool.id)
    setScriptProgress(0)
    
    // Simulate progress
    const interval = setInterval(() => {
      setScriptProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setExecutingScript(null)
          toast({
            title: '✅ Script Ready!',
            description: `Copy and run the command in PowerShell (Run as Administrator)`
          })
          return 100
        }
        return prev + 10
      })
    }, SCRIPT_PROGRESS_INTERVAL_MS)
    
    // Return cleanup function for potential abort
    return () => clearInterval(interval)
  }, [toast])
  
  // Filter and sort tools
  const filteredTools = useMemo(() => {
    const filtered = TOOLS.filter(tool => {
      const matchesPlatform = tool.platform === activeTab
      const matchesSearch = searchQuery === '' || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = !selectedCategory || tool.category === selectedCategory
      
      // Quick filters
      const matchesQuickFilter = 
        quickFilter === 'all' ||
        (quickFilter === 'favorites' && favorites.includes(tool.id)) ||
        (quickFilter === 'scripts' && tool.isScript) ||
        (quickFilter === 'featured' && tool.isFeatured) ||
        (quickFilter === 'new' && tool.isNew) ||
        (quickFilter === 'recent' && recentlyViewed.includes(tool.id))
      
      // Risk filter
      const matchesRisk = 
        riskFilter === 'all' ||
        tool.risk === riskFilter
      
      return matchesPlatform && matchesSearch && matchesCategory && matchesQuickFilter && matchesRisk
    })
    
    // Sort the filtered results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'downloads':
          // Extract numeric value from downloads string (e.g., "2M+" -> 2000000)
          const parseDownloads = (d: string) => {
            const match = d.match(/(\d+\.?\d*)([KM]?)/i)
            if (!match) return 0
            const num = parseFloat(match[1])
            const mult = match[2].toUpperCase() === 'M' ? 1000000 : match[2].toUpperCase() === 'K' ? 1000 : 1
            return num * mult
          }
          return parseDownloads(b.downloads) - parseDownloads(a.downloads)
        case 'rating':
        default:
          return b.rating - a.rating
      }
    })
  }, [activeTab, searchQuery, selectedCategory, quickFilter, riskFilter, favorites, sortBy, recentlyViewed])
  
  // Get categories for current platform
  const categories = useMemo(() => {
    const cats = new Set(TOOLS.filter(t => t.platform === activeTab).map(t => t.category))
    return Array.from(cats).sort()
  }, [activeTab])
  
  // Reset category when platform changes if current category doesn't exist
  useEffect(() => {
    if (selectedCategory && !categories.includes(selectedCategory)) {
      setSelectedCategory(null)
    }
  }, [activeTab, categories, selectedCategory])
  
  // Sync history to localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('toolkit_history', JSON.stringify(history))
    }
  }, [history])
  
  // Get risk color
  const getRiskColor = (risk: Tool['risk']) => {
    switch (risk) {
      case 'safe': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'moderate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
  }
  
  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`}
          />
        ))}
      </div>
    )
  }
  
  // ============ LOGIN SCREEN ============
  if (isLoadingSession) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
          : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
      }`}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Restoring session...
          </p>
        </div>
      </div>
    )
  }
  
  if (!session?.isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' 
          : 'bg-gradient-to-br from-slate-100 via-white to-slate-100'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? 'bg-blue-600/20' : 'bg-blue-400/20'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
            isDarkMode ? 'bg-purple-600/20' : 'bg-purple-400/20'
          }`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-cyan-600/10' : 'bg-cyan-400/10'
          }`} />
        </div>
        
        <Card className={`relative w-full max-w-md border backdrop-blur-xl ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}>
          <CardHeader className="text-center space-y-4">
            <div className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                : 'bg-gradient-to-br from-blue-500 to-purple-500'
            }`}>
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <CardTitle className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                System Toolkit
              </CardTitle>
              <CardDescription className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter password to access dashboard
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setLoginError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`pr-10 h-12 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                } ${loginError ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {loginError && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {loginError}
              </p>
            )}
            
            <Button
              onClick={handleLogin}
              disabled={!passwordInput || isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Unlock className="w-5 h-5 mr-2" />
                  Unlock Dashboard
                </>
              )}
            </Button>
            
            <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Default password: <code className="px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300">admin123</code></p>
            </div>
            
            <Separator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
            
            <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>🔒 Protected by password authentication</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Theme toggle on login screen */}
        <button
          onClick={toggleTheme}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-600'
          }`}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    )
  }
  
  // ============ MAIN DASHBOARD ============
  return (
    <TooltipProvider>
      <div 
        className={`min-h-screen flex flex-col ${
          isDarkMode 
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white' 
            : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 text-gray-900'
        }`}
        onClick={updateActivity}
        onMouseMove={updateActivity}
        onKeyDown={updateActivity}
        onScroll={updateActivity}
      >
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/10'
          }`} />
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl ${
            isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'
          }`} />
        </div>
        
        {/* Header */}
        <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
          isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo & Title */}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-500'
                }`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">System Toolkit</h1>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {TOOLS.length}+ Tools • Cross-Platform
                  </p>
                </div>
              </div>
              
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <Input
                    placeholder="Search tools, scripts, categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 h-10 ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700 placeholder:text-gray-500' 
                        : 'bg-gray-50 border-gray-200 placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleTheme}
                      className={isDarkMode ? 'text-yellow-400' : 'text-gray-600'}
                    >
                      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle Theme</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFavorites([])}
                      className={isDarkMode ? 'text-red-400' : 'text-red-500'}
                    >
                      <Heart className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{favorites.length} Favorites</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCollectionsModal(true)}
                      className={isDarkMode ? 'text-purple-400' : 'text-purple-500'}
                    >
                      <Bookmark className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{collections.length} Collections</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowStatsModal(true)}
                      className={isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}
                    >
                      <TrendingUp className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Statistics</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowHistoryModal(true)}
                      className={isDarkMode ? 'text-amber-400' : 'text-amber-500'}
                    >
                      <Clock className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>History ({history.length})</TooltipContent>
                </Tooltip>
                
                {selectedTools.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowComparison(true)}
                        className="relative text-green-400"
                      >
                        <Filter className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-xs text-white flex items-center justify-center">
                          {selectedTools.length}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Compare ({selectedTools.length} selected)</TooltipContent>
                  </Tooltip>
                )}
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'
                }`}>
                  <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className="text-sm font-medium">{session.userName}</span>
                </div>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Logout</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Platform Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid grid-cols-6 gap-2 mb-6 bg-transparent h-auto p-0 ${
              isDarkMode ? '' : ''
            }`}>
              {PLATFORMS.map(platform => {
                const Icon = platform.icon
                const toolCount = TOOLS.filter(t => t.platform === platform.id).length
                return (
                  <TabsTrigger
                    key={platform.id}
                    value={platform.id}
                    className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                      activeTab === platform.id
                        ? `bg-gradient-to-br ${platform.color} text-white shadow-lg`
                        : isDarkMode
                          ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50'
                          : 'bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium hidden sm:block">{platform.name}</span>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0">
                      {toolCount}
                    </Badge>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            
            {/* Quick Filters */}
            <div className={`flex flex-wrap items-center gap-2 mb-4 p-3 rounded-xl ${
              isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
            }`}>
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Quick Filters:
              </span>
              <div className="flex flex-wrap gap-1">
                {[
                  { id: 'all', label: 'All', icon: null },
                  { id: 'favorites', label: 'Favorites', icon: Heart },
                  { id: 'recent', label: 'Recent', icon: Clock },
                  { id: 'scripts', label: 'Scripts', icon: Terminal },
                  { id: 'featured', label: 'Featured', icon: Sparkles },
                  { id: 'new', label: 'New', icon: Zap },
                ].map(filter => {
                  const Icon = filter.icon
                  const count = filter.id === 'favorites' ? favorites.length : 
                               filter.id === 'recent' ? recentlyViewed.length : 0
                  return (
                    <Button
                      key={filter.id}
                      variant={quickFilter === filter.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setQuickFilter(filter.id as typeof quickFilter)}
                      className={`h-7 text-xs ${quickFilter === filter.id ? 'bg-blue-600' : ''}`}
                    >
                      {Icon && <Icon className="w-3 h-3 mr-1" />}
                      {filter.label}
                      {count > 0 && <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">{count}</Badge>}
                    </Button>
                  )
                })}
              </div>
              
              <Separator orientation="vertical" className="h-6 mx-2" />
              
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Risk:
              </span>
              <div className="flex gap-1">
                {[
                  { id: 'all', label: 'All', color: '' },
                  { id: 'safe', label: 'Safe', color: 'text-green-400' },
                  { id: 'moderate', label: 'Moderate', color: 'text-yellow-400' },
                  { id: 'advanced', label: 'Advanced', color: 'text-red-400' },
                ].map(filter => (
                  <Button
                    key={filter.id}
                    variant={riskFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRiskFilter(filter.id as typeof riskFilter)}
                    className={`h-7 text-xs ${riskFilter === filter.id ? 'bg-blue-600' : ''} ${filter.color}`}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              
              <div className="ml-auto flex items-center gap-1">
                {/* Sort Options */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setSortBy(prev => prev === 'rating' ? 'name' : prev === 'name' ? 'downloads' : 'rating')}
                    >
                      <SortAsc className="w-3 h-3 mr-1" />
                      {sortBy === 'rating' ? 'Rating' : sortBy === 'name' ? 'Name' : 'Downloads'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sort by {sortBy === 'rating' ? 'Rating' : sortBy === 'name' ? 'Name' : 'Downloads'}</TooltipContent>
                </Tooltip>
                
                {/* View Mode Toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setViewMode(prev => prev === 'grid' ? 'list' : 'grid')}
                    >
                      {viewMode === 'grid' ? <List className="w-3 h-3 mr-1" /> : <Grid className="w-3 h-3 mr-1" />}
                      {viewMode === 'grid' ? 'List' : 'Grid'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Toggle {viewMode === 'grid' ? 'List' : 'Grid'} View</TooltipContent>
                </Tooltip>
                
                <Separator orientation="vertical" className="h-6 mx-1" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowShortcuts(true)}
                >
                  <Keyboard className="w-3 h-3 mr-1" />
                  Shortcuts
                </Button>
              </div>
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              <span className={`text-sm font-medium whitespace-nowrap ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Categories:
              </span>
              <Button
                variant={!selectedCategory ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={!selectedCategory ? 'bg-blue-600' : ''}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'bg-blue-600' : ''}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {/* Results count */}
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {filteredTools.length} tools
              {searchQuery && ` for "${searchQuery}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
            
            {/* Tools Grid/List */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'flex flex-col gap-3'
            }>
              {filteredTools.map(tool => (
                <Card
                  key={tool.id}
                  className={`relative overflow-hidden transition-all hover:scale-[1.02] hover:shadow-xl ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50' 
                      : 'bg-white border-gray-200 hover:border-blue-400'
                  } ${tool.isFeatured ? 'ring-2 ring-blue-500/50' : ''} ${
                    viewMode === 'list' ? 'flex flex-row items-center p-4' : ''
                  }`}
                >
                  {/* Featured badge */}
                  {tool.isFeatured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  
                  {/* Selection checkbox for comparison */}
                  <div className="absolute top-2 left-2 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleToolSelection(tool.id)
                      }}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                        selectedTools.includes(tool.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : isDarkMode
                            ? 'border-gray-600 hover:border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {selectedTools.includes(tool.id) && (
                        <Check className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  
                  {/* New badge */}
                  {tool.isNew && (
                    <div className="absolute top-10 left-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        New
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold">{tool.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm line-clamp-2">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {/* Rating & Downloads */}
                    <div className="flex items-center justify-between">
                      {renderStars(tool.rating)}
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tool.downloads} downloads
                      </span>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {tool.tags.slice(0, 3).map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs px-1.5 py-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Risk Level */}
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Risk Level:
                      </span>
                      <Badge className={getRiskColor(tool.risk)}>
                        {tool.risk}
                      </Badge>
                    </div>
                    
                    {/* Script Command */}
                    {tool.isScript && tool.scriptCommand && (
                      <div className={`p-2 rounded-lg font-mono text-xs ${
                        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-100'
                      }`}>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-blue-400 truncate flex-1">
                            {tool.scriptCommand}
                          </code>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(tool.scriptCommand!, tool.id)}
                              >
                                {copiedId === tool.id ? (
                                  <Check className="w-3 h-3 text-green-400" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Copy Command</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                    
                    <Separator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {tool.isScript && tool.scriptCommand && (
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          size="sm"
                          onClick={() => executeScript(tool)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Run Script
                        </Button>
                      )}
                      <Button
                        className={tool.isScript ? '' : 'flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                        variant={tool.isScript ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => {
                          trackToolView(tool.id)
                          window.open(tool.url, '_blank')
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toggleFavorite(tool.id)}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                favorites.includes(tool.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : ''
                              }`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {favorites.includes(tool.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                        </TooltipContent>
                      </Tooltip>
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => copyToClipboard(tool.url, `url-${tool.id}`)}
                          >
                            {copiedId === `url-${tool.id}` ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy URL</TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* No results */}
            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Search className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-lg font-medium mb-1">No tools found</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </Tabs>
        </main>
        
        {/* Footer */}
        <footer className={`py-4 border-t ${
          isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-sm font-medium">System Toolkit Dashboard</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {TOOLS.length} tools • 6 platforms
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Session: {sessionTime} min
                </span>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Script Execution Dialog */}
        <Dialog open={showScriptModal} onOpenChange={setShowScriptModal}>
          <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'
          }`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Terminal className="w-6 h-6 text-blue-400" />
                {selectedScriptTool?.name || 'Script Execution'}
              </DialogTitle>
              <DialogDescription>
                {selectedScriptTool?.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Warning Banner */}
              <div className={`p-4 rounded-lg border ${
                selectedScriptTool?.risk === 'advanced' 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : selectedScriptTool?.risk === 'moderate'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                    selectedScriptTool?.risk === 'advanced' 
                      ? 'text-red-400' 
                      : selectedScriptTool?.risk === 'moderate'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                  }`} />
                  <div>
                    <h4 className="font-medium">Risk Level: {selectedScriptTool?.risk}</h4>
                    <p className="text-sm mt-1 opacity-80">
                      {selectedScriptTool?.risk === 'advanced' 
                        ? 'This script makes advanced system changes. Use with caution and create a restore point first.'
                        : selectedScriptTool?.risk === 'moderate'
                          ? 'This script modifies system settings. Review changes before applying.'
                          : 'This script is safe to run and makes reversible changes.'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  How to Run
                </h4>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">1</span>
                    <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white text-xs">Win + X</kbd> and select <strong>Terminal (Admin)</strong> or <strong>PowerShell (Admin)</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">2</span>
                    <span>Copy the command below by clicking the copy button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">3</span>
                    <span>Paste in the PowerShell window and press <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white text-xs">Enter</kbd></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold shrink-0">4</span>
                    <span>Follow the on-screen instructions in the tool</span>
                  </li>
                </ol>
              </div>
              
              {/* Script Command */}
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-green-400" />
                  PowerShell Command
                </h4>
                <div className={`relative p-4 rounded-lg font-mono text-sm ${
                  isDarkMode ? 'bg-gray-950 border border-gray-800' : 'bg-gray-100 border border-gray-200'
                }`}>
                  <code className="text-green-400 break-all pr-12">
                    {selectedScriptTool?.scriptCommand}
                  </code>
                  <Button
                    className="absolute top-2 right-2"
                    size="sm"
                    onClick={() => {
                      if (selectedScriptTool?.scriptCommand) {
                        copyToClipboard(selectedScriptTool.scriptCommand, 'modal-script')
                      }
                    }}
                  >
                    {copiedId === 'modal-script' ? (
                      <><Check className="w-4 h-4 mr-1" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-1" /> Copy</>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Progress (if running) */}
              {executingScript && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Preparing script...</span>
                    <span>{scriptProgress}%</span>
                  </div>
                  <Progress value={scriptProgress} className="h-2" />
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={() => {
                    if (selectedScriptTool?.scriptCommand) {
                      copyToClipboard(selectedScriptTool.scriptCommand, 'modal-script')
                      toast({
                        title: '📋 Command Copied!',
                        description: 'Open PowerShell as Administrator and paste the command'
                      })
                    }
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Command
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedScriptTool) {
                      window.open(selectedScriptTool.url, '_blank')
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Website
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Keyboard Shortcuts Modal */}
        <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
          <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-blue-400" />
                Keyboard Shortcuts
              </DialogTitle>
              <DialogDescription>
                Use these shortcuts to navigate quickly
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { key: '/', action: 'Focus search' },
                      { key: 'D', action: 'Toggle dark/light theme' },
                      { key: 'F', action: 'Toggle favorites filter' },
                      { key: 'S', action: 'Toggle scripts filter' },
                      { key: '1-6', action: 'Switch platform tabs' },
                      { key: '?', action: 'Show/hide shortcuts' },
                      { key: 'Esc', action: 'Close modals' },
                    ].map((shortcut, i) => (
                      <tr key={i} className="border-b border-gray-700/30 last:border-0">
                        <td className="py-2">
                          <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                          }`}>
                            {shortcut.key}
                          </kbd>
                        </td>
                        <td className={`py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          {shortcut.action}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Press <kbd className="px-1.5 py-0.5 rounded bg-gray-700 text-white text-xs">?</kbd> anytime to toggle this help
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Collections Modal */}
        <Dialog open={showCollectionsModal} onOpenChange={setShowCollectionsModal}>
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-purple-400" />
                My Collections
              </DialogTitle>
              <DialogDescription>
                Create and manage your tool collections
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Create new collection */}
              <div className="flex gap-2">
                <Input
                  placeholder="New collection name..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className={`flex-1 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                />
                <Button 
                  onClick={() => {
                    if (newCollectionName.trim()) {
                      createCollection(newCollectionName.trim())
                      setNewCollectionName('')
                    }
                  }}
                  disabled={!newCollectionName.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Create
                </Button>
              </div>
              
              {/* Collections list */}
              {collections.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No collections yet</p>
                  <p className="text-sm">Create a collection to organize your favorite tools</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {collections.map(collection => (
                    <Card key={collection.id} className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full bg-${collection.color}-500`} />
                            {collection.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{collection.toolIds.length} tools</Badge>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-400 hover:text-red-300"
                              onClick={() => deleteCollection(collection.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {collection.toolIds.length === 0 ? (
                          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            No tools in this collection
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {collection.toolIds.slice(0, 5).map(toolId => {
                              const tool = TOOLS.find(t => t.id === toolId)
                              return tool ? (
                                <Badge key={toolId} variant="outline" className="text-xs">
                                  {tool.name}
                                </Badge>
                              ) : null
                            })}
                            {collection.toolIds.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{collection.toolIds.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Statistics Modal */}
        <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
          <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Usage Statistics
              </DialogTitle>
              <DialogDescription>
                Your tool usage insights
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Overview stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="pt-4 text-center">
                    <Heart className="w-6 h-6 mx-auto mb-2 text-red-400" />
                    <p className="text-2xl font-bold">{favorites.length}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Favorites</p>
                  </CardContent>
                </Card>
                <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="pt-4 text-center">
                    <Eye className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <p className="text-2xl font-bold">{Object.keys(toolViewCounts).length}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tools Viewed</p>
                  </CardContent>
                </Card>
                <Card className={`${isDarkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <CardContent className="pt-4 text-center">
                    <Bookmark className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-2xl font-bold">{collections.length}</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Collections</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Most viewed tools */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Most Viewed Tools
                </h3>
                {getRecommendedTools.length === 0 ? (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No usage data yet. Start clicking on tools to track your usage!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {getRecommendedTools.map((tool, index) => (
                      <div 
                        key={tool.id}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-amber-700 text-white' :
                            isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                          <div>
                            <p className="text-sm font-medium">{tool.name}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {tool.category}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {toolViewCounts[tool.id] || 0} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Export/Import */}
              <div className={`pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className="text-sm font-semibold mb-3">Data Management</h3>
                <div className="flex gap-2">
                  <Button onClick={exportData} variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <label className="flex-1">
                    <Button variant="outline" className="w-full" asChild>
                      <span>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Import Data
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Comparison Modal */}
        <Dialog open={showComparison} onOpenChange={setShowComparison}>
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-green-400" />
                Compare Tools ({selectedTools.length} selected)
              </DialogTitle>
              <DialogDescription>
                Side-by-side comparison of selected tools
              </DialogDescription>
            </DialogHeader>
            
            {toolsForComparison.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Filter className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No tools selected</p>
                <p className="text-sm">Select up to 4 tools to compare</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Comparison table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <th className={`text-left p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Feature</th>
                        {toolsForComparison.map(tool => (
                          <th key={tool.id} className="text-left p-3 font-semibold">
                            <div className="flex items-center gap-2">
                              {tool.name}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => toggleToolSelection(tool.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Category</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">{tool.category}</td>
                        ))}
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rating</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">
                            <div className="flex items-center gap-1">
                              {renderStars(tool.rating)}
                              <span className="ml-1">({tool.rating})</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Downloads</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">{tool.downloads}</td>
                        ))}
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Level</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">
                            <Badge className={getRiskColor(tool.risk)}>{tool.risk}</Badge>
                          </td>
                        ))}
                      </tr>
                      <tr className={`border-b ${isDarkMode ? 'border-gray-700/50' : 'border-gray-100'}`}>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Script</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">
                            {tool.isScript ? (
                              <Badge className="bg-green-500/20 text-green-400">Yes</Badge>
                            ) : (
                              <Badge variant="outline">No</Badge>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className={`p-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tags</td>
                        {toolsForComparison.map(tool => (
                          <td key={tool.id} className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {tool.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                {/* Actions */}
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearComparison}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                  <div className="flex gap-2">
                    {toolsForComparison.some(t => t.isScript) && (
                      <Button onClick={runBatchScripts} className="bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-2" />
                        Run Scripts ({toolsForComparison.filter(t => t.isScript).length})
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* History Modal */}
        <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Activity History
              </DialogTitle>
              <DialogDescription>
                Your recent tool interactions
              </DialogDescription>
            </DialogHeader>
            
            {historyWithTools.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No history yet</p>
                <p className="text-sm">Start interacting with tools to see your history</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  {historyWithTools.slice(0, 50).map((entry, index) => (
                    <div 
                      key={`${entry.toolId}-${entry.timestamp}`}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          entry.action === 'view' ? 'bg-blue-500/20 text-blue-400' :
                          entry.action === 'run' ? 'bg-green-500/20 text-green-400' :
                          entry.action === 'favorite' ? 'bg-red-500/20 text-red-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {entry.action === 'view' && <Eye className="w-4 h-4" />}
                          {entry.action === 'run' && <Play className="w-4 h-4" />}
                          {entry.action === 'favorite' && <Heart className="w-4 h-4" />}
                          {entry.action === 'collection' && <Bookmark className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{entry.tool?.name}</p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {new Date(entry.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {entry.action}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {history.length > 50 && (
                  <p className={`text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Showing last 50 of {history.length} entries
                  </p>
                )}
                
                <div className="flex justify-end">
                  <Button variant="outline" onClick={clearHistory} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
