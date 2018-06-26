// var Twit = require('twit');
// var config = require('./config');

// var T = new Twit(config);

// T.get('search/tweets', {
//     q: 'bananas',
//     count: 5
// }, function (err, data, response) {
//     var tweets = data.statuses;
//     tweets.forEach(element => {
//         console.log(element.text);
//     });
// })

// T.get('followers/ids', {
//     screen_name: 'articblade'
// }, function (err, data, response) {
//     console.log(data.ids.length);
//     var followers = data.ids;

//     for(var i = 0; i < followers.length; i++) {
//         console.log(followers[i]);
//     }
// });

// T.get('friends/ids', {
//     screen_name: 'articblade'
// }, function (err, data, response) {
//     console.log(data.ids.length);
//     var followers = data.ids;

//     for(var i = 0; i < followers.length; i++) {
//         console.log(followers[i]);
//     }
// });

var Twit = require('twit');

var config = require('./config');

var T = new Twit(config);

var fs = require("fs");

const proc = require('child_process');

/**
 * Followed event handler function.
 */

var stream = T.stream('user');

stream.on('follow', followed);

function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screen_name = eventMsg.source.screen_name;
    tweetIt('Yo, @' + screen_name + ' thank you for following me! #bot');
}

/**
 * Text tweet function.
 */

function tweetIt(txt) {

    T.post('statuses/update', {
        status: txt
    }, function (err, data, response) {
        if (err) {
            console.log("something went wrong");
        } else {
            console.log("worked!");
        }
    })
}

/**
 * Image tweet function.
 */

function tweetImage() {

    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    var com = 'node image.js ' + r + ' ' + g + ' ' + b;
    proc.exec(com, () => {

        console.log("image created");

    }).on('close', (code) => {

        var b64content = fs.readFileSync('images/output.png', {
            encoding: 'base64'
        })

        T.post('media/upload', {
            media_data: b64content
        }, function (err, data, response) {
            if (err) {
                console.log(err)
            } else {
                var mediaIdStr = data.media_id_string;
                var meta_params = {
                    media_id: mediaIdStr,
                    alt_text: {
                        text: "Small flowers in a planter on a sunny balcony, blossoming."
                    }
                }

                T.post('media/metadata/create', meta_params, function (err, data, response) {
                    if (err) {
                        console.log(err);
                    } else {
                        var params = {
                            status: 'Random image Red=' + r + ' Green=' + g + ' Blue=' + b + ' #bot',
                            media_ids: [mediaIdStr]
                        }
                        T.post('statuses/update', params, function (err, data, response) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("tweet Posted");
                            }
                        })
                    }
                })
            }
        })
    })
}
tweetImage();
setInterval(tweetImage, 1000 * 60 * 5);