/*

    Copyright 2016-2017, Huawei Technologies Co., Ltd.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

*/

var express = require('express');
var router = express.Router();
/*var js2xmlparser = require("js2xmlparser");
var xml2js = require('xml2js');*/
var fs = require('fs');
var http = require('http');
var bodyParser = require('body-parser');
var path=require('path');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

var url = 'mongodb://localhost/rest_test';

/*var exists = require('file-exists');*/

// ############################################  Sign In code #################################################
// Routes
router.post('/signin', function (req, res) {
	console.log("signin");
	var obj = {
		"name": req.body.name,
		"pswd": req.body.pswd
	};

	var ObjLst =[] ;
	var nameExist =0;
	console.log(obj);
	ObjLst = JSON.parse(fs.readFileSync('input.json', 'utf8'));
	for(var index = 0; index < ObjLst.length; index++) {
		if (ObjLst[index].name === req.body.name && ObjLst[index].pswd === req.body.pswd) {
			console.log("success");
			nameExist++;
			res.statusCode=200;
			res.statusMessage="Sucessfully loged in";
			break;
		}
	}
	if (nameExist != 1) {
		console.log("failed");
		res.statusCode=404;
		res.statusMessage="failed to login";
	}
	res.send();
});

// ############################################  Sign Up Code #################################################

router.post('/signup', function (req, res) {

	console.log("in api.js");

	var ObjLst =[] ;
	var nameNotExist =0;
	var obj = {
		"name": req.body.name,
		"pswd": req.body.pswd,
		"email": req.body.email
	};
	if(fs.existsSync("input.json")) {
		console.log("File Exist");
		ObjLst = JSON.parse(fs.readFileSync('input.json', 'utf8'));
	}

	for(var index = 0; index < ObjLst.length; index++) {
		if (ObjLst[index].name === req.body.name && ObjLst[index].email === req.body.email) {
			console.log("success");
			nameNotExist++;
			break;
		}
	}
	if (nameNotExist == 0) {
		ObjLst.push(obj);
		console.log(ObjLst);
		fs.writeFile('input.json', JSON.stringify(ObjLst),  function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("Data written successfully!");
			console.log("Let's read newly written data");
			res.statusCode=200;
			res.statusMessage="Sucessfully signed up";
		});
	}
	res.send();
});

function getDataFrmProvince() {
    var provinceData =[] ;
    if(fs.existsSync("provinceData.json")) {
        console.log("File Exist");
        provinceData = JSON.parse(fs.readFileSync('provinceData.json', 'utf8'));
    }
    return provinceData;
}

function saveDataToProvince(provinceData) {
    fs.writeFile('provinceData.json', JSON.stringify(provinceData),  function(err) {
        var statueCode = 0;
        if (err) {
            console.error(err);
            return statueCode = 404;
        }
        console.log("Data written successfully!");
        console.log("Let's read newly written data");
        return statueCode = 200;
    });
}

function getIndexOfIdProvince(id) {
    var provinceData = getDataFrmProvince();
    var returnIndx = -1;
    for (var index = 0; index < provinceData.length; index++) {
        if(provinceData[index].id == id) {
            returnIndx = index;
            break;
        }
    }
    return returnIndx;
}

function deleteIdFromProvince(idList) {
    var provinceData = getDataFrmProvince();
    /*for (var index = 0; index < provinceData.length; index++) {
        if(provinceData[index].id == id) {
            console.log("Deleting id : " + index);
            provinceData.splice(index, 1);
            break;
        }
    }*/
    for(var i = 0; i < idList.length; i++) {
        for (var index = 0; index < provinceData.length; index++) {
            if(provinceData[index].id == idList[i]) {
                console.log("Deleting id : " + index);
                provinceData.splice(index, 1);
                break;
            }
        }
    }
    return provinceData;
}

router.get('/getAllProvinceData', function (req, res) {
    var provinceData = getDataFrmProvince();
    if(provinceData) {
        output = '{"provinceData" : ' + JSON.stringify(provinceData) + '}';

        res.setHeader("Content-Type", "application/json");
        console.log("output : " + JSON.stringify(output));
        res.end(output);
    }
    /*MongoClient.connect(url, function(err, db) {
        console.log("Connected... :-)");
        var cursor = db.collection('ProvinceData').find({},function(err, cursor) {
            cursor.toArray(function (err, items) {
                output = '{"provinceData" : ' + JSON.stringify(items) + '}';

                res.setHeader("Content-Type", "application/json");
                //console.log("output : " + JSON.stringify(output));
                res.end(output);
            });
        });
        db.close(function(){
            console.log("Connection Closed... :-)");
        });
    });*/
});


router.post('/addProvinceData', function(req, res) {
    var provinceData = getDataFrmProvince();
    var gen_id = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    provinceData.push({
        "id": gen_id,
        "province_name": req.body.province_name,
        "ip": req.body.ip,
        "port": req.body.port
    });
    var statusCode = saveDataToProvince(provinceData);
    res.statusCode=statusCode;

    if(statusCode == 200) {
        res.statusMessage="Sucessfully signed up";
    }
    else {
        res.statusMessage="Error";
    }

    /*MongoClient.connect(url, function(err, db) {
        db.collection('ProvinceData').insertOne({
            province_name: req.body.province_name,
            ip: req.body.ip,
            port: req.body.port
        });
        db.close();
    });*/
    res.statusCode=200;
    res.statusMessage="Sucessfully signed up";
    res.send();
});

router.post('/deleteProvinceData', function (req, res) {
    //var provinceData = getDataFrmProvince();
    console.log("IdList: "+ req.body.idList);
    /*for(var i = req.body.idList.length - 1; i >= 0; i--) {
        var index = getIndexOfIdProvince(req.body.idList[i]);
        console.log("Deleting id : " + index);
        if(index != -1) {
            provinceData.splice(index, 1);
        }
        //deleteIdFromProvince(req.body.idList[i]);
    };*/

    var provinceData = deleteIdFromProvince(req.body.idList);

    saveDataToProvince(provinceData);

    /*MongoClient.connect(url, function(err, db) {

        console.log("Deleting Province Data... " + req.body.idList);
        for(var i = 0; i < req.body.idList.length; i++) {
            db.collection('ProvinceData').deleteOne({ "_id": ObjectId(req.body.idList[i])});
        }
        /!*db.collection('ProvinceData').deleteOne({ "_id": ObjectId(req.body.idList)});*!/

        db.close(function(){
            console.log("Connection Closed... :-)");
        });
        res.send();
    });*/
    res.statusCode=200;
    res.statusMessage="Sucessfully signed up";
    res.send();
});

router.post('/editProvinceData', function (req, res) {
    var provinceData = getDataFrmProvince();
    var index = getIndexOfIdProvince(req.body.id);
    console.log("Editing id : " + index);
    if(index != -1) {
        provinceData[index].province_name = req.body.province_name;
        provinceData[index].ip = req.body.ip;
        provinceData[index].port = req.body.port;
    }
    saveDataToProvince(provinceData);

    res.statusCode=200;
    res.statusMessage="Sucessfully signed up";
    res.send();
    /*MongoClient.connect(url, function(err, db) {

        console.log("Editing Province Data... " + req.body._id);
        db.collection('ProvinceData').updateOne(
            { "_id": ObjectId(req.body._id)},
            {
                $set: {'province_name': req.body.province_name, 'ip': req.body.ip, 'port': req.body.port}
            }
        );

        db.close(function(){
            console.log("Connection Closed... :-)");
        });
        res.send();
    });*/
});

// Return router
module.exports = router; 

