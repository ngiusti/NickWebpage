const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const jsPath = ["libs/**/*.js", "js/**/*.js"];
const stylePath = ["libs/**/*.css", "styles/**/*.scss"];
const htmlPath = ["public/**/*.html"];
const distPath = "public/dist";

gulp.task("serve", ["js", "styles"], function() {
    browserSync.init({
        server: "public"
    });
    gulp.watch(stylePath, ["styles"]);
    gulp.watch(jsPath, ["_jsWatch"]);
    gulp.watch(htmlPath).on("change", browserSync.reload);
});

gulp.task("styles", function() {
    return gulp
        .src(stylePath)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(concat("dist.css"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(distPath))
        .pipe(browserSync.stream({ match: "**/*.css" }));
});

gulp.task("js", function() {
    return gulp
        .src(jsPath)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat("dist.js"))
        .pipe(
            babel({
                presets: ["@babel/preset-env"]
            })
        )
        // .on("error", swallowError)
        .pipe(uglify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(distPath));
});

gulp.task("build", ["js", "styles"]);

gulp.task("default", ["serve"]);

// Private task to make sure js finishes compiling before reloading.
gulp.task("_jsWatch", ["js"], function(done) {
    browserSync.reload();
    done();
});

function swallowError(error) {
    this.emit("end");
}
