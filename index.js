var Promise = require('bluebird'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    execP = Promise.promisify(require('child_process').exec),
    files = require('./libs/files'),
    chalk = require('chalk'),
    clear = require('clear'),
    figlet  = require('figlet'),
    fs = require('fs'),
    projectName;

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

function rename(fileName) {
  fs.readFile(fileName, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/storm-scaffold/g, projectName.split(' ').join('-').toLowerCase());

    fs.writeFile(fileName, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}


clear();
console.log(
  chalk.yellow(
    figlet.textSync('StormID', { horizontalLayout: 'full' })
  )
);

run(function(answer){
    projectName = answer.project;
    
    console.log(chalk.yellow('Creating your new project, this may take some time so go grab a coffee...'));
    var child = exec(["git clone git@github.com:mjbp/storm-scaffold.git && mv 'storm-scaffold' '",
                projectName.split(' ').join('-').toLowerCase(),
                "' && cd ./",
                projectName.split(' ').join('-').toLowerCase(),
                " && rm -rf .git ",
                "&& echo 'installing dependencies...' && npm i"].join(''));

    child.stdout.on('data', function(data) {
        console.log(data);
    });
    child.stderr.on('data', function(data) {
        console.log(data);
    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
        exec(["cd ./",
              projectName.split(' ').join('-').toLowerCase()].join(''));
      console.log(
        chalk.yellow('Enter "gulp start" to run your new project')
      );
    });

});


