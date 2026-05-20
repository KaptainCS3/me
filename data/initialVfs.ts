import { PROJECTS } from "./projects"
import { SKILLS } from "./skills"
import { RESUME } from "./about"
import type { VfsNode } from "@/types/portfolio"

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

export const INITIAL_VFS: Record<string, VfsNode> = {
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
  "/home/appelgryn/projects": { type: "dir", children: PROJECTS.map((p) => p.name.toLowerCase().replace(/\s+/g, "-") + ".md") },
  "/home/appelgryn/skills": { type: "dir", children: SKILLS.map((s) => s.cat.toLowerCase() + ".json") },
  "/home/appelgryn/about": { type: "dir", children: ["readme.md"] },
  "/home/appelgryn/about/readme.md": { type: "file", content: "Welcome to my portfolio! Use the terminal or desktop icons to explore." },
}

// Add the generated project and skill files
Object.entries(PROJECT_FILE_MAP).forEach(([slug, content]) => {
  if (slug.endsWith(".md")) {
    INITIAL_VFS[`/home/appelgryn/projects/${slug}`] = { type: "file", content }
  } else if (slug.endsWith(".json")) {
    INITIAL_VFS[`/home/appelgryn/skills/${slug}`] = { type: "file", content }
  }
})
