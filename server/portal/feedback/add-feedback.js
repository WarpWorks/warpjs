const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const { body } = req;

    const data = {
        choice: body.choice,
        href: body.href,
        text: body.text,
        now: Date.now(),
        from: req.ip

    };

    console.log("data=", data);

    const resource = warpjsUtils.createResource(req, {
        title: `Adding feedback`,
        form: body
    });

    const persistence = serverUtils.getPersistence();

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            try {
                const entity = await serverUtils.getEntity(null, 'AdminConfiguration');
                const documents = await entity.getDocuments(persistence);
                console.log("documents=", documents);

                // There should only be one document, so let's get the first
                // one.
                if (!documents.length) {
                    throw new Error("Cannot find admin configuration document.");
                }

                const instance = documents[0];

                const relationship = entity.getRelationshipByName('Feedback');

                const feedbackEntity = relationship.getTargetEntity();

                const feedbackInstance = feedbackEntity.createContentChildForRelationship(relationship, entity, instance);
                feedbackInstance.Date = Date.now();
                feedbackInstance.RemoteHost = req.ip;
                feedbackInstance.HRef = body.href;
                feedbackInstance.Text = body.text;
                feedbackInstance.FeedbackType = body.choice;

                console.log("feedbackInstance=", feedbackInstance);

                await feedbackEntity.createDocument(persistence, feedbackInstance);

                warpjsUtils.sendHal(req, res, resource, RoutesInfo);
            } catch (err) {
                warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
            } finally {
                persistence.close();
            }
        }
    });
};
