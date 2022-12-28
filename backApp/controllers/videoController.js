var YouTube = require('youtube-node');
const moment = require("moment");

var youTube = new YouTube();
youTube.setKey(process.env.YTKEY);

function getVidDuration(videoId, setTime) {
    youTube.getById(videoId, async (error, result) => {
        if (error) {
            console.log(error)
        }
        else {
            await setTime(moment.duration(result.items[0].contentDetails.duration).asHours().toFixed(1))
        }
    });

}

function getIdFromUrl(url) {
    var parts = url.split("/")
    var videoIdPart = parts[parts.length - 1].split("=")
    var videoId = videoIdPart[videoIdPart.length - 1]
    return videoId
}

module.exports = { getVidDuration, getIdFromUrl }