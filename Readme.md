# 🐾 Hệ thống Quản lý Chuỗi Khách sạn Thú cưng

Website quản lý đặt phòng khách sạn cho thú cưng, gồm 3 vai trò: Khách hàng, Nhân viên, Quản trị viên.

## Công nghệ sử dụng
- **Frontend:** ReactJS (Vite), React Router, Axios
- **Backend:** Laravel (REST API), JWT Authentication
- **Database:** MongoDB (Atlas Cloud)

## Chức năng chính
- Đăng ký / Đăng nhập (phân quyền theo vai trò)
- Khách hàng: quản lý thú cưng, tìm phòng, đặt phòng (chặn trùng ngày), xem & hủy đặt phòng
- Nhân viên / Admin: xác nhận, check-in, check-out đặt phòng
- Admin: quản lý chi nhánh, phòng

## Cấu trúc
pet-hotel/
├── pet-hotel-api/   # Backend Laravel
└── pet-hotel-web/   # Frontend React

## Hướng dẫn cài đặt

### Yêu cầu
- PHP >= 8.2, Composer
- Node.js >= 18, npm
- Tài khoản MongoDB Atlas (hoặc MongoDB local)

### 1. Backend (Laravel)
```bash
cd pet-hotel-api
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```
Mở file `.env`, điền chuỗi kết nối MongoDB của bạn vào `DB_DSN`.

Tạo dữ liệu mẫu và chạy server:
```bash
php artisan db:seed
php artisan serve
```
Backend chạy tại `http://127.0.0.1:8000`

### 2. Frontend (React)
```bash
cd pet-hotel-web
npm install
npm run dev
```
Frontend chạy tại `http://localhost:5173`

## Tài khoản mẫu
| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@gmail.com | 123456 |
| Nhân viên | staff@gmail.com | 123456 |
| Khách hàng | (tự đăng ký) | |