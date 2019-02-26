let client = './src/client/',
    server = './src/server/';

module.exports = {
    jspaths       : [
        './src/**/*.js',
        './src/*.js'
    ],
    clientjspaths : [
        client + 'app/**/*.module.js',
        client + 'app/**/*.js',
        '!' + client + 'app/**/*.spec.js'
    ],
    stylepaths    : {
        scss : [
            client + 'styles/**/*.scss',
            client + 'styles/*.scss',
        ],
        less : [
            client + 'styles/**/*.less',
            client + 'styles/*.less',
        ],
        css  : [
            client + 'styles/**/*.css',
            client + 'styles/*.css',
        ]
    },
    fontpaths : [
        './bower_components/font-awesome/fonts/**/*.*'
    ],
    imagepaths : [
        client + 'images/**/*.*'
    ],
    clientpath    : client,
    serverpath    : server,
    output        : client + 'build/',
    serverconfig  : {
        script    : server + 'app.js',
        delayTime : 1,
        env       : {
            'PORT'     : 7203,
            'NODE_ENV' : process.env.NODE_ENV || 'dev'
        },
        watch     : [server + '**/*.*']
    },
    getWiredepOptions : () => { return {
        bowerJson  : require('./bower.json'),
        directory  : './bower_components',
        ignorePath : '../..'
    }}
};