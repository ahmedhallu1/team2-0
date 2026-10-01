import type { AddonId, MilkId, SizeId } from "@/lib/kuphub/site";

/**
 * An iced latte in a clear KUPHUB cup, drawn to answer the builder.
 *
 * Everything the visitor picks changes something they can see: the size
 * scales the cup, the milk shifts its colour, an extra shot pushes the
 * espresso further down, syrups settle at the bottom, sauces run down the
 * inside wall, and whipped cream swaps the flat lid for a dome. Every change is
 * a transform, an opacity or a dash offset, so it all runs on the compositor.
 */

const MILK: Record<MilkId, { body: string; top: string }> = {
  regular: { body: "#f3e8d8", top: "#fbf5ec" },
  oat: { body: "#e8d3ad", top: "#f6ead2" },
  almond: { body: "#efdcc0", top: "#faefdc" },
};

const SCALE: Record<SizeId, number> = { s: 0.8, m: 0.9, l: 1 };

/** The inside of the cup — every liquid layer is clipped to this. */
const INNER = "M57 128 L86 432 Q88 438 95 438 L225 438 Q232 438 234 432 L263 128 Z";
const OUTER = "M50 120 L80 436 Q83 446 94 446 L226 446 Q237 446 240 436 L270 120";

const ICE = [
  { x: 92, y: 150, r: -14, d: "0s" },
  { x: 150, y: 136, r: 9, d: "-1.2s" },
  { x: 205, y: 156, r: -4, d: "-2.1s" },
  { x: 118, y: 206, r: 18, d: "-0.6s" },
  { x: 178, y: 214, r: -20, d: "-1.7s" },
  { x: 140, y: 262, r: 6, d: "-2.8s" },
];

export function IcedCup({
  size,
  milk,
  addons,
  className,
}: {
  size: SizeId;
  milk: MilkId;
  addons: Set<AddonId>;
  className?: string;
}) {
  const has = (a: AddonId) => addons.has(a);
  const m = MILK[milk];
  const cream = has("cream");

  return (
    <svg viewBox="0 0 320 480" className={className} role="img" aria-label={describe(size, milk, addons)}>
      <defs>
        <clipPath id="kup-inner">
          <path d={INNER} />
        </clipPath>
        <linearGradient id="kup-espresso" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b1c0b" />
          <stop offset="0.45" stopColor="#6e3a18" stopOpacity="0.92" />
          <stop offset="1" stopColor="#a8693a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kup-shot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1206" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#5a2c10" stopOpacity="0.6" />
          <stop offset="1" stopColor="#7a4420" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="kup-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id="kup-cream" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor="#f6eee0" />
          <stop offset="1" stopColor="#e3d5bd" />
        </radialGradient>
      </defs>

      {/* Shadow on the table, outside the scaled group so it stays put. */}
      <ellipse cx="160" cy="452" rx="110" ry="14" fill="#000" opacity="0.35" />

      <g className="kup-cupsize" style={{ transform: `scale(${SCALE[size]})` }}>
        {/* The drink */}
        <g clipPath="url(#kup-inner)">
          <rect className="kup-fill" x="40" y="146" width="240" height="300" style={{ fill: m.body }} />
          <rect className="kup-fill" x="40" y="146" width="240" height="70" style={{ fill: m.top }} opacity="0.7" />

          {/* Espresso, diffusing down through the milk */}
          <path
            d="M40 146 H280 V236 C250 252 226 230 198 246 C170 262 150 236 122 250 C96 263 70 244 40 256 Z"
            fill="url(#kup-espresso)"
          />
          <path
            className="kup-layer"
            d="M40 146 H280 V300 C252 320 222 290 192 312 C164 332 138 300 108 318 C82 334 62 312 40 326 Z"
            fill="url(#kup-shot)"
            style={{
              transformOrigin: "50% 0%",
              transform: has("shot") ? "scaleY(1)" : "scaleY(0.2)",
              opacity: has("shot") ? 1 : 0,
            }}
          />

          {/* Syrups settle at the bottom */}
          <rect
            className="kup-layer"
            x="40"
            y="404"
            width="240"
            height="40"
            fill="#e2b866"
            opacity="0.9"
            style={{ transform: has("vanilla") ? "scaleY(1)" : "scaleY(0)" }}
          />
          <rect
            className="kup-layer"
            x="40"
            y="406"
            width="240"
            height="34"
            fill="#9a5a2c"
            opacity="0.85"
            style={{
              transform: `translateY(${has("vanilla") ? -32 : 0}px) scaleY(${has("hazelnut") ? 1 : 0})`,
            }}
          />

          {/* Chocolate runs down the inside wall */}
          <g stroke="#2e1408" strokeLinecap="round" fill="none" strokeWidth="7" opacity="0.92">
            {[
              "M70 140 C72 190 74 230 80 300",
              "M104 140 C104 170 106 196 108 214",
              "M214 140 C214 176 212 210 210 246",
              "M248 140 C246 200 242 250 236 330",
            ].map((d) => (
              <path key={d} d={d} pathLength={1} className="kup-drizzle" data-on={has("chocolate")} />
            ))}
          </g>

          {/* Caramel, zig-zagged round the wall */}
          <path
            d="M62 168 L254 186 L66 214 L250 232 L72 262 L246 280 L78 312 L242 326"
            stroke="#c88c46"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            className="kup-drizzle"
            data-on={has("caramel")}
            opacity="0.95"
          />

          {/* Ice */}
          {ICE.map((c) => (
            <g key={`${c.x}-${c.y}`} transform={`translate(${c.x} ${c.y})`}>
              <rect
                className="kup-bob"
                width="42"
                height="40"
                rx="9"
                fill="#ffffff"
                fillOpacity="0.2"
                stroke="#ffffff"
                strokeOpacity="0.6"
                strokeWidth="1.5"
                style={{ ["--r" as string]: `${c.r}deg`, ["--d" as string]: c.d }}
              />
            </g>
          ))}
        </g>

        {/* Straw */}
        <g transform="rotate(12 196 110)">
          <g style={{ transform: `translateY(${cream ? -26 : 0}px)`, transition: "transform 0.7s var(--ease-expo)" }}>
            <rect x="188" y="18" width="16" height="290" rx="8" fill="#12633a" />
            <rect x="188" y="18" width="5" height="290" rx="2.5" fill="#ffffff" opacity="0.22" />
          </g>
        </g>
        {/* The print — KUPHUB's own mark, on the clear wall */}
        <image href="/kup/logo-mark.png" x="124" y="322" width="72" height="62" opacity="0.92" />

        {/* The cup itself */}
        <path d={OUTER} fill="url(#kup-glass)" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M66 136 L92 418" stroke="#ffffff" strokeOpacity="0.32" strokeWidth="5" strokeLinecap="round" />
        <path d="M80 136 L100 330" stroke="#ffffff" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="160" cy="120" rx="110" ry="9" fill="none" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2.5" />

        {/* Whipped cream, under a dome */}
        <g className="kup-layer" style={{ transform: cream ? "scale(1)" : "scale(0.2)", opacity: cream ? 1 : 0 }}>
          <path
            d="M62 122 C58 98 86 88 98 94 C100 70 130 62 146 74 C156 52 194 54 200 76 C220 66 248 80 242 100 C262 104 262 122 258 122 Z"
            fill="url(#kup-cream)"
          />
          <path
            d="M96 108 C110 98 122 104 132 96 M164 92 C178 82 196 90 206 84"
            stroke="#d9c7a9"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M86 106 L234 98 L100 92 L222 86"
            stroke="#c88c46"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            pathLength={1}
            className="kup-drizzle"
            data-on={has("caramel")}
          />
        </g>

        {/* Lids: flat by default, a clear dome over cream */}
        <g style={{ opacity: cream ? 0 : 1, transition: "opacity 0.5s ease" }}>
          <rect x="44" y="108" width="232" height="14" rx="7" fill="#f4efe6" fillOpacity="0.16" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="2" />
          <ellipse cx="160" cy="108" rx="112" ry="8" fill="#ffffff" fillOpacity="0.1" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
        <g style={{ opacity: cream ? 1 : 0, transition: "opacity 0.5s ease 0.15s" }}>
          <path
            d="M46 122 C46 60 98 34 160 34 C222 34 274 60 274 122"
            fill="#ffffff"
            fillOpacity="0.07"
            stroke="#ffffff"
            strokeOpacity="0.55"
            strokeWidth="2.5"
          />
          <path d="M84 70 C100 52 122 44 140 42" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
          <rect x="42" y="116" width="236" height="10" rx="5" fill="#ffffff" fillOpacity="0.12" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="1.8" />
        </g>

      </g>
    </svg>
  );
}

function describe(size: SizeId, milk: MilkId, addons: Set<AddonId>) {
  const sizeName = { s: "small", m: "medium", l: "large" }[size];
  const extras = addons.size ? ` with ${[...addons].length} extra${addons.size > 1 ? "s" : ""}` : "";
  return `A ${sizeName} iced latte with ${milk} milk${extras}, in a clear KUPHUB cup`;
}
