const utils = require('./../../utils');

const errorTemplate = require('./../../common/templates/_error.hbs');
const template = require("./../templates/index.hbs");

(($) => {
    $(document).ready(() => {
        utils.getCurrentPageHAL($)
            .then((result) => {
                let content;

                if (result.error) {
                    content = errorTemplate(result.data);
                } else {
                    const tempData =
                        {
                            "_links": {
                                "self": {
                                    "href": "/entity/IIC/58b74e9427c4d62078f1864b"
                                },
                                "i3c_homepage": {
                                    "href": "/",
                                    "title": "Home page"
                                },
                                "i3c_login": {
                                    "href": "/session",
                                    "title": "Login"
                                }
                            },
                            "_embedded": {
                                "breadcrumbs": [
                                    {
                                        "_links": {
                                            "self": {
                                                "href": "/entity/IIC/58b74e9427c4d62078f1864b"
                                            }
                                        },
                                        "type": "IIC",
                                        "id": "58b74e9427c4d62078f1864b",
                                        "name": "IIC"
                                    }
                                ],
                                "panels": [
                                    {
                                        "_links": {
                                            "self": {
                                                "href": "/entity/Paragraph/58b74e9427c4d62078f1864c"
                                            }
                                        },
                                        "_embedded": {
                                            "Images": [
                                                {
                                                    "_links": {
                                                        "self": {
                                                            "href": "/entity/Image/58b74ef317fa6d2418c8a800"
                                                        }
                                                    },
                                                    "_embedded": {
                                                        "Maps": [
                                                            {
                                                                "_links": {
                                                                    "self": {
                                                                        "href": "/entity/ImageArea/58b74f6e17fa6d2418c8a801"
                                                                    },
                                                                    "target": {
                                                                        "title": "I3C Home",
                                                                        "href": "/entity/I3C/58b74ed117fa6d2418c8a7fe"
                                                                    }
                                                                },
                                                                "_embedded": {
                                                                    "Targets": [
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/I3C/58b74ed117fa6d2418c8a7fe"
                                                                                }
                                                                            },
                                                                            "_embedded": {
                                                                                "Overviews": [
                                                                                    {
                                                                                        "_links": {
                                                                                            "self": {
                                                                                                "href": "/entity/Paragraph/58b752d417fa6d2418c8a803"
                                                                                            }
                                                                                        },
                                                                                        "_embedded": {
                                                                                            "Images": [
                                                                                                {
                                                                                                    "_links": {
                                                                                                        "self": {
                                                                                                            "href": "/entity/Image/58b752e317fa6d2418c8a804"
                                                                                                        }
                                                                                                    },
                                                                                                    "_embedded": {
                                                                                                        "Maps": [
                                                                                                            {
                                                                                                                "_links": {
                                                                                                                    "self": {
                                                                                                                        "href": "/entity/ImageArea/58b7534917fa6d2418c8a805"
                                                                                                                    },
                                                                                                                    "target": {
                                                                                                                        "title": "I3C Browser",
                                                                                                                        "href": "/map"
                                                                                                                    }
                                                                                                                },
                                                                                                                "type": "ImageArea",
                                                                                                                "id": "58b7534917fa6d2418c8a805",
                                                                                                                "Coords": "0,0,700,700",
                                                                                                                "Alt": "",
                                                                                                                "HRef": "/map",
                                                                                                                "Title": "I3C Browser",
                                                                                                                "Shape": "rect"
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    "type": "Image",
                                                                                                    "id": "58b752e317fa6d2418c8a804",
                                                                                                    "ImageURL": "/public/iic_images/i3c.png",
                                                                                                    "Caption": "",
                                                                                                    "AltText": "",
                                                                                                    "Width": "700",
                                                                                                    "Height": ""
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        "type": "Paragraph",
                                                                                        "id": "58b752d417fa6d2418c8a803",
                                                                                        "Heading": "",
                                                                                        "Content": ""
                                                                                    }
                                                                                ]
                                                                            },
                                                                            "type": "I3C",
                                                                            "id": "58b74ed117fa6d2418c8a7fe",
                                                                            "name": "I3C Home"
                                                                        }
                                                                    ]
                                                                },
                                                                "type": "ImageArea",
                                                                "id": "58b74f6e17fa6d2418c8a801",
                                                                "Coords": "500,0,650,140",
                                                                "Alt": "",
                                                                "HRef": "",
                                                                "Title": "Industrial Internet Interoperability Coalition (I3C)",
                                                                "Shape": "rect"
                                                            }
                                                        ]
                                                    },
                                                    "type": "Image",
                                                    "id": "58b74ef317fa6d2418c8a800",
                                                    "ImageURL": "/public/iic_images/iic.png",
                                                    "Caption": "",
                                                    "AltText": "",
                                                    "Width": "700",
                                                    "Height": ""
                                                }
                                            ]
                                        },
                                        "type": "Paragraph",
                                        "id": "58b74e9427c4d62078f1864c",
                                        "Heading": "",
                                        "Content": "",
                                        "position": 0
                                    },
                                    {
                                        "_links": {
                                            "self": {
                                                "href": "[undefined]"
                                            }
                                        },
                                        "_embedded": {
                                            "panelItems": [
                                                {
                                                    "_links": {
                                                        "self": {
                                                            "href": "[undefined]"
                                                        }
                                                    },
                                                    "_embedded": {
                                                        "relationships": [
                                                            {
                                                                "_links": {
                                                                    "self": {
                                                                        "href": "/entity/Relationship/121"
                                                                    }
                                                                },
                                                                "_embedded": {
                                                                    "references": [
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/Organization/58b74ebb17fa6d2418c8a7fd"
                                                                                }
                                                                            },
                                                                            "type": "Organization",
                                                                            "id": "58b74ebb17fa6d2418c8a7fd",
                                                                            "name": "IIC Org"
                                                                        }
                                                                    ]
                                                                },
                                                                "type": "Relationship",
                                                                "id": 121,
                                                                "name": "Organization",
                                                                "desc": "Organization: IIC[undefined] (1:Many)"
                                                            }
                                                        ]
                                                    },
                                                    "type": "RelationshipPanelItem",
                                                    "id": 137,
                                                    "name": "Organizations",
                                                    "desc": "Tooltip",
                                                    "style": "CSV",
                                                    "label": "Organizations",
                                                    "position": "0"
                                                },
                                                {
                                                    "_links": {
                                                        "self": {
                                                            "href": "[undefined]"
                                                        }
                                                    },
                                                    "_embedded": {
                                                        "relationships": [
                                                            {
                                                                "_links": {
                                                                    "self": {
                                                                        "href": "/entity/Relationship/122"
                                                                    }
                                                                },
                                                                "_embedded": {
                                                                    "references": [
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/I3C/58b74ed117fa6d2418c8a7fe"
                                                                                }
                                                                            },
                                                                            "type": "I3C",
                                                                            "id": "58b74ed117fa6d2418c8a7fe",
                                                                            "name": "I3C Home"
                                                                        }
                                                                    ]
                                                                },
                                                                "type": "Relationship",
                                                                "id": 122,
                                                                "name": "I3C",
                                                                "desc": "I3C: IIC[undefined] (1:Many)"
                                                            }
                                                        ]
                                                    },
                                                    "type": "RelationshipPanelItem",
                                                    "id": 138,
                                                    "name": "I3Cs",
                                                    "desc": "Tooltip",
                                                    "style": "CSV",
                                                    "label": "I3Cs",
                                                    "position": "1"
                                                },
                                                {
                                                    "_links": {
                                                        "self": {
                                                            "href": "[undefined]"
                                                        }
                                                    },
                                                    "_embedded": {
                                                        "relationships": [
                                                            {
                                                                "_links": {
                                                                    "self": {
                                                                        "href": "/entity/Relationship/124"
                                                                    }
                                                                },
                                                                "_embedded": {
                                                                    "references": [
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/Paragraph/58b74e9427c4d62078f1864c"
                                                                                }
                                                                            },
                                                                            "type": "Paragraph",
                                                                            "id": "58b74e9427c4d62078f1864c",
                                                                            "Heading": "",
                                                                            "Content": ""
                                                                        }
                                                                    ]
                                                                },
                                                                "type": "Relationship",
                                                                "id": 124,
                                                                "name": "Overview",
                                                                "desc": "Overview: IIC[undefined] (1:Many)"
                                                            }
                                                        ]
                                                    },
                                                    "type": "RelationshipPanelItem",
                                                    "id": 140,
                                                    "name": "Paragraphs",
                                                    "desc": "Tooltip",
                                                    "style": "CSV",
                                                    "label": "Paragraphs",
                                                    "position": "3"
                                                }
                                            ]
                                        },
                                        "type": "Panel",
                                        "id": 136,
                                        "name": "Basics",
                                        "desc": "Properties, Enums, Associations and Aggregations",
                                        "label": "Basics",
                                        "position": "01",
                                        "alternatingColors": false
                                    },
                                    {
                                        "_links": {
                                            "self": {
                                                "href": "[undefined]"
                                            }
                                        },
                                        "_embedded": {
                                            "panelItems": [
                                                {
                                                    "_links": {
                                                        "self": {
                                                            "href": "[undefined]"
                                                        }
                                                    },
                                                    "_embedded": {
                                                        "relationships": [
                                                            {
                                                                "_links": {
                                                                    "self": {
                                                                        "href": "/entity/Relationship/123"
                                                                    }
                                                                },
                                                                "_embedded": {
                                                                    "references": [
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/BodyOfKnowledge/58b74ede17fa6d2418c8a7ff"
                                                                                }
                                                                            },
                                                                            "_embedded": {
                                                                                "_links": {
                                                                                    "self": {
                                                                                        "href": "/entity/Paragraph/58caa7d31fb3de24ca7c59b3"
                                                                                    }
                                                                                },
                                                                                "_embedded": {
                                                                                    "Images": [
                                                                                        {
                                                                                            "_links": {
                                                                                                "self": {
                                                                                                    "href": "/entity/Image/58caa7f31fb3de24ca7c59b4"
                                                                                                }
                                                                                            },
                                                                                            "type": "Image",
                                                                                            "id": "58caa7f31fb3de24ca7c59b4",
                                                                                            "ImageURL": "http://lorempixel.com/75/75/cats/",
                                                                                            "Caption": "This should be the first pic",
                                                                                            "AltText": "dummy text",
                                                                                            "Width": "75",
                                                                                            "Height": "75"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                "type": "Paragraph",
                                                                                "id": "58caa7d31fb3de24ca7c59b3",
                                                                                "Heading": "This is the body of knowl",
                                                                                "Content": "Andouille jowl flank tongue chicken pig pork chop doner biltong picanha short ribs capicola spare ribs filet mignon. Shoulder chuck drumstick, pastrami short ribs meatloaf alcatra capicola kevin bresaola short loin. Meatloaf cow strip steak sirloin t-bone biltong turducken tenderloin short loin tri-tip picanha landjaeger pastrami. Spare ribs meatball alcatra short loin pork rump chicken hamburger landjaeger, tenderloin corned beef sirloin ham hock sausage.",
                                                                                "position": 0
                                                                            },
                                                                            "type": "BodyOfKnowledge",
                                                                            "id": "58b74ede17fa6d2418c8a7ff",
                                                                            "name": "IIC BoK"
                                                                        },
                                                                        {
                                                                            "_links": {
                                                                                "self": {
                                                                                    "href": "/entity/BodyOfKnowledge/58caa1447d139649852da28a"
                                                                                }
                                                                            },
                                                                            "_embedded": {
                                                                                "_links": {
                                                                                    "self": {
                                                                                        "href": "/entity/Paragraph/58caa1687d139649852da28b"
                                                                                    }
                                                                                },
                                                                                "_embedded": {
                                                                                    "Images": [
                                                                                        {
                                                                                            "_links": {
                                                                                                "self": {
                                                                                                    "href": "/entity/Image/58caa1887d139649852da28c"
                                                                                                }
                                                                                            },
                                                                                            "type": "Image",
                                                                                            "id": "58caa1887d139649852da28c",
                                                                                            "ImageURL": "http://lorempixel.com/900/349/cats/",
                                                                                            "Caption": "Hey its a cat",
                                                                                            "AltText": "el gato",
                                                                                            "Width": "900",
                                                                                            "Height": "349"
                                                                                        }
                                                                                    ]
                                                                                },
                                                                                "type": "Paragraph",
                                                                                "id": "58caa1687d139649852da28b",
                                                                                "Heading": "This is some heading",
                                                                                "Content": "Bacon ipsum dolor amet shank jerky ribeye tongue, beef ribs sirloin prosciutto biltong tenderloin rump tri-tip. Kielbasa meatloaf ribeye porchetta beef ribs chuck beef, ball tip sirloin meatball ham sausage swine jowl alcatra. Rump tongue turkey, filet mignon flank frankfurter t-bone pancetta. Flank corned beef shankle chicken, jerky kielbasa ground round hamburger fatback beef brisket prosciutto strip steak beef ribs. Meatball pork chop ribeye flank pork loin pig meatloaf, shankle filet mignon jerky leberkas salami alcatra capicola rump.",
                                                                                "position": 0
                                                                            },
                                                                            "type": "BodyOfKnowledge",
                                                                            "id": "58caa1447d139649852da28a",
                                                                            "name": "Second BOK"
                                                                        }
                                                                    ]
                                                                },
                                                                "type": "Relationship",
                                                                "id": 123,
                                                                "name": "BodyOfKnowledge",
                                                                "desc": "BodyOfKnowledge: IIC[undefined] (1:Many)"
                                                            }
                                                        ]
                                                    },
                                                    "type": "RelationshipPanelItem",
                                                    "id": 139,
                                                    "name": "BodyOfKnowledges",
                                                    "desc": "Tooltip",
                                                    "style": "Preview",
                                                    "label": "BodyOfKnowledges",
                                                    "position": "2"
                                                }
                                            ]
                                        },
                                        "type": "Panel",
                                        "id": 136,
                                        "name": "Users",
                                        "desc": "Properties, Enums, Associations and Aggregations",
                                        "label": "Users",
                                        "position": "02",
                                        "alternatingColors": false
                                    }
                                ]
                            },
                            "copyrightYear": 2017
                        };

                    console.log("initial load: data=", tempData);
                    content = template(tempData);

                    // console.log("initial load: data=", result.data);
                    // content = template(result.data);
                }
                $('#i3c-portal-placeholder').html(content);
            });
    });
})(jQuery);
