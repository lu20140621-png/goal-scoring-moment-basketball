'use strict';
(() => {
  let aiTimer=null;
  let turnSerial=0;
  let lastProgress=Date.now();
  let recovering=false;

  const coreLog=log;
  const coreAiTurn=aiTurn;

  function markProgress(){lastProgress=Date.now()}

  log=function(msg,cls=''){
    markProgress();
    return coreLog(msg,cls);
  };

  async function recoverFromAIError(err){
    if(recovering||!G||G.roundOver||G.matchOver)return;
    recovering=true;
    try{
      console.error('[Strategy AI recovery]',err);
      const h=holder();
      if(h&&h.team==='red'){
        coreLog('<b>AI回合异常已自动恢复</b>：跳过本次异常动作并把正常球权交给 BLUE。','special');
        busy=false;
        normalPossession('blue');
      }else{
        busy=false;
        render();
      }
    }finally{
      markProgress();
      setTimeout(()=>{recovering=false},300);
    }
  }

  aiTurn=async function(){
    try{
      markProgress();
      return await coreAiTurn();
    }catch(err){
      return recoverFromAIError(err);
    }
  };

  scheduleTurn=function(){
    if(!G||G.roundOver||G.matchOver)return;
    const h=holder();
    if(!h)return;
    clearTimeout(aiTimer);
    const serial=++turnSerial;
    const holderId=h.id;
    markProgress();
    setStatus(`${h.label} 持球`,h.team==='blue'?'你可以行动':'AI正在计算最优动作');
    if(h.team==='blue'){
      busy=false;
      renderActions();
      if(typeof renderFanHand==='function')renderFanHand();
      return;
    }
    busy=true;
    renderActions();
    aiTimer=setTimeout(async()=>{
      if(!G||G.roundOver||G.matchOver||serial!==turnSerial)return;
      const now=holder();
      if(!now||now.id!==holderId||now.team!=='red')return;
      await aiTurn();
    },520);
  };

  function modalIsOpen(){
    const o=ELEM('overlay');
    return !!(o&&o.classList.contains('show'));
  }

  setInterval(()=>{
    if(!G||G.roundOver||G.matchOver||modalIsOpen()||recovering)return;
    const h=holder();
    if(!h)return;
    const idle=Date.now()-lastProgress;

    if(h.team==='blue'&&busy&&idle>4500){
      busy=false;
      coreLog('<b>回合锁定已自动解除</b>，你可以继续出牌或PASS。','special');
      markProgress();
      render();
      return;
    }

    if(h.team==='red'&&idle>6500){
      coreLog('<b>AI响应超时，正在自动恢复回合…</b>','special');
      markProgress();
      clearTimeout(aiTimer);
      const serial=++turnSerial;
      const holderId=h.id;
      aiTimer=setTimeout(async()=>{
        if(!G||G.roundOver||G.matchOver||modalIsOpen()||serial!==turnSerial)return;
        const now=holder();
        if(!now||now.id!==holderId||now.team!=='red')return;
        await aiTurn();
      },120);
    }
  },1000);

  window.addEventListener('unhandledrejection',e=>{
    console.error('[Strategy unhandled rejection]',e.reason);
  });
})();
