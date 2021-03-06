var express = require('express');
var router = express.Router();
var cps = require('cps-api');
var BookingSchema = require('../models/bookingSchema.js');
var ProfileSchema = require('../models/profileSchema.js');
var cpsConn = new cps.Connection('tcp://cloud-eu-0.clusterpoint.com:9007', 'Database',
            process.env.CLUSTERPOINT_USERNAME, process.env.CLUSTERPOINT_PASSWORD,
            'document', 'document/id', {account: 1393});
var key = process.env.SPARKPOST_KEY
, SparkPost = require('sparkpost')
, client = new SparkPost(key);

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
      return;
    }

    var reqOpts = {
      transmissionBody: {
        recipients: [{ address: { email: req.body.email } }],
        content: {
          template_id: 'tour-journal-welcome'
        }
      }
    };

    client.transmissions.send(reqOpts, function(err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res.body);
        console.log('Congrats you can use our SDK!');
      }
    });
     res.json(resp);
  });
});

router.post('/login', function(req, res, next) {
  var retrieve_req = new cps.RetrieveRequest(req.body.id);
  cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
     if (err){
       res.json(err);
       return;
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
        return;
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
       return;
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
       return;
     }
     if(delete_resp){
      res.json(delete_resp);
     }
  });
});

router.get('/artists/', function(req, res, next){
  var search_req = new cps.SearchRequest(cps.Term("artist", "userType"),
      0, 20);
    cpsConn.sendRequest(search_req, function (err, search_resp) {
       if (err){
         res.json(err);
         return;
       };
       res.json(search_resp.results.document);
    });
});

router.get('/venues/', function(req, res, next){
  var search_req = new cps.SearchRequest(cps.Term("venue", "userType"),
      0, 20);
    cpsConn.sendRequest(search_req, function (err, search_resp) {
       if (err){
         res.json(err);
         return;
       };
       res.json(search_resp.results.document);
    });
});

router.get('/venues/:id', function(req, res, next){
  var retrieve_req = new cps.RetrieveRequest(req.params.id);
  cpsConn.sendRequest(retrieve_req, function (err, retrieve_resp) {
     if (err){
        res.json(err);
        return;
      }
     if (retrieve_resp) {
        res.json(retrieve_resp.results.document[0]);
     }
  }, 'json');;
});

router.patch('/venues/:id', function(req, res, next){
  var replace_request = new cps.PartialReplaceRequest(req.body);
  cpsConn.sendRequest(replace_request, function (err, replace_resp) {
     if (err){
       res.json(err);
       return;
     }
     if (replace_resp) {
        res.json(replace_resp);
     }
  }, 'json');
});

router.delete('/venues/:id', function(req, res, next){
  cpsConn.sendRequest(new cps.DeleteRequest({ id: req.params.id }), function (err, delete_resp) {
     if (err){
       res.json(err);
       return;
     }
     if(delete_resp){
      res.json(delete_resp);
     }
  });
});

router.get('/events/', function(req, res, next){
  var search_req = new cps.SearchRequest(cps.Term("event", "type"),
      0, 20);
    cpsConn.sendRequest(search_req, function (err, search_resp) {
       if (err){
         res.json(err);
         return;
       }
       res.json(search_resp.results.document);
    });
});

router.post('/events', function(req, res, next) {
  var newEvent = new BookingSchema(req.body);
  var document = [newProfile];
  cpsConn.sendRequest(new cps.InsertRequest(document), function (err, resp) {
    if (err){
      res.json(err);
      return;
    }
     res.json(resp);
  });
});

router.patch('/events/:id', function(req, res, next){
  var replace_request = new cps.PartialReplaceRequest(req.body);
  cpsConn.sendRequest(replace_request, function (err, replace_resp) {
     if (err){
       res.json(err);
       return;
     }
     if (replace_resp) {
        res.json(replace_resp);
     }
  }, 'json');
});

router.delete('/events/:id', function(req, res, next){
  cpsConn.sendRequest(new cps.DeleteRequest({ id: req.params.id }), function (err, delete_resp) {
     if (err){
       res.json(err);
       return;
     }
     if(delete_resp){
      res.json(delete_resp);
     }
  });
});

router.post('/search', function(req, res, next){
  console.log(req.body.searchText);
  var search_req = new cps.SearchRequest("*" + req.body.searchText + "*", 0, 10);
    cpsConn.sendRequest(search_req, function (err, search_resp) {
       if (err){
         res.json(err);
         return;
       }
       res.json(search_resp.results.document);
    });
});


module.exports = router;
