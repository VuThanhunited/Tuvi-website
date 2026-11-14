import axios from 'axios';
import ScheduledPost from '../models/ScheduledPost.js';

const FB_GRAPH_URL = 'https://graph.facebook.com/v21.0';

/**
 * Lấy Page ID và Access Token từ env
 */
const getFBConfig = () => ({
  pageId: process.env.FB_PAGE_ID || '',
  pageToken: process.env.FB_PAGE_TOKEN || '',
});

/**
 * Kiểm tra cấu hình Facebook có hợp lệ không
 */
export const isFBConfigured = () => {
  const { pageId, pageToken } = getFBConfig();
  return !!(pageId && pageToken);
};

/**
 * Đăng một bài viết lên Facebook Page
 * @param {string} content - Nội dung bài viết
 * @param {string} imageUrl - URL ảnh (tùy chọn)
 * @returns {{ postId: string, postUrl: string }}
 */
export const postToFacebook = async (content, imageUrl = '') => {
  const { pageId, pageToken } = getFBConfig();

  if (!pageId || !pageToken) {
    throw new Error('Chưa cấu hình Facebook Page ID hoặc Access Token. Vào tab Cài Đặt để thiết lập.');
  }

  try {
    let response;

    if (imageUrl) {
      // Đăng bài có ảnh
      response = await axios.post(`${FB_GRAPH_URL}/${pageId}/photos`, null, {
        params: {
          message: content,
          url: imageUrl,
          access_token: pageToken,
        },
      });
    } else {
      // Đăng bài text
      response = await axios.post(`${FB_GRAPH_URL}/${pageId}/feed`, null, {
        params: {
          message: content,
          access_token: pageToken,
        },
      });
    }

    const postId = response.data.id || response.data.post_id || '';
    const postUrl = postId ? `https://www.facebook.com/${postId.replace('_', '/posts/')}` : '';

    return { postId, postUrl };
  } catch (err) {
    const fbError = err.response?.data?.error;
    if (fbError) {
      throw new Error(`Facebook API: ${fbError.message} (code ${fbError.code})`);
    }
    throw new Error(err.message || 'Lỗi kết nối Facebook API');
  }
};

/**
 * Kiểm tra token còn hiệu lực không và lấy thông tin page
 */
export const getFBPageInfo = async () => {
  const { pageId, pageToken } = getFBConfig();
  if (!pageId || !pageToken) {
    return { valid: false, message: 'Chưa cấu hình' };
  }
  try {
    const res = await axios.get(`${FB_GRAPH_URL}/${pageId}`, {
      params: {
        fields: 'id,name,fan_count,picture',
        access_token: pageToken,
      },
    });
    return { valid: true, page: res.data };
  } catch (err) {
    const msg = err.response?.data?.error?.message || 'Token không hợp lệ hoặc đã hết hạn';
    return { valid: false, message: msg };
  }
};

/**
 * Dùng User Access Token để lấy danh sách Facebook Pages mà user quản lý.
 * Mỗi page trả về kèm theo Page Access Token riêng.
 *
 * ⚠️ LƯU Ý QUAN TRỌNG:
 * Facebook KHÔNG cho phép post lên personal timeline qua API (đã xóa từ 2018).
 * Chỉ có thể post lên Facebook PAGE.
 * Hàm này giúp admin dùng User Token (dễ lấy hơn) → tự động tìm Page Token.
 *
 * @param {string} userToken - User Access Token (từ Graph API Explorer)
 * @returns {{ pages: Array }} - Danh sách pages với id, name, access_token
 */
export const getFBPagesFromUserToken = async (userToken) => {
  if (!userToken) throw new Error('Vui lòng cung cấp User Access Token.');

  try {
    // Lấy danh sách pages user quản lý (kèm page token)
    const res = await axios.get(`${FB_GRAPH_URL}/me/accounts`, {
      params: {
        fields: 'id,name,fan_count,picture,access_token',
        access_token: userToken,
      },
    });

    const pages = (res.data.data || []).map(p => ({
      id: p.id,
      name: p.name,
      fanCount: p.fan_count || 0,
      picture: p.picture?.data?.url || '',
      pageToken: p.access_token, // Page Token tương ứng
    }));

    if (pages.length === 0) {
      throw new Error('Tài khoản này không quản lý Facebook Page nào. Cần tạo Page trước khi dùng tính năng auto-post.');
    }

    return { pages };
  } catch (err) {
    const fbError = err.response?.data?.error;
    if (fbError) {
      // Phân biệt lỗi token hết hạn vs lỗi khác
      if (fbError.code === 190) throw new Error('User Token đã hết hạn. Vui lòng lấy token mới từ Graph API Explorer.');
      throw new Error(`Facebook API: ${fbError.message} (code ${fbError.code})`);
    }
    throw new Error(err.message || 'Lỗi kết nối Facebook API');
  }
};


/**
 * Chạy tất cả bài đã lên lịch mà đến giờ đăng (status=pending)
 * Được gọi bởi cron job
 */
export const runScheduledPosts = async () => {
  if (!isFBConfigured()) {
    console.log('[FB-Scheduler] Chưa cấu hình Facebook, bỏ qua.');
    return;
  }

  const now = new Date();

  // Lấy tất cả bài pending đã đến giờ
  const duePosts = await ScheduledPost.find({
    status: 'pending',
    scheduledAt: { $lte: now },
  }).sort({ scheduledAt: 1 });

  if (duePosts.length === 0) return;

  console.log(`[FB-Scheduler] Tìm thấy ${duePosts.length} bài cần đăng lúc ${now.toISOString()}`);

  for (const post of duePosts) {
    try {
      const { postId, postUrl } = await postToFacebook(post.content, post.imageUrl);

      await ScheduledPost.findByIdAndUpdate(post._id, {
        status: 'posted',
        fbPostId: postId,
        fbPostUrl: postUrl,
        postedAt: new Date(),
        error: '',
      });

      console.log(`[FB-Scheduler] ✅ Đã đăng bài "${post._id}" → ${postUrl}`);
    } catch (err) {
      console.error(`[FB-Scheduler] ❌ Lỗi đăng bài "${post._id}": ${err.message}`);

      await ScheduledPost.findByIdAndUpdate(post._id, {
        status: 'failed',
        error: err.message,
      });
    }
  }
};
