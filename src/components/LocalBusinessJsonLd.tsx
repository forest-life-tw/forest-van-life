const BASE_URL = "https://forest-van-life.vercel.app";

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "森活家露營車",
    alternateName: "Forest Van Life",
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/logo.png`,
    description:
      "台灣合法廂車改裝專家，專注貨車、客貨車露營改裝。座位變更、副電池、駐車冷氣，每項施作對應法規依據，協助完成監理站變更登記，驗車保過。",
    address: {
      "@type": "PostalAddress",
      streetAddress: "中山南路218號",
      addressLocality: "永康區",
      addressRegion: "台南市",
      addressCountry: "TW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 23.0255,
      longitude: 120.2443,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "13:00",
        closes: "21:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: "https://line.me/R/ti/p/@137ktawk?oat_content=url",
    },
    areaServed: {
      "@type": "Country",
      name: "Taiwan",
    },
    priceRange: "$$",
    sameAs: ["https://line.me/R/ti/p/@137ktawk?oat_content=url"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
