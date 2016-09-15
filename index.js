var Promise = require('bluebird'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    execP = Promise.promisify(require('child_process').exec),
    files = require('./libs/files'),
    chalk = require('chalk'),
    clear = require('clear'),
    figlet  = require('figlet');

function run(callback) {
  var questions = [
    {
      name: 'project',
      type: 'input',
      message: 'Enter your project name:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a project name';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

clear();
console.log(
  chalk.yellow(
    figlet.textSync('StormID', { horizontalLayout: 'full' })
  )
);

run(function(answer){
    console.log('Creating your new project, this may take some time so go grab a coffee...');
    exec(["git clone git@github.com:mjbp/storm-scaffold.git && mv 'storm-scaffold' '",
                answer.project.split(' ').join('-').toLowerCase(),
                "' && cd ./",
                answer.project.split(' ').join('-').toLowerCase(),
                "&& echo 'installing dependencies...' && npm i"].join(''));
});