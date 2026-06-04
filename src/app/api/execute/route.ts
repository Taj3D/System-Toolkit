import { NextRequest, NextResponse } from 'next/server'

interface ExecuteRequest {
  command: string
  toolId: string
  toolName: string
  platform: string
  autoUninstall?: boolean
  uninstallCommand?: string
}

interface ExecuteResponse {
  success: boolean
  message: string
  output?: string
  error?: string
  toolId?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ExecuteResponse>> {
  try {
    const body: ExecuteRequest = await request.json()
    const { command, toolId, toolName, platform, autoUninstall, uninstallCommand } = body

    // Validate required fields
    if (!command || !toolId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: command, toolId',
        error: 'VALIDATION_ERROR'
      }, { status: 400 })
    }

    // Security check - only allow specific commands
    const allowedCommands = [
      'irm',
      'iwr',
      'winget',
      'choco',
      'sfc',
      'chkdsk',
      'dism',
      'ipconfig',
      'netsh',
      'powercfg',
      'del',
      'net stop',
      'net start'
    ]

    const isCommandAllowed = allowedCommands.some(cmd => 
      command.toLowerCase().startsWith(cmd.toLowerCase())
    )

    // For Windows scripts (PowerShell), allow the command patterns
    const isPowerShellScript = command.includes('irm') || 
                                command.includes('iwr') || 
                                command.includes('| iex')

    if (!isCommandAllowed && !isPowerShellScript) {
      return NextResponse.json({
        success: false,
        message: 'Command not allowed for security reasons',
        error: 'SECURITY_ERROR',
        toolId
      }, { status: 403 })
    }

    // Log the execution attempt
    console.log(`[EXECUTE] Tool: ${toolName} (${toolId})`)
    console.log(`[EXECUTE] Platform: ${platform}`)
    console.log(`[EXECUTE] Command: ${command.substring(0, 100)}...`)

    // In a real implementation, this would execute the command
    // For security in this demo, we simulate the execution
    // and return instructions for the user to run manually

    const instructions = generateInstructions(command, platform, toolName, autoUninstall, uninstallCommand)

    return NextResponse.json({
      success: true,
      message: 'Command validated. Please run the following command manually.',
      output: instructions,
      toolId
    })

  } catch (error) {
    console.error('[EXECUTE] Error:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to process execution request',
      error: 'INTERNAL_ERROR'
    }, { status: 500 })
  }
}

function generateInstructions(
  command: string, 
  platform: string, 
  toolName: string,
  autoUninstall?: boolean,
  uninstallCommand?: string
): string {
  const platformInstructions: Record<string, string> = {
    windows: `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open PowerShell as Administrator
   - Right-click on Start menu
   - Select "Windows Terminal (Admin)" or "PowerShell (Admin)"

2️⃣ Copy and paste the following command:

   ${command}

3️⃣ Press Enter to execute

4️⃣ Wait for the operation to complete
   - Some operations may require a system restart

⚠️ IMPORTANT NOTES:
- Make sure to backup important data before running
- Some scripts may take several minutes to complete
- Follow any on-screen prompts

${autoUninstall && uninstallCommand ? `
🔄 AUTO-UNINSTALL AFTER TASK:
After the task completes, run this to uninstall:
   ${uninstallCommand}
` : ''}
    `,
    macos: `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open Terminal
   - Press Cmd + Space, type "Terminal", press Enter

2️⃣ Copy and paste the following command:

   ${command}

3️⃣ Press Enter to execute

4️⃣ You may need to enter your password

${autoUninstall && uninstallCommand ? `
🔄 AUTO-UNINSTALL AFTER TASK:
After the task completes, run this to uninstall:
   ${uninstallCommand}
` : ''}
    `,
    linux: `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open Terminal

2️⃣ Copy and paste the following command:

   ${command}

3️⃣ Press Enter to execute

4️⃣ You may need to enter your password (sudo)

${autoUninstall && uninstallCommand ? `
🔄 AUTO-UNINSTALL AFTER TASK:
After the task completes, run this to uninstall:
   ${uninstallCommand}
` : ''}
    `,
    android: `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open Termux or ADB Shell

2️⃣ Copy and paste the following command:

   ${command}

3️⃣ Grant necessary permissions when prompted

${autoUninstall ? `
🔄 AUTO-UNINSTALL AFTER TASK:
Some tools can be uninstalled after completing the task.
` : ''}
    `,
    ios: `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open the appropriate app (AltStore, Sideloadly, etc.)

2️⃣ Follow the in-app instructions

3️⃣ Complete the sideload/jailbreak process

${autoUninstall ? `
🔄 AUTO-UNINSTALL AFTER TASK:
Delete the app from your home screen when done.
` : ''}
    `,
    'cross-platform': `
📋 INSTRUCTIONS FOR ${toolName.toUpperCase()}:

1️⃣ Open your terminal/command prompt

2️⃣ Copy and paste the following command:

   ${command}

3️⃣ Follow any on-screen prompts

${autoUninstall && uninstallCommand ? `
🔄 AUTO-UNINSTALL AFTER TASK:
After the task completes, run this to uninstall:
   ${uninstallCommand}
` : ''}
    `
  }

  return platformInstructions[platform] || platformInstructions['cross-platform']
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    message: 'System Toolkit Execute API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/execute - Execute a validated command'
    }
  })
}
