var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

// GET scraper root.
router.get('/', function(req, res) {
    res.json({
        response: 'Welcome to the web scraper.'
    });
});

// generate the link dataset for parsing
router.get('/generate-link', function(req, res) {
    var url = "http://utsg.org/branches/legislative/legislation/" // hardcoded parse URL
    var container = []; // container array for localization

    request(url, function(error, response, html) {
        if (!error) {
            // initialize the cheerio object
            var $ = cheerio.load(html);
            // container variables
            var output = {title: "", link: ""}; // object containing title text + href to the PDF
            //begin filtering the page
            var selected_elements = $('.hentry').children('a');

            selected_elements.each(function(i, elem) {
                output.title = $(this).text(); // save title
                output.link = $(this).attr('href'); // save link to PDF/doc
                container.push(output); // push to container array
            });
        }
    });

    res.json({
        status: 'success!',
        action: 'generate links',
        output: container
    });

});

// TODO: localize the PDF assets for parsing
router.get('/localize-pdf', function(req, res) {
    res.json({
        response: 'WIP'
    })
});

// TODO: parse the PDF files (externalize logic?)
router.get('/parse-pdf', function(req, res) {
   res.json({
       response: 'WIP'
   })
});

module.exports = router;
