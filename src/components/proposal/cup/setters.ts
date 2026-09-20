/**
 * Per-frame writers for the small chips that fade and pop around the cups.
 *
 * Deliberately not `gsap.quickSetter(el, "scale")`.
 *
 * GSAP's CSS harness aliases `scale` to the pair `"scaleX,scaleY"`, and
 * `quickSetter` resolves that alias *before* it looks for a setter. There is no
 * style property by that name, so it falls through to the attribute setter and
 * calls `setAttribute("scaleX,scaleY", …)` — which is not a legal attribute
 * name, so WebKit throws `InvalidCharacterError` on every scroll frame. That is
 * what took the proposal page down in Safari and on iOS while Chromium shrugged
 * it off. `quickSetter` is fine for `opacity`, `x` and `y`, which each resolve
 * to a single property; it is only the compound aliases it cannot express.
 *
 * Writing the two values straight onto the element sidesteps the alias table
 * entirely, and is if anything cheaper than the setter it replaces.
 */
export type Pop = (opacity: number, scale: number) => void;

export function popSetter(el: HTMLElement): Pop {
  const style = el.style;
  return (opacity, scale) => {
    style.opacity = String(opacity);
    style.transform = `scale(${scale})`;
  };
}
