import type { TerminalLine, VfsNode } from "@/types/portfolio"
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

const ENV = {
  USER: "appelgryn",
  HOME: "/home/appelgryn",
  SHELL: "/bin/bash",
  PWD: "/home/appelgryn",
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
  const res: string[] = []
  let current = ""
  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxWidth && current) {
      res.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) res.push(current)
  return res
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

export function buildCommands(
  vfs: Record<string, VfsNode>,
  updateVfsNode: (path: string, node: VfsNode) => void,
  deleteVfsNode: (path: string) => void,
  actions: {
    setThemeMode: (mode: any) => void
    setAccentColor: (color: string) => void
    setWallpaper: (wp: string) => void
    openWindow: (id: string) => void
  }
): Map<string, Command> {
  const cmds = new Map<string, Command>()

  function resolvePath(raw: string): string {
    let p = raw.replace(/^~/, ENV.HOME)
    if (!p.startsWith("/")) p = ENV.PWD + "/" + p
    p = p.replace(/\/+$/, "") || "/"
    
    const parts = p.split("/")
    const stack: string[] = []
    for (const part of parts) {
      if (part === "..") stack.pop()
      else if (part && part !== ".") stack.push(part)
    }
    return "/" + stack.join("/")
  }

  function getNode(path: string): VfsNode | undefined {
    return vfs[path]
  }

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
        return [ { out: children.join("  ") } ]
      }
      const result: TerminalLine[] = [ { out: "total " + children.length } ]
      for (const c of children) {
        const childPath = path === "/" ? `/${c}` : `${path}/${c}`
        const childNode = getNode(childPath)
        const isDir = childNode?.type === "dir"
        const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--"
        result.push({ out: `${perms}  1 appelgryn appelgryn  ${String(Math.floor(Math.random() * 8000 + 200)).padStart(5)}  Apr  1 12:34  ${c}${isDir ? "/" : ""}` })
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
    name: "mkdir",
    desc: "Create a directory",
    usage: "mkdir <directory>",
    handler(args) {
      if (args.length === 0) return lines("mkdir: missing operand")
      const path = resolvePath(args[0])
      if (getNode(path)) return lines(`mkdir: cannot create directory '${args[0]}': File exists`)
      const parentPath = path.split("/").slice(0, -1).join("/") || "/"
      const parentNode = getNode(parentPath)
      if (!parentNode || parentNode.type !== "dir") return lines(`mkdir: cannot create directory '${args[0]}': No such file or directory`)
      
      const name = path.split("/").pop()!
      updateVfsNode(path, { type: "dir", children: [] })
      updateVfsNode(parentPath, { ...parentNode, children: [...(parentNode.children || []), name] })
      return lines("")
    },
  })

  reg({
    name: "touch",
    desc: "Create an empty file",
    usage: "touch <file>",
    handler(args) {
      if (args.length === 0) return lines("touch: missing operand")
      const path = resolvePath(args[0])
      const existing = getNode(path)
      if (existing) return lines("")

      const parentPath = path.split("/").slice(0, -1).join("/") || "/"
      const parentNode = getNode(parentPath)
      if (!parentNode || parentNode.type !== "dir") return lines(`touch: cannot touch '${args[0]}': No such file or directory`)

      const name = path.split("/").pop()!
      updateVfsNode(path, { type: "file", content: "" })
      updateVfsNode(parentPath, { ...parentNode, children: [...(parentNode.children || []), name] })
      return lines("")
    },
  })

  reg({
    name: "rm",
    desc: "Remove a file or directory",
    usage: "rm [-r] <path>",
    handler(args) {
      const recursive = args.includes("-r") || args.includes("-rf")
      const target = args.filter((a) => !a.startsWith("-"))[0]
      if (!target) return lines("rm: missing operand")
      const path = resolvePath(target)
      const node = getNode(path)
      if (!node) return lines(`rm: cannot remove '${target}': No such file or directory`)
      if (node.type === "dir" && !recursive) return lines(`rm: cannot remove '${target}': Is a directory`)
      
      const parentPath = path.split("/").slice(0, -1).join("/") || "/"
      const parentNode = getNode(parentPath)
      
      deleteVfsNode(path)
      if (parentNode && parentNode.children) {
        const name = path.split("/").pop()!
        updateVfsNode(parentPath, { ...parentNode, children: parentNode.children.filter(c => c !== name) })
      }
      return lines("")
    },
  })

  reg({
    name: "theme",
    desc: "Change system theme",
    usage: "theme [dark|matrix|retro|light]",
    handler(args) {
      const mode = args[0]
      if (!["dark", "matrix", "retro", "light"].includes(mode)) {
        return lines("Usage: theme [dark|matrix|retro|light]")
      }
      actions.setThemeMode(mode)
      return lines(`Theme changed to ${mode}`)
    },
  })

  reg({
    name: "whoami",
    desc: "Display current user identity",
    usage: "whoami",
    handler() {
      return lines(
        RESUME.name,
        col("Software Engineer | KaptainCS3", "var(--accent)"),
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
    name: "pwd",
    desc: "Print working directory",
    usage: "pwd",
    handler() {
      return lines(ENV.PWD)
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
          col("           ╱╲       ", "var(--accent)"),
          col("          ╱  ╲      ", "var(--accent)"),
          col("         ╱    ╲     ", "var(--accent)"),
          col("        ╱______╲    ", "var(--accent)"),
          col("       │ OS    │    ", "#60a5fa"),
          col("       │ Shell │    ", "#60a5fa"),
          col("       │ Lang  │    ", "#60a5fa"),
          col("       │ Env   │    ", "#60a5fa"),
          col("       │       │    ", "#60a5fa"),
          col("       ╰───────╯    ", "#60a5fa"),
        ).flat(),
        lines(""),
        lines(
          `${ENV.USER}@portfolio`,
          `OS: PortfolioOS 1.0 x86_64`,
          `Host: Leonard Appelgryn (KaptainCS3)`,
          `Shell: bash 5.2`,
          `Editor: nvim`,
          `Location: Buea, Cameroon`,
          `Motto: target the peak | stay humble and cool`,
          `Languages: ${RESUME.languages.join(", ")}`,
          `Date: ${d.toLocaleDateString()}`,
        ),
      ].flat()
    },
  })

  reg({
    name: "fortune",
    desc: "Display random advice",
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
    name: "contact",
    desc: "Display contact information or open contact window",
    usage: "contact [--open|--mail]",
    handler(args) {
      if (args.includes("--open")) {
        actions.openWindow("contact")
        return lines("Opening Contact window...")
      }
      if (args.includes("--mail")) {
        window.open(`mailto:${RESUME.email}`)
        return lines("Opening mail client...")
      }

      const maxLabel = Math.max("LinkedIn".length, "GitHub".length, "Email".length, "Twitter".length)
      return [
        ...lines(col("Contact Methods:", "var(--accent)")),
        ...lines(""),
        { out: `${"Email:".padEnd(maxLabel + 2)}${RESUME.email}`, color: "#60a5fa" },
        { out: `${"LinkedIn:".padEnd(maxLabel + 2)}${RESUME.linkedin}`, color: "#34d399" },
        { out: `${"GitHub:".padEnd(maxLabel + 2)}${RESUME.github}`, color: "#c084fc" },
        { out: `${"X/Twitter:".padEnd(maxLabel + 2)}@KaptainCS3`, color: "#1da1f2" },
        ...lines(""),
        ...lines(col("Tip: Run 'contact --open' to send a message via the form.", "#4a6b7a")),
      ]
    },
  })

  return cmds
}
