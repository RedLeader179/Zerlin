//for post/get requests
const express = require('express');
//for parsing json
const bodyParser = require('body-parser');
const app = express();

//set a static public resourses page
app.use(express.static('public'));
//path directory for index.html
app.set('view engine', 'ejs');

//add other server module endpoints here if wanted

//basic home page endpoint with serve up
app.get('/', function (req, res) {
    res.render('index');
  });

/* 
To run locally:
 •navigate to directory of folder of project
 •type: node app.js in terminal
 •open localhost:4000 in a web browser
 •to terminate local server use (mac)ctr+c  (not ctr+z)
 •have to do this process over to see changes reflected then refresh web page
 */
app.listen(process.env.PORT || 4000, () => {
    console.log("Server up and running on port: " + (process.env.PORT || 4000));
});
