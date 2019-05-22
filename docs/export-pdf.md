# Export PDF

This documents the implementation of [Issue #235](https://github.com/WarpWorks/warpjs/issues/235).

## Page view

The export will use (in order of priority) `?view=ViewName`, `PdfView`,
`DefaultPortalView`. No current plans to support `?style=StyleName`.

## Style

No current plans to support style.

## Authorization

Access to each document and sub-document are taken into consideration. If user
doesn't have access to a given document, it will not show in the export (nor
will its subdocuments).

