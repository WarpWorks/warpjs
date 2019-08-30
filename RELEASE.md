# WarpJS's 1.3 Releases Notes

- Releases 1.3.x from 2018-10-16 to date
- [Releases 1.2.x](RELEASE-1.2.md) from 2017-10-11 to 2018-10-15
- [Releases 1.0.x](RELEASE-1.0.md) from 2017-05-31 to 2017-06-10
- [Releases 0.6.x](RELEASE-0.6.md) up to 2017-05-12


## 1.3.155 - 2019-08-30

- #296: Fixed modal for inline paragraph editing.

## 1.3.154 - 2019-08-30

- #282: Back-end logic to select PDF cover image.

## 1.3.153 - 2019-08-30

- #291: PDF Generator: use best version to filter subdocuments.

## 1.3.152 - 2019-08-29

- #295: update: use html-to-pdfmake version 1.0.5 instead of latest, avoid parser stripping spaces.

## 1.3.151 - 2019-08-29

- #295: Html to pdfmake parsing issue with lists.

## 1.3.150 - 2019-08-29

- #294: Changed button label from "PDF Download" to "Download".

## 1.3.149 - 2019-08-29

- Fixed in-text preview in Portal.

## 1.3.148 - 2019-08-28

- #285: versioning and alias of breadcrumb, image areas, vocabulary, and home page.

## 1.3.147 - 2019-08-27

- #285: Applying logic to find the best version and display alias for most
  links. Still working to find out more places to apply the fix.

## 1.3.146 - 2019-08-26

- #280: Remove display of multi-version sub-documents as duplicate.

## 1.3.145 - 2019-08-23

- warpjs-survey-tool-plugin#145: Modules view: add image field for icon, image field for logo, and description.

## 1.3.144 - 2019-08-22

- #287: Inline editor: change done button label to capitalized.

## 1.3.143 - 2019-08-16

- #286: Inline editor: remove x and done buttons, new done button at top right.

## 1.3.142 - 2019-08-16

- #281: new content feature flags for versionable and releaseable content.

## 1.3.141 - 2019-08-13

- warpjs-survey-tool-plugin #142: Personas.

## 1.3.140 - 2019-08-13

- #275: Alias edition on meta document editor.

## 1.3.139 - 2019-08-12

- warpjs-survey-tool-plugin #123: Converting one path to async/await.

## 1.3.138 - 2019-08-07

- #268: PDF generator: fix issue with homepage pdf. Error when there is no content.

## 1.3.137 - 2019-08-02

- #277: PDF generator: create new png to fix interlace issue.

## 1.3.136 - 2019-08-02

- Fix for survey tool and aliases.

## 1.3.135 - 2019-08-01

- #273: PDF generator: png javascript error.

## 1.3.134 - 2019-07-31

- #270: PDF generator: lists not showing in pdf.

## 1.3.133 - 2019-07-30

- #150: Remove previous predecessor association.
- #150: Handling versions with aliases.
- #150: Added link to other versions. Don't display create new if already has successor.
- #150: Displaying version in CMS/Studio breadcrumbs
- #150: Adding version to CMS/Studio CSV relationship-panel-item.

## 1.3.132 - 2019-07-30

- #271: PDF generator: heading on table of contents should be like other headings.

## 1.3.131 - 2019-07-29

- #235: remove pdf button for now.

## 1.3.130 - 2019-07-26

- #235: pdfmake table of contents bug workaround.

## 1.3.129 - 2019-07-23

- #245: Fixed login issues on protected pages.

## 1.3.128 - 2019-07-22

- #235: Removed button from UI because there is an issue that needs to be fixed.

## 1.3.127 - 2019-07-21

- #235: Tentative when no sub-documents.

## 1.3.126 - 2019-07-21

- #235: Fixed font paths to be absolute.

## 1.3.125 - 2019-07-21

- #235: Converted button to React.

## 1.3.124 - 2019-07-21

- #267: Fixed page meta info edition on document with alias.

## 1.3.123 - 2019-07-19

- #264: Implemented BreadcrumbActions as React component. Switched order of
  buttons.

## 1.3.122 - 2019-07-17

- #264: Implementation of first phase of header items and header actions.

## 1.3.121 - 2019-07-12

- #257: Inline editor: refactor to not extend array.
- auto updates based on new eslint config and version.

## 1.3.120 - 2019-07-02

- #250: Inline editor persist image state when changing elements in sidebar.

## 1.3.119 - 2019-06-24

- #249: Handling of Visibility for paragraph in portal.

## 1.3.118 - 2019-06-24

- #248: Inline editor: adding an image should show the image right away.

## 1.3.117 - 2019-06-19

- #235: Fixed error when tree skips one level (first paragraph was H2).

## 1.3.116 - 2019-06-19

- Fixed bug in history display.

## 1.3.115 - 2019-06-18

- #235: Fixed duplicate entries.

## 1.3.114 - 2019-06-17

- #247: Document edition for title and SEO.

## 1.3.113 - 2019-06-12

- #244 update: Set default visibility of new paragraph created by inline editor.

## 1.3.112 - 2019-06-07

- #244: Inline editor: visibility dropdown functionality, image to paragraph limit to 1 on server side.

## 1.3.111 - 2019-06-07

- #235: Implemented numeration of content.

## 1.3.110 - 2019-06-05

- #234: Display editors in community.

## 1.3.109 - 2019-06-05

- #200: Add the current document title.

## 1.3.108 - 2019-06-04

- Adding some schema utils.

## 1.3.107 - 2019-05-29

- #239 Inline editor: changing heading level doesn't update on left side.

- #240 Fix js error with react.

## 1.3.106 - 2019-05-29

- #235: Adding additional check to find error in DEV.

## 1.3.105 - 2019-05-28

- #235: Adding POC for html export.

## 1.3.104 - 2019-05-24

- #238: Fix eslint errors.

## 1.3.103 - 2019-05-23

- #197: Detect aliases before other routes.

## 1.3.102 - 2019-05-22

- #197: Prevent redirect on alias if not needed.

## 1.3.101 - 2019-05-22

- #236: Remove user notification in Studio context.

## 1.3.100 - 2019-05-16

- #231: Only keep the 10 last backups.

## 1.3.99 - 2019-05-16

- When adding association, also update position and desc.

## 1.3.98 - 2019-05-16

- #232 update: Inline editor expand tinymce to fill height of modal.

## 1.3.97 - 2019-05-16

- #214: Handling display of null in diff notifications.

## 1.3.96 - 2019-05-15

- #214: Handling display of numbers in diff notifications.

## 1.3.95 - 2019-05-15

- #230: Moved breadcrumb actions on own row.

## 1.3.94 - 2019-05-15

- #232 Inline editor button to expand tinymce.

## 1.3.93 - 2019-05-14

- #214: Adding user notifications.

## 1.3.92 - 2019-05-14

- #233 Inline editor container: set overflow to auto.

## 1.3.91 - 2019-05-06

- #229: Inline editor css height issue fix.

## 1.3.90 - 2019-05-03

- #228: Inline Editor move link buttons in tinymce to dropdown.

## 1.3.89 - 2019-04-30

- #227: Inline editor overall style changes.

## 1.3.88 - 2019-04-26

- Inline editor image change set dirty, fix changelog.

## 1.3.87 - 2019-04-25

- #214: Activate notification logging. WIP to display notifications.

## 1.3.86 - 2019-04-25

- #226: Inline editor new style for heading.

## 1.3.85 - 2019-04-24

- #225: Removed relationship label for sub-documents.

## 1.3.83 - 2019-04-24

- #222: Inline editor delete image.

## 1.3.82 - 2019-20-24

- #224: Adding sub-documents to ToC.

## 1.3.81 - 2019-04-24

- #223: Showing sub-documents in portal.

## 1.3.80 - 2019-04-23

- #221: Fixed BasicProperty name: SubDocuments.

## 1.3.79 - 2019-04-23

- #221: Added paragraph aggregation to inline editor.

## 1.3.78 - 2019-04-23

- Fixed password change bug.

## 1.3.77 - 2019-04-22

- #219 Inline editor upload image style update.

## 1.3.76 - 2019-04-19

- #211: Adding sort by to "My Documents".

## 1.3.75 - 2019-04-19

- #211: Adding filters to "My Documents".

## 1.3.74 - 2019-04-18

- #211: First draft to show user's documents.

## 1.3.73 - 2019-04-15

- Nested panels update: fix missing panel for CSVs.

## 1.3.72 - 2019-04-11

- #217 update: fix nested panels on homepage.

## 1.3.71 - 2019-04-11

- #217 Match edit and stop edit button and other styles.

## 1.3.70 - 2019-04-11

- #216: Converted breadcrumb buttons with label.

## 1.3.69 - 2019-04-10

- Set SSO to false.

## 1.3.68 - 2019-04-10

- #203 update: Fix modal for upload and double upload issue.

## 1.3.67 - 2019-04-09

- #203 Inline editor upload image.

## 1.3.66 - 2019-04-08

- #213: Reduced pencil size.
- Also style work to put pencil on top of section.
- Added missing empty sections in community.

## 1.3.65 - 2019-04-08

- Fixed document status inheritance issue.

## 1.3.64 - 2019-04-06

- #212: Missing relationship document sorting for some types of target.

## 1.3.63 - 2019-04-03

- #137: Add empty section as hidden to be able to display in edit mode.

## 1.3.62 - 2019-04-02

- #205: Removing the current document will redirect to parent document.

## 1.3.61 - 2019-04-02

- #209: Added `visibleInEditOnly` flag on items.

## 1.3.60 - 2019-04-02

- #210: Fixed issue due to conversion Promise -> async/await.

## 1.3.59 - 2019-04-01

- Include missing branch released 1.3.53.

## 1.3.58 - 2019-03-29

- #208: Implemented Relationship.addAssociation and
  Relationship.removeAssociation to handle bi-directional.

## 1.3.57 - 2019-03-27

- #208: Modified to enable schema and data migration.

## 1.3.56 - 2019-03-13

- #206: Allow the "-> More" to link to external links.

## 1.3.55 - 2019-02-08

- Added more details in server `_status` page.

## 1.3.54 - 2019-02-06

- Add email to schema for survey tool plugin.

## 1.3.53 - 2019-02-04

- #204: Allow edit of text in main body.

## 1.3.52 - 2019-02-01

- Update survey tool plugin version.

## 1.3.51 - 2019-02-01

- #202: Fixed association inline-edit for mainBody
- #121: Using library for detecting Chrome, but that use UA which is not best
- #203: Added button and warning coming soon.
- WarpWorks/warpjs-session-plugin#5: Added SSO support.

## 1.3.50 - 2019-02-01

- Update survey tool plugin version.

## 1.3.49 - 2019-01-30

- Update survey tool plugin version.

## 1.3.48 - 2019-01-30

- Update survey tool plugin version.

## 1.3.47 - 2019-01-23

- add surveytoolfeedback to rc file.

## 1.3.46 - 2019-01-09

- Move routes-info to dev dependencies.

## 1.3.45 - 2018-12-10

- #151: Adding maxWidth to images.

## 1.3.44 - 2018-12-03

- #199: Force page to load link when analytics is not working.

## 1.3.43 - 2018-11-30

- #195 update: remove console.log.

## 1.3.42 - 2018-11-29

- #127: Redesign after feedback.

## 1.3.41 - 2018-11-28

- #195: Inline editor for sidebar paragraphs.

## 1.3.40 - 2018-11-27

- #194: Fixed for image area click.

## 1.3.39 - 2018-11-27

- #194: Fixing using gtag() instead of ga().

## 1.3.38 - 2018-11-21

- #194: Adding GA events on home page.

## 1.3.37 - 2018-11-20

- #191: Converting IndividualContribution to look like Plain page view style.

## 1.3.36 - 2018-11-19

- #127: Implemented selection of different type selection.

## 1.3.35 - 2018-11-19

- #127: Converted display to flex to align list bottoms.

## 1.3.34 - 2018-11-15

- #127: Filtering items. Still some work to do.

## 1.3.33 - 2018-11-14

- #127: Inline editor association modal. Still some work to do.

## 1.3.32 - 2018-11-14

- #193 Tinymce height issue fix.

## 1.3.31 - 2018-11-14

- #192 Inline editor add change logs where missing.

## 1.3.30 - 2018-11-13

- #190 Inline editor add history functionality.

## 1.3.29 - 2018-11-12

- #181: Updated with Nov8th IndividualContribution style feedback.

## 1.3.28 - 2018-11-12

- #189: Only display `BadgeDefinition` that have a public page status.

## 1.3.27 - 2018-11-09

- #188 Inline editor move history button to left menu.

## 1.3.26 - 2018-11-09

- #187 Inline editor custom link.

## 1.3.25 - 2018-11-09

- Inline Editor UX updates based on feedback.

## 1.3.24 - 2018-11-08

- Inline Editor delete make docLevel dynamic, change log for add paragraph.

## 1.3.23 - 2018-11-08

- #175 Inline editor add paragraph button.

## 1.3.22 - 2018-11-07

- #181: First pass on CSS feedback.

## 1.3.21 - 2018-11-06

- #186 Inline editor image tooltip.

## 1.3.20 - 2018-11-06

- #180 update: Keep inline editor modal open after delete.

## 1.3.19 - 2018-11-06

- #181: Responsive for individual contribution, x-small screen.

## 1.3.18 - 2018-11-05

- #181: Fixed DOM and CSS for no authors/contributors. Fixed Oxford comma.

## 1.3.17 - 2018-11-05

- #180 Inline editor paragraph delete with confirmation.

## 1.3.16 - 2018-11-04

- #181: Adding Individual-Contribution

## 1.3.15 - 2018-11-01

- Add analitics var to rc file.

## 1.3.14 - 2018-11-1

- Update for #184 google analytics.

## 1.3.13 - 2018-10-31

- Update warpjs-utils version

## 1.3.12 - 2018-10-31

- Update warpjs-utils version

## 1.3.11 - 2018-10-30

- #179 Inline editor position label

## 1.3.10 - 2018-10-30

- #177 Inline editor change position of paragraphs with position buttons.

## 1.3.9 - 2018-10-29

- #178 Change assigned badges to link to actual badge.

## 1.3.8 - 2018-10-25

- Fix inline editor images container when empty.

## 1.3.7 - 2018-10-25

- #176 Inline editor images.

## 1.3.6 - 2018-10-23

- fix for broken urls.

## 1.3.5 - 2018-10-23

- #174 save inline editor tinymce field on blur.

## 1.3.4 - 2018-10-22

- Refactored to avoid need publish `warpjs` when `warpjs-utils` is published.

## 1.3.3 - 2018-10-22

- update node_modules

## 1.3.2 - 2018-10-22

- #171 SVG height fix for IE11

## 1.3.1 - 2018-10-16

- #158: Implementation for path alias.
