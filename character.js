(()=>{'use strict';
const SK='roots-heroes-character-v1';
const defaults={name:'Director',pronouns:'they/them',skin:3,hairStyle:0,hairColor:1,eyes:1,shirt:0,shirtColor:0,bottom:0,bottomColor:0};
const palettes={skin:['#43271f','#60392b','#7d4c36','#9c6144','#b87c57','#ce9870','#e4b38d','#f2d0af'],hair:['#28242b','#5c382c','#a16a3c','#e4b55f','#bcb9b4','#a44a3e','#523b75','#2c6680'],eyes:['#49372d','#3d6c9c','#51865a','#806049','#584a87'],clothes:['#d6a354','#7ca3c7','#b6759e','#6a9c81','#a68bcb','#e6d8c1','#424d61','#cf7565']};
let state={...defaults};try{const saved=JSON.parse(localStorage.getItem(SK));if(saved)state={...defaults,...saved}}catch(e){}
const modal=document.createElement('div');modal.id='characterCreator';modal.innerHTML=`
<style>
#characterCreator{position:fixed;inset:0;z-index:20;background:#111d25eF;display:flex;align-items:center;justify-content:center;padding:14px;overflow:auto}
#characterCreator .creator{width:min(850px,100%);max-height:95vh;overflow:auto;background:#253b43;border:3px solid #e6c989;border-radius:14px;padding:18px;box-shadow:0 20px 70px #000a}
#characterCreator h2{margin:0 0 4px;color:#ffdf9e;font-size:24px}#characterCreator .hint{font-size:13px;color:#c8d7d7;margin:0 0 14px}
#characterCreator .layout{display:grid;grid-template-columns:230px 1fr;gap:18px}
#characterCreator .preview{background:#344e51;border-radius:10px;padding:14px;text-align:center;align-self:start}
#characterCreator canvas{width:180px;height:216px;image-rendering:pixelated;background:#b4d1b3;border:3px solid #e2d6b6;border-radius:8px;margin:auto}
#characterCreator .preview p{font-size:12px;color:#e0e9e4;margin:8px 0}
#characterCreator .fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}
#characterCreator label{display:block;font-size:12px;color:#e9d5aa}
#characterCreator input,#characterCreator select{width:100%;margin-top:4px;padding:9px;border:1px solid #789195;border-radius:6px;background:#15272d;color:white;font:inherit}
#characterCreator .buttons{display:flex;justify-content:flex-end;gap:10px;margin-top:16px;flex-wrap:wrap}
#characterCreator button{background:#e8ca87;color:#25343c;border:0;border-radius:7px;padding:11px 18px;font-weight:750;cursor:pointer}
#characterCreator button.secondary{background:#4c6971;color:white}
#characterCreator .preview button{padding:7px 10px;margin:4px;background:#d5e3db}#characterCreator .hair-controls{display:flex;gap:4px;justify-content:center;flex-wrap:wrap}#characterCreator #hairPreviewName{font-size:16px;font-weight:750;color:#ffe0a1}
@media(max-width:640px){#characterCreator .layout{grid-template-columns:1fr}#characterCreator .preview{display:flex;align-items:center;justify-content:center;gap:12px}#characterCreator canvas{width:110px;height:132px}#characterCreator .fields{grid-template-columns:1fr 1fr}}
</style>
<div class="creator"><h2>Create Your Director</h2><p class="hint">Choose how you want to look in Roots Heroes. You can change your appearance later.</p><div class="layout">
<div class="preview"><div><canvas id="creatorPreview" width="120" height="144"></canvas><p id="hairPreviewName">Short</p><div class="hair-controls"><button type="button" id="hairPrevious">◀ Previous</button><button type="button" id="hairNext">Next ▶</button></div><button type="button" id="rotateSprite">Turn ↻</button><p>Clothing fit preview · T-shirt and pants</p></div></div>
<div class="fields">
<label>Name<input id="c-name" maxlength="22" autocomplete="off"></label>

<label>Pronouns<select id="c-pronouns"><option>she/her</option><option>he/him</option><option>they/them</option></select></label>
<label>Skin tone<select id="c-skin"></select></label>
<label>Hair style<select id="c-hairStyle"><option value="0">Short</option><option value="1">Messy</option><option value="2">Ponytail</option><option value="3">Bun</option><option value="4">Long straight</option><option value="5">Wavy</option><option value="6">Curly</option><option value="7">Braided</option></select></label>
<label>Hair color<select id="c-hairColor"></select></label>
<label>Eye color<select id="c-eyes"></select></label>
<label>Shirt style<select id="c-shirt"><option value="0">T-shirt</option><option value="1">Jacket</option><option value="2">Hoodie</option><option value="3">Button-up</option><option value="4">Sweater</option></select></label>
<label>Shirt color<select id="c-shirtColor"></select></label>
<label>Bottoms<select id="c-bottom"><option value="0">Pants</option><option value="1">Shorts</option><option value="2">Skirt</option></select></label>
<label>Bottom color<select id="c-bottomColor"></select></label>
</div></div><div class="buttons"><button class="secondary" id="creatorCancel" type="button">Cancel</button><button id="creatorSave" type="button">Start Exploring</button></div></div>`;
document.body.appendChild(modal);
const selectOptions=(id,labels)=>{const el=modal.querySelector('#c-'+id);labels.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;el.appendChild(o)})};
selectOptions('skin',['Skin 1','Skin 2','Skin 3','Skin 4','Skin 5','Skin 6','Skin 7','Skin 8']);
selectOptions('hairColor',['Black','Dark brown','Chestnut','Blonde','Silver','Auburn','Purple','Blue']);
selectOptions('eyes',['Brown','Blue','Green','Hazel','Violet']);
selectOptions('shirtColor',['Gold','Blue','Pink','Green','Purple','Cream','Charcoal','Coral']);
selectOptions('bottomColor',['Gold','Blue','Pink','Green','Purple','Cream','Charcoal','Coral']);
const hairstyleLabels=['Short','Messy','Ponytail','Bun','Long straight','Wavy','Curly','Braided'];let facing=0;const dirs=['down','right','up','left'];const preview=modal.querySelector('#creatorPreview');
const sheets={};let loaded=0;for(const type of ['body','hair','tops','bottoms']){const im=new Image();im.onload=()=>{loaded++;renderPreview()};im.src='assets/player/'+type+'.svg';sheets[type]=im}
const cache=new Map();
function tile(type,row,d,step,color){const key=[type,row,d,step,color].join(':');if(cache.has(key))return cache.get(key);const im=sheets[type];if(!im.complete||!im.naturalWidth)return null;const tile=document.createElement('canvas');tile.width=32;tile.height=48;const cc=tile.getContext('2d',{willReadFrequently:true});cc.drawImage(im,(d*3+step)*32,row*48,32,48,0,0,32,48);
if(color&&type!=='body'){const data=cc.getImageData(0,0,32,48),rgb=[1,3,5].map((_,i)=>parseInt(color.slice(1+i*2,3+i*2),16));for(let k=0;k<data.data.length;k+=4){if(data.data[k+3]===0)continue;const r=data.data[k],g=data.data[k+1],b=data.data[k+2];if(r+g+b<160||r+g+b>650)continue;const brightness=Math.max(.55,Math.min(1.25,(r+g+b)/370));for(let j=0;j<3;j++)data.data[k+j]=Math.min(255,Math.round(rgb[j]*brightness))}cc.putImageData(data,0,0)}
cache.set(key,tile);return tile}
function drawSheet(ctx,x,y,s,dir,step,scale){const d={down:0,left:1,right:2,up:3}[dir]??0;const layers=[['body',Math.min(7,s.skin),null],['bottoms',s.bottom,palettes.clothes[s.bottomColor]],['tops',s.shirt,palettes.clothes[s.shirtColor]],['hair',s.hairStyle,palettes.hair[s.hairColor]]];for(const [type,row,color] of layers){const tileCanvas=tile(type,row,d,step?1:0,color);if(!tileCanvas)return false;ctx.drawImage(tileCanvas,Math.round(x-16*scale),Math.round(y-34*scale),32*scale,48*scale)}return true}

const baseFrames={};let baseReady=false;
const baseDirections={down:'front',left:'left',right:'right',up:'back'};
for(const direction of ['front','left','right','back'])for(const pose of ['idle_1','idle_2','walk_1','walk_2']){
 const id=direction+'_'+pose,img=new Image();baseFrames[id]=img;
 img.onload=()=>{if(id==='front_idle_1')baseReady=true;renderPreview()};
 img.src='assets/player/base-sprites/'+id+'.png';
}
const clothingFrames={tshirt:new Map(),pants:new Map()};
for(const kind of ['tshirt','pants'])for(const direction of ['front','left','right','back'])for(const pose of ['idle_1','idle_2','walk_1','walk_2']){
 const img=new Image(),key=direction+'_'+pose;
 clothingFrames[kind].set(key,img);
 img.onload=()=>renderPreview();
 img.src='assets/clothes/'+kind+'_'+key+'.png';
}
const clothingTintCache=new WeakMap();
function tintedClothing(img,color,kind){
 if(!color)return img;
 let colors=clothingTintCache.get(img);if(!colors){colors=new Map();clothingTintCache.set(img,colors)}
 const cacheKey=kind+':'+color;
 if(colors.has(cacheKey))return colors.get(cacheKey);
 const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
 const g=layer.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
 const pixels=g.getImageData(0,0,layer.width,layer.height),d=pixels.data;
 const rgb=[1,3,5].map((_,i)=>parseInt(color.slice(1+i*2,3+i*2),16));
 const crop=kind==='pants'?croppedClothing(img):null;
 for(let i=0;i<d.length;i+=4){
  if(d[i+3]<15)continue;
  const y=Math.floor(i/4/layer.width);
  if(crop&&y>=crop.y+crop.h*.79){
   // The bottom of each pant leg becomes the shoe, keeping its original silhouette.
   const shade=d[i]<100?0.65:1;
   d[i]=Math.round(34*shade);d[i+1]=Math.round(36*shade);d[i+2]=Math.round(42*shade);
   continue;
  }
  const r=d[i],gr=d[i+1],b=d[i+2];
  // Preserve dark pixel outlines; tint only the white and gray fabric.
  if(Math.min(r,gr,b)<115||Math.max(r,gr,b)-Math.min(r,gr,b)>35)continue;
  const shade=Math.max(.55,Math.min(1.18,(r+gr+b)/660));
  for(let j=0;j<3;j++)d[i+j]=Math.round(Math.min(255,rgb[j]*shade));
 }
 g.putImageData(pixels,0,0);colors.set(cacheKey,layer);return layer;
}
const clothingCropCache=new WeakMap();
function croppedClothing(img){
 if(clothingCropCache.has(img))return clothingCropCache.get(img);
 const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
 const g=canvas.getContext('2d',{willReadFrequently:true});g.drawImage(img,0,0);
 const data=g.getImageData(0,0,canvas.width,canvas.height).data;
 let minX=canvas.width,minY=canvas.height,maxX=-1,maxY=-1;
 for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  if(data[(y*canvas.width+x)*4+3]<75)continue;
  minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
 }
 if(maxX<0)return null;
 const result={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
 clothingCropCache.set(img,result);return result;
}
function drawClothing(ctx,bx,by,bw,bh,s,direction,pose){
 const pieces=[
  ['pants',s.bottom===0?palettes.clothes[s.bottomColor]:null,.225,.255,.705],
  ['tshirt',s.shirt===0?palettes.clothes[s.shirtColor]:null,.2997,.315,.425]
 ];
 for(const [kind,color,width,height,top] of pieces){
  if(color===null)continue;
  const frames=clothingFrames[kind],img=frames.get(direction+'_'+pose);
  const chosen=img?.naturalWidth?img:frames.get(direction+'_idle_1');
  if(!chosen?.naturalWidth)continue;
  const crop=croppedClothing(chosen);if(!crop)continue;
  const w=bw*width,h=bh*height;
  const tinted=tintedClothing(chosen,color,kind);
  ctx.drawImage(tinted,crop.x,crop.y,crop.w,crop.h,Math.round(bx+(bw-w)/2),Math.round(by+bh*top),Math.round(w),Math.round(h));
 }

}

const hairNames=['short','messy','ponytail','bun','long_straight','wavy','curly','braided'];
const hairFrames=new Map();
const hairOffsets={};
try{Object.assign(hairOffsets,JSON.parse(localStorage.getItem('roots-hair-offsets')||'{}'))}catch(e){}
for(const name of hairNames)for(const direction of ['front','left','right','back'])for(const pose of ['idle_1','idle_2','walk_1','walk_2']){
 const key=name+'_'+direction+'_'+pose,img=new Image();
 hairFrames.set(key,img);img.onload=()=>renderPreview();
 img.src='assets/player/hairstyles/'+key+'.png';
}
const hairstyleFits={
 short:{front:[0.49,0.83,0,-0.035],left:[0.49,0.83,0,-0.005],right:[0.49,0.83,0,-0.005],back:[0.49,0.83,0,-0.045]},
 messy:{front:[0.53,0.88,0,-0.055],left:[0.53,0.88,0,-0.025],right:[0.53,0.88,0,-0.025],back:[0.53,0.88,0,-0.055]},
 ponytail:{front:[0.46,0.88,-0.035,-0.095],left:[0.51,1.00,0.035,-0.065],right:[0.51,1.00,-0.035,-0.065],back:[0.51,1.03,0,-0.045]},
 bun:{front:[0.47,0.88,0,-0.105],left:[0.51,0.95,-0.01,-0.12],right:[0.51,0.95,0,-0.055],back:[0.51,0.95,0,-0.055]},
 long_straight:{front:[0.49,1.00,0,-0.09],left:[0.51,1.05,0.045,-0.245],right:[0.51,1.05,-0.035,-0.265],back:[0.51,1.06,0,-0.045]},
 wavy:{front:[0.51,1.00,0,-0.09],left:[0.53,1.05,0.045,-0.245],right:[0.53,1.05,-0.035,-0.265],back:[0.53,1.06,0,-0.045]},
 curly:{front:[0.55,0.95,0,-0.075],left:[0.55,0.98,0.025,-0.065],right:[0.55,0.98,-0.015,-0.25],back:[0.55,0.98,0,-0.055]}
};
function drawUploadedHair(ctx,baseX,baseY,baseW,baseH,s,direction,pose){
 const name=hairNames[s.hairStyle]||'short';
 const mirroredRightStyles=['braided'];
 const mirrorRight=direction==='right'&&mirroredRightStyles.includes(name);
 const sourceDirection=mirrorRight?'left':direction;
 const img=hairFrames.get(name+'_'+sourceDirection+'_'+pose);
 const fallback=hairFrames.get(name+'_'+sourceDirection+'_idle_1');
 const chosen=img?.naturalWidth?img:fallback?.naturalWidth?fallback:null;
 if(!chosen)return;
 const offset=hairOffsets[name+'_'+direction]||[0,0];
 const braided=name==='braided';
 const fit=hairstyleFits[name]?.[direction]||[0.55,0.55,0,0];
 const hairW=baseW*(braided?(direction==='front'?0.47:0.53):fit[0]),hairH=baseH*(braided?(direction==='front'?0.92:1.0):fit[1]);
 const drawX=Math.round(baseX+(baseW-hairW)/2+(braided?0:fit[2]*baseW)+offset[0]*baseW/96);
 const drawY=Math.round(baseY+baseH*(braided?({front:-0.045,left:-0.04,right:-0.04,back:-0.045}[direction]??0):fit[3])+offset[1]*baseH/128);
 if(mirrorRight){
  ctx.save();ctx.translate(drawX+hairW,0);ctx.scale(-1,1);
  ctx.drawImage(chosen,0,drawY,Math.round(hairW),Math.round(hairH));ctx.restore();
 }else ctx.drawImage(chosen,drawX,drawY,Math.round(hairW),Math.round(hairH));
}
const braidSideOverlays={};
for(const side of ['left','right']){
 const img=new Image();braidSideOverlays[side]=img;
 img.onload=()=>renderPreview();
 img.src='assets/player/hairstyles/'+side+'_braid.png';
}
function drawSideBraid(ctx,bx,by,bw,bh,direction){
 const img=braidSideOverlays[direction];
 if(!img?.naturalWidth)return;
 // The braid is a separate transparent PNG, anchored behind the ear and shoulder.
 const h=bh*0.27,w=h*img.naturalWidth/img.naturalHeight;
 const centerX=bx+bw*(direction==='left'?0.575:0.425);
 const top=by+bh*0.405;
 ctx.drawImage(img,Math.round(centerX-w/2),Math.round(top),Math.round(w),Math.round(h));
}
function drawUploadedBase(ctx,x,y,s,dir,step,scale){
 const direction=baseDirections[dir]||'front',moving=step>0;
 const gait=moving?Math.floor(performance.now()/140)%4:0;
 const pose=moving?(['idle_1','walk_1','idle_2','walk_2'][gait]):'idle_1';
 const img=baseFrames[direction+'_'+pose];
 const fallback=baseFrames[direction+'_idle_1'];
 const chosen=img?.naturalWidth?img:fallback?.naturalWidth?fallback:null;
 if(!chosen)return false;
 // All source PNGs use the same rectangular cell. Keep the character centered and feet anchored.
 const size=scale*64,aspect=chosen.naturalWidth/chosen.naturalHeight;
 ctx.imageSmoothingEnabled=false;
 const left=Math.round(x-size*aspect/2),top=Math.round(y-size),width=Math.round(size*aspect),height=Math.round(size);
 if(s.hairStyle===7&&(direction==='left'||direction==='right'))drawSideBraid(ctx,left,top,width,height,direction);
 ctx.drawImage(chosen,left,top,width,height);
 drawClothing(ctx,left,top,width,height,s,direction,pose);
 drawUploadedHair(ctx,left,top,width,height,s,direction,pose);
 return true;
}
function draw(ctx,x,y,s,dir='down',step=0,scale=1){if(baseReady&&drawUploadedBase(ctx,x,y,s,dir,step,scale))return;if(loaded===4){drawSheet(ctx,x,y,s,dir,step,scale);return}
const px=(a,b,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x+a*scale),Math.round(y+b*scale),Math.ceil(w*scale),Math.ceil(h*scale))};
const skin=palettes.skin[s.skin]||palettes.skin[2],hair=palettes.hair[s.hairColor]||palettes.hair[1],shirt=palettes.clothes[s.shirtColor]||palettes.clothes[0],bottom=palettes.clothes[s.bottomColor]||palettes.clothes[0];
const walk=step?2:0;
px(-8,6+walk,6,8,'#3b3a41');px(2,6-walk,6,8,'#3b3a41');
px(-8,-8,16,15,bottom);if(s.bottom===1){px(-8,2,6,6,skin);px(2,2,6,6,skin)}if(s.bottom===2){px(-10,0,20,8,bottom)}
px(-10,-13,20,15,shirt);px(-12,-10,4,12,skin);px(8,-10,4,12,skin);
if(s.shirt===1){px(-2,-13,4,15,'#e5dfd0')}if(s.shirt===2){px(-10,-16,20,4,shirt)}if(s.shirt===3){px(-1,-10,2,10,'#e9ddc9');px(-1,-5,2,2,'#5a5b5b')}if(s.shirt===4){px(-7,-11,14,3,'#ffffff35')}
px(-7,-29,14,16,skin);px(-9,-30,18,6,hair);
if(s.hairStyle===1){px(-10,-26,4,15,hair);px(6,-26,4,15,hair)}
if(s.hairStyle===2){px(-11,-27,5,29,hair);px(6,-27,5,29,hair)}
if(s.hairStyle===3){for(let i=0;i<5;i++)px(-12+i*5,-33+(i%2)*2,6,7,hair);px(-12,-27,4,11,hair);px(8,-27,4,11,hair)}
if(s.hairStyle===4){px(7,-25,7,17,hair);px(11,-13,4,9,hair)}
if(s.hairStyle===5){px(-8,-30,16,3,hair)}
if(dir==='down'){px(-4,-22,3,3,palettes.eyes[s.eyes]);px(2,-22,3,3,palettes.eyes[s.eyes]);px(-1,-17,2,1,'#a16d5c')}
if(dir==='left'||dir==='right'){px(dir==='left'?-5:3,-22,3,3,palettes.eyes[s.eyes])}
if(dir==='up'){px(-7,-27,14,12,hair)}
}
function renderPreview(){modal.querySelector('#hairPreviewName').textContent=hairstyleLabels[state.hairStyle]||'Short';const p=preview.getContext('2d');p.clearRect(0,0,120,144);p.fillStyle='#a9cba8';p.fillRect(0,0,120,144);p.fillStyle='#91b491';p.fillRect(0,116,120,28);draw(p,60,119,state,dirs[facing],0,1.45)}
for(const k of Object.keys(defaults)){const el=modal.querySelector('#c-'+k);if(!el)continue;el.value=state[k];el.addEventListener('input',()=>{state[k]=typeof defaults[k]==='number'?Number(el.value):el.value;renderPreview()})}
modal.querySelector('#rotateSprite').onclick=()=>{facing=(facing+1)%4;renderPreview()};
function changeHair(delta){state.hairStyle=(Number(state.hairStyle)+delta+hairstyleLabels.length)%hairstyleLabels.length;modal.querySelector('#c-hairStyle').value=state.hairStyle;renderPreview()}
modal.querySelector('#hairPrevious').onclick=()=>changeHair(-1);
modal.querySelector('#hairNext').onclick=()=>changeHair(1);
function open(){for(const k of Object.keys(defaults)){const el=modal.querySelector('#c-'+k);if(el)el.value=state[k]}modal.style.display='flex';renderPreview()}
function close(){modal.style.display='none';window.dispatchEvent(new Event('roots-character-close'))}
modal.querySelector('#creatorSave').onclick=()=>{state.name=state.name.trim()||'Director';localStorage.setItem(SK,JSON.stringify(state));close()};
modal.querySelector('#creatorCancel').onclick=()=>{if(localStorage.getItem(SK))close();else{state={...defaults};localStorage.setItem(SK,JSON.stringify(state));close()}};
window.RootsCharacter={draw,get:()=>state,open,exists:()=>!!localStorage.getItem(SK)};
if(!localStorage.getItem(SK))open();else close();
})();
