module.exports = {
    options: {
        fix: true,
        useEslintrc: false
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
            '!server/**/*.test.js',
            '!server/portal/entity-html/ssr/**/*.js'
        ]
    },
    client: {
        options: {
            fix: true,
            parserOptions: {
                ecmaFeatures: {
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
                        version: "detect"
                    }
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
            '!client/**/*.test.js',
            'server/portal/entity-html/components/**/*.jsx'
        ]
    },
    test: {
        options: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            },
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
