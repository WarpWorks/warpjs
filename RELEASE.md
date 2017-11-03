# Releases

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

## 1.0.0-rc17 - 2017-06-10

- Link back to portal from WarpJS.
- Replace logo.

## 1.0.0-rc16 - 2017-06-09

- Fixed typo.

## 1.0.0-rc15 - 2017-06-09

- More configuration for TinyMCE.

## 1.0.0-rc14 - 2017-06-09

- Fixed TinyMCE multi-instance issue.

## 1.0.0-rc13 - 2017-06-09

- Updated core for relationship description in association documents.

## 1.0.0-rc12 - 2017-06-08

- Change the page title.

## 1.0.0-rc11 - 2017-06-07

- minor fix for the layout of TinyMCE content.

## 1.0.0-rc10 - 2017-06-07

- Fixed creation/update of new root instance.

## 1.0.0-rc9 - 2017-06-07

- Fixed problem with embedded data on rootInstance
- Fixed problem with new entities and dafault values for enums
- Added "Add Sibling" function

## 1.0.0-rc8 - 2017-06-06

- Fixed the breadcrumb.
- Increased maxAssocs to 100.

## 1.0.0-rc7 - 2017-06-06

- Updated core@1.0.0-rc3

## 1.0.0-rc6 - 2017-06-05

- Fixed breadcrumb.
- Fixed style and the create view.

## 1.0.0-rc5 - 2017-06-05

 - Added implementation for TinyMCE.
 - Updated @quoin/express-routes-info

## 1.0.0-rc4 - 2017-06-04

- Updated core@1.0.0-rc2

## 1.0.0-rc3 - 2017-06-02

- Fixed bug in FireFox.
- More UI improvements.

## 1.0.0-rc2 - 2017-06-01

- Image editor

## 1.0.0-rc1 - 2017-05-31

- Full front-end rework for embedded documents.

## 0.6.6 - 2017-05-12

- Added static path to access domain JSN files.

## 0.6.5 - 2017-05-10

- Adding `mongoServer` in config.

## 0.6.4 - 2017-05-10

- Using @warp-works/core@0.8.7

## 0.6.3 - 2017-05-04

- Access management middleware for the role.

## 0.6.2 - 2017-04-24

- First deployable version.
- Start using @warp-works/core
- List available domains at /app
- Few payloads are HAL.
