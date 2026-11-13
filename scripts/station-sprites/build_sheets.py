import sys, json, os
sys.path.insert(0,'/home/claude/gen')
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage
import buildings2 as B, water, solar, oxy

PAD=14; W=500
OUT_DIR='/home/claude/out'; os.makedirs(OUT_DIR,exist_ok=True)

def make(slug,title,bld,equip):
    b=bld(); items=[(n,f()) for n,f in equip]
    bx,by=PAD,PAD
    rects={'exterior_building':(bx,by,b.width,b.height)}
    right0=bx+b.width+PAD; bottom=by+b.height+PAD
    x=right0; y=PAD; rowh=0
    placed=[]
    for n,im in items:
        if x+im.width+PAD>W:
            x=PAD if y+rowh+PAD>=bottom else right0
            y+=rowh+PAD; rowh=0
            if y>=bottom: x=PAD
        elif y>=bottom and x<PAD: x=PAD
        placed.append((n,im,x,y)); rects[n]=(x,y,im.width,im.height)
        x+=im.width+PAD; rowh=max(rowh,im.height)
    H=max(r[1]+r[3] for r in rects.values())+PAD
    sheet=Image.new('RGBA',(W,H),(0,0,0,0))
    sheet.alpha_composite(b,(bx,by))
    for n,im,px,py in placed: sheet.alpha_composite(im,(px,py))
    sheet.save(f'{OUT_DIR}/{slug}_native.png')
    big=sheet.resize((W*4,H*4),Image.NEAREST); big.save(f'{OUT_DIR}/{slug}.png')
    json.dump({k:{'x':v[0],'y':v[1],'w':v[2],'h':v[3]} for k,v in rects.items()},open(f'{OUT_DIR}/{slug}_atlas_native.json','w'),indent=1)
    # QC
    a=np.array(sheet)[:,:,3]>0
    comps,n=ndimage.label(ndimage.binary_dilation(a,iterations=4),structure=np.ones((3,3)))
    # overlap check via rect intersection
    rl=list(rects.items()); ov=[]
    for i in range(len(rl)):
        for j in range(i+1,len(rl)):
            a1=rl[i][1]; b1=rl[j][1]
            if a1[0]<b1[0]+b1[2]+8 and b1[0]<a1[0]+a1[2]+8 and a1[1]<b1[1]+b1[3]+8 and b1[1]<a1[1]+a1[3]+8: ov.append((rl[i][0],rl[j][0]))
    # crop check: opaque pixel on any rect border
    arr=np.array(sheet)
    print(slug,sheet.size,'expected',len(rects),'components',n,'tight overlaps',ov,'corner alpha',arr[0,0,3])
make('01_water_recycling_station','',B.water_station,water.EQUIP)
make('02_solar_power_station','',B.solar_station,solar.EQUIP)
make('03_oxygen_heating_station','',B.oxygen_station,oxy.EQUIP)
