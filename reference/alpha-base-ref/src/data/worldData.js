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

// ==========================================================
// المباني (صور من assets/Buildings/). الأسماء بالأبعاد زي ما هي في الفولدر.
// tx, ty = مكان "قاعدة" المبنى بالبلاطات (tile). scale = التكبير.
// عدّل الأرقام دي براحتك لتحريك أي مبنى أو تغيير حجمه.
// ==========================================================
export const BUILDINGS_PATH = 'assets/Buildings/';

export const BUILDINGS = [
  // key        file                         غرفة         tx    ty    scale
  { key: 'building_1', file: 'Building_001_100x77.png', room: 'central',    tx: 24,   ty: 14,   scale: 1.4 }, // وحدة القيادة
  { key: 'building_2', file: 'Building_002_65x72.png',  room: 'life',       tx: 38,   ty: 7.2, scale: 1.6 }, // برج الاتصالات
  { key: 'building_3', file: 'Building_003_73x72.png',  room: 'greenhouse', tx: 9.5,  ty: 22,  scale: 1.6 }, // قبة الدفيئة
  { key: 'building_4', file: 'Building_004_76x67.png',  room: 'power',      tx: 16,   ty: 5,   scale: 1.6 }, // المولدات والبطاريات
  { key: 'building_5', file: 'Building_005_83x77.png',  room: 'radiation',  tx: 36.5, ty: 23,  scale: 1.6 }, // ملجأ الإشعاع
  { key: 'building_6', file: 'Building_006_69x73.png',  room: 'life',       tx: 31.5, ty: 5.5, scale: 1.6 }, // خزانات المياه والأكسجين
  { key: 'building_7', file: 'Building_007_83x69.png',  room: 'power',      tx: 10,   ty: 6,   scale: 1.6 }  // محطة الألواح الشمسية
];


// ==========================================================
// بلاطات الأرضية (assets/Floor_Tiles/) — بلاطة لكل غرفة، وبلاطة للممرات.
// غيّر رقم الـ floor_N في أي غرفة عشان تغيّر شكل أرضيتها (1 لـ 12).
// ==========================================================
export const FLOOR_PATH = 'assets/Floor_Tiles/';
export const FLOOR_FILES = [
  'Floor_001_60x64.png', 'Floor_002_61x64.png', 'Floor_003_61x64.png', 'Floor_004_60x64.png',
  'Floor_005_60x60.png', 'Floor_006_61x60.png', 'Floor_007_61x60.png', 'Floor_008_60x60.png',
  'Floor_009_60x62.png', 'Floor_010_61x62.png', 'Floor_011_61x62.png', 'Floor_012_60x62.png'
]; // المفتاح: floor_1 ... floor_12

export const ROOM_FLOOR = {
  power: 'floor_6',       // دوائر سيان (طاقة)
  life: 'floor_2',        // ألواح معدن
  greenhouse: 'floor_10', // زجاجي فاتح
  radiation: 'floor_3',   // معدن بمسامير
  central: 'floor_1',     // لوح داكن سادة
  airlock: 'floor_4',     // خطوط تحذير برتقالي
  corridor: 'floor_11'    // الممرات
};

// ==========================================================
// الأبواب (assets/Doors_Walls/)
//  h = باب أفقي (فتحة 2×1 بلاطة) | v = باب رأسي (1×2) | airlock = باب الـ Airlock
// ==========================================================
export const DOORS_PATH = 'assets/Doors_Walls/';
export const DOOR_SPRITES = {
  door_h:       'Door_003_69x33.png',
  door_v:       'Door_011_36x55.png',
  door_airlock: 'Door_010_81x35.png'
};