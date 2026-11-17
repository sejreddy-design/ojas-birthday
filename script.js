// Mobile navigation
document.querySelectorAll('.menu-btn').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open')));

// Birthday cake: button interaction and optional microphone blow detection
const candles = document.querySelectorAll('.candle');
const blowBtn = document.getElementById('blowBtn');
const relightBtn = document.getElementById('relightBtn');
const micBtn = document.getElementById('micBtn');
const hint = document.getElementById('micHint');
const message = document.getElementById('wishMessage');
function blowCandles(){
  candles.forEach(c=>c.classList.add('out'));
  if(message){message.textContent='✨ Your wish is on its way, Ojas! Happy Birthday! 🎉';}
  if(blowBtn) blowBtn.textContent='🎉 Wish made!';
}
if(blowBtn) blowBtn.addEventListener('click',blowCandles);
if(relightBtn) relightBtn.addEventListener('click',()=>{
  candles.forEach(c=>c.classList.remove('out'));
  if(message) message.textContent='The candles are glowing again. Make another wish!';
  if(blowBtn) blowBtn.textContent='🌬️ Blow out candles';
});
if(micBtn) micBtn.addEventListener('click',async()=>{
  if(!navigator.mediaDevices?.getUserMedia){hint.textContent='Microphone access is not available in this browser. Use the blow-out button instead.';return;}
  try{
    const stream=await navigator.mediaDevices.getUserMedia({audio:true});
    const AudioCtx=window.AudioContext||window.webkitAudioContext;
    const ctx=new AudioCtx(), source=ctx.createMediaStreamSource(stream), analyser=ctx.createAnalyser();
    analyser.fftSize=512;source.connect(analyser);
    const data=new Uint8Array(analyser.fftSize);
    hint.textContent='Microphone is on! Blow towards your microphone now 🌬️';
    let loudCount=0, done=false;
    const listen=()=>{
      if(done)return;
      analyser.getByteTimeDomainData(data);
      let sum=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;sum+=v*v;}
      const rms=Math.sqrt(sum/data.length);
      if(rms>0.13) loudCount++; else loudCount=0;
      if(loudCount>=3){done=true;blowCandles();hint.textContent='We heard that birthday blow! 🎂';stream.getTracks().forEach(t=>t.stop());ctx.close();return;}
      requestAnimationFrame(listen);
    };listen();
  }catch(e){hint.textContent='Microphone permission was not granted. You can still tap “Blow out candles”.';}
});
