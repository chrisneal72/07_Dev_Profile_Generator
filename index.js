const fs = require("fs");
const inquirer = require("inquirer");
const generateHtml = require("./generateHTML");

const questions = [
    {
        type: "input",
        name: "name",
        message: "What is your GitHub Username?",
    },
    {
        type: "list",
        message: "What is your favorite color?",
        name: "fav_color",
        choices: ["Green", "Blue", "Pink", "Red"]
    }
];



function init() {
    inquirer.prompt(questions)
    .then(function(response) {
        console.log(response);
        const fileData = JSON.stringify(response, null, 2)
        fs.writeFile("test.json", fileData, function(err){
          console.log(err);
        })
    });
}

init();
