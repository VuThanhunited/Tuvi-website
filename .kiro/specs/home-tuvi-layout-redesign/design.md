# Design Document

## Overview

This document describes the technical design for redesigning the Home page and TuViForm component to display a traditional Tu Vi astrology chart with a 4x4 grid layout. The design introduces a new TuViChart component, restructures the TuViForm layout to support side-by-side chart and form display, and applies consistent visual styling matching the reference images.

## Architecture

### Component Structure

```
Home (existing)
├── UserDashboard (existing)
├── TuViForm (modified)
│   ├── TuViChart (new)
│   │   ├── PalaceCell (new)
│   │   └── ChartCenter (new)
│   ├── FormPanel (refactored from existing form)
│   └── TableOfContents (new)
├── ChatWidget (existing)
├── ActivityFeed (existing)
└── MasterRanking (existing)
```

### New Components

#### 1. TuViChart Component

**Location:** `client/src/components/TuViChart/TuViChart.jsx`

**Purpose:** Renders the 4x4 grid layout displaying the 12 Tu Vi palaces and center information.

**Props:**
```javascript
{
  chartData: {
    palaces: Array<{
      name: string,        // Palace name (Tý, Sửu, etc.)
      position: number,    // Grid position (0-15)
      stars: Array<string>,
      details: string
    }>,
    centerInfo: {
      hoTen: string,
      ngaySinh: string,
      thangSinh: string,
      namSinh: string,
      gioSinh: string,
      gioiTinh: string
    }
  },
  isLoading: boolean
}
```

**State:**
- None (pure presentational component)

**Layout:**
- 4x4 CSS Grid
- Grid positions: 0-15 (row-major order)
- Center cells (5, 6, 9, 10) reserved for ChartCenter
- Palace cells at positions: 0, 1, 2, 3, 4, 7, 8, 11, 12, 13, 14, 15

#### 2. PalaceCell Component

**Location:** `client/src/components/TuViChart/PalaceCell.jsx`

**Purpose:** Renders individual palace cell with name, stars, and details.

**Props:**
```javascript
{
  palace: {
    name: string,
    stars: Array<string>,
    details: string
  },
  onClick: function
}
```

#### 3. ChartCenter Component

**Location:** `client/src/components/TuViChart/ChartCenter.jsx`

**Purpose:** Renders the center 2x2 area with overview information.

**Props:**
```javascript
{
  centerInfo: {
    hoTen: string,
    ngaySinh: string,
    thangSinh: string,
    namSinh: string,
    gioSinh: string,
    gioiTinh: string
  }
}
```

#### 4. TableOfContents Component

**Location:** `client/src/components/TableOfContents/TableOfContents.jsx`

**Purpose:** Displays a list of all 12 palaces for navigation.

**Props:**
```javascript
{
  palaces: Array<{
    name: string,
    position: number
  }>,
  onPalaceClick: function
}
```

### Modified Components

#### TuViForm Component

**Changes:**
1. Restructure layout to two-column grid (chart left, form right)
2. Add state for chartData to pass to TuViChart
3. Add namXem and thangXem fields to formData state
4. Update form submission to include new fields
5. Integrate TuViChart and TableOfContents components

**New State:**
```javascript
const [chartData, setChartData] = useState(null);
const [formData, setFormData] = useState({
  hoTen: '',
  gioiTinh: 'nam',
  ngaySinh: '',
  thangSinh: '',
  namSinh: '',
  gioSinh: '',
  namXem: new Date().getFullYear().toString(),
  thangXem: (new Date().getMonth() + 1).toString()
});
```

**Layout Structure:**
```
<div className="tuvi-form-wrapper">
  <div className="tuvi-form-container">
    <div className="tuvi-chart-column">
      <TuViChart chartData={chartData} isLoading={loading} />
      <TableOfContents palaces={chartData?.palaces} />
    </div>
    <div className="tuvi-form-column">
      <FormPanel 
        formData={formData}
        isLunar={isLunar}
        error={error}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onReset={handleReset}
        onLunarToggle={setIsLunar}
      />
    </div>
  </div>
</div>
```

## Data Flow

### Form Submission Flow

1. User fills form in FormPanel
2. User clicks "LẬP LÁ SỐ" button
3. TuViForm.handleSubmit() called
4. API request sent to `/api/tuvi/calculate` with all form data including namXem and thangXem
5. Response received with chart data
6. chartData state updated
7. TuViChart re-renders with new data
8. Navigate to results page (existing behavior)

### Palace Navigation Flow

1. User clicks palace name in TableOfContents
2. onPalaceClick handler called with palace position
3. Scroll to corresponding PalaceCell in TuViChart
4. Highlight selected palace (optional visual feedback)

## Styling Design

### Color Scheme

- **Background:** `#0b0d12` (dark base)
- **Card Background:** `#15171d` (elevated surface)
- **Border:** `rgba(212, 175, 55, 0.2)` (golden accent)
- **Primary Gold:** `#d4af37`
- **Text Primary:** `#e5e7eb`
- **Text Muted:** `#94a3b8`

### CSS Organization

**New Files:**
- `client/src/components/TuViChart/TuViChart.css`
- `client/src/components/TuViChart/PalaceCell.css`
- `client/src/components/TuViChart/ChartCenter.css`
- `client/src/components/TableOfContents/TableOfContents.css`

**Modified Files:**
- `client/src/components/TuViForm/TuViForm.css`

### Grid Layout Specifications

**TuViChart Grid:**
```css
.tuvi-chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 2px;
  background: rgba(212, 175, 55, 0.3);
  border: 2px solid rgba(212, 175, 55, 0.5);
  aspect-ratio: 1 / 1;
  max-width: 800px;
}
```

**Palace Cell:**
```css
.palace-cell {
  background: #15171d;
  padding: 12px;
  border: 1px solid rgba(212, 175, 55, 0.2);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

**Chart Center:**
```css
.chart-center {
  grid-column: 2 / 4;
  grid-row: 2 / 4;
  background: linear-gradient(145deg, #1f2229, #15171d);
  border: 2px solid rgba(212, 175, 55, 0.4);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
```

**Two-Column Layout:**
```css
.tuvi-form-container {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .tuvi-form-container {
    grid-template-columns: 1fr;
  }
}
```

### Button Styling

**Submit Button:**
```css
.btn-submit-tuvi {
  background: linear-gradient(135deg, #d4af37, #c5a059);
  color: #000;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-submit-tuvi:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6);
  background: linear-gradient(135deg, #e5c047, #d4af37);
}
```

## Palace Position Mapping

Traditional Tu Vi chart positions (clockwise from top-left):

```
Grid Layout (0-15):
┌─────┬─────┬─────┬─────┐
│  0  │  1  │  2  │  3  │  Row 0
│ Tý  │ Sửu │ Dần │ Mão │
├─────┼─────┼─────┼─────┤
│  4  │  5  │  6  │  7  │  Row 1
│ Tuất│ CTR │ CTR │ Thìn│
├─────┼─────┼─────┼─────┤
│  8  │  9  │ 10  │ 11  │  Row 2
│ Dậu │ CTR │ CTR │ Tỵ  │
├─────┼─────┼─────┼─────┤
│ 12  │ 13  │ 14  │ 15  │  Row 3
│ Thân│ Mùi │ Ngọ │ Hợi │
└─────┴─────┴─────┴─────┘

CTR = Chart Center (2x2 area)
```

**Palace to Position Mapping:**
```javascript
const PALACE_POSITIONS = {
  'Tý': 0,
  'Sửu': 1,
  'Dần': 2,
  'Mão': 3,
  'Thìn': 7,
  'Tỵ': 11,
  'Ngọ': 14,
  'Mùi': 13,
  'Thân': 12,
  'Dậu': 8,
  'Tuất': 4,
  'Hợi': 15
};
```

## Form Field Additions

### New Fields in FormPanel

**Năm xem (View Year):**
```jsx
<div className="form-group">
  <label className="form-label" htmlFor="namXem">Năm xem</label>
  <input 
    type="number" 
    id="namXem" 
    name="namXem" 
    className="form-input" 
    placeholder="VD: 2026" 
    min="1920" 
    max="2100" 
    value={formData.namXem} 
    onChange={handleChange} 
    required 
  />
</div>
```

**Tháng xem (View Month - Lunar):**
```jsx
<div className="form-group">
  <label className="form-label" htmlFor="thangXem">Tháng xem (Âm lịch)</label>
  <select 
    id="thangXem" 
    name="thangXem" 
    className="form-select" 
    value={formData.thangXem} 
    onChange={handleChange} 
    required
  >
    {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
      <option key={m} value={m}>Tháng {m}</option>
    ))}
  </select>
</div>
```

## Responsive Breakpoints

- **Desktop (>1024px):** Two-column layout, full chart size
- **Tablet (768px-1024px):** Stacked layout, chart above form
- **Mobile (<768px):** Stacked layout, smaller chart cells, single-column form

## Integration Points

### API Integration

**Endpoint:** `POST /api/tuvi/calculate`

**Request Body (updated):**
```json
{
  "hoTen": "string",
  "gioiTinh": "nam|nu",
  "ngaySinh": "string",
  "thangSinh": "string",
  "namSinh": "string",
  "gioSinh": "string",
  "isLunar": "boolean",
  "namXem": "string",
  "thangXem": "string"
}
```

**Response:** (existing structure, no changes needed)

### Home Page Integration

The TuViForm component remains in the left column of the Home page. The two-column layout is internal to TuViForm, so the Home page structure is unchanged.

## Implementation Notes

1. **Empty State:** When no chart data is available (initial load), display an empty chart template with placeholder text in each palace cell
2. **Loading State:** Show a loading spinner in the chart area while API request is in progress
3. **Error Handling:** Display error messages in the form panel, not in the chart area
4. **Accessibility:** Ensure all interactive elements (palace cells, table of contents links) are keyboard accessible
5. **Performance:** Use React.memo for PalaceCell components to prevent unnecessary re-renders

## Testing Considerations

1. Test chart rendering with various data sets (empty, partial, full)
2. Test responsive behavior at all breakpoints
3. Test form validation for new fields (namXem, thangXem)
4. Test palace navigation from TableOfContents
5. Test API integration with new fields
6. Test loading and error states
7. Verify visual styling matches reference images
