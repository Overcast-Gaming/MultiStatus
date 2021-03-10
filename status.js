var https = require('https')
var fs = require('fs')

if(!fs.existsSync("wake.json"))
    fs.writeFileSync("wake.json", '{"wake":'+new Date().getTime()+'}')

if(!fs.existsSync("config.json"))
    fs.writeFileSync("config.json", fs.readFileSync("config.default.json"))

var wake = require('./wake.json')
var config = require('./config.json')
var token = config.token
if(config.token.includes("<") && process.argv.length == 2){
    console.log("Please enter your discord user token in config.json. You can find out how to get it in the README.")
    process.exit(0);
} else {
    token = process.argv[2];
}


var at = 0;

set();

setInterval(()=>{
   set();
}, config.intrvl*1000)

function set(){
    var date = new Date();
    var msg = config.words[at];
    var hrs = date.getHours()+"";
    var min = date.getMinutes()+""
    if(hrs.length == 1)
        hrs = "0"+hrs;
    if(min.length == 1)
        min = "0"+min;

    msg = msg.replace(/\%l\_time\%/g, hrs+":"+min)

    var wastr = (Math.ceil(Math.abs(new Date() - wake.wake) / 36e5))+"h";
    if(Math.abs(new Date() - wake.wake) / 36e5 < 1)
        wastr = (Math.ceil(Math.abs(new Date() - wake.wake) / (60*1000)))+"m";
    msg = msg.replace(/\%w\_time\%/g, wastr)
    console.log(msg)
    send(msg)
    if(at >= config.words.length-1)
        at = 0;
    else
        at++;
}

function send(txt){
    console.log("sending: "+txt)
    var data = JSON.stringify({custom_status:{text:txt}})
    var req = https.request("https://discord.com/api/v8/users/@me/settings")
    req.method = "PATCH"
    req.setHeader("content-length", Buffer.from(data).length)
    req.setHeader("content-type", "application/json")
    req.setHeader("dnt", "1")
    req.setHeader("user-agent", "Mozilla/5.0 (X11; U; Linux x86_64; en-ca) AppleWebKit/931.2+ (KHTML, like Gecko) Version/*.0 Safari/999.2+")
    req.setHeader("authorization", token)
    req.write(data);
    req.end()
}
