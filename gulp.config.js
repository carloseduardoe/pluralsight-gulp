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
            'styles/**/*.scss',
            'styles/*.scss',
        ],
        less : [
            'styles/**/*.less',
            'styles/*.less',
        ],
        css  : [
            'styles/**/*.css',
            'styles/*.css',
        ]
    },
    clientpath    : client,
    serverpath    : server,
    output        : client + 'build/',
    serverconfig  : {
        script : server + 'app',
        delay  : 1,
        env    : {
            'PORT'     : 7203,
            'NODE_ENV' : process.env.NODE_ENV || 'dev'
        },
        watch  : [server + '**/*.*']
    },
    getWiredepOptions : () => { return {
        bowerJson  : require('./bower.json'),
        directory  : './bower_components',
        ignorePath : '../..'
    }}
};