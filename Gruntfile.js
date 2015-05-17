'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        'sftp-deploy': {
            raspitoy: {
                auth: {
                    host: '85.168.219.50',
                    port: 52222,
                    authKey: 'key1'
                },
                src: '.',
                dest: '/home/pi/PlayStationCat',
                exclusions: ['.DS_Store', 'Thumbs.db', '*.pyc', '.git*', '.ftppass', 'node_modules', 'sftp-config.json', 'package.json', 'Gruntfile.js'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            },
            raspicam: {
                auth: {
                    host: '85.168.219.50',
                    port: 22,
                    authKey: 'key2'
                },
                src: '.',
                dest: '/home/pi/PlayStationCat',
                exclusions: ['.DS_Store', 'Thumbs.db', '*.pyc', '.git*', '.ftppass', 'node_modules', 'sftp-config.json', 'package.json', 'Gruntfile.js'],
                serverSep: '/',
                concurrency: 4,
                progress: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-sftp-deploy');

    grunt.registerTask('default', [
        'sftp-deploy:raspitoy', 'sftp-deploy:raspicam'
    ]);
};
