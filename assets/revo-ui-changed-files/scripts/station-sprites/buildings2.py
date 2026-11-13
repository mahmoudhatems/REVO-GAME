import math
from lib import *
from solar import cells

GROUND = Mat((98, 110, 148, 255), (126, 140, 180, 255), (72, 84, 120, 255))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3)) + (255,)


def pad(p, x0, y0, x1, y1):
    p.rbox(x0, y0, x1, y1, GROUND)
    for x in range(x0 + 6, x1 - 4, 10):
        p.px(x, y1 - 3, ST)


def cyl(p, cx, ytop, ybot, rx, m=M_WH, ry=None, cap=None):
    """3/4 vertical cylinder: body from ytop..ybot (ellipse centres), dome-flat cap on top."""
    ry = ry or max(3, rx // 3)
    pts = {}
    for y in range(ytop - ry, ybot + ry + 1):
        for x in range(cx - rx, cx + rx + 1):
            dx = (x - cx) / rx
            e = ry * math.sqrt(max(0, 1 - dx * dx))
            if ytop - e <= y <= ybot + e:
                pts[(x, y)] = dx
    for (x, y), dx in pts.items():
        edge = any((x + a, y + b) not in pts for a, b in ((1, 0), (-1, 0), (0, 1), (0, -1)))
        if edge:
            p.px(x, y, OUT)
        else:
            c = m.hi if dx < -0.55 else (m.lo if dx > 0.5 else m.base)
            if dx < -0.8:
                c = m.hi
            p.px(x, y, c)
    # top cap ellipse
    c = cap or m
    p.ellipse(cx, ytop, rx, ry, Mat(c.hi, c.hi, c.base), shade=False)
    return ry


def band(p, cx, y, rx, ry, c1, c2=None, h=2):
    """curved horizontal band wrapping the cylinder at centre-line y."""
    for x in range(cx - rx + 1, cx + rx):
        dx = (x - cx) / rx
        yy = y + int(ry * math.sqrt(max(0, 1 - dx * dx)) + .5)
        for k in range(h):
            p.px(x, yy + k, c1 if k == 0 else (c2 or c1))


def arch_door(p, cx, ybot, w=15, h=24):
    x0, x1 = cx - w // 2, cx + w // 2
    ytop = ybot - h
    for y in range(ytop, ybot + 1):
        for x in range(x0 - 2, x1 + 3):
            dx = (x - cx) / (w / 2 + 2)
            top = ytop + int((w / 2 + 2) * (1 - math.sqrt(max(0, 1 - dx * dx))))
            if y >= top:
                edge = (x == x0 - 2 or x == x1 + 2 or y == top)
                p.px(x, y, OUT if edge else ORANGE)
    for y in range(ytop + 2, ybot + 1):
        for x in range(x0, x1 + 1):
            dx = (x - cx) / (w / 2)
            top = ytop + 2 + int((w / 2) * (1 - math.sqrt(max(0, 1 - dx * dx))))
            if y >= top:
                p.px(x, y, SCR if (x + y) % 5 else CY_DK)
    p.vline(cx, ytop + 5, ybot, OUT)
    for x in range(x0 + 1, x1):
        p.px(x, ytop + 4, CYAN)
    p.px(x0 + 1, ytop + 5, CY_HI)


def window(p, x, y, w=7, h=5):
    p.box(x, y, x + w, y + h, M_ST)
    p.rect(x + 1, y + 1, x + w - 1, y + h - 1, CY_LO)
    p.hline(x + 1, x + w - 1, y + 1, CYAN)
    p.px(x + 1, y + 1, CY_HI)


def hull(p, x0, y0, x1, y1, door_x=None, windows=(), trim=True, roof_h=10):
    """rounded 3/4 module: roof slab + front wall."""
    p.rbox(x0, y0, x1, y1, M_WH)
    ry = y0 + roof_h
    p.hline(x0 + 1, x1 - 1, ry, WH_DK)
    p.rect(x0 + 1, ry + 1, x1 - 1, y1 - 1, WHITE_)
    p.hline(x0 + 1, x1 - 1, ry + 1, WH_HI)
    p.rect(x0 + 1, y1 - 5, x1 - 1, y1 - 1, WH_LO)
    p.vline(x1 - 2, ry + 1, y1 - 1, WH_LO); p.vline(x1 - 1, ry + 1, y1 - 1, WH_DK)
    if trim:
        p.rect(x0 + 2, y0 + 2, x1 - 2, y0 + 4, ORANGE)
        p.hline(x0 + 2, x1 - 2, y0 + 2, OR_HI)
        p.hline(x0 + 2, x1 - 2, y0 + 4, OR_LO)
        p.rect(x0 + 2, ry - 1, x1 - 2, ry, ORANGE)
    for w in windows:
        window(p, w, ry + 5)
    if door_x is not None:
        arch_door(p, door_x, y1)
    return ry


def pipe(p, pts, th=3, m=M_ST):
    for (a, b) in zip(pts, pts[1:]):
        if a[1] == b[1]:
            x0, x1 = sorted((a[0], b[0]))
            p.rect(x0 - 1, a[1] - th // 2 - 1, x1 + 1, a[1] + th // 2 + 1, OUT)
        else:
            y0, y1 = sorted((a[1], b[1]))
            p.rect(a[0] - th // 2 - 1, y0 - 1, a[0] + th // 2 + 1, y1 + 1, OUT)
    for (a, b) in zip(pts, pts[1:]):
        if a[1] == b[1]:
            x0, x1 = sorted((a[0], b[0]))
            p.rect(x0, a[1] - th // 2, x1, a[1] + th // 2, m.base)
            p.hline(x0, x1, a[1] - th // 2, m.hi)
        else:
            y0, y1 = sorted((a[1], b[1]))
            p.rect(a[0] - th // 2, y0, a[0] + th // 2, y1, m.base)
            p.vline(a[0] - th // 2, y0, y1, m.hi)


def dome(p, cx, cy, r):
    """glass dome on roof."""
    p.disk(cx, cy, r, M_ST)
    p.disk(cx, cy, r - 2, Mat(CY_LO, CYAN, CY_DK))
    for a in range(0, 180, 45):
        for rr in range(1, r - 2):
            p.px(int(cx + rr * math.cos(math.radians(a))), int(cy - rr * math.sin(math.radians(a)) * 0.9), CY_DK)
    p.px(cx - r // 2, cy - r // 2, CY_HI); p.px(cx - r // 2 + 1, cy - r // 2, CY_HI)


def para(p, x, y, w, h, skew, rows=3, cols=5):
    """3/4-perspective solar panel (parallelogram) with PV cells."""
    for r in range(h):
        off = int(skew * (1 - r / (h - 1)))
        for c in range(w):
            xx, yy = x + off + c, y + r
            edge = (r in (0, h - 1)) or (c in (0, w - 1))
            p.px(xx, yy, OUT if edge else BLUE)
    for r in range(2, h - 2):
        off = int(skew * (1 - r / (h - 1)))
        for c in range(2, w - 2):
            xx, yy = x + off + c, y + r
            if (c - 2) % 5 == 4 or (r - 2) % 5 == 4:
                p.px(xx, yy, BLUE_LO)
            elif (c + r) % 7 == 0:
                p.px(xx, yy, BLUE_HI)
    p.hline(x + int(skew) + 2, x + int(skew) + w - 3, y + 1, WH_LO)
    p.hline(x + 2, x + w - 3, y + h - 2, WH_LO)


def water_station():
    p = P(168, 132)
    pad(p, 2, 62, 165, 130)
    # filtration stacks (left)
    for i, cx in enumerate((16, 31)):
        cyl(p, cx, 78, 108, 8, M_CY)
        band(p, cx, 90, 8, 3, ORANGE)
        p.px(cx - 4, 96, CY_HI)
    pipe(p, [(16, 70), (31, 70)], 3)
    cyl(p, 46, 86, 108, 6, M_ST)
    # main module (rounded domed)
    ry = hull(p, 56, 62, 112, 124, door_x=84, windows=(62, 98), roof_h=14)
    dome(p, 84, 80, 12)
    p.box(62, 82, 72, 90, M_ST) if False else None
    # antenna
    p.vline(98, 44, 62, OUT); p.vline(99, 44, 62, ST); p.box(95, 40, 102, 46, M_OR)
    p.px(97, 42, CY_HI)
    # storage tanks right (tall, differing sizes)
    cyl(p, 136, 34, 100, 18, M_WH)
    band(p, 136, 48, 18, 6, ORANGE, OR_LO, 3)
    band(p, 136, 88, 18, 6, ORANGE, OR_LO, 3)
    for k in range(3):
        window(p, 126 + k * 4, 64 + k * 0, 2, 4) if False else None
    p.rect(132, 62, 140, 74, SCR); p.hline(133, 139, 66, CYAN); p.hline(133, 139, 70, CY_LO)
    cyl(p, 150, 90, 114, 11, M_ST)
    band(p, 150, 100, 11, 4, CYAN, CY_LO, 2)
    pipe(p, [(112, 100), (118, 100), (118, 106), (139, 106)], 4)
    pipe(p, [(112, 72), (118, 72)], 3)
    pipe(p, [(6, 126), (160, 126)], 3)
    for x in (30, 80, 130):
        p.box(x, 123, x + 2, 129, M_OR)
    return p.im


def solar_station():
    p = P(168, 132)
    pad(p, 2, 56, 165, 130)
    ry = hull(p, 8, 50, 70, 124, door_x=36, windows=(14, 56), roof_h=14)
    # roof gear: battery bank + solar strip
    p.box(14, 64 - 12, 38, 64, M_DG) if False else None
    p.rect(14, 56, 62, 58, WH_DK)
    para(p, 14, 40, 26, 10, 4)
    para(p, 42, 40, 26, 10, 4)
    # antenna mast
    p.vline(36, 22, 50, OUT); p.vline(37, 22, 50, ST)
    p.box(31, 18, 42, 24, M_OR); p.px(34, 20, CY_HI)
    # electrical cabinet + transformer
    p.box(74, 86, 90, 124, M_DG)
    p.box(76, 90, 88, 100, M_ST); p.rect(78, 92, 86, 98, SCR); p.hline(79, 85, 95, CYAN)
    p.box(76, 104, 88, 118, M_OR); p.bolt(82, 111, OUT)
    cyl(p, 100, 92, 118, 8, M_DG)
    band(p, 100, 100, 8, 3, ORANGE)
    # solar array: two rows of tilted panels on rails
    for r in range(3):
        for c in range(2):
            para(p, 106 + c * 27, 60 + r * 20, 24, 15, 7)
    for r in range(3):
        pass
    pipe(p, [(70, 120), (150, 120)], 3, M_DG)
    pipe(p, [(90, 100), (96, 100)], 3, M_DG)
    return p.im


def oxygen_station():
    p = P(168, 132)
    pad(p, 2, 56, 165, 130)
    # oxygen cylinder bank (left, external)
    for i, cx in enumerate((14, 30)):
        for j, y in enumerate((70, 96)):
            cyl(p, cx, y, y + 14, 6, M_CY)
            band(p, cx, y + 6, 6, 2, WHITE_, WH_LO, 2)
            p.box(cx - 2, y - 7, cx + 2, y - 4, M_OR) if False else None
    p.rect(8, 106, 38, 110, OUT); p.stripes(9, 107, 37, 109, ORANGE, OUT, 2)
    pipe(p, [(14, 62), (30, 62), (30, 66)], 3, M_CY)
    # main module
    ry = hull(p, 48, 56, 112, 124, door_x=80, windows=(54, 100), roof_h=16)
    p.box(56, 62, 72, 72, M_ST); p.fan(64, 67, 4, 5)
    p.box(88, 62, 104, 72, M_ST); p.fan(96, 67, 4, 5)
    # ventilation stack / thermal tower
    cyl(p, 80, 30, 52, 12, M_ST)
    band(p, 80, 38, 12, 4, ORANGE, OR_LO, 3)
    p.rect(76, 42, 84, 48, (150, 50, 16, 255)); p.rect(77, 43, 83, 47, ORANGE)
    # heating plant (right)
    p.box(120, 70, 160, 112, M_DG)
    p.rect(124, 76, 156, 92, OUT); p.rect(125, 77, 155, 91, (120, 40, 16, 255))
    for i in range(6):
        p.rect(127 + i * 5, 78, 130 + i * 5, 90, ORANGE); p.hline(127 + i * 5, 130 + i * 5, 78, OR_HI)
    p.box(124, 96, 156, 108, M_WH); p.screen(126, 98, 154, 106, "heat")
    cyl(p, 148, 40, 62, 8, M_OR) if False else None
    p.box(130, 56, 146, 70, M_WH)
    p.stripes(132, 62, 144, 68, ORANGE, WHITE_, 3)
    pipe(p, [(112, 96), (120, 96)], 4, M_ST)
    pipe(p, [(38, 100), (48, 100)], 4, M_CY)
    pipe(p, [(6, 126), (160, 126)], 3, M_CY)
    for x in (30, 80, 130):
        p.box(x, 123, x + 2, 129, M_WH)
    return p.im
