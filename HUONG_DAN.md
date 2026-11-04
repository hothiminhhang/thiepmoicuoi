# HƯỚNG DẪN NHANH — THIỆP CƯỚI `thiepmoicuoiVanBThiA`

## Thông tin demo hiện tại
- Cô dâu: **MinHan**
- Chú rể: **Chồng của MinHan**
- Địa điểm tạm: **Yên Dũng, TP. Bắc Ninh**
- Nhạc: `music/Hon-Ca-Yeu-Duc-Phuc.mp3`

## Cập nhật dữ liệu bằng Google Sheets
1. Tạo Google Sheets mới.
2. Mở **Extensions > Apps Script**.
3. Dán toàn bộ nội dung file `Code.gs`.
4. Chạy hàm `setupWeddingSheets()` một lần để tạo 3 tab.
5. Triển khai **Web app** và dán URL `/exec` vào `config.js`.

## Đưa web lên GitHub Pages
1. Tạo repository mới tên `thiepmoicuoiVanBThiA`.
2. Tải toàn bộ file trong thư mục này lên repository.
3. Vào **Settings > Pages**.
4. Chọn `Deploy from a branch` > `main` > `/(root)` > Save.
5. Chờ GitHub Pages cấp link public.

## Lưu ý về nhạc
- Bạn đã có file `Hon-Ca-Yeu-Duc-Phuc.mp3`.
- Hãy để file đó trong đúng thư mục `music/`.
- Khi khách nhấn **Mở thiệp mời**, web sẽ thử phát nhạc ngay.

## Nếu CSV lỗi font
File `Du_lieu_mau.csv` trong bộ mới đã được lưu với **UTF-8 BOM** để giảm lỗi font khi mở bằng Excel.
Nếu vẫn lỗi trên máy của bạn, hãy nhập file vào Google Sheets thay vì mở trực tiếp bằng Excel.
