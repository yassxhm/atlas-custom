const state={color:"white",size:"S",logoSize:18,x:.5,y:.42};
const screens=[document.getElementById("screen1"),document.getElementById("screen2"),document.getElementById("screen3")];
const stepLabel=document.getElementById("stepLabel");
const stage=document.getElementById("stage"),logo=document.getElementById("logo"),shirt=document.getElementById("shirtImage");
const sizeRange=document.getElementById("logoSize"),sizeValue=document.getElementById("sizeValue"),hint=document.getElementById("hint");

function go(n){screens.forEach((s,i)=>s.classList.toggle("active",i===n-1));stepLabel.textContent=`0${n} / 03`;window.scrollTo({top:0,behavior:"smooth"})}
function applyLogo(){logo.style.width=state.logoSize+"%";logo.style.left=(state.x*100)+"%";logo.style.top=(state.y*100)+"%";sizeRange.value=state.logoSize;sizeValue.textContent=state.logoSize+"%"}
function selectColor(c){
 state.color=c; shirt.src=c==="white"?"assets/shirt-white.jpg":"assets/shirt-black.jpg";
 document.getElementById("modelTitle").textContent=c==="white"?"ATLAS WHITE":"ATLAS BLACK";
 state.x=.5;state.y=.42;state.logoSize=18;applyLogo();go(2);
}
document.querySelectorAll(".product-card").forEach(b=>b.addEventListener("click",()=>selectColor(b.dataset.color)));
document.getElementById("backBtn").onclick=()=>go(1);
document.getElementById("resetBtn").onclick=()=>{state.x=.5;state.y=.42;state.logoSize=18;state.size="S";document.querySelectorAll(".size").forEach(x=>x.classList.toggle("active",x.dataset.size==="S"));applyLogo();hint.style.display="block"};
document.querySelectorAll(".size").forEach(b=>b.onclick=()=>{state.size=b.dataset.size;document.querySelectorAll(".size").forEach(x=>x.classList.toggle("active",x===b))});
sizeRange.oninput=()=>{state.logoSize=+sizeRange.value;applyLogo()};
document.getElementById("minus").onclick=()=>{state.logoSize=Math.max(8,state.logoSize-1);applyLogo()};
document.getElementById("plus").onclick=()=>{state.logoSize=Math.min(34,state.logoSize+1);applyLogo()};

let dragging=false, pointerId=null, offsetX=0, offsetY=0;
function point(e){const r=stage.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top,w:r.width,h:r.height}}
function setPosition(e,center=false){
 const p=point(e);
 if(center){state.x=Math.max(0,Math.min(1,p.x/p.w));state.y=Math.max(0,Math.min(1,p.y/p.h))}
 else {state.x=Math.max(0,Math.min(1,p.x/p.w-offsetX));state.y=Math.max(0,Math.min(1,p.y/p.h-offsetY))}
 applyLogo();hint.style.display="none";
}
stage.addEventListener("pointerdown",e=>{
 if(e.target===logo){dragging=true;pointerId=e.pointerId;logo.classList.add("dragging");logo.setPointerCapture(pointerId);
  const r=stage.getBoundingClientRect(),lr=logo.getBoundingClientRect();
  offsetX=(e.clientX-(lr.left+lr.width/2))/r.width;offsetY=(e.clientY-(lr.top+lr.height/2))/r.height;
 }else setPosition(e,true);
});
stage.addEventListener("pointermove",e=>{if(dragging)setPosition(e,false)});
stage.addEventListener("pointerup",()=>{dragging=false;logo.classList.remove("dragging")});
stage.addEventListener("pointercancel",()=>{dragging=false;logo.classList.remove("dragging")});

document.getElementById("validateBtn").onclick=()=>{
 document.getElementById("summaryModel").textContent=state.color==="white"?"ATLAS WHITE":"ATLAS BLACK";
 document.getElementById("summarySize").textContent=state.size;
 const ss=document.getElementById("summaryShirt"),sl=document.getElementById("summaryLogo");
 ss.src=shirt.src;sl.style.width=state.logoSize+"%";sl.style.left=(state.x*100)+"%";sl.style.top=(state.y*100)+"%";
 go(3);
};
document.getElementById("editBtn").onclick=()=>go(2);
document.getElementById("saveBtn").onclick=()=>{
 localStorage.setItem("atlasCustom",JSON.stringify(state));
 document.getElementById("savedMessage").textContent="Création sauvegardée sur cet appareil.";
};
applyLogo();