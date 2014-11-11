module.exports = function(grunt) {
	// Load all tasks
	require('load-grunt-tasks')(grunt);
	// Show elapsed time
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			{ %= js_safe_name %
			}: {
				src: [
					'assets/js/src/{%= js_safe_name %}.js'
				],
				dest: 'assets/js/{%= js_safe_name %}.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				globals: {
					exports: true,
					module: false,
					require: false
				}
			}
		},
		uglify: {
			all: {
				files: {
					'assets/js/{%= js_safe_name %}.min.js': ['assets/js/{%= js_safe_name %}.js']
				},
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
						' * <%= pkg.homepage %>\n' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},
		test: {
			files: ['assets/js/test/**/*.js']
		},
		sass: {
			options: {
				includePaths: [
					'bower_components/bourbon/dist'
				]
			},
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'assets/css/{%= js_safe_name %}.css': 'assets/sass/{%= js_safe_name %}.scss'
				}
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android 2.3', 'android 4', 'opera 12']
			},
			dev: {
				options: {
					map: {
						prev: 'assets/css/'
					}
				},
				src: 'assets/css/{%= js_safe_name %}.css'
			}
		},
		csscomb: {
			options: {
				config: '.csscomb.json'
			},
			files: {
				'assets/css/{%= js_safe_name %}.css': ['assets/css/{%= js_safe_name %}.css'],
			}
		},
		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			minify: {
				expand: true,
				cwd: 'assets/css/',
				src: ['{%= js_safe_name %}.css'],
				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		imagemin: {
			dist: {
				files: [{
					progressive: true,
					expand: true,
					cwd: 'assets/img/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'assets/img/'
				}]
			}
		},
		// https://www.npmjs.org/package/grunt-wp-i18n
		makepot: {
			target: {
				options: {
					domainPath: '/languages/',
					potFilename: '{%= js_safe_name %}.pot',
					type: 'wp-plugin'
				}
			}
		},
		watch: {
			sass: {
				files: ['assets/css/sass/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					debounceDelay: 500
				}
			}
		},
		clean: {
			main: [
        'assets/css/*.{css,map}',
        'release'
      ]
		},
		copy: {
			// Copy the plugin to a versioned release directory
			main: {
				src: [
					'**',
          '!bower_components/**',
          '!bower.json',
          '!node_modules/**',
          '!release/**',
          '!.git/**',
          '!.sass-cache/**',
          '!assets/img/src/**',
          '!assets/sass/**',
          '!assets/js/src/**',
          '!assets/img/src/**',
          '!Gruntfile.js',
          '!package.json',
          '!.gitignore',
          '!.gitmodules'
				],
				dest: 'release/<%= pkg.version %>/'
			}
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/{%= js_safe_name %}.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: '{%= js_safe_name %}/'
			}
		},
		devUpdate: {
			main: {
				options: {
					updateType: 'report',
					reportUpdated: false,
					semver: true,
					packages: {
						devDependencies: true,
						dependencies: false
					}
				}
			}
		},
		notify: {
			stylesheets: {
				options: {
					title: 'Grunt, grunt!',
					message: 'Sass is Sassy'
				}
			},
			scripts: {
				options: {
					title: 'Grunt, grunt!',
					message: 'JS is all good'
				}
			},
			build: {
				options: {
					title: 'Grunt, grunt!',
					message: 'We\'ll do it live!'
				}
			}
		}
	});

	// Register tasks
  grunt.registerTask('default', [
  	'clean',
    'stylesheets',
    'scripts',
  ]);
  grunt.registerTask('stylesheets', [
    'sass',
    'autoprefixer',
    'csscomb',
    'cssmin',
    'notify:stylesheets'
  ]);
  grunt.registerTask('scripts', [
    'jshint',
    'concat',
    'uglify',
    'notify:scripts'
  ]);
  grunt.registerTask('build', [
    'default',
    'copy',
    'compress',
    'notify:build'
  ]);
};