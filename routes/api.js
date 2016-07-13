var express = require('express');
var router = express.Router();

/* GET API root. */
router.get('/', function(req, res) {
    res.json({
        response: "Welcome to the UT-Austin Student Government API, built by the Daily Texan. This isn't a public API, but we're in the process of making that happen."
    })
});

// GET all resolutions
router.get('/resolutions', function(req, res) {
    var db = req.db;
    var collection = db.get('resolutions');
    collection.find({}, {}, function(e, docs) {
        res.json({
            "resolutions_list" : docs
        });
    });
});

module.exports = router;
