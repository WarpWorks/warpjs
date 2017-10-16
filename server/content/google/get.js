const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');
const googleAuth = require('google-auth-library');
const config = require('./../../config');
const serverUtils = require('./../../utils');
const utils = require('./../utils');
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const sheets = google.sheets('v4');
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand('W2:content:instance', {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    const resource = warpjsUtils.createResource(url, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    return resource;
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id,
        _meta: {
            editable: true
        }
    });

    resource.link('preview', RoutesInfo.expand('entity', {
        type,
        id
    }));
    resource.link('sibling', RoutesInfo.expand('W2:content:instance-sibling', {
        domain,
        type,
        id
    }));
    resource.link('types', RoutesInfo.expand('W2:content:entities', {
        domain,
        profile: 'linkable'
    }));

    res.format({
        html() {
            const bundles = [
                `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/WarpCMS.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/entity.js`
            ];

            utils.basicRender(bundles, resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);
            const entity = serverUtils.getEntity(domain, type);
            const pageViewEntity = entity.getPageView(config.views.content);

            return Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => {
                    resource.displayName = entity.getDisplayName(instance);
                    resource.isRootInstance = instance.isRootInstance;

                    return Promise.resolve()
                        .then(() => entity.getInstancePath(persistence, instance))
                        .then((breadcrumbs) => breadcrumbs.map(breadcrumbMapper.bind(null, domain)))
                        .then((breadcrumbs) => {
                            resource.breadcrumbs = breadcrumbs;
                        })
                        .then(() => pageViewEntity.toFormResource(persistence, instance, []))
                        .then((formResource) => {
                            runGoogle(formResource);
                            resource.formResource = formResource;
                        });
                })
                .then(() => utils.sendHal(req, res, resource))
                .finally(() => persistence.close());
        }
    });
};

function runGoogle(formResource) {
    var formResource1 = formResource;

    // BEFORE RUNNING:
    // ---------------
    // 1. If not already done, enable the Google Sheets API
    //    and check the quota for your project at
    //    https://console.developers.google.com/apis/api/sheets
    // 2. Install the Node.js client library by running
    //    `npm install googleapis --save`

    authorize(updateSheet);

    function authorize(callback) {
        var clientSecret = "PhyJeWWIX_PJhbfAh8I5qjHR";
        var clientId = "763801281744-gpi48fh79eiku6fdl5eht4568nen6fcr.apps.googleusercontent.com";
        var redirectUrl = "urn:ietf:wg:oauth:2.0:oob";
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client);
            }
        });
    }

    function updateSheet(authClient) {
        var request = {
            // The ID of the spreadsheet to update.
            spreadsheetId: '11urFBGDK9wYRgJ8P44ko9tzitxR4u4iLbQ_Suu4kPRo', // TODO: Update placeholder value.

            // The A1 notation of the values to update.
            range: 'data!A1:D500', // TODO: Update placeholder value.

            valueInputOption: 'raw',
            resource:
  {
      values: converterSheet(formResource1)

  }, // TODO: Add desired properties to the request body. All existing properties
            // will be replaced.

            auth: authClient
        };

        sheets.spreadsheets.values.update(request, function(err, response) {
            if (err) {
                console.error(err);
                return;
            }

            // TODO: Change code below to process the `response` object:
            console.log(JSON.stringify(response, null, 2));
        });
    };

    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function(code) {
            rl.close();
            oauth2Client.getToken(code, function(err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }

    function converterSheet(formResource) {
        let array = new Array();

        let row = 0;
        var panels = formResource.panels;

        let resultArray = googleSheetConvert(panels, "", 0);
        var globalpath;
        function googleSheetConvert(panels, path, row) {
            for (panel in panels) {
                // add Infos for Panel
                // if values are not on level 1 call them subpanels

                if (typeof (array[row]) === 'undefined') {
                    array[row] = [];
                }

                // only add Panel on the First Level
                if (path.split(":").length <= 1) {
                    array[row].push("Panel");
                    array[row].push(path + panels[panel].label);
                    if (panels[panel].items[0].style === "Table") {
                        array[row].push(panels[panel].items[0].relationship.model.tableView.basicProperties.join(","));
                    }
                    row = row + 1;
                }

                var items = panels[panel].items;

                for (item in items) {
                    // if necessary init array
                    if (typeof (array[row]) === 'undefined') {
                        array[row] = [];
                    }

                    switch (items[item].type) {
                        case "BasicPropertyPanelItem":
                            array[row].push("BasicProperty");
                            array[row].push(path + panels[panel].label + ":" + items[item].model.name);
                            array[row].push(items[item].model.name);
                            array[row].push(items[item].model.value);
                            row = row + 1;
                            break;
                        case "EnumPanelItem":
                            array[row].push("Enum");
                            array[row].push(path + panels[panel].label + ":" + items[item].model.name);
                            array[row].push(items[item].model.name);
                            // concat all literals
                            let literals = items[item].model.literals;
                            literalsArray = [];
                            for (literal in literals) {
                                literalsArray.push(literals[literal].name);
                            }
                            array[row].push(literalsArray.join(","));
                            row = row + 1;
                            break;
                        case "RelationshipPanelItem":
                            let data = items[item].relationship.model.data;

                            // For Carousel we need to start recursion
                            if (items[item].style === "Carousel") {
                                array[row].push("DropDown");
                                var dropDownPath = [panels[panel].label, items[item].relationship.model.name].join(":");
                                array[row].push(path + dropDownPath);
                                array[row].push(items[item].relationship.model.name);
                                let dropDownItems = [];
                                // check if entity has data
                                if (data.length > 0) {
                                    for (var link in data) {
                                        dropDownItems.push("Paragraph" + link);
                                    }
                                    array[row].push(dropDownItems.join(","));
                                    // console.log(dropDownItems);
                                    row = row + 1;
                                    for (var link in data) {
                                        var globalpath = path + dropDownPath + ":Paragraph" + link + ":";
                                        console.log(globalpath);
                                        let tempArray = googleSheetConvert(data[link].panels, globalpath, row);

                                        // array.push(tempArray[0]);
                                        row = tempArray;
                                    }
                                } else {
                                    array[row] = [];
                                }

                                break;
                            }

                            if (items[item].style === "Table") {
                                // if it has children push name and link

                                for (var link in data) {
                                    // TODO Add the real Link converted
                                    if (typeof (array[row]) === 'undefined') {
                                        array[row] = [];
                                    }
                                    array[row].push("Table");
                                    array[row].push(path + panels[panel].label + ":" + data[link][1]);
                                    array[row].push(data[link][1]);
                                    array[row].push("LINK => " + data[link][1] + "," + data[link][2]);
                                    row = row + 1;
                                }
                                break;
                            }
                            if (items[item].style === "CSV") {
                                // if it has children push name and link

                                for (var link in data) {
                                    // TODO Add the real Link converted
                                    if (typeof (array[row]) === 'undefined') {
                                        array[row] = [];
                                    }
                                    array[row].push("RelationShip");
                                    array[row].push(path + panels[panel].label + ":" + data[link][1]);
                                    array[row].push(data[link][1]);
                                    array[row].push("LINK => " + data[link][1]);
                                    row = row + 1;
                                }
                                break;
                            }
                    }
                }
            }
            return row;
        }

        return (array);
    }
}
