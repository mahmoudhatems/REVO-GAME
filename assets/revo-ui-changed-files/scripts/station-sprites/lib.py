"""REVO pixel-art mini toolkit: crisp (no anti-alias) primitives with dark outlines."""
import math
from collections import namedtuple
from PIL import Image

Mat = namedtuple("Mat", "base hi lo")


def H(s):
    s = s.lstrip("#")
    return (int(s[0:2], 16), int(s[2:4], 16), int(s[4:6], 16), 255)


# Mandatory palette
ORANGE = H("F28C28")
WHITE_ = H("E8E8E2")
DGRAY = H("343B45")
CYAN = H("36D6E8")
# Supporting shades derived from the palette family
OUT = (24, 32, 66, 255)
OR_HI = (252, 182, 98, 255)
OR_LO = (178, 94, 28, 255)
WH_HI = (252, 252, 248, 255)
WH_LO = (172, 184, 210, 255)
WH_DK = (124, 140, 176, 255)
CY_HI = (172, 244, 250, 255)
CY_LO = (22, 124, 152, 255)
CY_DK = (16, 70, 120, 255)
SCR = (14, 40, 92, 255)
ST = (88, 102, 140, 255)       # steel
ST_HI = (140, 158, 198, 255)
ST_LO = (58, 68, 106, 255)
DG_LO = (34, 42, 74, 255)
BLUE = (30, 70, 140, 255)
BLUE_HI = (62, 128, 214, 255)
BLUE_LO = (20, 44, 98, 255)
WATER = (46, 168, 214, 255)
WATER_HI = (126, 228, 244, 255)

M_WH = Mat(WHITE_, WH_HI, WH_LO)
M_OR = Mat(ORANGE, OR_HI, OR_LO)
M_DG = Mat((54, 64, 102, 255), (96, 112, 156, 255), DG_LO)
M_ST = Mat(ST, ST_HI, ST_LO)
M_CY = Mat(CYAN, CY_HI, CY_LO)
M_BL = Mat(BLUE, BLUE_HI, BLUE_LO)
M_WGRAY = Mat(WH_LO, WHITE_, WH_DK)

TRANSPARENT = (0, 0, 0, 0)


class P:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.im = Image.new("RGBA", (w, h), TRANSPARENT)
        self.px_ = self.im.load()

    def px(self, x, y, c):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px_[x, y] = c

    def get(self, x, y):
        if 0 <= x < self.w and 0 <= y < self.h:
            return self.px_[x, y]
        return TRANSPARENT

    def rect(self, x0, y0, x1, y1, c):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.px(x, y, c)

    def hline(self, x0, x1, y, c):
        for x in range(x0, x1 + 1):
            self.px(x, y, c)

    def vline(self, x, y0, y1, c):
        for y in range(y0, y1 + 1):
            self.px(x, y, c)

    def line(self, x0, y0, x1, y1, c):
        dx, dy = abs(x1 - x0), abs(y1 - y0)
        sx = 1 if x0 < x1 else -1
        sy = 1 if y0 < y1 else -1
        err = dx - dy
        while True:
            self.px(x0, y0, c)
            if x0 == x1 and y0 == y1:
                break
            e2 = 2 * err
            if e2 > -dy:
                err -= dy
                x0 += sx
            if e2 < dx:
                err += dx
                y0 += sy

    # ---- solid shapes -------------------------------------------------
    def box(self, x0, y0, x1, y1, m=M_WH, out=OUT, bevel=True):
        self.rect(x0, y0, x1, y1, out)
        if x1 - x0 < 2 or y1 - y0 < 2:
            return
        self.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, m.base)
        if x1 - x0 >= 15 and y1 - y0 >= 13:
            for (cx_, cy_, dx_, dy_) in ((x0, y0, 1, 1), (x1, y0, -1, 1), (x0, y1, 1, -1), (x1, y1, -1, -1)):
                self.px(cx_, cy_, TRANSPARENT)
                self.px(cx_ + dx_, cy_, out); self.px(cx_, cy_ + dy_, out)
                self.px(cx_ + dx_, cy_ + dy_, m.hi if dx_ + dy_ == 2 else m.base)
        if bevel and x1 - x0 >= 4 and y1 - y0 >= 4:
            self.hline(x0 + 2, x1 - 2, y0 + 1, m.hi)
            self.vline(x0 + 1, y0 + 1, y1 - 1, m.hi)
            self.hline(x0 + 1, x1 - 1, y1 - 1, m.lo)
            self.vline(x1 - 1, y0 + 1, y1 - 1, m.lo)

    def rbox(self, x0, y0, x1, y1, m=M_WH, out=OUT):
        """box with clipped corners."""
        self.box(x0, y0, x1, y1, m, out)
        for (x, y) in ((x0, y0), (x1, y0), (x0, y1), (x1, y1)):
            self.px(x, y, TRANSPARENT)
        for (x, y, dx, dy) in ((x0 + 1, y0 + 1, 1, 1), (x1 - 1, y0 + 1, -1, 1),
                               (x0 + 1, y1 - 1, 1, -1), (x1 - 1, y1 - 1, -1, -1)):
            self.px(x, y, out)

    def ellipse(self, cx, cy, rx, ry, m=M_WH, out=OUT, shade=True):
        pts = set()
        for y in range(int(cy - ry - 1), int(cy + ry + 2)):
            for x in range(int(cx - rx - 1), int(cx + rx + 2)):
                d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
                if d <= 1.0:
                    pts.add((x, y))
        for (x, y) in pts:
            edge = any((x + a, y + b) not in pts for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            if edge:
                self.px(x, y, out)
                continue
            c = m.base
            if shade:
                t = (x - cx) / rx + (y - cy) / ry
                if t < -0.85:
                    c = m.hi
                elif t > 0.85:
                    c = m.lo
            self.px(x, y, c)

    def disk(self, cx, cy, r, m=M_WH, out=OUT, shade=True):
        self.ellipse(cx, cy, r, r, m, out, shade)

    def stripes(self, x0, y0, x1, y1, c1=ORANGE, c2=OUT, w=2):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                self.px(x, y, c1 if ((x + y) // w) % 2 == 0 else c2)

    # ---- device widgets -----------------------------------------------
    def screen(self, x0, y0, x1, y1, kind="lines", col=CYAN, col2=None):
        self.rect(x0, y0, x1, y1, OUT)
        self.rect(x0 + 1, y0 + 1, x1 - 1, y1 - 1, SCR)
        ix0, iy0, ix1, iy1 = x0 + 1, y0 + 1, x1 - 1, y1 - 1
        w, h = ix1 - ix0 + 1, iy1 - iy0 + 1
        col2 = col2 or CY_LO
        if kind == "lines":
            for i, yy in enumerate(range(iy0 + 1, iy1, 2)):
                ln = max(2, w - 2 - (i * 3) % max(3, w // 2))
                self.hline(ix0 + 1, ix0 + ln, yy, col if i % 2 == 0 else col2)
        elif kind == "graph":
            pts = []
            for i in range(w - 2):
                v = 0.5 + 0.38 * math.sin(i * 0.9) * (1 - i / (w * 1.4))
                pts.append((ix0 + 1 + i, iy1 - 1 - int(v * (h - 2))))
            for (a, b) in zip(pts, pts[1:]):
                self.line(a[0], a[1], b[0], b[1], col)
            self.hline(ix0 + 1, ix1 - 1, iy1, col2)
        elif kind == "bars":
            n = max(2, (w - 1) // 3)
            for i in range(n):
                bh = 2 + (i * 5 + 3) % max(2, h - 3)
                self.rect(ix0 + 1 + i * 3, iy1 - bh, ix0 + 2 + i * 3, iy1, col if i % 2 == 0 else col2)
        elif kind == "ring":
            cx, cy = (ix0 + ix1) // 2, (iy0 + iy1) // 2
            r = min(w, h) // 2 - 1
            for a in range(0, 360, 12):
                self.px(int(cx + r * math.cos(math.radians(a)) + 0.5),
                        int(cy + r * math.sin(math.radians(a)) + 0.5), col)
            self.px(cx, cy, col2)
        elif kind == "drop":
            cx = (ix0 + ix1) // 2
            cy = (iy0 + iy1) // 2
            for dy, ww in ((-2, 0), (-1, 1), (0, 1), (1, 2), (2, 2), (3, 1)):
                self.hline(cx - ww, cx + ww, cy + dy, col)
            self.px(cx - 1, cy + 1, CY_HI)
        elif kind == "heat":
            for i in range(w - 2):
                v = 0.25 + 0.5 * (i / (w - 2)) ** 1.3
                self.px(ix0 + 1 + i, iy1 - 1 - int(v * (h - 3)), ORANGE)
                self.px(ix0 + 1 + i, iy1 - 2 - int(v * (h - 3)), OR_HI)
            self.hline(ix0 + 1, ix1 - 1, iy1, col2)
        # glare
        self.px(ix0, iy0, CY_HI if kind != "heat" else OR_HI)

    def led(self, x, y, c=CYAN):
        self.px(x, y, c)
        self.px(x, y - 1, tuple(min(255, v + 70) for v in c[:3]) + (255,))

    def dial(self, cx, cy, r, ang=-40, zone=None, face=WHITE_):
        self.disk(cx, cy, r, M_ST, shade=False)
        self.disk(cx, cy, r - 1, Mat(face, WH_HI, WH_LO), out=ST_LO, shade=False)
        for a in range(-210, 31, 40):
            ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
            rr = r - 2
            self.px(int(cx + rr * ca + 0.5), int(cy + rr * sa + 0.5), OUT)
        if zone:
            for a in range(-60, 31, 15):
                ca, sa = math.cos(math.radians(a)), math.sin(math.radians(a))
                rr = r - 2
                self.px(int(cx + rr * ca + 0.5), int(cy + rr * sa + 0.5), zone)
        ex = cx + int((r - 2) * math.cos(math.radians(ang)) + 0.5)
        ey = cy + int((r - 2) * math.sin(math.radians(ang)) + 0.5)
        self.line(cx, cy, ex, ey, ORANGE)
        self.px(cx, cy, OUT)

    def fan(self, cx, cy, r, blades=6, swirl=0.6, hub=ORANGE):
        self.disk(cx, cy, r, Mat(DG_LO, ST_LO, OUT), shade=False)
        for y in range(cy - r, cy + r + 1):
            for x in range(cx - r + 1, cx + r):
                dx, dy = x - cx, y - cy
                d = math.hypot(dx, dy)
                if d > r - 1.2 or d < 1.5:
                    continue
                a = math.atan2(dy, dx) / (2 * math.pi)
                v = (a * blades + swirl * d / r * 1.6) % 1.0
                if v < 0.55:
                    self.px(x, y, ST_HI if v < 0.2 else ST)
        self.disk(cx, cy, max(1, r // 4), Mat(hub, OR_HI, OR_LO), shade=False)

    def bolt(self, cx, cy, c=ORANGE, big=1):
        pts = [(1, -3), (0, -1), (1, -1), (-1, 3), (0, 0), (-1, 0)]
        self.px(cx + 1, cy - 3, c); self.px(cx, cy - 2, c); self.px(cx, cy - 1, c)
        self.px(cx + 1, cy - 1, c); self.px(cx, cy, c); self.px(cx - 1, cy + 1, c)
        self.px(cx - 1, cy + 2, c); self.px(cx - 1, cy, c)

    def screw(self, x, y):
        self.px(x, y, ST_HI)

    def paste(self, img, x, y):
        self.im.alpha_composite(img, (x, y))
        self.px_ = self.im.load()


def rot(img, k):
    """rotate by k*90 degrees counter-clockwise, no resampling."""
    ops = {0: None, 1: Image.ROTATE_90, 2: Image.ROTATE_180, 3: Image.ROTATE_270}
    return img if k % 4 == 0 else img.transpose(ops[k % 4])


def pipe_h(p, x0, x1, yc, th=6, m=M_ST, flange=(0,), flange_m=M_OR):
    """horizontal pipe with cylindrical shading and optional flange offsets (fraction positions)."""
    y0, y1 = yc - th // 2, yc - th // 2 + th - 1
    p.rect(x0, y0, x1, y1, OUT)
    p.rect(x0, y0 + 1, x1, y1 - 1, m.base)
    p.hline(x0, x1, y0 + 1, m.hi)
    p.hline(x0, x1, y1 - 1, m.lo)
    return y0, y1


def flange_v(p, x, yc, th, m=M_OR, w=3, extra=2):
    y0, y1 = yc - th // 2 - extra, yc - th // 2 + th - 1 + extra
    p.box(x, y0, x + w - 1, y1, m)


def curve(p, cx, cy, r_out, r_in, quad, m=M_ST):
    """quarter ring centred at (cx,cy). quad: 0=top-right 1=top-left 2=bottom-left 3=bottom-right"""
    sx = {0: 1, 1: -1, 2: -1, 3: 1}[quad]
    sy = {0: -1, 1: -1, 2: 1, 3: 1}[quad]
    pts = {}
    for y in range(cy - r_out - 1, cy + r_out + 2):
        for x in range(cx - r_out - 1, cx + r_out + 2):
            if (x - cx) * sx < 0 or (y - cy) * sy < 0:
                continue
            d = math.hypot(x - cx + (0.5 * sx), y - cy + (0.5 * sy))
            if r_in <= d <= r_out:
                pts[(x, y)] = (d - r_in) / (r_out - r_in)
    for (x, y), t in pts.items():
        edge = any((x + a, y + b) not in pts for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1))) and \
            not ((x - cx) * sx == 0 or (y - cy) * sy == 0 and False)
        c = m.base
        if t < 0.3:
            c = m.lo
        elif 0.45 < t < 0.7:
            c = m.hi
        # keep open ends un-outlined only at the straight cut (outlined too for clean sprites)
        p.px(x, y, OUT if edge else c)


def contact_sheet(sprites, scale=5, cols=8, pad=6, bg=(70, 76, 90, 255)):
    cw = max(s.width for s in sprites) + pad
    ch = max(s.height for s in sprites) + pad
    rows = (len(sprites) + cols - 1) // cols
    sheet = Image.new("RGBA", (cols * cw, rows * ch), bg)
    for i, s in enumerate(sprites):
        r, c = divmod(i, cols)
        sheet.alpha_composite(s, (c * cw + pad // 2, r * ch + pad // 2))
    return sheet.resize((sheet.width * scale, sheet.height * scale), Image.NEAREST)
