import { describe, it, expect } from 'vitest';
import { getThienCan, getDiaChi, getCanChi, getNapAm, getNguHanh, getNguHanhColor, getCuc, getAmDuong, getAmDuongLy, getMenhCuc, getGioChi, calculateTuVi } from './tuViCalculator';

describe('tuViCalculator utilities', () => {
  it('calculates the correct Thiên Can and Địa Chi for 1990', () => {
    expect(getThienCan(1990)).toBe('Canh');
    expect(getDiaChi(1990)).toBe('Ngọ');
    expect(getCanChi(1990)).toBe('Canh Ngọ');
  });

  it('returns the correct Nạp Âm and Ngũ Hành color', () => {
    const napAm = getNapAm(1990);
    expect(napAm).toBe('Đại Lâm Mộc');
    expect(getNguHanh(napAm)).toBe('Mộc');
    expect(getNguHanhColor('Mộc')).toBe('#2E8B57');
  });

  it('computes Cục and Âm Dương values', () => {
    expect(getCuc('Hỏa')).toEqual({ name: 'Hỏa Lục Cục', value: 6, hanh: 'Hỏa' });
    expect(getAmDuong(1990, 'nam')).toBe('Dương Nam');
    expect(getAmDuongLy(1990, 'nam')).toBe('Âm Dương thuận lý');
    expect(getMenhCuc('Hỏa', 'Hỏa')).toBe('Mệnh Cục bình hòa');
  });

  it('returns the correct Giờ Chi mapping', () => {
    expect(getGioChi('7-9')).toEqual({ chi: 'Thìn', index: 4 });
  });

  it('calculates a TuVi result object with expected properties', () => {
    const result = calculateTuVi({
      hoTen: 'Nguyễn Văn A',
      gioiTinh: 'nam',
      ngaySinh: '1',
      thangSinh: '1',
      namSinh: '1990',
      gioSinh: '7-9',
      isLunar: false,
    });

    expect(result.hoTen).toBe('Nguyễn Văn A');
    expect(result.gioiTinh).toBe('nam');
    expect(result.canChi).toContain('Ngọ');
    expect(result.cungResults).toHaveLength(12);
    expect(result.overallRating).toBeGreaterThanOrEqual(1);
    expect(result.advice.length).toBeGreaterThan(0);
  });
});
