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

## Output layout

The following layout is used for each document:

    - Overview
    - All panels
    - Authors/Contributors

We will need to define what panels will need to be included. We know that we do
not want side panels, but do we want the content of those panels in the
document?

## Table of content levels

Each heading level is represented by letters.

    H1 -> A, B, C
    H2 -> A.A, A.B, B.A, B.B, C.A, C.B
    H3 -> A.A.A, A.A.B
    H4 -> A.A.A.A
    H5 -> A.A.A.A.A
    H6 -> A.A.A.A.A.A

Each sub-document is represented by numbers.

    H1, doc1 -> A.1
    H2, doc1 -> A.A.1

Each heading under the sub-document restarts the heading above:

    H1, doc1, H1 -> A.1.A
    H2, doc1, H2 -> A.A.1.A.A

Each panel is represented as if it was a H1.

Each panel item is represented as if it was a H2.

Authors section is represented by a H1.

Contributors section is represented by a H1.

### Letters vs Numbers

The reason I chose to use Letters for heading levels is because it will be rare
that a given Overview will contain more than 26 H1-headings, but it could be
possible that an aggregation has more than 26, which would be easier to
represent with numbers.
