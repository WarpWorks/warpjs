// const debug = require('debug')('W2:core');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

const BasicTypes = require('./basic-types');
const config = require('./config');
const createDomainFromJSONString = require('./file-schema/create-domain-from-json-string');
const models = require('./models');
const packageJson = require('./../../package.json');
const utils = require("./utils");
const WarpWorksError = require('./error');

const DB_NAME = 'WarpJS';
const PROJECT_ROOT = path.dirname(require.resolve('./../../package.json'));
const CORE_DOMAIN_FILE = path.join(PROJECT_ROOT, 'schema', 'WarpWorks.jsn');

class WarpWorks {
    constructor() {
        this.parent = null;
        this.domains = [];
        this.config = null;
        this.coreDomain = null;
    }

    /**
     *  Get a persistence connection. If `dbName` is not defined, it will
     *  connect to Level1 document database.
     */
    getPersistence(dbName) {
        const Persistence = require(config.persistence.module);
        return new Persistence(config.persistence.host, dbName || DB_NAME);
    }

    createNewDomain(name, desc, recreate) {
        return new models.Domain(this, name, desc, recreate);
    }

    getAllDomains() {
        return this.domains;
    }

    getCoreDomain() {
        if (!this.coreDomain) {
            const content = this.readFile(CORE_DOMAIN_FILE);
            this.coreDomain = createDomainFromJSONString(content);
        }
        // Look if the coreDomain has changed since server start?
        return this.coreDomain;
    }

    removeDomainFromCache(domainName) {
        this.domains = this.domains.filter((cachedDomain) => cachedDomain.name !== domainName);
    }

    getDomainByName(domainName) {
        return Promise.resolve()
            .then(() => this.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => this.listDomains(persistence))
                .then((dbDomains) => dbDomains.find((domain) => domain.name === domainName))
                .then((dbDomain) => {
                    if (!dbDomain) {
                        // Not in the DB, so can't be in cache either.
                        throw new WarpWorksError(`Cannot find domain '${domainName}'.`);
                    }

                    const domainInfo = this.domains.find((cachedDomain) => cachedDomain.name === domainName);

                    if (domainInfo && domainInfo.lastUpdated === dbDomain.lastUpdated) {
                        // It has not been changed, return cached domain.
                        return domainInfo.schema;
                    }

                    return Promise.resolve()
                        .then(() => models.Domain.instantiateFromPersistenceJSON(persistence, dbDomain, this))
                        .then((domain) => {
                            this.domains = this.domains
                                .filter((cachedDomain) => cachedDomain.name !== domainName)
                                .concat({
                                    name: domain.name,
                                    lastUpdated: dbDomain.lastUpdated,
                                    schema: domain
                                })
                            ;
                            return domain;
                        })
                    ;
                })
                .finally(() => persistence.close())
            )
            .catch((err) => {
                console.error(`warpCore.getDomainByName(): Error for '${domainName}':`, err);
                throw err;
            })
        ;
    }

    toString() {
        return this.domains.map((domainInfo) => domainInfo.schema.toString()).join('\n') + '\n';
    }

    getDir(name, file) {
        // File i/o
        let folder;

        switch (name) {
            // WarpWorks files
            case "smnDemos":
                folder = path.join(config.projectPath, "smnDemos");
                break;

            // Cartridge files
            case "templates":
                folder = path.join(config.cartridgePath, 'templates');
                break;

            // Project files
            case "domains":
                folder = path.join(config.projectPath, 'domains');
                break;

            // Output
            case "output":
                folder = path.join(config.outputPath);
                break;

            default:
                throw new WarpWorksError("Invalid directory: " + name);
        }

        if (file) {
            return path.join(folder, file);
        }
        return folder;
    }

    readDir(name) {
        const dir = this.getDir(name);
        return fs.readdirSync(dir).map((fn) => path.join(dir, fn));
    }

    readFile(fn) {
        return fs.readFileSync(fn, 'utf8');
    }

    smnFiles() {
        const files = this.readDir('smnDemos');
        return files.map((file) => {
            const name = path.basename(file, '.smn');
            const template = this.readFile(file);
            return {
                name,
                template
            };
        });
    }

    /**
     *  @deprecated Domain schema (level 1 documents) are now in the database.
     */
    domainFiles() {
        throw new Error("Deprecated function. Use listDomains()");
    }

    listDomains(persistence) {
        return Promise.resolve()
            .then(() => models.Domain.list(persistence))
        ;
    }

    //
    // Simplified Model Notation (SMN)
    //

    // FIXME: Move this to SMN plugin.
    parseSMN(smn) {
        var currentLine;
        var idx;

        // Remove whitespaces
        smn = smn.replace(/ /g, '');

        // Map each line to one element in new array
        var smnFile = smn.split("\n");

        // If a line starts with "-", append it to previous line
        // Also, remove comments
        var smnFileMerged = [];
        for (idx in smnFile) {
            currentLine = smnFile[idx];
            if (currentLine.includes("//")) {
                currentLine = currentLine.split("//", 1)[0];
            }
            if (currentLine.length > 0 && currentLine[0] === "-") {
                smnFileMerged[smnFileMerged.length - 1] = smnFileMerged[smnFileMerged.length - 1] + "," + currentLine.substr(1);
            } else {
                smnFileMerged.push(currentLine);
            }
        }

        // Start with empty model
        var model = {};

        // Now process each line:
        for (idx in smnFileMerged) {
            var token;

            // Remove '\r' and comments ('//'), ignore empty lines:
            currentLine = smnFileMerged[idx].replace(/\r/g, '');
            if (currentLine.length < 1) {
                continue;
            }

            var header = "";
            var body = "";

            var entity = "";
            var baseClass = "";

            var isDomainDefinition = false;
            if (currentLine.charAt(0) === '#') {
                isDomainDefinition = true;
                currentLine = currentLine.slice(1);
            }

            if (currentLine.includes(":")) {
                header = utils.splitBySeparator(currentLine, ":")[0];
                body = utils.splitBySeparator(currentLine, ":")[1];
            } else {
                header = currentLine;
                body = "";
            }

            var isAbstract = false;
            if (header[0] === "%") {
                isAbstract = true;
                header = header.slice(1);
            }

            // Inheritance?
            if (header.includes("(")) {
                if (!header.includes(")")) {
                    throw new WarpWorksError("Missing ')' in line " + idx);
                }
                entity = utils.extractTagValue(header, "(", ")")[0];
                baseClass = utils.extractTagValue(header, "(", ")")[1];
            } else {
                entity = header;
            }

            if (entity.length < 3) {
                throw new WarpWorksError("Not a valid entity name: '" + entity + "' in line " + idx + " (name must have more than 2 characters)");
            }

            // Add entity to model, if not already there
            if (!model[entity]) {
                model[entity] = {
                    properties: [],
                    aggregations: [],
                    associations: [],
                    isDomain: isDomainDefinition,
                    isAbstract: isAbstract
                };
            }

            // Add baseClass?
            if (baseClass.length > 1) {
                model[entity].baseClass = baseClass;
            }

            // Parse aggregations
            while (body.includes("{")) {
                if (!body.includes("}")) {
                    throw new WarpWorksError("Missing '}' in line " + idx);
                }
                var s = utils.extractTagValue(body, "{", "}");
                token = s[1];
                body = s[0] + (s.length > 2 ? s[2] : "");
                var aggregations = token.split(",");
                for (var j in aggregations) {
                    var agg = aggregations[j].split(":");
                    if (agg.length === 1) {
                        var sr = agg[0].replace("*", "");
                        sr = sr.replace("+", "");
                        sr += "s";
                        agg = {sourceRole: sr, targetType: agg[0]};
                    } else {
                        agg = {sourceRole: agg[0], targetType: agg[1]};
                    }
                    model[entity].aggregations.push(agg);
                }
            }

            // Now parse definitions of attributes and associations
            if (body.replace(/\s/g, '').length > 0) {
                // Body is not empty
                var tokens = body.split(",");
                for (idx = 0; idx < tokens.length; idx++) {
                    token = tokens[idx];
                    if (!token.replace(/\s/g, '').length > 0) {
                        continue;
                    }
                    if (token.includes("=>")) { // Association
                        var assoc = token.split("=>");
                        if (assoc.length === 1 || assoc[0].length === 0) {
                            assoc = {sourceRole: assoc[1], targetType: assoc[1]};
                        } else {
                            assoc = {sourceRole: assoc[0], targetType: assoc[1]};
                        }
                        model[entity].associations.push(assoc);
                    } else { // Property
                        var prop = token.split(":");
                        if (prop.length === 1) {
                            // No type information supplied, use string as default
                            prop = {property: prop[0], type: BasicTypes.String};
                        } else {
                            prop = {property: prop[0], type: prop[1]};
                        }
                        if (!BasicTypes.isValid(prop.type) && !prop.type.includes("[")) {
                            throw new WarpWorksError("Invalid basic type '" + prop.type + "' in line " + idx);
                        }
                        model[entity].properties.push(prop);
                    }
                }
            }
        }
        return model;
    }

    get version() {
        return packageJson.version;
    }
}

//
// Create single instance
//
var instance = new WarpWorks();
instance.encryption = require('./encryption');

module.exports = instance;
