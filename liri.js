require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');

var request = require("request");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

var command = process.argv[2];

var userData = process.argv[3];

if (command === "my-tweets") {
    twitterSearch();
} else if (command === "spotify-this-song") {
    spotifySearch()
} else if (command === "movie-this") {
    omdbSearch()
} else if (command === "do-what-it-says") {
    console.log("arg1 / arg2");
}




function spotifySearch() {
    spotify
        .search({ type: 'track', query: userData })
        .then(function (response) {
            // console.log(response.tracks.items);
            console.log(response.tracks.items[0].name); //song name
            // console.log(response.tracks.items[0].album.name);//album name
            // console.log(response.tracks.items[0].artists[0].name); //artists name
            // console.log(response.tracks.items[0].preview_url);//preview URL
            

        })
        .catch(function (err) {
            console.log(err);
        });
}

function omdbSearch() {
    var queryUrl = "http://www.omdbapi.com/?t=" + userData + "&y=&plot=short&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    // console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].imdbRating);
            // console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Year);
            console.log("Production Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

function twitterSearch() {
    var params = { screen_name: 'rbricem' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 19; i++) {
                console.log('Tweet ${i}: ${tweets[i].text} --> was tweeted on ${tweets[i].created_at}');
            }
        }
    });
}