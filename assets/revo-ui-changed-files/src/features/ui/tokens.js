// REVO UI design tokens. Core palette from the project brief; extra colors are functional UI states only.
export const COLORS = Object.freeze({
  orange: 0xf28c28, white: 0xe8e8e2, dgray: 0x343b45, cyan: 0x36d6e8,
  space: 0x101827, panel: 0x182438, surface: 0x24344a,
  success: 0x55d68b, warning: 0xf2c14e, danger: 0xf15b5b, muted: 0x8493a8,
  orangeHi: 0xffae5c, orangeLo: 0xb5611a, cyanLo: 0x1c7f8c, black: 0x000000
});

export const css = (n) => '#' + n.toString(16).padStart(6, '0');

export const STATE_COLOR = Object.freeze({
  ok: COLORS.success, info: COLORS.cyan, success: COLORS.success, warning: COLORS.warning,
  critical: COLORS.danger, nodata: COLORS.muted, sim: COLORS.cyan, nasa: COLORS.cyan,
  fiction: COLORS.orange, placeholder: COLORS.warning
});

export const FONT = Object.freeze({
  heading: 'Courier New, monospace', body: 'Courier New, monospace', arabic: 'Tahoma, Arial, sans-serif'
});

// Type scale (px). Scenes pick a scale factor for small screens.
export const SIZE = Object.freeze({ xs: 10, sm: 12, md: 14, lg: 18, xl: 24, xxl: 34 });
export const SPACE = Object.freeze({ xs: 4, sm: 8, md: 12, lg: 16, xl: 24 });
export const BORDER = 3;

export const DEPTH = Object.freeze({ panel: 10, modal: 1000, tooltip: 2000 });

// Scale helper: phones get slightly larger touch targets, small screens slightly smaller text blocks.
export function uiScale(w, h) {
  const s = Math.min(w / 960, h / 600);
  return Math.max(0.75, Math.min(1.25, s));
}
