/**
 * The three things that can be printed on the cup, painted flat.
 *
 * Each label is rendered once into an offscreen canvas as a *strip* — the cup's
 * surface unrolled, so the strip's width is the circumference and its left and
 * right edges are the same seam. The scene then wraps that strip back around
 * the cylinder. Painting flat like this is what keeps the typography crisp: the
 * type is set with real canvas text in the site's own display face rather than
 * baked into a bitmap, so it re-renders at whatever pixel density the screen
 * turns out to have.
 *
 * The marks here are *our* settings of each brand's name for a concept — the
 * proportions and the colours follow the public logos, but nothing is traced
 * from, or passed off as, the original artwork.
 */

export type LabelKind = "blank" | "kuphub" | "linkup";

export const PALETTE = {
  /** Sampled from the KUPHUB profile mark. */
  kuphubGreen: "#0c4f28",
  kuphubGreenDeep: "#07331a",
  kuphubGreenLift: "#12633a",
  /** The caramel full-stop and the "IS" in "LESS IS MORE". */
  kuphubAmber: "#c88c46",
  /** Sampled from the LinkUp profile mark. */
  linkupAmber: "#e9a13b",
  linkupInk: "#141210",
  /** Unprinted stock. */
  blank: "#f4efe6",
  blankShade: "#e4dbcc",
  cream: "#f7f3ea",
} as const;

/**
 * Resolution of the unrolled strip, in device pixels per design pixel.
 *
 * Only about a fifth of the strip is legible once it is wrapped, and that
 * fifth lands on roughly 250 screen pixels, so 2× is already oversampling the
 * part anyone can read. Every extra tenth here costs real canvas memory on a
 * phone for detail that is being squeezed around the side of a cylinder.
 */
const STRIP_SCALE = 2;

export type Strip = { canvas: HTMLCanvasElement; width: number; height: number };

/**
 * The display family Next gave us at build time. Read from the CSS variable so
 * the canvas type matches the page type exactly, hashed family name and all.
 */
function families(): { display: string; body: string } {
  const root = getComputedStyle(document.documentElement);
  const display = root.getPropertyValue("--font-display-face").trim();
  const body = root.getPropertyValue("--font-body").trim();
  return {
    display: display ? `${display}, system-ui, sans-serif` : "system-ui, sans-serif",
    body: body ? `${body}, system-ui, sans-serif` : "system-ui, sans-serif",
  };
}

/**
 * How much of the circumference a mark may occupy.
 *
 * Only the middle of the strip is readable once it is wrapped: past about a
 * fifth of the way round, foreshortening squeezes a letter into a couple of
 * pixels. Everything set here is therefore sized against the circumference,
 * not against the band's height, so a mark can never be wider than the face it
 * has to sit on — which is what was clipping "LESS IS MORE" at both ends.
 */
const FACE = 0.21;

/** Letterspaced small caps, drawn by hand — canvas has no tracking control. */
function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  spacing: number,
  colorFor?: (index: number) => string | undefined,
  maxWidth?: number,
): void {
  const chars = [...text];
  const widths = chars.map((c) => ctx.measureText(c).width);
  const gaps = Math.max(1, chars.length - 1);
  let gap = spacing;
  let total = widths.reduce((a, b) => a + b, 0) + gap * gaps;
  // Close the tracking before letting a line run past its face.
  if (maxWidth && total > maxWidth) {
    gap = Math.max(0, gap - (total - maxWidth) / gaps);
    total = widths.reduce((a, b) => a + b, 0) + gap * gaps;
  }
  spacing = gap;
  let x = cx - total / 2;
  const base = ctx.fillStyle;
  chars.forEach((c, i) => {
    const override = colorFor?.(i);
    if (override) ctx.fillStyle = override;
    ctx.fillText(c, x, y);
    if (override) ctx.fillStyle = base;
    x += widths[i] + spacing;
  });
}

/** Faint fibre speckle, so unprinted stock doesn't read as flat vector fill. */
function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  // A fixed sequence, not Math.random: the strip is repainted on resize and on
  // theme change, and grain that reshuffles each time reads as a flicker.
  let seed = 9301;
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 900; i += 1) {
    const x = next() * w;
    const y = next() * h;
    const r = next() * 1.6 + 0.3;
    ctx.fillStyle = next() > 0.5 ? "#000" : "#fff";
    ctx.globalAlpha = alpha * (0.3 + next() * 0.7);
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Paint one label strip.
 *
 * `circumference` and `bandHeight` are in design px; the canvas is oversampled
 * by STRIP_SCALE and the context pre-scaled, so everything below can be written
 * in design units.
 */
export function paintStrip(
  kind: LabelKind,
  circumference: number,
  bandHeight: number,
): Strip {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(circumference * STRIP_SCALE);
  canvas.height = Math.round(bandHeight * STRIP_SCALE);
  const ctx = canvas.getContext("2d");
  if (!ctx) return { canvas, width: circumference, height: bandHeight };

  ctx.scale(STRIP_SCALE, STRIP_SCALE);
  const w = circumference;
  const h = bandHeight;
  const { display, body } = families();

  /* --- stock ----------------------------------------------------- */
  if (kind === "kuphub") {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, PALETTE.kuphubGreenLift);
    g.addColorStop(0.55, PALETTE.kuphubGreen);
    g.addColorStop(1, PALETTE.kuphubGreenDeep);
    ctx.fillStyle = g;
  } else if (kind === "linkup") {
    ctx.fillStyle = PALETTE.cream;
  } else {
    ctx.fillStyle = PALETTE.blank;
  }
  ctx.fillRect(0, 0, w, h);

  if (kind !== "kuphub") speckle(ctx, w, h, 0.05);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  /* --- blank stock: a moulded seam and nothing else ---------------- */
  if (kind === "blank") {
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    for (const y of [h * 0.16, h * 0.84]) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    return { canvas, width: w, height: h };
  }

  /* --- KUPHUB ------------------------------------------------------ */
  if (kind === "kuphub") {
    // Hairline rules top and bottom — the band the print sits inside.
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 1;
    for (const y of [h * 0.1, h * 0.9]) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Face one: the stacked mark, centred on the strip so it faces the viewer
    // at rotation 0.
    const faceX = w * 0.5;
    const face = w * FACE;
    // Set the stack at whatever size makes "KUP" exactly fill the face.
    ctx.font = `800 100px ${display}`;
    const size = Math.min(h * 0.3, (face / ctx.measureText("KUP").width) * 100);
    ctx.font = `800 ${size}px ${display}`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("KUP", faceX, h * 0.44);
    const hubW = ctx.measureText("HUB").width;
    ctx.fillText("HUB", faceX, h * 0.44 + size * 0.92);
    // The caramel full-stop, set as a disc rather than a glyph so it holds its
    // weight at every size.
    ctx.fillStyle = PALETTE.kuphubAmber;
    ctx.beginPath();
    ctx.arc(
      faceX + hubW / 2 + size * 0.13,
      h * 0.44 + size * 0.92 - size * 0.06,
      size * 0.1,
      0,
      Math.PI * 2,
    );
    ctx.fill();

    ctx.font = `600 ${size * 0.2}px ${body}`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    tracked(
      ctx, "LESSISMORE", faceX, h * 0.44 + size * 1.46, size * 0.14,
      (i) => (i === 4 || i === 5 ? PALETTE.kuphubAmber : undefined),
      face,
    );

    // Face two: the reverse of the cup, half a turn away.
    const backX = (faceX + w * 0.5) % w;
    ctx.font = `600 ${size * 0.17}px ${body}`;
    ctx.fillStyle = "rgba(255,255,255,0.66)";
    tracked(ctx, "PREMIUM KOFFEE", backX, h * 0.46, size * 0.1, undefined, face);
    tracked(ctx, "& KUP TO GO", backX, h * 0.56, size * 0.1, undefined, face);
    ctx.fillStyle = PALETTE.kuphubAmber;
    ctx.fillRect(backX - face * 0.12, h * 0.63, face * 0.24, 1.5);
    ctx.fillStyle = "rgba(255,255,255,0.42)";
    ctx.font = `500 ${size * 0.14}px ${body}`;
    tracked(ctx, "ALEXANDRIA", backX, h * 0.72, size * 0.12, undefined, face);

    // Quarter turns: a quiet repeat of the wordmark so the cup is never empty.
    ctx.font = `800 ${size * 0.34}px ${display}`;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    for (const at of [0.25, 0.75]) {
      ctx.textAlign = "center";
      ctx.fillText("KUPHUB", ((faceX + w * at) % w), h * 0.54);
      ctx.textAlign = "left";
    }
    return { canvas, width: w, height: h };
  }

  /* --- LinkUp ------------------------------------------------------ */
  const faceX = w * 0.5;
  const face = w * FACE;
  ctx.font = `800 100px ${display}`;
  const size = Math.min(h * 0.26, (face / ctx.measureText("LINKUP").width) * 100);
  ctx.font = `800 ${size}px ${display}`;
  const lin = ctx.measureText("LIN").width;
  const kup = ctx.measureText("KUP").width;
  const startX = faceX - (lin + kup) / 2;
  const baseline = h * 0.5;
  ctx.textAlign = "left";
  ctx.fillStyle = PALETTE.linkupInk;
  ctx.fillText("LIN", startX, baseline);
  ctx.fillStyle = PALETTE.linkupAmber;
  ctx.fillText("KUP", startX + lin, baseline);

  ctx.font = `600 ${size * 0.22}px ${body}`;
  ctx.fillStyle = "rgba(20,18,16,0.55)";
  tracked(ctx, "PAPER KUP", faceX, baseline + size * 0.44, size * 0.16, undefined, face);

  ctx.fillStyle = PALETTE.linkupAmber;
  ctx.fillRect(faceX - face * 0.14, baseline + size * 0.66, face * 0.28, 1.5);

  const backX = (faceX + w * 0.5) % w;
  ctx.font = `500 ${size * 0.17}px ${body}`;
  ctx.fillStyle = "rgba(20,18,16,0.48)";
  tracked(ctx, "PP5 · FOOD GRADE", backX, h * 0.47, size * 0.1, undefined, face);
  tracked(ctx, "6 · 8 · 12 · 16 OZ", backX, h * 0.58, size * 0.1, undefined, face);

  return { canvas, width: w, height: h };
}
