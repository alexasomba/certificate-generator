var MongoClient  = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var assert = require('assert');
var DBOpened = false;

//This object will hold opened connections to the collections the app uses
var openedColls = {};
var url = '';

//import the language driver
module.exports = function(dbName , authObj , app){

	//This functions accesses the database and creates a pool of opened
	//connections to the required collections needed by the app
	var initColls = function (cb) {
		if(!isDBOpened()){
			MongoClient.connect(url , function(err , db){
				if(err){
					throw new Error('DB connection error ');
				} else {
					assert.equal(null ,err);
					console.log('Connected correcctly to the database');
					openedColls.DigifyList = db.collection('DigifyList');
					openedColls.Templates = db.collection('Templates');
					DBOpened = true;

					return cb();
				}
			});
		} else {
			return cb();
		}

	};

    //This function returns the valid collection to the client module
	var model = function(coll){
		if(!openedColls[coll]){
			throw new Error('The model or collection required does not exists');
		}
		return openedColls[coll];
	};

	//
	var isDBOpened = function(){
		return DBOpened;
	}

	//Set db connection string based on the current environment being worked in...
	if(app.get('env') ==='development'){
       url = 'mongodb://127.0.0.1:27017/'+dbName.trim();
	} else {
       url = 'mongodb://heroku_bw9c8b6x:205spub7cgi3s0uspm2ev2hg73@ds113936.mlab.com:13936/heroku_bw9c8b6x';
	}

	return {
		initColls : initColls,
		model : model
	};
};
