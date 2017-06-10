'use strict';

const Hapi = require('hapi');
const Path = require('path');
const info = require('./package.json');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});
server.connection({ port: 8080});


server.register(require('inert'), (err) => {
    if(err) {
        throw err;
    }
    server.route([
        {
            method: 'GET',
            path: '/',
            handler: (request, reply) => {
                reply('Example API-Console v' + info.version);
            }
        },
        {
            method: 'GET',
            path: '/docs/api.raml',
            handler: {
                file: 'api.raml'
            },
            config: {
                security: true
            }
        },
        {
            method: 'GET',
            path: '/docs/',
            handler: {
                file: 'index.html'
            },
            config: {
                security: true
            }
        },
        {
            method: 'GET',
            path: '/docs/index.html',
            handler: {
                file: 'index.html'
            },
            config: {
                security: true
            }
        },
        {
            method: 'GET',
            path: '/docs/{param*}',
            handler: {
                directory: {
                    // Ensuring we get the path correctly by using require to resolve the node_modules directory
                    path: Path.resolve(require.resolve('hapi'), '../../../api-console/dist'),
                    redirectToSlash: true,
                    index: true
                }
            },
            config: {
                security: true
            }
        }
    ]);

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});