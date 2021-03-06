# WarpJS's 1.2 Releases Notes

[Return to RELEASE.md](RELEASE.md)

## 1.2.114 - 2018-10-15

- #166: Fixed image upload size set

## 1.2.113 - 2018-10-12

- #145 Preview Popover on ImageArea to follow mouse.

## 1.2.112 - 2018-10-12

- Updated to warpjs-utils@1.2.54 to support direct links to header items.

## 1.2.111 - 2018-10-11

- #154: Styling categorized badges.
- #113: Fixed multiple image uploads.
- #164: Dynamically adjust `Tile` and `Basic_Tile` height.
- #154: Added link to BadgeCategory label
- #162: Adding user's company
- Restyling the header image.

## 1.2.110 - 2018-10-10

- Fixed styling for tab-navigation.
- Fixed CSS for textarea in edition.
- #154: Categorized badges.
- Sorted `Basic_Tile` by name.

## 1.2.109 - 2018-10-08

- #136: Added IndividualContribution.
- Also refactored to extract CustomMessages (WarpWorks/warpjs-utils@a0a1677)

## 1.2.108 - 2018-10-04

- Added sorting to `entity.getChildren()`.

## 1.2.107 - 2018-10-01

- WIP for survey-tool.

## 1.2.106 - 2018-09-27

- Portal: Styling of Vocabulary letter items
- Content: Preparation to better handle readonly fields.
- Content: Display local date for readonly timestamp
- Portal: #163: Feedback: Adding more data and contact info.

## 1.2.105 - 2018-09-26

- #124: Portal: Display cookie disclaimer.

## 1.2.104 - 2018-09-25

- Bumped warpjs-utils@1.2.47

## 1.2.103 - 2018-09-25

- #161: Portal: Filter out Draft, Declined, and Retired.

## 1.2.102 - 2018-09-25

- #146: More styling for login
- Redefining header items.

## 1.2.101 - 2018-09-25

- #160: Code cleaning.
- #146: Update to warpjs@1.2.45.

## 1.2.100 - 2018-09-24

- #148: Saving feedback on server.

## 1.2.99 - 2018-09-21

- Fixes missing for content and studio with new warpjs-utils.

## 1.2.98 - 2018-09-20

- #146: Add login button on page.

## 1.2.97 - 2018-09-20

- #41: Actually remove the title of the page on Plain style.
- Upgraded node version and refactored for warpjs-utils@1.2.41

## 1.2.96 - 2018-09-18

- #147: Added "Public Beta" banner.

## 1.2.95 - 2018-09-18

- Removed IIC label to Ecosystem per Kathy's request
- #157: Fixed to display entity label instead of name.
- #130: Removing display for items without a name.
- #146: First draft for public release.

## 1.2.94 - 2018-09-15

- Fixed typo.

## 1.2.93 - 2018-09-15

- #156: Content: Fixed inherited relationship Overview.

## 1.2.92 - 2018-09-13

- Adding Ecosystem Directory.

## 1.2.91 - 2018-09-12

- Adding more info for invalid name to try help trace it.

## 1.2.90 - 2018-09-11

- #139: Moved the action plugin buttons above the fields.
- #140: Properly display basic-property panel-item of type text.
- #141: Fixed showItem for empty string.

## 1.2.89 - 2018-09-10

- #129: Added resorting of selected items.


## 1.2.88 - 2018-09-09

- #130: No border/outline on TOC button
- #133: Auto-open first vocabulary element
- #134: Adding missing HeaderImage to Plain page view.
- #135: height:300px. Added some margin-bottom.
- Added min-height to warpjs-content-placeholder 50vh.


## 1.2.87 - 2018-09-07

- #127: Fixed InsightReport's Summary reference to inline-edit
- #127: Saving HeadingLevel change.

## 1.2.86 - 2018-09-07

- Styling updates from feedbacks.

## 1.2.85 - 2018-09-07

- Restyling the Tiles

## 1.2.84 - 2018-09-07

- #127: Fix layout of modal for display SM and higher.
- Fixed issue with clip-path showing a white line on different zoom level
- Better contrast because of Tiles

## 1.2.83 - 2018-09-06

- Few styling changes from Andreas' comments.
- TOC button only displayed when scrolling down.
- #127: Adding HeadingLevel and Visibility.
- #127: Adding Coming Soon...
- #127: Changed pencil => eye+cog in breadcrumb.
- #130: Moved affix to bottom.

## 1.2.82 - 2018-09-05

- #127: Styling and minor fixes.
- #127: Advanced edit now through the inline-edit modal.
- #130: Styling and minor fixes.

## 1.2.81 - 2018-09-05

- #130: Added TOC for Overview.

## 1.2.80 - 2018-09-04

- #127: Work in progress for inline editor. Only the paragraph relationship for
  now.

## 1.2.79 - 2018-08-23

- #128: Fixed when callout ButtonSrc is missing.
- Changed readOnly default value to false.

## 1.2.78 - 2018-08-20

- #117: Skip invalid shape+coords.

## 1.2.77 - 2018-08-20

- Some more CSS.
- #117: Responsive image using SVG.
- #117: Set max-width for responsive image.
- Added script to find overview with images without width+height.

## 1.2.76 - 2018-08-20

- #111: Using TEMPLATE when creating a sibling.
- Aug 14th UI feedbacks
- #125: Removed ':' on basic property and enumeration.
- Redesign for panel-items for XS.

## 1.2.75 - 2018-08-16

- #121: Detection of Chrome for CMS and Studio
- #122: Adding background color for images
- #123: Changed bg color for Insight reports.

## 1.2.74 - 2018-08-15

- #119: Fixed popover preview location.

## 1.2.73 - 2018-08-15

- #111: TEMPLATE clone
- #116: Testbed landing page
- #117: Preparation work for responsive images.
- #118: Adding image's HRef and Target. Refactored for HeaderImage and PreviewImage
- #119: Moved popover near mouseenter coords
- #120: Minor changes to Overview panel's name and display
- Updated Literal CMS view
- Sort relationship items by position+name

## 1.2.72 - 2018-08-13

- #112: Adding callout.
- #114: Moved badges panel above sidebar.
- #115: Changed label and added padding.

## 1.2.71 - 2018-08-10

- Don't return deleted references.
- Refactoring to use new PreviewImage from Content.
- Embed panels in payload.
- Implementing IFrame in paragraph.

## 1.2.70 - 2018-08-09

- Implementation of Vocabulary style.

## 1.2.69 - 2018-08-09

- Fixed preview caching.
- Reduced pop-up to 5 lines.

## 1.2.68 - 2018-08-09

- Enable custom view and style from URL.
- CSS changes from feedback.
- Header image

## 1.2.67 - 2018-08-08

- Each sidebar panel is its own panel.
- Better handle xs screen
- Added non-relationship support for sidebar
- Take parentBaseClassID instead of parentBaseClassName
- Refactored for badge and badge-definition

## 1.2.66 - 2018-08-07

- Styling search box.

## 1.2.65 - 2018-08-06

- Server-side rendering for portal index page.

## 1.2.64 - 2018-08-01

- Portal new header.

## 1.2.63 - 2018-08-01

- Fixed Promise.map() on null.

## 1.2.62 - 2018-07-31

- Fixed typo.

## 1.2.61 - 2018-07-31

- #107: Implementing the new page view styles, panel styles, and panel item
  styles.

## 1.2.60 - 2018-07-12

- #106: Extending meta-schema for PageView, Panel, and RelationshipPanelItems
  styles.

## 1.2.59 - 2018-07-11

- Fixed typo.

## 1.2.58 - 2018-07-11

- #105 - Portal: Don't send deprecated authors/contributors associations to
  front-end.

## 1.2.57 - 2018-06-30

- #91: Adding Studio header menu plugin.

## 1.2.56 - 2018-06-25

- #98: Fixed side-effect of change-logs on existing pages

## 1.2.55 - 2018-06-21

- #98: Added change-log to parent when removing a child

## 1.2.54 - 2018-06-21

- #98: Monor fixes due to refactoring.

## 1.2.53 - 2018-06-20

- #98: Refactored ChangeLogs into its own package.

## 1.2.52 - 2018-06-18

- #101: ImageArea Target used before HRef.

## 1.2.51 - 2018-06-18

- #94: File upload.
- #96: Studio: Adding the label in preparation for locking down the name.
- #103: Portal: Adding a close icon on popover.

## 1.2.50 - 2018-06-14

- Force any `BasicProperty.name==="name"` to be alphanumeric only.

## 1.2.49 - 2018-06-13

- #99: Studio: List warning for domain schema.
- Clean-up of `WarpWorks.json` file: labels and `DefaultPortalView`.

## 1.2.48 - 2018-06-12

- #95: Portal: Styling table content.
- #78: Content: List orphan documents.

## 1.2.47 - 2018-06-11

- #93: Update change logs modal when page data has been modified.
- Allow navigation to parent type.

## 1.2.46 - 2018-06-06

- Change text field from `<input>` to `<textarea>`.
- Studio: Only display link to Content for entities with
  `entityType`=`Document`.
- Studio: Changed order and labels of panels.

## 1.2.45 - 2018-06-06

- Adding description to association-modal and link-selection.

## 1.2.44 - 2018-06-05

- Added missing Style=Carousel
- Added few links between Studio and Content (not totally working, see
  PageView).

## 1.2.43 - 2018-06-05

- #80: Allow empty value in enumeration selection.

## 1.2.42 - 2018-05-31

- #87: Filter box on some lists.

## 1.2.41 - 2018-05-30

- Fixed backup.
- #76: Added core domain (WarpJS) to backup.
- Fixed the new entity ID from target domain instead of level0 domain.
- #89: Studio: Some work on SMN export.
- #85: Studio: Add JSON export for domain.
- #81: Tentative to fix IE missing Promise


## 1.2.40 - 2018-05-17

- Minor change for action button spacing.

## 1.2.39 - 2018-05-17

- #65: Adjusting text and style.

## 1.2.37 - 2018-05-16

- #52: Content: Select sub-type when creating an aggregation on table-item.

## 1.2.36 - 2018-05-15

- #74: Fixed assigning Target to ImageArea.

## 1.2.35 - 2018-05-15

- Minor design rework on document status disclaimer.

## 1.2.34 - 2018-05-14

- Studio: Fixed issue with ChangeLogs now needing the persistence.

## 1.2.32 - 2018-05-11

- Carousel drop-down now handles specifically Paragraph, Image, and ImageArea.

## 1.2.31 - 2018-05-10

- #72: history modal displaying user profile image.

## 1.2.28 - 2018-05-10

- #72 history modal anonymous image and Enum:Status design.

## 1.2.27 - 2018-05-09

- Fixed breadcrumb bleeding out when long (multi-lines).
- Fixed adding sub-embedded child.
- #72 WIP on history modal redesign.

## 1.2.26 - 2018-05-08

- #69: Removed info icon on studio and content lists.
- Fixed carousel labels.
- Disclaimer updates.

## 1.2.25 - 2018-05-04

- #68: Content: Fixed save for text editor.
- Minor code and style clean up.

## 1.2.24 - 2018-05-03

- #65: Applied inheritance to document status.

## 1.2.23 - 2018-05-03

- Content: Link documents breadcrumb to entity list.
- #66: Content: Implemented delete on document list.
- #67: Updating styles and use warpjs-actions in Table style.

## 1.2.22 - 2018-05-02

- #68: Adding table to editor and make modal bigger.

## 1.2.21 - 2018-05-01

- #65: Extract authors.
- Content: Converted lists into tables.

## 1.2.20 - 2018-04-30

- #65: Fixed logic to display disclaimer.

## 1.2.19 - 2018-04-30

- #65: Updated disclaimer.
- #67: Display status in instances list.

## 1.2.18 - 2018-04-27

- Content: Delete confirm popover.

## 1.2.17 - 2018-04-26

- Portal: Modal for document status disclaimer.
- Content: Modal for document status explanation.

## 1.2.16 - 2018-04-09

- Display of document status on title bar.
- WIP for delete confirmation popover.
- Access to inherited basic properties, relationships and enumerations from page
  views.
- WIP still have some issues with new entities.

## 1.2.15 - 2018-04-04

- Portal: Prototype for page visibility with Status.
- Content: List only instance of specific type.
- Content: Added "Tile" display style for relationship-panel-item.
- Content: Fixed children display for the right collection.
- Studio: Added simple background-image.
- Studio: Fixed JSN import script to ignore inheritance.

## 1.2.14 - 2018-03-27

- Studio: Changed labels for tabs.
- Studio: Fixed relationship association modal selection.
- Studio: Display of toast for some of the errors.
- Studio: Support for boolean with checkbox
- Content: Fixed listing of entity sub-types in instance list.


## 1.2.13 - 2018-02-05

- Fixed Overview order by Position (GH #61).
- Fixed map plugin API calls.

## 1.2.12 - 2018-02-02

- Added Tile panel-item style (GH #59).
- Fixed missing search plugin icon due to multiple search packages installed.
- Changed portal breadcrumb to use type.name instead of type.desc.

## 1.2.11 - 2018-01-30

- Added missing warpjsId to new entity.
- Sort list of entities.
- Show item name in carousel drop-down.
- Added missing warpjsId to new relationship.
- Allow remove of embedded.

## 1.2.10 - 2018-01-29

- Small chack for the targetEntity.

## 1.2.9 - 2018-01-29

- Added script [`warpjs-stats`](./scripts/stats.js).
- Small hack for the parentClass.

## 1.2.8 - 2018-01-26

- Allow creation of Embedded and Aggregations. Need to work on Association.

## 1.2.7 - 2018-01-25

- WarpWorks V6 schema
- Added missing Property model
- Studio: Hack to handle parentClass and targetEntity relationship-panel-items.
- Studio: Refactorying with new DocLevel model.
- Studio: Allow updating BasicProperty or Enum instance.

## 1.2.6 - 2018-01-24

- studio work to display the Carousel for page & table views.

## 1.2.5 - 2018-01-19

- Fixed missing link for studio/{domain}.

## 1.2.4 - 2018-01-19

- Conversion to use level1 documents in database.
- First steps for refactoring of studio.

## 1.2.3 - 2017-12-27

- Changes for `warpjs-imagemap-editor-plugin`.

## 1.2.2 - 2017-12-12

- Fixed association on embedded entities.

## 1.2.1 - 2017-12-08

- Adding cache for the domain file.

## 1.2.0-rc34 - 2017-12-03

- Retrieve preview from search plugin first if available.

## 1.2.0-rc33 - 2017-12-03

- Special display for single author.

## 1.2.0-rc32 - 2017-12-01

- Fix enumeration saving.

## 1.2.0-rc31 - 2017-12-01

- Building with working search plugin.
- Adding style for white input-group addon.

## 1.2.0-rc30 - 2017-11-30

- Initial candidate with search.

## 1.2.0-rc29 - 2017-11-28

- Changed the default image for the community.

## 1.2.0-rc27 - 2017-11-28

- Use the user's profile image from the overview.

## 1.2.0-rc26 - 2017-11-28

- Fixed small bug with tinymce (Content Editor) for the link modal.

## 1.2.0-rc25 - 2017-11-27

- Refactored to use new warpjs-plugins package.

## 1.2.0-rc24 - 2017-11-22

- Adding status page.

## 1.2.0-rc23 - 2017-11-22

- Do not return the deleted references from the server.

## 1.2.0-rc22 - 2017-11-21

- Fixed missing button to remove association.

## 1.2.0-rc21 - 2017-11-16

- Added style for dialog header title.

## 1.2.0-rc20 - 2017-11-15

- Moving proxy and cache into warpjs-util to be used by other modules.

## 1.2.0-rc19 - 2017-11-09

- Centered image popover to the image area.

## 1.2.0-rc18 - 2017-11-08

- Fixed static path for default-user image.

## 1.2.0-rc17 - 2017-11-08

- Fixed issue where the relationships where not defined.

## 1.2.0-rc16 - 2017-11-08

- Connecting Authors and Contributors to data.

## 1.2.0-rc15 - 2017-11-07

- Adding sample for community. Data is not hooked yet.

## 1.2.0-rc14 - 2017-11-06

- Fixing jQuery issue with data attributes.

## 1.2.0-rc13 - 2017-11-03

- Handling WriteAccess on the text editor.

## 1.2.0-rc12 - 2017-11-03

- Fixed error with the publish process.

## 1.2.0-rc11 - 2017-11-03

- Code rebase

## 1.2.0-rc10 - 2017-11-03

- Secure all endpoints and UI to disable WriteAccess.

## 1.2.0-rc9 - 2017-10-31

- Adding disabled fields for content edition when user doesn't have WriteAccess.
  There is still some work to be done on other endpoints to secure the edition.

## 1.2.0-rc8 - 2017-10-30

- Converted password to encrypted. User authentication moved to session-plugin.

## 1.2.0-rc7 - 2017-10-25

- Adding pre-loaded image target previews, and on-demand text target previews.

## 1.2.0-rc6 - 2017-10-20

- Using `.toISOString()` instead of `.now()` for date format in DB and on backup
  filenames.

## 1.2.0-rc5 - 2017-10-19

- Fixed script shebang.

## 1.2.0-rc4 - 2017-10-19

- Completed backup inside of the container.

## 1.2.0-rc3 - 2017-10-19

- Fixed minor UI stuffs: double-line and empty panel items.

## 1.2.0-rc2 - 2017-10-18

- Temporarily adding current Studio while refactoring is being done.

## 1.2.0-rc1 - 2017-10-11

- Refactored views and partials to be in other repos.
- Updated dependencies.

