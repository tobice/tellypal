module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            debug: {
                options: {
                    debug: true,
                    transform: ['reactify'],
                    watch: true
                },
                files: {
                    'public/scripts.js': 'src/client.js'
                }
            },
            build: {
                options: {
                    debug: false,
                    transform: [
                        'reactify',
                        ['uglifyify', { global: true }]]
                },
                files: {
                    'public/scripts.js': 'src/client.js'
                }
            }
        },

        less: {
            options: {
                paths: ['node_modules', 'node_modules/bootstrap/less']
            },
            debug: {
                files: {
                    'public/styles.css': 'assets/stylesheets/index.less'
                }
            },
            build: {
                options: { cleancss: true},
                files: {
                    'public/styles.css': 'assets/stylesheets/index.less'
                }
            }
        },

        copy: {
            all: {
                files: [{
                    expand: true,
                        cwd: 'node_modules/font-awesome/fonts/',
                        src: '**',
                        dest: 'public/fonts/'
                    }, {
                        expand: true,
                        cwd: 'assets/images/',
                        src: '**',
                        dest: 'public/images/'
                    }
                ]
            }
        },

        nodemon: {
            all: {
                script: 'index.js',
                options: {
                    ext: 'js,jsx',
                    ignore: ['node_modules/**', 'public/scripts.js'],
                    env: {
                        DEBUG: 'ws'
                    }
                }
            }
        },

        watch: {
            styles: {
                files: 'assets/stylesheets/**/*',
                tasks: ['less:debug'],
                options: { interrupt: true }
            }
        },

        concurrent: {
            main: {
                tasks: ['nodemon', 'watch'],
                options: { logConcurrentOutput: true }
            }
        }

    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('devel', ['browserify:debug', 'less:debug', 'copy', 'concurrent']);
    grunt.registerTask('build', ['browserify:build', 'less:build', 'copy']);
};
