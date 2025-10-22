# ✅ Checklist Deploy Replit

## Trước khi Deploy:

- [x] Code đã hoàn thiện
- [x] Tests đã pass (14/14)
- [x] File `.replit` đã tạo
- [x] File `replit.nix` đã tạo
- [x] File `.gitignore` có `.env`
- [x] File `sample.env` có sẵn

## Các bước Deploy:

### 1. Push code lên GitHub (nếu chưa có)
```bash
git add .
git commit -m "Ready for Replit deployment"
git push origin main
```

### 2. Tạo Replit từ GitHub
- Vào https://replit.com
- Click "Create Repl"
- Chọn "Import from GitHub"
- Dán URL repo: `https://github.com/[your-username]/[your-repo]`
- Click "Import from GitHub"

### 3. Cấu hình Secrets trong Replit
- Mở tab "Secrets" (🔒)
- Thêm:
  - `NODE_ENV` = `production` (hoặc bỏ qua để dùng development)

### 4. Run Project
- Click nút "Run"
- Đợi `npm install` hoàn tất
- Server sẽ start

### 5. Lấy URL Deploy
- URL sẽ có dạng: `https://[project-name].[username].repl.co`
- Copy URL này để submit vào FreeCodeCamp

### 6. Test API
Test các endpoints:
- `GET /api/issues/apitest` - Xem issues
- `POST /api/issues/apitest` - Tạo issue mới
- `PUT /api/issues/apitest` - Update issue
- `DELETE /api/issues/apitest` - Xóa issue

## Lưu ý:

⚠️ **Database:** Hiện dùng in-memory, data mất khi restart
💡 **Giải pháp:** Nâng cấp lên MongoDB hoặc Replit Database

⚠️ **Always On:** Replit free sẽ sleep sau 1 giờ không dùng
💡 **Giải pháp:** Nâng cấp plan hoặc dùng UptimeRobot

## Nếu gặp lỗi:

**"Cannot find module"**
```bash
npm install
```

**Port issues**
- Replit tự động handle, không lo

**Tests fail**
```bash
npm run test
```

## Submit vào FreeCodeCamp:

1. Copy URL Replit: `https://your-project.your-username.repl.co`
2. Paste vào ô "Solution Link" trong FreeCodeCamp
3. Click "I've completed this challenge"

---

🎉 **Chúc bạn thành công!**
