const { stream } = require('browser-sync');

/*переменные для массива объектов с путями*/
let project_folder = "dist";
let source_folder = "#src";

/*file system*/
let fs = require('fs');

/*
 
 ___  ____ ___ _  _ ____ 
 |__] |__|  |  |__| [__  
 |    |  |  |  |  | ___] 
                         
 
*/

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    pswpDefaultSkin: project_folder + "/img/default-skin/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
    pswpDefaultSkin: source_folder + "/plugins/photoSwipe/default-skin/*.+(png|jpg|gif|ico|svg|webp)",
    fonts: source_folder + "/fonts/*.{ttf, TTF}",
  },
  watch: { //какие файлы слушаем для сихронизации с browsersync
    html: source_folder + "/**/*.html",
    css: source_folder + "/**/*.scss",
    js: source_folder + "/**/*.js",
    img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
  },
  clean: "./" + project_folder + "/" //путь для удаления папки dist, чтобы каждый раз перед прогоном бандла функций галпа удалять ненужные файлы
}

/*объявляем зависимости через переменные для дальнейших манипуляций с ними*/
/*
 
 ___  ____ ___  ____ _  _ ___  ____ _  _ ____ _ ____ ____ 
 |  \ |___ |__] |___ |\ | |  \ |___ |\ | |    | |___ [__  
 |__/ |___ |    |___ | \| |__/ |___ | \| |___ | |___ ___] 
                                                          
 
*/

let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  fileinclude = require('gulp-file-include'),
  del = require('del'),
  scss = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  group_media = require('gulp-group-css-media-queries'),//собирает, группирует и выносит медиазапросы в конец файла
  clean_css = require('gulp-clean-css'),//чистит и сжимает css файл на выходе
  rename = require('gulp-rename'),//нужен для выхлопа сжатого и обычного чистого css в дисте
  uglify = require('gulp-uglify-es').default,
  imagemin = require('gulp-imagemin'),//сжатие картинок без потерь
  webp = require('gulp-webp'),
  /*лучше вручную интегрировать webp в разметку и стили*/
  //webp_html = require('gulp-webp-html'),//интеграция сконвертированной пикчи.webp в разметку с фоллбеком для старья
  //webp_css = require('gulp-webpcss'),//интеграция сконвертированной пикчи.webp в стили для background'ов
  svg_sprite = require('gulp-svg-sprite'),
  /*конвертеры шрифтов*/
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  babel = require('gulp-babel');

/*
 
 ____ _  _ _  _ ____ ___ _ ____ _  _ ____ 
 |___ |  | |\ | |     |  | |  | |\ | [__  
 |    |__| | \| |___  |  | |__| | \| ___] 
                                          
 
*/

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

/*
 
 _  _ ___ _  _ _    
 |__|  |  |\/| |    
 |  |  |  |  | |___ 
                    
 
*/

function html() { //функция для работы с хтмл файлами. собирает все в один, кидает его в дист и потом слушает и транслирует в браузер
  return src(path.src.html)
    .pipe(fileinclude()) //склеивает html файлы в один. альтернатива пагу(шаблонизатор)
    // .pipe(webp_html())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

/*
 
 ____ ____ ____ 
 |    [__  [__  
 |___ ___] ___] 
                
 
*/

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe(
      group_media()
    )
    .pipe(
      autoprefixer({
        flexbox: "no-2009",
        overrideBrowserslist: ["last 2 versions"],
        cascade: true
      })
    )
    // .pipe(webp_css())
    .pipe(dest(path.build.css))//выхлоп несжатого css без чистки и оптимизации медиазапросов
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(dest(path.build.css))//выхлоп сжатого на проду
    .pipe(browsersync.stream())
}

/*
 
  _ ____ _  _ ____ ____ ____ ____ _ ___  ___ 
  | |__| |  | |__| [__  |    |__/ | |__]  |  
 _| |  |  \/  |  | ___] |___ |  \ | |     |  
                                             
 
*/

function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(babel({
      "presets": [
        [ "@babel/preset-env", {
          "targets": {
            "browsers": [ "last 2 versions", "ie >= 10" ]
          }
        }]
      ]    
    }))
    .pipe(dest(path.build.js))
    .pipe(
      uglify()
    )
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

/*
 
 _ _  _ ____ ____ ____ ____ 
 | |\/| |__| | __ |___ [__  
 | |  | |  | |__] |___ ___] 
                            
 
*/

function images() {
  src(path.src.pswpDefaultSkin)
    .pipe(dest(path.build.pswpDefaultSkin))
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        interlaced: true,
        optimizationLevel: 3 // от 0 до 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

/*
 
 ____ ____ _  _ ___    ____ ____ _  _ _  _ ____ ____ ___ ____ ____ 
 |___ |  | |\ |  |     |    |  | |\ | |  | |___ |__/  |  |___ |__/ 
 |    |__| | \|  |     |___ |__| | \|  \/  |___ |  \  |  |___ |  \ 
                                                                   
 
*/

function fonts(params) {
  src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
}

function cb() {}

/*
 
 _    _ ____ ___ ____ _  _ ____ ____    
 |    | [__   |  |___ |\ | |___ |__/   
 |___ | ___]  |  |___ | \| |___ |  \ 
                                                         
 
*/

function watchFiles(params) {
  gulp.watch([path.watch.html],html);
  gulp.watch([path.watch.css],css);
  gulp.watch([path.watch.js],js);
  gulp.watch([path.watch.img],images)
}

/*
 
 ____ ___  ____ _ ___ ____    _  _ ____ _  _ ____ ____ 
 [__  |__] |__/ |  |  |___    |\/| |__| |_/  |___ |__/ 
 ___] |    |  \ |  |  |___    |  | |  | | \_ |___ |  \ 
                                                       
 
*/
// to run: gulp makeSprite

gulp.task('makeSprite', function() {
  return gulp.src([source_folder + '/iconsprite/*.svg'])
    .pipe(svg_sprite({
      mode: {
        stack: {
          sprite: '../icons/sprite.svg', //имя файла спрайта
          example: false
        }
      }
    }))
    .pipe(dest(path.build.img))
})

//функция для удаления папки dist целиком перед серией выполняемых фукций
function clean(params) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, fonts));/*закрываю в параллель для одновременного выполнения функции обработки ключевых файлов*/
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.html = html;
exports.css = css;
exports.js = js;
exports.build = build;
exports.watch = watch;
exports.default = watch;