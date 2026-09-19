/**
 * The cup, described once.
 *
 * Everything is authored in a fixed design space (DESIGN.w × DESIGN.h) and the
 * canvas is scaled to fit, so every constant below stays meaningful whether the
 * cup is rendered at 320px on a phone or 900px on a boardroom screen.
 *
 * The cup is a frustum: a circle of radius `rTop` at `yTop` tapering to `rBot`
 * at `yBot`. Because the camera sits slightly above it, every horizontal circle
 * projects to an ellipse whose semi-minor axis is `PERSPECTIVE` of its radius —
 * that one ratio is what makes the rim, the base and the printed bands all
 * agree that they are wrapped around the same solid.
 */

export const DESIGN = { w: 430, h: 620 } as const;

export const CUP = {
  cx: 215,
  /**
   * The cup sits low in the design space on purpose: everything above the rim
   * is headroom the lid and the steam need, and they are the only things that
   * ever use it.
   */
  yTop: 208,
  rTop: 134,
  yBot: 566,
  rBot: 93,
  /** Semi-minor axis of every projected circle, as a fraction of its radius. */
  perspective: 0.24,
  /**
   * How far the walls bow out between the two planes, in design px. A moulded
   * cup is not a cone — but it is very nearly one, and anything more than a
   * couple of pixels here reads as a barrel.
   */
  bow: 2.5,
  /**
   * The printed band, as a fraction of the way down the body. Near enough the
   * whole wall: IML print goes into the mould, so it runs the full height
   * rather than sitting in a label window.
   */
  bandTop: 0.015,
  bandBottom: 0.985,
} as const;

/** Radius of the cup's cross-section at a given y in design space. */
export function radiusAt(y: number): number {
  const t = (y - CUP.yTop) / (CUP.yBot - CUP.yTop);
  return CUP.rTop + (CUP.rBot - CUP.rTop) * Math.min(1, Math.max(0, t));
}

/** Semi-minor axis of the ellipse a circle of this radius projects to. */
export function ellipseFor(radius: number): number {
  return radius * CUP.perspective;
}

/** Absolute y of the printed band's top and bottom edges. */
export function bandBounds(): { top: number; bottom: number } {
  const h = CUP.yBot - CUP.yTop;
  return {
    top: CUP.yTop + h * CUP.bandTop,
    bottom: CUP.yTop + h * CUP.bandBottom,
  };
}

/**
 * The cup's silhouette, as a path on the given context.
 *
 * Drawn as: down the left side, around the front of the base, up the right
 * side, then back along the *front* of the rim — so the shape encloses exactly
 * the part of the body a viewer can see, and can be used as a clip for the
 * print without the print spilling over the rim.
 */
export function bodyPath(path: Path2D): void {
  const { cx, yTop, yBot, rTop, rBot, bow } = CUP;
  const eTop = ellipseFor(rTop);
  const eBot = ellipseFor(rBot);

  path.moveTo(cx - rTop, yTop);
  // Left wall — a shallow outward bow reads as a moulded cup rather than a cone.
  path.bezierCurveTo(
    cx - rTop - bow,
    yTop + (yBot - yTop) * 0.4,
    cx - rBot - bow * 0.6,
    yTop + (yBot - yTop) * 0.76,
    cx - rBot,
    yBot,
  );
  // Front of the base.
  path.ellipse(cx, yBot, rBot, eBot, 0, Math.PI, 0, true);
  // Right wall, back up.
  path.bezierCurveTo(
    cx + rBot + bow * 0.6,
    yTop + (yBot - yTop) * 0.76,
    cx + rTop + bow,
    yTop + (yBot - yTop) * 0.4,
    cx + rTop,
    yTop,
  );
  // Front of the rim closes the shape.
  path.ellipse(cx, yTop, rTop, eTop, 0, 0, Math.PI, false);
  path.closePath();
}

/** The silhouette as a reusable Path2D. */
export function bodyShape(): Path2D {
  const p = new Path2D();
  bodyPath(p);
  return p;
}
