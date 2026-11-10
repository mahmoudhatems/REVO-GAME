// مصفوفة الغرف وتحديد أشكالها وإحداثياتها وألوان أرضيتها
export const ROOMS = [
  { id: 'power',      name: 'POWER STATION',     shape: 'oct',    x: 7,  y: 1,  w: 14, h: 9,  cut: 3, tint: 0x3d3350 },
  { id: 'life',       name: 'LIFE SUPPORT',      shape: 'oct',    x: 27, y: 1,  w: 14, h: 9,  cut: 3, tint: 0x2f4357 },
  { id: 'greenhouse', name: 'GREENHOUSE',        shape: 'oct',    x: 6,  y: 15, w: 12, h: 11, cut: 3, tint: 0x2f4a3a },
  { id: 'radiation',  name: 'RADIATION SHELTER', shape: 'oct',    x: 30, y: 15, w: 12, h: 11, cut: 3, tint: 0x4a4630 },
  { id: 'central',    name: 'CENTRAL HABITAT',   shape: 'circle', cx: 24, cy: 15, r: 5.5,       tint: 0x34425a },
  { id: 'airlock',    name: 'AIRLOCK',           shape: 'rect',   x: 21, y: 25, w: 6,  h: 5,  tint: 0x4a3a2e }
];

// إحداثيات الممرات الرابطة بين الغرف
export const CORRIDORS = [
  { x: 21, y: 5,  w: 6, h: 2 }, { x: 23, y: 7,  w: 2, h: 4 },
  { x: 12, y: 10, w: 2, h: 5 }, { x: 34, y: 10, w: 2, h: 5 },
  { x: 17, y: 18, w: 5, h: 2 }, { x: 26, y: 18, w: 5, h: 2 },
  { x: 23, y: 20, w: 2, h: 5 }
];

// إحداثيات ما بين الأبواب
export const DOORS = [
  { x: 21, y: 5,  w: 1, h: 2 }, { x: 26, y: 5,  w: 1, h: 2 }, { x: 23, y: 10, w: 2, h: 1 },
  { x: 12, y: 10, w: 2, h: 1 }, { x: 12, y: 14, w: 2, h: 1 }, { x: 34, y: 10, w: 2, h: 1 },
  { x: 34, y: 14, w: 2, h: 1 }, { x: 18, y: 18, w: 1, h: 2 }, { x: 20, y: 18, w: 1, h: 2 },
  { x: 29, y: 18, w: 1, h: 2 }, { x: 27, y: 18, w: 1, h: 2 }, { x: 23, y: 20, w: 2, h: 1 },
  { x: 23, y: 25, w: 2, h: 1 }
];

// خريطة سريعة للوصول للغرفة عبر معرّفها (ID)
export const roomById = Object.fromEntries(ROOMS.map(r => [r.id, r]));