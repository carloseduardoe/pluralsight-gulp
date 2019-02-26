// packages
let gulp    = require('gulp'),
    del     = require('del'),
    sync    = require('browser-sync'),
    wiredep = require('wiredep').stream,
    args    = require('yargs').argv,
    config  = require('./gulp.config');

// plugins
// let jscs    = require('gulp-jscs'),
//     jshint  = require('gulp-jshint'),
//     gprint  = require('gulp-print').default,
//     glpif   = require('gulp-if'),
//     util    = require('gulp-util');
//     plumber = require('gulp-plumber');

// plugin wrapper
let $ = require('gulp-load-plugins')({lazy: true});



//-----------------------------------------------------------------------



gulp.task('hello-world', () => {
    log('Hello from gulp!');
});

gulp.task('analyze', () => {
    return gulp.src(config.jspaths)
    // .pipe(glpif(args.verbose, gprint()))
    // .pipe(jscs())
    // .pipe(jshint())
    // .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
    // .pipe(jshint.reporter('fail'));
    .pipe($.if(args.verbose, $.print.default()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('clean-styles', gulp.series(() => {
    return clean(config.output + 'styles');
}));

gulp.task('clean-fonts', gulp.series(() => {
    return clean(config.output + 'fonts');
}));

gulp.task('clean-images', gulp.series(() => {
    return clean(config.output + 'images');
}));

gulp.task('styles', gulp.series('clean-styles', () => {
    return gulp.src(config.stylepaths.less)
    .pipe($.plumber())
    .pipe($.less())
    .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
    .pipe(gulp.dest(config.output + 'styles'));
    // .on('error', function(e){
    //     logError(e);
    //     this.emit('end');
    // });
}));

gulp.task('fonts', gulp.series('clean-fonts', () => {
    return gulp.src(config.fontpaths)
    .pipe(gulp.dest(config.output + 'fonts'))
}));

gulp.task('images', gulp.series('clean-images', () => {
    return gulp.src(config.imagepaths)
    .pipe($.imagemin({optimizationLevel : 4}))
    .pipe(gulp.dest(config.output + 'images'))
}));


gulp.task('create', gulp.parallel('styles','fonts','images'));

gulp.task('clear', gulp.parallel(() => clean(config.output.slice(0,-1))));


gulp.task('watch', () => {
    gulp.watch(config.stylepaths.less, gulp.series('styles'));
});

gulp.task('wiredep', () => {
    return gulp.src(config.clientpath + 'index.html')
    .pipe(wiredep(config.getWiredepOptions()))
    .pipe($.inject(gulp.src(config.clientjspaths)))
    .pipe(gulp.dest(config.clientpath));
});

gulp.task('inject', gulp.series('styles', 'wiredep'), () => {
    return gulp.src(config.clientpath + 'index.html')
    .pipe($.inject(gulp.src(config.output + 'styles/styles.css')))
    .pipe(gulp.dest(config.clientpath));
});

gulp.task('serve-dev', gulp.series('analyze', () => {
    return $.nodemon(config.serverconfig)
    .on('restart', gulp.series('analyze', (ev) => {
        log('changes detected in ' + ev);
    }))
    .on('start',   () => {
        log('server starting');
        startSync();
    })
    .on('crash',   () => {
        log('server crashed');
    })
    .on('exit',    () => {
        log('server terminated');
    });
}));

gulp.task('default', gulp.series('create', 'serve-dev'));



//-----------------------------------------------------------------------



let startSync = () => {
    if(sync.active) return;

    log('Starting browser-sync.');

    sync({
        proxy          : 'localhost:' + 7203,
        port           : 3000,
        files          : [config.clientpath + '**/*.*'],
        ghostMode : {
            clicks   : true,
            forms    : true,
            location : false,
            scroll   : true
        },
        injectChanges  : true,
        logFileChanges : true,
        logLevel       : 'debug',
        logPrefix      : 'gulp -> ',
        notify         : true,
        reloadDelay    : 1000
    });
}

let logError = (e) => {
    log('------------------------- Error -------------------------');
    log(e);
    log('---------------------------------------------------------');
}

let log = (msg) => {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                // util.log(util.colors.cyan(msg[item]));
                $.util.log($.util.colors.magenta(msg[item]));
            }
        }
    } else {
        // util.log(util.colors.blue(msg));
        $.util.log($.util.colors.green(msg));
    }
}

let clean = (path) => {
    $.util.log($.util.colors.cyan('Cleaning: ' + path));
    return del(path);
}