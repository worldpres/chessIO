'use strict';

/**
 * Gulp (install globally also)
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('nodemon', (callback) => {
	var started = false;
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
		proxy: "http://localhost:3000", // express.js URL
		files: ["assets/**/*.*"], // all files to check from assets directory
		browser: "chromium-browser", // open browser
		port: 4000, // open port
	});
}));

gulp.task('default', gulp.parallel('browser-sync'));