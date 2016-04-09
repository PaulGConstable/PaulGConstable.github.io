var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css'),
	plumber = require('gulp-plumber'),
	imagemin = require('gulp-imagemin'),
	inline = require('gulp-inline'),
	minifyHTML = require('gulp-minify-html'),
	pngquant = require('imagemin-pngquant'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	imageminWebp = require('imagemin-webp');

// Paths to various files
var paths = {
    scripts: ['src/js/*.js', 'src/js/libs/*.js'],
    styles: ['src/css/*.css'],
    images: ['src/img/*'],
    content: ['src/index.html']
};

/* Minifies our JS files and outputs them to dist folder */
gulp.task('scripts', function(){
	/* Look for any file that has javascript & css in filename*/
	gulp.src(paths.scripts)
		/* still run watch task even if error in code */
		.pipe(plumber())
		/* minify the file */
		.pipe(uglify())
		/* rename the file & add .min */
		.pipe(rename(function (path) {
			path.basename += '.min';
		}))
		.pipe(plumber.stop())
		/* save destination for minified file */
		.pipe(gulp.dest('dist/js/'));
});

/* Minifies our HTML files and adds them to dist */
gulp.task('content', function() {
	return gulp.src(paths.content)
    	.pipe(inline({
    	base: paths.content,
    	js: uglify,
    	css: minifyCSS,
    	disabledTypes: ['svg', 'img'],
    	ignore: ['js/libs/knockout-3.4.0.js','js/libs/jquery-1.12.1.min.js','https://maps.googleapis.com/maps/api/js?key=AIzaSyAUM4HyJsHOv2ZZZSX8PLv9CPhcaVIQKTs&libraries=geometry&amp']
        }))
        .pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('dist/'));
});

/* Minifies CSS files */
gulp.task('styles', function (){
	gulp.src(paths.styles)
		.pipe(minifyCSS())
		.pipe(gulp.dest('dist/css/'));

});

/* Optimizes our portfolio image files and adds to dist*/
gulp.task('images', function() {
    return gulp.src(paths.images)
 		.pipe(imagemin({
 			progressive: false,
			optimizationLevel: 5,
			use: [pngquant({quality: '65-80', speed: 6})],
			use: [imageminWebp({quality: 75})]
		}))
		.pipe(gulp.dest('dist/img/'));      
});

/* Run gulp tasks in background when changes are made to file */
gulp.task('watch', function(){
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.content, ['content']);
});

gulp.task('default', ['scripts', 'styles', 
	'content', 'images', 'watch']);