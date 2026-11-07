(()=>{
'use strict';
const KEY='roots-heroes-character-v1',COUNT=12;
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
let state={name:saved.name||'Director',pronouns:saved.pronouns||'they/them',avatar:Number.isInteger(+saved.avatar)&&+saved.avatar>=1&&+saved.avatar<=COUNT?+saved.avatar:1};
let draftAvatar=state.avatar;
const cache=new Map();
function sprite(n,dir,frame){
 const key=n+'/'+dir+'_'+frame;
 if(!cache.has(key)){
  const img=new Image();
  const record={img,ready:false,bounds:null};
  img.onload=()=>{
   record.ready=true;
   try{
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
    const cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(img,0,0);
    const a=cx.getImageData(0,0,c.width,c.height).data;
    let minX=c.width,minY=c.height,maxX=-1,maxY=-1;
    for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
     if(a[(y*c.width+x)*4+3]>45){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y)}
    }
    if(maxX>=0)record.bounds={x:minX,y:minY,w:maxX-minX+1,h:maxY-minY+1};
   }catch(e){}
   if(modal.style.display!=='none')render();
  };
  img.src='assets/player/avatars/avatar'+n+'/'+dir+'_'+frame+'.png';
  cache.set(key,record);
 }
 return cache.get(key);
}
function paint(ctx,n,dir,frame,cx,bottom,height){
 const rec=sprite(n,dir,frame);
 if(!rec.ready)return false;
 const b=rec.bounds||{x:0,y:0,w:rec.img.naturalWidth,h:rec.img.naturalHeight};
 const ratio=b.w/b.h,w=height*ratio;
 ctx.imageSmoothingEnabled=false;
 ctx.drawImage(rec.img,b.x,b.y,b.w,b.h,Math.round(cx-w/2),Math.round(bottom-height),Math.round(w),Math.round(height));
 return true;
}
const modal=document.createElement('div');modal.id='characterCreator';
modal.innerHTML=`<style>
#characterCreator{position:fixed;inset:0;z-index:20;background:#111d25f5;display:none;align-items:center;justify-content:center;padding:12px;overflow:auto}
#characterCreator .creator{background:#253b43;color:#f4e3c3;border:3px solid #e6c989;border-radius:14px;padding:18px;width:min(760px,100%);max-height:96vh;overflow:auto;text-align:center}
#characterCreator h2{margin:0 0 6px;color:#ffdf9e}
#characterCreator p{margin:4px 0 12px;font-size:13px}
#characterCreator label{display:block;text-align:left;margin:10px 0;font-size:14px}
#characterCreator input,#characterCreator select{display:block;width:100%;margin-top:5px;padding:9px;border:1px solid #789195;border-radius:6px;background:#15272d;color:white}
#characterCreator button{background:#e8ca87;color:#25343c;border:0;border-radius:7px;padding:10px 16px;font-weight:bold;cursor:pointer;margin:4px}
#characterCreator .avatar-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px;margin:10px 0}
#characterCreator .avatar-option{display:flex;flex-direction:column;align-items:center;gap:2px;padding:5px;background:#142a32;color:#f4e3c3;border:2px solid #496771;border-radius:9px;min-width:0}
#characterCreator .avatar-option.selected{border-color:#ffe098;background:#395057;box-shadow:0 0 0 1px #ffe098}
#characterCreator .avatar-option canvas{width:100%;max-width:88px;height:92px;object-fit:contain;background:transparent}
#characterCreator .avatar-option span{font-size:11px}
#characterCreator .creator-preview{display:flex;justify-content:center;align-items:center;gap:14px}
#characterCreator #creatorPreview{width:112px;height:142px;background:#b4d1b3;border:3px solid #e2d6b6;border-radius:8px}
#characterCreator .creator-preview button{padding:6px 10px}
#characterCreator .fields{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:580px){#characterCreator .avatar-grid{grid-template-columns:repeat(4,minmax(0,1fr))}#characterCreator .fields{grid-template-columns:1fr;gap:0}}
</style>
<div class="creator"><h2>Create Your Director</h2><p>Choose one of your 12 avatars.</p>
<div class="creator-preview"><button type="button" id="avatarPrev" aria-label="Previous avatar">◀</button><canvas width="112" height="142" id="creatorPreview"></canvas><button type="button" id="avatarNext" aria-label="Next avatar">▶</button></div>
<div id="avatarGrid" class="avatar-grid" role="group" aria-label="Choose your avatar"></div>
<div class="fields"><label>Name<input id="c-name" maxlength="22" autocomplete="off"></label><label>Pronouns<select id="c-pronouns"><option>she/her</option><option>he/him</option><option>they/them</option></select></label></div>
<button id="creatorCancel" type="button">Cancel</button><button id="creatorSave" type="button">Start Exploring</button></div>`;
document.body.appendChild(modal);
const preview=modal.querySelector('#creatorPreview'),grid=modal.querySelector('#avatarGrid');
for(let i=1;i<=COUNT;i++){
 const btn=document.createElement('button');btn.type='button';btn.className='avatar-option';btn.dataset.avatar=i;
 const c=document.createElement('canvas');c.width=90;c.height=92;
 const label=document.createElement('span');label.textContent='Avatar '+i;
 btn.append(c,label);btn.onclick=()=>{draftAvatar=i;render()};
 grid.append(btn);
}
function render(){
 const ctx=preview.getContext('2d');ctx.clearRect(0,0,112,142);ctx.fillStyle='#b4d1b3';ctx.fillRect(0,0,112,142);
 paint(ctx,draftAvatar,'front','idle_1',56,135,122);
 for(const btn of grid.children){
  const n=+btn.dataset.avatar;btn.classList.toggle('selected',n===draftAvatar);
  btn.setAttribute('aria-pressed',String(n===draftAvatar));
  const c=btn.querySelector('canvas'),cc=c.getContext('2d');cc.clearRect(0,0,c.width,c.height);
  paint(cc,n,'front','idle_1',45,89,84);
 }
}
function draw(ctx,x,y,s,dir='down',step=0,scale=1){
 const direction={down:'front',up:'back',left:'left',right:'right'}[dir]||'front';
 const frames=['idle_1','walk_1','idle_2','walk_2'];
 const frame=step?frames[Math.floor(Date.now()/140)%frames.length]:'idle_1';
 if(!paint(ctx,s.avatar||1,direction,frame,x,y+12*scale,55*scale)){
  ctx.fillStyle='#e5b95e';ctx.fillRect(x-8*scale,y-20*scale,16*scale,28*scale);
 }
}
function open(){draftAvatar=state.avatar;modal.querySelector('#c-name').value=state.name;modal.querySelector('#c-pronouns').value=state.pronouns;modal.style.display='flex';render()}
function close(){modal.style.display='none';window.dispatchEvent(new Event('roots-character-close'))}
modal.querySelector('#avatarPrev').onclick=()=>{draftAvatar=draftAvatar===1?COUNT:draftAvatar-1;render()};
modal.querySelector('#avatarNext').onclick=()=>{draftAvatar=draftAvatar===COUNT?1:draftAvatar+1;render()};
modal.querySelector('#creatorSave').onclick=()=>{state={name:modal.querySelector('#c-name').value.trim()||'Director',pronouns:modal.querySelector('#c-pronouns').value,avatar:draftAvatar};localStorage.setItem(KEY,JSON.stringify(state));close()};
modal.querySelector('#creatorCancel').onclick=()=>{if(!localStorage.getItem(KEY))localStorage.setItem(KEY,JSON.stringify(state));close()};
window.RootsCharacter={draw,get:()=>state,open,exists:()=>!!localStorage.getItem(KEY)};
if(!localStorage.getItem(KEY))open();
})();