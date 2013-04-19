var express = require("express");
var app = express();
app.use(express.logger());
var http = require("http");
var querystring = require("querystring");
var fs = require("fs");
var emails = require("./emailList.json");
//var process = require("process");

app.get('/', function(request, response) {
  response.send('Hello World! Here I come');
});

var port = process.env.PORT || 5000;
//app.listen(port, function() {
//  console.log("Listening on " + port);  
//});

console.log("starting worker");
var i = 0;
var max = emails.result.length-1;
var delaytime = 2*60*1000; //mins * secs * millisecs
var idinterval = setInterval(function(){
    //console.log(i++);
    if(i++ > max)
    {
        clearInterval(idinterval);
        console.log("ending worker process");
    }
    else
    {
        var emailTo = emails.result[i].email
        console.log(emailTo+",iteration:"+i+",max:"+max);    
        postEmailsToGA(emailTo);
    }
    
},delaytime);

function postEmailsToGA(emailTo)
{
    //console.log("in function post");
    var targetHost = "go.generalassemb.ly";
    var targetPath = "/l/19312/2013-04-03/2v5w9";
    var options = {
        host: targetHost,
        post: 80,
        path:targetPath,
        method:'POST'
    };
    
    var paramsJson = {
      email  :emailTo,
      metro:'new-york-city',
      checkbox:'on'
    };
    var params = querystring.stringify(paramsJson);
    //console.log(params);
    //process.exit(1);
    
    var headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:20.0) Gecko/20100101 Firefox/20.0',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Length': params.length,
        'Origin': 'https://generalassemb.ly',
        'Connection': 'keep-alive',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
        
    };
    var req = http.request(options,function(response) {
        console.log('STATUS: ' + response.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(response.headers));
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
