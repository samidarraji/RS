const {src, dest , watch, series} = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const jsonminify = require('gulp-jsonminify');

async function cssFile(){
    return src('./dev/sass/styles.scss') // This is the source file we need to do task on it.
    .pipe(sass({outputStyle:'compressed'}))    // Return an css code nested(we can make it compressed).
    .pipe(rename('dist.styles.css'))          // Rename the file.
    .pipe(dest('dist/css/'))          // Create the new css file inside dist folder => dist/css/dist.main.css
}

async function jsFile(){
    return src('./dev/js/*.js') // *.js => mean all js files(all files with ext .js).
    .pipe(concat('main.js'))    // Concatenate all js files inside one file 'main.js'.
    .pipe(uglify())             // Uglify => will minify the main.js file (make it compressed) .
    .pipe(dest('./dist/js/'))   // Create the new js file inside dist folder => dist/js/main.js         
}

async function postsJsonFile() {
    return src('./dev/js/posts.json')  // Sélectionne tous les fichiers JSON dans le dossier dev/json.
       //.pipe(jsonminify())          // Minifie les fichiers JSON.
        .pipe(dest('./dist/js/')) // Sauvegarde les fichiers minifiés dans le dossier dist/json.
}

async function usersJsonFile() {
    return src('./dev/js/users.json')  // Sélectionne tous les fichiers JSON dans le dossier dev/json.
       //.pipe(jsonminify())          // Minifie les fichiers JSON.
        .pipe(dest('./dist/js/')) // Sauvegarde les fichiers minifiés dans le dossier dist/json.
}

async function commentsJsonFile() {
    return src('./dev/js/comments.json')  // Sélectionne tous les fichiers JSON dans le dossier dev/json.
       //.pipe(jsonminify())          // Minifie les fichiers JSON.
        .pipe(dest('./dist/js/')) // Sauvegarde les fichiers minifiés dans le dossier dist/json.
}

function watcher() {
    watch('dev/sass/**/*.scss', cssFile);
    watch('dev/js/*.js', jsFile);
    watch('dev/js/*.json', postsJsonFile);
    watch('dev/js/*.json', usersJsonFile);
    watch('dev/js/*.json', commentsJsonFile);
}
/*
module.exports = {
    watch: watcher
}
*/
module.exports = {
    cssFile,
    jsFile,
    postsJsonFile,
    usersJsonFile,
    commentsJsonFile,
    watcher
};
