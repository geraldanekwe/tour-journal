var express = require('express');
var router = express.Router();
var cps = require('cps-api');
var ProfileSchema = require('../models/profileSchema.js')
var cpsConn = new cps.Connection('tcp://cloud-eu-0.clusterpoint.com:9007', 'Database',
            process.env.CLUSTERPOINT_USERNAME, process.env.CLUSTERPOINT_PASSWORD,
            'document', 'document/id', {account: 1393});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', function(req, res, next) {
  var newProfile = new ProfileSchema(req.body);
  var document = [newProfile];
  cpsConn.sendRequest(new cps.InsertRequest(document), function (err, resp) {
    if (err){
      res.json(err);
    }
     res.json(resp);
  });
});

router.post('/login', function(req, res, next) {
  var retrieve_req = new cps.RetrieveRequest(req.body.username);
  cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
     if (err){
       res.json(err);
     }
     if (retrieve_resp) {
        res.json(retrieve_resp.results.document[0]);
     }
  }, 'json');
});

router.get('/artists/:id', function(req, res, next){
  var retrieve_req = new cps.RetrieveRequest(req.params.id);
  cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
     if (err){
        res.json(err);
      }
     if (retrieve_resp) {
        res.json(retrieve_resp.results.document[0]);
     }
  }, 'json');;
});

router.patch('/artists/:id', function(req, res, next){
  var replace_request = new cps.PartialReplaceRequest(req.body);
  cpsConn.sendRequest(replace_request, function (err, replace_resp) {
     if (err){
       res.json(err);
     }
     if (replace_resp) {
        res.json(replace_resp);
     }
  }, 'json');
});

router.delete('/artists/:id', function(req, res, next){
  cpsConn.sendRequest(new cps.DeleteRequest({ id: req.params.id }), function (err, delete_resp) {
     if (err){
       res.json(err);
     }
     if(delete_resp){
      res.json(delete_resp);
     }
  });
});


module.exports = router;
