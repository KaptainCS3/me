import type { TerminalLine } from "@/types/portfolio"

export const TERMINAL_LINES: TerminalLine[] = [
  { ps: true, cmd: "whoami" },
  { out: "KaptainCS3 — Full-stack Web Developer, Yaoundé, CM 🇨🇲" },
  { ps: true, cmd: "ls projects/" },
  { out: "CHA/  CADI/  GlobalBush/  IELTSPrep/" },
  { ps: true, cmd: "cat stack.json" },
  { out: '{ "primary": ["React","TypeScript","Next.js","Vite"], "specialty": "Multilingual travel websites" }' },
  { ps: true, cmd: "echo $HIRE_STATUS" },
  { out: "open_to_freelance=true  | EN/FR | remote_ok=true" },
  { ps: true, cmd: "_" },
]
