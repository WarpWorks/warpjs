# Aggregation filters

Feature to allow the display of an aggregation relationship matching some
filtering criteria.


## Document representation

The configuration of the aggregation filters are put into the
`_meta.aggregationFilters` of a document. It has the following format:

    _meta.aggregationFilters = [
        {
            id: <relationshipId>,
            entities: [
                {
                    id: <entityId>,
                    position: <number>,
                    useParent: <bool>,
                    label: "Filter section label"
                }+
            ]
        }*
    ]

The `relationshipId` is the warpjs ID of the aggregation relationship `[R1]` on
the current entity `[E1]`. This relationship will point to a target entity
`[E2]`.

The `entityId` is the warpjs ID of the target entity's associated targets
`[E3]`.

If `useParent===true`, then also gather information of the parent of the
instance `[E3]`.


Example of elements:

  - `[E1]` would be the `I3C` entity.
  - `[R1]` would be the `Testbeds` relationship of `[E1]`.
  - `[E2]` would be the `Testbed` entity.
  - `[R2]` would be the `Authors` relationship of `[E2]`.
  - `[E3]` would be the `User` entity.

We have to take note that multiple `[R2]` can bring to `[E3]`.
