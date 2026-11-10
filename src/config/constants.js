// مسارات اللوجو المحتملة داخل مجلد الأصول
export const LOGO_CANDIDATES = [
  'assets/logo.png',
  'assets/logo . png',
  'assets/logo.png'
];

// المصادر المتاحة لفيديو المقدمة بحسب التنسيق
export const INTRO_SOURCES = [
  ['assets/intro.mp4', 'video/mp4'],
  ['assets/intro.webm', 'video/webm'],
  ['assets/intro.mov', 'video/quicktime'],
  ['assets/intro', '']
];

// مسار صورة الشخصية (Spritesheet)
export const CHARACTER_SHEET = 'assets/revo.png';

// أنواع الخطوط المستخدمة في القوائم والنصوص العربية
export const UI_FONT = 'Courier New, monospace';
export const AR_FONT = 'Tahoma, Arial, sans-serif';

// أبعاد الشبكة والعالم (32x32 للبلاطة الواحدة)
export const TILE = 32;
export const COLS = 48;
export const ROWS = 32;
export const WORLD_W = COLS * TILE; // 1536
export const WORLD_H = ROWS * TILE; // 1024

// رموز أنواع البلاطات في مصفوفة الشبكة
export const VOID = 0;   // الفراغ
export const FLOOR = 1;  // الأرضية
export const WALL = 2;   // الجدار
export const DOOR = 3;   // الباب