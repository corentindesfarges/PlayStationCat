'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        secret: grunt.file.readJSON('secret.json'),
        
        'sftp-deploy': {
            raspitoy: {
                auth: {
                    host: '<%= secret.toy.host %>',
                    port: '<%= secret.toy.port %>',
                    authKey: 'key1'
                },
                src: '.',
                dest: '/home/pi/PlayStationCat',
                exclusions: ['.DS_Store', 'Thumbs.db', '*.pyc', '.git*', '.ftppass', 'node_modules', 'sftp-config.json', 'package.json', 'Gruntfile.js', '*.md', 'secret.json'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            },
            raspicam: {
                auth: {
                    host: '<%= secret.cam.host %>',
                    port: '<%= secret.cam.port %>',
                    authKey: 'key2'
                },
                src: '.',
                dest: '/home/pi/PlayStationCat',
                exclusions: ['.DS_Store', 'Thumbs.db', '*.pyc', '.git*', '.ftppass', 'node_modules', 'sftp-config.json', 'package.json', 'Gruntfile.js', '*.md', 'secret.json'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-sftp-deploy');

    grunt.registerTask('default', [
        'sftp-deploy'
    ]);
};
