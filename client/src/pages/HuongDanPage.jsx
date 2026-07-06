import './StaticPages.css';
import { StarChartIcon } from '../components/Icons.jsx';

export default function HuongDanPage() {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-page-header">
          <h1>📖 Hướng Dẫn Xem Tử Vi Cơ Bản</h1>
          <p>Cẩm nang từng bước giúp bạn tự đọc và hiểu các thông tin cốt lõi trên lá số tử vi của mình</p>
        </div>

        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🌐</span>
            <h2 style={{ margin: 0 }}>Bước 1: Lập Lá Số Tử Vi Chính Xác</h2>
          </div>
          <p>
            Để bắt đầu xem tử vi, bạn cần có một lá số tử vi được lập dựa trên 4 thông tin cốt lõi:
          </p>
          <ul style={{ lineHeight: '1.7', color: '#cbd5e1' }}>
            <li><strong>Họ và tên:</strong> Giúp định danh người xem.</li>
            <li><strong>Giờ sinh:</strong> Rất quan trọng (quyết định vị trí các cung và các sao).</li>
            <li><strong>Ngày, tháng, năm sinh:</strong> Cần xác định chính xác theo lịch Dương hoặc lịch Âm. Hệ thống sẽ tự động quy đổi.</li>
            <li><strong>Giới tính:</strong> Quyết định chiều đi của các đại vận (Thuận hay Nghịch lý).</li>
          </ul>
          <div style={{ marginTop: '1.2rem' }}>
            <a href="/la-so" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
              <StarChartIcon size={16} /> Lập Lá Số Ngay
            </a>
          </div>
        </div>

        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>🗺️</span>
            <h2 style={{ margin: 0 }}>Bước 2: Hiểu Bố Cục Lá Số (12 Cung Số)</h2>
          </div>
          <p>
            Một lá số tử vi tiêu chuẩn được chia làm 12 cung xung quanh và 1 cung ở giữa (Cung Thiên Bàn).
            Mỗi cung quản lý một phương diện trong cuộc sống của bạn:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            marginTop: '1rem',
            color: '#cbd5e1'
          }}>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>1. Cung Mệnh:</strong> Bản mệnh, tính cách, hình dáng và cuộc đời tổng quan.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>2. Cung Phụ Mẫu:</strong> Cha mẹ, mối quan hệ và phúc thọ của cha mẹ.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>3. Cung Phúc Đức:</strong> Họ hàng, phúc đức tổ tiên, đời sống tinh thần của bạn.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>4. Cung Điền Trạch:</strong> Nhà cửa, đất đai, bất sản tài sản tích lũy.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>5. Cung Quan Lộc:</strong> Công danh, sự nghiệp, học hành thi cử và công việc.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>6. Cung Nô Bộc:</strong> Bạn bè, cấp dưới, đồng nghiệp và các mối quan hệ xã hội.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>7. Cung Thiên Di:</strong> Việc đi lại, xuất ngoại, môi trường bên ngoài khi ra đời.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>8. Cung Tật Ách:</strong> Sức khỏe, tai ách, bệnh tật dễ gặp phải trong đời.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>9. Cung Tài Bạch:</strong> Tiền bạc, khả năng kiếm tiền và quản lý tài chính.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>10. Cung Tử Tức:</strong> Con cái, số lượng con, sức khỏe và sự hiếu thảo.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>11. Cung Phu Thê:</strong> Chồng/vợ, nhân duyên, cuộc sống hôn nhân gia đình.
            </div>
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: '3px solid var(--color-gold)' }}>
              <strong>12. Cung Huynh Đệ:</strong> Anh chị em ruột, mức độ hòa thuận và trợ giúp.
            </div>
          </div>
        </div>

        <div className="content-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>✨</span>
            <h2 style={{ margin: 0 }}>Bước 3: Xem Các Sao Cát Tinh Và Hung Tinh</h2>
          </div>
          <p>
            Các sao phân bổ trong các cung sẽ tạo nên các cách cục tốt hay xấu:
          </p>
          <ul style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
            <li><strong>Chính Tinh (14 Sao Chính):</strong> Đóng vai trò chủ đạo quyết định tính chất cốt lõi của cung đó (Ví dụ: Tử Vi, Thiên Phủ, Vũ Khúc, Thái Dương...).</li>
            <li><strong>Cát Tinh (Sao Tốt):</strong> Mang lại may mắn, tài lộc, hóa giải tai ách (Ví dụ: Hóa Lộc, Hóa Quyền, Tả Phù, Hữu Bật, Thiên Khôi, Thiên Việt...).</li>
            <li><strong>Sát Tinh/Hung Tinh (Sao Xấu):</strong> Gây cản trở, tai họa, bệnh tật (Ví dụ: Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh, Linh Tinh...).</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
