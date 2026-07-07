import { Link } from 'react-router-dom';
import logoImg from '../../data/logo.jpg';
import './Footer.css';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-container-new">
        {/* Brand/Copyright Block */}
        <div className="footer-brand-new">
          <Link to="/" className="footer-logo-new">
            <img src={logoImg} alt="TuVi Logo" style={{ height: '56px', borderRadius: '6px' }} />
          </Link>
          <p className="footer-copyright-new">
            Bản quyền thuộc về Cộng Đồng Học Hỏi & Nghiên Cứu Tử Vi Việt Nam
          </p>
        </div>

        {/* Contacts Block */}
        <div className="footer-contacts-new">
          <p>
            <strong>Liên hệ tài trợ:</strong>{' '}
            <a href="mailto:info@tuvi.vn">info@tuvi.vn</a> |{' '}
            <a href="tel:0817505493">0817.505.493</a>
          </p>
          <p>
            <strong>Liên hệ hợp tác, nghiên cứu, phát triển:</strong>{' '}
            <a href="mailto:info@tuvi.vn">info@tuvi.vn</a> |{' '}
            <a href="tel:0817505493">0817.505.493</a>
          </p>
        </div>

        {/* Social Icons Block - Only Zalo and Facebook */}
        <div className="footer-social-new">
          {/* Facebook */}
          <a href="https://www.facebook.com/groups/1353837944687586/" target="_blank" rel="noreferrer" className="social-icon-new facebook" aria-label="Facebook">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          {/* Zalo */}
          <a href="https://zalo.me/0817505493" target="_blank" rel="noreferrer" className="social-icon-new zalo" aria-label="Zalo">
            <svg viewBox="0 0 48 48" width="26" height="26" fill="#fff"><path d="M12.5 10h23a2.5 2.5 0 012.5 2.5v23a2.5 2.5 0 01-2.5 2.5h-23A2.5 2.5 0 0110 35.5v-23A2.5 2.5 0 0112.5 10z" fill="none"/><text x="12" y="34" fontFamily="Arial" fontWeight="900" fontSize="24" fill="#fff">Z</text></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
