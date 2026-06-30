# Requirements Document

## Introduction

This document specifies the requirements for redesigning the Home page and TuViForm component to match the provided sample images. The redesign focuses on creating a traditional Tu Vi astrology chart display with a 4x4 grid layout showing the 12 palaces (cung), an improved form layout, and enhanced visual styling to match the reference design.

## Glossary

- **Tu_Vi_Chart**: The 12-palace astrology chart displayed in a 4x4 grid layout
- **Palace**: One of the 12 astrological houses (cung) in Tu Vi astrology (Tý, Sửu, Dần, Mão, Thìn, Tỵ, Ngọ, Mùi, Thân, Dậu, Tuất, Hợi)
- **TuViForm_Component**: The React component containing the input form for birth information
- **Home_Page**: The main landing page of the application
- **Table_Of_Contents**: A section listing all 12 palaces and related navigation items
- **Chart_Center**: The central area of the Tu Vi chart displaying overview information
- **Form_Panel**: The right-side panel containing input fields for user data
- **Lunar_Calendar**: Vietnamese lunar calendar system (Âm lịch)
- **Solar_Calendar**: Gregorian calendar system (Dương lịch)
- **View_Year**: The year for which the Tu Vi reading is calculated (Năm xem)
- **View_Month**: The lunar month for which the Tu Vi reading is calculated (Tháng xem)

## Requirements

### Requirement 1: Display Tu Vi Chart Grid

**User Story:** As a user, I want to see a 4x4 grid layout displaying the 12 palaces of Tu Vi astrology, so that I can visualize the traditional chart structure.

#### Acceptance Criteria

1. THE Tu_Vi_Chart SHALL display a 4x4 grid layout with 16 cells
2. THE Tu_Vi_Chart SHALL position the 12 palaces in their traditional locations within the grid
3. THE Tu_Vi_Chart SHALL reserve the center 4 cells (2x2) for the Chart_Center overview information
4. WHEN a Palace cell is rendered, THE Tu_Vi_Chart SHALL display the palace name (Tý, Sửu, Dần, etc.)
5. THE Tu_Vi_Chart SHALL apply consistent spacing and borders between grid cells
6. THE Tu_Vi_Chart SHALL use a color scheme matching the sample images (dark background with golden accents)

### Requirement 2: Render Palace Information

**User Story:** As a user, I want each palace cell to display relevant astrological information, so that I can read the detailed chart data.

#### Acceptance Criteria

1. WHEN a Palace contains data, THE Tu_Vi_Chart SHALL display the palace name at the top of the cell
2. WHEN a Palace contains stars, THE Tu_Vi_Chart SHALL list the star names within the cell
3. WHEN a Palace contains additional details, THE Tu_Vi_Chart SHALL display them in a readable format
4. THE Tu_Vi_Chart SHALL apply text styling that ensures readability against the background
5. THE Tu_Vi_Chart SHALL truncate or scroll content if a Palace cell contains excessive information

### Requirement 3: Display Chart Center Information

**User Story:** As a user, I want to see overview information in the center of the chart, so that I can quickly understand the key details of the reading.

#### Acceptance Criteria

1. THE Chart_Center SHALL occupy the central 2x2 grid area
2. THE Chart_Center SHALL display the person's name (Họ tên)
3. THE Chart_Center SHALL display the birth date and time information
4. THE Chart_Center SHALL display the gender (Giới tính)
5. THE Chart_Center SHALL apply styling that distinguishes it from the Palace cells

### Requirement 4: Implement Two-Column Layout

**User Story:** As a user, I want the Tu Vi chart on the left and the input form on the right, so that I can see both simultaneously.

#### Acceptance Criteria

1. THE TuViForm_Component SHALL use a two-column layout on desktop screens
2. THE TuViForm_Component SHALL display the Tu_Vi_Chart in the left column
3. THE TuViForm_Component SHALL display the Form_Panel in the right column
4. WHEN the screen width is below 1024px, THE TuViForm_Component SHALL stack the columns vertically
5. THE TuViForm_Component SHALL allocate approximately 60% width to the chart and 40% to the form on desktop

### Requirement 5: Add View Year and View Month Fields

**User Story:** As a user, I want to specify the year and lunar month for viewing, so that I can get readings for specific time periods.

#### Acceptance Criteria

1. THE Form_Panel SHALL include a "Năm xem" (View_Year) input field
2. THE Form_Panel SHALL include a "Tháng xem (Âm lịch)" (View_Month) input field
3. THE Form_Panel SHALL validate that View_Year is a valid year between 1920 and 2100
4. THE Form_Panel SHALL validate that View_Month is a valid lunar month between 1 and 12
5. WHEN the form is submitted, THE TuViForm_Component SHALL include View_Year and View_Month in the calculation request
6. THE Form_Panel SHALL default View_Year to the current year
7. THE Form_Panel SHALL default View_Month to the current lunar month

### Requirement 6: Enhance Submit Button Styling

**User Story:** As a user, I want a prominent and attractive submit button, so that I am encouraged to complete the form.

#### Acceptance Criteria

1. THE Form_Panel SHALL display a submit button labeled "LẬP LÁ SỐ"
2. THE submit button SHALL use a golden/bronze color scheme (matching #d4af37 or similar)
3. THE submit button SHALL include a gradient background effect
4. WHEN the user hovers over the submit button, THE button SHALL display a visual hover effect
5. THE submit button SHALL be larger and more prominent than other form buttons
6. THE submit button SHALL include appropriate padding and border-radius for visual appeal

### Requirement 7: Create Table of Contents Component

**User Story:** As a user, I want to see a table of contents listing all 12 palaces, so that I can navigate to specific sections.

#### Acceptance Criteria

1. THE Table_Of_Contents SHALL display a list of all 12 palace names
2. THE Table_Of_Contents SHALL be positioned below the Tu_Vi_Chart
3. WHEN a user clicks on a palace name in the Table_Of_Contents, THE application SHALL scroll to or highlight the corresponding Palace cell
4. THE Table_Of_Contents SHALL use styling consistent with the overall design theme
5. THE Table_Of_Contents SHALL display palace names in their traditional order

### Requirement 8: Apply Consistent Visual Styling

**User Story:** As a user, I want the interface to match the sample images in terms of colors, fonts, and spacing, so that I have a cohesive visual experience.

#### Acceptance Criteria

1. THE TuViForm_Component SHALL use a dark background color scheme (similar to #0b0d12 or #15171d)
2. THE TuViForm_Component SHALL use golden accent colors (similar to #d4af37) for highlights and borders
3. THE TuViForm_Component SHALL use consistent border-radius values for rounded corners
4. THE TuViForm_Component SHALL apply box-shadow effects to create depth
5. THE TuViForm_Component SHALL use appropriate font sizes and weights for hierarchy
6. THE Form_Panel SHALL use consistent spacing between form fields
7. THE Tu_Vi_Chart SHALL use borders to separate grid cells clearly

### Requirement 9: Maintain Form Field Functionality

**User Story:** As a user, I want all existing form fields to continue working, so that I can still input my birth information correctly.

#### Acceptance Criteria

1. THE Form_Panel SHALL include all existing fields: Họ tên, Giới tính, Ngày sinh, Tháng sinh, Năm sinh, Giờ sinh
2. THE Form_Panel SHALL maintain the calendar type toggle (Dương lịch/Âm lịch)
3. THE Form_Panel SHALL validate all input fields before submission
4. WHEN the form is submitted, THE TuViForm_Component SHALL send the data to the existing API endpoint
5. THE Form_Panel SHALL display error messages for invalid inputs
6. THE Form_Panel SHALL maintain the reset button functionality

### Requirement 10: Implement Responsive Design

**User Story:** As a mobile user, I want the redesigned interface to work well on smaller screens, so that I can use it on any device.

#### Acceptance Criteria

1. WHEN the screen width is below 1024px, THE TuViForm_Component SHALL stack the chart and form vertically
2. WHEN the screen width is below 768px, THE Tu_Vi_Chart SHALL adjust grid cell sizes for readability
3. WHEN the screen width is below 640px, THE Form_Panel SHALL display form fields in a single column
4. THE TuViForm_Component SHALL maintain touch-friendly button sizes on mobile devices
5. THE TuViForm_Component SHALL ensure all text remains readable at smaller screen sizes

### Requirement 11: Preserve Home Page Layout

**User Story:** As a user, I want the Home page three-column layout to remain functional, so that I can still access all existing features.

#### Acceptance Criteria

1. THE Home_Page SHALL maintain the three-column grid layout on desktop screens
2. THE Home_Page SHALL continue to display the user dashboard in the left column
3. THE Home_Page SHALL continue to display the activity feed in the middle column
4. THE Home_Page SHALL continue to display the master ranking in the right column
5. THE Home_Page SHALL integrate the redesigned TuViForm_Component into the left column
6. WHEN the screen width is below 1024px, THE Home_Page SHALL stack columns according to existing responsive behavior

### Requirement 12: Create Reusable Chart Component

**User Story:** As a developer, I want the Tu Vi chart to be a reusable component, so that it can be used in multiple pages.

#### Acceptance Criteria

1. THE application SHALL create a new component named TuViChart
2. THE TuViChart component SHALL accept chart data as props
3. THE TuViChart component SHALL render the 4x4 grid layout
4. THE TuViChart component SHALL be importable and usable in other components
5. THE TuViChart component SHALL include proper PropTypes or TypeScript types for validation
6. WHEN no data is provided, THE TuViChart component SHALL display an empty chart template

