# Blog module patch for NH - DUCT website

Gói này được chia đúng theo yêu cầu:

```txt
new-files/       Các file thêm mới
modified-files/  Các file thay thế file đang có
```

## Cách áp dụng

Copy nội dung trong `new-files/` và `modified-files/` vào root project, giữ nguyên cấu trúc thư mục.

Sau đó chạy:

```bash
npm run biome:format
npm run biome:check
npm run build
```

## Module thêm mới

Public routes:

```txt
/vi/blog
/en/blog
/vi/blog/[slug]
/en/blog/[slug]
```

Admin routes:

```txt
/admin/blogs
/admin/blogs/new
/admin/blogs/[blogId]/edit
/admin/blogcategories
```

## Database collections tự tạo khi dùng

```txt
blogPosts
blogCategories
```

## Tính năng chính

- Blog list public
- Blog detail public
- Blog categories
- Admin CRUD blog post
- Admin CRUD blog category
- Rich content block editor có kiểm soát
- Bold / italic / underline / link thông qua cú pháp markdown nhẹ trong block text
- Heading, paragraph, quote, list, image, gallery, table
- Cover image
- Gallery nhiều ảnh
- Typography riêng cho từng bài: font tiêu đề, font nội dung, cỡ chữ, giãn dòng, độ rộng bài
- SEO title / SEO description / keywords / OG image
- Related product/service/project/blog IDs
- Cache tags + revalidate

## Ghi chú quan trọng

- Tiếng Việt và tiếng Anh đều hiển thị label `Blog` trên header.
- Module này dùng các font preset đã có trong `src/lib/font-presets.ts`.
- Nếu anh đã chỉnh `font-presets.ts` ở source, không cần đổi file đó trong gói này; blog chỉ import và dùng lại.
- Upload ảnh blog đang lưu local vào `public/uploads/blog` giống pattern các hero/admin upload hiện tại.
