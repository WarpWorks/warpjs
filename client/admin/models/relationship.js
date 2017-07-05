const Base = require('./base');

class Relationship extends Base {
    constructor(parent, id, name, desc) {
        super("Relationship", parent, id, name, desc);

        // Properties:
        this.isAggregation = true;
        this.sourceRole = 'text';
        this.sourceMin = 0;
        this.sourceMax = 0;
        this.targetRole = 'text';
        this.targetMin = 0;
        this.targetMax = 0;
        this.targetAverage = 0;

        // Relationships:
        this.targetEntity = [];
    }

    // Misc utility functions
    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        return r;
    }

    toJSON() {
    // Get JSON for associations:
        var jsonTargetEntity = [];
        for (let i in this.targetEntity) {
            jsonTargetEntity.push(this.targetEntity[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            isAggregation: this.isAggregation,
            sourceRole: this.sourceRole,
            sourceMin: this.sourceMin,
            sourceMax: this.sourceMax,
            targetRole: this.targetRole,
            targetMin: this.targetMin,
            targetMax: this.targetMax,
            targetAverage: this.targetAverage,
            targetEntity: jsonTargetEntity
        };
    }

    fromJSON(json, parent) {
    // Base attibutes:
        this.parent = parent;
        this.name = json.name;
        this.desc = json.desc;
        this.type = json.type;
        this.id = json.id;
        // Basic Properties:
        this.isAggregation = json.isAggregation;
        this.sourceRole = json.sourceRole;
        this.sourceMin = json.sourceMin;
        this.sourceMax = json.sourceMax;
        this.targetRole = json.targetRole;
        this.targetMin = json.targetMin;
        this.targetMax = json.targetMax;
        this.targetAverage = json.targetAverage;

        this.targetEntity = json.targetEntity; // Currently only works for *unary* associations!
    }
}

module.exports = Relationship;
