
import { exec } from 'child_process';
import gulp, { parallel, series } from 'gulp';
import ts from 'gulp-typescript';
import fs from 'graceful-fs';
import { join } from 'path';

const PRODUCTION = process.env.PRODUCTION;
const BUILD_DIR = './build';

const projectConfig = PRODUCTION ? undefined : {
    "incremental": true,                   /* Enable incremental compilation */
    "composite": true,                     /* Enable project compilation */
    "tsBuildInfoFile": "./.tsbuildinfo",   /* Specify file to store incremental compilation information */
    "removeComments": false,               /* Do not emit comments to output. */
    "isolatedModules": true,               /* Transpile each file as a separate module (similar to 'ts.transpileModule'). */
    "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */
    // "watch": true,
    "declaration": true
};
 
var tsProject = ts.createProject('./tsconfig.json', projectConfig);

gulp.task('clean', (done) => {
    try {
        fs.rmSync(BUILD_DIR, { force: true, recursive: true });
    } catch(er) {
        if(er.code !== 'ENOENT') {
            done(er);
            return;
        }
    }
    
    fs.mkdirSync(BUILD_DIR, '777');
    done();
});

gulp.task('copy-client', () =>
    gulp.src('./client/**').pipe(gulp.dest(join(BUILD_DIR, 'client')))
);
 
gulp.task('transpile', function() {
    return gulp.src('src/*.ts')
        .pipe(tsProject())
        .pipe(gulp.dest(join(BUILD_DIR, 'lib')));
});
 
gulp.task('copy-pkg-json', () => {
    gulp.src('./package.json').pipe(gulp.dest(BUILD_DIR))
    gulp.src('./package-lock.json').pipe(gulp.dest(BUILD_DIR))
});

gulp.task('install-pkg', (done) => {
    const pkgInstall = exec(`npm install${ PRODUCTION ? ' --omit=dev' : '' }`, {
        cwd: BUILD_DIR
    }, (err, stdOut) => {
        // console.log("callback ::: " + stdOut);
        if (err) {
            done(err);
            pkgInstall.removeAllListeners('exit');
            console.error(err);
            process.exit(1);
        }
    });
    pkgInstall.on('exit', done);
    pkgInstall.stdout.pipe(process.stdout);
    pkgInstall.stderr.pipe(process.stderr);
});

gulp.task('build', series('clean', parallel('copy-client', 'transpile', 'copy-pkg-json'), 'install-pkg'));
gulp.task('watch', (done) => {
    gulp.watch('src/*.ts', parallel('transpile'));
    gulp.watch('./client/**/*', parallel('copy-client'));
    done();
});
gulp.task('default', series('build'));
