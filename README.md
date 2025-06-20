# 🏘️ Real Estate Listing Platform  
# Người Thực Hiện : Lý Minh Phước  
# Link Deploy :   

Nền tảng Đăng tin Bất động sản Full Stack cho phép người dùng đăng, tìm kiếm và liên hệ bất động sản thông qua giao diện hiện đại, tích hợp bản đồ và các bộ lọc nâng cao.

## 🚀 Công nghệ sử dụng

| Thành phần         | Công nghệ                        | Mô tả |
|--------------------|----------------------------------|-------|
| Front-end          | React + Next.js                 | Giao diện động, routing hiệu quả (App Router) |
| State Management   | Redux Toolkit + RTK Query        | Quản lý trạng thái và gọi API hiệu quả |
| Styling            | Tailwind CSS                    | Thiết kế responsive, dễ tùy biến |
| Back-end           | NestJS                          | Kiến trúc module rõ ràng, dễ bảo trì |
| ORM                | Prisma                          | Kết nối cơ sở dữ liệu, truy vấn linh hoạt |
| Database           | PostgreSQL                      | Cơ sở dữ liệu quan hệ mạnh mẽ |
| Map Integration    | Google Maps API                 | Hiển thị vị trí bất động sản |
| Auth               | JSON Web Token (JWT)            | Xác thực và phân quyền |
| Containerization   | Docker                          | Đóng gói ứng dụng nhất quán |
| Deployment         | Vercel (FE), Render (BE), Supabase | Triển khai nhanh chóng, hiệu quả |

---

## ✨ Tính năng chính

### Cho người dùng

- 🔐 Đăng ký / Đăng nhập với JWT (email, mật khẩu, số điện thoại tùy chọn)
- 👤 Quản lý hồ sơ cá nhân, cập nhật thông tin, ảnh đại diện
- 📄 Xem danh sách bất động sản đã đăng hoặc đã lưu (favorites)
- 🔍 Tìm kiếm nâng cao theo:
  - Giá
  - Diện tích
  - Vị trí (có từ khóa)
  - Loại (nhà ở, căn hộ, đất)
  - Số phòng ngủ
- 🗺️ Hiển thị bản đồ (Google Maps)
- ❤️ Lưu yêu thích và xem chi tiết bất động sản
- ✉️ Liên hệ người bán qua form (tên, email, nội dung)

### Cho quản trị viên (Admin)

- 🔐 Đăng nhập với JWT (username/password)
- 📊 Dashboard quản trị tổng quan
- 🧱 CRUD bất động sản và danh mục
- 👥 Quản lý người dùng: khóa/mở tài khoản
- 📬 Quản lý yêu cầu liên hệ: xem, trả lời, xóa
- 🔔 Gửi thông báo đến người dùng

---

## 🧠 Tính năng nâng cao (Tùy chọn)

- 🔁 Gợi ý bất động sản dựa theo lịch sử tìm kiếm hoặc danh sách yêu thích
- 💬 Chat thời gian thực giữa người mua và người bán (WebSocket)
- ⭐ Hệ thống đánh giá bất động sản hoặc người bán

---
