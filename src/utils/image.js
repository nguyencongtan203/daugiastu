// HARD-CODE Supabase project URL (public). KHÔNG dán service role key.
// Thay giá trị dưới đây bằng Project URL thật của bạn:
const SUPABASE_URL = 'https://gcxlqxkowwkdhyiyjaks.supabase.co' // ← THAY nếu khác
// Nếu sau này có CDN cho bucket, điền vào đây; nếu chưa có cứ để chuỗi rỗng:
const CDN_BASE = '' // ví dụ: 'https://cdn.yourdomain.com'

// Đường dẫn public chuẩn: <SUPABASE_URL>/storage/v1/object/public/<key>
// key = 'imgs/product/<masp>/<filename>'
export function buildImageUrl(key) {
  if (!key) return '/placeholder.png'
  // Ưu tiên CDN nếu cấu hình
  if (CDN_BASE && CDN_BASE.trim()) {
    return CDN_BASE.replace(/\/+$/, '') + '/' + key
  }
  if (!SUPABASE_URL || !SUPABASE_URL.trim()) {
    console.warn('[image] SUPABASE_URL chưa cấu hình')
    return '/placeholder.png'
  }
  return SUPABASE_URL.replace(/\/+$/, '') + '/storage/v1/object/public/' + key
}

// Fallback wrapper an toàn (nếu muốn dùng ở nhiều nơi)
export function getImageUrl(key) {
  return buildImageUrl(key)
}

// (Tuỳ chọn) Hàm tạo thumbnail nếu sau này bạn sinh folder thumbnails:
// export function getThumbUrl(key) {
//   if (!key) return '/placeholder.png'
//   const thumbKey = key.replace(/imgs\/product\//, 'imgs/product/thumbs/')
//   return buildImageUrl(thumbKey)
// }

export default buildImageUrl