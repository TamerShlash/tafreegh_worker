var fs = require('fs');
var request = require('request');
var config = require('./config.js');

module.exports = function(video_id) {
  var options = {
    url: config.web.url + '/videos/' + video_id + '/auto_transcription',
    method: 'POST',
    headers: {
      'Tafreegh-Token': config.web.token
    },
    formData: {
      auto_transcription_file: fs.createReadStream('./auto_transcription.txt')
    },
  };

  request(options, function optionalCallback(err, response, body) {
    if (err) {
      console.error('upload failed:', err);
    } else if (Math.floor(response.statusCode/10) == 20 && JSON.parse(body)['success'] == true) {
      console.log('Upload successful!');
    } else {
      console.log('Server responded with:');
      console.log('status: ' + response.statusCode);
      console.log('body:\n' + body);
    }
  });
}