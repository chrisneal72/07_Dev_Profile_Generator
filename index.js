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
        
        // const gitHubCall = await axios.get(queryUrl);
        // const gitHubStaredCall =  await axios.get(queryUrl2);
        
        //I COULD HAVE DONE THIS INLINE, BUT I WANTED TO MAKE A FUNCTION
        const myCount = getStarCount(gitHubStaredCall);
        //I KNOW I AM ASKING FOR A USERNAME AND IT IS SET TO NAME
        //THE GITHUB CALL OVERWRITES THE NAME, I'M NOT WORRIED ABOUT 
        //THIS BECAUSE THE GITHUB CALL HAS THE USERNAME
        const compiledData = { ...response, ...gitHubCall.data };
        compiledData.star_count = myCount;
        myHTML = generateHTML.generateHTML(compiledData);
        //I DON'T NEED TO SAME THE HTML FILE BUT IT DOES NOT HURT ANYTHING TO DO IT
        fs.writeFile("html-build.html", myHTML, function (err) {
            if (err) { throw err; }
        });
    } catch (err) {
        console.log(err);
    }

    buildPDF(myHTML);
}

function getStarCount(gitHubStaredCall) {
    let starCount = 0, key;
    for (key in gitHubStaredCall) {
        if (gitHubStaredCall.hasOwnProperty(key)) starCount++;
    }
    return starCount;
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

//MY FIRST RUN OF THE LOGIC BEFORE SWITCHING TO THE AWAIT SYNTAX
//SAVING IT FOR MYSELF
    // var myCount = 0, key;
    // inquirer.prompt(questions)
    //     .then(function (response) {
    //         const queryUrl = `https://api.github.com/users/${response.name}`;
    //         axios
    //             .get(queryUrl)
    //             .then(function (res) {
    //                 const queryUrl2 = `https://api.github.com/users/${response.name}/starred`;
    //                 axios
    //                     .get(queryUrl2)
    //                     .then(function (res2) {
    //                         for (key in res2) {
    //                             if (res2.hasOwnProperty(key)) myCount++;
    //                         }
    //                     })
    //                     .then(function () {
    //                         console.log(myCount)
    //                         myHTML = generateHTML.generateHTML(response, res, myCount);
    //                         fs.writeFile("html-build.html", generateHTML.generateHTML(response, res, myCount), function (err) {
    //                             if (err) { throw err; }
    //                         });
    //                     })
    //             })
    //     }).catch(function (err) {
    //         console.log(err);
    //     });
