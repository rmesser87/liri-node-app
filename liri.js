require("dotenv").config();

var keys = require("./keys.js");

var Twitter = require('twitter');

var request = require("request");

var Spotify = require('node-spotify-api');

var fileSystem = require('file-system')

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

var command = process.argv[2];

var userData = process.argv[3];

if (command === "my-tweets") {
    twitterSearch();
} else if (command === "spotify-this-song") {
    spotifySearch();
} else if (command === "movie-this") {
    omdbSearch();
} else if (command === "do-what-it-says") {
    randomAct();
} else if (process.argv.length > 3) {
    console.log("Please try your command again with the correct parameters.")
} else {
    console.log("Please try your command again with the correct parameters.")
}


function randomAct() {
    fileSystem.readFile("random.txt", "utf8", function (error, data) {

        // 
        if (error) {
            return console.log(error);
        }

        //
        // console.log(data);

        // 
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        userData = dataArr[1];

        if (dataArr[0] === "my-tweets") {
            twitterSearch();
        } else if (dataArr[0] === "spotify-this-song") {
            spotifySearch();
        } else if (dataArr[0] === "movie-this") {
            omdbSearch();
        }
        // console.log(dataArr);

    });

}

function spotifySearch() {
    spotify
        .search({ type: 'track', query: userData })
        .then(function (response) {
            var song = response.tracks.items[0]
            console.log(`The artist you selected is ${song.artists[0].name}.`); //artists name
            console.log(`The name of the song you selected is ${song.name}.`); //song name
            console.log(`Here's a link to preview the song ${song.preview_url}.`);//preview URL
            console.log(`Your song debuted on the album ${song.album.name}.`);//album name
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
            var movie = JSON.parse(body)
            console.log("Title: " + movie.Title);
            console.log("Release Year: " + movie.Year);
            console.log("IMDB Rating: " + movie.Ratings[0].imdbRating);
            // console.log("Rotten Tomatoes Rating: " + movie.Year);
            console.log("Production Country: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
        } else {
            userData = "Mr. Nobody";
            console.log(error);
            omdbSearch()
        }
    });
}

function twitterSearch() {
    var params = { screen_name: 'rbricem' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            //I only have 2 tweets at this time. 
            for (var i = 0; i < 2; i++) {
                console.log(`Tweet ${i + 1}: ${tweets[i].text} --> was tweeted on ${tweets[i].created_at}`);
            }
        }
    });
}

// console.log(process.argv[4])

// if (process.argv.length > 3) {
//     console.log("Please try your command again with the correct parameters.")
// }