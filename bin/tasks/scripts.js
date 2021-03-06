const gulp      = require('gulp'),
    babelify    = require('babelify'),
    browserify  = require('browserify'),
    flog        = require('fancy-log'),
    stringify   = require('stringify'),
    source      = require('vinyl-source-stream'),
    config      = require('../config'),
    gulpPlugins = require('../utils/gulpPlugins'),
    { handleError, noop, reload } = require('../utils/utils');

const scripts = (done) => {
    flog.info('compile scripts');

    return browserify(config.scripts.mainSrc,
        {
            debug: global.env.environment !== 'production'
        })
        .transform(babelify)
        .transform(stringify, {
            appliesTo: {includeExtensions: ['.html']},
            minify: true,
            minifyOptions: {
                // KockoutJS needs html comments!
                removeComments: false
            }
        })
        .bundle().on('error', (error) => {
            handleError(error, done);
        })
        .pipe(source('neo-bundle.js'))
        .pipe(global.env.environment === 'production' ? gulpPlugins.buffer() : noop())
        .pipe(global.env.environment === 'production' ? gulpPlugins.uglify() : noop())
        .pipe(gulp.dest(config.scripts.dest))
        .pipe(reload());
};

module.exports = scripts;
