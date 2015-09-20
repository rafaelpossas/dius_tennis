module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-nodemon');
// Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings


        mochacli: {
            options: {
                ui: "bdd"
            },
            all: ["test/*.js"]
        },


        nodemon: {
            dev: {
                script: 'app'
            }
        },


    });
    grunt.registerTask('run', function (target) {
        grunt.task.run([
            'nodemon',
        ])
    })
    grunt.registerTask('test', function (target) {
        grunt.task.run([
            'mochacli',
        ])
    })


};
