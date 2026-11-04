/**
 * GOOGLE APPS SCRIPT — THIỆP CƯỚI 24/7
 * Mở Google Sheets > Tiện ích mở rộng > Apps Script, dán toàn bộ mã này.
 * Chạy setupWeddingSheets() 1 lần và cấp quyền.
 * Triển khai Web app: Execute as Me, Who has access: Anyone.
 */
const CONFIG_TAB = 'Cau_hinh';
const RSVP_TAB = 'Xac_nhan_tham_du';
const WISH_TAB = 'Loi_chuc';
const RSVP_HEADERS = ['Thời gian gửi', 'Họ và tên', 'Tham dự tại', 'Trạng thái tham dự', 'Số người', 'Lời nhắn'];
const WISH_HEADERS = ['Thời gian gửi', 'Họ và tên', 'Lời chúc', 'Duyệt hiển thị'];

function getBook_(){return SpreadsheetApp.getActiveSpreadsheet();}
function setupWeddingSheets(){
  const book=getBook_();
  const config=book.getSheetByName(CONFIG_TAB)||book.insertSheet(CONFIG_TAB);
  if(config.getLastRow()===0){
    config.getRange(1,1,1,3).setValues([['Mã trường','Giá trị (chỉnh cột B)','Ghi chú']]);
    const defaults=[
      ['groom_name','Chồng của MinHan','Tên chú rể'],['bride_name','MinHan','Tên cô dâu'],
      ['wedding_date','2027-12-20T10:30:00+07:00','Ngày đếm ngược ISO, giờ Việt Nam'],
      ['invitation_text','Trân trọng kính mời bạn cùng gia đình đến chung vui trong ngày hạnh phúc của hai chúng tôi.','Lời mời'],
      ['groom_father','Nguyễn Văn A','Bố chú rể'],['groom_mother','Lê Thị B','Mẹ chú rể'],
      ['bride_father','Trần Văn C','Bố cô dâu'],['bride_mother','Phạm Thị D','Mẹ cô dâu'],
      ['groom_family_address','Yên Dũng, TP. Bắc Ninh',''],['bride_family_address','Yên Dũng, TP. Bắc Ninh',''],
      ['event_groom_title','Tiệc cưới nhà trai',''],['event_bride_title','Tiệc cưới nhà gái',''],
      ['event_groom_datetime','2027-12-19T16:00:00+07:00','Ngày giờ ISO'],
      ['event_bride_datetime','2027-12-20T10:30:00+07:00','Ngày giờ ISO'],
      ['event_groom_location','Yên Dũng, TP. Bắc Ninh',''],['event_bride_location','Yên Dũng, TP. Bắc Ninh',''],
      ['groom_map_address','Yên Dũng, TP. Bắc Ninh','Địa chỉ Google Maps tìm kiếm'],
      ['bride_map_address','Yên Dũng, TP. Bắc Ninh','Địa chỉ Google Maps tìm kiếm'],
      ['groom_map_link','','Link chỉ đường tùy chọn; để trống sẽ tự tạo'],['bride_map_link','',''],
      ['hero_photo','','URL ảnh cưới mở đầu (HTTPS ảnh trực tiếp)'],
      ['music_url','music/Hon-Ca-Yeu-Duc-Phuc.mp3','Đường dẫn MP3 trong thư mục music (cần có quyền sử dụng)'],
      ['album_1','','Link ảnh trực tiếp https://...jpg/png'],['album_2','',''],['album_3','',''],['album_4','',''],['album_5','',''],['album_6','',''],
      ['groom_qr_image','','Link ảnh mã QR trực tiếp'],['bride_qr_image','',''],
      ['groom_bank','Chưa cập nhật','Ngân hàng, chủ tài khoản, STK'],['bride_bank','Chưa cập nhật',''],
      ['public_wishes','TRUE','TRUE: hiện lời chúc đã duyệt; FALSE: ẩn lời chúc']
    ];
    config.getRange(2,1,defaults.length,3).setValues(defaults);
  } else {
    const keys=config.getRange(2,1,Math.max(1,config.getLastRow()-1),1).getDisplayValues().flat();
    if(!keys.includes('hero_photo'))config.appendRow(['hero_photo','','URL ảnh cưới mở đầu (HTTPS ảnh trực tiếp)']);
    if(!keys.includes('music_url'))config.appendRow(['music_url','music/Hon-Ca-Yeu-Duc-Phuc.mp3','Đường dẫn MP3 được phép sử dụng']);
  }
  const rsvp=book.getSheetByName(RSVP_TAB)||book.insertSheet(RSVP_TAB);
  const wish=book.getSheetByName(WISH_TAB)||book.insertSheet(WISH_TAB);
  if(rsvp.getLastRow()===0)rsvp.appendRow(RSVP_HEADERS);
  if(wish.getLastRow()===0)wish.appendRow(WISH_HEADERS);
  [config,rsvp,wish].forEach(sh=>{sh.setFrozenRows(1);sh.getRange(1,1,1,sh.getLastColumn()).setFontWeight('bold').setBackground('#f3d7e5').setFontColor('#7a5164');sh.autoResizeColumns(1,sh.getLastColumn())});
  book.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
  SpreadsheetApp.getUi().alert('Đã tạo 3 tab: Cau_hinh, Xac_nhan_tham_du, Loi_chuc.');
}
function readConfig_(){const sheet=getBook_().getSheetByName(CONFIG_TAB);if(!sheet)throw new Error('Chạy setupWeddingSheets trước.');const rows=sheet.getDataRange().getDisplayValues();const out={};for(let i=1;i<rows.length;i++){const k=String(rows[i][0]||'').trim();if(k)out[k]=String(rows[i][1]||'');}return out;}
function safeJson_(value){return JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');}
function doGet(e){
  try{
    const action=String(e.parameter.action||'config'),cb=String(e.parameter.callback||'');let payload;
    if(action==='config')payload={ok:true,data:readConfig_()};
    else if(action==='wishes'){
      const sh=getBook_().getSheetByName(WISH_TAB);const rows=sh?sh.getDataRange().getDisplayValues().slice(1):[];
      const approved=rows.filter(r=>String(r[3]).trim().toUpperCase()==='TRUE').slice(-30).reverse();
      payload={ok:true,data:approved.map(r=>({name:r[1],message:r[2]}))};
    }else payload={ok:false,error:'Hành động không được hỗ trợ'};
    if(cb){if(!/^[A-Za-z_$][\w$]{0,90}$/.test(cb))throw new Error('Callback không hợp lệ');return ContentService.createTextOutput(cb+'('+safeJson_(payload)+');').setMimeType(ContentService.MimeType.JAVASCRIPT)}
    return ContentService.createTextOutput(safeJson_(payload)).setMimeType(ContentService.MimeType.JSON);
  }catch(err){const cb=String((e&&e.parameter&&e.parameter.callback)||'');const p={ok:false,error:String(err.message||err)};
    if(/^[A-Za-z_$][\w$]{0,90}$/.test(cb))return ContentService.createTextOutput(cb+'('+safeJson_(p)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
    return ContentService.createTextOutput(safeJson_(p)).setMimeType(ContentService.MimeType.JSON);
  }
}
function sanitize_(v,max){const s=String(v||'').trim().slice(0,max).replace(/[\u0000-\u001f]/g,' ');return /^[=+@-]/.test(s)?"'"+s:s}
function doPost(e){
  const nonce=sanitize_(e&&e.parameter&&e.parameter.nonce,100);let response;
  try{
    const p=e.parameter||{};const type=String(p.action||'');
    const name=sanitize_(p.guest_name,80);if(name.length<2)throw new Error('Vui lòng nhập họ tên hợp lệ.');
    const lock=LockService.getScriptLock();lock.waitLock(15000);
    try{
      const book=getBook_();const now=new Date();
      if(type==='rsvp'){
        const side=sanitize_(p.side,30),attendance=sanitize_(p.attendance,30),count=Number(p.guest_count);
        if(!['Nhà trai','Nhà gái','Cả hai'].includes(side))throw new Error('Chọn nơi tham dự.');
        if(!['Có tham dự','Không tham dự','Chưa chắc chắn'].includes(attendance))throw new Error('Chọn trạng thái tham dự.');
        if(!Number.isInteger(count)||count<0||count>20)throw new Error('Số người phải từ 0 đến 20.');
        book.getSheetByName(RSVP_TAB).appendRow([now,name,side,attendance,count,sanitize_(p.note,500)]);
      }else if(type==='wish'){
        const message=sanitize_(p.message,1000);if(message.length<2)throw new Error('Vui lòng nhập lời chúc.');
        book.getSheetByName(WISH_TAB).appendRow([now,name,message,'FALSE']);
      }else throw new Error('Hành động không hợp lệ.');
      response={type:'wedding-form-result',ok:true,nonce};
    }finally{lock.releaseLock()}
  }catch(err){response={type:'wedding-form-result',ok:false,error:String(err.message||err),nonce};}
  const html='<!doctype html><html><body><script>window.parent.postMessage('+safeJson_(response)+',"*");<\/script></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
