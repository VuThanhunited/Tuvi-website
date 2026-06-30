import { memo } from 'react';
import PropTypes from 'prop-types';
import './TuViChart.css';

/**
 * TuViChart Component
 * Renders a 4x4 grid layout displaying the 12 Tu Vi palaces and center information
 * 
 * Grid positions (0-15):
 * ┌─────┬─────┬─────┬─────┐
 * │  0  │  1  │  2  │  3  │
 * │ Tý  │ Sửu │ Dần │ Mão │
 * ├─────┼─────┼─────┼─────┤
 * │  4  │  5  │  6  │  7  │
 * │ Tuất│ CTR │ CTR │ Thìn│
 * ├─────┼─────┼─────┼─────┤
 * │  8  │  9  │ 10  │ 11  │
 * │ Dậu │ CTR │ CTR │ Tỵ  │
 * ├─────┼─────┼─────┼─────┤
 * │ 12  │ 13  │ 14  │ 15  │
 * │ Thân│ Mùi │ Ngọ │ Hợi │
 * └─────┴─────┴─────┴─────┘
 */

const TuViChart = ({ chartData, isLoading }) => {
  // Palace positions mapping
  const palacePositions = [0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15];
  
  // Empty state - no chart data available
  if (!chartData && !isLoading) {
    return (
      <div className="tuvi-chart-wrapper">
        <div className="tuvi-chart-grid">
          {/* Render all 16 grid cells */}
          {Array.from({ length: 16 }, (_, index) => {
            // Check if this position is a palace cell or center cell
            if (palacePositions.includes(index)) {
              return (
                <div key={index} className="palace-cell palace-cell-empty" style={{ gridArea: `auto` }}>
                  <div className="palace-name">—</div>
                  <div className="palace-placeholder">Chưa có dữ liệu</div>
                </div>
              );
            }
            // Center cells (5, 6, 9, 10) - will be covered by chart-center
            return null;
          })}
          
          {/* Empty center - spans grid positions 5, 6, 9, 10 */}
          <div className="chart-center chart-center-empty">
            <div className="center-icon">☯</div>
            <p className="center-placeholder">Nhập thông tin để xem lá số</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="tuvi-chart-wrapper">
        <div className="tuvi-chart-grid tuvi-chart-loading">
          <div className="chart-loading-overlay">
            <div className="spinner"></div>
            <p>Đang tính toán lá số...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render chart with data
  return (
    <div className="tuvi-chart-wrapper">
      <div className="tuvi-chart-grid">
        {/* Palace cells will be rendered here in future tasks */}
        {/* Chart center will be rendered here in future tasks */}
        <div className="chart-center">
          <p>Chart data loaded</p>
        </div>
      </div>
    </div>
  );
};

TuViChart.propTypes = {
  chartData: PropTypes.shape({
    palaces: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        position: PropTypes.number.isRequired,
        stars: PropTypes.arrayOf(PropTypes.string),
        details: PropTypes.string,
      })
    ),
    centerInfo: PropTypes.shape({
      hoTen: PropTypes.string,
      ngaySinh: PropTypes.string,
      thangSinh: PropTypes.string,
      namSinh: PropTypes.string,
      gioSinh: PropTypes.string,
      gioiTinh: PropTypes.string,
    }),
  }),
  isLoading: PropTypes.bool,
};

TuViChart.defaultProps = {
  chartData: null,
  isLoading: false,
};

export default memo(TuViChart);
