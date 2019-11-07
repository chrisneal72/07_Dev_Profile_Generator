const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const generateHTML = require("./generateHTML");
const electronHtmlTo = require("electron-html-to");
const open = require("open");

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

async function init() {
    let myHTML = "";
    try {
        const response = await inquirer.prompt(questions);
        const queryUrl = `https://api.github.com/users/${response.name}`;
        const queryUrl2 = `https://api.github.com/users/${response.name}/starred`;

        const [gitHubCall, gitHubStaredCall] = await Promise.all([
            axios.get(queryUrl),
            axios.get(queryUrl2)
        ]);
        
            //MAKE THE OBJ AN ARRAY AND GET THE LENGTH
        const myCount = Object.keys(gitHubStaredCall).length;
            //I KNOW I AM ASKING FOR A USERNAME AND IT IS SET TO NAME THE GITHUB CALL OVERWRITES THE NAME, I'M NOT WORRIED ABOUT 
            //THIS BECAUSE THE GITHUB CALL HAS THE USERNAME IF I STILL NEED IT
        const compiledData = { ...response, ...gitHubCall.data };
        compiledData.star_count = myCount;
        myHTML = generateHTML.generateHTML(compiledData);
            //I DON'T NEED TO SAVE THE HTML FILE BUT IT DOES NOT HURT ANYTHING TO DO IT
        fs.writeFile("html-build.html", myHTML, function (err) {
            if (err) { throw err; }
        });
    } catch (err) {
        console.log(err);
    }

    buildPDF(myHTML);
}


function buildPDF(htmlString) {
    //THIS IS ALL CODE FROM ELECTRON-HTML-TO DOCS
    var conversion = electronHtmlTo({
        converterPath: electronHtmlTo.converters.PDF
    });

    conversion({ html: htmlString }, function (err, result) {
        if (err) {
            return console.error(err);
        }

        result.stream.pipe(fs.createWriteStream('./profile.pdf'));
        conversion.kill(); 
        //USING THE OPEN PACKAGE FOR THIS LINE
        open('./profile.pdf')
    });
}

init();