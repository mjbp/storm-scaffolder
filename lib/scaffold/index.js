var Promise = require('bluebird'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    execP = Promise.promisify(require('child_process').exec),
    chalk = require('chalk'),
    clear = require('clear'),
    figlet  = require('figlet'),
    fs = require('fs'),
    projectName;

function santise(str){
    return str.split(' ').join('-').toLowerCase();
}

function start(callback) {
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


function packageJSON(fileName){
	var packageHead = {
		"name": santise(projectName),
      	"version": "0.1.0",
      	"description": "",
      	"repository": "",
      	"author": "stormid"
  	};

	fs.readFile(fileName, 'utf8', function (err,data) {

		 fs.writeFile(fileName, JSON.stringify(Object.assign({}, JSON.parse(data), packageHead), null, ' '), 'utf8', function (err) {
			if (err) return console.log(err);
		});

	});
}


function run(){
    clear();
    console.log(
    chalk.yellow(
        figlet.textSync('StormID', { horizontalLayout: 'full' })
    )
    );

    start(function(answer){
        projectName = answer.project;
        
        console.log(chalk.yellow('Creating your new project, this may take some time so go grab a coffee...'));
        var child = exec(["git clone --depth 1 https://github.com/mjbp/storm-scaffold.git ",
                    santise(projectName),
                    " && cd ./",
                    santise(projectName),
                    " && rm -rf .git ",
                    "&& echo 'installing dependencies...' && npm i"].join(''));

        child.stdout.on('data', function(data) {
            console.log(data);
        });
        child.stderr.on('data', function(data) {
            console.log(data);
        });
        child.on('close', function(code) {
            packageJSON(['./', santise(projectName), '/package.json'].join(''));

            console.log(chalk.yellow(['"cd ', santise(projectName), '" into the new project, then "npm start" to run it'].join('')));
        });

    });
}

module.exports = run;