const DEMO={
  groom_name:'Chồng của MinHan',
  bride_name:'MinHan',
  wedding_date:'2027-12-20T10:30:00+07:00',
  invitation_text:'Trân trọng kính mời bạn cùng gia đình đến chung vui trong ngày hạnh phúc của hai chúng tôi.',
  groom_father:'Nguyễn Văn A',groom_mother:'Lê Thị B',bride_father:'Trần Văn C',bride_mother:'Phạm Thị D',
  groom_family_address:'Yên Dũng, TP. Bắc Ninh',bride_family_address:'Yên Dũng, TP. Bắc Ninh',
  event_groom_title:'Tiệc cưới nhà trai',event_bride_title:'Tiệc cưới nhà gái',
  event_groom_datetime:'2027-12-19T16:00:00+07:00',event_bride_datetime:'2027-12-20T10:30:00+07:00',
  event_groom_location:'Yên Dũng, TP. Bắc Ninh',event_bride_location:'Yên Dũng, TP. Bắc Ninh',
  groom_map_address:'Yên Dũng, TP. Bắc Ninh',bride_map_address:'Yên Dũng, TP. Bắc Ninh',
  groom_map_link:'',bride_map_link:'',hero_photo:'',music_url:'music/Hon-Ca-Yeu-Duc-Phuc.mp3',
  album_1:'',album_2:'',album_3:'',album_4:'',album_5:'',album_6:'',
  groom_qr_image:'',bride_qr_image:'',groom_bank:'Chưa cập nhật',bride_bank:'Chưa cập nhật',
  public_wishes:'TRUE'
};
let DATA={...DEMO};
const API=(window.WEDDING_API_URL||'').trim();
const el=id=>document.getElementById(id);
const asText=v=>String(v==null?'':v);
function safeUrl(url){try{const u=new URL(url);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function dateLabel(value){const d=new Date(value);return Number.isNaN(d.getTime())?asText(value):new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',minute:'2-digit',day:'2-digit',month:'2-digit',year:'numeric'}).format(d)}
function mapLink(address,link){return safeUrl(link)||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address||'Yên Dũng, TP. Bắc Ninh')}
function embedMap(address){return 'https://maps.google.com/maps?q='+encodeURIComponent(address||'Yên Dũng, TP. Bắc Ninh')+'&output=embed'}
function renderMusic(){
  const audio=el('weddingMusic'),button=el('musicToggle');
  const musicPath=asText(DATA.music_url).trim()||DEMO.music_url;
  const url=safeUrl(musicPath)||(/^(?![\w+.-]+:)(?!\/\/)[\w./-]+\.(mp3|m4a|ogg)$/i.test(musicPath)?new URL(musicPath,location.href).href:'');
  if(audio.dataset.source!==url){audio.pause();audio.removeAttribute('src');audio.dataset.source=url;if(url)audio.src=url;audio.load()}
  button.classList.toggle('playing',!audio.paused);
  button.setAttribute('aria-label',audio.paused?'Bật nhạc cưới':'Tắt nhạc cưới');
}
function render(){
  const photo=el('heroPhotoImage'),placeholder=el('heroPhotoPlaceholder'),photoUrl=safeUrl(DATA.hero_photo);
  photo.hidden=!photoUrl;placeholder.hidden=!!photoUrl;
  if(photoUrl){photo.src=photoUrl;photo.onerror=()=>{photo.hidden=true;placeholder.hidden=false;}} else photo.removeAttribute('src');
  renderMusic();
  document.querySelectorAll('[data-field]').forEach(x=>x.textContent=asText(DATA[x.dataset.field]||DEMO[x.dataset.field]||''));
  const wd=new Date(DATA.wedding_date);el('heroDate').textContent=Number.isNaN(wd.getTime())?'Ngày cưới sẽ cập nhật':new Intl.DateTimeFormat('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',year:'numeric'}).format(wd).replaceAll('/',' • ');
  el('groomTime').textContent=dateLabel(DATA.event_groom_datetime);el('brideTime').textContent=dateLabel(DATA.event_bride_datetime);
  el('footerNames').textContent=DATA.groom_name+' & '+DATA.bride_name;
  document.title='Thiệp cưới | '+DATA.groom_name+' & '+DATA.bride_name;
  [['Groom','groom'],['Bride','bride']].forEach(([suffix,key])=>{
    const addr=asText(DATA[key+'_map_address']||DATA['event_'+key+'_location']);
    el('map'+suffix+'Address').textContent=asText(DATA['event_'+key+'_location']);
    el('map'+suffix).src=embedMap(addr);
    el('link'+suffix).href=mapLink(addr,DATA[key+'_map_link']);
    const qr=safeUrl(DATA[key+'_qr_image']);el('qr'+suffix).hidden=!qr;if(qr)el('qr'+suffix).src=qr;
    el(key+'Bank').textContent=asText(DATA[key+'_bank']||'Chưa cập nhật');
  });
  const gallery=el('gallery');gallery.replaceChildren();
  for(let i=1;i<=6;i++){
    const item=document.createElement('div');item.className='gallery-item';const url=safeUrl(DATA['album_'+i]);
    if(url){const img=document.createElement('img');img.src=url;img.loading='lazy';img.alt='Ảnh cưới '+i;img.onerror=()=>{img.remove();item.textContent='Ảnh cưới '+i};item.append(img)}
    else item.innerHTML='<span>Ảnh cưới '+i+'</span>';
    gallery.append(item);
  }
}
function updateCountdown(){const then=new Date(DATA.wedding_date).getTime(),diff=Math.max(0,then-Date.now());if(!Number.isFinite(then))return;
  const items={days:Math.floor(diff/864e5),hours:Math.floor(diff/36e5)%24,minutes:Math.floor(diff/6e4)%60,seconds:Math.floor(diff/1e3)%60};Object.entries(items).forEach(([id,val])=>el(id).textContent=String(val).padStart(2,'0'))}
function jsonp(action,timeout=12000){return new Promise((resolve,reject)=>{
  if(!API)return reject(new Error('Chưa cấu hình API'));
  const cb='__weddingCb'+Math.random().toString(36).slice(2),src=new URL(API),script=document.createElement('script');let done=false;
  const cleanup=()=>{clearTimeout(timer);script.remove();delete window[cb]};
  window[cb]=(result)=>{if(done)return;done=true;cleanup();result&&result.ok?resolve(result):reject(new Error(result?.error||'Không nhận được dữ liệu'))};
  src.searchParams.set('action',action);src.searchParams.set('callback',cb);script.src=src.toString();script.onerror=()=>{if(!done){done=true;cleanup();reject(new Error('Không truy cập được Google Apps Script'))}};
  const timer=setTimeout(()=>{if(!done){done=true;cleanup();reject(new Error('Kết nối quá thời gian'))}},timeout);document.head.append(script);
})}
async function loadContent(){if(!API)return;try{const res=await jsonp('config');DATA={...DEMO,...res.data};render();updateCountdown();el('demoBadge').textContent='THIỆP CƯỚI';}catch(err){console.warn('Dùng dữ liệu demo:',err.message);el('demoBadge').textContent='CHẾ ĐỘ DEMO · KIỂM TRA KẾT NỐI GOOGLE SHEETS'}}
function renderWishes(wishes){const holder=el('wishList');holder.replaceChildren();if(!wishes.length){const p=document.createElement('p');p.className='muted';p.textContent='Chưa có lời chúc được công khai.';holder.append(p);return}
  wishes.forEach(row=>{const item=document.createElement('div');item.className='wish-item';const name=document.createElement('strong');name.textContent=asText(row.name);const msg=document.createElement('p');msg.textContent=asText(row.message);item.append(name,msg);holder.append(item)})}
async function loadWishes(){if(!API||String(DATA.public_wishes).toUpperCase()==='FALSE')return;try{const res=await jsonp('wishes');renderWishes(res.data||[])}catch(err){console.warn('Không tải được lời chúc:',err.message)}}
function submitViaIframe(type,payload){return new Promise((resolve,reject)=>{
  if(!API){return reject(new Error('Đang ở bản demo. Hãy kết nối Google Apps Script để lưu vào Google Sheets.'))}
  const id='weddingFrame'+Math.random().toString(36).slice(2),nonce=Math.random().toString(36).slice(2);let settled=false;
  const frame=document.createElement('iframe');frame.name=id;frame.hidden=true;frame.style.display='none';
  const form=document.createElement('form');form.method='POST';form.action=API;form.target=id;form.style.display='none';
  const fields={...payload,action:type,nonce};for(const [k,v] of Object.entries(fields)){const input=document.createElement('input');input.type='hidden';input.name=k;input.value=String(v);form.append(input)}
  const clear=()=>{clearTimeout(timer);window.removeEventListener('message',onMessage);setTimeout(()=>{form.remove();frame.remove()},150)};
  function onMessage(event){if(!/^https:\/\/(script\.google\.com|script\.googleusercontent\.com|[a-z0-9.-]*googleusercontent\.com)$/.test(event.origin))return;
    const data=event.data;if(!data||data.type!=='wedding-form-result'||data.nonce!==nonce||settled)return;settled=true;clear();data.ok?resolve(data):reject(new Error(data.error||'Không thể lưu dữ liệu'))}
  window.addEventListener('message',onMessage);document.body.append(frame,form);
  const timer=setTimeout(()=>{if(settled)return;settled=true;clear();reject(new Error('Chưa nhận được xác nhận lưu từ Google Sheets. Vui lòng kiểm tra tab dữ liệu trước khi gửi lại.'))},20000);
  form.submit();
})}
function bindForm(formId,type,statusId){const form=el(formId),status=el(statusId);form.addEventListener('submit',async e=>{
  e.preventDefault();if(!form.reportValidity())return;
  const button=form.querySelector('button[type=submit]');button.disabled=true;button.textContent='Đang gửi...';status.className='form-status';status.textContent='Đang lưu vào Google Sheets...';
  try{const payload=Object.fromEntries(new FormData(form).entries());await submitViaIframe(type,payload);status.className='form-status ok';status.textContent='Đã gửi thành công! Cảm ơn bạn 💖';form.reset();if(type==='wish')setTimeout(loadWishes,1200)}
  catch(err){status.className='form-status error';status.textContent=err.message}
  finally{button.disabled=false;button.textContent=type==='rsvp'?'Gửi xác nhận ♥':'Gửi lời chúc ✦'}
})}
render();updateCountdown();setInterval(updateCountdown,1000);
bindForm('rsvpForm','rsvp','rsvpStatus');bindForm('wishForm','wish','wishStatus');
loadContent().then(loadWishes);
el('musicToggle').addEventListener('click',async()=>{
  const audio=el('weddingMusic');
  if(!audio.src||!audio.dataset.source){alert('Chưa tìm thấy đường dẫn nhạc. Hãy kiểm tra music_url trong Google Sheets.');return}
  if(!audio.paused){audio.pause();renderMusic();return}
  try{await audio.play();renderMusic()}catch(e){alert('Không thể phát nhạc từ URL này. Vui lòng kiểm tra quyền truy cập và định dạng MP3/M4A.');}
});
el('openInvitation').addEventListener('click',()=>{
  const audio=el('weddingMusic');
  if(audio.dataset.source && audio.paused){audio.play().then(renderMusic).catch(()=>{});} 
});
