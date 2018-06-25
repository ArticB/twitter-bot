var Twit = require('twit');
var config = require('./config');

var T = new Twit(config);

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


/* followed event tweet function */

var stream = T.stream('user');

stream.on('follow', followed);

function followed(eventMsg) {
    var name = eventMsg.source.name;
    var screen_name = eventMsg.source.screen_name;
    tweetIt('Yo, @' + screen_name + ' thank you for following me! #bot');
}



//setInterval(tweetIt, 1000 * 20);

//tweetIt("Hello, World! first bot tweet 😊");

/* Tweet Function */

function tweetIt(txt) {
    //var r = Math.floor( Math.random(0, 1) * 100);  
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