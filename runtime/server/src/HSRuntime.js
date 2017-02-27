var mongoClient=require('mongodb').MongoClient;
var fs = require('fs');

//
// Class "HSRuntime"
//

function HSRuntime() {
    this.config = null;
    this.domains = null;
    this.mongoDBs = {};
}

HSRuntime.prototype = {
    readFile: function (fn) {
        var txt = fs.readFileSync(fn, 'utf8');
        return txt;
    },
    getDir: function (name) {
        var hsRoot = process.cwd()+"/";
        var project   = hsRoot+"../"+this.getConfig().projectPath+"/";
        switch (name) {
            // Project files
            case "domains": return project + "domains/";
        }
    },
    getConfig: function () {
        if (this.config) return this.config;
        var cfg = this.readFile(process.cwd()+"/../config.json");
        this.config = JSON.parse(cfg);
        return this.config;
    },
    getMongoURL: function (dbName) {
        return "mongodb://"+this.getConfig().mongoServer+"/"+dbName;
    },
    useDB: function (dbName, nextFunction) {
        var db = this.mongoDBs[dbName];
        var mDBs = this.mongoDBs;
        if (db) {
            // TBD: Check, if the connection is still valid!
            nextFunction(db);
        }
        else {
            try {
                mongoClient.connect(this.getMongoURL(dbName), function (err, db) {
                    if (err)
                        console.log("Error connecting to DB: " + err);
                    else {
                        mDBs[dbName] = db;
                        nextFunction(db);
                    }
                });
            }
            catch (err) {
                console.log("Error connecting to DB: "+err);
            }
        }
    }
}


//
// Model-related functions
//

HSRuntime.prototype.getDomain = function (domainName) {
    return this.getDomains()[domainName];
}

HSRuntime.prototype.getDomains = function () {
    if (this.domains)
        return this.domains;
    else
        this.domains = {};

    var dir = this.getDir("domains");
    var files = fs.readdirSync(dir);
    for (var idx=0; idx<files.length; idx++) {
        var fn = files[idx];
        var file = fs.readFileSync(dir + "/" + fn, 'utf8');
        var domain = JSON.parse(file, 2);
        this.domains[domain.name] = domain;
    }
    return this.domains;
}

HSRuntime.prototype.getBaseClassName = function (domainName, entityName) {
    var base = this.findEntityByName(domainName, entityName);
    var next = null;
    while (true) {
        next = this.getParentClass(domainName, base);
        if (!next) return base;
        if (next.isAbstract) return base;
        base = next;
    }
}

HSRuntime.prototype.getParentClass = function (domainName, entity) {
    if (!entity.parentClass || entity.parentClass.length===0) return null;
    var parent = this.findElementByID(domainName, entity.parentClass[0]);
    if (!parent) throw "Invalide parentClass ID: "+entity.parentClass[0];
    return parent;
}

HSRuntime.prototype.getParentEntity = function (domainName, parentRelnID) {
    // Return definition of entity which is the parent in this aggregation
    var domain = this.getDomain(domainName);
    if (!domain)throw "Invalid domain name: "+domainName;
    for (var idx=0; idx<domain.entities.length; idx++) {
        var entity = domain.entities[idx];
        for (var idx2=0; idx2<entity.relationships.length; idx2++) {
            var reln = entity.relationships[idx2];
            if (reln.id === parentRelnID) return entity;
        }
    }
}

HSRuntime.prototype.findEntityByName = function (domainName, entityName) {
    var domain = this.getDomain(domainName);
    if (!domain)throw "Invalid domain name: "+domainName;
    for (var idx=0; idx<domain.entities.length; idx++) {
        var entity = domain.entities[idx];
        if (entity.name === entityName) return entity;
    }
    console.log("Warning: Could not find entity with name="+entityName+" in domain "+domainName);
    return null;
}

HSRuntime.prototype.findElementByID = function (domainName, id) {
    // TBD: Currently only finds entities and relationships
    var domain = this.getDomain(domainName);
    if (!domain)throw "Invalid domain name: "+domainName;
    for (var idx=0; idx<domain.entities.length; idx++) {
        var entity = domain.entities[idx];
        if (entity.id === id) return entity;
        for (var idx2=0; idx2<entity.relationships.length; idx2++) {
            var reln = entity.relationships[idx2];
            if (reln.id === id) return reln;
        }
    }
    console.log("Warning: Could not find element with id="+id+" in domain "+domainName);
    return null;
}

// Export

module.exports = new HSRuntime();