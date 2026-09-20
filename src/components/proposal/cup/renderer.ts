/**
 * The cup, drawn.
 *
 * One frame is a pure function of `CupState`, so the whole sequence is a single
 * number the scroll can drive — nothing in here holds animation state of its
 * own, and a reduced-motion visitor simply gets one call at a fixed state.
 *
 * The print is wrapped, not faked. For each visible column of the cup we solve
 * the cylinder for the surface angle at that column, look up the matching
 * column of the unrolled strip, and draw it at the width that angle actually
 * occupies on screen. That is why the wordmark compresses towards the sides
 * instead of sliding flatly past, and why the printed bands dip at the centre:
 * the vertical offset per column follows the same ellipse the rim does.
 */

import { CUP, DESIGN, bandBounds, bodyShape, ellipseFor, radiusAt } from "./geometry";
import { PALETTE, paintStrip, type LabelKind, type Strip } from "./labels";

export type CupState = {
  /** Turns around the axis. Whole numbers are full revolutions. */
  spin: number;
  /** 0 = lid seated, 1 = lid lifted clear. */
  lid: number;
  /** Cross-fade between `label` and `nextLabel`. */
  blend: number;
  label: LabelKind;
  nextLabel: LabelKind;
  /** 0 = no steam, 1 = full. */
  steam: number;
  /** Seconds, for the steam's drift only. */
  time: number;
  /** Lifts the whole cup off its shadow as it "arrives". */
  lift: number;
  /** Light background: the shadow and rim lighting change, the cup doesn't. */
  light: boolean;
};

export const DEFAULT_STATE: CupState = {
  spin: 0,
  lid: 0,
  blend: 0,
  label: "kuphub",
  nextLabel: "kuphub",
  steam: 0,
  time: 0,
  lift: 1,
  light: false,
};

/** Columns are drawn at this width in design px — the print's sampling rate. */
const COLUMN = 1.5;

/**
 * The unrolled label strips, painted once and shared by every cup on the page.
 *
 * They are a function of design-space constants only — the circumference and
 * the band's height never change — so an instance that paints its own, or
 * repaints them when its canvas resizes, can only ever produce the identical
 * bitmap again. Each strip is about 1.7 megapixels, so the page's two scenes
 * were between them holding ~40MB of duplicate canvas and reallocating all of
 * it on every ResizeObserver callback. On a desktop that is merely wasteful;
 * on a phone, where canvas memory is budgeted and reclaimed lazily, churning
 * tens of megabytes during layout is a good way to have the tab quietly
 * reloaded underneath the visitor.
 *
 * The generation counter is what lets a renderer notice the strips were
 * repainted — when a webfont lands — and drop the frame it composed from the
 * old ones.
 */
let sharedStrips: Map<LabelKind, Strip> | null = null;
let stripGeneration = 0;

function strips(): Map<LabelKind, Strip> {
  if (sharedStrips) return sharedStrips;
  const { top, bottom } = bandBounds();
  const circumference = 2 * Math.PI * CUP.rTop;
  const height = bottom - top;
  const built = new Map<LabelKind, Strip>();
  (["blank", "kuphub", "linkup"] as LabelKind[]).forEach((kind) => {
    built.set(kind, paintStrip(kind, circumference, height));
  });
  sharedStrips = built;
  return built;
}

/**
 * Throw the strips away so the next frame repaints them. Called once the
 * display face has actually loaded, since canvas text falls back to a system
 * font until then.
 */
export function refreshStrips(): void {
  sharedStrips = null;
  stripGeneration += 1;
}

export class CupRenderer {
  private ctx: CanvasRenderingContext2D;
  /**
   * Wrapping draws the strip as a few hundred overlapping slices. Overlap is
   * what stops hairline gaps opening between them — but two overlapping slices
   * drawn at a fractional alpha composite twice, which striped the cup every
   * time one label cross-faded into another. So each label is wrapped opaquely
   * into this buffer first and the buffer is composited once at the blend's
   * alpha, which is both correct and cheaper.
   */
  private scratch: HTMLCanvasElement | null = null;
  private scratchCtx: CanvasRenderingContext2D | null = null;
  /**
   * The cup without its steam, kept between frames.
   *
   * Wrapping the print costs a couple of hundred slice draws, and the steam is
   * the only thing that moves on its own clock — so while it drifts, the cup
   * underneath was being rebuilt sixty times a second to produce an identical
   * picture. Everything up to and including the mouth is composed here once
   * per *state* change; a drifting frame is then one blit, three strokes and
   * the lid.
   */
  private base: HTMLCanvasElement | null = null;
  private baseCtx: CanvasRenderingContext2D | null = null;
  private baseKey = "";
  private stripGen = -1;
  private body = bodyShape();
  private dpr = 1;
  private cssW = 0;
  private cssH = 0;
  private scale = 1;
  private offsetX = 0;
  private offsetY = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) throw new Error("2d context unavailable");
    this.ctx = ctx;
  }

  /** Drop this cup's cached frame if the shared strips have been repainted. */
  private syncStrips(): void {
    if (this.stripGen === stripGeneration) return;
    this.stripGen = stripGeneration;
    this.baseKey = "";
  }

  /** Fit the design space into the element's box. Call on mount and resize. */
  resize(cssW: number, cssH: number, dpr: number): void {
    this.cssW = cssW;
    this.cssH = cssH;
    this.dpr = dpr;
    this.canvas.width = Math.round(cssW * dpr);
    this.canvas.height = Math.round(cssH * dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
    this.scale = Math.min(cssW / DESIGN.w, cssH / DESIGN.h);
    this.offsetX = (cssW - DESIGN.w * this.scale) / 2;
    this.offsetY = (cssH - DESIGN.h * this.scale) / 2;

    if (!this.scratch) {
      this.scratch = document.createElement("canvas");
      this.scratchCtx = this.scratch.getContext("2d");
    }
    this.scratch.width = this.canvas.width;
    this.scratch.height = this.canvas.height;

    if (!this.base) {
      this.base = document.createElement("canvas");
      this.baseCtx = this.base.getContext("2d");
    }
    this.base.width = this.canvas.width;
    this.base.height = this.canvas.height;
    this.baseKey = "";
  }

  /** A repaint of the strips invalidates everything composed from them. */
  invalidate(): void {
    this.baseKey = "";
  }

  draw(state: CupState): void {
    if (!this.cssW || !this.cssH || !this.base || !this.baseCtx) return;
    this.syncStrips();

    // Everything except the steam and the lid is a function of these, so it
    // only has to be composed again when one of them moves.
    const key = [
      state.spin.toFixed(4),
      state.blend.toFixed(3),
      state.label,
      state.nextLabel,
      state.lift.toFixed(3),
      state.lid.toFixed(3),
      state.light ? "l" : "d",
    ].join("|");

    if (key !== this.baseKey) {
      this.baseKey = key;
      this.composeBase(state);
    }

    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.drawImage(this.base, 0, 0);

    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);
    ctx.save();
    ctx.translate(0, (1 - state.lift) * 70);
    // Steam sits behind the lid, so the lid is redrawn on top of it rather
    // than baked into the cached layer.
    this.steam(state);
    this.lid(state);
    ctx.restore();
  }

  /** Shadow, printed body and open mouth, composed into the cached layer. */
  private composeBase(state: CupState): void {
    const base = this.baseCtx;
    if (!base || !this.base) return;

    // The private draw helpers all write to `this.ctx`; point it at the cache
    // for the duration rather than threading a context through every one.
    const live = this.ctx;
    this.ctx = base;
    try {
      base.setTransform(1, 0, 0, 1, 0, 0);
      base.clearRect(0, 0, this.base.width, this.base.height);
      base.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      base.translate(this.offsetX, this.offsetY);
      base.scale(this.scale, this.scale);
      base.save();
      base.translate(0, (1 - state.lift) * 70);

      this.shadow(state);
      this.body_(state);
      this.mouth(state);

      base.restore();
    } finally {
      // Whatever happens above, the live context has to come back — leaving it
      // pointed at the cache would silently stop the cup being drawn at all.
      this.ctx = live;
    }
  }

  /* ---------------------------------------------------------------- */

  private shadow(state: CupState): void {
    const ctx = this.ctx;
    const spread = 1 + (1 - state.lift) * 0.5;
    const g = ctx.createRadialGradient(
      CUP.cx,
      CUP.yBot + 16,
      0,
      CUP.cx,
      CUP.yBot + 16,
      CUP.rBot * 2.1 * spread,
    );
    const strength = state.light ? 0.3 : 0.55;
    g.addColorStop(0, `rgba(0,0,0,${strength * state.lift})`);
    g.addColorStop(0.45, `rgba(0,0,0,${strength * 0.32 * state.lift})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save();
    ctx.translate(CUP.cx, CUP.yBot + 16 - (1 - state.lift) * 10);
    ctx.scale(1, 0.26);
    ctx.translate(-CUP.cx, -(CUP.yBot + 16));
    ctx.fillStyle = g;
    ctx.fillRect(
      CUP.cx - CUP.rBot * 2.4,
      CUP.yBot - CUP.rBot * 2.4,
      CUP.rBot * 4.8,
      CUP.rBot * 4.8,
    );
    ctx.restore();
  }

  /**
   * The printed body: strip columns wrapped around the cylinder, then lit.
   */
  private body_(state: CupState): void {
    const ctx = this.ctx;
    const { top, bottom } = bandBounds();
    const bandH = bottom - top;
    const r = radiusAt((top + bottom) / 2);
    const e = ellipseFor(r);

    ctx.save();
    ctx.clip(this.body);

    // Base coat, so the walls above and below the print are never bare canvas.
    ctx.fillStyle = this.stock(state);
    ctx.fillRect(CUP.cx - CUP.rTop - 8, CUP.yTop - 40, CUP.rTop * 2 + 16, CUP.yBot - CUP.yTop + 80);

    // Once the cross-fade has landed the layer underneath cannot be seen, and
    // wrapping it would cost a second full pass for nothing.
    const same = state.nextLabel === state.label;
    if (same || state.blend > 0.995) {
      this.wrap(same ? state.label : state.nextLabel, state.spin, top, bandH, r, e, 1);
    } else {
      this.wrap(state.label, state.spin, top, bandH, r, e, 1);
      if (state.blend > 0) {
        this.wrap(state.nextLabel, state.spin, top, bandH, r, e, state.blend);
      }
    }

    this.shade(state);
    ctx.restore();

    // A drawn edge keeps the silhouette crisp once the fill is shaded.
    ctx.save();
    ctx.lineWidth = 1.1;
    ctx.strokeStyle = state.light ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.16)";
    ctx.stroke(this.body);
    ctx.restore();
  }

  private stock(state: CupState): string {
    const solid = (k: LabelKind) =>
      k === "kuphub" ? PALETTE.kuphubGreen : k === "linkup" ? PALETTE.cream : PALETTE.blank;
    return state.blend > 0.5 ? solid(state.nextLabel) : solid(state.label);
  }

  /** One label, wrapped around the cylinder and composited at `alpha`. */
  private wrap(
    kind: LabelKind,
    spin: number,
    top: number,
    bandH: number,
    r: number,
    e: number,
    alpha: number,
  ): void {
    const strip = strips().get(kind);
    const buf = this.scratchCtx;
    if (!strip || !buf || !this.scratch || alpha <= 0) return;

    buf.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    buf.clearRect(0, 0, this.cssW, this.cssH);
    buf.translate(this.offsetX, this.offsetY);
    buf.scale(this.scale, this.scale);

    const sw = strip.canvas.width;
    const sh = strip.canvas.height;
    const overlap = COLUMN + 1.1;

    // Walk the visible width of the cup. `s` is the column's position across
    // the cylinder, -1 at the left silhouette edge and +1 at the right.
    const start = CUP.cx - r;
    for (let x = start; x < CUP.cx + r; x += COLUMN) {
      const s = Math.max(-1, Math.min(1, (x - CUP.cx) / r));
      const theta = Math.asin(s);
      const cosT = Math.cos(theta);
      // How much of the strip this column covers. Near the edges cos → 0, so a
      // single column swallows a large arc — that compression *is* the
      // foreshortening. Clamped so the last column can't sample the whole strip.
      const arc = Math.min(0.09, COLUMN / (r * Math.max(cosT, 0.06)) / (2 * Math.PI));
      let u = (theta / (2 * Math.PI) + spin) % 1;
      if (u < 0) u += 1;

      const sx = u * sw;
      const slice = Math.max(1, arc * sw);
      // The band dips towards the viewer at the centre by exactly the rim's
      // own ellipse, so print and rim agree they wrap the same solid.
      const dy = e * cosT;

      if (sx + slice <= sw) {
        buf.drawImage(strip.canvas, sx, 0, slice, sh, x, top + dy, overlap, bandH);
      } else {
        // The seam: take what is left of the strip, then the rest from its start.
        const first = sw - sx;
        const ratio = first / slice;
        buf.drawImage(strip.canvas, sx, 0, first, sh, x, top + dy, overlap * ratio, bandH);
        buf.drawImage(
          strip.canvas, 0, 0, slice - first, sh,
          x + overlap * ratio, top + dy, overlap * (1 - ratio), bandH,
        );
      }
    }

    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(this.scratch, 0, 0);
    ctx.restore();
  }

  /** Cylindrical lighting: a key from the upper left, a rim light opposite. */
  private shade(state: CupState): void {
    const ctx = this.ctx;
    const left = CUP.cx - CUP.rTop;
    const right = CUP.cx + CUP.rTop;

    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const g = ctx.createLinearGradient(left, 0, right, 0);
    g.addColorStop(0, "rgba(22,22,26,0.88)");
    g.addColorStop(0.1, "rgba(92,92,100,0.42)");
    g.addColorStop(0.3, "rgba(255,255,255,0)");
    g.addColorStop(0.58, "rgba(140,140,150,0.16)");
    g.addColorStop(0.82, "rgba(66,66,74,0.46)");
    g.addColorStop(1, "rgba(24,24,28,0.8)");
    ctx.fillStyle = g;
    ctx.fillRect(left - 10, CUP.yTop - 40, CUP.rTop * 2 + 20, CUP.yBot - CUP.yTop + 80);
    ctx.restore();

    // Specular band — narrow, and on the same side as the key.
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const s = ctx.createLinearGradient(left, 0, right, 0);
    s.addColorStop(0.14, "rgba(255,255,255,0)");
    s.addColorStop(0.27, "rgba(255,255,255,0.21)");
    s.addColorStop(0.4, "rgba(255,255,255,0)");
    ctx.fillStyle = s;
    ctx.fillRect(left, CUP.yTop - 40, CUP.rTop * 2, CUP.yBot - CUP.yTop + 80);

    // Rim light down the right edge separates the cup from a dark page.
    if (!state.light) {
      const rim = ctx.createLinearGradient(right - 30, 0, right, 0);
      rim.addColorStop(0, "rgba(255,255,255,0)");
      rim.addColorStop(0.72, "rgba(255,255,255,0.16)");
      rim.addColorStop(1, "rgba(255,255,255,0.46)");
      ctx.fillStyle = rim;
      ctx.fillRect(right - 30, CUP.yTop, 30, CUP.yBot - CUP.yTop);
    }

    // Bounce off the table.
    const bounce = ctx.createLinearGradient(0, CUP.yBot - 60, 0, CUP.yBot);
    bounce.addColorStop(0, "rgba(255,255,255,0)");
    bounce.addColorStop(1, "rgba(255,255,255,0.1)");
    ctx.fillStyle = bounce;
    ctx.fillRect(left, CUP.yBot - 60, CUP.rTop * 2, 60);
    ctx.restore();
  }

  /** What the lid was covering. Only drawn once it starts to lift. */
  private mouth(state: CupState): void {
    if (state.lid <= 0.02) return;
    const ctx = this.ctx;
    const e = ellipseFor(CUP.rTop);
    const inner = CUP.rTop - 7;

    ctx.save();
    ctx.globalAlpha = Math.min(1, state.lid * 2.2);

    // The wall's thickness, then the shadowed interior.
    ctx.beginPath();
    ctx.ellipse(CUP.cx, CUP.yTop, CUP.rTop, e, 0, 0, Math.PI * 2);
    ctx.fillStyle = state.blend > 0.5
      ? (state.nextLabel === "kuphub" ? "#0a4322" : "#ded4c3")
      : (state.label === "kuphub" ? "#0a4322" : "#ded4c3");
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(CUP.cx, CUP.yTop + 2, inner, inner * CUP.perspective, 0, 0, Math.PI * 2);
    const cavity = ctx.createRadialGradient(
      CUP.cx - inner * 0.3, CUP.yTop - 4, inner * 0.1,
      CUP.cx, CUP.yTop + 2, inner,
    );
    cavity.addColorStop(0, "#1d1408");
    cavity.addColorStop(1, "#080604");
    ctx.fillStyle = cavity;
    ctx.fill();

    // The drink itself, sitting a little below the rim.
    const drinkR = inner * 0.9;
    ctx.beginPath();
    ctx.ellipse(CUP.cx, CUP.yTop + 12, drinkR, drinkR * CUP.perspective, 0, 0, Math.PI * 2);
    const drink = ctx.createRadialGradient(
      CUP.cx - drinkR * 0.35, CUP.yTop + 8, drinkR * 0.05,
      CUP.cx, CUP.yTop + 12, drinkR,
    );
    drink.addColorStop(0, "#7a4a24");
    drink.addColorStop(0.55, "#4a2a13");
    drink.addColorStop(1, "#2b170a");
    ctx.fillStyle = drink;
    ctx.fill();

    // Crema highlight.
    ctx.beginPath();
    ctx.ellipse(
      CUP.cx - drinkR * 0.3, CUP.yTop + 9,
      drinkR * 0.34, drinkR * CUP.perspective * 0.42,
      -0.25, 0, Math.PI * 2,
    );
    ctx.fillStyle = "rgba(226,178,116,0.3)";
    ctx.fill();
    ctx.restore();
  }

  private steam(state: CupState): void {
    if (state.steam <= 0.01) return;
    const ctx = this.ctx;
    const t = state.time;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";

    for (let i = 0; i < 3; i += 1) {
      const phase = t * 0.55 + i * 2.1;
      const x0 = CUP.cx + (i - 1) * 26;
      const height = 128 + i * 20;
      const sway = 17 + i * 5;

      ctx.beginPath();
      ctx.moveTo(x0, CUP.yTop + 4);
      for (let k = 1; k <= 14; k += 1) {
        const p = k / 14;
        const x = x0 + Math.sin(phase + p * 3.1) * sway * p;
        const y = CUP.yTop + 4 - height * p;
        ctx.lineTo(x, y);
      }
      const g = ctx.createLinearGradient(0, CUP.yTop, 0, CUP.yTop - height);
      const a = state.steam * (0.3 - i * 0.06);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(0.45, `rgba(255,255,255,${a * 0.6})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 7 + i * 2;
      ctx.stroke();
    }
    ctx.restore();
  }

  /** The lid: a rolled rim, a raised dome and a drink hole. */
  private lid(state: CupState): void {
    const ctx = this.ctx;
    const rise = state.lid * 148;
    const tilt = state.lid * 0.13;
    const y = CUP.yTop - rise;
    const r = CUP.rTop + 5;
    const e = ellipseFor(r);

    ctx.save();
    ctx.globalAlpha = 1 - Math.max(0, (state.lid - 0.86) / 0.14);
    ctx.translate(CUP.cx, y);
    ctx.rotate(-tilt);
    ctx.translate(-CUP.cx, -y);

    // Skirt.
    ctx.beginPath();
    ctx.ellipse(CUP.cx, y + 13, r, e, 0, 0, Math.PI);
    ctx.lineTo(CUP.cx - r, y);
    ctx.ellipse(CUP.cx, y, r, e, 0, Math.PI, 0, true);
    ctx.closePath();
    const skirt = ctx.createLinearGradient(CUP.cx - r, 0, CUP.cx + r, 0);
    skirt.addColorStop(0, "#111114");
    skirt.addColorStop(0.28, "#4a4a52");
    skirt.addColorStop(0.55, "#232329");
    skirt.addColorStop(1, "#0c0c0f");
    ctx.fillStyle = skirt;
    ctx.fill();

    // Top plate.
    ctx.beginPath();
    ctx.ellipse(CUP.cx, y, r, e, 0, 0, Math.PI * 2);
    const plate = ctx.createLinearGradient(CUP.cx - r, y - e, CUP.cx + r, y + e);
    plate.addColorStop(0, "#2b2b32");
    plate.addColorStop(0.3, "#55555f");
    plate.addColorStop(0.62, "#26262c");
    plate.addColorStop(1, "#15151a");
    ctx.fillStyle = plate;
    ctx.fill();

    // Raised centre.
    const rr = r * 0.74;
    ctx.beginPath();
    ctx.ellipse(CUP.cx, y - 5, rr, rr * CUP.perspective, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1c1c21";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Drink hole, towards the viewer.
    ctx.beginPath();
    ctx.ellipse(CUP.cx + rr * 0.42, y + 1, 13, 13 * CUP.perspective * 1.5, 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "#050506";
    ctx.fill();

    // Moulded highlight along the rim.
    ctx.beginPath();
    ctx.ellipse(CUP.cx, y, r - 1.5, e - 0.8, 0, Math.PI * 1.08, Math.PI * 1.62);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.restore();
  }
}
