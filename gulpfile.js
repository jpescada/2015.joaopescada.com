//
// To build a new version:
// $ gulp build:dist
// $ gulp cdnify:dist
//
// To reuse an old tag:
// $ gulp cdnify:dist --versionTag "lasTagId"
//
'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({ lazy: false });
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var Hashids = require('hashids');
var argv = require('yargs').argv;

var paths = {
	bower: './bower_components',
	src: './src',
	dev: './dev',
	dist: './dist',
	images: '/assets/images',
	fonts: '/assets/fonts',
	scripts: '/assets/scripts',
	styles: '/assets/styles',
	api: '/api',
	includes: '/includes',
	articles: '/articles',
	overlays: '/overlays',
	works: '/works',
	feeds: '/feeds',
	errors: '/errors'
};

var bowerComponents = [
	paths.bower +'/modernizr/modernizr.js',
	paths.bower +'/jquery/dist/jquery.min.js'
];

var staticRootFiles = [
	paths.src +'/.htaccess',
	paths.src +'/sitemap.xml',
	paths.src +'/robots.txt',
	paths.src +'/humans.txt',
	paths.src +'/favicon.ico',
	paths.src +'/favicon.png',
	paths.src +'/joao-pescada-technologist.pdf'
];

var rssFeedFiles = [
	paths.src + paths.feeds +'/articles.rss'
];

var errorFiles = [
	paths.src + paths.errors +'/*.html'
];

var cdnHost = 'd14t8k4me298vf.cloudfront.net',
	cdnPath = 'https://'+ cdnHost +'/';

var fileIncludeContext = {
	cdnPath: cdnPath,
	cdnHost: cdnHost
};

var versionTag;

/*
 *
 * prepare js files
 *
 */
gulp.task('bower:dev', function(){

	return gulp.src(bowerComponents)
		.pipe( plugins.uglify() )
		.pipe( plugins.concat( 'libs.js', {newLine: ';\r\n'}) )
		.pipe( gulp.dest( paths.dev + paths.scripts ) );
});

gulp.task('bower:dist', function(){

	return gulp.src(bowerComponents)
		.pipe( plugins.uglify() )
		.pipe( plugins.concat( 'libs.js', {newLine: ';\r\n'}) )
		.pipe( gulp.dest( paths.dist + paths.scripts ) );
});


gulp.task('scripts:dev', function(){

	return gulp.src( paths.src + paths.scripts +'/**/*.js')
		.pipe( plugins.jshint('.jshintrc') )
		.pipe( plugins.jshint.reporter('default') )
		.pipe( plugins.concat( 'app.js', {newLine: ';\r\n'}) )
		.pipe( gulp.dest( paths.dev + paths.scripts ) );
});

gulp.task('scripts:dist', function(){

	return gulp.src( paths.src + paths.scripts +'/**/*.js')
		.pipe( plugins.jshint() )
		.pipe( plugins.jshint.reporter('default') )
		.pipe( plugins.uglify() )
		.pipe( plugins.concat( 'app.js', {newLine: ';\r\n'}) )
		.pipe( gulp.dest( paths.dist + paths.scripts ) );
});




/*
 *
 * prepare sass files
 *
 */
gulp.task('styles:dev', function(){

	return gulp.src( paths.src + paths.styles +'/**/*.scss')
		.pipe( plugins.sass({
			outputStyle: 'expanded'
		}).on('error', plugins.sass.logError))
		.pipe( plugins.autoprefixer() )
		.pipe( gulp.dest( paths.dev + paths.styles ) );
});

gulp.task('styles:dist', function(){

	return gulp.src( paths.src + paths.styles +'/**/*.scss')
		.pipe( plugins.sass({
			outputStyle: 'compressed'
		}).on('error', plugins.sass.logError))
		.pipe( plugins.autoprefixer() )
		.pipe( gulp.dest( paths.dist + paths.styles ) );
});




/*
 *
 * copy html in root
 *
 */
gulp.task('copyHtml:dev', function(){

	return gulp.src( paths.src +'/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dev ) );
});

gulp.task('copyHtml:dist', function(){

	return gulp.src( paths.src +'/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dist ) );
});





/*
 *
 * copy articles html
 *
 */
gulp.task('copyArticlesHtml:dev', function(){

	return gulp.src( paths.src + paths.articles + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dev + paths.articles ) );
});

gulp.task('copyArticlesHtml:dist', function(){

	return gulp.src( paths.src + paths.articles + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dist + paths.articles ) );
});




/*
 *
 * copy overlays html
 *
 */
gulp.task('copyOverlaysHtml:dev', function(){

	return gulp.src( paths.src + paths.overlays + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file'
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dev + paths.overlays ) );
});

gulp.task('copyOverlaysHtml:dist', function(){

	return gulp.src( paths.src + paths.overlays + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file'
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dist + paths.overlays ) );
});




/*
 *
 * copy works html
 *
 */
gulp.task('copyWorksHtml:dev', function(){

	return gulp.src( paths.src + paths.works + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dev + paths.works ) );
});

gulp.task('copyWorksHtml:dist', function(){

	return gulp.src( paths.src + paths.works + '/*.html' )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )

		.pipe( gulp.dest( paths.dist + paths.works ) );
});





/*
 *
 * copy images
 *
 */
gulp.task('copyImages:dev', function(){

	gulp.src( paths.src + paths.images +'/**/*' )
		.pipe( gulp.dest( paths.dev + paths.images) );
});

gulp.task('copyImages:dist', function(){

	gulp.src( paths.src + paths.images +'/**/*' )
		.pipe( gulp.dest( paths.dist + paths.images) );
});




/*
 *
 * copy fonts
 *
 */
gulp.task('copyFonts:dev', function(){

	gulp.src( paths.src + paths.fonts +'/**/*' )
		.pipe( gulp.dest( paths.dev + paths.fonts) );
});

gulp.task('copyFonts:dist', function(){

	gulp.src( paths.src + paths.fonts +'/**/*' )
		.pipe( gulp.dest( paths.dist + paths.fonts) );
});




/*
 *
 * copy static root files
 *
 */
gulp.task('copyStaticRootFiles:dev', function(){

	// copy statics from root
	gulp.src( staticRootFiles )
		.pipe( gulp.dest( paths.dev ) );
});

gulp.task('copyStaticRootFiles:dist', function(){

	// copy statics from root
	gulp.src( staticRootFiles )
		.pipe( gulp.dest( paths.dist ) );
});




/*
 *
 * copy Api files
 *
 */
gulp.task('copyApiFiles:dev', function(){

	// copy Api files from root
	gulp.src( paths.src + paths.api + '/*.json' )
		.pipe( plugins.jsonminify() )
		.pipe( gulp.dest( paths.dev + paths.api ) );

	gulp.src( paths.src + paths.api + '/*.php' )
		.pipe( gulp.dest( paths.dev + paths.api ) );
});

gulp.task('copyApiFiles:dist', function(){

	// copy Api files from root
	gulp.src( paths.src + paths.api + '/*.json' )
		.pipe( plugins.jsonminify() )
		.pipe( gulp.dest( paths.dist + paths.api ) );

	gulp.src( paths.src + paths.api + '/*.php' )
		.pipe( gulp.dest( paths.dist + paths.api ) );
});



/*
 *
 * copy Error files
 *
 */
gulp.task('copyErrorFiles:dev', function(){

	// copy Error files from root
	gulp.src( errorFiles )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )
		.pipe( gulp.dest( paths.dev + paths.errors ) );

	gulp.src( paths.src + paths.styles +'/http-errors.css')
		.pipe( gulp.dest( paths.dev + paths.styles ) );
});

gulp.task('copyErrorFiles:dist', function(){

	// copy Error files from root
	gulp.src( errorFiles )

		.pipe( plugins.fileInclude({
			prefix: '@@',
			basepath: '@file',
			context: fileIncludeContext
		}).on('error', function(e){ console.log('@ fileInclude error:', e.toString()); this.emit('end'); }) )

		.pipe( plugins.htmlmin({
			removeComments: true,
			collapseWhitespace: true
		}) )
		.pipe( gulp.dest( paths.dist + paths.errors ) );

	gulp.src( paths.src + paths.styles +'/http-errors.css')
		.pipe( gulp.dest( paths.dist + paths.styles ) );
});



/*
 *
 * copy Inflow app
 *
 */
gulp.task('copyInflowApp:dev', function(){

	// copy statics from /inflow
	gulp.src( [paths.src +'/inflow/**/*', paths.src +'/inflow/**/.*'] )
		.pipe( gulp.dest( paths.dev +'/inflow' ) );
});

gulp.task('copyInflowApp:dist', function(){

	// copy statics from /inflow
	gulp.src( [paths.src +'/inflow/**/*', paths.src +'/inflow/**/.*'] )
		.pipe( gulp.dest( paths.dist +'/inflow' ) );
});




/*
 *
 * copy RSS Feed files
 *
 */
gulp.task('copyRssFeedFiles:dist', function(){

	// copy RSS Feed files from root
	gulp.src( rssFeedFiles )
		.pipe( gulp.dest( paths.dist + paths.feeds ) );
});



/*
 *
 * watch for file changes
 *
 */
gulp.task('watch:dev', function(){
	gulp.watch( paths.src + paths.scripts +'/**/*.js', ['bower:dev', 'scripts:dev']);
	gulp.watch( paths.src + paths.styles +'/**/*.scss', ['styles:dev']);
	gulp.watch( paths.src + paths.images +'/**/*', ['copyImages:dev']);
	gulp.watch( [ paths.src +'/*.html', paths.src + paths.includes +'/*.html' ], ['copyHtml:dev']);
	gulp.watch( paths.src + paths.articles +'/*.html', ['copyArticlesHtml:dev']);
	gulp.watch( paths.src + paths.overlays +'/*.html', ['copyOverlaysHtml:dev']);
	gulp.watch( [paths.src + paths.errors +'/*.html', paths.src + paths.styles +'/http-errors.css'], ['copyErrorFiles:dev']);
	gulp.watch( paths.src + paths.works +'/*.html', ['copyWorksHtml:dev']);
});

gulp.task('watch:dist', function(){
	gulp.watch( paths.src + paths.scripts +'/**/*.js', ['bower:dist', 'scripts:dist']);
	gulp.watch( paths.src + paths.styles +'/**/*.scss', ['styles:dist']);
	gulp.watch( paths.src + paths.images +'/**/*', ['copyImages:dist']);
	gulp.watch( [ paths.src +'/*.html', paths.src + paths.includes +'/*.html' ], ['copyHtml:dist']);
	gulp.watch( paths.src + paths.articles +'/*.html', ['copyArticlesHtml:dist']);
	gulp.watch( paths.src + paths.overlays +'/*.html', ['copyOverlaysHtml:dist']);
	gulp.watch( [paths.src + paths.errors +'/*.html', paths.src + paths.styles +'/http-errors.css'], ['copyErrorFiles:dist']);
	gulp.watch( paths.src + paths.works +'/*.html', ['copyWorksHtml:dist']);
});



/*
 *
 * start localhost + syncronised browser testing
 *
 */
gulp.task('browserSync:dev', function(){

	// watch for changes on dev files
	browserSync.init( paths.dev +'/**/*', {
		server: paths.dev,
		port: 8000
	});
});

gulp.task('browserSync:dist', function(){

	// watch for changes on dist files
	browserSync.init( paths.dist +'/**/*', {
		server: paths.dist,
		port: 8000
	});
});



/*
 *
 * Replace /assets refs to CDN version
 * Then Hash and gzip .js and .css files
 *
 */
 gulp.task('cdnify:dist', function(){

 	// use as: gulp cdnify:dist --versionTag "lasTagId"
 	if (argv.versionTag) {
 		versionTag = argv.versionTag;
 	}
 	else {
		var hashids = new Hashids('this is my salt', 5);
		versionTag = hashids.encode( new Date().getMilliseconds() );
 	}


 	gulp.src( paths.dist + paths.scripts + '/*.js')
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( plugins.rename({suffix:'.'+ versionTag }) )
 		.pipe( plugins.gzip({append: false }) )
 		.pipe( gulp.dest( paths.dist + paths.scripts ) );

 	gulp.src( paths.dist + paths.styles + '/*.css')
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( plugins.rename({suffix:'.'+ versionTag }) )
 		.pipe( plugins.gzip({append: false }) )
 		.pipe( gulp.dest( paths.dist + paths.styles ) );

 	gulp.src( paths.dist +'/*.html')
 		.pipe( plugins.replace('/styles/app.css', '/styles/app.'+ versionTag +'.css') )
 		.pipe( plugins.replace('/scripts/app.js', '/scripts/app.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/scripts/libs.js', '/scripts/libs.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( gulp.dest( paths.dist ) );

 	gulp.src( paths.dist + paths.articles +'/*.html')
 		.pipe( plugins.replace('/styles/app.css', '/styles/app.'+ versionTag +'.css') )
 		.pipe( plugins.replace('/scripts/app.js', '/scripts/app.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/scripts/libs.js', '/scripts/libs.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( gulp.dest( paths.dist + paths.articles ) );

 	gulp.src( paths.dist + paths.overlays +'/*.html')
 		.pipe( plugins.replace('/styles/app.css', '/styles/app.'+ versionTag +'.css') )
 		.pipe( plugins.replace('/scripts/app.js', '/scripts/app.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/scripts/libs.js', '/scripts/libs.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( gulp.dest( paths.dist + paths.overlays ) );

 	gulp.src( paths.dist + paths.works +'/*.html')
 		.pipe( plugins.replace('/app.css', '/app.'+ versionTag +'.css') )
 		.pipe( plugins.replace('/scripts/app.js', '/scripts/app.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/scripts/libs.js', '/scripts/libs.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( gulp.dest( paths.dist + paths.works ) );

 	gulp.src( paths.dist + paths.styles +'/http-errors.css')
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( plugins.rename({suffix:'.'+ versionTag }) )
 		.pipe( plugins.gzip({append: false }) )
 		.pipe( gulp.dest( paths.dist + paths.styles ) );

 	gulp.src( paths.dist + paths.errors +'/*.html')
 		.pipe( plugins.replace('/styles/http-errors.css', '/styles/http-errors.'+ versionTag +'.css') )
 		.pipe( plugins.replace('/scripts/app.js', '/scripts/app.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/scripts/libs.js', '/scripts/libs.'+ versionTag +'.js') )
 		.pipe( plugins.replace('/assets/', cdnPath) )
 		.pipe( gulp.dest( paths.dist + paths.errors ) );
 });



 /*
 *
 * Remove '.html' from <a> hrefs
 *
 */
 gulp.task('friendlyURLs:dist', function(){

 	gulp.src( paths.dist +'/*.html')
 		.pipe( plugins.replace(/href="\/([\/a-z\-_0-9]+)\.html([#a-z\-_0-9]*)"/ig, 'href=\"\/$1$2\"') )
 		.pipe( plugins.replace(/href="\/([\/a-z\-_0-9]+)([\-]{1})(start)"/ig, 'href=\"\/$1/$3\"') )
 		.pipe( gulp.dest( paths.dist ) );

 	gulp.src( paths.dist + paths.articles +'/*.html')
 		.pipe( plugins.replace(/href="\/([\/a-z\-_0-9]+)\.html([#a-z\-_0-9]*)"/ig, 'href=\"\/$1$2\"') )
 		.pipe( gulp.dest( paths.dist + paths.articles ) );

 	gulp.src( paths.dist + paths.overlays +'/*.html')
 		.pipe( plugins.replace(/href="\/([\/a-z\-_0-9]+)\.html([#a-z\-_0-9]*)"/ig, 'href=\"\/$1$2\"') )
 		.pipe( gulp.dest( paths.dist + paths.overlays ) );

 	gulp.src( paths.dist + paths.works +'/*.html')
 		.pipe( plugins.replace(/href="\/([\/a-z\-_0-9]+)\.html([#a-z\-_0-9]*)"/ig, 'href=\"\/$1$2\"') )
 		.pipe( gulp.dest( paths.dist + paths.works ) );
 });



/*
 *
 * create sets of tasks
 *
 */
gulp.task('build:dev', function(){

	return gulp.start([
		'bower:dev',
		'scripts:dev',
		'styles:dev',
		'copyImages:dev',
		'copyFonts:dev',
		'copyHtml:dev',
		'copyArticlesHtml:dev',
		'copyOverlaysHtml:dev',
		'copyWorksHtml:dev',
		'copyStaticRootFiles:dev',
		'copyErrorFiles:dev',
		'copyApiFiles:dev'
	]);
});

gulp.task('build:dist', function(){

	return runSequence(
		'bower:dist',
		'scripts:dist',
		'styles:dist',
		'copyImages:dist',
		'copyFonts:dist',
		'copyHtml:dist',
		'copyArticlesHtml:dist',
		'copyOverlaysHtml:dist',
		'copyWorksHtml:dist',
		'copyStaticRootFiles:dist',
		'copyErrorFiles:dist',
		'copyApiFiles:dist',
		'copyRssFeedFiles:dist',
		'copyInflowApp:dist',
		function(){
			return runSequence(
				'friendlyURLs:dist'
			);
		}
	);
});

// gulp.task('build:dist:cdn', function(){

// 	return runSequence(
// 		'bower:dist',
// 		'scripts:dist',
// 		'styles:dist',
// 		'copyImages:dist',
// 		'copyFonts:dist',
// 		'copyHtml:dist',
// 		'copyArticlesHtml:dist',
// 		'copyOverlaysHtml:dist',
// 		'copyWorksHtml:dist',
// 		'copyStaticRootFiles:dist',
// 		'copyErrorFiles:dist',
// 		'copyApiFiles:dist',
// 		'copyRssFeedFiles:dist',
// 		'copyInflowApp:dist',
// 		function(){
// 			return runSequence(
// 				'friendlyURLs:dist',
// 				function(){
// 					return runSequence('cdnify:dist');
// 				}
// 			);
// 		}
// 	);

// });

gulp.task('serve:dev', function(){

	return gulp.start([
		'bower:dev',
		'scripts:dev',
		'styles:dev',
		'copyImages:dev',
		'copyFonts:dev',
		'copyHtml:dev',
		'copyArticlesHtml:dev',
		'copyOverlaysHtml:dev',
		'copyWorksHtml:dev',
		'copyStaticRootFiles:dev',
		'copyErrorFiles:dev',
		'copyApiFiles:dev',
		'browserSync:dev',
 		'watch:dev'
	]);
});

gulp.task('serve:dist', function(){

	return gulp.start([
		'bower:dist',
		'scripts:dist',
		'styles:dist',
		'copyImages:dist',
		'copyFonts:dist',
		'copyHtml:dist',
		'copyArticlesHtml:dist',
		'copyOverlaysHtml:dist',
		'copyWorksHtml:dist',
		'copyStaticRootFiles:dist',
		'copyErrorFiles:dist',
		'copyApiFiles:dist',
		'copyRssFeedFiles:dist',
		'browserSync:dist'
	]);
});


gulp.task('default', ['serve:dev']);


