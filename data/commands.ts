import type { TerminalLine } from "@/types/portfolio"
import { PROJECTS } from "./projects"
import { SKILLS } from "./skills"
import { RESUME } from "./about"

type CmdHandler = (args: string[]) => TerminalLine[] | Promise<TerminalLine[]>

interface Command {
  name: string
  desc: string
  usage: string
  handler: CmdHandler
  aliases?: string[]
}

function lines(...items: (string | { text: string; color?: string } | TerminalLine)[]): TerminalLine[] {
  return items.map((item) => {
    if (typeof item === "string") return { out: item }
    if ("text" in item) return { out: item.text, color: item.color }
    return item
  })
}

function col(text: string, color: string): { text: string; color: string } {
  return { text, color }
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)
  return lines
}

function showHelp(name: string, commands: Map<string, Command>): TerminalLine[] {
  const longest = Math.max(...[...commands.values()].map((c) => c.name.length))
  const result: TerminalLine[] = [
    { out: `Usage: ${name} [--help]` },
    { out: "" },
  ]
  for (const cmd of commands.values()) {
    const padded = cmd.name.padEnd(longest + 2)
    result.push({ out: `  ${padded}${cmd.desc}` })
  }
  return result
}



const COW = `\
   ╱  ────  ╲
  ╱  (  ◠  ◠  )  ╲
 │   ╲  ══╤══  ╱  │
  ╲   ───┴───   ╱
   ╲           ╱
     ╲       ╱
       ─────
      (_____)`

const ENV = {
  USER: "appelgryn",
  HOME: "/home/appelgryn",
  SHELL: "/bin/bash",
  PWD: "/home/appelgryn",
  HIRE_STATUS: "open_to_freelance=true  | EN/FR | remote_ok=true",
  EDITOR: "nvim",
  LANG: "en_US.UTF-8",
  TERM: "xterm-256color",
}

const VIRTUAL_FS: Record<string, { type: "file" | "dir"; content?: string; children?: string[] }> = {
  "/home/appelgryn": { type: "dir", children: ["about.md", "projects.json", "skills.json", "contact.md", "projects", "skills", "about"] },
  "/home/appelgryn/about.md": { type: "file", content: (() => {
    const exp = RESUME.experience.map((e) => `  ${e.role} @ ${e.company} (${e.period})`).join("\n")
    return `${RESUME.name} — ${RESUME.title}\n\nLanguages: ${RESUME.languages.join(", ")}\nTools: ${RESUME.tools.join(", ")}\nLearning: ${RESUME.currentlyLearning.join(", ")}\n\nExperience:\n${exp}\n\nEducation: ${RESUME.education[0].degree} — ${RESUME.education[0].institution}`
  })() },
  "/home/appelgryn/projects.json": { type: "file", content: (() => {
    const p = PROJECTS.map((pr) => {
      let out = `${pr.name}\n  Tech: ${pr.tech.join(", ")}\n  ${pr.desc}`
      if (pr.stack) out += `\n  Stack: ${pr.stack.join(", ")}`
      if (pr.skills) out += `\n  Skills: ${pr.skills.join(", ")}`
      return out
    }).join("\n\n")
    return p
  })() },
  "/home/appelgryn/skills.json": { type: "file", content: (() => {
    return SKILLS.map((s) => `${s.cat}: ${s.items.join(", ")}`).join("\n")
  })() },
  "/home/appelgryn/contact.md": { type: "file", content: `Email: ${RESUME.email}\nLinkedIn: ${RESUME.linkedin}\nGitHub: ${RESUME.github}\nTwitter: @KaptainCS3` },
  "projects": { type: "dir", children: PROJECTS.map((p) => p.name.toLowerCase().replace(/\s+/g, "-") + ".md") },
  "skills": { type: "dir", children: SKILLS.map((s) => s.cat.toLowerCase() + ".json") },
  "about": { type: "dir", children: ["readme.md"] },
}

const PROJECT_FILE_MAP: Record<string, string> = {}
for (const p of PROJECTS) {
  const slug = p.name.toLowerCase().replace(/\s+/g, "-")
  let content = `${p.name}\n${"=".repeat(p.name.length)}\n\nTech: ${p.tech.join(", ")}\n\n${p.desc}`
  if (p.stack) content += `\n\nStack: ${p.stack.join(", ")}`
  if (p.skills) content += `\n\nSkills:\n  - ${p.skills.join("\n  - ")}`
  content += `\n\nAccent: ${p.accent}`
  PROJECT_FILE_MAP[slug + ".md"] = content
}
for (const s of SKILLS) {
  const slug = s.cat.toLowerCase()
  PROJECT_FILE_MAP[slug + ".json"] = `${s.cat}\n${"-".repeat(s.cat.length)}\n\n${s.items.map((i) => `  • ${i}`).join("\n")}`
}

function resolvePath(raw: string): string {
  let p = raw.replace(/^~/, ENV.HOME)
  if (!p.startsWith("/")) p = ENV.PWD + "/" + p
  p = p.replace(/\/+$/, "") || ENV.HOME
  return p
}

function getNode(path: string): { type: "file" | "dir"; content?: string; children?: string[] } | undefined {
  if (VIRTUAL_FS[path]) return VIRTUAL_FS[path]
  const slug = path.split("/").pop() || ""
  const parent = path.split("/").slice(0, -1).join("/")
  const parentNode = VIRTUAL_FS[parent]
  if (parentNode?.type === "dir" && parentNode.children?.includes(slug)) {
    return PROJECT_FILE_MAP[slug] ? { type: "file", content: PROJECT_FILE_MAP[slug] } : undefined
  }
  return undefined
}

export function buildCommands(): Map<string, Command> {
  const cmds = new Map<string, Command>()

  function reg(cmd: Command) {
    cmds.set(cmd.name, cmd)
    for (const a of cmd.aliases ?? []) cmds.set(a, cmd)
  }

  reg({
    name: "help",
    desc: "Show available commands",
    usage: "help [command]",
    handler(args) {
      if (args.length > 0) {
        const target = cmds.get(args[0])
        if (target) return showHelp(args[0], new Map([[args[0], target]]))
        return lines(`No help entry for '${args[0]}'`, `Try: help`)
      }
      const result: TerminalLine[] = [lines("Available commands:"), lines("")].flat()
      const longest = Math.max(...[...cmds.values()].map((c) => c.name.length))
      const seen = new Set<string>()
      for (const cmd of cmds.values()) {
        if (seen.has(cmd.name)) continue
        seen.add(cmd.name)
        const padded = cmd.name.padEnd(longest + 2)
        result.push({ out: `  ${padded}${cmd.desc}` })
      }
      result.push(...lines(""), ...lines("Tip: <tab> to autocomplete, ↑↓ for history"))
      return result
    },
  })

  reg({
    name: "whoami",
    desc: "Display current user identity",
    usage: "whoami",
    handler() {
      return lines(
        RESUME.name,
        col(RESUME.title, "#34d399"),
        col("Buea, Cameroon ", "#60a5fa"),
        { out: "", flag: "cm" },
        "",
        `Languages:  ${RESUME.languages.join(", ")}`,
        `Tools:      ${RESUME.tools.join(", ")}`,
        `Learning:   ${RESUME.currentlyLearning.join(", ")}`,
      )
    },
  })

  reg({
    name: "ls",
    desc: "List directory contents",
    usage: "ls [-la] [path]",
    handler(args) {
      const showDetails = args.includes("-la") || args.includes("-l")
      const target = args.filter((a) => !a.startsWith("-"))
      const path = resolvePath(target[0] || ".")
      const node = getNode(path)
      if (!node) return lines(`ls: cannot access '${target[0] || path}': No such file or directory`)
      if (node.type === "file") return lines(path.replace(/^.*\//, ""))
      const children = node.children ?? []
      if (children.length === 0) return lines("")
      if (!showDetails) {
        const cols = 4
        const result: string[][] = []
        let row: string[] = []
        for (const c of children) {
          const display = VIRTUAL_FS[path + "/" + c]?.type === "dir" ? c + "/" : c
          row.push(display.padEnd(24))
          if (row.length === cols) { result.push(row); row = [] }
        }
        if (row.length) result.push(row)
        return result.map((r) => r.join("")).map((t) => ({ out: t }))
      }
      const result: TerminalLine[] = [
        { out: "total " + children.length },
      ]
      for (const c of children) {
        const isDir = VIRTUAL_FS[path + "/" + c]?.type === "dir"
        const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--"
        const display = isDir ? c + "/" : c
        result.push({ out: `${perms}  1 appelgryn appelgryn  ${String(Math.floor(Math.random() * 8000 + 200)).padStart(5)}  Apr  1 12:34  ${display}` })
      }
      return result
    },
  })

  reg({
    name: "cat",
    desc: "Print file contents",
    usage: "cat <file>",
    handler(args) {
      if (args.length === 0) return lines("cat: missing operand", "Try: cat <file>")
      const path = resolvePath(args[0])
      const node = getNode(path)
      if (!node) return lines(`cat: ${args[0]}: No such file or directory`)
      if (node.type === "dir") return lines(`cat: ${args[0]}: Is a directory`)
      return node.content ? node.content.split("\n").map((l) => ({ out: l })) : lines("")
    },
  })

  reg({
    name: "echo",
    desc: "Print text to stdout",
    usage: "echo [text...]",
    handler(args) {
      if (args.length === 0) return lines("")
      const expanded = args
        .join(" ")
        .replace(/\$([A-Z_]+)/g, (m, v) => ENV[v as keyof typeof ENV] ?? m)
      return lines(expanded)
    },
  })

  reg({
    name: "date",
    desc: "Show current date and time",
    usage: "date",
    handler() {
      const d = new Date()
      const tzo = -d.getTimezoneOffset()
      const tzStr = `UTC${tzo >= 0 ? "+" : ""}${Math.floor(tzo / 60)}:${String(tzo % 60).padStart(2, "0")}`
      return lines(d.toString() + " " + tzStr)
    },
  })

  reg({
    name: "uname",
    desc: "Print system information",
    usage: "uname [-a]",
    handler(args) {
      if (args.includes("-a") || args.includes("--all")) {
        return lines("PortfolioOS 1.0 x86_64 Web Browser 2026-05-18")
      }
      return lines("PortfolioOS")
    },
  })

  reg({
    name: "fortune",
    desc: "Display a random advice",
    usage: "fortune",
    async handler() {
      try {
        const res = await fetch("/api/fortune")
        const data = await res.json()
        const q = data.advice
        const maxW = 40
        const wrapped = wrapText(q, maxW)
        const boxW = maxW + 2
        const border = "─".repeat(boxW)
        const result = [
          col(`  ╭${border}╮`, "#60a5fa"),
          ...wrapped.map((l) => col(`  │ ${l.padEnd(maxW)} │`, "#60a5fa")),
          col(`  ╰${border}╯`, "#60a5fa"),
        ]
        return result.map((l) => ({ out: l.text, color: l.color }))
      } catch {
        return lines(col("Failed to fetch advice. The oracle is offline.", "#ef4444"))
      }
    },
  })

  reg({
    name: "cowsay",
    desc: "Make a cow say something",
    usage: "cowsay <message>",
    handler(args) {
      if (args.length === 0) return lines("cowsay: nothing to say")
      const msg = args.join(" ")
      const border = "─".repeat(Math.min(msg.length + 2, 60))
      const result: TerminalLine[] = [
        { out: ` ╭${border}╮` },
        { out: ` │ ${msg.slice(0, 60)} │` },
        { out: ` ╰${border}╯` },
      ]
      for (const line of COW.split("\n")) {
        result.push({ out: line })
      }
      return result
    },
  })

  reg({
    name: "sudo",
    desc: "Execute a command as superuser",
    usage: "sudo <command>",
    handler() {
      return lines(
        col("sudo: Permission denied. This incident has been logged.", "#ef4444"),
        "",
        "  The administrator has been notified.",
        `  (just kidding, it's a portfolio — there's no root)`,
      )
    },
  })

  reg({
    name: "neofetch",
    desc: "Display system information with ASCII art",
    usage: "neofetch",
    handler() {
      const d = new Date()
      return [
        lines(
          col("           ╱╲       ", "#34d399"),
          col("          ╱  ╲      ", "#34d399"),
          col("         ╱    ╲     ", "#34d399"),
          col("        ╱______╲    ", "#34d399"),
          col("       │ OS    │    ", "#60a5fa"),
          col("       │ Shell │    ", "#60a5fa"),
          col("       │ Lang  │    ", "#60a5fa"),
          col("       │ Env   │    ", "#60a5fa"),
          col("       │       │    ", "#60a5fa"),
          col("       ╰───────╯    ", "#60a5fa"),
        ).flat(),
        lines(""),
        lines(
          `appelgryn@portfolio`,
          `OS: PortfolioOS 1.0 x86_64`,
          `Shell: bash 5.2`,
          `Editor: nvim`,
          `Languages: TypeScript, JavaScript, Python`,
          `Resolution: ${typeof window !== "undefined" ? window.innerWidth : "1920"}x${typeof window !== "undefined" ? window.innerHeight : "1080"}`,
          `Terminal: xterm-256color`,
          `Date: ${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`,
        ),
      ].flat()
    },
  })

  reg({
    name: "projects",
    desc: "List all projects",
    usage: "projects",
    aliases: ["proj"],
    handler() {
      if (PROJECTS.length === 0) return lines("No projects found.")
      const result: TerminalLine[] = []
      for (const p of PROJECTS) {
        result.push({ out: "", color: "transparent" })
        result.push({ out: p.name })
        result.push({ out: `  Tech: ${p.tech.join(", ")}` })
        if (p.stack) result.push({ out: `  Stack: ${p.stack.join(", ")}` })
        if (p.skills) result.push({ out: `  Skills: ${p.skills.join(", ")}` })
        result.push({ out: `  ${p.desc}` })
      }
      return result
    },
  })

  reg({
    name: "skills",
    desc: "List skill categories",
    usage: "skills",
    handler() {
      if (SKILLS.length === 0) return lines("No skills listed.")
      return SKILLS.map((s) => `${s.cat}: ${s.items.join(", ")}`).map((l) => ({ out: l }))
    },
  })

  reg({
    name: "contact",
    desc: "Show contact information",
    usage: "contact",
    aliases: ["email"],
    handler() {
      return lines(
        `📧 ${RESUME.email}`,
        `💼 ${RESUME.linkedin}`,
        `🐙 ${RESUME.github}`,
        `🐦 @KaptainCS3`,
      )
    },
  })

  reg({
    name: "cd",
    desc: "Change directory",
    usage: "cd [path]",
    handler(args) {
      const target = args[0] || ENV.HOME
      const resolved = resolvePath(target)
      const node = getNode(resolved)
      if (!node) return lines(`cd: ${target}: No such file or directory`)
      if (node.type !== "dir") return lines(`cd: ${target}: Not a directory`)
      ENV.PWD = resolved
      return lines("")
    },
  })

  reg({
    name: "pwd",
    desc: "Print working directory",
    usage: "pwd",
    handler() {
      return lines(ENV.PWD)
    },
  })

  reg({
    name: "env",
    desc: "Show environment variables",
    usage: "env",
    handler() {
      return Object.entries(ENV).map(([k, v]) => `${k}=${v}`).map((l) => ({ out: l }))
    },
  })

  reg({
    name: "uptime",
    desc: "Show how long the system has been running",
    usage: "uptime",
    handler() {
      const navStart = typeof performance !== "undefined" ? (performance.timeOrigin ?? Date.now()) : Date.now()
      const mins = Math.floor((Date.now() - navStart) / 60000)
      const h = Math.floor(mins / 60)
      const m = mins % 60
      const users = Object.keys(VIRTUAL_FS).length
      return lines(`  ${h}:${String(m).padStart(2, "0")}  up ${h} min,  1 user,  load average: 0.00 0.01 0.05`)
    },
  })

  reg({
    name: "sl",
    desc: "Derail your terminal session",
    usage: "sl",
    handler() {
      return [
        { out: "" },
        { out: "     🚂💨", color: "#fb923c" },
        { out: "    ╱╲╱╲╱╲╱╲╱╲╱╲", color: "#fb923c" },
        { out: "   ╱╲╱╲╱╲╱╲╱╲╱╲╱╲", color: "#fb923c" },
        { out: "" },
        { out: "Oops. You meant ls, didn't you?", color: "#4a6b7a" },
      ]
    },
  })

  return cmds
}
