# 🏘️ Real Estate Listing Platform

- Người Thực Hiện : **Lý Minh Phước**
- Link Deploy : [Hãy điền link deploy của bạn vào đây nếu có]

Nền tảng Đăng tin Bất động sản Full Stack cho phép người dùng đăng, tìm kiếm và liên hệ bất động sản thông qua giao diện hiện đại, tích hợp bản đồ và các bộ lọc nâng cao.

---

## 🚀 Công nghệ sử dụng

| Thành phần        | Công nghệ                       | Mô tả                                       |
|-------------------|---------------------------------|---------------------------------------------|
| Front-end         | React + Next.js                 | Giao diện động, routing hiệu quả (App Router) |
| State Management  | Redux Toolkit + RTK Query       | Quản lý trạng thái và gọi API hiệu quả       |
| Styling           | Tailwind CSS                    | Thiết kế responsive, dễ tùy biến            |
| Back-end          | NestJS                          | Kiến trúc module rõ ràng, dễ bảo trì        |
| ORM               | Prisma                          | Kết nối cơ sở dữ liệu, truy vấn linh hoạt   |
| Database          | PostgreSQL                      | Cơ sở dữ liệu quan hệ mạnh mẽ              |
| Map Integration   | Google Maps API                 | Hiển thị vị trí bất động sản                |
| Auth              | JSON Web Token (JWT)            | Xác thực và phân quyền                     |
| Containerization  | Docker                          | Đóng gói ứng dụng nhất quán                 |
| Deployment        | Vercel (FE), Render (BE), Supabase | Triển khai nhanh chóng, hiệu quả           |

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

## ⚙️ Hướng dẫn cài đặt và chạy dự án

Dự án này cung cấp hai phương án để chạy ứng dụng: sử dụng **Docker** để đơn giản hóa quá trình triển khai, hoặc cài đặt **cục bộ** từng thành phần.

### 1. Yêu cầu cài đặt

**Đối với phương án sử dụng Docker:**

* **Docker Desktop**: Bao gồm Docker Engine và Docker Compose.
    * Tải xuống tại: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

**Đối với phương án chạy cục bộ (không dùng Docker):**

* **Node.js** (phiên bản 16 trở lên được khuyến nghị)
* **npm** (thường đi kèm với Node.js) hoặc **Yarn**
* **Python** (phiên bản 3.x)
* **Redis** (server)
* **PostgreSQL** (server)
* **Prisma CLI**: Cài đặt toàn cục: `npm install -g prisma`

---

### 2. Cấu hình `.env`

Bạn cần tạo các file `.env` chứa các biến môi trường cho cả phần frontend và backend.

* **`backend/.env`**:
    Tạo file `.env` trong thư mục **`backend/`** với nội dung sau. Hãy thay đổi các giá trị placeholder bằng thông tin cấu hình database thực tế của bạn.

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
    JWT_SECRET="your_strong_jwt_secret_key" # Thay đổi bằng một chuỗi bí mật mạnh và khó đoán
    REDIS_URL="redis://localhost:6379/0" # Đảm bảo Redis server đang chạy nếu sử dụng
    UPLOAD_FOLDER=./uploads # Thư mục lưu trữ file upload trên server
    RESULT_FOLDER=./results # Thư mục lưu trữ kết quả xử lý trên server
    # Nếu bạn dùng Google Maps API cho backend (ví dụ: Geocoding), thêm vào đây:
    # Maps_API_KEY="your_Maps_api_key"
    ```

* **`frontend/.env`**:
    Tạo file `.env` trong thư mục **`frontend/`** với nội dung sau:

    ```env
    NEXT_PUBLIC_API_URL="http://localhost:5000/api" # Đảm bảo trùng với cổng API của backend
    # Nếu bạn dùng Google Maps API trực tiếp trên client, thêm vào đây:
    # NEXT_PUBLIC_Maps_API_KEY="your_Maps_api_key"
    ```
    **Lưu ý:** Đối với Next.js/React, các biến môi trường cho frontend cần bắt đầu bằng **`NEXT_PUBLIC_`** (hoặc `REACT_APP_` nếu là Create React App) để có thể truy cập được từ phía client.

---

### 3. 🚀 Chạy dự án với Docker (Được khuyến nghị)

Phương án này đóng gói toàn bộ ứng dụng (frontend, backend, database) trong các container, giúp việc thiết lập trở nên đơn giản và đồng nhất.

1.  **Di chuyển vào thư mục gốc của dự án**:
    Mở terminal hoặc command prompt và điều hướng đến thư mục gốc của dự án (nơi chứa file `docker-compose.yml`).

    ```bash
    cd <tên_thư_mục_dự_án>
    ```

2.  **Khởi tạo cơ sở dữ liệu và áp dụng migrations**:
    Để đảm bảo database được thiết lập đúng cách với schema của bạn, chạy các lệnh sau:

    ```bash
    docker-compose up -d db # Khởi chạy dịch vụ database ở chế độ nền
    docker-compose exec server npx prisma migrate deploy # Áp dụng các migration Prisma từ bên trong container 'server'
    ```
    * **Lưu ý:** Tên service `server` được sử dụng để chạy lệnh `prisma migrate`. Đảm bảo tên service của backend trong `docker-compose.yml` của bạn là `server`. Nếu lệnh lỗi, bạn có thể cần chạy `docker-compose build server` trước đó.

3.  **Khởi động toàn bộ ứng dụng**:
    Sau khi database đã sẵn sàng và migrations đã được áp dụng, bạn có thể khởi chạy tất cả các dịch vụ:

    ```bash
    docker-compose up --build
    ```
    * Lệnh `--build` sẽ build lại các Docker image cho frontend và backend nếu có bất kỳ thay đổi nào trong mã nguồn hoặc `Dockerfile` của chúng. Lần đầu tiên chạy sẽ mất một chút thời gian để tải xuống và xây dựng tất cả các image.

4.  **Truy cập ứng dụng**:
    Khi tất cả các dịch vụ đã khởi động thành công, bạn có thể truy cập ứng dụng trên trình duyệt:

    * 🖥 **Front-end (Client)**: `http://localhost:3000`
    * 🔧 **Back-end (Server API)**: `http://localhost:5000/api`

---

### 4. 🏃 Chạy dự án cục bộ (Không dùng Docker)

Phương án này yêu cầu bạn cài đặt và quản lý từng thành phần riêng lẻ trên máy tính của mình.

1.  **Cài đặt các dependency cho Backend**:
    Điều hướng đến thư mục **`backend/`** và cài đặt các gói Node.js:

    ```bash
    cd backend/
    npm install # hoặc yarn install
    ```

2.  **Khởi tạo cơ sở dữ liệu và áp dụng migrations (Backend)**:
    Đảm bảo PostgreSQL và Redis server của bạn đang chạy. Sau đó, từ thư mục **`backend/`**:

    ```bash
    npx prisma migrate deploy
    # hoặc npx prisma db push --preview-feature (nếu bạn chỉ muốn đồng bộ schema nhanh mà không cần migration lịch sử)
    ```

3.  **Chạy Backend Server**:
    Từ thư mục **`backend/`**:

    ```bash
    npm run start:dev # Hoặc lệnh khởi động server development của bạn
    ```
    Backend API sẽ chạy tại `http://localhost:5000/api`.

4.  **Cài đặt các dependency cho Frontend**:
    Mở một terminal mới, điều hướng đến thư mục **`frontend/`** và cài đặt các gói Node.js:

    ```bash
    cd frontend/
    npm install # hoặc yarn install
    ```

5.  **Chạy Frontend Development Server**:
    Từ thư mục **`frontend/`**:

    ```bash
    npm run dev # Hoặc lệnh khởi động dev server của bạn
    ```
    Frontend sẽ chạy tại `http://localhost:3000`.

---

### 5. 🛑 Dừng và Dọn dẹp

**Nếu bạn sử dụng Docker:**

Để dừng tất cả các dịch vụ và xóa các container, network, volumes do Docker Compose tạo ra:

```bash
docker-compose down
