(()=>{'use strict';
const SK='roots-heroes-character-v1';
const defaults={name:'Director',gender:'Nonbinary',pronouns:'they/them',skin:2,hairStyle:0,hairColor:1,eyes:1,shirt:0,shirtColor:0,bottom:0,bottomColor:0};
const palettes={skin:['#f5cda8','#dfaa7f','#b97e5b','#8d563c','#613c30','#e9b994'],hair:['#28242b','#5c382c','#a16a3c','#e4b55f','#bcb9b4','#a44a3e','#523b75','#2c6680'],eyes:['#49372d','#3d6c9c','#51865a','#806049','#584a87'],clothes:['#d6a354','#7ca3c7','#b6759e','#6a9c81','#a68bcb','#e6d8c1','#424d61','#cf7565']};
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
#characterCreator .preview button{padding:5px 12px;margin:4px;background:#d5e3db}
@media(max-width:640px){#characterCreator .layout{grid-template-columns:1fr}#characterCreator .preview{display:flex;align-items:center;justify-content:center;gap:12px}#characterCreator canvas{width:110px;height:132px}#characterCreator .fields{grid-template-columns:1fr 1fr}}
</style>
<div class="creator"><h2>Create Your Director</h2><p class="hint">Choose how you want to look in Roots Heroes. You can change your appearance later.</p><div class="layout">
<div class="preview"><div><canvas id="creatorPreview" width="120" height="144"></canvas><p>Pixel sprite preview</p><button type="button" id="rotateSprite">Turn ↻</button></div></div>
<div class="fields">
<label>Name<input id="c-name" maxlength="22" autocomplete="off"></label>
<label>Gender<select id="c-gender"><option>Female</option><option>Male</option><option>Nonbinary</option><option>Prefer not to say</option></select></label>
<label>Pronouns<select id="c-pronouns"><option>she/her</option><option>he/him</option><option>they/them</option></select></label>
<label>Skin tone<select id="c-skin"></select></label>
<label>Hair style<select id="c-hairStyle"><option value="0">Short</option><option value="1">Bob</option><option value="2">Long</option><option value="3">Curly</option><option value="4">Ponytail</option><option value="5">Buzz cut</option></select></label>
<label>Hair color<select id="c-hairColor"></select></label>
<label>Eye color<select id="c-eyes"></select></label>
<label>Shirt style<select id="c-shirt"><option value="0">T-shirt</option><option value="1">Jacket</option><option value="2">Hoodie</option><option value="3">Button-up</option><option value="4">Sweater</option></select></label>
<label>Shirt color<select id="c-shirtColor"></select></label>
<label>Bottoms<select id="c-bottom"><option value="0">Pants</option><option value="1">Shorts</option><option value="2">Skirt</option></select></label>
<label>Bottom color<select id="c-bottomColor"></select></label>
</div></div><div class="buttons"><button class="secondary" id="creatorCancel" type="button">Cancel</button><button id="creatorSave" type="button">Start Exploring</button></div></div>`;
document.body.appendChild(modal);
const selectOptions=(id,labels)=>{const el=modal.querySelector('#c-'+id);labels.forEach((v,i)=>{const o=document.createElement('option');o.value=i;o.textContent=v;el.appendChild(o)})};
selectOptions('skin',['Fair','Light','Medium','Tan','Deep','Warm']);
selectOptions('hairColor',['Black','Dark brown','Chestnut','Blonde','Silver','Auburn','Purple','Blue']);
selectOptions('eyes',['Brown','Blue','Green','Hazel','Violet']);
selectOptions('shirtColor',['Gold','Blue','Pink','Green','Purple','Cream','Charcoal','Coral']);
selectOptions('bottomColor',['Gold','Blue','Pink','Green','Purple','Cream','Charcoal','Coral']);
let facing=0;const dirs=['down','right','up','left'];const preview=modal.querySelector('#creatorPreview');
function draw(ctx,x,y,s,dir='down',step=0,scale=1){
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
function renderPreview(){const p=preview.getContext('2d');p.clearRect(0,0,120,144);p.fillStyle='#a9cba8';p.fillRect(0,0,120,144);p.fillStyle='#91b491';p.fillRect(0,116,120,28);draw(p,60,91,state,dirs[facing],0,3)}
for(const k of Object.keys(defaults)){const el=modal.querySelector('#c-'+k);if(!el)continue;el.value=state[k];el.addEventListener('input',()=>{state[k]=typeof defaults[k]==='number'?Number(el.value):el.value;renderPreview()})}
modal.querySelector('#rotateSprite').onclick=()=>{facing=(facing+1)%4;renderPreview()};
function open(){for(const k of Object.keys(defaults)){const el=modal.querySelector('#c-'+k);if(el)el.value=state[k]}modal.style.display='flex';renderPreview()}
function close(){modal.style.display='none';window.dispatchEvent(new Event('roots-character-close'))}
modal.querySelector('#creatorSave').onclick=()=>{state.name=state.name.trim()||'Director';localStorage.setItem(SK,JSON.stringify(state));close()};
modal.querySelector('#creatorCancel').onclick=()=>{if(localStorage.getItem(SK))close();else{state={...defaults};localStorage.setItem(SK,JSON.stringify(state));close()}};
window.RootsCharacter={draw,get:()=>state,open,exists:()=>!!localStorage.getItem(SK)};
if(!localStorage.getItem(SK))open();else close();
})();
