# THIỆP CƯỚI VĂN CÔNG – THU HÀ | BẢN NÂNG CẤP TỪ WEBSITE CŨ

## Đã tích hợp
- Tên: Văn Công – Thu Hà; địa chỉ nhà trai An Thái, nhà gái Thạch Xá, Yên Lư, Yên Dũng, Bắc Ninh.
- Thời gian theo bảng ảnh: tiệc cưới hai bên 16:30 ngày 19/12/2026; lễ thành hôn 15:00 ngày 20/12/2026; lễ vu quy 13:30 ngày 20/12/2026.
- Giao diện xanh bầu trời có mây trôi, hoa trang trí, hiệu ứng khi cuộn; responsive điện thoại.
- Nhạc MP3 bạn đã tải lên được giữ tại `music/Hon-Ca-Yeu-Duc-Phuc.mp3` (chỉ phát theo tương tác của khách, tuân thủ quyền sử dụng).
- Địa điểm Google Maps; gửi lời chúc và RSVP vào Google Sheets sau khi kết nối Apps Script.
- CSV UTF-8 BOM tránh lỗi tiếng Việt khi mở trong Excel.

## Cách cập nhật repository đang dùng
Kho: https://github.com/hothiminhhang/thiepmoicuoi
Link GitHub Pages: https://hothiminhhang.github.io/thiepmoicuoi/
1. Giải nén ZIP, **mở thư mục `thiepmoicuoi` nằm trong đó**.
2. Vào repository GitHub, nhấn `Add file` → `Upload files`.
3. Kéo toàn bộ **nội dung bên trong** `thiepmoicuoi` (kể cả thư mục `music`) vào trang upload.
4. Nếu GitHub cho phép thay file trùng tên, nhấn `Commit changes`. Không tải nguyên ZIP lên repository.
5. Trở lại repository kiểm tra `index.html`, `style.css`, `app.js`, `config.js` ở thư mục gốc, và `music/Hon-Ca-Yeu-Duc-Phuc.mp3` nằm trong `music`.
6. GitHub Pages sẽ triển khai lại trên đường link cũ. Nếu trình duyệt vẫn hiện bản cũ, tải lại với Ctrl+F5.

**Lưu ý:** File `config.js` trong bản cũ bạn gửi đang để trống URL Apps Script, nên bản mới cũng chưa kết nối Google Sheets. Nếu bạn đã kết nối Google Sheets trên GitHub sau đó thì HÃY GIỮ `config.js` hiện đang có trên GitHub thay vì ghi đè bằng bản ZIP.

## Kết nối hoặc cập nhật Google Sheets
1. Mở Google Sheets → `Tiện ích mở rộng` → `Apps Script`.
2. Thay mã bằng `Code.gs` trong ZIP. Lưu và chạy `setupWeddingSheets` để tạo/cập nhật 3 tab `Cau_hinh`, `Xac_nhan_tham_du`, `Loi_chuc` (không xóa các phản hồi cũ).
3. Nếu đã có deployment, chọn `Deploy` → `Manage deployments` → chỉnh sửa → `New version` → `Deploy`. Nếu chưa, tạo `New deployment` → `Web app`, `Execute as: Me`, `Who has access: Anyone`.
4. Sao chép URL `/exec` vào `config.js` theo mẫu `window.WEDDING_API_URL = 'https://script.google.com/macros/s/.../exec';` và cập nhật file đó trên GitHub.
5. Trong tab `Cau_hinh`, sửa cột B nếu cần. Tab `Xac_nhan_tham_du` chứa RSVP; tab `Loi_chuc` chứa lời chúc. Chọn TRUE trong cột duyệt để hiển thị công khai lời chúc.
6. Gửi thử một lời chúc và một xác nhận tham dự, kiểm tra dữ liệu xuất hiện trong Sheet trước khi chia sẻ link thật.

## Dữ liệu / ghi chú
- Ngày âm lịch đang giữ theo ảnh bạn gửi, chưa xác minh độc lập.
- Địa chỉ chỉ là mô tả khu vực; khi có vị trí chính xác, sửa `groom_map_link` và `bride_map_link` trong Google Sheets.
- `Du_lieu_mau_UTF8_BOM.csv` là bảng tham khảo, **không cần upload CSV vào tab đã có dữ liệu khách**.
- Khách chỉ được truy cập trang web, không cấp quyền chỉnh sửa Google Sheets.
