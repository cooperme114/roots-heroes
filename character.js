(()=>{
'use strict';
const KEY='roots-heroes-character-v1';
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
let state={name:saved.name||'Director',pronouns:saved.pronouns||'they/them',avatar:0};
const modal=document.createElement('div');modal.id='characterCreator';
modal.innerHTML=`<style>
#characterCreator{position:fixed;inset:0;z-index:20;background:#111d25ef;display:none;align-items:center;justify-content:center;padding:14px}
#characterCreator .creator{background:#253b43;color:#f4e3c3;border:3px solid #e6c989;border-radius:14px;padding:22px;width:min(520px,100%);text-align:center}
#characterCreator h2{margin:0 0 8px;color:#ffdf9e}
#characterCreator label{display:block;text-align:left;margin:12px 0;font-size:14px}
#characterCreator input,#characterCreator select{display:block;width:100%;margin-top:5px;padding:9px;border:1px solid #789195;border-radius:6px;background:#15272d;color:white}
#characterCreator button{background:#e8ca87;color:#25343c;border:0;border-radius:7px;padding:10px 16px;font-weight:bold;cursor:pointer;margin:4px}
#characterCreator canvas{image-rendering:pixelated;background:#b4d1b3;border:3px solid #e2d6b6;border-radius:8px}
</style><div class="creator"><h2>Create Your Director</h2><p>The old character sprites have been cleared. Preset avatars are coming next.</p><canvas width="120" height="144" id="creatorPreview"></canvas><label>Name<input id="c-name" maxlength="22"></label><label>Pronouns<select id="c-pronouns"><option>she/her</option><option>he/him</option><option>they/them</option></select></label><button id="creatorCancel">Cancel</button><button id="creatorSave">Start Exploring</button></div>`;
document.body.appendChild(modal);
const preview=modal.querySelector('#creatorPreview');
function draw(ctx,x,y,s,dir='down',step=0,scale=1){
 const block=(dx,dy,w,h,color)=>{ctx.fillStyle=color;ctx.fillRect(Math.round(x+dx*scale),Math.round(y+dy*scale),Math.ceil(w*scale),Math.ceil(h*scale))};
 const stride=step?2:0;
 block(-7,2+stride,6,9,'#242d35');block(1,2-stride,6,9,'#242d35');
 block(-8,-9,16,14,'#4b7593');block(-10,-14,20,15,'#e5b95e');
 block(-12,-12,4,12,'#c58d6a');block(8,-12,4,12,'#c58d6a');
 block(-8,-29,16,16,'#c58d6a');block(-9,-31,18,8,'#50382c');
 if(dir!=='up'){block(dir==='right'?3:-5,-23,3,3,'#24242a');if(dir==='down')block(2,-23,3,3,'#24242a')}
}
function render(){const ctx=preview.getContext('2d');ctx.clearRect(0,0,120,144);ctx.fillStyle='#b4d1b3';ctx.fillRect(0,0,120,144);draw(ctx,60,120,state,'down',0,1.8)}
function open(){modal.querySelector('#c-name').value=state.name;modal.querySelector('#c-pronouns').value=state.pronouns;modal.style.display='flex';render()}
function close(){modal.style.display='none';window.dispatchEvent(new Event('roots-character-close'))}
modal.querySelector('#creatorSave').onclick=()=>{state.name=modal.querySelector('#c-name').value.trim()||'Director';state.pronouns=modal.querySelector('#c-pronouns').value;localStorage.setItem(KEY,JSON.stringify(state));close()};
modal.querySelector('#creatorCancel').onclick=()=>{if(!localStorage.getItem(KEY))localStorage.setItem(KEY,JSON.stringify(state));close()};
window.RootsCharacter={draw,get:()=>state,open,exists:()=>!!localStorage.getItem(KEY)};
if(!localStorage.getItem(KEY))open();
})();