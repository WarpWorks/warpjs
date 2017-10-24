const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const serverUtils = require('./../../utils');
const utils = require('./../utils');



module.exports = (req, res) => {
    var params =  req.params[0].split("/");
	const domain = params.splice(0,1)[0];
	const relationship = params.splice(0,1)[0];
    const id = params.splice(0,1)[0];
	
	const domainInstance = serverUtils.getDomain(domain)

	
	const currentPath = "/"+domain+"/"+relationship
	
	const parent = 	domainInstance.getParentEntityByRelationshipName(relationship);
	const relationshipEntity = parent.getRelationshipByName(relationship);
	const entity = relationshipEntity.getTargetEntity();
	
	const persistence = serverUtils.getPersistence(domain);
	return Promise.resolve()
		.then(() => entity.getInstance(persistence, id))
		.then((instance) => clean(instance,req,res,params,currentPath))
        .finally(() => persistence.close());
	

}

function clean (instance,req,res,params,currentPath){
	if (!Object.keys(instance).length){
		res.status(404).send();

	}
	else {
		
		//check weather it was asked for an embedded entity --> only return that.
		
		if(params.length > 1)
		{
			
			//TODO this is inefficient but ok for now
			var cleanPath = rebuildPath(instance,currentPath);

			var embeddedEntity = findEntity(cleanPath,params)
			utils.sendJSON(req, res, embeddedEntity)
			
		}
		else{

		var cleanPath = rebuildPath(instance,currentPath);
		utils.sendJSON(req, res, cleanPath)
		}

	}
}

function findEntity(instance,searchstring){
	{
	if (searchstring.length > 1){
		var searchRel = searchstring.splice(0,1)[0];
		var searchID = searchstring.splice(0,1)[0];


	//check if there are embedded entities, only those need ids
	for (rel in instance.embedded) {
		if (searchRel === instance.embedded[rel].parentRelnName ){
			for (ent in instance.embedded[rel].entities)
			{
				if (instance.embedded[rel].entities[ent]["_id"].toString() === searchID){
					instance = findEntity(instance.embedded[rel].entities[ent],searchstring)
					return instance;
				
				}
			}
		}
	}
	}
	else {
		
		//found id 
		return instance;

	}
	return instance;	
}
	
	
	
}
	
function rebuildPath(obj,pathvariable) {
	//"Relationship:Overview.Entity:59ba8a0d3720861754684b20.Basic:Heading"
	if (typeof(obj["id"]) !== 'undefined'){
		obj["path"] = pathvariable+"/"+obj["id"];
		}
	else{
		obj["path"] = pathvariable+"/"+obj["_id"];
		}
		priorpath = obj["path"];
		
	Object.keys(obj).forEach(function(key) {
	  var val = obj[key];

        if( typeof(val) === "object" && val !== null && val.length > 0 ){
			
			// foreach Relationship;
			Object.keys(val).forEach(function(innerkey){
				var relationship = val[innerkey];

			// if its an embedded entity and not a relationship 
			// If its a Relationship
			if (typeof(relationship.parentRelnName) !== "undefined" ){


					// if relationship has own entities -> Recursion.				
					if (relationship.entities.length > 0){

						var temppath = priorpath;	
											
						Object.keys(relationship.entities).forEach(function(innerkey2){
							priorpath = priorpath+"/"+relationship.parentRelnName;
							rebuildPath(relationship.entities[innerkey2],priorpath);
							priorpath = temppath;
						});		
					}
				}
			});
		}
		
		else{
		switch(key) {

			case "parentBaseClassID":
				delete obj[key]
				break;
		}
		}
    });

	return obj;

};
