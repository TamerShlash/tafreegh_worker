var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
var config = require('./config.js');

var speech_to_text = new SpeechToTextV1(config.stt.credentials);

module.exports = function(callback) {
  var recognizeStream = speech_to_text.createRecognizeStream(config.stt.params);
  recognizeStream.on('end', callback);
  return recognizeStream;
}
