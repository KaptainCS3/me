import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://api.adviceslip.com/advice")
    const data = await res.json()
    return NextResponse.json({ advice: data.slip.advice })
  } catch {
    return NextResponse.json({ advice: "The oracle is silent. Try again." }, { status: 502 })
  }
}
