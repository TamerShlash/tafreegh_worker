var fs = require('fs');
var watson = require('watson-developer-cloud');

var audioDir = process.argv[2]
var partname = process.argv[3]

process.chdir(audioDir)

var speech_to_text = watson.speech_to_text({
  username: 'username',
  password: 'password',
  version: 'v1'
});

var params = {
  content_type: 'audio/wav',
  model: 'ar-AR_BroadbandModel',
  continuous: true
}

var range = partname.split('.')[0]
var transFilename = range + '.transcribed'

console.log('Writing transcription to file: ' + transFilename)

var readStream = fs.createReadStream('./' + partname);
readStream.on('end', function() { console.log(partname + ' reading finished.') });

var recognizeStream = speech_to_text.createRecognizeStream(params);
recognizeStream.on('end', function() { console.log(range + ' recognize reading finished.') });
recognizeStream.on('finish', function() { console.log(range + ' recognize writing finished.') });

var writeStream = fs.createWriteStream('./' + transFilename);
writeStream.on('finish', function() { console.log(transFilename + ' writing finished.') });

readStream.pipe(recognizeStream).pipe(writeStream);
