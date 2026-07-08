# NH - DUCT: Tài liệu chuyển source mới, dùng lại DB/ảnh/admin cũ và báo cáo tính năng phát triển thêm

Ngày lập: 2026-07-08  
Phạm vi: so sánh source cũ trong file `nh website.zip` với source mới trên GitHub `stevenphung60-rgb/website`; hướng dẫn cấu hình deploy source mới để dùng lại database, tài khoản admin và kho ảnh cũ.

---

## 1. Kết luận ngắn

Source mới **không chỉ đổi giao diện**, mà đã mở rộng thành một hệ quản trị nội dung đầy đủ hơn. Tuy nhiên để deploy lên production và dùng lại dữ liệu cũ, có 3 việc bắt buộc:

1. **Copy đúng production environment variables từ hosting cũ**, vì file `.env.local` trong source cũ đang là local/placeholder, không có secret thật.
2. **Khôi phục upload ảnh về AWS S3**, vì source mới hiện tại đang dùng local upload vào `public/uploads`, không phù hợp production nếu muốn dùng kho ảnh S3 cũ.
3. **Migration dữ liệu cũ sang schema mới**, vì source mới đã tách `Loại sản phẩm`, `Loại dự án`, bổ sung `code` sản phẩm và thay đổi cấu trúc `contactInfo`.

---

## 2. Thông tin cụ thể lấy được từ source cũ

### 2.1. File môi trường cũ có trong zip

Các file được tìm thấy trong source cũ:

```txt
.env.local
.env.example
env.example
```

Nội dung `.env.local` trong zip **không phải production secret thật**, mà là local/placeholder:

| Nhóm | Biến | Giá trị trong source cũ zip | Kết luận |
|---|---|---|---|
| Auth URL | `BETTER_AUTH_URL` | `http://localhost:3000` | Chỉ là local, khi deploy phải đổi sang domain thật |
| Auth URL client | `NEXT_PUBLIC_BETTER_AUTH_URL` | `http://localhost:3000` | Chỉ là local, khi deploy phải đổi sang domain thật |
| Auth secret | `BETTER_AUTH_SECRET` | `your-secret-key-here-change-in-production` | Placeholder, không phải secret production |
| DB | `MONGODB_URI` | `mongodb://localhost:27017/nghiep-hung-website` | Local DB, không phải Atlas/production URI |
| DB name | `MONGODB_DBNAME` | `nghiep-hung-website` | Có thể giữ tên này nếu DB cũ dùng đúng tên này |
| Google OAuth | `GOOGLE_CLIENT_ID` | `your-google-client-id-here` | Placeholder |
| Google OAuth | `GOOGLE_CLIENT_SECRET` | `your-google-client-secret-here` | Placeholder |
| Admin | `ADMIN_EMAILS` | `admin@example.com,your-email@gmail.com` | Placeholder |
| S3 | `AWS_ACCESS_KEY_ID` | `your-aws-access-key-id-here` | Placeholder |
| S3 | `AWS_SECRET_ACCESS_KEY` | `your-aws-secret-access-key-here` | Placeholder |
| S3 | `AWS_REGION` | `us-east-1` | Có thể đúng hoặc chỉ default |
| S3 | `AWS_S3_BUCKET_NAME` | `your-s3-bucket-name-here` | Placeholder |
| SMTP | `SMTP_USER` / `SMTP_PASS` | placeholder | Placeholder |

**Kết luận:** production DB URI, S3 bucket, Google OAuth client và admin email thật **không nằm trong zip source cũ**. Cần lấy từ nơi đang deploy cũ, ví dụ Vercel/hosting environment variables, AWS IAM/S3 console, MongoDB Atlas và Google Cloud OAuth.

---

## 3. Lấy lại account admin cũ như thế nào

### 3.1. Logic admin trong source

Admin không phải là tài khoản tạo bằng form riêng. Admin là Google account được phép vào `/admin` nếu email nằm trong biến môi trường:

```txt
ADMIN_EMAILS
NEXT_PUBLIC_ADMIN_EMAILS
```

Trong code server, quyền admin được kiểm tra bằng `ADMIN_EMAILS`. Trong trang login client, code đang đọc `NEXT_PUBLIC_ADMIN_EMAILS`. Vì vậy production nên set **cả 2 biến giống nhau**.

### 3.2. Cần set biến gì để admin cũ dùng tiếp được

Trong production env của source mới, set:

```env
ADMIN_EMAILS=<email-admin-cu-1>,<email-admin-cu-2>
NEXT_PUBLIC_ADMIN_EMAILS=<email-admin-cu-1>,<email-admin-cu-2>
```

Nếu không nhớ email admin cũ, có 2 cách lấy:

**Cách 1: từ hosting cũ**

Vào project deploy cũ, xem environment variable:

```txt
ADMIN_EMAILS
NEXT_PUBLIC_ADMIN_EMAILS
```

**Cách 2: từ MongoDB cũ**

Better Auth lưu user Google vào DB. Kết nối DB cũ rồi chạy trong Mongo shell/Compass:

```js
db.user.find({}, { email: 1, name: 1, createdAt: 1 }).sort({ createdAt: -1 })
```

Hoặc nếu collection đặt tên khác do adapter:

```js
db.getCollectionNames()
```

Sau đó tìm collection có user/email, lấy Gmail cần cấp quyền và đưa vào `ADMIN_EMAILS` + `NEXT_PUBLIC_ADMIN_EMAILS`.

### 3.3. Google OAuth cần sửa gì khi đổi domain deploy

Trong Google Cloud Console của OAuth client đang dùng, thêm redirect URI production mới:

```txt
https://<domain-moi>/api/auth/callback/google
```

Nếu có domain Vercel preview/production:

```txt
https://<vercel-domain>/api/auth/callback/google
```

Production env cần:

```env
BETTER_AUTH_URL=https://<domain-moi>
NEXT_PUBLIC_BETTER_AUTH_URL=https://<domain-moi>
TRUSTED_ORIGINS=https://<domain-moi>,https://<vercel-domain-neu-co>
GOOGLE_CLIENT_ID=<client-id-cu>
GOOGLE_CLIENT_SECRET=<client-secret-cu>
```

### 3.4. Code nên sửa nhỏ ở login

Hiện trang login đang redirect unauthorized về `/admin/unauthorized`, trong khi route cũ/source hiện có route `/unauthorized`. Nên sửa:

```tsx
router.push("/admin/unauthorized");
```

thành:

```tsx
router.push("/unauthorized");
```

Patch đã nằm trong package:

```txt
code-files/src/app/login/page.tsx.patch
```

---

## 4. Dùng lại database cũ

### 4.1. Source cũ và source mới đều đọc MongoDB qua env

Cả source cũ và source mới đều dùng các biến:

```env
MONGODB_URI=
MONGODB_DBNAME=
MONGODB_USERNAME=
MONGODB_PASSWORD=
```

Production source mới chỉ cần trỏ về **đúng MongoDB production cũ**:

```env
MONGODB_URI=<old-production-mongodb-uri>
MONGODB_DBNAME=nghiep-hung-website
```

Nếu DB cũ dùng username/password tách riêng:

```env
MONGODB_USERNAME=<old-db-username>
MONGODB_PASSWORD=<old-db-password>
```

### 4.2. Nhưng không được chỉ trỏ DB là xong

Source mới thay đổi một số schema. Nếu trỏ DB cũ trực tiếp mà không migrate, có thể gặp lỗi hoặc mất liên kết danh mục.

Các khác biệt chính:

| Module | Source cũ | Source mới | Việc cần làm |
|---|---|---|---|
| Products | `products.category` là text song ngữ | `products.categoryId` trỏ sang collection `productCategories` | Tạo `productCategories` từ category cũ, set `categoryId` cho từng product |
| Products | Không có `code` | Có `code` | Tạo `code` mặc định cho sản phẩm cũ |
| Projects | `projects.category` là text song ngữ | `projects.categoryId` trỏ sang `projectCategories` | Tạo `projectCategories`, set `categoryId` |
| Projects | `location`, `year` là string | `location`, `year` là object `{vi,en}` | Convert string sang object song ngữ |
| Contact | `contactInfo` cũ không bắt buộc `id` | Source mới tìm `{ id: "contact-info" }` | Set `id: "contact-info"` cho document contact cũ |
| Contact | Ít field hơn | Có CTA tư vấn/footer logo/footer mô tả | Thêm default field mới |
| Appearance | Không có | Có `siteAppearance` | Insert default appearance |
| Blog | Không có | Có `blogCategories`, `blogPosts` | Tạo mới qua admin sau deploy |

### 4.3. Script migration dữ liệu

Em đã viết script migration:

```txt
code-files/scripts/migrate-old-db-to-current-schema.mjs
```

Cách dùng:

1. Copy file vào source mới:

```txt
scripts/migrate-old-db-to-current-schema.mjs
```

2. Trỏ `.env.production` hoặc env terminal tới DB cũ:

```bash
export MONGODB_URI="<old-production-mongodb-uri>"
export MONGODB_DBNAME="nghiep-hung-website"
```

3. Chạy:

```bash
node scripts/migrate-old-db-to-current-schema.mjs
```

Script sẽ:

```txt
- Tạo productCategories từ products.category cũ
- Set categoryId cho products cũ
- Tạo code cho products cũ nếu thiếu
- Tạo projectCategories từ projects.category cũ
- Set categoryId cho projects cũ
- Convert project.location/year sang {vi,en}
- Set contactInfo.id = "contact-info"
- Bổ sung field CTA/footer mới cho contactInfo
- Tạo default siteAppearance
```

Nên backup DB trước khi chạy.

---

## 5. Dùng lại nguồn ảnh cũ trên AWS S3

### 5.1. Source cũ dùng AWS S3

Source cũ upload ảnh bằng AWS SDK, lưu object lên S3 và trả URL dạng:

```txt
https://<bucket>.s3.<region>.amazonaws.com/<key>
```

### 5.2. Source mới hiện đang dùng local upload

Trong source mới, `src/lib/s3.ts` hiện đang ghi file vào:

```txt
public/uploads
```

và trả URL:

```txt
/uploads/<key>
```

Cách này dùng được local nhưng **không đúng production** nếu anh muốn dùng kho ảnh S3 cũ.

### 5.3. Code cần thay để dùng lại S3 cũ

Thay toàn bộ file:

```txt
src/lib/s3.ts
```

bằng file trong package:

```txt
code-files/src/lib/s3.ts
```

File này khôi phục upload/delete/get URL qua AWS S3.

### 5.4. Cần sửa `next.config.ts` để Next Image đọc được ảnh S3

Thay file:

```txt
next.config.ts
```

bằng file trong package:

```txt
code-files/next.config.ts
```

File này tự thêm remote pattern cho host:

```txt
<bucket>.s3.<region>.amazonaws.com
```

nếu có env:

```env
AWS_S3_BUCKET_NAME=
AWS_REGION=
```

### 5.5. Production env S3 cần set

```env
AWS_ACCESS_KEY_ID=<old-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<old-aws-secret-access-key>
AWS_REGION=<old-region>
AWS_S3_BUCKET_NAME=<old-bucket-name>
```

Nếu không biết thông tin này, lấy ở:

```txt
- Hosting cũ/Vercel Environment Variables
- AWS IAM access key đang dùng
- AWS S3 bucket đang chứa ảnh website cũ
```

---

## 6. Production env template đầy đủ

File template nằm trong package:

```txt
templates/.env.production.template
```

Các biến quan trọng:

```env
BETTER_AUTH_URL=https://<production-domain>
NEXT_PUBLIC_BETTER_AUTH_URL=https://<production-domain>
NEXT_PUBLIC_BASE_URL=https://<production-domain>
TRUSTED_ORIGINS=https://<production-domain>,https://<vercel-production-domain-if-any>
BETTER_AUTH_SECRET=<copy-or-generate>

ADMIN_EMAILS=<admin1@gmail.com>,<admin2@gmail.com>
NEXT_PUBLIC_ADMIN_EMAILS=<admin1@gmail.com>,<admin2@gmail.com>

MONGODB_URI=<old-production-mongodb-uri>
MONGODB_DBNAME=nghiep-hung-website

GOOGLE_CLIENT_ID=<google-oauth-client-id>
GOOGLE_CLIENT_SECRET=<google-oauth-client-secret>

AWS_ACCESS_KEY_ID=<old-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<old-aws-secret-access-key>
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=<old-s3-bucket-name>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-app-password>
SMTP_FROM_EMAIL=<smtp-from-email>
SMTP_FROM_NAME=Nghiep Hung
```

---

## 7. Những tính năng mới so với source cũ để tính chi phí business/function

### 7.1. Tổng quan source cũ

Source cũ có các public page:

```txt
Trang chủ
Giới thiệu
Sản phẩm
Dịch vụ
Dự án
Liên hệ
Chính sách bảo mật
```

Admin cũ có:

```txt
Dashboard
Sản phẩm
Dịch vụ
Dự án
Liên hệ
```

Upload ảnh dùng AWS S3. Dữ liệu chính gồm:

```txt
products
services
projects
contactInfo
```

### 7.2. Tính năng mới trong source mới

| Nhóm | Tính năng mới | Giá trị business | Ghi chú tính chi phí |
|---|---|---|---|
| Admin CMS | Sidebar admin mới, phân nhóm module rõ hơn | Dễ quản trị, dễ mở rộng | UI/UX admin |
| Admin CMS | Quản lý logo & tên công ty | Không cần sửa code khi đổi nhận diện | CMS branding |
| Admin CMS | Quản lý nội dung trang chủ/giới thiệu/banner | Admin tự cập nhật nội dung public | CMS nội dung |
| Admin CMS | Quản lý banner dịch vụ/dự án/liên hệ | Chủ động thay ảnh/text đầu trang | CMS banner |
| Sản phẩm | Tách `Loại sản phẩm` thành module riêng | Lọc/menu/related rõ ràng hơn | Data model + admin CRUD |
| Dự án | Tách `Loại dự án` thành module riêng | Lọc dự án chuyên nghiệp hơn | Data model + admin CRUD |
| Detail pages | Trang chi tiết sản phẩm | SEO và chuyển đổi tốt hơn list/modal | Public detail + related carousel |
| Detail pages | Trang chi tiết dịch vụ | Dẫn link trực tiếp từng dịch vụ | Public detail + related |
| Detail pages | Trang chi tiết dự án | Mỗi dự án có landing riêng | Public detail + related |
| Blog | Module Blog hoàn chỉnh | Tăng SEO, content marketing, kiến thức doanh nghiệp | Admin + public list/detail |
| Blog | Loại blog | Phân nhóm blog theo chủ đề | Admin CRUD + filter |
| Blog | Rich editor | Admin viết nội dung dài, format từng dòng | Editor UI + sanitize/render |
| Blog | Gallery blog, chọn ảnh chính | Blog có ảnh đại diện và gallery xem lớn | Upload + lightbox |
| Blog | Related content | Gắn blog với sản phẩm/dịch vụ/dự án | Cross-link tăng chuyển đổi |
| Blog | Blog list có latest blog, category filter, tags, pagination | Trải nghiệm đọc chuyên nghiệp, SEO page rõ | Business logic + UI |
| Blog | Blog detail có related blog cùng category | Giữ user đọc tiếp | UX đọc blog |
| Tìm kiếm | Header search toàn site | Tìm nhanh Sản phẩm/Dịch vụ/Dự án/Blog | Search server + dropdown UI |
| Giao diện | Admin chọn font website | Khách tự đổi typography mà không sửa code | Appearance CMS |
| Giao diện | 10+ font/preset Việt/Anh | Nhiều option phù hợp doanh nghiệp | Font preset system |
| Cache | Cache tags cho blog/appearance/category | Tăng performance, revalidate đúng | Performance/backend |
| i18n | Blog song ngữ VI/EN | Hỗ trợ SEO song ngữ | Slug/route/content song ngữ |
| Deploy | Tách env rõ hơn | Dễ triển khai staging/production | DevOps |

### 7.3. Tính năng có giá trị tính phí cao

Những phần nên tính chi phí riêng vì không phải sửa UI đơn giản:

1. **Blog module hoàn chỉnh**
   - DB schema
   - Admin CRUD
   - Rich editor
   - Gallery
   - Related content
   - Public list/detail
   - Pagination/filter/tag
   - SEO song ngữ

2. **Font/appearance CMS**
   - Preset font
   - Custom heading/body font
   - Apply ra public website
   - Preview trong admin

3. **Global site search**
   - Search đa collection: sản phẩm, dịch vụ, dự án, blog
   - Search theo tên/mô tả/nội dung
   - Dropdown kết quả realtime
   - Điều hướng trực tiếp sang detail

4. **Chi tiết sản phẩm/dịch vụ/dự án**
   - Route public riêng
   - Gallery/related carousel
   - SEO tốt hơn

5. **Migration DB + production S3**
   - Không chỉ deploy, mà còn đảm bảo dữ liệu cũ chạy với schema mới
   - Cần backup, migration, smoke test

---

## 8. Checklist deploy source mới dùng lại hệ thống cũ

### Bước 1: Lấy production env từ deploy cũ

Cần lấy từ hosting cũ:

```txt
MONGODB_URI
MONGODB_DBNAME
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
ADMIN_EMAILS
NEXT_PUBLIC_ADMIN_EMAILS nếu có
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_S3_BUCKET_NAME
SMTP_*
BETTER_AUTH_SECRET
```

Nếu không có `NEXT_PUBLIC_ADMIN_EMAILS`, tạo mới bằng đúng giá trị của `ADMIN_EMAILS`.

### Bước 2: Sửa code S3 production

Replace:

```txt
src/lib/s3.ts
next.config.ts
```

bằng file trong `code-files`.

### Bước 3: Sửa login unauthorized route

Apply patch:

```txt
code-files/src/app/login/page.tsx.patch
```

### Bước 4: Deploy source mới lên staging

Set env theo `.env.production.template`.

### Bước 5: Backup DB cũ

Trước migration:

```bash
mongodump --uri="<old-production-mongodb-uri>" --out ./backup-before-new-source
```

### Bước 6: Chạy migration DB

```bash
node scripts/migrate-old-db-to-current-schema.mjs
```

### Bước 7: Smoke test

Test public:

```txt
/vi
/en
/vi/products
/vi/products/[id]
/vi/services
/vi/services/[id]
/vi/projects
/vi/projects/[id]
/vi/blog
/vi/blog/[slug]
/vi/contact
```

Test admin:

```txt
/admin
/admin/products
/admin/productcategories
/admin/services
/admin/projects
/admin/projectcategories
/admin/blogs
/admin/blogcategories
/admin/appearance
/admin/contact
```

Test uploads:

```txt
- Upload ảnh sản phẩm
- Upload ảnh dịch vụ
- Upload ảnh dự án
- Upload ảnh blog
- Kiểm tra URL ảnh là S3, không phải /uploads local
```

Test auth:

```txt
- Login bằng Gmail admin cũ
- Gmail không nằm trong ADMIN_EMAILS bị chặn
```

---

## 9. Ghi chú rủi ro

1. **Source cũ zip không chứa secret production thật.** Nếu không lấy được env từ hosting cũ, không thể tự suy ra DB/S3/admin thật từ source.
2. **DB cũ cần migration.** Nếu không migration, category sản phẩm/dự án và contact footer/CTA có thể thiếu.
3. **Source mới hiện local upload.** Nếu không restore S3 code, ảnh mới upload sau deploy có thể mất khi redeploy hoặc không dùng kho ảnh cũ.
4. **Google OAuth phải thêm domain mới.** Nếu không, login admin sẽ lỗi callback.
5. **Admin emails phải set cả server và client env.** Nếu chỉ set `ADMIN_EMAILS` mà thiếu `NEXT_PUBLIC_ADMIN_EMAILS`, login client có thể redirect sai.

---

## 10. File trong package này

```txt
NH_MIGRATION_AND_CHANGE_REPORT.md
NH_MIGRATION_AND_CHANGE_REPORT.docx

templates/.env.production.template

code-files/src/lib/s3.ts
code-files/next.config.ts
code-files/src/app/login/page.tsx.patch
code-files/scripts/migrate-old-db-to-current-schema.mjs
```
