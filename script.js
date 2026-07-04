const data={special:{title:"SPECIAL DEALS",items:[["VAPORESSO XROS PRO 2 + 4 ELUX NIC SALTS","Pod kit bundle","£30",[]],["2 XROS PODS + 6 ELUX NIC SALTS","Pods and liquids bundle","£20",[]],["2 HAYATI PRO ULTRA 25K","25K disposable bundle","£25",[]],["3 ELUX LEGEND 3500","3.5K disposable bundle","£10",[]],["2 LOST MARY BM6000 + 1 HAYATI 25K","Mixed disposable bundle","£30",[]],["10 PABLO NICOPODS","Nicotine pouch bundle","£30",[]]]},disposable:{title:"DISPOSABLE VAPES",items:[["LOST MARY BM6000","Tap to view flavours","£10",["Raspberry Peach","Blue Razz Ice","Cherry Ice","Triple Mango","Strawberry Ice"]],["HAYATI PRO ULTRA 25K","Tap to view flavours","£15",["Blueberry H'Bubba / Watermelon H'Bubba","Mr Blue","Strawberry Cranberry Cherry"]],["ELUX LEGEND 3500","Tap to view flavours","£5",["Strawberry Raspberry Cherry Ice"]]]},podkits:{title:"POD KITS",items:[["VAPORESSO XROS PRO 2","Starter pod kit","£20",["Black colour option"]]]},salts:{title:"NIC SALTS",items:[["ELUX LEGEND NIC SALT","20mg nic salt","£5",["Blueberry Cherry Cranberry","Triple Mango"]]]},pods:{title:"REPLACEMENT PODS",items:[["XROS REPLACEMENT PODS","Compatible Vaporesso pods","£5",["0.4Ω pod","0.6Ω pod","0.8Ω pod"]]]},pouches:{title:"NICOTINE POUCHES",items:[["PABLO EXCLUSIVE ORANGE","50mg nicotine pouches","£5",["Orange"]],["VELO","Nicotine pouches","£5",["Minty Lemon"]]]}};

const menu=document.querySelector('.menu-visual');
const float=document.querySelector('.floating-order');
const panel=document.getElementById('live-panel');
const panelTitle=document.getElementById('panelTitle');
const panelContent=document.getElementById('panelContent');

function revealOnScroll(){
  if(menu && menu.getBoundingClientRect().top < window.innerHeight*0.82) menu.classList.add('reveal');
  if(window.scrollY>220) float.classList.add('show'); else float.classList.remove('show');
}
window.addEventListener('scroll',revealOnScroll,{passive:true}); revealOnScroll();

document.querySelectorAll('[data-scroll]').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelector(btn.dataset.scroll).scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>float.classList.add('show'),500);
}));

document.querySelectorAll('.cat').forEach(btn=>btn.addEventListener('click',()=>{
  openCategory(btn.dataset.category);
}));

document.getElementById('closePanel').addEventListener('click',()=>{
  panel.classList.remove('open');
  panel.style.display='none';
  document.getElementById('menu').scrollIntoView({behavior:'smooth',block:'start'});
});

function openCategory(key){
  const section=data[key];
  panelTitle.textContent=section.title;
  panelContent.innerHTML=section.items.map((it,i)=>`
    <article class="item-card" style="animation-delay:${i*0.045}s">
      <div class="item-top">
        <div>
          <div class="item-title">${it[0]}</div>
          <div class="item-sub">${it[1]}</div>
          ${it[3].length?'<div class="tap">Tap to view flavours</div>':''}
        </div>
        <div class="price">${it[2]}</div>
      </div>
      ${it[3].length?`<div class="flavours"><div class="flavour-list">${it[3].map(f=>`<div>${f}</div>`).join('')}</div></div>`:''}
    </article>`).join('');
  panel.style.display='block';
  requestAnimationFrame(()=>panel.classList.add('open'));
  panel.scrollIntoView({behavior:'smooth',block:'start'});
  float.classList.add('show');
  document.querySelectorAll('.item-card').forEach(card=>card.addEventListener('click',()=>card.classList.toggle('open')));
}