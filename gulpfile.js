var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');//CSSコンパイラ
var autoprefixer = require("gulp-autoprefixer");//CSSにベンダープレフィックスを付与してくれる
var uglify = require("gulp-uglify");//JavaScriptファイルの圧縮ツール
var concat = require('gulp-concat');//ファイルの結合ツール
var plumber = require("gulp-plumber");//コンパイルエラーが起きても watch を抜けないようになる
var rename = require("gulp-rename");//ファイル名の置き換えを行う
var twig = require("gulp-twig");//Twigテンプレートエンジン
var browserify = require("gulp-browserify");//NodeJSのコードをブラウザ向けコードに変換
var packageJson = require(__dirname+'/package.json');
var _tasks = [
	'.html',
	'.html.twig',
	'.css',
	'.css.scss',
	'main.js',
	'.js',
	'biflora-frontend'
];


// src 中の *.css.scss を処理
gulp.task('.css.scss', function(){
	gulp.src("tests/src/**/*.css.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// src 中の *.css を処理
gulp.task('.css', function(){
	gulp.src("tests/src/**/*.css")
		.pipe(plumber())
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// main.js (frontend) を処理
gulp.task("main.js", function() {
	gulp.src(["tests/src/common/main.js"])
		.pipe(browserify({
		}))
		.pipe(plumber())
		.pipe(concat('common/main.js'))
		// .pipe(uglify())
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// *.js を処理
gulp.task(".js", function() {
	gulp.src(["tests/src/**/*.js", "!tests/src/common/**/*"])
		.pipe(plumber())
		// .pipe(uglify())
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// *.html を処理
gulp.task(".html", function() {
	gulp.src(["tests/src/**/*.html", "tests/src/**/*.htm"])
		.pipe(plumber())
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// *.html.twig を処理
gulp.task(".html.twig", function() {
	gulp.src(["tests/src/**/*.html.twig"])
		.pipe(plumber())
		.pipe(twig({
			data: {packageJson: packageJson}
		}))
		.pipe(rename({extname: ''}))
		.pipe(gulp.dest( './tests/htdocs/' ))
	;
});

// biflora.js (frontend) を処理
gulp.task("biflora-frontend", function() {
	gulp.src(["src/biflora/biflora.js"])
		.pipe(browserify({
		}))
		.pipe(plumber())
		.pipe(concat('biflora/biflora.js'))
		.pipe(uglify())
		.pipe(gulp.dest( path.resolve(__dirname, './frontend/') ))
	;
});

// src 中のすべての拡張子を監視して処理
gulp.task("watch", function() {
	gulp.watch(["lib/**/*","src/**/*","tests/src/**/*"], _tasks);

	var svrCtrl = require('./tests/backendJs/serverCtrl.js');
	svrCtrl.boot(function(){
		require('child_process').spawn('open',[svrCtrl.getUrl()]);
	});

});

// src 中のすべての拡張子を処理(default)
gulp.task("default", _tasks);
