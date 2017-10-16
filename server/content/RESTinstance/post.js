const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const utils = require('./../utils');
const _ = require('lodash');


module.exports = (req, res) => {
	var params = req.params[0].split("/");


	if(params.length <= 3){
		const domain = params.splice(0,1)[0];
		const relationship = params.splice(0,1)[0];
		const type = params.splice(0,1)[0];

		const parentName = serverUtils.getEntity(domain, type).parent.name;
		const entity = serverUtils.getEntity(domain, parentName);
		// FIXME: What happens for a password? The password should not be managed
		// with the "content" side of things, and should not, be using this
		// end-point.
		const persistence = serverUtils.getPersistence(domain);	
		//find the ID of the root
		const relationshipEntity = entity.getRelationshipByName(relationship);
		const targetEntity = relationshipEntity.getTargetEntity();
		
		
		
		
		return Promise.resolve().then(() => persistence.collection(domain))
		.then((col) => col.findOne({},function(err, result) {
		if (err) throw err;
		const id = result["_id"].toString();
		console.log("Not Embedded")
		


		createNewDoc(id,persistence,domain,type,entity,targetEntity,relationshipEntity,req,res);

		}))
	}
	else{
		const domain = params.splice(0,1)[0];
		const relationship = params.splice(0,1)[0];
		const collection = params.splice(0,1)[0];
		const entity = serverUtils.getEntity(domain, collection);
		const id  = params.splice(0,1)[0];
		// FIXME: What happens for a password? The password should not be managed
		// with the "content" side of things, and should not, be using this
		// end-point.
		const persistence = serverUtils.getPersistence(domain);	
		console.log("Embedded")
		return Promise.resolve(createEmbDoc(id,persistence,domain,collection,entity,req,res,params))
		}
	
}

function createNewDoc(id,persistence,domain,type,entity,targetEntity,relationshipEntity,req,res){
    return Promise.resolve()
            .then(() => logger(req, "Trying to create new aggregation"))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => entity.createChildForInstance(instance, relationshipEntity))
            .then((child) => targetEntity.createDocument(persistence, child)) 
            .then((newDoc) => insertData(req.body,newDoc,persistence))
			.then((createdDocument) => {
				
			    	persistence.update(type,createdDocument);
					
                    utils.sendJSON(req, res, createdDocument);
                }
			)
        .catch((err) => {
            logger(req, "Could not create the Entity", {err});
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body,
                message: err.message
            });
            utils.sendJSON(req, res, resource, 400);
        })
        .finally(() => persistence.close());
	}
function createEmbDoc(id,persistence,domain,type,entity,req,res,params){
    return Promise.resolve()
            .then(() => logger(req, "Trying to create new aggregation"))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => addEmbeddedEntity(params,instance,req.body,persistence))
			.then((updatedDoc) => {
				
					entity.updateDocument(persistence, updatedDoc);
					
                    utils.sendJSON(req, res, updatedDoc);
                }
			)
        .catch((err) => {
            logger(req, "Could not create the Entity", {err});
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body,
                message: err.message
            });
            utils.sendJSON(req, res, resource, 400);
        })
        .finally(() => persistence.close());
	}	
	



// Call per Entity without relationship
function insertData(payload,newDoc,persistence){
	
	var payloadWithId = addObjectId(payload,false,persistence);
	var createdDocument = _.merge(payloadWithId,newDoc);	
	return createdDocument

// add object.ids and maybe later path
}
function addObjectId(payload,firstEmbedded,persistence)
{
	//check if there are embedded entities, only those need ids 
	if (payload.embedded.length >0){
		
		//iterate through all relations and all entities
		for ( var relationship in payload.embedded){
			var entities = payload.embedded[relationship].entities;
			
			if (entities.length > 0)
			{
				for (var entity in entities){
					if ( typeof(entities[entity].path) === 'undefined'){
						payload.embedded[relationship].entities[entity].path = "";
					}	
	
					//add object id and call recursive if further embedded
					if ( typeof(entities[entity]["_id"]) === 'undefined'){
						payload.embedded[relationship].entities[entity]["_id"] = persistence.CreateObjectID();
						if (entities[entity].embedded.length > 0){
							payload.embedded[relationship].entities[entity] = addObjectId(entities[entity],false,persistence);
						}
					
					}
					
				}
				
				
			}
			
			
		}
	}
	// If we add an embedded document without id -> add a new one and call recursively for all embedded ids.

		if (firstEmbedded === true){
			
			payload["_id"] = persistence.CreateObjectID();
			addObjectId(payload,false,persistence);

	}
	
	// If we add an embedded document without id -> we have to add a new one and call recursively for all further ids.
	
	
	return payload;	
}

function addEmbeddedEntity(searchstring,instance,payload,persistence)
{
	if (searchstring.length > 2){
		var searchRel = searchstring.splice(0,1)[0]
		var searchEntity = searchstring.splice(0,1)[0]
		var searchID = searchstring.splice(0,1)[0]


	//check if there are embedded entities, only those need ids
	for (rel in instance.embedded) {
		if (searchRel === instance.embedded[rel].parentRelnName ){
			for (ent in instance.embedded[rel].entities)
			{
				if (instance.embedded[rel].entities[ent]["_id"].toString() === searchID){
					instance.embedded[rel].entities[ent] = addEmbeddedEntity(searchstring,instance.embedded[rel].entities[ent],payload,persistence)
					return instance;
				
				}
			}
		}
	}
	}
	else {
		for (rel in instance.embedded){


			if (instance.embedded[rel].parentRelnName === searchstring[0]){
				instance.embedded[rel].entities.push(addObjectId(payload,true,persistence));
			}
		}
	}
	return instance;	
}












