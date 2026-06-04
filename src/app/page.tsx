'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Lock, Unlock, Shield, Zap, Star, ExternalLink, Copy, Check, Search,
  Moon, Sun, Monitor, Trash2, Download, Settings, Info, AlertTriangle,
  Terminal, Cpu, HardDrive, Wifi, Battery, Globe, Smartphone, Tablet,
  ChevronUp, Heart, Bookmark, Share2, RefreshCw, Clock, User, LogOut,
  KeyRound, Fingerprint, Sparkles, TrendingUp,
  Laptop, Play, Pause, RotateCcw, CheckCircle2, XCircle, Loader2, Keyboard,
  Grid, List, SortAsc, Filter, X, Plus, MoreVertical, Eye, EyeOff, Menu
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
// Multiple passwords for access (5 different passwords)
const VALID_PASSWORDS = [
  'admin123',           // Default admin password
  'nextgen2025',        // NextGen Digital Studio password
  'toolkit@123',        // Toolkit password
  'secure#pass',        // Secure password
  'master@key'          // Master key password
]

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

// ============ ANIMATION VARIANTS ============
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2, ease: 'easeOut' } }
}

const pulseAnimation = {
  initial: { opacity: 0.5 },
  animate: { opacity: 1, transition: { repeat: Infinity, repeatType: 'reverse', duration: 1 } }
}

// ============ SKELETON COMPONENTS ============
function SkeletonCard({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <div className={`rounded-xl overflow-hidden ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-gray-700/30' 
        : 'bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200'
    }`}>
      <div className="p-4 space-y-3">
        <motion.div 
          className={`h-5 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: '60%' }}
        />
        <motion.div 
          className={`h-4 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
          style={{ width: '100%' }}
        />
        <motion.div 
          className={`h-4 rounded ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          style={{ width: '80%' }}
        />
        <div className="flex gap-2 pt-2">
          <motion.div 
            className={`h-6 w-16 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
          <motion.div 
            className={`h-6 w-20 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </motion.div>
  )
}

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
  { id: 'w23', name: 'System File Checker (SFC)', description: 'Scan and restore corrupted Windows system files. Essential for system stability.', category: 'System Repair', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sfc', risk: 'safe', rating: 5, downloads: '50M+', tags: ['repair', 'system-files', 'essential'], isScript: true, scriptCommand: 'sfc /scannow', isFeatured: true },
  { id: 'w24', name: 'Disk Check (CHKDSK)', description: 'Check disk for errors and bad sectors. Repairs file system issues.', category: 'Diagnostics', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/chkdsk', risk: 'safe', rating: 4.9, downloads: '30M+', tags: ['disk', 'repair', 'diagnostics'], isScript: true, scriptCommand: 'chkdsk /r' },
  { id: 'w25', name: 'DISM System Repair', description: 'Repair Windows image and component store. Fixes Windows Update issues.', category: 'System Repair', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/dism-operating-system-package-servicing-command-line-options', risk: 'safe', rating: 4.8, downloads: '20M+', tags: ['repair', 'windows-update', 'system'], isScript: true, scriptCommand: 'dism.exe /online /cleanup-image /restorehealth && dism.exe /online /cleanup-image /startcomponentcleanup' },
  { id: 'w26', name: 'Windows Server Setup', description: 'Convert Windows 11 to Windows Server edition. Advanced setup tool.', category: 'System Setup', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-server/', risk: 'advanced', rating: 4.5, downloads: '1M+', tags: ['server', 'setup', 'advanced'], isScript: true, scriptCommand: 'C:\\Win11\\setup.exe /product server', isNew: true },
  { id: 'w27', name: 'Windows Activation (MAS)', description: 'Open-source Windows and Office activator. HWID and KMS activation.', category: 'Activation', platform: 'windows', url: 'https://github.com/massgravel/Microsoft-Activation-Scripts', risk: 'advanced', rating: 5, downloads: '15M+', tags: ['activation', 'windows', 'office'], isScript: true, scriptCommand: 'irm https://get.activated.win | iex', isFeatured: true },
  { id: 'w28', name: 'RaphiRe Debloat', description: 'Modern Windows debloat tool. Clean, fast, and effective.', category: 'System Optimization', platform: 'windows', url: 'https://github.com/Raphire/Win11Debloat', risk: 'safe', rating: 4.9, downloads: '500K+', tags: ['debloat', 'privacy', 'performance'], isScript: true, scriptCommand: '& ([scriptblock]::Create((irm "https://debloat.raphi.re/")))', isNew: true },
  { id: 'w29', name: 'Chris Titus Dev Tool', description: 'Windows Dev utility for advanced system management and tweaks.', category: 'System Optimization', platform: 'windows', url: 'https://github.com/ChrisTitusTech/winutil', risk: 'safe', rating: 4.9, downloads: '3M+', tags: ['dev', 'tweaks', 'optimization'], isScript: true, scriptCommand: 'irm "https://christitus.com/windev" | iex' },

  // ========== NEW WINDOWS TOOLS (Phase 3) ==========
  { id: 'w30', name: 'Windows Update Reset', description: 'Reset Windows Update components to fix update issues. Clears cache and resets services.', category: 'System Repair', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows/deployment/update/windows-update-resources', risk: 'safe', rating: 4.8, downloads: '10M+', tags: ['windows-update', 'repair', 'troubleshoot'], isScript: true, scriptCommand: 'net stop wuauserv && net stop bits && net stop cryptsvc && ren C:\\Windows\\SoftwareDistribution SoftwareDistribution.old && ren C:\\Windows\\System32\\catroot2 catroot2.old && net start wuauserv && net start bits && net start cryptsvc', isNew: true },
  { id: 'w31', name: 'DNS Flush & Reset', description: 'Flush DNS cache and reset network stack. Fixes network connectivity issues.', category: 'Network', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/ipconfig', risk: 'safe', rating: 4.9, downloads: '20M+', tags: ['dns', 'network', 'troubleshoot'], isScript: true, scriptCommand: 'ipconfig /flushdns && ipconfig /registerdns && ipconfig /release && ipconfig /renew && netsh winsock reset', isNew: true },
  { id: 'w32', name: 'GPU Driver Uninstaller (DDU)', description: 'Display Driver Uninstaller - Completely remove GPU drivers for clean install.', category: 'Drivers', platform: 'windows', url: 'https://www.wagnardsoft.com/display-driver-uninstaller-ddu-', risk: 'safe', rating: 4.9, downloads: '15M+', tags: ['gpu', 'drivers', 'nvidia', 'amd'], isFeatured: true },
  { id: 'w33', name: 'NVCleanstall', description: 'Custom NVIDIA driver installer. Remove telemetry, install only needed components.', category: 'Drivers', platform: 'windows', url: 'https://www.techpowerup.com/nvcleanstall/', risk: 'safe', rating: 4.7, downloads: '5M+', tags: ['nvidia', 'drivers', 'telemetry'], isNew: true },
  { id: 'w34', name: 'Windows Tweaker (SophiApp)', description: 'Modern Windows 10/11 tweaker with 100+ options. Open source and safe.', category: 'System Optimization', platform: 'windows', url: 'https://github.com/Sophia-Community/SophiApp', risk: 'safe', rating: 4.8, downloads: '2M+', tags: ['tweaks', 'optimization', 'privacy'], isScript: true, scriptCommand: 'irm https://sophia.community/install | iex', isNew: true },
  { id: 'w35', name: 'Glary Utilities', description: 'All-in-one system utilities for PC optimization, repair, and maintenance.', category: 'System Optimization', platform: 'windows', url: 'https://www.glarysoft.com/glary-utilities/', risk: 'safe', rating: 4.6, downloads: '25M+', tags: ['optimization', 'cleanup', 'maintenance'] },
  { id: 'w36', name: 'Windows Defender Configurator', description: 'Configure Windows Defender settings. Enable/disable real-time protection.', category: 'Security', platform: 'windows', url: 'https://github.com/AndyFul/ConfigureDefender', risk: 'moderate', rating: 4.5, downloads: '1M+', tags: ['defender', 'antivirus', 'security'], isNew: true },
  { id: 'w37', name: 'Temp File Cleaner', description: 'Clean all temporary files from Windows. Free up disk space instantly.', category: 'Cleanup', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/del', risk: 'safe', rating: 4.7, downloads: '30M+', tags: ['cleanup', 'temp', 'disk-space'], isScript: true, scriptCommand: 'del /q/f/s %TEMP%\\* && del /q/f/s C:\\Windows\\Temp\\*', isNew: true },
  { id: 'w38', name: 'PowerPlan Switcher', description: 'Switch to High Performance power plan for maximum system performance.', category: 'Performance', platform: 'windows', url: 'https://learn.microsoft.com/en-us/windows-hardware/design/device-experiences/powercfg-command-line-options', risk: 'safe', rating: 4.6, downloads: '15M+', tags: ['power', 'performance', 'gaming'], isScript: true, scriptCommand: 'powercfg /setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c', isNew: true },
  { id: 'w39', name: 'Privazer', description: 'Deep system cleaner that removes traces of your activities permanently.', category: 'Privacy', platform: 'windows', url: 'https://privazer.com/', risk: 'moderate', rating: 4.7, downloads: '8M+', tags: ['privacy', 'cleanup', 'secure-delete'], isNew: true },

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
  { id: 'c11', name: 'PeaZip', description: 'Free file archiver utility for all major archive formats.', category: 'Utilities', platform: 'cross-platform', url: 'https://peazip.github.io/', risk: 'safe', rating: 4.6, downloads: '5M+', tags: ['archive', 'compression', 'free'], isNew: true },
  { id: 'c12', name: 'Joplin', description: 'Open source note-taking and to-do application.', category: 'Productivity', platform: 'cross-platform', url: 'https://joplinapp.org/', risk: 'safe', rating: 4.7, downloads: '5M+', tags: ['notes', 'todo', 'open-source'], isNew: true },
  { id: 'c13', name: 'ONLYOFFICE', description: 'Free office suite for documents, spreadsheets, presentations.', category: 'Productivity', platform: 'cross-platform', url: 'https://www.onlyoffice.com/', risk: 'safe', rating: 4.5, downloads: '15M+', tags: ['office', 'documents', 'free'], isNew: true },
  { id: 'c14', name: 'LibreOffice', description: 'Free and powerful open source office suite.', category: 'Productivity', platform: 'cross-platform', url: 'https://www.libreoffice.org/', risk: 'safe', rating: 4.6, downloads: '50M+', tags: ['office', 'documents', 'open-source'] },
  { id: 'c15', name: 'Audacity', description: 'Free, open source, cross-platform audio editor.', category: 'Media', platform: 'cross-platform', url: 'https://www.audacityteam.org/', risk: 'safe', rating: 4.7, downloads: '100M+', tags: ['audio', 'editor', 'recording'], isFeatured: true },

  // ========== NEW CROSS PLATFORM TOOLS (Phase 3) ==========
  { id: 'c16', name: 'KeePass', description: 'Free, open source, light-weight password manager. Cross-platform with plugins.', category: 'Security', platform: 'cross-platform', url: 'https://keepass.info/', risk: 'safe', rating: 4.8, downloads: '20M+', tags: ['password', 'security', 'offline'], isNew: true },
  { id: 'c17', name: 'GIMP', description: 'Free and open-source image editor. Professional-grade photo manipulation.', category: 'Media', platform: 'cross-platform', url: 'https://www.gimp.org/', risk: 'safe', rating: 4.6, downloads: '50M+', tags: ['image', 'editor', 'graphics'], isNew: true },
  { id: 'c18', name: 'Inkscape', description: 'Free vector graphics editor. Create and edit SVG files professionally.', category: 'Media', platform: 'cross-platform', url: 'https://inkscape.org/', risk: 'safe', rating: 4.7, downloads: '15M+', tags: ['vector', 'graphics', 'svg'], isNew: true },
  { id: 'c19', name: 'OBS Studio', description: 'Free and open source software for video recording and live streaming.', category: 'Media', platform: 'cross-platform', url: 'https://obsproject.com/', risk: 'safe', rating: 4.9, downloads: '100M+', tags: ['streaming', 'recording', 'video'], isFeatured: true, isNew: true },
  { id: 'c20', name: 'Veracrypt', description: 'Free open source disk encryption with strong security. Cross-platform.', category: 'Security', platform: 'cross-platform', url: 'https://www.veracrypt.fr/', risk: 'safe', rating: 4.9, downloads: '10M+', tags: ['encryption', 'privacy', 'security'], isNew: true },
]

// ============ MAIN COMPONENT ============
export default function SystemToolkitDashboard() {
  const { toast } = useToast()
  
  // Auth State
  const [session, setSession] = useState<UserSession | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [lockoutEndTime, setLockoutEndTime] = useState<number | null>(null)
  const [showSessionWarning, setShowSessionWarning] = useState(false)
  
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
  
  // Phase 5: Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    onConfirm: () => void
    variant: 'danger' | 'warning'
  } | null>(null)
  
  // Phase 6: One-Click Auto-Install State
  const [autoInstallMode, setAutoInstallMode] = useState(false)
  const [installProgress, setInstallProgress] = useState<{
    toolId: string
    status: 'preparing' | 'downloading' | 'installing' | 'configuring' | 'completed' | 'error'
    progress: number
    message: string
  } | null>(null)
  const [showAutoInstallModal, setShowAutoInstallModal] = useState(false)
  const [installQueue, setInstallQueue] = useState<string[]>([])
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)
  
  // Logout flag to prevent race condition - using ref for immediate value
  const isLoggingOutRef = useRef(false)
  
  // Phase 7: Enhanced Auto-Install & Script Management State
  const [scriptFavorites, setScriptFavorites] = useState<string[]>([])
  const [scriptHistory, setScriptHistory] = useState<{ toolId: string; timestamp: number; command: string; status: 'success' | 'error' | 'pending' }[]>([])
  const [showScriptQueueModal, setShowScriptQueueModal] = useState(false)
  const [scriptQueue, setScriptQueue] = useState<string[]>([])
  const [isRunningBatchScripts, setIsRunningBatchScripts] = useState(false)
  
  // Phase 8: Enhanced Backup/Restore State
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [backupSettings, setBackupSettings] = useState({
    includeFavorites: true,
    includeCollections: true,
    includeHistory: true,
    includeScriptFavorites: true,
    includeScriptHistory: true,
    includeSettings: true
  })
  
  // Phase 9: Sub-Categories & Related Tools State
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [showRelatedTools, setShowRelatedTools] = useState(true)
  
  // Phase 10: Quick Actions with Confirmation State
  const [pendingRiskyAction, setPendingRiskyAction] = useState<{
    tool: Tool
    action: 'run' | 'install'
  } | null>(null)
  
  // ============ PHASE 4: SECURITY & PERFORMANCE STATE ============
  
  // Session Management State
  const [sessionCountdown, setSessionCountdown] = useState<number | null>(null)
  const [rememberMe, setRememberMe] = useState(false)
  const [sessionFingerprint, setSessionFingerprint] = useState<string>('')
  const [csrfToken, setCsrfToken] = useState<string>('')
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now())
  
  // Error Handling State
  const [errorLog, setErrorLog] = useState<{ timestamp: number; message: string; stack?: string }[]>([])
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [currentError, setCurrentError] = useState<string | null>(null)
  const [retryAction, setRetryAction] = useState<(() => void) | null>(null)
  
  // Caching State
  const [toolCache, setToolCache] = useState<Record<string, { data: Tool; timestamp: number }>>({})
  const [isOffline, setIsOffline] = useState(false)
  const [cacheInvalidationKey, setCacheInvalidationKey] = useState(0)
  
  // Performance State
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  
  // Rate Limiting State
  const [loginRateLimit, setLoginRateLimit] = useState<{
    attempts: number
    lastAttempt: number
    blocked: boolean
    blockedUntil: number | null
  }>({ attempts: 0, lastAttempt: 0, blocked: false, blockedUntil: null })
  
  // Check session on mount
  useEffect(() => {
    // Don't restore session if we're logging out
    if (isLoggingOutRef.current) {
      setIsLoadingSession(false)
      return
    }
    
    try {
      const savedSession = localStorage.getItem('toolkit_session')
      if (savedSession && !isLoggingOutRef.current) {
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
      
      // Load Phase 7 data - Script Favorites & History
      const savedScriptFavorites = localStorage.getItem('toolkit_script_favorites')
      if (savedScriptFavorites) {
        try {
          const parsedScriptFavorites = JSON.parse(savedScriptFavorites)
          if (Array.isArray(parsedScriptFavorites)) {
            setScriptFavorites(parsedScriptFavorites)
          }
        } catch (parseError) {
          console.warn('Failed to parse script favorites:', parseError)
        }
      }
      
      const savedScriptHistory = localStorage.getItem('toolkit_script_history')
      if (savedScriptHistory) {
        try {
          const parsedScriptHistory = JSON.parse(savedScriptHistory)
          if (Array.isArray(parsedScriptHistory)) {
            setScriptHistory(parsedScriptHistory)
          }
        } catch (parseError) {
          console.warn('Failed to parse script history:', parseError)
        }
      }
    } catch (error) {
      console.error('Error loading session data:', error)
    } finally {
      setIsLoadingSession(false)
    }
  }, [])
  
  // ============ PHASE 4: SECURITY & PERFORMANCE UTILITIES ============
  
  // Copy to clipboard with fallback for older browsers (moved here to fix dependency order)
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
  
  // ============ PHASE 4: ENHANCED UTILITIES ============
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])
  
  // Session fingerprinting simulation
  const generateFingerprint = useCallback(() => {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      'toolkit-v2'
    ]
    // Simple hash simulation (in production, use a proper crypto library)
    const fingerprint = components.join('|').split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0
    }, 0)
    return `fp_${Math.abs(fingerprint).toString(16)}`
  }, [])
  
  // CSRF token generation
  const generateCsrfToken = useCallback(() => {
    const array = new Uint32Array(4)
    crypto.getRandomValues(array)
    return Array.from(array, x => x.toString(16)).join('')
  }, [])
  
  // Input sanitization
  const sanitizeInput = useCallback((input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
      .slice(0, 1000) // Limit length
  }, [])
  
  // Simple encryption simulation (for demo purposes)
  const encryptData = useCallback((data: string): string => {
    try {
      // Simple base64 encoding with prefix (in production, use proper encryption)
      const encoded = btoa(encodeURIComponent(data))
      return `enc_${encoded}`
    } catch {
      return data
    }
  }, [])
  
  // Simple decryption simulation
  const decryptData = useCallback((data: string): string => {
    try {
      if (!data.startsWith('enc_')) return data
      const decoded = atob(data.slice(4))
      return decodeURIComponent(decoded)
    } catch {
      return data
    }
  }, [])
  
  // Error logging function
  const logError = useCallback((message: string, error?: Error) => {
    const logEntry = {
      timestamp: Date.now(),
      message,
      stack: error?.stack
    }
    setErrorLog(prev => {
      const updated = [logEntry, ...prev].slice(0, 50) // Keep last 50 errors
      localStorage.setItem('toolkit_error_log', JSON.stringify(updated))
      return updated
    })
    console.error(`[Error] ${message}`, error)
  }, [])
  
  // Cache management
  const getCachedTool = useCallback((toolId: string): Tool | null => {
    const cached = toolCache[toolId]
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 min cache
      return cached.data
    }
    return null
  }, [toolCache])
  
  const setCachedTool = useCallback((toolId: string, tool: Tool) => {
    setToolCache(prev => ({
      ...prev,
      [toolId]: { data: tool, timestamp: Date.now() }
    }))
  }, [])
  
  const invalidateCache = useCallback(() => {
    setToolCache({})
    setCacheInvalidationKey(prev => prev + 1)
    toast({
      title: '🗑️ Cache Cleared',
      description: 'Tool cache has been invalidated'
    })
  }, [toast])
  
  // Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Check initial state
    setIsOffline(!navigator.onLine)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  // Initialize CSRF token and fingerprint on mount
  useEffect(() => {
    setCsrfToken(generateCsrfToken())
    setSessionFingerprint(generateFingerprint())
  }, [generateCsrfToken, generateFingerprint])
  
  // Rate limiting check
  const checkRateLimit = useCallback((): { allowed: boolean; waitTime: number } => {
    const now = Date.now()
    const windowMs = 15 * 60 * 1000 // 15 minutes
    const maxAttempts = 5
    
    if (loginRateLimit.blocked && loginRateLimit.blockedUntil && now < loginRateLimit.blockedUntil) {
      return { allowed: false, waitTime: Math.ceil((loginRateLimit.blockedUntil - now) / 1000) }
    }
    
    // Reset if window has passed
    if (now - loginRateLimit.lastAttempt > windowMs) {
      setLoginRateLimit({ attempts: 0, lastAttempt: now, blocked: false, blockedUntil: null })
      return { allowed: true, waitTime: 0 }
    }
    
    if (loginRateLimit.attempts >= maxAttempts) {
      const blockedUntil = now + 30 * 60 * 1000 // Block for 30 minutes
      setLoginRateLimit(prev => ({ ...prev, blocked: true, blockedUntil }))
      return { allowed: false, waitTime: 30 * 60 }
    }
    
    return { allowed: true, waitTime: 0 }
  }, [loginRateLimit])
  
  // Record login attempt
  const recordLoginAttempt = useCallback((success: boolean) => {
    if (success) {
      setLoginRateLimit({ attempts: 0, lastAttempt: 0, blocked: false, blockedUntil: null })
    } else {
      setLoginRateLimit(prev => ({
        ...prev,
        attempts: prev.attempts + 1,
        lastAttempt: Date.now()
      }))
    }
  }, [])
  
  // Retry handler
  const handleRetry = useCallback(() => {
    if (retryAction) {
      retryAction()
      setRetryAction(null)
      setCurrentError(null)
      setShowErrorModal(false)
    }
  }, [retryAction])
  
  // Show error with retry option
  const showError = useCallback((message: string, retry?: () => void) => {
    setCurrentError(message)
    setRetryAction(retry || null)
    setShowErrorModal(true)
    logError(message)
  }, [logError])
  
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
    // Set flag FIRST to prevent any re-renders from restoring session
    isLoggingOutRef.current = true
    
    // Clear localStorage FIRST before state updates
    localStorage.removeItem('toolkit_session')
    
    // Clear session state
    setSession(null)
    
    // Reset password input
    setPasswordInput('')
    
    // Clear any cached data
    setFavorites([])
    setCollections([])
    setRecentlyViewed([])
    setToolViewCounts({})
    setHistory([])
    setScriptHistory([])
    setScriptFavorites([])
    setSelectedTools([])
    
    // Show toast
    toast({
      title: '🔒 Logged Out',
      description: 'Session ended successfully'
    })
    
    // Reset flag after a short delay to allow navigation
    setTimeout(() => {
      isLoggingOutRef.current = false
    }, 500)
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
  
  // Session timeout warning (5 minutes before expiry)
  useEffect(() => {
    if (!session) return
    
    const warningInterval = setInterval(() => {
      const storedSession = localStorage.getItem('toolkit_session')
      if (storedSession) {
        try {
          const parsed = JSON.parse(storedSession) as UserSession
          const timeLeft = SESSION_TIMEOUT_MS - (Date.now() - parsed.lastActivity)
          const fiveMinutes = 5 * 60 * 1000
          
          if (timeLeft < fiveMinutes && timeLeft > 0) {
            setShowSessionWarning(true)
          } else {
            setShowSessionWarning(false)
          }
        } catch {
          // Ignore parse errors
        }
      }
    }, 60000) // Check every minute
    
    return () => clearInterval(warningInterval)
  }, [session])
  
  // Extend session function
  const extendSession = useCallback(() => {
    if (session) {
      const newSession = { ...session, lastActivity: Date.now() }
      setSession(newSession)
      localStorage.setItem('toolkit_session', JSON.stringify(newSession))
      setShowSessionWarning(false)
      toast({
        title: '⏰ Session Extended',
        description: 'Your session has been extended for another 30 minutes'
      })
    }
  }, [session, toast])
  
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
  }, [session, toggleTheme])
  
  // Update activity - with race condition protection
  const updateActivity = useCallback(() => {
    // Don't update if logging out or no session
    if (isLoggingOutRef.current || !session) return
    
    // Check localStorage first to ensure session exists
    const storedSession = localStorage.getItem('toolkit_session')
    if (!storedSession) return
    
    const newSession = { ...session, lastActivity: Date.now() }
    setSession(newSession)
    localStorage.setItem('toolkit_session', JSON.stringify(newSession))
  }, [session])
  
  // Safe URL opener - works around popup blockers
  const safeOpenUrl = useCallback((url: string) => {
    // Try direct window.open first
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    
    // If blocked, create a temporary link and click it
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [])
  
  // Login handler with enhanced security (Phase 4)
  const handleLogin = useCallback(async () => {
    // Check rate limiting
    const rateCheck = checkRateLimit()
    if (!rateCheck.allowed) {
      setLoginError(`Too many failed attempts. Try again in ${Math.floor(rateCheck.waitTime / 60)} minutes.`)
      toast({
        variant: 'destructive',
        title: '⏳ Rate Limited',
        description: `Please wait ${Math.floor(rateCheck.waitTime / 60)} minutes before trying again.`
      })
      return
    }
    
    // Check if locked out (legacy)
    if (isLockedOut && lockoutEndTime && Date.now() < lockoutEndTime) {
      const remainingSeconds = Math.ceil((lockoutEndTime - Date.now()) / 1000)
      setLoginError(`Too many failed attempts. Try again in ${remainingSeconds} seconds.`)
      return
    }
    
    // Reset lockout if time has passed
    if (lockoutEndTime && Date.now() >= lockoutEndTime) {
      setIsLockedOut(false)
      setLockoutEndTime(null)
      setLoginAttempts(0)
    }
    
    setIsLoading(true)
    setLoginError('')
    
    // Sanitize input
    const sanitizedPassword = sanitizeInput(passwordInput)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (VALID_PASSWORDS.includes(sanitizedPassword)) {
      const newSession: UserSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        userName: 'Administrator'
      }
      
      // Encrypt session data if Remember Me is checked
      const sessionData = JSON.stringify(newSession)
      const encryptedSession = rememberMe ? encryptData(sessionData) : sessionData
      
      setSession(newSession)
      localStorage.setItem('toolkit_session', encryptedSession)
      
      // Store fingerprint for session validation
      localStorage.setItem('toolkit_fingerprint', sessionFingerprint)
      localStorage.setItem('toolkit_csrf', csrfToken)
      
      // Reset rate limiting on successful login
      recordLoginAttempt(true)
      setLoginAttempts(0)
      
      toast({
        title: '🔓 Login Successful',
        description: `Welcome to System Toolkit Dashboard${rememberMe ? ' (Session will be remembered)' : ''}`
      })
    } else {
      // Record failed attempt
      recordLoginAttempt(false)
      
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      // Lock out after 5 failed attempts
      if (newAttempts >= 5) {
        const lockoutTime = Date.now() + (30 * 1000) // 30 second lockout
        setIsLockedOut(true)
        setLockoutEndTime(lockoutTime)
        setLoginError('Too many failed attempts. Please wait 30 seconds.')
        toast({
          variant: 'destructive',
          title: '🔒 Account Temporarily Locked',
          description: 'Too many failed login attempts. Please wait 30 seconds.'
        })
        
        // Log security event
        logError('Multiple failed login attempts detected')
      } else {
        setLoginError(`Invalid password. ${5 - newAttempts} attempts remaining.`)
        toast({
          variant: 'destructive',
          title: '❌ Login Failed',
          description: `Invalid credentials. ${5 - newAttempts} attempts remaining.`
        })
      }
    }
    
    setIsLoading(false)
  }, [passwordInput, toast, loginAttempts, isLockedOut, lockoutEndTime, checkRateLimit, sanitizeInput, rememberMe, encryptData, sessionFingerprint, csrfToken, recordLoginAttempt, logError])
  
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
  
  // Phase 7: Script Management Functions
  
  // Toggle script favorite
  const toggleScriptFavorite = useCallback((toolId: string) => {
    setScriptFavorites(prev => {
      const isAdding = !prev.includes(toolId)
      const updated = isAdding
        ? [...prev, toolId]
        : prev.filter(id => id !== toolId)
      localStorage.setItem('toolkit_script_favorites', JSON.stringify(updated))
      toast({
        title: isAdding ? '⭐ Script Favorited' : '💔 Script Unfavorited',
        description: isAdding ? 'Added to your favorite scripts' : 'Removed from favorites'
      })
      return updated
    })
  }, [toast])
  
  // Add to script history
  const addToScriptHistory = useCallback((toolId: string, command: string, status: 'success' | 'error' | 'pending') => {
    setScriptHistory(prev => {
      const newEntry = { toolId, timestamp: Date.now(), command, status }
      const updated = [newEntry, ...prev].slice(0, 50)
      localStorage.setItem('toolkit_script_history', JSON.stringify(updated))
      return updated
    })
  }, [])
  
  // Add to script queue
  const addToScriptQueue = useCallback((toolId: string) => {
    const tool = TOOLS.find(t => t.id === toolId)
    if (!tool?.scriptCommand) {
      toast({
        variant: 'destructive',
        title: '❌ Invalid Tool',
        description: 'This tool does not have a script command'
      })
      return
    }
    setScriptQueue(prev => {
      if (prev.includes(toolId)) {
        toast({
          title: 'ℹ️ Already in Queue',
          description: `${tool.name} is already in the queue`
        })
        return prev
      }
      toast({
        title: '➕ Added to Queue',
        description: `${tool.name} added to script queue`
      })
      return [...prev, toolId]
    })
  }, [toast])
  
  // Remove from script queue
  const removeFromScriptQueue = useCallback((toolId: string) => {
    setScriptQueue(prev => prev.filter(id => id !== toolId))
  }, [])
  
  // Clear script queue
  const clearScriptQueue = useCallback(() => {
    setScriptQueue([])
    toast({
      title: '🗑️ Queue Cleared',
      description: 'All scripts removed from queue'
    })
  }, [toast])
  
  // Run all scripts in queue (simulated - copies all commands)
  const runAllScriptsInQueue = useCallback(async () => {
    if (scriptQueue.length === 0) {
      toast({
        variant: 'destructive',
        title: '❌ Empty Queue',
        description: 'Add scripts to the queue first'
      })
      return
    }
    
    setIsRunningBatchScripts(true)
    
    const scriptTools = scriptQueue
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is Tool => !!t && !!t.scriptCommand)
    
    const allCommands = scriptTools.map(t => t.scriptCommand).join('\n\n')
    
    // Copy all commands to clipboard
    await copyToClipboard(allCommands, 'batch-all-scripts')
    
    // Add to script history
    scriptTools.forEach(tool => {
      if (tool.scriptCommand) {
        addToScriptHistory(tool.id, tool.scriptCommand, 'success')
      }
    })
    
    setIsRunningBatchScripts(false)
    
    toast({
      title: '📋 All Commands Copied!',
      description: `${scriptTools.length} script commands copied. Run each in PowerShell (Admin)`
    })
  }, [scriptQueue, copyToClipboard, addToScriptHistory, toast])
  
  // Phase 8: Enhanced Backup/Restore Functions
  
  // Enhanced export data with options
  const exportDataWithOptions = useCallback(() => {
    const data: Record<string, unknown> = {
      exportedAt: new Date().toISOString(),
      version: '2.0'
    }
    
    if (backupSettings.includeFavorites) {
      data.favorites = favorites
    }
    if (backupSettings.includeCollections) {
      data.collections = collections
    }
    if (backupSettings.includeHistory) {
      data.history = history
    }
    if (backupSettings.includeScriptFavorites) {
      data.scriptFavorites = scriptFavorites
    }
    if (backupSettings.includeScriptHistory) {
      data.scriptHistory = scriptHistory
    }
    if (backupSettings.includeSettings) {
      data.settings = {
        isDarkMode,
        viewMode,
        sortBy,
        riskFilter,
        quickFilter
      }
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
      title: '📤 Backup Created',
      description: 'Your data has been exported successfully'
    })
  }, [backupSettings, favorites, collections, history, scriptFavorites, scriptHistory, isDarkMode, viewMode, sortBy, riskFilter, quickFilter, toast])
  
  // Enhanced import data with options
  const importDataWithOptions = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.favorites && backupSettings.includeFavorites) {
          setFavorites(data.favorites)
          localStorage.setItem('toolkit_favorites', JSON.stringify(data.favorites))
        }
        if (data.collections && backupSettings.includeCollections) {
          setCollections(data.collections)
          localStorage.setItem('toolkit_collections', JSON.stringify(data.collections))
        }
        if (data.history && backupSettings.includeHistory) {
          setHistory(data.history)
          localStorage.setItem('toolkit_history', JSON.stringify(data.history))
        }
        if (data.scriptFavorites && backupSettings.includeScriptFavorites) {
          setScriptFavorites(data.scriptFavorites)
          localStorage.setItem('toolkit_script_favorites', JSON.stringify(data.scriptFavorites))
        }
        if (data.scriptHistory && backupSettings.includeScriptHistory) {
          setScriptHistory(data.scriptHistory)
          localStorage.setItem('toolkit_script_history', JSON.stringify(data.scriptHistory))
        }
        if (data.settings && backupSettings.includeSettings) {
          if (data.settings.isDarkMode !== undefined) {
            setIsDarkMode(data.settings.isDarkMode)
            localStorage.setItem('toolkit_theme', data.settings.isDarkMode ? 'dark' : 'light')
          }
          if (data.settings.viewMode) setViewMode(data.settings.viewMode)
          if (data.settings.sortBy) setSortBy(data.settings.sortBy)
          if (data.settings.riskFilter) setRiskFilter(data.settings.riskFilter)
          if (data.settings.quickFilter) setQuickFilter(data.settings.quickFilter)
        }
        
        toast({
          title: '📥 Backup Restored',
          description: 'Your data has been imported successfully'
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
  }, [backupSettings, toast])
  
  // Phase 9: Sub-Categories & Related Tools
  
  // Sub-categories mapping
  const subCategoriesMap: Record<string, string[]> = useMemo(() => ({
    'System Optimization': ['Debloat', 'Performance', 'Privacy', 'Tweaks'],
    'Security': ['Antivirus', 'Encryption', 'Firewall', 'Password Manager'],
    'Utilities': ['File Management', 'System Tools', 'Archive', 'Search'],
    'Diagnostics': ['Hardware', 'System Info', 'Network', 'Disk'],
    'Drivers': ['GPU', 'Audio', 'Network', 'Universal'],
    'Cleanup': ['Temp Files', 'Registry', 'Browser', 'System'],
    'Backup': ['Full Backup', 'Incremental', 'Cloud', 'Local'],
    'Media': ['Audio', 'Video', 'Image', 'Streaming'],
  }), [])
  
  // Get related tools based on tags
  const getRelatedTools = useCallback((tool: Tool) => {
    return TOOLS.filter(t => 
      t.id !== tool.id && 
      t.tags.some(tag => tool.tags.includes(tag))
    ).slice(0, 4)
  }, [])
  
  // Execute script - calls the API for real execution
  const executeScript = useCallback(async (tool: Tool) => {
    updateActivity()
    if (!tool.scriptCommand) return
    
    trackToolView(tool.id)
    setSelectedScriptTool(tool)
    setShowScriptModal(true)
    
    // Set initial loading state
    setExecutingScript(tool.id)
    setScriptProgress(0)
    
    try {
      // Call the execute API
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          command: tool.scriptCommand,
          toolId: tool.id,
          toolName: tool.name,
          platform: tool.platform,
          autoUninstall: true
        })
      })
      
      const data = await response.json()
      
      // Update progress to 100%
      setScriptProgress(100)
      setExecutingScript(null)
      
      if (data.success) {
        // Store the instructions in the selected tool for display
        setSelectedScriptTool({
          ...tool,
          scriptInstructions: data.output?.split('\n') || []
        })
        
        toast({
          title: '📋 Instructions Ready!',
          description: 'Follow the steps below to complete the task'
        })
      } else {
        toast({
          variant: 'destructive',
          title: '❌ Execution Failed',
          description: data.message || 'Could not process the command'
        })
      }
    } catch (error) {
      setExecutingScript(null)
      setScriptProgress(0)
      toast({
        variant: 'destructive',
        title: '❌ Network Error',
        description: 'Could not connect to the execution service'
      })
    }
  }, [updateActivity, trackToolView, toast])
  
  // Phase 10: Run script with confirmation for risky scripts
  const runScriptWithConfirmation = useCallback((tool: Tool) => {
    if (tool.risk === 'advanced' || tool.risk === 'moderate') {
      setPendingRiskyAction({ tool, action: 'run' })
    } else {
      executeScript(tool)
    }
  }, [executeScript])
  
  // Confirm risky action
  const confirmRiskyAction = useCallback(() => {
    if (pendingRiskyAction) {
      if (pendingRiskyAction.action === 'run') {
        executeScript(pendingRiskyAction.tool)
      } else {
        // Call startAutoInstall directly - it's defined later but accessible
        // This is intentional to avoid circular dependency
        ;(async () => {
          const tool = pendingRiskyAction.tool
          if (!tool.scriptCommand) {
            toast({
              variant: 'destructive',
              title: '❌ No Script Available',
              description: 'This tool does not have an auto-install script'
            })
            return
          }
          
          updateActivity()
          trackToolView(tool.id)
          setShowAutoInstallModal(true)
          
          const steps = [
            { status: 'preparing' as const, message: 'Preparing installation environment...', duration: 800 },
            { status: 'downloading' as const, message: 'Downloading required files...', duration: 1500 },
            { status: 'installing' as const, message: 'Installing software...', duration: 2000 },
            { status: 'configuring' as const, message: 'Configuring settings...', duration: 1000 },
            { status: 'completed' as const, message: 'Installation complete!', duration: 500 }
          ]
          
          let currentProgress = 0
          
          for (const step of steps) {
            setInstallProgress({
              toolId: tool.id,
              status: step.status,
              progress: currentProgress,
              message: step.message
            })
            
            await new Promise(resolve => setTimeout(resolve, step.duration))
            currentProgress += 20
          }
          
          await copyToClipboard(tool.scriptCommand, `auto-install-${tool.id}`)
          
          setInstallProgress({
            toolId: tool.id,
            status: 'completed',
            progress: 100,
            message: 'Command copied! Open PowerShell as Administrator and paste to execute.'
          })
          
          setHistory(prev => {
            const newEntry = { toolId: tool.id, timestamp: Date.now(), action: 'run' as const }
            const updated = [newEntry, ...prev].slice(0, 100)
            localStorage.setItem('toolkit_history', JSON.stringify(updated))
            return updated
          })
          
          toast({
            title: '🚀 Auto-Install Ready!',
            description: `${tool.name} - Command copied to clipboard. Run in PowerShell (Admin)`
          })
        })()
      }
      setPendingRiskyAction(null)
    }
  }, [pendingRiskyAction, executeScript, toast, updateActivity, trackToolView, copyToClipboard])
  
  // Cancel risky action
  const cancelRiskyAction = useCallback(() => {
    setPendingRiskyAction(null)
  }, [])
  
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
  
  // Phase 5: Show confirmation dialog for destructive actions
  const showConfirmation = useCallback((
    title: string,
    description: string,
    onConfirm: () => void,
    variant: 'danger' | 'warning' = 'danger'
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      description,
      onConfirm,
      variant
    })
  }, [])
  
  const closeConfirmation = useCallback(() => {
    setConfirmDialog(null)
  }, [])
  
  // Clear favorites with confirmation
  const clearFavoritesWithConfirm = useCallback(() => {
    showConfirmation(
      'Clear All Favorites?',
      `This will remove all ${favorites.length} favorites. This action cannot be undone.`,
      () => {
        setFavorites([])
        localStorage.removeItem('toolkit_favorites')
        toast({
          title: '💔 Favorites Cleared',
          description: 'All favorites have been removed'
        })
      },
      'warning'
    )
  }, [favorites.length, showConfirmation, toast])
  
  // Delete collection with confirmation
  const deleteCollectionWithConfirm = useCallback((collectionId: string, collectionName: string) => {
    showConfirmation(
      'Delete Collection?',
      `This will permanently delete "${collectionName}". This action cannot be undone.`,
      () => {
        deleteCollection(collectionId)
      },
      'danger'
    )
  }, [showConfirmation, deleteCollection])
  
  // Clear history with confirmation
  const clearHistoryWithConfirm = useCallback(() => {
    showConfirmation(
      'Clear All History?',
      `This will remove all ${history.length} history entries. This action cannot be undone.`,
      () => {
        clearHistory()
      },
      'warning'
    )
  }, [history.length, showConfirmation, clearHistory])
  
  // Batch run scripts
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
  
  // One-Click Auto-Install function
  const startAutoInstall = useCallback(async (tool: Tool) => {
    if (!tool.scriptCommand) {
      toast({
        variant: 'destructive',
        title: '❌ No Script Available',
        description: 'This tool does not have an auto-install script'
      })
      return
    }
    
    updateActivity()
    trackToolView(tool.id)
    setShowAutoInstallModal(true)
    
    const steps = [
      { status: 'preparing' as const, message: 'Preparing installation environment...', duration: 800 },
      { status: 'downloading' as const, message: 'Downloading required files...', duration: 1500 },
      { status: 'installing' as const, message: 'Installing software...', duration: 2000 },
      { status: 'configuring' as const, message: 'Configuring settings...', duration: 1000 },
      { status: 'completed' as const, message: 'Installation complete!', duration: 500 }
    ]
    
    let currentProgress = 0
    
    for (const step of steps) {
      setInstallProgress({
        toolId: tool.id,
        status: step.status,
        progress: currentProgress,
        message: step.message
      })
      
      await new Promise(resolve => setTimeout(resolve, step.duration))
      currentProgress += 20
    }
    
    // Copy command to clipboard
    await copyToClipboard(tool.scriptCommand, `auto-install-${tool.id}`)
    
    setInstallProgress({
      toolId: tool.id,
      status: 'completed',
      progress: 100,
      message: 'Command copied! Open PowerShell as Administrator and paste to execute.'
    })
    
    // Add to history
    setHistory(prev => {
      const newEntry = { toolId: tool.id, timestamp: Date.now(), action: 'run' as const }
      const updated = [newEntry, ...prev].slice(0, 100)
      localStorage.setItem('toolkit_history', JSON.stringify(updated))
      return updated
    })
    
    toast({
      title: '🚀 Auto-Install Ready!',
      description: `${tool.name} - Command copied to clipboard. Run in PowerShell (Admin)`
    })
  }, [updateActivity, trackToolView, copyToClipboard, toast])
  
  // Quick Action: Install Essential Tools
  const quickInstallEssentials = useCallback(() => {
    const essentialTools = TOOLS.filter(t => 
      t.platform === 'windows' && 
      t.isScript && 
      ['System Optimization', 'Package Manager', 'Privacy'].includes(t.category)
    ).slice(0, 5)
    
    setInstallQueue(essentialTools.map(t => t.id))
    setShowAutoInstallModal(true)
    
    toast({
      title: '🚀 Quick Install Started',
      description: `${essentialTools.length} essential tools selected for installation`
    })
  }, [toast])
  
  // Filter and sort tools (using debounced search for performance - Phase 4)
  const filteredTools = useMemo(() => {
    const filtered = TOOLS.filter(tool => {
      const matchesPlatform = tool.platform === activeTab
      // Use debounced search query for better performance
      const matchesSearch = debouncedSearchQuery === '' || 
        tool.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
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
  }, [activeTab, debouncedSearchQuery, selectedCategory, quickFilter, riskFilter, favorites, sortBy, recentlyViewed])
  
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value)
                  setLoginError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                className={`h-12 pr-12 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
                } ${loginError ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {loginError && (
              <p className="text-sm text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {loginError}
              </p>
            )}
            
            {/* Remember Me Checkbox - Phase 4 */}
            <label className={`flex items-center gap-2 cursor-pointer ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">Remember me (encrypt session)</span>
            </label>
            
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
              <p>🔒 Secure access - Contact admin for password</p>
            </div>
            
            <Separator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
            
            <div className={`text-center text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>🔒 Protected by password authentication</p>
            </div>
            
            <Separator className={isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} />
            
            <a 
              href="https://www.facebook.com/nextgendigitalstudio" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`text-xs flex items-center justify-center gap-1 hover:text-blue-400 transition-colors ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              <span>© 2025 Copyright & Developed by</span>
              <span className="font-semibold text-blue-400 hover:underline">NextGen Digital Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-lg">System Toolkit</h1>
                    {/* Offline Indicator - Phase 4 */}
                    {isOffline && (
                      <Badge variant="outline" className="text-orange-400 border-orange-400/50 text-xs">
                        <Wifi className="w-3 h-3 mr-1 opacity-50" />
                        Offline
                      </Badge>
                    )}
                  </div>
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
                    } ${searchQuery ? 'pr-10' : ''}`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDarkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                      } transition-colors`}
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
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
                      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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
                      onClick={favorites.length > 0 ? clearFavoritesWithConfirm : () => setQuickFilter('favorites')}
                      className={isDarkMode ? 'text-red-400' : 'text-red-500'}
                      aria-label={`${favorites.length} Favorites`}
                    >
                      <Heart className="w-5 h-5" />
                      {favorites.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          {favorites.length}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{favorites.length} Favorites{favorites.length > 0 ? ' (Click to clear)' : ''}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowCollectionsModal(true)}
                      className={isDarkMode ? 'text-purple-400' : 'text-purple-500'}
                      aria-label={`${collections.length} Collections`}
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
                      aria-label="View usage statistics"
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
                      aria-label={`View history (${history.length} items)`}
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
                      aria-label="Logout"
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
        
        {/* Session Timeout Warning Banner */}
        {showSessionWarning && (
          <div className={`sticky top-16 z-40 mx-4 mt-2 p-3 rounded-lg border animate-pulse ${
            isDarkMode 
              ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-200' 
              : 'bg-yellow-50 border-yellow-300 text-yellow-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">
                  Your session will expire soon due to inactivity
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={isDarkMode ? 'border-yellow-500/50 text-yellow-200 hover:bg-yellow-600/20' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-100'}
                  onClick={extendSession}
                >
                  Extend Session
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className={isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}
                  onClick={() => setShowSessionWarning(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        )}
        
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
            
            {/* Quick Actions - One Click Solutions */}
            {activeTab === 'windows' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30' 
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                    <Zap className="w-4 h-4" />
                    Quick Actions - One Click Solutions
                  </h3>
                  {/* Script Queue Indicator */}
                  {scriptQueue.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-600 text-white">
                        {scriptQueue.length} in Queue
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs bg-green-600/20 border-green-500/50 text-green-300 hover:bg-green-600/30"
                        onClick={runAllScriptsInQueue}
                        disabled={isRunningBatchScripts}
                      >
                        {isRunningBatchScripts ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3 mr-1" />
                        )}
                        Run All
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-red-400 hover:text-red-300"
                        onClick={clearScriptQueue}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w1')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Cpu className="w-4 h-4 mr-2" />
                    Debloat Windows
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-purple-500/50 text-purple-300 hover:bg-purple-600/20' : 'border-purple-300 text-purple-600 hover:bg-purple-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w6')
                      if (tool) {
                        // Advanced risk - show confirmation
                        setPendingRiskyAction({ tool, action: 'install' })
                      }
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Activate Windows
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-blue-500/50 text-blue-300 hover:bg-blue-600/20' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w7')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Install Chocolatey
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/20' : 'border-cyan-300 text-cyan-600 hover:bg-cyan-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w3')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-red-500/50 text-red-300 hover:bg-red-600/20' : 'border-red-300 text-red-600 hover:bg-red-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w23')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    SFC Scan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-amber-500/50 text-amber-300 hover:bg-amber-600/20' : 'border-amber-300 text-amber-600 hover:bg-amber-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w25')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    DISM Repair
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-teal-500/50 text-teal-300 hover:bg-teal-600/20' : 'border-teal-300 text-teal-600 hover:bg-teal-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w28')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    RaphiRe Debloat
                  </Button>
                  {/* New Quick Actions - Phase 3 */}
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-pink-500/50 text-pink-300 hover:bg-pink-600/20' : 'border-pink-300 text-pink-600 hover:bg-pink-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w31')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Reset Network
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w30')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Win Update
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/20' : 'border-yellow-300 text-yellow-600 hover:bg-yellow-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w37')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clean Temp
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-green-500/50 text-green-300 hover:bg-green-600/20' : 'border-green-300 text-green-600 hover:bg-green-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'w38')
                      if (tool) executeScript(tool)
                    }}
                  >
                    <Battery className="w-4 h-4 mr-2" />
                    High Performance
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-orange-500/50 text-orange-300 hover:bg-orange-600/20' : 'border-orange-300 text-orange-600 hover:bg-orange-100'}
                    onClick={() => setShowScriptQueueModal(true)}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Script Queue
                    {scriptQueue.length > 0 && (
                      <Badge className="ml-2 h-4 px-1 text-xs bg-orange-600">{scriptQueue.length}</Badge>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-violet-500/50 text-violet-300 hover:bg-violet-600/20' : 'border-violet-300 text-violet-600 hover:bg-violet-100'}
                    onClick={() => setShowBackupModal(true)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Actions - macOS */}
            {activeTab === 'macos' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/30' 
                  : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <Laptop className="w-4 h-4" />
                    Quick Actions - macOS
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'm2')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Install Homebrew
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-gray-500/50 text-gray-300 hover:bg-gray-600/20' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'm1')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    AppCleaner
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-purple-500/50 text-purple-300 hover:bg-purple-600/20' : 'border-purple-300 text-purple-600 hover:bg-purple-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'm14')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Rectangle
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Actions - Linux */}
            {activeTab === 'linux' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-orange-500/30' 
                  : 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-orange-300' : 'text-orange-700'
                  }`}>
                    <Terminal className="w-4 h-4" />
                    Quick Actions - Linux
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'l2')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Stacer Optimizer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-orange-500/50 text-orange-300 hover:bg-orange-600/20' : 'border-orange-300 text-orange-600 hover:bg-orange-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'l4')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Timeshift Backup
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-green-500/50 text-green-300 hover:bg-green-600/20' : 'border-green-300 text-green-600 hover:bg-green-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'l6')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Monitor className="w-4 h-4 mr-2" />
                    htop Monitor
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Actions - Android */}
            {activeTab === 'android' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-green-900/20 to-emerald-900/20 border-green-500/30' 
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-green-300' : 'text-green-700'
                  }`}>
                    <Smartphone className="w-4 h-4" />
                    Quick Actions - Android
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'a1')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    SD Maid SE
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-green-500/50 text-green-300 hover:bg-green-600/20' : 'border-green-300 text-green-600 hover:bg-green-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'a4')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Terminal className="w-4 h-4 mr-2" />
                    Termux
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-purple-500/50 text-purple-300 hover:bg-purple-600/20' : 'border-purple-300 text-purple-600 hover:bg-purple-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'a8')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Magisk
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Actions - iOS */}
            {activeTab === 'ios' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30' 
                  : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-purple-300' : 'text-purple-700'
                  }`}>
                    <Tablet className="w-4 h-4" />
                    Quick Actions - iOS
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'i1')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    AltStore
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-purple-500/50 text-purple-300 hover:bg-purple-600/20' : 'border-purple-300 text-purple-600 hover:bg-purple-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'i3')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    TrollStore
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-pink-500/50 text-pink-300 hover:bg-pink-600/20' : 'border-pink-300 text-pink-600 hover:bg-pink-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'i7')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    iMazing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/20' : 'border-cyan-300 text-cyan-600 hover:bg-cyan-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'i6')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Dopamine JB
                  </Button>
                </div>
              </div>
            )}
            
            {/* Quick Actions - Cross Platform */}
            {activeTab === 'cross-platform' && (
              <div className={`mb-4 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-900/20 to-blue-900/20 border-indigo-500/30' 
                  : 'bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-sm font-semibold flex items-center gap-2 ${
                    isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                  }`}>
                    <Globe className="w-4 h-4" />
                    Quick Actions - Cross Platform
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'c1')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <HardDrive className="w-4 h-4 mr-2" />
                    Ventoy USB
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-indigo-500/50 text-indigo-300 hover:bg-indigo-600/20' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'c3')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    RustDesk
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-blue-500/50 text-blue-300 hover:bg-blue-600/20' : 'border-blue-300 text-blue-600 hover:bg-blue-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'c8')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Bitwarden
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-green-500/50 text-green-300 hover:bg-green-600/20' : 'border-green-300 text-green-600 hover:bg-green-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'c2')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    BalenaEtcher
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={isDarkMode ? 'border-purple-500/50 text-purple-300 hover:bg-purple-600/20' : 'border-purple-300 text-purple-600 hover:bg-purple-100'}
                    onClick={() => {
                      const tool = TOOLS.find(t => t.id === 'c9')
                      if (tool) {
                        trackToolView(tool.id)
                        safeOpenUrl(tool.url)
                      }
                    }}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    ProtonVPN
                  </Button>
                </div>
              </div>
            )}
            
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
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'flex flex-col gap-2'
              }
            >
              {filteredTools.map((tool, index) => (
                <motion.div
                  key={tool.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  whileHover={viewMode === 'grid' ? { scale: 1.02, y: -4 } : {}}
                  whileTap={viewMode === 'grid' ? { scale: 0.98 } : {}}
                >
                  <Card
                    role="article"
                    aria-label={tool.name}
                    className={`relative overflow-hidden transition-all duration-300 ease-out ${
                      viewMode === 'list' 
                        ? 'flex flex-row items-center gap-4 p-4 hover:shadow-lg border-l-4 ' + 
                          (tool.isFeatured 
                            ? 'border-l-blue-500' 
                            : tool.isScript 
                              ? 'border-l-green-500' 
                              : isDarkMode ? 'border-l-gray-600' : 'border-l-gray-300'
                          )
                        : 'shadow-md hover:shadow-2xl'
                    } ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-800/80 to-gray-800/40 border-gray-700/50 hover:border-blue-500/50 backdrop-blur-sm' 
                        : 'bg-gradient-to-br from-white to-gray-50/80 border-gray-200 hover:border-blue-400 shadow-sm'
                    } ${tool.isFeatured && viewMode === 'grid' ? 'ring-2 ring-blue-500/50' : ''}`}
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
                  
                  <CardHeader className={viewMode === 'list' ? 'p-0 flex-shrink-0 w-48' : 'pb-2'}>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className={`font-bold ${viewMode === 'list' ? 'text-sm' : 'text-base'}`}>
                        {viewMode === 'list' ? (
                          <div className="flex items-center gap-2">
                            {tool.name}
                            {tool.isFeatured && (
                              <Sparkles className="w-3 h-3 text-blue-400" />
                            )}
                            {tool.isNew && (
                              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-[10px] px-1">New</Badge>
                            )}
                          </div>
                        ) : (
                          tool.name
                        )}
                      </CardTitle>
                    </div>
                    {viewMode !== 'list' && (
                      <CardDescription className="text-sm line-clamp-2">
                        {tool.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className={viewMode === 'list' ? 'p-0 flex-1 flex items-center gap-4' : 'space-y-3'}>
                    {viewMode === 'list' ? (
                      <>
                        {/* List View: Compact inline layout */}
                        <div className="flex-1 flex items-center gap-4">
                          {/* Category & Description */}
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {tool.category} • {tool.description.substring(0, 60)}...
                            </p>
                          </div>
                          
                          {/* Tags */}
                          <div className="hidden md:flex flex-wrap gap-1 max-w-32">
                            {tool.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Rating & Risk */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                              <span className="text-xs">{tool.rating}</span>
                            </div>
                            <Badge className={getRiskColor(tool.risk) + ' text-xs'}>
                              {tool.risk}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Actions for list view */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              trackToolView(tool.id)
                              safeOpenUrl(tool.url)
                            }}
                            className="h-7"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                          {tool.isScript && (
                            <>
                              <Button
                                size="sm"
                                className="h-7 bg-green-600 hover:bg-green-700"
                                onClick={() => executeScript(tool)}
                              >
                                <Play className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 bg-purple-600/20 border-purple-500/50"
                                onClick={() => startAutoInstall(tool)}
                              >
                                <Zap className="w-3 h-3 text-purple-400" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toggleFavorite(tool.id)}
                          >
                            <Heart className={`w-3 h-3 ${favorites.includes(tool.id) ? 'fill-red-500 text-red-500' : ''}`} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Bookmark className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                              <DropdownMenuLabel className="text-xs">Add to Collection</DropdownMenuLabel>
                              <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                              {collections.length === 0 ? (
                                <DropdownMenuItem disabled className="text-xs">No collections</DropdownMenuItem>
                              ) : (
                                collections.map(collection => (
                                  <DropdownMenuItem
                                    key={collection.id}
                                    onClick={() => addToCollection(collection.id, tool.id)}
                                    className={isDarkMode ? 'text-gray-300 focus:bg-gray-700' : ''}
                                  >
                                    <span className="text-xs">{collection.name}</span>
                                  </DropdownMenuItem>
                                ))
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Grid View: Original layout */}
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
                        <>
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                            size="sm"
                            onClick={() => executeScript(tool)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Run Script
                          </Button>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/50 hover:bg-purple-600/30"
                                onClick={() => startAutoInstall(tool)}
                              >
                                <Zap className="w-4 h-4 text-purple-400" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>One-Click Auto Install</TooltipContent>
                          </Tooltip>
                        </>
                      )}
                      <Button
                        className={tool.isScript ? '' : 'flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                        variant={tool.isScript ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => {
                          trackToolView(tool.id)
                          safeOpenUrl(tool.url)
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
                      
                      {/* Add to Collection Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon" className="h-8 w-8">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className={isDarkMode ? 'bg-gray-800 border-gray-700' : ''}>
                          <DropdownMenuLabel>Add to Collection</DropdownMenuLabel>
                          <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                          {collections.length === 0 ? (
                            <DropdownMenuItem disabled className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
                              No collections yet
                            </DropdownMenuItem>
                          ) : (
                            collections.map(collection => (
                              <DropdownMenuItem
                                key={collection.id}
                                onClick={() => addToCollection(collection.id, tool.id)}
                                className={isDarkMode ? 'text-gray-300 focus:bg-gray-700' : ''}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full bg-${collection.color}-500`} />
                                  {collection.name}
                                  {collection.toolIds.includes(tool.id) && (
                                    <Check className="w-3 h-3 ml-auto text-green-400" />
                                  )}
                                </div>
                              </DropdownMenuItem>
                            ))
                          )}
                          <DropdownMenuSeparator className={isDarkMode ? 'bg-gray-700' : ''} />
                          <DropdownMenuItem
                            onClick={() => {
                              setNewCollectionName('')
                              setShowCollectionsModal(true)
                            }}
                            className={isDarkMode ? 'text-purple-400 focus:bg-gray-700' : 'text-purple-600'}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Collection
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                </motion.div>
              ))}
            </motion.div>
            
            {/* No results */}
            <AnimatePresence>
              {filteredTools.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12"
                >
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Search className={`w-8 h-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-lg font-medium mb-1">No tools found</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Try adjusting your search or filters
                </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </main>
        
        {/* Footer - Sticky to bottom */}
        <footer className={`mt-auto py-4 border-t ${
          isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-sm font-medium">System Toolkit Dashboard</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  {TOOLS.length} tools • 6 platforms
                </span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Session: {sessionTime} min
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-700/30">
              <a 
                href="https://www.facebook.com/nextgendigitalstudio" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`text-xs flex items-center gap-1 hover:text-blue-400 transition-colors ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <span>© 2025 Copyright & Developed by</span>
                <span className="font-semibold text-blue-400 hover:underline">NextGen Digital Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </footer>
        
        {/* Script Execution Dialog */}
        <Dialog open={showScriptModal} onOpenChange={setShowScriptModal}>
          <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode 
              ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' 
              : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'
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
                      safeOpenUrl(selectedScriptTool.url)
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
          <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
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
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
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
                              onClick={() => deleteCollectionWithConfirm(collection.id, collection.name)}
                              aria-label={`Delete ${collection.name} collection`}
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
          <DialogContent className={`max-w-2xl ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
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
          <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
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
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
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
                  <Button variant="outline" onClick={clearHistoryWithConfirm} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Auto-Install Modal */}
        <Dialog open={showAutoInstallModal} onOpenChange={setShowAutoInstallModal}>
          <DialogContent className={`max-w-lg ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                One-Click Auto Install
              </DialogTitle>
              <DialogDescription>
                {installProgress?.status === 'completed' 
                  ? 'Installation command ready!' 
                  : 'Preparing your installation...'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {installProgress && (
                <>
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {installProgress.message}
                      </span>
                      <span className="font-mono">{installProgress.progress}%</span>
                    </div>
                    <Progress 
                      value={installProgress.progress} 
                      className={`h-2 ${
                        installProgress.status === 'completed' 
                          ? 'bg-green-600' 
                          : installProgress.status === 'error'
                            ? 'bg-red-600'
                            : ''
                      }`}
                    />
                  </div>
                  
                  {/* Status Steps */}
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="space-y-2">
                      {['preparing', 'downloading', 'installing', 'configuring', 'completed'].map((step, index) => {
                        const stepNames = ['Preparing', 'Downloading', 'Installing', 'Configuring', 'Completed']
                        const isActive = installProgress.status === step
                        const isPast = ['preparing', 'downloading', 'installing', 'configuring', 'completed']
                          .indexOf(installProgress.status) > index
                        
                        return (
                          <div key={step} className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              isActive ? 'bg-purple-500 text-white' :
                              isPast ? 'bg-green-500 text-white' :
                              isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                            }`}>
                              {isPast ? <Check className="w-3 h-3" /> : index + 1}
                            </div>
                            <span className={`text-sm ${
                              isActive ? 'font-medium text-purple-400' :
                              isPast ? 'text-green-400' :
                              isDarkMode ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              {stepNames[index]}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  {/* Tool Info */}
                  {installProgress.toolId && (
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className="text-sm font-medium">
                        {TOOLS.find(t => t.id === installProgress.toolId)?.name}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {TOOLS.find(t => t.id === installProgress.toolId)?.description.substring(0, 80)}...
                      </p>
                    </div>
                  )}
                  
                  {/* Action Button */}
                  {installProgress.status === 'completed' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          onClick={() => {
                            setShowAutoInstallModal(false)
                            setInstallProgress(null)
                          }}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Done
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const tool = TOOLS.find(t => t.id === installProgress.toolId)
                            if (tool) {
                              trackToolView(tool.id)
                              safeOpenUrl(tool.url)
                            }
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Website
                        </Button>
                      </div>
                      
                      {/* Auto-Uninstall Simulation */}
                      <div className={`p-3 rounded-lg border ${
                        isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <RotateCcw className={`w-4 h-4 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                              Auto-Uninstall after task
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className={isDarkMode ? 'border-yellow-500/50 text-yellow-300 hover:bg-yellow-600/20' : 'border-yellow-300 text-yellow-600 hover:bg-yellow-100'}
                            onClick={async () => {
                              const tool = TOOLS.find(t => t.id === installProgress.toolId)
                              if (!tool) return
                              
                              // Simulate uninstall
                              setInstallProgress({
                                toolId: tool.id,
                                status: 'preparing',
                                progress: 0,
                                message: 'Preparing uninstall...'
                              })
                              
                              const uninstallSteps = [
                                { progress: 25, message: 'Stopping processes...' },
                                { progress: 50, message: 'Removing files...' },
                                { progress: 75, message: 'Cleaning registry...' },
                                { progress: 100, message: 'Uninstall complete!' }
                              ]
                              
                              for (const step of uninstallSteps) {
                                await new Promise(resolve => setTimeout(resolve, 800))
                                setInstallProgress(prev => prev ? {
                                  ...prev,
                                  progress: step.progress,
                                  message: step.message
                                } : null)
                              }
                              
                              toast({
                                title: '🗑️ Auto-Uninstall Complete',
                                description: `${tool.name} has been removed from your system`
                              })
                              
                              setTimeout(() => {
                                setShowAutoInstallModal(false)
                                setInstallProgress(null)
                              }, 1500)
                            }}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Uninstall
                          </Button>
                        </div>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-yellow-400/70' : 'text-yellow-600'}`}>
                          ⚡ Simulates automatic cleanup after task completion
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Script Queue Modal - Phase 7 */}
        <Dialog open={showScriptQueueModal} onOpenChange={setShowScriptQueueModal}>
          <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-orange-400" />
                Script Queue
              </DialogTitle>
              <DialogDescription>
                Manage your script execution queue
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {scriptQueue.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Terminal className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No scripts in queue</p>
                  <p className="text-sm">Add scripts from tools to run them in batch</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {scriptQueue.map(toolId => {
                      const tool = TOOLS.find(t => t.id === toolId)
                      if (!tool) return null
                      return (
                        <div key={toolId} className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-green-400" />
                            <div>
                              <p className="text-sm font-medium">{tool.name}</p>
                              <p className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {tool.scriptCommand?.substring(0, 40)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => removeFromScriptQueue(toolId)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-700/30">
                    <Button variant="outline" onClick={clearScriptQueue} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                    <Button onClick={runAllScriptsInQueue} disabled={isRunningBatchScripts} className="bg-green-600 hover:bg-green-700">
                      {isRunningBatchScripts ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      Run All Scripts
                    </Button>
                  </div>
                </>
              )}
              
              {/* Script Favorites */}
              {scriptFavorites.length > 0 && (
                <div className="pt-4 border-t border-gray-700/30">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    Favorite Scripts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {scriptFavorites.map(toolId => {
                      const tool = TOOLS.find(t => t.id === toolId)
                      if (!tool) return null
                      return (
                        <Badge key={toolId} variant="outline" className="cursor-pointer hover:bg-purple-600/20" onClick={() => addToScriptQueue(toolId)}>
                          {tool.name}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
              
              {/* Script History */}
              {scriptHistory.length > 0 && (
                <div className="pt-4 border-t border-gray-700/30">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    Recent Scripts
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {scriptHistory.slice(0, 5).map((entry, index) => {
                      const tool = TOOLS.find(t => t.id === entry.toolId)
                      if (!tool) return null
                      return (
                        <div key={index} className={`flex items-center justify-between p-2 rounded ${isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'}`}>
                          <span className="text-xs">{tool.name}</span>
                          <Badge variant="outline" className={`text-xs ${entry.status === 'success' ? 'text-green-400' : entry.status === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                            {entry.status}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Backup/Restore Modal - Phase 8 */}
        <Dialog open={showBackupModal} onOpenChange={setShowBackupModal}>
          <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-violet-400" />
                Backup & Restore
              </DialogTitle>
              <DialogDescription>
                Export or import your toolkit data
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Backup Options */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Include in Backup:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'includeFavorites', label: 'Favorites' },
                    { key: 'includeCollections', label: 'Collections' },
                    { key: 'includeHistory', label: 'History' },
                    { key: 'includeScriptFavorites', label: 'Script Favorites' },
                    { key: 'includeScriptHistory', label: 'Script History' },
                    { key: 'includeSettings', label: 'Settings' },
                  ].map(option => (
                    <label key={option.key} className={`flex items-center gap-2 p-2 rounded cursor-pointer ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={backupSettings[option.key as keyof typeof backupSettings]}
                        onChange={(e) => setBackupSettings(prev => ({ ...prev, [option.key]: e.target.checked }))}
                        className="rounded"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={exportDataWithOptions} className="flex-1 bg-violet-600 hover:bg-violet-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <label className="flex-1">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Import
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importDataWithOptions}
                    className="hidden"
                  />
                </label>
              </div>
              
              <p className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Backups are stored as JSON files and can be imported on any device
              </p>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Risky Script Confirmation Dialog - Phase 10 */}
        <AlertDialog open={!!pendingRiskyAction} onOpenChange={(open) => !open && cancelRiskyAction()}>
          <AlertDialogContent className={isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Risk Level: {pendingRiskyAction?.tool.risk}
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className="mb-2">
                  <strong>{pendingRiskyAction?.tool.name}</strong> has a <strong>{pendingRiskyAction?.tool.risk}</strong> risk level.
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {pendingRiskyAction?.tool.risk === 'advanced' 
                    ? 'This tool makes advanced system changes. Use with caution and create a restore point first.'
                    : 'This tool modifies system settings. Review changes before applying.'}
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : ''}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmRiskyAction}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Confirmation Dialog */}
        <AlertDialog open={confirmDialog?.isOpen} onOpenChange={(open) => !open && closeConfirmation()}>
          <AlertDialogContent className={isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                {confirmDialog?.variant === 'danger' ? (
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                )}
                {confirmDialog?.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialog?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : ''}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDialog?.onConfirm}
                className={confirmDialog?.variant === 'danger' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }
              >
                {confirmDialog?.variant === 'danger' ? 'Delete' : 'Confirm'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Error Modal with Retry - Phase 4 */}
        <AlertDialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <AlertDialogContent className={isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                Error Occurred
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {currentError}
                </p>
                {errorLog.length > 0 && (
                  <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {errorLog.length} error(s) logged this session
                  </p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : ''}>
                Dismiss
              </AlertDialogCancel>
              {retryAction && (
                <AlertDialogAction
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Session Timeout Warning with Countdown - Phase 4 */}
        <AlertDialog open={showSessionWarning} onOpenChange={setShowSessionWarning}>
          <AlertDialogContent className={isDarkMode ? 'bg-gray-900/95 border-gray-700/50 backdrop-blur-xl shadow-2xl' : 'bg-white/95 border-gray-200/50 backdrop-blur-xl shadow-2xl'}>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Session Timeout Warning
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  Your session will expire soon due to inactivity.
                </p>
                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-mono font-bold text-amber-400">
                      {Math.floor((SESSION_TIMEOUT_MS - (Date.now() - (session?.lastActivity || 0))) / 60000)}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      minutes remaining
                    </span>
                  </div>
                </div>
                <p className={`mt-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Click "Extend Session" to stay logged in for another 30 minutes.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={handleLogout}
                className={isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : ''}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={extendSession}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Extend Session
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}
