import { ROWS, COLS, VOID, FLOOR, WALL, DOOR } from '../config/constants.js';
import { ROOMS, CORRIDORS, DOORS } from '../data/worldData.js';

// فحص ما إذا كانت الإحداثية داخل حدود الغرفة أم لا
export function inRoom(r, tx, ty) {
  if (r.shape === 'circle') {
    const dx = tx + 0.5 - r.cx, dy = ty + 0.5 - r.cy;
    return dx * dx + dy * dy <= r.r * r.r;
  }
  if (tx < r.x || tx >= r.x + r.w || ty < r.y || ty >= r.y + r.h) return false;
  if (r.shape === 'oct') {
    const dx = Math.min(tx - r.x, r.x + r.w - 1 - tx);
    const dy = Math.min(ty - r.y, r.y + r.h - 1 - ty);
    return dx + dy >= r.cut;
  }
  return true;
}

// بناء مصفوفة العالم (Grid) وتوليد بلاطات الأرضية والحدود للجدران والأبواب
export function buildGrid() {
  const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(VOID));
  const roomGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

  // 1. إضافة أرضيات الغرف
  for (const r of ROOMS) {
    for (let ty = 0; ty < ROWS; ty++) {
      for (let tx = 0; tx < COLS; tx++) {
        if (inRoom(r, tx, ty)) { grid[ty][tx] = FLOOR; roomGrid[ty][tx] = r.id; }
      }
    }
  }
  // 2. إضافة أرضيات الممرات
  for (const c of CORRIDORS) {
    for (let ty = c.y; ty < c.y + c.h; ty++) {
      for (let tx = c.x; tx < c.x + c.w; tx++) { if (grid[ty][tx] === VOID) grid[ty][tx] = FLOOR; }
    }
  }
  // 3. إضافة بلاطات الأبواب
  for (const d of DOORS) {
    for (let ty = d.y; ty < d.y + d.h; ty++) {
      for (let tx = d.x; tx < d.x + d.w; tx++) grid[ty][tx] = DOOR;
    }
  }
  // 4. إيجاد الحواف وتكوين بلاطات الجدران حول الأرضيات
  const walls = [];
  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = 0; tx < COLS; tx++) {
      if (grid[ty][tx] !== VOID) continue;
      let touch = false;
      for (let oy = -1; oy <= 1 && !touch; oy++) {
        for (let ox = -1; ox <= 1; ox++) {
          const ny = ty + oy, nx = tx + ox;
          if (ny < 0 || nx < 0 || ny >= ROWS || nx >= COLS) continue;
          if (grid[ny][nx] === FLOOR || grid[ny][nx] === DOOR) { touch = true; break; }
        }
      }
      if (touch) walls.push([tx, ty]);
    }
  }
  for (const [tx, ty] of walls) grid[ty][tx] = WALL;
  return { grid, roomGrid };
}