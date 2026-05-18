"use client"

import dynamic from "next/dynamic"

const PortfolioOS = dynamic(() => import("@/components/os/PortfolioOS"), {
  ssr: false,
})

export default function Home() {
  return <PortfolioOS />
}
