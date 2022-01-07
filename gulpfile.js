const { src, dest, watch, parallel } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer'); //se asegura de que funcione en el navegador q le digamos
const cssnano = require('cssnano'); //comprime nuestro codigo de css
const postcss = require('gulp-postcss'); //para mejorar el codigo de css
const sourcemaps = require('gulp-sourcemaps'); //para poder encontrar elementos del codigo comprimido

//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js'); //para comprimir el codigo de js

function css(done) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar (gracias a los asteriscos, identifica a todos los archivos de la carpeta scss con la extension scss)
        .pipe(sourcemaps.init())
        .pipe(plumber())    
        .pipe(sass())  // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
            .pipe(dest('build/css')) // Almacenarla en el disco duro
    done();
}

function imagenes(done) { // Aligerar imagenes JPG y PNG
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp(done) { // Convertir imagenes a WEBP
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
    .pipe(webp(opciones))
    .pipe(dest('build/img'))
    done();
}

function versionAvif(done) { // Convertir imagenes a AVIF
    const opciones = {
        quality: 50
    }
    src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones))
    .pipe(dest('build/img'))
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done();
}

function dev(done) { 
    watch('src/scss/**/*.scss', css); 
    watch('src/js/**/*.js', javascript); 
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);

