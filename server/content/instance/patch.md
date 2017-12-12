# Modifying an instance.

## Update description of an association

Allows the update of the description of the association.

    {
      updatePath: "...",
      updateValue: "new description"
    }

## Remove embedded association

Removes an association from an embedded entity.

    {
      updatePath: "...",
      patchAction: "remove",
      type: "...",
      id: "..."
    }
