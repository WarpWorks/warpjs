const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

function updateDocument(persistence, entity, instance, searchstring, req,res,type,id) {
	const payload = req.body;
	const oldValue= instance;
	
	//Certification:59ccff916d607318d81fd063.Overview:59ccff916d607318d81fd064.Images:59ccff916d607318d81fd065.Map:59ccff916d607318d81fd066"
	
	
    return Promise.resolve()
		

		.then(function(){
			
				cleanInstance = UpdateNewValue(searchstring,instance,payload);
				return Promise.resolve()
		})
        .then(() => entity.updateDocument(persistence, cleanInstance))
		.then(() => logger(req, `${req.domain}/${type}/${id}`, {
            updatePath: payload.path,
            newValue: cleanInstance,
            oldValue
        }))
        .then(() => utils.sendJSON(req, res, cleanInstance));
}

module.exports = (req, res) => {
	const payload = req.body;
	var params =  req.params[0].split("/");
	const domain = params.splice(0,1)[0];
	const relationship = params.splice(0,1)[0];
	const type = params.splice(0,1)[0];
    const id = params.splice(0,1)[0];


	

    // FIXME: What happens for a password? The password should not be managed
    // with the "content" side of things, and should not, be using this
    // end-point.
    logger(req, "Trying to patch", req.body);

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => updateDocument(persistence, entity, instance,params, req, res,type,id),
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed put/update", {err});
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body,
                message: err.message
            });
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close());
};

function UpdateNewValue(searchstring,instance,payload)
{
	if (searchstring.length > 1){
		var searchRel = searchstring.splice(0,1)[0]
		var searchEntity = searchstring.splice(0,1)[0]
		var searchID = searchstring.splice(0,1)[0]


	//check if there are embedded entities, only those need ids
	for (rel in instance.embedded) {
		if (searchRel === instance.embedded[rel].parentRelnName ){
			for (ent in instance.embedded[rel].entities)
			{
				if (instance.embedded[rel].entities[ent]["_id"].toString() === searchID){
					instance.embedded[rel].entities[ent] = UpdateNewValue(searchstring,instance.embedded[rel].entities[ent],payload)
					return instance;
				
				}
			}
		}
	}
	}
	else {
		Object.keys(payload).forEach(function(key) {
		  instance[key] = payload[key];
			});

	}
	return instance;	
}

