var fs     = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var ytdl   = require('./downloadYoutubeVideo.js');
var manager = require('./manager.js');

var video_id = 'gPk1OvmBPyw';
var part_length = 5; // minutes

var stt_manager = new manager(video_id, part_length);

var video_title = ytdl(video_id);

var pipeline = ffmpeg(video_id + ".wav");
pipeline.ffprobe(function(err, metadata) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  duration = metadata.format.duration;
  var minutes = Math.floor(duration / 60);

  for(var i = 0; i * part_length <= minutes; i++) {
    // var stt_stream = stt_manager.createStream();
    pipeline.output(i + '.wav').seek(i * part_length * 60).duration(part_length * 60);
    // pipeline.output(stt_stream).seek(start * 60).duration(part_length * 60);
  }
  pipeline.on('error', function() {});
  pipeline.on('end', function() {
    for(var i = 0; i * part_length <= minutes; i++) {
      var audioSlice = fs.createReadStream('./' + i + '.wav');
      var stt_stream = stt_manager.createStream();
      audioSlice.pipe(stt_stream);
    }
  });
  pipeline.run();
});
