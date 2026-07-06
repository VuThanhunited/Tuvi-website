import React from 'react';

// Component helper cho hình ảnh icon nhằm hỗ trợ kích thước (size) và style động
const IconImage = ({ src, alt, size, className = '', style = {}, ...props }) => {
  const mergedStyle = {
    width: size ? `${size}px` : 'auto',
    height: size ? `${size}px` : 'auto',
    objectFit: 'contain',
    display: 'inline-block',
    verticalAlign: 'middle',
    ...style
  };
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`icon-img ${className}`} 
      style={mergedStyle} 
      {...props} 
    />
  );
};

export const StarChartIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/02_nav_lap_la_so_sun.png" alt="Lập Lá Số" size={size} {...props} />
);

export const CoinIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/03_nav_phu_tu_vi_yinyang.png" alt="Phú Tử Vi" size={size} {...props} />
);

export const ScrollIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/04_nav_gioi_thieu_book.png" alt="Giới thiệu Tử Vi" size={size} {...props} />
);

export const CompassIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/05_nav_huong_dan_cap.png" alt="Hướng dẫn xem Tử Vi" size={size} {...props} />
);

export const MasterIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/06_nav_danh_sach_thay.png" alt="Danh sách Thầy Tử Vi" size={size} {...props} />
);

export const ArticleIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/07_nav_bai_viet_edit.png" alt="Bài viết" size={size} {...props} />
);

export const HoroscopeIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/08_nav_la_so_cua_ban_chart.png" alt="Lá số của bạn" size={size} {...props} />
);

export const GlobeIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/09_nav_gioi_thieu_mxh.png" alt="Giới thiệu MXH Tử Vi" size={size} {...props} />
);

export const HandshakeIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/12_action_xem_hop_tac.png" alt="Xem hợp tác" size={size} {...props} />
);

export const CalendarIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/13_action_xem_ngay_sinh.png" alt="Xem ngày sinh" size={size} {...props} />
);

export const HeartsIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/14_action_xem_tinh_duyen.png" alt="Xem tình duyên" size={size} {...props} />
);

export const DiamondIcon = ({ size = 32, ...props }) => (
  <IconImage src="/icons/15_sponsor_kim_cuong.png" alt="Tài trợ Kim Cương" size={size} {...props} />
);

export const GoldMedalIcon = ({ size = 32, ...props }) => (
  <IconImage src="/icons/16_sponsor_vang_crown.png" alt="Tài trợ Vàng" size={size} {...props} />
);

export const SilverMedalIcon = ({ size = 32, ...props }) => (
  <IconImage src="/icons/17_sponsor_bac_crown.png" alt="Tài trợ Bạc" size={size} {...props} />
);

export const BellIcon = ({ size = 20, ...props }) => (
  <IconImage src="/icons/10_top_thong_bao_bell.png" alt="Thông báo" size={size} {...props} />
);

export const FilterIcon = ({ size = 18, ...props }) => (
  <IconImage src="/icons/21_filter_list_icon.png" alt="Bộ lọc" size={size} {...props} />
);

export const VerifiedIcon = ({ size = 12, ...props }) => (
  <IconImage src="/icons/26_verified_check.png" alt="Đã xác minh" size={size} {...props} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
);

export const FacebookIcon = ({ size = 24, ...props }) => (
  <IconImage src="/icons/19_facebook_follow.png" alt="Facebook" size={size} {...props} />
);

export const SunStarIcon = ({ size = 18, ...props }) => (
  <IconImage src="/icons/22_post_avatar_tu_vi.png" alt="Tử Vi" size={size} {...props} />
);

export const TempleIcon = ({ size = 18, ...props }) => (
  <IconImage src="/icons/23_post_avatar_phong_thuy.png" alt="Phong Thủy" size={size} {...props} />
);

export const TarotIcon = ({ size = 18, ...props }) => (
  <IconImage src="/icons/24_post_avatar_tarot.png" alt="Tarot" size={size} {...props} />
);

export const SearchIcon = ({ size = 18, ...props }) => (
  <IconImage src="/icons/20_search_icon.png" alt="Tìm kiếm" size={size} {...props} />
);

export const BookmarkIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/31_engagement_save.png" alt="Lưu" size={size} {...props} />
);

export const CommentIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/29_engagement_comment.png" alt="Bình luận" size={size} {...props} />
);

export const ShareIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/30_engagement_share.png" alt="Chia sẻ" size={size} {...props} />
);

export const LikeIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/28_engagement_like.png" alt="Thích" size={size} {...props} />
);

// Fallback SVG giữ nguyên cho các icon không có trong bộ PNG
export const EyeIcon = ({ size = 16, color = '#64748b', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// Thêm các Icon mới bổ sung từ bộ icon PNG
export const RatingStarIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/35_rating_star.png" alt="Sao đánh giá" size={size} {...props} />
);

export const LocationPinIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/36_location_pin.png" alt="Địa điểm" size={size} {...props} />
);

export const PointsDiamondIcon = ({ size = 16, ...props }) => (
  <IconImage src="/icons/11_top_diem_diamond.png" alt="Điểm" size={size} {...props} />
);

export const ProfileButtonIcon = ({ size = 14, ...props }) => (
  <IconImage src="/icons/37_profile_button_icon.png" alt="Xem hồ sơ" size={size} {...props} />
);
