import type { FC } from "react"
import { AboutContent } from "./AboutContent"
import { ProjectsContent } from "./ProjectsContent"
import { SkillsContent } from "./SkillsContent"
import { ContactContent } from "./ContactContent"
import { TerminalContent } from "./TerminalContent"
import { AboutOSContent } from "./AboutOSContent"
import { PdfViewerContent } from "./PdfViewerContent"

interface WindowContentProps {
  id: string
  onClose?: () => void
}

export const WindowContent: FC<WindowContentProps> = ({ id, onClose }) => {
  switch (id) {
    case "about":
      return <AboutContent />
    case "projects":
      return <ProjectsContent />
    case "skills":
      return <SkillsContent />
    case "contact":
      return <ContactContent />
    case "terminal":
      return <TerminalContent onClose={onClose} />
    case "about-os":
      return <AboutOSContent />
    case "resume-viewer":
      return <PdfViewerContent />
    default:
      return null
  }
}
