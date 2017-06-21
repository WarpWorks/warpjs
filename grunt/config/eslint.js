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
            '!lib/**/*.test.js'
        ]
    },
    client: {
        options: {
            baseConfig: {
                root: true,
                extends: '@quoin/eslint-config-quoin/client'
            },
            envs: [
                'jquery',
                'node'
            ],
            globals: [
                '$warp'
            ],
            rules: {
                'no-console': 'warn',
                'standard/no-callback-literal': 'warn'
            }
        },
        src: [
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
            'lib/**/*.test.js'
        ]
    }
};