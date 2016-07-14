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

    fs.writeFile('output.txt', function(err){
        if (err) {
            throw err;
        }
        console.log('File successfully written! - Check your project directory for the output.txt file');

    })

    res.json({
        status: 'success!',
        action: 'generate links',
        output: container // FIXME very very empty
    });

});

// TODO: test localization

router.get('/localize-pdf', function(req, res) {
    var content, statusCheck = false; // base variables in global scope
    // open the output file for parsing; we use a file from the filesystem because the variable
    fs.readFile('output.txt', function read(data, err) {
        if (err) {
            throw err;
        }
        content = data;
        processContent(); // run processor
    });

    function processContent() {
        if (content.length){
            // if array has content, begin parse | throw error
            for(var i = 0; i <= content.length; i++) {
                // more dynamic vars
                var url = content[i].link;
                var filename = content[i].name;
                var file = './assets/' + filename;

                function downloadFile(url, path, callback) {
                    request({uri: url}) // make the request
                        .pipe(fs.createWriteStream(path)) // open a file write stream
                        .on('close', function () { // on stream close, run callback
                            callback(); // run through status
                        });
                }

                downloadFile(url, file, function() {
                   console.log(file + " has been downloaded from " + url); // another way to check file write status, FIXME: mutable variable accessible from closure
                });
            }
        } else {
            res.json({
                response: 'Nothing to download!'
            });
        }
        statusCheck = true; // return a statusCheck var for us to send a response to the user
    }

    if (statusCheck == true) {
        res.json({
            response: 'Files have been downloaded.'
        });
    } else {
        res.json({
            response: 'File downloader has failed.'
        });
    }

});

// TODO: parse the PDF files (externalize logic?)
router.get('/parse-pdf', function(req, res) {
   res.json({
       response: 'WIP'
   })
});

module.exports = router;
