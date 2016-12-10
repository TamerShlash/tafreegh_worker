var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');

var speech_to_text = new SpeechToTextV1({
  username: '3d6d4ee3-bac5-453a-9791-6b68b83a7f44',
  password: 'Pf1cKKPI2YYP'
});

var stt_params = {
  content_type: 'audio/wav',
  model: 'ar-AR_BroadbandModel',
  continuous: true
}

module.exports = function(callback) {
  var recognizeStream = speech_to_text.createRecognizeStream(stt_params);
  recognizeStream.on('end', callback);
  return recognizeStream;
}
