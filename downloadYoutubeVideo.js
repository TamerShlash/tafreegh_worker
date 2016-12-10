var exec   = require('child_process').execSync;
var spawn  = require('child_process').spawnSync;


module.exports = function(video_id) {
  var video_title = exec("youtube-dl --get-title --skip-download -- '" + video_id + "'").toString().trim();
  var download_result = exec("youtube-dl -x --audio-format wav -o '" + video_id + ".%(ext)s' -- '" + video_id + "'");
  return video_title;  
}
