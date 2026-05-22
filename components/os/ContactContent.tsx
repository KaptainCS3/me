"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FiMail, FiLinkedin, FiGithub, FiSend, FiCopy, FiCheck, FiExternalLink } from "react-icons/fi"
import { RiTwitterXLine } from "react-icons/ri"
import { RESUME } from "@/data/about"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { contactSchema, type FormValues, SERVICE_OPTIONS } from "@/lib/schemas/contact"

export function ContactContent() {
  const [sent, setSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      service: "",
      customSubject: "",
      message: "",
    },
  })

  const selectedService = watch("service")

  const contacts = [
    { id: "email", icon: FiMail, label: "Email", value: RESUME.email, href: `mailto:${RESUME.email}`, color: "#60a5fa" },
    { id: "linkedin", icon: FiLinkedin, label: "LinkedIn", value: "leonard-appelgryn", href: `https://${RESUME.linkedin}`, color: "#34d399" },
    { id: "github", icon: FiGithub, label: "GitHub", value: "kaptaincs3", href: `https://${RESUME.github}`, color: "#c084fc" },
    { id: "x", icon: RiTwitterXLine, label: "X/Twitter", value: "@KaptainCS3", href: "https://x.com/KaptainCS3", color: "#1da1f2" },
  ]

  const handleCopy = (val: string, id: string) => {
    navigator.clipboard.writeText(val)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const onSubmit = async (data: FormValues) => {
    setIsSending(true)
    setApiError(null)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) {
        setApiError(json.error || "Failed to send message")
        return
      }
      setSent(true)
      reset()
      setTimeout(() => setSent(false), 3000)
    } catch {
      setApiError("Network error. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="h-full flex flex-col font-mono text-sm bg-[#06090c] overflow-hidden">
      <div className="px-4 py-2 border-b border-[#1e3a4a]/30 bg-[#0d1117] flex items-center gap-2 text-[10px] text-[#4a6b7a] shrink-0">
        <span className="opacity-50">portfolio</span>
        <span>/</span>
        <span className="text-[#34d399]">contact.tsx</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-16 sm:pb-24 space-y-8 custom-scrollbar">
        <section className="space-y-1">
          <p className="text-[#4a6b7a] text-xs">
            {"// Connect with the engineer"}
          </p>
          <h2 className="text-xl font-bold text-white tracking-tight">
            System.Contact()
          </h2>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-3">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="group relative flex flex-col p-3 rounded-lg bg-[#0d1117] border border-[#1e3a4a]/30 hover:border-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <c.icon
                      className="transition-transform group-hover:scale-110"
                      style={{ color: c.color }}
                      size={16}
                    />
                    <span className="text-[10px] uppercase tracking-widest text-[#4a6b7a]">
                      {c.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleCopy(c.value, c.id)}
                      className="p-1.5 rounded-md hover:bg-white/5 text-[#4a6b7a] hover:text-white transition-colors"
                      title="Copy"
                    >
                      {copiedId === c.id ? (
                        <FiCheck className="text-[#34d399]" size={14} />
                      ) : (
                        <FiCopy size={14} />
                      )}
                    </button>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-white/5 text-[#4a6b7a] hover:text-white transition-colors"
                      title="Open link"
                    >
                      <FiExternalLink size={14} />
                    </a>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#c084fc] text-xs">const</span>
                  <span className="text-[#60a5fa] font-semibold">{c.id}</span>
                  <span className="text-[#4a6b7a]">=</span>
                  <span className="text-[#34d399] break-all">
                    &quot;{c.value}&quot;
                  </span>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 flex flex-col gap-4 bg-[#0d1117]/50 p-5 rounded-xl border border-[#1e3a4a]/20"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-[10px] text-[#4a6b7a] uppercase tracking-widest"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-[10px] text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-[10px] text-[#4a6b7a] uppercase tracking-widest"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="service"
                  className="text-[10px] text-[#4a6b7a] uppercase tracking-widest"
                >
                  Service Interested In
                </Label>
                <Select
                  value={selectedService}
                  onValueChange={(val) =>
                    setValue("service", val, { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="service">
                    <SelectValue placeholder="Select a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-[10px] text-red-400">
                    {errors.service.message}
                  </p>
                )}
              </div>

              {selectedService === "other" && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <Label
                    htmlFor="customSubject"
                    className="text-[10px] text-[#4a6b7a] uppercase tracking-widest"
                  >
                    Custom Subject
                  </Label>
                  <Input
                    id="customSubject"
                    placeholder="Describe your inquiry..."
                    {...register("customSubject")}
                  />
                  {errors.customSubject && (
                    <p className="text-[10px] text-red-400">
                      {errors.customSubject.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="message"
                  className="text-[10px] text-[#4a6b7a] uppercase tracking-widest"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  rows={4}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-[10px] text-red-400">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            {apiError && (
              <p className="text-[10px] text-red-400 bg-red-400/10 border border-red-400/20 rounded px-3 py-2">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSending}
              className={`mt-2 group relative flex items-center justify-center gap-2 px-6 py-3 rounded-lg overflow-hidden transition-all active:scale-95 ${
                sent
                  ? "bg-[#34d399] text-[#060d14]"
                  : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
              }`}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : sent ? (
                <>
                  <FiCheck size={16} className="animate-bounce" />
                  <span className="font-bold">SIGNAL SENT</span>
                </>
              ) : (
                <>
                  <FiSend
                    size={16}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                  <span className="font-bold tracking-widest uppercase text-xs">
                    Transmit Signal
                  </span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="flex items-center bg-[#0d1117] border-t border-[#1e3a4a]/30 h-8 text-[10px] overflow-hidden shrink-0">
        <div className="flex items-center bg-[#34d399] text-[#060d14] px-3 h-full font-bold relative mr-3">
          AVAILABLE FOR HIRE
          <div className="absolute right-[-12px] top-0 bottom-0 w-0 h-0 border-y-[16px] border-y-transparent border-l-[12px] border-l-[#34d399]" />
        </div>
        <div className="flex items-center gap-4 text-[#4a6b7a]">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            REMOTE
          </span>
          <span className="hidden sm:inline">EN/FR</span>
          <span className="hidden md:inline opacity-50 italic">
            Tip: type &apos;contact --open&apos; in terminal
          </span>
        </div>
      </div>
    </div>
  );
}
