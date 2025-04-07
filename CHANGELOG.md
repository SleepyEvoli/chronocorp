# Changelog

## [0.0.14] - 2025-03-21

### Changed

- WebHashHistory now used for working navigation in production
- Removed filter defaults

## [0.0.13] - 2025-03-21

### Added

- Task Favorites feature implemented
- Filter toggles in the project and task bar are now saved even after session
- Auto deselect when changing times
- Inline text auto select when interacting
- Time creator buttons for submit and cancel
- Checkbox click now works on its text
- New icons added

### Changed

- Dropdown field background color removed, now using outline instead
- General font-weight changed to `500` for better readability

### Fixed

- Pins are now closer together
- Assignment selection now correctly shows subscribers and syncs properly
- Comment box clears after sending a comment
- Time Record History now clears when reloading
- Web history is used now, so reload leads to the current page (no need for mouse button binding)
- Time Input value now saves correctly and when out of focus instead of just on enter
- Subtask loop loading issue resolved
- Left bar open icon hover color fixed
- Unused text removed

### Styled

- Select field styling updated
- Label padding (horizontal) removed
- Input field styling adjusted
- Button toggle styling improved

### Refactored

- Header icons are now buttons for better interaction

### Other

- Removed some console logs

## [0.0.12] - 2025-03-17

### Changed

- Keytar dependency to safeStorage from electron

## [0.0.11] - 2025-03-07

### Added

- SettingStore now includes "Always on Top" option with checkbox watcher
- Right-click menu now includes a "Reload" option

### Changed

- Tracking Table selection color is now brighter for better visibility
- Large styling adjustments for the mini Timer
- Link hover effects improved
- Subtask gap, Task Body gap, and Progress Flex set to Start
- New update URL added (App needs to be downloaded again)

### Fixed

- Right bar now remains visible when clicking input fields in Time Records
- Router fix applied for Assignment View navigation
- Click outside behavior adjusted for better user interaction
- Comment delete now functions via button
- Rich Text input no longer saves on outside click, now requires button confirmation

### Removed

- Time History alert removed
- Teleport removed from context
- State filter removed (Not possible with fetched data)

### Other

- Increased left bar size for better usability on mobile
- Auto-update now only triggers on confirmation
- Dashboard timer no longer overflows

## [0.0.10] - 2025-03-05

### Added

- Timer View now supports more days with styling adjustments
- Task Search functionality added
- Comment Edit available per click (only with permission)
- Tracking Table now supports multiple row styles
- Progress bar now includes Estimate (Inline Edit) as a slot
- Task Detail now has a different layout
- Subtask adding is now simpler, with extended editing options available later
- Draggable Resize feature added
- Added dropdown background color, outline color, and color adjustments

### Changed

- Pins now have better alignment
- Assignment Drag Boxes link fixed
- Task Assignment View updated
- Changing primary colors slightly
- Dropdowns colors for tasks adjusted

### Fixed

- Rich Text ID issue for comments resolved
- Task Search functionality improved
- Task assignment view update fix implemented
- Subtask deletion issue when changing completion status resolved

### Removed

- Task Edit Window removed
- No more double-click required for dropdowns
- No more double-click required for inline edit texts

## [0.0.9] - 2025-02-25

## Changed

- Inline Edit for Time is now just an input field

## [0.0.7] - 2025-02-23

### Fixed

- Input field not updating when the content got changed
- Task Edit Estimation was not displayed correctly and saved
- Refactoring custom save event to change event
- Fixed Dashboard not loading, when logging in
- Inline Edit for Times would not save the time

## [0.0.6] - 2025-02-23

### Added

- Added loading state for store
- Introduced `areArraysEqual` utility
- Implemented inline edit area field
- Updated time record history with day value
- Added error notification handling in Stores
- Added CSP to `index.html`
- Added code block and indent support in rich text editor
- Insert image into rich editor (fetch URL from server instead of base64)
- Added event title on hover in event content
- Added ellipsis for recent events and notification box

### Changed

- Converted text link to button link in task detail
- Adjusted event content display
- Adjusted input element styling
- Updated task time record creator & records styling
- Updated task timer input field styling
- Tasktimer fit content for draggable box
- Min-width adjustments for layout consistency
- Renamed `AppListing` to `AppLeftBar`
- Repositioned progress bar
- Timerview project/task now aligned to the left
- Global styling adjustments
- TrackingTable styling improvements
- Rich text editor now handles images from toolbar
- Router no longer runs `onMounted`
- Removed custom indent handling
- README.md adjustments

### Fixed

- Fixed subscriber issue
- Fixed Dropbox drag functionality
- Fixed closing on click issues
- Fixed inline edits click outside behavior
- Fixed body `overflow-x` issue
- Fixed comments overflow & breaking issues
- Fixed app right bar closing on click outside
- Fixed task detail overflow
- Fixed box focus removing body teleport

### Removed

- Removed console logs
- Removed `package-lock.json`
- Removed CSP again
- Cleanup and code styling improvements

## [0.0.4] - 2025-02-20

### Added

- CSP Support
- Code Block Support in Rich Text
- Image Insertion Support in Rich Text
- Error Notifications

### Changed

- Styling for multiple components
- Recent Event Notifications have titles now (Hover Reading)
- Lazy Tracking shows summary now
- Changed Event Notifications to be more informative

### Fixed

- Toolbox Link window was covered by other boxes
- Link in Task Detail for AC and Jitsi were only clickable on text

## [0.0.3] - 2025-02-18

### Added

- Automatic Updates

## [0.0.2] - 2025-02-17

### Added

- readme.md guides, descriptions
- Global Shortcut for opening the console in production mode
- Subtask Box via time tracker
- Show Version in Settings View

### Fixed

- Rich Text supports saving `<ul>` now

## [0.0.1] - 2025-02-15

### Added

- Initial release
