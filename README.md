# 🏘️ Nền tảng Đăng tin Bất động sản

**Người Thực Hiện**: Lý Minh Phước  
**Link Deploy**: 

Chào mừng bạn đến với Nền tảng Đăng tin Bất động sản Full Stack! 🌟 Dự án này cho phép người dùng **đăng tải**, **tìm kiếm** và **liên hệ** bất động sản một cách dễ dàng thông qua giao diện hiện đại, tích hợp bản đồ thông minh và các bộ lọc nâng cao.

---

## 🚀 Công nghệ sử dụng

Chúng tôi tự hào sử dụng một chồng công nghệ hiện đại và mạnh mẽ để xây dựng nền tảng này:

| Thành phần          | Công nghệ                          | Mô tả                                                |
| :------------------ | :--------------------------------- | :--------------------------------------------------- |
| **Front-end** | React + Next.js                    | Giao diện người dùng động, hiệu suất cao với **App Router** |
| **Quản lý trạng thái** | RTK Query          | Quản lý trạng thái và tương tác API hiệu quả             |
| **Styling** | Tailwind CSS                       | Thiết kế UI nhanh chóng, dễ dàng tùy biến và responsive |
| **Back-end** | NestJS                             | Kiến trúc backend mạnh mẽ, module rõ ràng và dễ bảo trì |
| **ORM** | Prisma                             | Công cụ ORM hiện đại, giúp tương tác với database linh hoạt |
| **Database** | PostgreSQL (qua Supabase)          | Cơ sở dữ liệu quan hệ tin cậy, lưu trữ thông tin      |
| **Tích hợp bản đồ** | Google Maps API                    | Hiển thị vị trí bất động sản trực quan trên bản đồ   |
| **Xác thực** | JSON Web Token (JWT)               | Hệ thống xác thực và phân quyền an toàn                 |
| **Đóng gói** | Docker                             | Đóng gói ứng dụng nhất quán, dễ dàng triển khai       |
| **Triển khai** | Vercel (FE), Render (BE), Supabase | Triển khai nhanh chóng và hiệu quả                    |

---

## ✨ Tính năng nổi bật

### Dành cho Người dùng 🙋‍♂️

* 🔐 **Đăng ký / Đăng nhập**: Dễ dàng tạo tài khoản và đăng nhập an toàn bằng JWT.
* 👤 **Quản lý hồ sơ**: Cập nhật thông tin cá nhân, ảnh đại diện linh hoạt.
* 📄 **Xem danh sách**: Theo dõi các bất động sản đã đăng hoặc đã lưu vào mục yêu thích.
* 🔍 **Tìm kiếm nâng cao**: Lọc bất động sản theo:
    * Giá cả 💰
    * Diện tích 📏
    * Vị trí (theo từ khóa) 📍
    * Loại hình (nhà ở, căn hộ, đất...) 🏡
    * Số phòng ngủ 🛏️
* 🗺️ **Bản đồ trực quan**: Xem vị trí chính xác của bất động sản trên Google Maps.
* ❤️ **Yêu thích & Chi tiết**: Lưu lại các bất động sản quan tâm và xem thông tin chi tiết.
* ✉️ **Liên hệ người bán**: Gửi tin nhắn trực tiếp đến người đăng tin qua form tiện lợi.

### Dành cho Quản trị viên (Admin) 👑

* 🔐 **Đăng nhập**: Đăng nhập an toàn vào bảng điều khiển quản trị.
* 📊 **Dashboard tổng quan**: Xem báo cáo và thống kê hệ thống.
* 🧱 **Quản lý bất động sản**: Thao tác **CRUD** (Tạo, Đọc, Cập nhật, Xóa) bất động sản và các danh mục liên quan.
* 👥 **Quản lý người dùng**: Khóa hoặc mở tài khoản người dùng khi cần.
* 📬 **Quản lý yêu cầu liên hệ**: Xem, trả lời và xóa các yêu cầu từ người mua.
* 🔔 **Gửi thông báo**: Gửi thông báo quan trọng đến người dùng.

---

## 🧠 Tính năng nâng cao (Tùy chọn cho phiên bản tương lai)

* 🔁 **Gợi ý thông minh**: Đề xuất bất động sản dựa trên lịch sử tìm kiếm hoặc sở thích.
* 💬 **Chat thời gian thực**: Kết nối trực tiếp người mua và người bán qua WebSocket.
* ⭐ **Hệ thống đánh giá**: Cho phép người dùng đánh giá bất động sản hoặc người bán.

---

## ⚙️ Hướng dẫn cài đặt và chạy dự án

Bạn có hai lựa chọn để chạy dự án: sử dụng **Docker** (khuyến nghị để đơn giản hóa) hoặc cài đặt **cục bộ** từng thành phần.

### 1. Yêu cầu cài đặt

**Đối với phương án sử dụng Docker:**

* **Docker Desktop**: Bao gồm Docker Engine và Docker Compose.
    * Tải xuống tại: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

**Đối với phương án chạy cục bộ (không dùng Docker):**

* **Node.js** (phiên bản 16 trở lên được khuyến nghị)
* **npm** (thường đi kèm với Node.js) hoặc **Yarn**
* **PostgreSQL** (server - nếu không dùng Supabase là DB chính)
* **Prisma CLI**: Cài đặt toàn cục bằng lệnh: `npm install -g prisma`

---

### 2. Cấu hình các biến môi trường (`.env`)

Bạn cần tạo các file `.env` chứa các thông tin cấu hình quan trọng cho cả frontend và backend.

* **`backend/.env`**:
    Tạo file `.env` trong thư mục **`backend/`** với nội dung sau. Các thông tin Supabase đã được điền sẵn từ cấu hình của bạn.

    ```env
    DATABASE_URL="postgresql://postgres.aapedgzmjpesntappypa:phuocly789@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connection_limit=1"
    JWT_SECRET="phuoclyminh789@gmail.com"
    SUPABASE_URL="https://aapedgzmjpesntappypa.supabase.co"
    SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGVkZ3ptanBlc250YXBweXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU5MTIzOSwiZXhwIjoyMDY3MTY3MjM5fQ.tFrKUuU1DxFpxK8GRzieULrFOybKze2moO-dyGCjtSc"
    ```

* **`frontend/.env` (hoặc `.env.local` nếu dùng Next.js)**:
    Tạo file `.env` (nếu bạn sử dụng Vite) hoặc `.env.local` (nếu bạn sử dụng Next.js) trong thư mục **`frontend/`** với nội dung sau:

    * **Nếu bạn dùng Vite (tiền tố `VITE_`):**
        ```env
        VITE_API_URL="http://localhost:3000"
        VITE_SUPABASE_URL="https://aapedgzmjpesntappypa.supabase.co"
        VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhcGVkZ3ptanBlc250YXBweXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTEyMzksImV4cCI6MjA2NzE2NzIzOX0.QztdDoBzydweEG2bkRLncdINmpJE3r3fvnIZp1dQf_w"
        ```
    **Lưu ý quan trọng:** Hãy chọn **một trong hai** cấu hình frontend trên, tùy thuộc vào framework bạn đang sử dụng cho giao diện người dùng.

---

### 3. 🚀 Chạy dự án với Docker (Được khuyến nghị)

Phương án này tận dụng Docker để tạo môi trường chạy ứng dụng khép kín, giúp bạn không cần lo lắng về các phụ thuộc cục bộ.

1.  **Di chuyển vào thư mục gốc của dự án**:
    Mở terminal hoặc Command Prompt và điều hướng đến thư mục chứa file `docker-compose.yml`.

    ```bash
    cd Fullstack-Real_Estate_Listing_Platform
    ```

2.  **Áp dụng Prisma Migrations lên Supabase Database**:
    ```bash
    docker-compose up -d server # Khởi chạy dịch vụ backend ở chế độ nền để có thể chạy lệnh Prisma
    docker-compose exec server npx prisma migrate deploy # Áp dụng các migration từ bên trong container 'server'
    ```
    * **Mẹo**: Nếu bạn gặp lỗi, hãy thử chạy `docker-compose build server` trước khi thực hiện lệnh `exec`. Đảm bảo `DATABASE_URL` trong `backend/.env` đã trỏ đúng tới Supabase của bạn.

3.  **Khởi động toàn bộ ứng dụng**:
    Sau khi các migration đã được áp dụng, bạn có thể khởi chạy tất cả các dịch vụ (frontend và backend) bằng một lệnh duy nhất:

    ```bash
    docker-compose up --build
    ```
    * Lệnh `--build` sẽ tự động build lại các Docker image cho `client` và `server` nếu có bất kỳ thay đổi nào trong mã nguồn hoặc `Dockerfile` của chúng. Lần đầu tiên chạy sẽ mất một chút thời gian để tải xuống các image cơ bản và xây dựng ứng dụng.

4.  **Truy cập ứng dụng**:
    Khi tất cả các dịch vụ đã khởi động thành công, bạn có thể truy cập ứng dụng trên trình duyệt web của mình:

    * 🖥 **Front-end (Client)**: `http://localhost:3001`
    * 🔧 **Back-end (Server API)**: `http://localhost:3000/api`

---

### 4. 🏃 Chạy dự án cục bộ (Không dùng Docker)

Nếu bạn muốn kiểm soát từng thành phần riêng lẻ hoặc không muốn sử dụng Docker, hãy làm theo các bước sau:

1.  **Cài đặt các dependency cho Backend**:
    Điều hướng đến thư mục **`backend/`** và cài đặt tất cả các gói Node.js cần thiết:

    ```bash
    cd backend/
    npm install 
    ```

2.  **Áp dụng Prisma Migrations (Backend)**:
    Đảm bảo rằng file `.env` trong thư mục `backend/` đã được cấu hình chính xác để kết nối tới Supabase của bạn. Sau đó, từ thư mục **`backend/`**:

    ```bash
    npx prisma migrate deploy
    # Tùy chọn: npx prisma db push --preview-feature (để đồng bộ schema nhanh mà không cần migration lịch sử)
    ```

3.  **Chạy Backend Server**:
    Từ thư mục **`backend/`**:

    ```bash
    npm run start:dev 
    ```
    Backend API sẽ bắt đầu lắng nghe tại `http://localhost:3000/api`.

4.  **Cài đặt các dependency cho Frontend**:
    Mở một terminal **mới**, điều hướng đến thư mục **`frontend/`** và cài đặt các gói Node.js:

    ```bash
    cd frontend/
    npm install # hoặc yarn install
    ```

5.  **Chạy Frontend Development Server**:
    Từ thư mục **`frontend/`**:

    ```bash
    npm run dev # Hoặc lệnh khởi động dev server của bạn
    ```
    Frontend sẽ được truy cập tại `http://localhost:5173`.

---

### 5. 🛑 Dừng và Dọn dẹp

**Nếu bạn sử dụng Docker:**

Để dừng tất cả các dịch vụ đang chạy và xóa các container, network, volumes do Docker Compose tạo ra:

```bash
docker-compose down
    ```
