'use strict';
var request = require('request');
//var localStorage = require('localStorage')
var fs = require('fs');
var y = 197;

function processFile(data){
//    console.log(data);
    fs.writeFile('hist_data.json', JSON.stringify(data), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

function grabber(){
    request({
            url: "https://api.coinmarketcap.com/v1/ticker/",
            method: "GET",
            timeout: 100000,
            followRedirect: true,
            maxRedirects: 10
        },function(error, response, body){
            if(!error && response.statusCode == 200){
                let data1 = JSON.parse(response.body);
                fs.readFile('hist_data.json', (err, data) => {  
                    if (err) throw err;
                
                    let hd = JSON.parse(data);
                    for (var i in data1){
//                            console.log(data1[i].name, data1[i].price_usd);
                        for (var j in hd){
                            if (data1[i].name == hd[j].Currency){
                                hd[j].Price.push(data1[i].price_usd);
                                break;
                            }
                        }
                        if ((j == hd.length)&&(data1[i].name != hd[j].Currency)){
                            hd.push({
                                'Currency':data1[i].name,
                                'Price' : [data1[i].price_usd]
                            });
                        }
                    }
                    processFile(hd);
                });
                
            }
            else{
                console.log('error' + response.statusCode);
            }
        });
    }

setInterval(grabber, 60000);

  

