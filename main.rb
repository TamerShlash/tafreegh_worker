require 'streamio-ffmpeg'

video_id = ARGV[0]

dir_name = "VIDEO_#{video_id}"

puts 'Creating Directory'
Dir.mkdir dir_name unless Dir.exist? dir_name

puts 'Obtaining video title'
system("youtube-dl --get-title --skip-download -- '#{video_id}' > #{dir_name}/video.title")

puts 'Downloading Video'
system("youtube-dl -x --audio-format wav -o '#{dir_name}/original.%(ext)s' -- '#{video_id}'") || abort

puts 'Splitting into parts of five minutes each'
recording = FFMPEG::Movie.new("#{dir_name}/original.wav")
minutes = recording.duration.floor / 60

part_length = 5 # minutes

(0..minutes).step(part_length) do |start|
  seek_time = start * 60
  partname = "#{format('%03i', start)}-#{format('%03i', start + part_length)}.wav"
  recording.transcode("#{dir_name}/#{partname}", seek_time: seek_time, duration: 60 * part_length)
  fork { exec("node recognize.js '#{dir_name}' '#{partname}'") }
end

File.delete("#{dir_name}/original.wav")
p Process.waitall

exec("ruby concat.rb #{dir_name}")
