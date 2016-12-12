var exec   = require('child_process').execSync;

module.exports = function(video_id) {
  exec("/usr/local/bin/youtube-dl -x --audio-format wav -o audio.wav -- " + video_id);
}
