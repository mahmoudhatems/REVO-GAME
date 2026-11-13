from lib import *


def o2_generator():  # 1: 32x34
    p = P(32, 34)
    p.box(1, 6, 30, 32, M_WH)
    p.rect(2, 28, 29, 31, WH_LO); p.hline(2, 29, 28, OUT)
    p.disk(16, 16, 8, M_ST)
    p.disk(16, 16, 6, Mat(SCR, CY_DK, SCR), shade=False)
    for (x, y) in ((13, 18), (16, 14), (18, 19), (15, 21), (19, 15)):
        p.px(x, y, CY_HI)
    p.px(14, 15, CYAN); p.px(17, 17, CYAN)
    p.box(4, 0, 8, 7, M_ST); p.box(23, 0, 27, 7, M_ST)           # electrode ports
    p.box(3, 4, 9, 6, M_OR); p.box(22, 4, 28, 6, M_OR)
    p.led(5, 25, CYAN); p.led(26, 25, ORANGE)
    return p.im


def o2_machine():  # 2: main production machine 50x42
    p = P(50, 42)
    p.box(1, 14, 48, 40, M_DG)
    p.rect(2, 36, 47, 39, ST_LO); p.hline(2, 47, 36, OUT)
    p.box(5, 3, 17, 15, M_WH); p.box(32, 3, 44, 15, M_WH)         # twin reactor drums
    p.box(8, 0, 14, 3, M_OR); p.box(35, 0, 41, 3, M_OR)
    p.rect(8, 6, 14, 12, SCR); p.hline(9, 13, 9, CYAN); p.hline(9, 13, 11, CY_LO)
    p.rect(35, 6, 41, 12, SCR); p.hline(36, 40, 9, CYAN); p.hline(36, 40, 11, CY_LO)
    p.box(17, 6, 32, 10, M_ST); p.hline(18, 31, 8, ST_LO)          # crossover pipe
    p.box(19, 17, 30, 31, M_WH)
    p.screen(21, 19, 28, 25, "ring")
    p.disk(24, 29, 1, M_OR, shade=False)
    p.stripes(4, 20, 15, 22, ORANGE, OUT, 2); p.stripes(34, 20, 45, 22, ORANGE, OUT, 2)
    for yy in (25, 28, 31):
        p.hline(4, 15, yy, ST_LO); p.hline(34, 45, yy, ST_LO)
    p.led(5, 36, CYAN); p.led(10, 36, CYAN); p.led(40, 36, ORANGE)
    p.box(0, 24, 2, 30, M_ST); p.box(47, 24, 49, 30, M_ST)
    return p.im


def cylinder_v(p, x, y, w=10, h=28, body=None):
    body = body or Mat(CYAN, CY_HI, CY_LO)
    p.box(x + w // 2 - 1, y, x + w // 2 + 1, y + 3, M_OR)       # valve
    p.box(x + w // 2 - 3, y + 3, x + w // 2 + 3, y + 5, M_ST)   # neck collar
    p.rbox(x, y + 5, x + w - 1, y + h - 1, body)
    p.hline(x + 1, x + w - 2, y + 10, WH_HI)
    p.hline(x + 1, x + w - 2, y + 11, WH_LO)
    p.vline(x + 2, y + 13, y + h - 4, CY_HI)


def o2_cylinder():  # 3: 14x32
    p = P(14, 32)
    cylinder_v(p, 2, 1, 10, 30)
    return p.im


def cylinder_rack():  # 4: 4 cylinders in a frame 48x36
    p = P(48, 36)
    p.box(0, 30, 47, 35, M_DG)                       # base
    for i in range(4):
        cylinder_v(p, 3 + i * 11, 0, 9, 31)
    p.box(0, 14, 47, 16, M_ST)                       # restraint strap rail
    p.box(0, 24, 47, 26, M_ST)
    p.box(0, 8, 2, 35, M_DG); p.box(45, 8, 47, 35, M_DG)
    p.px(1, 15, ORANGE); p.px(46, 15, ORANGE); p.px(1, 25, ORANGE); p.px(46, 25, ORANGE)
    return p.im


def distribution_unit():  # 5: 38x30 with five outlets
    p = P(38, 30)
    p.box(1, 4, 36, 28, M_WH)
    p.rect(2, 24, 35, 27, WH_LO); p.hline(2, 35, 24, OUT)
    p.box(4, 6, 33, 10, M_CY)                        # cyan header
    for i in range(5):
        x = 4 + i * 6
        p.box(x, 0, x + 3, 6, M_ST); p.box(x - 1, 0, x + 4, 1, M_OR)
        p.rect(x + 1, 2, x + 2, 4, OUT)
    p.screen(5, 13, 16, 21, "bars")
    p.disk(24, 17, 3, M_OR); p.px(24, 17, OUT)
    p.led(30, 15, CYAN); p.led(30, 20, ORANGE)
    return p.im


def space_heater():  # 6: 32x32 glowing core
    p = P(32, 32)
    p.box(1, 2, 30, 30, M_DG)
    p.rect(5, 6, 26, 21, OUT)
    p.rect(6, 7, 25, 20, (120, 40, 14, 255))
    for i in range(4):  # coil
        x = 7 + i * 5
        p.rect(x, 8, x + 3, 19, ORANGE)
        p.hline(x, x + 3, 8, OR_HI); p.hline(x, x + 3, 19, OR_LO)
        p.px(x + 1, 12, WH_HI); p.px(x + 2, 15, WH_HI)
    for xx in range(5, 27, 2):                      # grille bars
        p.vline(xx, 6, 21, OUT)
    p.stripes(4, 24, 27, 26, ORANGE, OUT, 2)
    p.led(6, 28, ORANGE); p.led(25, 28, CYAN)
    return p.im


def thermal_regulator():  # 7: 38x34 exchanger plates + fans
    p = P(38, 34)
    p.box(1, 3, 36, 32, M_WH)
    p.box(4, 6, 17, 20, M_ST)
    for xx in range(6, 16, 2):
        p.vline(xx, 7, 19, ST_LO)
    p.rect(5, 7, 16, 8, CYAN)                        # cold side
    p.box(20, 6, 33, 20, M_ST)
    for xx in range(22, 32, 2):
        p.vline(xx, 7, 19, OR_LO)
    p.rect(21, 7, 32, 8, ORANGE)                     # hot side
    p.box(16, 11, 21, 14, M_DG)                      # link pipe
    p.fan(10, 27, 4, 4); p.fan(27, 27, 4, 4, hub=CYAN)
    p.dial(18, 26, 0) if False else None
    p.led(18, 24, CYAN); p.led(18, 29, ORANGE)
    p.box(0, 0, 37, 2, M_OR) if False else None
    return p.im


def heating_panel():  # 8: 26x30
    p = P(26, 30)
    p.box(1, 1, 24, 28, M_DG)
    p.screen(4, 4, 21, 11, "heat")
    p.disk(8, 19, 5, M_OR)
    p.px(8, 19, OUT)
    for a in range(-150, 31, 45):
        p.px(int(8 + 6.5 * math.cos(math.radians(a)) + .5), int(19 + 6.5 * math.sin(math.radians(a)) + .5), WH_HI)
    p.box(16, 15, 21, 17, M_WH); p.box(16, 20, 21, 22, M_ST)
    p.led(5, 26, ORANGE); p.led(11, 26, CYAN); p.led(17, 26, WHITE_)
    return p.im


def vent_fan():  # 9: 30x30
    p = P(30, 30)
    p.box(0, 0, 29, 29, M_WH)
    p.fan(15, 15, 12, 6, 0.9)
    for (x, y) in ((2, 2), (27, 2), (2, 27), (27, 27)):
        p.px(x, y, ORANGE)
    return p.im


def air_unit():  # 10: 42x30 duct body
    p = P(42, 30)
    p.box(7, 6, 34, 28, M_WH)
    p.rect(8, 22, 33, 27, WH_LO); p.hline(8, 33, 22, OUT)
    p.box(0, 8, 8, 16, M_ST)                          # left duct
    p.box(33, 2, 41, 10, M_ST); p.box(36, 0, 41, 12, M_ST)       # right duct goes up
    for xx in (2, 5):
        p.vline(xx, 9, 15, ST_LO)
    p.fan(20, 15, 8, 5)
    for yy in range(8, 21, 3):
        p.hline(28, 32, yy, ST_LO)
    p.box(7, 6, 34, 8, M_OR)
    p.led(12, 25, CYAN); p.led(28, 25, ORANGE)
    return p.im


def o2_pipe():  # 11: 34x10
    p = P(34, 10)
    pipe_h(p, 3, 30, 5, 6, M_CY)
    p.hline(4, 29, 3, CY_HI)
    for x in (9, 22):
        p.box(x, 1, x + 2, 8, M_WH)
    p.box(0, 0, 3, 9, M_WH); p.box(30, 0, 33, 9, M_WH)
    return p.im


def insulated_pipe():  # 12: 34x14 thick wrapped
    p = P(34, 14)
    p.box(0, 1, 33, 12, M_OR)
    p.stripes(2, 3, 31, 10, ORANGE, WHITE_, 2)
    p.hline(2, 31, 3, OR_HI); p.hline(2, 31, 10, OR_LO)
    p.box(0, 0, 3, 13, M_DG); p.box(30, 0, 33, 13, M_DG)
    p.box(14, 0, 17, 13, M_ST)
    return p.im


def heat_cable():  # 13: serpentine anti-freeze cable 34x18
    p = P(34, 18)
    pts = [(2, 3), (28, 3), (28, 9), (5, 9), (5, 15), (31, 15)]
    for (a, b) in zip(pts, pts[1:]):
        for d in (-1, 0, 1, 2, 3):
            p.line(a[0], a[1] + d, b[0], b[1] + d, OUT) if a[1] == b[1] else None
            p.line(a[0] + d, a[1], b[0] + d, b[1], OUT) if a[0] == b[0] else None
    for (a, b) in zip(pts, pts[1:]):
        for d in (0, 1, 2):
            if a[1] == b[1]:
                p.line(a[0], a[1] + d, b[0], b[1] + d, DGRAY if d != 1 else DG_LO)
            else:
                p.line(a[0] + d, a[1], b[0] + d, b[1], DGRAY if d != 1 else DG_LO)
    for x in range(4, 28, 4):                        # heating nodes
        p.px(x, 4, ORANGE); p.px(x + 1, 4, OR_HI)
    for x in range(8, 31, 4):
        p.px(x, 16, ORANGE); p.px(x + 1, 16, OR_HI)
    for x in range(7, 26, 4):
        p.px(x, 10, ORANGE)
    p.box(0, 1, 2, 5, M_OR); p.box(29, 13, 33, 17, M_OR)
    return p.im


def pipe_connector():  # 14: union coupling 30x22
    p = P(30, 22)
    p.box(0, 7, 5, 14, M_ST); p.box(24, 7, 29, 14, M_ST)           # pipe stubs
    p.box(5, 4, 9, 17, M_WH); p.box(20, 4, 24, 17, M_WH)           # hex nuts
    p.box(9, 8, 20, 13, M_CY)
    p.box(11, 2, 18, 19, M_OR)                                     # clamp collar
    p.hline(12, 17, 5, OR_HI); p.hline(12, 17, 16, OR_LO)
    p.px(14, 10, OUT); p.px(15, 10, OUT) if False else None
    p.rect(13, 9, 16, 11, OR_LO)
    p.px(14, 10, WH_HI)
    return p.im


def flow_valve():  # 15: 26x30 with lever
    p = P(26, 30)
    p.box(0, 17, 25, 26, M_CY)
    p.box(0, 15, 3, 28, M_WH); p.box(22, 15, 25, 28, M_WH)
    p.box(8, 12, 17, 27, M_DG)
    p.box(11, 8, 14, 12, M_ST)
    p.box(2, 3, 23, 6, M_OR)                         # T lever
    p.box(10, 3, 15, 10, M_OR)
    p.px(4, 4, OR_HI)
    p.hline(10, 15, 20, CYAN)
    return p.im


def o2_gauge():  # 16: 22x28
    p = P(22, 28)
    p.dial(11, 10, 9, -80, zone=ORANGE)
    for a in (-170, -150, -130):
        p.px(int(11 + 6.5 * math.cos(math.radians(a)) + .5), int(10 + 6.5 * math.sin(math.radians(a)) + .5), CYAN)
    p.box(9, 19, 12, 23, M_ST)
    p.box(7, 23, 14, 27, M_CY)
    return p.im


def o2_screen():  # 17: standing monitor 30x28
    p = P(30, 28)
    p.box(1, 1, 28, 19, M_DG)
    p.screen(4, 4, 25, 16, "bars")
    p.disk(21, 10, 0, M_CY) if False else None
    p.box(12, 19, 17, 23, M_ST)
    p.box(7, 23, 22, 26, M_DG)
    p.led(5, 18, CYAN); p.led(24, 18, WHITE_)
    return p.im


def temp_sensor():  # 18: 14x28 probe post
    p = P(14, 28)
    p.box(3, 0, 10, 8, M_WH)
    p.led(7, 4, CYAN) if False else None
    p.rect(5, 2, 8, 5, SCR); p.px(6, 3, ORANGE); p.px(7, 3, OR_HI)
    p.box(6, 8, 7, 18, M_ST)
    p.rect(5, 18, 8, 19, OUT)
    p.disk(7, 22, 3, M_OR)
    p.px(6, 21, WH_HI)
    p.box(1, 25, 12, 27, M_DG)
    return p.im


def temp_console():  # 19: 36x28
    p = P(36, 28)
    p.box(1, 2, 34, 26, M_WH)
    p.rect(2, 22, 33, 25, WH_LO); p.hline(2, 33, 22, OUT)
    p.screen(4, 5, 22, 18, "heat")
    p.screen(25, 5, 31, 11, "lines", col=ORANGE, col2=OR_LO)
    p.box(25, 14, 27, 16, M_OR); p.box(29, 14, 31, 16, M_ST)
    for i in range(4):
        p.box(5 + i * 5, 23, 8 + i * 5, 25, M_DG) if False else None
    p.led(8, 24, ORANGE); p.led(14, 24, CYAN); p.led(20, 24, ORANGE)
    p.box(0, 10, 1, 16, M_OR) if False else None
    return p.im


def emergency_heater():  # 20: 32x34
    p = P(32, 34)
    p.box(1, 4, 30, 32, M_OR)
    p.stripes(3, 27, 28, 30, ORANGE, OUT, 2)
    p.box(5, 8, 26, 21, M_DG)
    for i in range(3):
        p.rect(7, 10 + i * 4, 24, 11 + i * 4, ORANGE)
        p.hline(8, 22, 10 + i * 4, OR_HI)
    p.box(8, 0, 23, 4, M_ST)                         # carry handle
    p.rect(11, 1, 20, 2, OUT)
    p.disk(25, 24, 2, M_WH) if False else None
    p.disk(7, 24, 2, Mat(WHITE_, WH_HI, WH_LO), shade=False)
    p.led(14, 24, CYAN); p.led(18, 24, ORANGE)
    return p.im


EQUIP = [
    ("oxygen_generator", o2_generator),
    ("main_oxygen_production_machine", o2_machine),
    ("oxygen_storage_cylinder", o2_cylinder),
    ("multiple_oxygen_cylinder_rack", cylinder_rack),
    ("oxygen_distribution_unit", distribution_unit),
    ("space_heating_unit", space_heater),
    ("thermal_regulation_machine", thermal_regulator),
    ("heating_control_panel", heating_panel),
    ("ventilation_fan", vent_fan),
    ("air_circulation_unit", air_unit),
    ("oxygen_pipe_segments", o2_pipe),
    ("insulated_pipes", insulated_pipe),
    ("anti_freeze_heating_cable", heat_cable),
    ("pipe_connectors", pipe_connector),
    ("oxygen_flow_valve", flow_valve),
    ("oxygen_pressure_gauge", o2_gauge),
    ("oxygen_monitoring_screen", o2_screen),
    ("temperature_sensor", temp_sensor),
    ("temperature_monitoring_console", temp_console),
    ("emergency_heating_module", emergency_heater),
]
