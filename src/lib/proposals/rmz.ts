/**
 * RMZtech — the agency the GeoArabia proposal is presented under.
 *
 * Read off their own channels on 6 October 2026: rmztech.net (address, phone),
 * the Facebook page (email, tagline) and the LinkedIn company page
 * (description). The email is the .net one — rmztech.net has mail servers and
 * rmztech.com, which the website footer prints, has none.
 */
const phoneDigits = "201116666414";

export const rmz = {
  name: "RMZtech",
  tagline: "The Platform",
  site: "https://www.rmztech.net/",
  linkedin: "https://www.linkedin.com/company/rmztech/",
  facebook: "https://www.facebook.com/RMZtech/",
  email: "info@rmztech.net",
  phone: { display: "+20 111 666 6414", e164: `+${phoneDigits}` },
  whatsappHref: `https://wa.me/${phoneDigits}?text=${encodeURIComponent(
    "Hi RMZtech, about the GeoArabia proposal —",
  )}`,
  /** Sampled from the mark: the bright ring and the deep one. */
  blue: "#2b66cc",
  navy: "#093789",
  mark: "/proposals/rmz/rmz-mark.png",
} as const;
