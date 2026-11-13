from lib import *


def recycler():  # 1 Closed-loop water recycler 40x36
    p = P(40, 36)
    p.box(2, 8, 37, 33, M_WH)
    p.rect(3, 29, 36, 32, WH_LO); p.hline(3, 36, 29, OUT)               # front lip
    p.rect(2, 8, 37, 9, OUT); p.hline(3, 36, 9, OR_HI); p.rect(3, 10, 36, 11, ORANGE)  # orange roof trim
    # recirculation ring on top
    p.disk(20, 20, 9, M_ST)
    p.disk(20, 20, 6, Mat(SCR, CY_DK, SCR), shade=False)
    for a in range(0, 360, 30):
        p.px(int(20 + 4.2 * math.cos(math.radians(a)) + .5), int(20 + 4.2 * math.sin(math.radians(a)) + .5), CYAN if a % 60 == 0 else CY_LO)
    p.px(20, 20, CY_HI)
    for a in (0, 90, 180, 270):  # ring bolts
        p.px(int(20 + 8 * math.cos(math.radians(a)) + .5), int(20 + 8 * math.sin(math.radians(a)) + .5), ORANGE)
    # loop pipes out of the ring to side tanks
    p.box(4, 17, 10, 23, M_ST); p.box(29, 17, 35, 23, M_ST)
    p.rect(5, 19, 9, 21, CY_LO); p.rect(30, 19, 34, 21, CY_LO)
    # top return pipe loop
    p.box(9, 2, 30, 7, M_ST)
    p.rect(10, 4, 29, 5, CY_LO); p.hline(10, 29, 4, CYAN)
    p.box(9, 2, 12, 9, M_OR); p.box(27, 2, 30, 9, M_OR)
    p.screen(6, 25, 14, 30, "graph"); p.led(30, 27, CYAN); p.led(33, 27, ORANGE)
    p.screen(24, 25, 29, 30, "bars")
    return p.im


def filtration():  # 2 Water filtration machine 36x32
    p = P(36, 32)
    p.box(1, 10, 34, 30, M_DG)
    p.rect(2, 26, 33, 29, ST_LO); p.hline(2, 33, 26, OUT)
    # three filter canisters
    for i, cx in enumerate((8, 18, 28)):
        p.disk(cx, 9, 6, M_WH)
        p.disk(cx, 9, 3, Mat(CY_LO, CYAN, CY_DK), shade=False)
        p.px(cx - 1, 8, CY_HI)
        p.rect(cx - 1, 15, cx + 1, 17, ORANGE)
    # intake pipe left, hopper top right
    p.box(0, 18, 4, 23, M_ST); p.box(31, 18, 35, 23, M_ST)
    p.hline(1, 3, 20, CY_LO)
    # vent grilles
    for yy in range(19, 25, 2):
        p.hline(8, 27, yy, OUT)
    p.hline(8, 27, 20, ST_LO)
    p.screen(12, 27, 23, 29, "bars") if False else None
    p.led(6, 28, CYAN); p.led(29, 28, ORANGE)
    return p.im


def tank_primary():  # 3 Primary water storage tank 44x44
    p = P(44, 44)
    p.disk(22, 22, 21, M_WH)
    p.disk(22, 22, 17, Mat(WH_LO, WHITE_, WH_DK), shade=False)
    p.disk(22, 22, 16, Mat(WHITE_, WH_HI, WH_LO))
    # orange bands
    for r in (13,):
        for a in range(0, 360, 2):
            p.px(int(22 + r * math.cos(math.radians(a)) + .5), int(22 + r * math.sin(math.radians(a)) + .5), ORANGE)
            p.px(int(22 + (r - 1) * math.cos(math.radians(a)) + .5), int(22 + (r - 1) * math.sin(math.radians(a)) + .5), OR_LO)
    # centre hatch w/ cyan level window
    p.disk(22, 22, 8, M_ST)
    p.disk(22, 22, 5, Mat(CYAN, CY_HI, CY_LO))
    p.px(20, 20, CY_HI); p.px(21, 20, CY_HI)
    # radial seams
    for a in range(22, 360, 45):
        for r in range(9, 16):
            p.px(int(22 + r * math.cos(math.radians(a)) + .5), int(22 + r * math.sin(math.radians(a)) + .5), WH_DK if r % 2 else WH_LO)
    # rim bolts
    for a in range(20, 360, 40):
        p.px(int(22 + 19 * math.cos(math.radians(a)) + .5), int(22 + 19 * math.sin(math.radians(a)) + .5), ORANGE)
    # inlet pipe stub
    p.box(33, 36, 41, 41, M_ST); p.box(38, 35, 41, 42, M_OR)
    return p.im


def tank_secondary():  # 4 Secondary tank 30x30 (smaller, gray/cyan version)
    p = P(30, 30)
    p.disk(15, 15, 13, M_ST)
    p.disk(15, 15, 11, Mat(ST_HI, WH_LO, ST))
    p.disk(15, 15, 9, Mat(WH_LO, WHITE_, WH_DK))
    p.disk(15, 15, 5, Mat(ORANGE, OR_HI, OR_LO))
    p.disk(15, 15, 2, Mat(CYAN, CY_HI, CY_LO), shade=False)
    for a in range(0, 360, 60):
        for r in range(6, 10):
            p.px(int(15 + r * math.cos(math.radians(a)) + .5), int(15 + r * math.sin(math.radians(a)) + .5), WH_DK)
    p.box(22, 23, 28, 27, M_ST); p.box(26, 22, 28, 28, M_OR)
    return p.im


def cartridge():  # 5 Purification filter cartridge 14x30 (removable)
    p = P(14, 30)
    p.box(5, 0, 8, 3, M_OR)                # carrying handle cap
    p.box(3, 3, 10, 5, M_ST)               # collar
    p.box(2, 5, 11, 25, M_WH)
    for yy in range(8, 23, 2):             # pleats
        p.hline(3, 10, yy, CY_LO); p.hline(3, 10, yy + 1, CYAN if yy % 4 == 0 else CY_HI)
    p.box(2, 25, 11, 28, M_OR)
    p.px(4, 27, OR_HI)
    p.vline(11, 6, 24, WH_LO)
    return p.im


def pump():  # 6 Water pump 32x28 : motor + volute
    p = P(32, 28)
    p.box(1, 8, 17, 22, M_DG)                       # motor body
    for xx in range(4, 16, 3):
        p.vline(xx, 10, 20, DG_LO)                  # cooling fins
    p.box(0, 11, 2, 19, M_ST)
    p.disk(24, 15, 8, M_OR)                         # volute housing
    p.disk(24, 15, 4, Mat(ST, ST_HI, ST_LO))
    p.px(24, 15, OUT)
    p.box(17, 12, 19, 18, M_ST)                     # coupling
    p.box(20, 1, 27, 6, M_ST); p.box(21, 0, 26, 2, M_OR)   # discharge up
    p.box(28, 12, 31, 18, M_ST)                     # inlet flange
    p.led(6, 24, CYAN)
    p.box(2, 22, 16, 25, ST_LO and M_DG)            # base skid
    return p.im


def dist_pump():  # 7 Water distribution pump 34x30
    p = P(34, 30)
    p.box(5, 7, 28, 25, M_WH)
    p.hline(6, 27, 8, ORANGE); p.hline(6, 27, 9, OR_LO)
    p.disk(16, 17, 6, M_ST)
    p.disk(16, 17, 3, Mat(CYAN, CY_HI, CY_LO), shade=False)
    # twin outlets
    p.box(0, 11, 5, 15, M_ST); p.box(0, 19, 5, 23, M_ST)
    p.box(28, 11, 33, 15, M_ST); p.box(28, 19, 33, 23, M_ST)
    p.box(3, 10, 5, 16, M_OR); p.box(3, 18, 5, 24, M_OR)
    p.box(28, 10, 30, 16, M_OR); p.box(28, 18, 30, 24, M_OR)
    p.box(22, 12, 26, 14, M_DG); p.led(24, 22, CYAN)
    p.box(9, 2, 24, 7, M_ST)                        # manifold on top
    p.hline(10, 23, 4, ST_LO)
    return p.im


def pipe_straight():  # 8 Straight segment 32x10
    p = P(32, 10)
    pipe_h(p, 3, 28, 5, 6, M_ST)
    p.rect(4, 3, 27, 3, ST_HI)
    p.box(0, 0, 3, 9, M_OR); p.box(28, 0, 31, 9, M_OR)
    p.px(1, 2, OUT); p.px(1, 7, OUT); p.px(30, 2, OUT); p.px(30, 7, OUT)
    p.box(14, 1, 17, 8, M_WH)                       # coupling ring
    return p.im


def pipe_curved():  # 9 Curved segment 26x26 (smooth quarter bend)
    p = P(26, 26)
    # bend centre at bottom-left (0,25); arc from left-top end (x 0..?) to bottom-right end
    curve(p, 0, 25, 24, 16, 0, M_ST)
    # ends: top end near (0..7,1) pointing up, right end at x~23..25 pointing right
    p.box(0, 0, 3, 11, M_OR)
    p.box(14, 22, 25, 25, M_OR)
    return p.im


def elbow():  # 10 Pipe elbow connector 22x22 (hard 90 deg w/ bolted hub)
    p = P(22, 22)
    p.box(3, 7, 17, 16, M_ST)          # horizontal arm (left to corner)
    p.box(9, 3, 18, 17, M_ST)          # vertical arm (corner up)
    p.box(9, 7, 18, 16, M_ST)          # hub overlap
    p.rect(4, 10, 10, 10, ST_HI); p.rect(12, 4, 12, 9, ST_HI)
    p.box(0, 5, 3, 18, M_OR)           # flange left
    p.box(7, 0, 20, 3, M_OR)           # flange top
    p.disk(14, 12, 2, M_WH, shade=False)
    p.px(14, 12, OUT)
    return p.im


def junction():  # 11 Pipe junction (T) 30x28
    p = P(30, 28)
    p.box(0, 8, 29, 17, M_ST)          # run
    p.box(10, 14, 19, 27, M_ST)        # branch down
    p.box(10, 8, 19, 17, M_ST)         # hub
    p.rect(1, 11, 28, 11, ST_HI); p.rect(14, 18, 14, 25, ST_HI)
    p.box(0, 6, 3, 19, M_OR); p.box(26, 6, 29, 19, M_OR)
    p.box(8, 24, 21, 27, M_OR)
    p.disk(14, 12, 3, M_WH, shade=False); p.px(14, 12, OUT)
    return p.im


def manual_valve():  # 12 Manual water valve 24x28
    p = P(24, 28)
    p.box(0, 16, 23, 25, M_ST)
    p.box(0, 14, 3, 27, M_OR); p.box(20, 14, 23, 27, M_OR)
    p.box(8, 11, 15, 25, M_DG)                       # valve body
    p.box(10, 7, 13, 11, M_ST)                       # stem
    # handwheel: ring with spokes
    p.disk(12, 4, 4, M_OR) if False else None
    p.disk(12, 4, 4, Mat(ORANGE, OR_HI, OR_LO))
    p.disk(12, 4, 2, Mat(DG_LO, ST_LO, OUT), shade=False)
    p.hline(7, 17, 4, OR_LO); p.vline(12, 0, 8, OR_LO)
    p.px(12, 4, ST_HI)
    p.hline(9, 14, 19, CY_LO)
    return p.im


def gauge():  # 13 Water pressure gauge 22x28
    p = P(22, 28)
    p.dial(11, 10, 9, -50, zone=CYAN)
    p.box(9, 19, 12, 23, M_ST)
    p.box(7, 23, 14, 27, M_OR)
    p.px(11, 14, ORANGE)
    p.hline(6, 8, 15, CY_LO)
    return p.im


def wq_console():  # 14 Water quality monitoring console 34x30
    p = P(34, 30)
    p.box(1, 3, 32, 27, M_DG)
    p.rect(2, 22, 31, 26, ST_LO); p.hline(2, 31, 22, OUT)
    p.screen(4, 6, 20, 19, "graph")
    p.screen(23, 6, 29, 12, "drop")
    for i, c in enumerate((CYAN, CY_LO, ORANGE)):
        p.box(23 + i * 3, 14, 25 + i * 3, 16, Mat(c, c, c))
    for i in range(5):
        p.box(5 + i * 5, 23, 8 + i * 5, 25, M_WH if i != 4 else M_OR)
    p.hline(4, 20, 20, ST_HI)
    return p.im


def leak_detector():  # 15 Water leak detector 16x22
    p = P(16, 22)
    p.box(2, 0, 13, 11, M_WH)
    p.led(7, 4, ORANGE); p.px(9, 3, CY_HI)
    p.rect(4, 7, 11, 9, SCR); p.hline(5, 10, 8, CYAN)
    p.box(7, 11, 8, 17, M_ST)                                  # probe
    for i, yy in enumerate((18, 19)):
        p.hline(5 + i, 10 - i, yy, OUT)
    p.rect(6, 17, 9, 20, OUT); p.rect(7, 18, 8, 19, WATER_HI)
    p.hline(3, 12, 6, WH_LO)
    return p.im


def collection_container():  # 16 Water collection container 26x26
    p = P(26, 26)
    p.box(2, 4, 23, 24, M_WH)
    p.rect(3, 20, 22, 23, WH_LO); p.hline(3, 22, 20, OUT)
    p.ellipse(13, 11, 9, 6, M_ST)                     # open top rim
    p.ellipse(13, 11, 7, 4, Mat(WATER, WATER_HI, CY_LO))
    p.px(10, 10, CY_HI); p.px(11, 9, CY_HI); p.px(15, 12, CY_LO)
    p.box(0, 9, 3, 15, M_OR); p.box(22, 9, 25, 15, M_OR)      # handles
    return p.im


def wastewater():  # 17 Wastewater processing unit 46x38
    p = P(46, 38)
    p.box(1, 12, 44, 36, M_DG)
    p.rect(2, 32, 43, 35, ST_LO); p.hline(2, 43, 32, OUT)
    # two settling clarifier discs with sweeping arms
    for cx in (12, 28):
        p.disk(cx, 14, 10, M_WH)
        p.disk(cx, 14, 8, Mat((52, 118, 168, 255), (90, 170, 214, 255), (34, 80, 130, 255)))
        p.line(cx, 14, cx + 6, 9, ST_HI); p.line(cx, 14, cx - 6, 19, ST_HI)
        p.disk(cx, 14, 2, M_OR, shade=False)
    # treatment chimney / vent stack
    p.box(37, 1, 43, 17, M_ST)
    p.box(36, 1, 44, 4, M_OR)
    for yy in (7, 10, 13):
        p.hline(38, 42, yy, ST_LO)
    # hazard band + intake/outlet pipes
    p.stripes(3, 25, 30, 28, ORANGE, OUT, 2)
    p.box(0, 28, 4, 33, M_ST); p.box(41, 24, 45, 29, M_ST)
    p.screen(32, 20, 40, 26, "bars"); p.led(6, 34, CYAN); p.led(10, 34, ORANGE)
    p.box(18, 22, 28, 24, M_ST)
    return p.im


def control_panel():  # 18 Water recycling control panel 26x32
    p = P(26, 32)
    p.box(1, 1, 24, 30, M_DG)
    p.box(3, 3, 22, 14, M_ST)
    p.screen(5, 5, 20, 12, "lines")
    for i in range(4):
        p.box(4 + i * 5, 17, 7 + i * 5, 19, M_WH if i % 2 else M_CY)
    for i in range(3):
        p.led(6 + i * 6, 23, (CYAN, ORANGE, WHITE_)[i])
    p.disk(18, 26, 3, M_OR)
    p.box(4, 25, 11, 28, M_WH)
    p.hline(5, 10, 26, WH_LO)
    return p.im


EQUIP = [
    ("closed_loop_water_recycler", recycler),
    ("water_filtration_machine", filtration),
    ("primary_water_storage_tank", tank_primary),
    ("secondary_water_storage_tank", tank_secondary),
    ("water_purification_filter_cartridge", cartridge),
    ("water_pump", pump),
    ("water_distribution_pump", dist_pump),
    ("water_pipe_straight_segment", pipe_straight),
    ("water_pipe_curved_segment", pipe_curved),
    ("pipe_elbow_connector", elbow),
    ("pipe_junction_connector", junction),
    ("manual_water_valve", manual_valve),
    ("water_pressure_gauge", gauge),
    ("water_quality_monitoring_console", wq_console),
    ("water_leak_detector", leak_detector),
    ("water_collection_container", collection_container),
    ("wastewater_processing_unit", wastewater),
    ("water_recycling_control_panel", control_panel),
]
