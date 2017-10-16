const Promise = require('bluebird');
const utils = require('./../utils');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    var params =  req.params[0].split("/");
	const domain = params.splice(0,1)[0];
	const relationship = params.splice(0,1)[0];
	const type = params.splice(0,1)[0];
    const id = params.splice(0,1)[0];
	payload = req.body;
	const persistence = serverUtils.getPersistence(domain);
	const entity = serverUtils.getEntity(domain, type);

	if (params.length > 0){
			const entity = serverUtils.getEntity(domain, type);
			
			var oldValue;
			var deletedInstance;
			return Promise.resolve()
			.then(() => entity.getInstance(persistence, id))
			.then(
				(instance) => {
					return Promise.resolve()
						.then(function(){
								oldValue = instance;
								deletedInstance = deleteEmbedded(params,instance);
								return Promise.resolve()
						})
						.then(() => entity.updateDocument(persistence, deletedInstance))
						.then(() => logger(req, `${req.domain}/${type}/${id}`, {
							updatePath: payload.path,
							newValue: deletedInstance,
							oldValue
						}))
						.then(() => utils.sendJSON(req, res, deletedInstance));
				});
	}
	else{
	
	
    logger(req, "Trying to delete");

    console.log(`Request to delete ${domain}/${type}/${id}`);
    console.log('TODO: delete document');
    console.log('TODO: Log action');
	
	



    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => {
                return Promise.resolve()
                    .then(() => entity.removeDocument(persistence, id))
                    .then(() => {
                        logger(req, "Deleted", instance);
                        res.status(204).send();
                    });
            },
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed", {err});
            res.status(400).send(err.message); // FIXME: Don't send the err.
        })
        .finally(() => persistence.close());
	}
	
	function deleteEmbedded(searchstring,instance)
{
	if (searchstring.length > 3){
		var searchRel = searchstring.splice(0,1)[0]
		var searchEntity = searchstring.splice(0,1)[0]
		var searchID = searchstring.splice(0,1)[0]
		
		// find the embedded ID
	for (rel in instance.embedded) {
		if (searchRel === instance.embedded[rel].parentRelnName ){
			for (ent in instance.embedded[rel].entities)
			{
				if (instance.embedded[rel].entities[ent]["_id"].toString() === searchID){
					instance.embedded[rel].entities[ent] = deleteEmbedded(searchstring,instance.embedded[rel].entities[ent])
					return instance;
				
				}
			}
		}
	}
	}
	else {
		for (rel in instance.embedded){
			
			// Remove the entity from the relation
			for (ent in instance.embedded[rel].entities){
			if (instance.embedded[rel].entities[ent]["_id"].toString() === searchstring[2]){
				
				instance.embedded[rel].entities.splice(ent,1);
			}
			}
		}
	}
	return instance;	
}
	
	
};
