from lib import *


def cells(p, x0, y0, x1, y1, cw=5, ch=4):
    """photovoltaic grid inside the rectangle (inclusive)."""
    p.rect(x0, y0, x1, y1, BLUE_LO)
    cx = x0
    j = 0
    while cx + 1 <= x1:
        cx2 = min(cx + cw - 2, x1)
        cy = y0
        i = 0
        while cy + 1 <= y1:
            cy2 = min(cy + ch - 2, y1)
            p.rect(cx, cy, cx2, cy2, BLUE)
            p.hline(cx, cx2, cy, BLUE_HI if (i + j) % 2 == 0 else (46, 98, 176, 255))
            p.px(cx, cy, CY_HI)
            cy += ch
            i += 1
        cx += cw
        j += 1


def panel(w, h, cw, ch, frame=M_WH):
    p = P(w, h)
    p.box(0, 0, w - 1, h - 1, frame)
    cells(p, 3, 3, w - 4, h - 4, cw, ch)
    # glare diagonal
    for i in range(0, min(w, h) - 6, 3):
        p.px(4 + i, h - 5 - i, CY_HI)
    return p


def large_panel():  # 1: 44x32
    p = panel(44, 30, 5, 5)
    p.box(18, 29, 25, 31, M_DG) if False else None
    q = P(44, 33); q.paste(p.im, 0, 0)
    q.box(17, 29, 26, 32, M_DG)
    q.rect(21, 29, 22, 29, ORANGE)
    return q.im


def small_panel():  # 2: 24x18
    p = panel(24, 18, 4, 4)
    q = P(24, 21); q.paste(p.im, 0, 0)
    q.box(9, 17, 14, 20, M_DG)
    return q.im


def array():  # 3: connected array 3 panels 96x34
    q = P(98, 34)
    for i in range(3):
        pp = panel(30, 26, 5, 5)
        q.paste(pp.im, i * 33, 1)
    for i in range(2):
        q.box(30 + i * 33, 11, 33 + i * 33, 15, M_OR)   # inter-panel links
        q.hline(30 + i * 33, 33 + i * 33, 13, OUT)
    q.hline(2, 95, 29, ST_LO)
    q.box(0, 27, 97, 29, M_DG)                       # shared rail
    for x in (14, 47, 80):
        q.box(x, 29, x + 3, 33, M_DG)
    return q.im


def foldable():  # 4: foldable unit 54x30: 3 sections with hinges
    p = P(54, 30)
    # section 1 flat, section 2 flat, section 3 partially folded (narrower & darker)
    for i in range(2):
        x = i * 17
        p.box(x, 1, x + 17, 27, M_WH)
        cells(p, x + 3, 4, x + 14, 24, 4, 5)
    # folded third
    p.box(34, 1, 51, 27, M_WGRAY)
    p.box(36, 3, 44, 25, M_BL)
    p.vline(40, 4, 24, BLUE_LO); p.hline(37, 43, 11, BLUE_LO); p.hline(37, 43, 18, BLUE_LO)
    p.rect(45, 3, 49, 25, BLUE_LO)
    for yy in range(4, 25, 3):
        p.hline(45, 49, yy, ST_HI)
    # hinges
    for hx in (14, 31):
        p.box(hx + 1, 4, hx + 4, 8, M_OR); p.box(hx + 1, 19, hx + 4, 23, M_OR)
        p.rect(hx + 2, 9, hx + 3, 18, ST_LO)
    p.px(2, 2, CY_HI)
    q = P(54, 33); q.paste(p.im, 0, 0)
    q.box(22, 27, 30, 31, M_DG)
    return q.im


def battery_unit():  # 5: 30x30
    p = P(30, 30)
    p.box(1, 3, 28, 28, M_DG)
    p.box(4, 0, 9, 3, M_OR); p.box(20, 0, 25, 3, M_OR)       # terminals
    for i in range(3):
        x = 4 + i * 8
        p.box(x, 7, x + 6, 20, Mat(ORANGE, OR_HI, OR_LO))
        p.hline(x + 1, x + 5, 10, OR_LO)
        p.rect(x + 2, 8, x + 4, 8, WH_HI)
    p.screen(4, 22, 15, 26, "bars")
    p.led(20, 24, CYAN); p.led(24, 24, CYAN)
    return p.im


def big_battery():  # 6: large energy storage battery 46x36
    p = P(46, 36)
    p.box(1, 4, 44, 34, M_WH)
    p.rect(2, 30, 43, 33, WH_LO); p.hline(2, 43, 30, OUT)
    for i in range(6):
        x = 4 + i * 6
        p.box(x, 8, x + 4, 24, M_DG)
        fill = 3 + (i * 3) % 12
        p.rect(x + 1, 23 - fill, x + 3, 23, CYAN if i % 2 == 0 else CY_LO)
        p.hline(x + 1, x + 3, 23 - fill, CY_HI)
    p.box(4, 0, 12, 4, M_OR); p.box(33, 0, 41, 4, M_OR)
    p.stripes(40, 8, 42, 24, ORANGE, OUT, 2)
    p.screen(4, 26, 19, 29, "lines")
    p.led(24, 28, CYAN); p.led(28, 28, ORANGE); p.led(32, 28, WHITE_)
    return p.im


def inverter():  # 7: 30x26
    p = P(30, 26)
    p.box(1, 1, 28, 24, M_ST)
    for xx in range(4, 14, 2):            # cooling fins on left
        p.vline(xx, 3, 21, ST_LO)
    p.fan(21, 8, 5, 5)
    p.screen(15, 16, 26, 21, "graph")
    p.dial(8, 20, 0) if False else None
    p.hline(3, 12, 22, ORANGE)
    p.box(0, 8, 1, 14, M_DG) if False else None
    return p.im


def charge_controller():  # 8: 22x26
    p = P(22, 26)
    p.box(1, 1, 20, 24, M_DG)
    p.screen(4, 3, 17, 9, "lines")
    p.box(4, 12, 9, 17, M_ST)                    # heatsink
    for yy in (13, 15):
        p.hline(5, 8, yy, ST_LO)
    p.disk(15, 14, 3, M_WH)
    p.px(15, 14, OUT)
    p.led(5, 21, CYAN); p.led(10, 21, ORANGE); p.led(15, 21, WHITE_)
    p.px(0, 8, ORANGE); p.px(21, 8, ORANGE)
    return p.im


def dist_cabinet():  # 9: 28x36
    p = P(28, 36)
    p.box(1, 1, 26, 34, M_DG)
    p.vline(13, 3, 32, OUT); p.vline(14, 3, 32, ST_LO)
    p.box(4, 4, 10, 12, M_ST); p.box(17, 4, 23, 12, M_ST)
    p.rect(6, 6, 8, 10, SCR); p.px(7, 8, CYAN)
    # hazard sign
    p.box(16, 16, 23, 24, M_OR)
    p.bolt(20, 20, OUT)
    p.box(11, 22, 12, 27, M_WH) ; p.box(15, 22, 16, 27, M_WH)   # handles
    p.led(6, 30, CYAN); p.led(10, 30, ORANGE)
    p.stripes(18, 29, 24, 31, ORANGE, OUT, 2)
    return p.im


def thick(p, pts, col, lo, hi, w=4):
    for (a, b) in zip(pts, pts[1:]):
        for d in range(-1, w + 1):
            p.line(a[0], a[1] + d, b[0], b[1] + d, OUT)
    for (a, b) in zip(pts, pts[1:]):
        for d in range(0, w):
            p.line(a[0], a[1] + d, b[0], b[1] + d, hi if d == 0 else (lo if d == w - 1 else col))


def cable_segments():  # 10: two separate cable runs, no connectors 40x26
    p = P(40, 26)
    thick(p, [(2, 2), (9, 2), (13, 6), (24, 6), (28, 2), (37, 2)], ORANGE, OR_LO, OR_HI)
    thick(p, [(2, 16), (11, 16), (15, 12), (24, 12), (28, 16), (37, 16)], CYAN, CY_LO, CY_HI)
    for x in (2, 37):
        p.rect(x - 1, 2, x, 5, WH_LO); p.rect(x - 1, 16, x, 19, WH_LO)
    return p.im


def cable_connector():  # 11: plug + socket pair apart 26x16 -> one connector plug, 22x16
    p = P(24, 16)
    p.box(9, 3, 18, 12, M_OR)                      # plug body
    p.box(18, 5, 22, 10, M_ST)                     # sleeve
    p.rect(21, 6, 23, 6, ST_HI) if False else None
    p.box(4, 4, 9, 6, M_ST); p.box(4, 9, 9, 11, M_ST)  # prongs
    p.px(4, 5, ST_HI); p.px(4, 10, ST_HI)
    p.hline(11, 16, 6, OR_HI); p.hline(11, 16, 9, OR_LO)
    p.box(0, 5, 3, 10, M_WH) if False else None
    p.rect(14, 4, 14, 11, OR_LO)
    return p.im


def junction_box():  # 12: 26x24
    p = P(26, 24)
    p.box(2, 3, 23, 22, M_ST)
    p.box(5, 6, 20, 19, M_WH)
    p.bolt(12, 12, ORANGE)
    for (x, y) in ((6, 7), (19, 7), (6, 18), (19, 18)):
        p.px(x, y, ST_LO)
    p.box(8, 0, 11, 3, M_DG); p.box(15, 0, 18, 3, M_DG)    # conduit stubs
    p.box(0, 10, 2, 15, M_DG); p.box(23, 10, 25, 15, M_DG)
    return p.im


def mounting_frame():  # 13: empty structural frame 46x34
    p = P(46, 34)
    p.box(0, 0, 45, 27, M_ST, bevel=False)
    p.rect(3, 3, 42, 24, TRANSPARENT)       # hollow
    # cross members
    for x in (15, 30):
        p.box(x - 1, 3, x + 1, 24, M_ST)
    p.box(3, 12, 42, 14, M_ST)
    # inner outline pass for hollow
    for x in range(2, 44):
        p.px(x, 2, OUT) if p.get(x, 2) == ST else None
    p.rect(3, 3, 14, 11, TRANSPARENT); p.rect(16, 3, 29, 11, TRANSPARENT); p.rect(31, 3, 42, 11, TRANSPARENT)
    p.rect(3, 15, 14, 24, TRANSPARENT); p.rect(16, 15, 29, 24, TRANSPARENT); p.rect(31, 15, 42, 24, TRANSPARENT)
    # redraw hole outlines
    for (a, b, c, d) in ((2, 2, 15, 12), (15, 2, 30, 12), (30, 2, 43, 12), (2, 14, 15, 25), (15, 14, 30, 25), (30, 14, 43, 25)):
        for x in range(a, c + 1):
            p.px(x, b, OUT); p.px(x, d, OUT)
        for y in range(b, d + 1):
            p.px(a, y, OUT); p.px(c, y, OUT)
    p.box(5, 26, 10, 33, M_DG); p.box(35, 26, 40, 33, M_DG)        # legs
    p.px(1, 1, ORANGE); p.px(44, 1, ORANGE); p.px(1, 26, ORANGE); p.px(44, 26, ORANGE)
    for x in (2, 15, 29, 42):
        p.px(x, 1, ST_HI)
    return p.im


def cleaning_brush():  # 14: 16x36 : long handle with broad bristle head
    p = P(16, 36)
    p.box(6, 0, 9, 22, M_OR)                     # handle
    p.hline(7, 8, 3, OR_HI)
    p.box(5, 3, 10, 5, M_DG)                     # grip
    p.box(1, 22, 14, 26, M_ST)                   # head block
    p.rect(2, 26, 13, 34, OUT)
    for x in range(3, 13):                       # bristles
        p.vline(x, 26, 33, WHITE_ if x % 2 else WH_LO)
    p.hline(3, 12, 33, WH_DK)
    p.box(0, 21, 2, 27, M_OR) if False else None
    return p.im


def maintenance_tool():  # 15: diagonal wrench 26x26
    p = P(26, 26)
    for i in range(0, 15):
        p.rect(5 + i - 2, 20 - i - 2, 5 + i + 2, 20 - i + 2, OUT)
    for i in range(0, 15):
        p.rect(5 + i - 1, 20 - i - 1, 5 + i + 1, 20 - i + 1, ORANGE)
        p.px(5 + i - 1, 20 - i - 1, OR_HI); p.px(5 + i + 1, 20 - i + 1, OR_LO)
    p.disk(21, 5, 5, M_ST)
    p.rect(21, 0, 25, 3, TRANSPARENT)
    p.rect(22, 1, 25, 2, TRANSPARENT); p.hline(21, 25, 4, OUT); p.vline(21, 1, 4, OUT)
    p.disk(4, 21, 4, M_ST); p.disk(4, 21, 1, M_DG, shade=False)
    return p.im


def status_indicator():  # 16: 14x24 post w/ stacked lamps
    p = P(14, 24)
    p.box(5, 8, 8, 20, M_DG)
    p.box(1, 20, 12, 23, M_DG)
    for i, c in enumerate((CYAN, ORANGE, WHITE_)):
        y = 0 + i * 4
        p.box(3, y, 10, y + 3, Mat(c, tuple(min(255, v + 60) for v in c[:3]) + (255,), tuple(max(0, v - 60) for v in c[:3]) + (255,)))
    p.hline(5, 6, 1, CY_HI)
    return p.im


EQUIP = [
    ("large_solar_panel", large_panel),
    ("small_solar_panel", small_panel),
    ("connected_solar_panel_array", array),
    ("foldable_solar_panel_unit", foldable),
    ("battery_storage_unit", battery_unit),
    ("large_energy_storage_battery", big_battery),
    ("power_inverter", inverter),
    ("solar_charge_controller", charge_controller),
    ("electrical_distribution_cabinet", dist_cabinet),
    ("electrical_cable_segments", cable_segments),
    ("cable_connectors", cable_connector),
    ("power_junction_box", junction_box),
    ("solar_panel_mounting_frame", mounting_frame),
    ("solar_panel_cleaning_brush", cleaning_brush),
    ("solar_panel_maintenance_tool", maintenance_tool),
    ("small_power_status_indicator", status_indicator),
]
