var Promise = require('bluebird'),
    inquirer = require('inquirer'),
    exec = require('child_process').exec,
    execP = Promise.promisify(require('child_process').exec),
    chalk = require('chalk'),
    clear = require('clear'),
    figlet  = require('figlet'),
    fs = require('fs'),
    projectName;

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
		"name": projectName.split(' ').join('-').toLowerCase(),
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
        var child = exec(["git clone git@github.com:mjbp/storm-scaffold.git ",
                    projectName.split(' ').join('-').toLowerCase(),
                    " && cd ./",
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
            packageJSON(['./', projectName.split(' ').join('-').toLowerCase(), '/package.json'].join(''));

            console.log(chalk.yellow(['"cd ', projectName.split(' ').join('-').toLowerCase(), '" into the new project, then "gulp start" to run it'].join('')));
        });

    });
}

module.exports = run;