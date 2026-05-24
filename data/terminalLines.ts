import type { TerminalLine } from "@/types/portfolio"

export const TERMINAL_LINES: TerminalLine[] = [
  { out: "Initializing PortfolioOS Kernel [v1.0.4-stable]...", color: "#4a6b7a" },
  { out: "Loading system modules: VFS, Terminal-Subsystem, UI-Engine... [OK]", color: "#34d399" },
  { out: "Running system diagnostics...", color: "#4a6b7a" },
  { out: "Identity: Leonard Appelgryn (Software Engineer)", color: "#60a5fa" },
  { out: "Location: Douala, Cameroon", color: "#60a5fa" },
  { out: "Status: SYSTEM READY", color: "#34d399" },
  { out: "" },
  { ps: true, cmd: "whoami" },
  { out: "Mbi Enow Leonard Appelgryn — Software Engineer, Douala, CM ", flag: "cm" },
  { ps: true, cmd: "ls projects/" },
  { out: "GlobalBush/  SecureImage/  pSEO-Engine/" },
  { ps: true, cmd: "echo $HIRE_STATUS" },
  { out: "open_to_opportunities=true | EN/FR | remote_ok=true", color: "#34d399" },
  { ps: true, cmd: "neofetch" },
  { out: "OS: PortfolioOS v1.0.4\nKernel: bash-5.2\nUptime: 99.9%\nPackages: 1052 (npm)\nShell: zsh 5.9\nTerminal: xterm-256color\nCPU: Human Intelligence 2.0\nMemory: 16GB / 32GB", color: "#c084fc" },
  { out: "" },
]
