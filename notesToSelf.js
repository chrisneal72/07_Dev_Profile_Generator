const [gitHubCall, gitHubStaredCall] = await Promise.all([
    axios.get(queryUrl),
    axios.get(queryUrl2)
]);
    //I HAD IT THIS WAY, THE ABOVE METHOD SENDS THE CALLS AT THE SAME TIME
    //KEEPING THESE HERE FOR MY OWN REF
// const gitHubCall = await axios.get(queryUrl);
// const gitHubStaredCall =  await axios.get(queryUrl2);


        
        // const myCount = getStarCount(gitHubStaredCall);
            //RATHER THAN RUN A FUNCTION AND LOOP, JUST TURN OBJECT TO AN ARRAY AND GET THE LENGTH
            const myCount2 = Object.keys(gitHubStaredCall).length;

            
function getStarCount(gitHubStaredCall) {
    let starCount = 0, key;
    for (key in gitHubStaredCall) {
        if (gitHubStaredCall.hasOwnProperty(key)) starCount++;
    }
    return starCount;
}



//MY FIRST RUN OF THE LOGIC BEFORE SWITCHING TO THE AWAIT SYNTAX
//SAVING IT FOR MY OWN REF
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
            //I KNOW I AM ASKING FOR A USERNAME AND IT IS SET TO NAME
            //THE GITHUB CALL OVERWRITES THE NAME, I'M NOT WORRIED ABOUT 
            //THIS BECAUSE THE GITHUB CALL HAS THE USERNAME
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