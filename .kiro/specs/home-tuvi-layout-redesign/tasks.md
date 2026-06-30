# Implementation Plan

## Overview

This implementation plan outlines the tasks required to redesign the Home page and TuViForm component to display a traditional Tu Vi astrology chart with a 4x4 grid layout, matching the provided reference images.

## Tasks

- [ ] 1. Create TuViChart component with 4x4 grid layout, empty state, loading state, and dark theme styling with golden accents
  - [x] 1.1. Create `client/src/components/TuViChart/TuViChart.jsx` and `TuViChart.css` files
  - [ ] 1.2. Implement 4x4 CSS grid layout with proper spacing and borders
  - [ ] 1.3. Add props interface for chartData and isLoading
  - [ ] 1.4. Implement empty and loading states

- [ ] 2. Create PalaceCell component to render individual palace information with name, stars, and details
  - [ ] 2.1. Create `client/src/components/TuViChart/PalaceCell.jsx` and `PalaceCell.css` files
  - [ ] 2.2. Implement palace name, stars list, and details rendering
  - [ ] 2.3. Add onClick handler and styling with overflow handling

- [ ] 3. Create ChartCenter component to display overview information in center 2x2 area
  - [ ] 3.1. Create `client/src/components/TuViChart/ChartCenter.jsx` and `ChartCenter.css` files
  - [ ] 3.2. Implement display of name, birth date/time, and gender
  - [ ] 3.3. Position to span grid cells 5, 6, 9, 10 with distinctive styling

- [ ] 4. Integrate PalaceCell and ChartCenter into TuViChart grid with correct positioning
  - [ ] 4.1. Import components and map palace data to grid positions
  - [ ] 4.2. Render PalaceCell at positions 0,1,2,3,4,7,8,11,12,13,14,15
  - [ ] 4.3. Render ChartCenter at center position

- [ ] 5. Create TableOfContents component to list all 12 palaces for navigation
  - [ ] 5.1. Create `client/src/components/TableOfContents/TableOfContents.jsx` and CSS files
  - [ ] 5.2. Implement palace list with onClick handlers and scroll-to-palace functionality
  - [ ] 5.3. Apply consistent styling and responsive design

- [ ] 6. Refactor TuViForm to two-column layout with chart left and form right
  - [ ] 6.1. Update TuViForm.jsx structure with two-column container
  - [ ] 6.2. Update TuViForm.css with grid layout and responsive breakpoints
  - [ ] 6.3. Ensure existing form functionality is preserved

- [ ] 7. Add namXem and thangXem fields to form panel with validation
  - [ ] 7.1. Add fields to formData state with default values
  - [ ] 7.2. Create input fields with proper validation and styling
  - [ ] 7.3. Update handleChange and handleReset functions

- [ ] 8. Update form submission to include namXem and thangXem in API request
  - [ ] 8.1. Update handleSubmit to include new fields in request body
  - [ ] 8.2. Test form submission and error handling

- [ ] 9. Enhance submit button styling with golden gradient and hover effects
  - [ ] 9.1. Update button text to "LẬP LÁ SỐ" and apply golden gradient
  - [ ] 9.2. Add box-shadow and hover effects
  - [ ] 9.3. Ensure accessibility on mobile devices

- [ ] 10. Integrate TuViChart into TuViForm left column
  - [ ] 10.1. Import TuViChart and add chartData state
  - [ ] 10.2. Pass props and position in left column
  - [ ] 10.3. Handle empty state and ensure correct rendering

- [ ] 11. Integrate TableOfContents below TuViChart in left column
  - [ ] 11.1. Import and position TableOfContents component
  - [ ] 11.2. Implement onPalaceClick handler for navigation
  - [ ] 11.3. Add proper spacing and responsive design

- [ ] 12. Implement responsive design for all components at breakpoints 1024px, 768px, 640px
  - [ ] 12.1. Test and adjust TuViChart grid layout
  - [ ] 12.2. Test two-column stacking and form field layout
  - [ ] 12.3. Verify button sizes and text readability

- [ ] 13. Test and verify complete integration with all requirements
  - [ ] 13.1. Test form submission, chart display, and navigation
  - [ ] 13.2. Verify visual styling and responsive behavior
  - [ ] 13.3. Test loading/error states and accessibility

- [ ] 14. Update documentation and push changes to GitHub for Vercel deployment
  - [ ] 14.1. Add comments and verify file formatting
  - [ ] 14.2. Create git commit and push to GitHub
  - [ ] 14.3. Verify Vercel deployment and test deployed version

## Notes

- All new components follow React best practices with proper prop validation
- Styling uses existing CSS variables and color scheme for consistency
- Responsive design ensures usability on all device sizes
- Empty and loading states provide good user experience
- Integration preserves existing Home page functionality

## Task Dependency Graph

```json
{
  "waves": [
    {
      "name": "Wave 1: Core Components",
      "tasks": ["1", "2", "3", "5"]
    },
    {
      "name": "Wave 2: Integration & Layout",
      "tasks": ["4", "6"]
    },
    {
      "name": "Wave 3: Form Enhancements",
      "tasks": ["7", "9"]
    },
    {
      "name": "Wave 4: Form Submission",
      "tasks": ["8"]
    },
    {
      "name": "Wave 5: Chart Integration",
      "tasks": ["10"]
    },
    {
      "name": "Wave 6: TOC Integration",
      "tasks": ["11"]
    },
    {
      "name": "Wave 7: Responsive Design",
      "tasks": ["12"]
    },
    {
      "name": "Wave 8: Testing",
      "tasks": ["13"]
    },
    {
      "name": "Wave 9: Deployment",
      "tasks": ["14"]
    }
  ]
}
```
