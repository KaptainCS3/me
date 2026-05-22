const SITE_URL = "https://portfolio-kaptaincs3.vercel.app"

export function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mbi Enow Leonard Appelgryn",
    givenName: "Leonard",
    familyName: "Appelgryn",
    alternateName: "KaptainCS3",
    jobTitle: "Software Engineer",
    url: SITE_URL,
    sameAs: [
      "https://github.com/kaptaincs3",
      "https://linkedin.com/in/leonard-appelgryn",
      "https://x.com/KaptainCS3",
    ],
    knowsAbout: [
      "Next.js",
      "React",
      "TypeScript",
      "Full-Stack Development",
      "Cloud Architecture",
    ],
    email: "mbiapplegryn@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Buea",
      addressCountry: "CM",
    },
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "KaptainCS3 Portfolio",
    url: SITE_URL,
    description:
      "Portfolio of Mbi Enow Leonard Appelgryn, a full-stack software engineer.",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify([person, website]),
      }}
    />
  )
}
