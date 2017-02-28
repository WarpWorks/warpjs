var express = require('express');
var pageRouter = express.Router();

// ------------------------------------------------------------------
// Routes for generated applications
// ------------------------------------------------------------------

pageRouter.get('/portal/:portal', function(req, res, next) {
  res.render('portal'+req.params.portal, { title: 'test', layout: '_portalLayout' });
});

pageRouter.get('/app/:app', function(req, res, next) {
  res.render('app'+req.params.app, { title: 'test', layout: '_appLayout' });
});

module.exports = { 
  router: pageRouter
};
