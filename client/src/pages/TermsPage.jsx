import './StaticPages.css';

export default function TermsPage() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>📄 Điều Khoản Sử Dụng</h1>
          <p>Cập nhật lần cuối: 01/05/2025</p>
        </div>

        <div className="content-card">
          <h2>1. Giới Thiệu</h2>
          <p>Chào mừng bạn đến với TuVi. Bằng việc truy cập và sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản dưới đây.</p>

          <h3>2. Dịch Vụ</h3>
          <p>TuVi cung cấp các công cụ tính toán tử vi, lập lá số, xem horoscope và các nội dung kiến thức liên quan đến tử vi cổ học Việt Nam. Kết quả mang tính tham khảo.</p>

          <h3>3. Tài Khoản Người Dùng</h3>
          <p>Bạn có trách nhiệm bảo mật thông tin tài khoản. Mọi hoạt động dưới tài khoản của bạn là trách nhiệm của bạn.</p>

          <h3>4. Quyền Sở Hữu Trí Tuệ</h3>
          <p>Tất cả nội dung, thiết kế, thuật toán trên TuVi đều thuộc quyền sở hữu của chúng tôi. Nghiêm cấm sao chép, phân phối mà không có sự đồng ý.</p>

          <h3>5. Giới Hạn Trách Nhiệm</h3>
          <p>Kết quả tử vi chỉ mang tính tham khảo. Chúng tôi không chịu trách nhiệm về quyết định cá nhân dựa trên kết quả tử vi.</p>

          <h3>6. Liên Hệ</h3>
          <p>Nếu có thắc mắc về điều khoản, vui lòng liên hệ: info@tuvi.vn</p>
        </div>
      </div>
    </div>
  );
}
