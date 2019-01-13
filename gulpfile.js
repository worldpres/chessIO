'use strict';

/**
 * Gulp (install globally also)
 */

let gulp = require('gulp');
let browserSync = require('browser-sync');
let nodemon = require('gulp-nodemon');
let sass = require('gulp-sass');

let cfg = {
	scssin: 'assets/scss/**/*.scss',
	scssout: 'assets/css/',
}

gulp.task('sass', () => {
	return gulp.src(cfg.scssin)
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest(cfg.scssout));
});

gulp.watch(cfg.scssin, gulp.parallel('sass'));

gulp.task('nodemon', (callback) => {
	let started = false;
	return nodemon({
		script: 'server.js' // server filename
	}).on('start', () => {
		if (!started) {
			callback();
			started = true;
		}
	});
});

gulp.task('browser-sync', gulp.parallel('nodemon', () => {
	browserSync.init(null, {
		proxy: {
			target: 'http://localhost:3000', // express.js URL
			ws: true
		},
		files: ['assets/**/*.*'], // all files to check from assets directory
		// browser: 'chromium-browser', // open browser
		browser: 'firefox', // open browser
		port: 4000, // open port
	});
}));


gulp.task('default', gulp.parallel('browser-sync'));