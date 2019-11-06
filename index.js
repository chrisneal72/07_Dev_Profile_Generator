const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");

const questions = [
    {
        type: "input",
        name: "name",
        message: "What is your GitHub Username?",
    },
    {
        type: "list",
        message: "What is your favorite color?",
        name: "color",
        choices: ["green", "blue", "pink", "red"]
    }
];



function init() {
    inquirer.prompt(questions)
        .then(function (response) {
            console.log(response);
            // const fileData = JSON.stringify(response, null, 2)
            // fs.writeFile("test.json", fileData, function (err) {
            //     console.log(err);
            // })
            const queryUrl = `https://api.github.com/users/${response.name}`;
            axios
                .get(queryUrl)
                .then(function (res) {
                    // const repoNames = res.data.map(function (repo) {
                    //     console.log(repo.name);
                    //     return repo.name;
                    // });

                    // const repoNamesStr = repoNames.join("\n");

                    // fs.writeFile("repos.txt", repoNamesStr, function (err) {
                    //     if (err) { throw err; }
                    // })

                    console.log(response);
                    // console.log(typeof generateHTML.generateHTML);
                    fs.writeFile("html-build.html", generateHTML.generateHTML(response, res), function (err) {
                        if (err) { throw err; }
                    })
                });
        });
}

init();
