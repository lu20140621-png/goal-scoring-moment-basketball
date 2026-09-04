'use strict';
(() => {
  let passMode=false;
  let passFrom=null;
  let fanBusy=false;
  const coreRender=render;

  function fanPlayable(card,h){
    if(!h||h.team!=='blue'||busy||fanBusy||G.roundOver||G.matchOver)return false;
    if(card==='TWO'||card==='THREE')return true;
    if(card==='FT'&&roleReady(h,'MID_RANGE'))return true;
    return false;
  }

  function fanBadge(card,h){
    if(card==='TWO'&&roleReady(h,'FINISHER'))return 'FINISHER READY';
    if(card==='THREE'&&roleReady(h,'SHARPSHOOTER'))return 'SHARPSHOOTER READY';
    if(card==='FT'&&roleReady(h,'MID_RANGE'))return 'MID-RANGE READY';
    return '';
  }

  function fanLayout(n,i){
    if(n<=1)return{x:0,rot:0,y:0};
    const width=Math.min(window.innerWidth-48,920);
    const maxStep=window.innerWidth<760?40:58;
    const step=Math.min(maxStep,Math.max(24,(width-130)/(n-1)));
    const mid=(n-1)/2;
    const x=(i-mid)*step;
    const rot=(i-mid)*(n>9?3.0:3.8);
    const y=Math.abs(i-mid)*(n>9?3.2:4.5);
    return{x,rot,y};
  }

  function clearPassTargets(){
    const root=ELEM('blueRoles');
    if(!root)return;
    [...root.children].forEach(el=>{
      el.classList.remove('passTarget');
      el.onclick=null;
    });
  }

  function wirePassTargets(){
    clearPassTargets();
    if(!passMode||!G)return;
    const h=holder();
    if(!h||h.team!=='blue')return;
    const root=ELEM('blueRoles');
    [...root.children].forEach((el,i)=>{
      const target=G.roles.blue[i];
      if(!target||target.id===h.id)return;
      el.classList.add('passTarget');
      el.onclick=()=>{
        if(busy||fanBusy)return;
        passMode=false;
        passFrom=null;
        clearPassTargets();
        renderFanHand();
        humanPass(target);
      };
    });
  }

  function animateCardToCenter(el){
    return new Promise(resolve=>{
      if(!el){resolve();return;}
      const r=el.getBoundingClientRect();
      const clone=document.createElement('div');
      clone.className='playedCardGhost';
      clone.style.left=r.left+'px';
      clone.style.top=r.top+'px';
      clone.innerHTML=el.innerHTML;
      document.body.appendChild(clone);
      requestAnimationFrame(()=>{
        const tx=window.innerWidth/2-(r.left+r.width/2);
        const ty=window.innerHeight/2-(r.top+r.height/2);
        clone.style.transform=`translate(${tx}px,${ty}px) scale(1.06) rotate(0deg)`;
        clone.style.filter='brightness(1.08)';
      });
      setTimeout(()=>{clone.style.opacity='0';clone.style.transform+=' scale(.92)';},170);
      setTimeout(()=>{clone.remove();resolve();},260);
    });
  }

  async function playFanCard(card,el){
    const h=holder();
    if(!fanPlayable(card,h))return;
    fanBusy=true;
    try{
      if(card==='TWO'){
        let mode='normal';
        if(roleReady(h,'FINISHER')){
          mode=await choose('2-POINT SHOT',`<p>直接打出普通2分，或翻开 <b>FINISHER</b> 让这次2分必进。</p>`,[
            {text:'普通 2-POINT SHOT',value:'normal',cls:'orange'},
            {text:'💥 FINISHER · GUARANTEED',value:'role',cls:'roleBtn'},
            {text:'取消',value:null,cls:'ghost'}
          ]);
        }
        if(!mode)return;
        await animateCardToCenter(el);
        if(mode==='role')return humanPowerShot('TWO','FINISHER');
        return humanShoot('TWO');
      }
      if(card==='THREE'){
        let mode='normal';
        if(roleReady(h,'SHARPSHOOTER')){
          mode=await choose('3-POINTER',`<p>直接打出普通3分，或翻开 <b>SHARPSHOOTER</b> 让这次3分必进。</p>`,[
            {text:'普通 3-POINTER',value:'normal',cls:'orange'},
            {text:'🎯 SHARPSHOOTER · GUARANTEED',value:'role',cls:'roleBtn'},
            {text:'取消',value:null,cls:'ghost'}
          ]);
        }
        if(!mode)return;
        await animateCardToCenter(el);
        if(mode==='role')return humanPowerShot('THREE','SHARPSHOOTER');
        return humanShoot('THREE');
      }
      if(card==='FT'&&roleReady(h,'MID_RANGE')){
        const use=await choose('MID-RANGE SPECIALIST','<p>把这张 FREE THROW 当成普通2分使用？</p>',[
          {text:'📍 FREE THROW → 2-POINT',value:true,cls:'roleBtn'},
          {text:'取消',value:false,cls:'ghost'}
        ]);
        if(!use)return;
        await animateCardToCenter(el);
        return humanMidRange();
      }
    } finally {
      fanBusy=false;
      if(G&&!G.roundOver&&!G.matchOver)renderFanHand();
    }
  }

  function renderFanHand(){
    const dock=ELEM('handDock'),stage=ELEM('fanHand'),title=ELEM('handTitle'),hint=ELEM('handHint'),passBtn=ELEM('handPass');
    if(!dock||!stage)return;
    clearPassTargets();
    stage.innerHTML='';
    dock.classList.remove('aiTurn','passMode');
    if(!G){
      title.textContent='等待比赛开始';
      hint.textContent='选择人数后进入球场';
      passBtn.disabled=true;
      stage.innerHTML='<div class="fanEmpty">比赛开始后，当前持球人的手牌会在这里以扇形展开。</div>';
      return;
    }
    const h=holder();
    if(!h){
      title.textContent='等待首次球权';
      hint.textContent='石头剪刀布后显示当前手牌';
      passBtn.disabled=true;
      stage.innerHTML='<div class="fanEmpty">🏀 等待首攻决定</div>';
      return;
    }
    if(h.team!=='blue'){
      passMode=false;passFrom=null;
      dock.classList.add('aiTurn');
      title.textContent='RED · AI 持球';
      hint.textContent='等待AI完成进攻；需要你防守时会弹出响应。';
      passBtn.disabled=true;
      stage.innerHTML='<div class="fanEmpty">AI THINKING…</div>';
      return;
    }
    if(passFrom&&passFrom!==h.id){passMode=false;passFrom=null;}
    title.textContent=`${h.label} · YOUR HAND`;
    hint.textContent='直接点击亮起的卡牌出牌；灰色牌需要对应时机。';
    passBtn.disabled=busy||fanBusy||G.roles.blue.length<2;
    passBtn.classList.toggle('active',passMode);
    dock.classList.toggle('passMode',passMode);

    const hand=h.hand.slice();
    hand.forEach((card,i)=>{
      const b=document.createElement('button');
      const p=fanLayout(hand.length,i);
      const playable=fanPlayable(card,h)&&!passMode;
      b.type='button';
      b.className=`fanCard ${playable?'playable':'locked'}`;
      b.style.setProperty('--x',p.x+'px');
      b.style.setProperty('--rot',p.rot+'deg');
      b.style.setProperty('--y',p.y+'px');
      b.style.setProperty('--z',String(10+i));
      b.title=playable?`点击打出 ${NAME[card]}`:`${NAME[card]}：当前时机不能直接使用`;
      b.innerHTML=`<img src="${ART[card]}" alt="${NAME[card]}"><span class="fanCardIndex">${i+1}</span>`;
      const badge=fanBadge(card,h);
      if(badge){const s=document.createElement('span');s.className='fanBadge';s.textContent=badge;b.appendChild(s)}
      if(playable)b.onclick=()=>playFanCard(card,b);
      stage.appendChild(b);
    });
    if(!hand.length)stage.innerHTML='<div class="fanEmpty">当前角色没有手牌</div>';
    if(passMode)wirePassTargets();
  }

  const coreRenderActions=renderActions;
  renderActions=function(){
    const root=ELEM('actions');
    if(!root)return;
    root.innerHTML='';
    const panel=root.closest('.actionPanel');
    if(panel)panel.classList.add('handDriven');
    if(!G||G.roundOver||G.matchOver){ELEM('actionTitle').textContent='等待开局';return;}
    const h=holder();
    if(!h){ELEM('actionTitle').textContent='等待首次球权';return;}
    if(h.team!=='blue'){
      ELEM('actionTitle').textContent='AI回合：等待响应';
      return;
    }
    ELEM('actionTitle').textContent=`${h.label} 持球：直接点击下方扇形手牌出牌`;
  };

  render=function(){
    coreRender();
    renderFanHand();
  };

  ELEM('handPass').onclick=()=>{
    const h=holder();
    if(!h||h.team!=='blue'||busy||fanBusy)return;
    passMode=!passMode;
    passFrom=passMode?h.id:null;
    renderFanHand();
  };
  ELEM('cancelPass').onclick=()=>{passMode=false;passFrom=null;renderFanHand();};
  window.addEventListener('resize',()=>{if(G)renderFanHand()});
  renderFanHand();
})();
