import './StaticPages.css';

export default function PrivacyPage() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>🔒 Chính Sách Bảo Mật</h1>
          <p>Cập nhật lần cuối: 01/05/2025</p>
        </div>

        <div className="content-card">
          <h2>1. Thu Thập Dữ Liệu</h2>
          <p>Chúng tôi thu thập thông tin cần thiết để tính toán tử vi: họ tên, ngày giờ sinh, giới tính. Thông tin này chỉ được sử dụng cho mục đích tính toán.</p>

          <h3>2. Bảo Mật Thông Tin</h3>
          <p>Dữ liệu được mã hóa và bảo mật theo tiêu chuẩn ngành. Chúng tôi không chia sẻ thông tin cá nhân với bên thứ ba.</p>

          <h3>3. Cookies</h3>
          <p>Website sử dụng cookies để cải thiện trải nghiệm người dùng. Bạn có thể tắt cookies trong cài đặt trình duyệt.</p>

          <h3>4. Quyền Của Bạn</h3>
          <ul>
            <li>Quyền truy cập và xem dữ liệu cá nhân</li>
            <li>Quyền yêu cầu xóa dữ liệu</li>
            <li>Quyền từ chối thu thập dữ liệu</li>
            <li>Quyền khiếu nại về việc xử lý dữ liệu</li>
          </ul>

          <h3>5. Liên Hệ</h3>
          <p>Nếu có thắc mắc về chính sách bảo mật, vui lòng liên hệ: info@tuvi.vn</p>
        </div>
      </div>
    </div>
  );
}
