import { describe, it, expect } from 'vitest';
import { render } from 'react-test-renderer';
import TuViChart from './TuViChart.jsx';

describe('TuViChart Component', () => {
  it('renders empty state correctly', () => {
    const component = render(<TuViChart />);
    const tree = component.toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders loading state correctly', () => {
    const component = render(<TuViChart isLoading={true} />);
    const tree = component.toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders with chart data', () => {
    const mockData = {
      palaces: [
        { name: 'Tý', position: 0, stars: ['Sao 1'], details: 'Details' }
      ],
      centerInfo: {
        hoTen: 'Test User',
        ngaySinh: '15',
        thangSinh: '3',
        namSinh: '1990',
        gioSinh: '7-9',
        gioiTinh: 'nam'
      }
    };
    const component = render(<TuViChart chartData={mockData} />);
    const tree = component.toJSON();
    expect(tree).toBeTruthy();
  });
});
