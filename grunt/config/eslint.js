module.exports = {
    options: {
        fix: true,
        useEslintrc: false,
        parserOptions: {
            ecmaVersion: 8
        }
    },
    node: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin'
            },
            rules: {
                'no-console': 'warn'
            }
        },
        src: [
            '*.js',
            'grunt/**/*.js',
            'lib/**/*.js',
            '!lib/**/*.test.js',
            'scripts/*.js',
            'server/**/*.js',
            '!server/**/*.test.js'
        ]
    },
    client: {
        options: {
            fix: true,
            parserOptions: {
                ecmaVersion: 8,
                ecmaFeatures: {
                    experimentalObjectRestSpread: true,
                    jsx: true
                }
            },
            baseConfig: {
                root: true,
                extends: [
                    '@quoin/eslint-config-quoin/client',
                    'eslint:recommended',
                    'plugin:react/recommended'
                ],
                plugins: [
                    "react"
                ],
                settings: {
                    react: {
                        createClass: "createReactClass",
                        pragma: "React",
                        version: "detect",

                        flowVersion: "0.53"
                    },
                    propWrapperFunctions: [
                        'forbidExtraProps',
                        { property: "freeze", object: "Object" },
                        { property: "myFavoriteWrapper" }
                    ],
                    linkComponents: [
                        "Hyperlink",
                        { name: "Link", linkAttribute: "to" }
                    ]
                }
            },
            envs: [
                'jquery',
                'node'
            ],
            globals: [
                'React'
            ],
            rules: {
                'no-console': 'off', // DEBUG
                'standard/no-callback-literal': 'off', // DEBUG
                'camelcase': 'off', // DEBUG
                'react/react-in-jsx-scope': 'off'
            }
        },
        src: [
            'client/**/*.jsx',
            'client/**/*.js',
            '!client/**/*.test.js'
        ]
    },
    test: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin/node-test'
            }
        },
        src: [
            'lib/**/*.test.js',
            'server/**/*.test.js'
        ]
    }
};
