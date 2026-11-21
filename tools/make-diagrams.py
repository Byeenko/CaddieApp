#!/usr/bin/env python3
# Generates the static lesson diagrams in content/diagrams/.
# Classes let the app recolour them for light/dark mode; the fill/stroke attributes
# are fallbacks so they still look right when opened in Obsidian.
import math, os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'content', 'diagrams')
os.makedirs(OUT, exist_ok=True)

FB = {  # fallback colours (light theme)
 'fill-fairway':'#b9d8b5','fill-rough':'#93bf8f','fill-grass':'#cfe3cf','fill-green':'#8fcf98','fill-sand':'#e9dcb8',
 'fill-water':'#a9cbe6','fill-accent':'#1e6b47','fill-bad':'#c0583f','fill-muted':'#9aa09b','fill-hole':'#1a1d1b',
 'fill-surface':'#ffffff','fill-body':'#2b302c','fill-club':'#5f665f',
}
STROKE = {'line-guide':'#9aa09b','line-good':'#1e6b47','line-bad':'#c0583f','fig-ground':'#cfd2cb','stroke-body':'#2b302c','stroke-muted':'#9aa09b','flight-path':'#1e6b47','roll-path':'#1e6b47','line-flag':'#2b302c'}
TXT = {'label':'#191c1a','label-muted':'#636a65','label-accent':'#1e6b47','label-bad':'#c0583f'}

class S:
    def __init__(s, w, h, bg=True):
        s.w, s.h, s.items = w, h, []
        if bg: s.items.append(f'<rect class="dg-bg" width="{w}" height="{h}" rx="14" fill="#ffffff"/>')
    def raw(s, x): s.items.append(x)
    def shape(s, tag, cls, **a):
        attrs = ' '.join(f'{k.replace("_","-")}="{v}"' for k, v in a.items())
        fb = ''
        if cls in FB and 'fill' not in a: fb = f' fill="{FB[cls]}"'
        if cls in STROKE: fb = f' stroke="{STROKE[cls]}"' + ('' if 'fill' in a else ' fill="none"')
        s.items.append(f'<{tag} class="{cls}"{fb} {attrs}/>')
    def rect(s, cls, x, y, w, h, rx=0): s.shape('rect', cls, x=x, y=y, width=w, height=h, rx=rx)
    def circ(s, cls, cx, cy, r): s.shape('circle', cls, cx=cx, cy=cy, r=r)
    def ell(s, cls, cx, cy, rx, ry, rot=0): s.shape('ellipse', cls, cx=cx, cy=cy, rx=rx, ry=ry, transform=f'rotate({rot} {cx} {cy})')
    def path(s, cls, d, **a): s.shape('path', cls, d=d, **a)
    def line(s, cls, x1, y1, x2, y2, **a): s.shape('line', cls, x1=x1, y1=y1, x2=x2, y2=y2, **a)
    def text(s, x, y, t, cls='label', anchor='start', size=None):
        size = size or {'label': 11, 'label-muted': 10, 'label-accent': 11, 'label-bad': 11}.get(cls, 11)
        weight = ' font-weight="600"' if cls in ('label', 'label-accent', 'label-bad') else ''
        sz = f' font-size="{size}"{weight}'
        s.items.append(f'<text class="{cls}" x="{x}" y="{y}" text-anchor="{anchor}" fill="{TXT.get(cls,"#191c1a")}"{sz}>{t}</text>')
    def ball(s, x, y, r=4):
        s.items.append(f'<circle class="fig-ball" cx="{x}" cy="{y}" r="{r}" fill="#ffffff" stroke="#5f665f" stroke-width="1"/>')
    def flag(s, x, y, h=26):
        s.line('line-flag', x, y, x, y - h, stroke_width=1.6)
        s.path('fill-accent', f'M{x} {y-h} L{x+12} {y-h+4} L{x} {y-h+8} Z')
        s.ell('fill-hole', x, y, 3.5, 1.5)
    def arrow(s, cls, x1, y1, x2, y2, head=7):
        s.line(cls, x1, y1, x2, y2, stroke_width=2.2, stroke_linecap='round')
        a = math.atan2(y2 - y1, x2 - x1)
        p1 = (x2 - head * math.cos(a - 0.45), y2 - head * math.sin(a - 0.45))
        p2 = (x2 - head * math.cos(a + 0.45), y2 - head * math.sin(a + 0.45))
        fill = 'fill-bad' if 'bad' in cls else 'fill-accent' if 'good' in cls or 'flight' in cls else 'fill-muted'
        s.path(fill, f'M{x2:.1f} {y2:.1f} L{p1[0]:.1f} {p1[1]:.1f} L{p2[0]:.1f} {p2[1]:.1f} Z')
    def mark(s, x, y, good=True):
        s.circ('fill-accent' if good else 'fill-bad', x, y, 8)
        s.items.append(f'<text x="{x}" y="{y+3.5}" text-anchor="middle" font-size="10" font-weight="800" fill="#ffffff">{"✓" if good else "✕"}</text>')
    def save(s, name):
        body = '\n'.join(s.items)
        open(f'{OUT}/{name}.svg', 'w').write(
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {s.w} {s.h}" width="{s.w}" height="{s.h}" font-family="-apple-system, Segoe UI, sans-serif">\n{body}\n</svg>\n')

# 1. Ball position (face-on; target to the RIGHT)
d = S(360, 262)
rows = [("Driver","Inside lead heel",90,78),("Fairway wood","A few inches inside heel",82,60),
        ("Hybrid / long iron","Two balls forward",74,36),("Mid iron","One ball forward",66,16),("Wedge / short iron","Centre",58,0)]
c = 245
d.text(c, 24, 'Centre', 'label-muted', 'middle')
d.text(344, 24, 'TARGET →', 'label-accent', 'end')
d.line('line-guide', c, 32, c, 246, stroke_dasharray='3 4')
for i,(n,sub,hw,off) in enumerate(rows):
    y = 56 + i*44
    d.text(16, y-1, n, 'label'); d.text(16, y+14, sub, 'label-muted')
    d.line('fig-ground', c-hw, y+4, c+hw, y+4, stroke_width=1.5, stroke_linecap='round')
    for fx in (c-hw, c+hw): d.rect('fill-muted', fx-6, y-10, 12, 28, 6)
    d.circ('fill-accent', c+off, y+4, 6)
d.text(c-58-4, 250, 'trail', 'label-muted', 'middle'); d.text(c+58+4, 250, 'lead', 'label-muted', 'middle')
d.save('ball-position')

# 2. Alignment: railway tracks (top-down, target at the top)
d = S(300, 300)
d.rect('fill-fairway', 0, 0, 300, 300, 14)
d.flag(200, 52)
d.text(214, 34, 'Target', 'label')
d.line('line-good', 200, 262, 200, 56, stroke_width=2.5)
d.text(206, 160, 'Target line', 'label-accent')
d.line('line-good', 150, 262, 150, 40, stroke_width=2.5, stroke_dasharray='6 5')
d.text(142, 120, 'Feet, hips and', 'label', 'end'); d.text(142, 134, 'shoulders line', 'label', 'end')
d.text(142, 150, '(parallel left)', 'label-muted', 'end')
d.ball(200, 262)
d.rect('fill-body', 138, 244, 9, 22, 4); d.rect('fill-body', 138, 270, 9, 22, 4)
d.line('line-bad', 145, 262, 196, 70, stroke_width=2, stroke_dasharray='4 4')
d.text(60, 222, 'Body aimed AT the flag', 'label-bad'); d.text(60, 236, '= clubface aims right', 'label-bad')
d.save('alignment-tracks')

# 3. Low point: ball first vs ground first (side view)
d = S(340, 200)
for i,(ok,title,lp) in enumerate([(True,'Ball, then turf',0),(False,'Turf, then ball (fat)',1)]):
    ox = 10 + i*170
    G = 130
    d.rect('fill-grass', ox, G, 150, 50, 6)
    d.line('fig-ground', ox, G, ox+150, G, stroke_width=2)
    bx = ox + 70
    low = bx + 22 if ok else bx - 26
    d.path('line-guide', f'M{low-62} {G-70} Q{low} {G+68} {low+62} {G-70}', stroke_width=1.4, stroke_dasharray='3 3')
    dv0, dv1 = (bx+4, bx+46) if ok else (bx-46, bx-2)
    d.path('fill-sand', f'M{dv0} {G} Q{(dv0+dv1)/2} {G+9} {dv1} {G} Z')
    d.ball(bx, G-4)
    d.text(ox+75, 30, title, 'label-accent' if ok else 'label-bad', 'middle')
    d.text(ox+75, 186, 'divot after the ball' if ok else 'divot before the ball', 'label-muted', 'middle')
    d.mark(ox+14, 26, ok)
    d.line('stroke-muted', low, G+12, low, G+24, stroke_width=1)
    d.text(low, G+36, 'low point', 'label-muted', 'middle')
d.text(170, 60, 'TARGET →', 'label-accent', 'middle')
d.save('low-point')

# 4. Driver tee height
d = S(300, 170)
G = 140
d.rect('fill-grass', 0, G, 300, 30)
d.line('fig-ground', 0, G, 300, G, stroke_width=2)
d.line('stroke-body', 150, G, 150, G-22, stroke_width=3)
d.ball(150, G-34, 12)
d.path('fill-club', f'M64 {G-2} Q60 {G-30} 92 {G-34} L134 {G-34} Q138 {G-18} 134 {G-2} Z')
d.line('stroke-muted', 50, G-34, 200, G-34, stroke_dasharray='3 3', stroke_width=1)
d.text(150, G-80, 'About half the ball above', 'label-accent'); d.text(150, G-67, 'the top of the driver', 'label-accent')
d.text(206, G-30, 'crown height', 'label-muted')
d.text(14, 24, 'Driver tee height (side view)', 'label')
d.save('tee-height')

# 5. Trajectory: low, normal, high
d = S(340, 180)
G = 150
d.rect('fill-grass', 0, G, 340, 30)
d.line('fig-ground', 0, G, 340, G, stroke_width=2)
for h, lbl, cls, n in [(40,'Low: ball back, hands forward, shorter finish','line-good',0),(80,'Normal','stroke-muted',1),(118,'High: ball forward, full finish','line-good',2)]:
    d.path(cls if cls!='stroke-muted' else 'line-guide', f'M30 {G-4} Q{170+n*10} {G-4-h*1.55} {310-n*18} {G-4}', stroke_width=2.2 if cls=='line-good' else 1.4, fill='none')
d.ball(30, G-4)
d.text(318, G-12, 'low', 'label-muted', 'end')
d.text(14, 22, 'Same club, three trajectories', 'label')
d.text(14, 38, 'Ball back + hands forward = lower · Ball forward = higher', 'label-muted')
d.save('trajectory')

# 6. Wind (side view)
d = S(340, 200)
G = 170
d.rect('fill-grass', 0, G, 340, 30)
d.line('fig-ground', 0, G, 340, G, stroke_width=2)
d.path('line-guide', f'M24 {G-3} Q170 {G-150} 250 {G-3}', stroke_width=1.6)
d.path('line-bad', f'M24 {G-3} Q130 {G-178} 196 {G-3}', stroke_width=2.4)
d.path('line-good', f'M24 {G-3} Q190 {G-120} 284 {G-3}', stroke_width=2.4)
d.line('roll-path', 284, G-3, 322, G-3, stroke_width=2.4, stroke_dasharray='2 4')
d.ball(24, G-3)
d.text(196, G+18, 'into wind', 'label-bad', 'middle'); d.text(250, G+18, 'calm', 'label-muted', 'middle'); d.text(300, G+18, 'downwind', 'label-accent', 'middle')
d.arrow('line-bad', 90, 30, 50, 30); d.text(98, 34, 'Into: climbs, spins more, lands shorter', 'label-bad')
d.arrow('line-good', 50, 52, 90, 52); d.text(98, 56, 'Downwind: flatter, longer, more roll', 'label-accent')
d.save('wind')

# 7. Hole anatomy (top-down par 4)
d = S(320, 420)
d.rect('fill-rough', 0, 0, 320, 420, 14)
d.path('fill-water', 'M222 230 Q300 210 310 270 Q300 320 238 300 Q206 270 222 230 Z')
d.path('fill-fairway', 'M130 380 Q120 300 140 230 Q160 160 170 110 L214 110 Q210 170 196 236 Q180 310 188 380 Z')
d.ell('fill-sand', 112, 228, 18, 10, -20)
d.ell('fill-green', 196, 70, 40, 30)
d.ell('fill-sand', 148, 92, 12, 8, 30); d.ell('fill-sand', 244, 58, 11, 8, -30)
d.rect('fill-muted', 140, 386, 40, 22, 4)
d.flag(200, 72)
d.line('line-guide', 18, 20, 18, 400, stroke_width=2, stroke_dasharray='2 8')
for y in range(30, 400, 46): d.circ('fill-surface', 18, y, 3.2)
d.text(26, 46, 'White stakes:', 'label-muted'); d.text(26, 58, 'out of bounds', 'label-muted')
for x,y in [(232,236),(300,252),(298,300),(240,298)]: d.circ('fill-bad', x, y, 3)
def tag(x, y, t, cls='label'):
    d.text(x, y, t, cls)
tag(186, 404, 'Tee')
tag(140, 330, 'Fairway'); tag(42, 300, 'Rough')
tag(60, 252, 'Fairway bunker'); d.text(306, 330, 'Penalty area', 'label-bad', 'end'); d.text(306, 344, '(red stakes or lines)', 'label-muted', 'end')
tag(240, 102, 'Green'); tag(98, 120, 'Greenside', 'label-muted'); tag(98, 134, 'bunker', 'label-muted')
d.text(300, 26, 'Par 4', 'label-accent', 'end')
d.save('hole-anatomy')

# 8. Penalty area relief (red)
d = S(320, 340)
d.rect('fill-fairway', 0, 0, 320, 340, 14)
d.path('fill-water', 'M180 120 Q260 100 300 150 Q310 230 240 240 Q180 230 180 120 Z')
d.path('line-bad', 'M180 120 Q260 100 300 150 Q310 230 240 240 Q180 230 180 120 Z', stroke_width=2)
d.flag(250, 74)
d.text(264, 60, 'Hole', 'label')
d.ball(60, 300); d.text(72, 304, 'last shot played from here', 'label-muted')
d.path('line-guide', 'M60 300 Q150 160 232 176', stroke_width=1.6)
d.circ('fill-bad', 186, 160, 4.5)
d.text(176, 152, 'X', 'label-bad'); d.text(16, 120, 'X = where the ball last', 'label-muted'); d.text(16, 132, 'crossed the edge', 'label-muted')
d.circ('line-good', 186, 160, 34); d.text(16, 168, '① Lateral: drop within', 'label-accent'); d.text(16, 181, '2 club-lengths of X,', 'label-accent'); d.text(16, 194, 'not nearer the hole', 'label-accent')
d.line('line-good', 250, 74, 120, 268, stroke_dasharray='5 4'); d.text(16, 236, '② Back on the line', 'label-accent'); d.text(16, 249, 'hole → X, any distance', 'label-accent')
d.text(16, 330, '③ Stroke and distance: replay from the last spot', 'label-accent')
d.text(16, 24, 'Red penalty area: options, each +1 stroke', 'label')
d.text(16, 40, 'Yellow: only ② and ③', 'label-muted')
d.save('penalty-relief')

# 9. Risk / reward par 5
d = S(320, 420)
d.rect('fill-rough', 0, 0, 320, 420, 14)
d.path('fill-fairway', 'M120 400 Q110 300 130 220 L190 220 Q200 300 190 400 Z')
d.path('fill-fairway', 'M130 220 Q140 160 150 150 L196 150 Q192 190 190 220 Z')
d.path('fill-water', 'M70 110 Q160 90 260 116 L262 144 Q160 126 70 140 Z')
d.ell('fill-green', 168, 64, 40, 26)
d.flag(176, 66)
d.circ('fill-muted', 160, 392, 5)
d.circ('fill-surface', 160, 196, 4)
d.path('line-bad', 'M160 196 Q166 130 172 74', stroke_width=2.4, stroke_dasharray='6 4')
d.path('line-good', 'M160 196 Q165 176 170 164', stroke_width=2.4)
d.circ('fill-accent', 170, 164, 4)
d.path('line-good', 'M170 164 Q174 120 174 76', stroke_width=2.4)
d.text(150, 214, 'Drive finishes here:', 'label', 'end'); d.text(150, 228, '215 to the flag', 'label-muted', 'end')
d.text(10, 92, 'Go for it: must carry', 'label-bad'); d.text(10, 106, 'the water all the way', 'label-bad')
d.text(194, 164, 'Lay up to your', 'label-accent'); d.text(194, 178, 'best wedge', 'label-accent'); d.text(194, 192, 'distance', 'label-accent')
d.text(10, 24, 'Par 5: risk vs reward', 'label')
d.text(10, 410, 'Example layout', 'label-muted')
d.save('risk-reward')

# 10. Where to miss (green, tucked pin)
d = S(320, 260)
d.rect('fill-fairway', 0, 0, 320, 260, 14)
d.ell('fill-green', 160, 120, 120, 80)
d.ell('fill-sand', 290, 120, 22, 50)
d.path('fill-bad', 'M228 70 Q280 100 276 150 Q250 176 222 170 Q210 120 228 70 Z', opacity='0.28')
d.flag(244, 120)
d.ell('line-good', 150, 126, 58, 40)
d.circ('fill-accent', 150, 126, 4)
d.text(150, 186, 'Aim here: middle of the green', 'label-accent', 'middle')
d.text(306, 32, 'Short side: tiny', 'label-bad', 'end'); d.text(306, 46, 'margin, bunker behind', 'label-bad', 'end')
d.text(14, 240, 'A miss left of the pin still leaves an uphill putt or easy chip', 'label-muted')
d.text(14, 24, 'Pin tucked right', 'label')
d.save('where-to-miss')

# 11. Dispersion
d = S(320, 340)
for i, (aimx, title, ok) in enumerate([(160, 'Aim at the middle', False), (130, 'Aim away from trouble', True)]):
    ox = i*160
    d.rect('fill-rough', ox+4, 40, 152, 290, 10)
    d.rect('fill-fairway', ox+34, 40, 92, 290)
    d.line('line-bad', ox+150, 40, ox+150, 330, stroke_width=2, stroke_dasharray='2 6')
    ax = ox + 80 + (0 if not ok else -18)
    d.ell('line-good' if ok else 'line-bad', ax+6, 120, 44, 64)
    d.circ('fill-accent' if ok else 'fill-bad', ax, 120, 3.5)
    d.line('line-guide', ox+80, 320, ax, 124, stroke_width=1.2)
    d.circ('fill-muted', ox+80, 320, 4)
    d.text(ox+80, 26, title, 'label-accent' if ok else 'label-bad', 'middle')
    d.mark(ox+16, 22, ok)
d.text(312, 210, 'OB', 'label-bad', 'end')
d.text(10, 338, 'Ellipse = where 9 in 10 of your shots finish', 'label-muted')
d.save('dispersion')

# 12. Tee side
d = S(320, 260)
d.rect('fill-rough', 0, 0, 320, 260, 14)
d.path('fill-fairway', 'M70 0 L250 0 L230 190 L90 190 Z')
d.path('fill-water', 'M250 0 L320 0 L320 140 L262 120 Z')
d.rect('fill-muted', 100, 214, 120, 34, 6)
d.circ('fill-accent', 206, 232, 5); d.text(206, 210, 'Tee here', 'label-accent', 'middle')
d.line('line-good', 206, 232, 140, 30, stroke_width=2.4)
d.circ('fill-bad', 114, 232, 5)
d.line('line-bad', 114, 232, 220, 30, stroke_dasharray='5 4', stroke_width=2)
d.text(296, 160, 'Trouble right', 'label-bad', 'end')
d.text(10, 24, 'Tee up on the same side', 'label'); d.text(10, 38, 'as the trouble, aim away', 'label')
d.save('tee-side')

# 13. Wedge bounce
d = S(340, 200)
for i, (b, title, note) in enumerate([(4, 'Low bounce (4–6°)', 'Firm turf, tight lies|open-face shots'), (12, 'High bounce (10°+)', 'Soft turf, fluffy sand|steep swings')]):
    ox = 12 + i*166
    G = 120
    d.rect('fill-grass', ox, G, 150, 40, 6)
    d.line('fig-ground', ox, G, ox+150, G, stroke_width=2)
    lead = (ox+40, G-2); trail = (ox+110, G-2-b*2.2)
    d.path('fill-club', f'M{lead[0]} {lead[1]} Q{ox+80} {G+4+b*0.6} {trail[0]} {trail[1]} L{ox+104} {G-46} L{ox+46} {G-30} Z')
    d.text(ox+75, 28, title, 'label', 'middle')
    n1, n2 = note.split('|'); d.text(ox+75, 176, n1, 'label-muted', 'middle'); d.text(ox+75, 189, n2, 'label-muted', 'middle')
    d.text(lead[0]-4, G-30, 'leading', 'label-muted', 'end'); d.text(lead[0]-4, G-18, 'edge', 'label-muted', 'end')
d.text(170, 50, 'Bounce: how far the sole sits', 'label-accent', 'middle'); d.text(170, 63, 'below the leading edge', 'label-accent', 'middle')
d.save('wedge-bounce')

# 14. Kinematic sequence
d = S(340, 220)
d.line('fig-ground', 40, 180, 320, 180, stroke_width=1.5)
d.line('fig-ground', 40, 30, 40, 180, stroke_width=1.5)
d.text(46, 26, 'speed', 'label-muted')
d.text(320, 198, 'time →', 'label-muted', 'end')
d.line('line-guide', 270, 30, 270, 180)
d.text(274, 172, 'impact', 'label-muted')
curves = [('Pelvis', 196, 60, '#9aa09b'), ('Chest', 220, 86, '#7c9a86'), ('Arms', 240, 112, '#4f8a69'), ('Club', 266, 150, '#1e6b47')]
for name, peak, h, col in curves:
    d.raw(f'<path d="M60 176 Q{peak-40} 176 {peak} {180-h} Q{peak+30} {180-h+40} {peak+46} 176" fill="none" stroke="{col}" stroke-width="2.4"/>')
    d.text(peak, 180-h-8, name, 'label', 'middle')
d.text(56, 212, 'Each part peaks and slows down, passing speed to the next', 'label-muted')
d.save('kinematic-sequence')

# 15. Recovery options
d = S(320, 300)
d.rect('fill-rough', 0, 0, 320, 300, 14)
d.path('fill-fairway', 'M200 300 L320 300 L320 0 L230 0 Q190 150 200 300 Z')
for x, y in [(60,80),(110,60),(150,110),(90,140),(130,180),(60,200),(170,40),(40,130),(170,170)]:
    d.circ('fill-accent', x, y, 16)
d.ell('fill-green', 280, 40, 30, 18); d.flag(282, 44)
d.ball(110, 230)
d.line('line-good', 110, 230, 240, 222, stroke_width=2.4); d.mark(250, 222, True)
d.text(196, 252, 'Chip out sideways:', 'label-accent'); d.text(196, 266, 'bogey at worst', 'label-accent')
d.line('line-bad', 110, 230, 270, 50, stroke_dasharray='5 4', stroke_width=2); d.mark(146, 188, False)
d.text(10, 284, 'Hero gap through the trees: double or worse', 'label-bad')
d.text(10, 24, 'In the trees', 'label')
d.save('recovery-options')

# 16. Flyer lie
d = S(320, 170)
G = 132
d.rect('fill-rough', 0, G, 320, 38)
d.line('fig-ground', 0, G, 320, G, stroke_width=2)
for x in range(60, 150, 6): d.line('line-good', x, G, x+3, G-24 - (x % 5) * 2, stroke_width=1.4)
d.ball(130, G-10, 9)
d.path('fill-club', f'M86 {G-38} L104 {G-38} L108 {G} L90 {G} Z')
d.text(14, 44, 'Grass gets trapped between the face and ball', 'label')
d.text(14, 60, '→ less spin → flies further and runs on landing', 'label-accent')
d.text(10, 24, 'Flyer lie', 'label')
d.save('flyer-lie')

# 17. Club gapping (example)
d = S(340, 300)
clubs = [('Dr',230),('3W',210),('Hy',190),('5i',175),('6i',165),('7i',155),('8i',143),('9i',131),('PW',118),('GW',103),('SW',88),('LW',70)]
d.text(12, 24, 'EXAMPLE: carry distances (yards)', 'label-accent')
d.text(12, 40, 'Replace with your own numbers from the range or simulator', 'label-muted')
for i, (c, v) in enumerate(clubs):
    y = 56 + i*19
    d.text(34, y+11, c, 'label', 'end')
    d.rect('fill-accent' if c not in ('GW','SW','LW') else 'fill-muted', 40, y, v*1.15, 13, 4)
    d.text(44 + v*1.15, y+11, str(v), 'label-muted')
d.text(12, 296, 'Look for even 10–15 yard gaps between clubs', 'label-muted')
d.save('club-gapping')

print('diagrams:', len(os.listdir(OUT)))
