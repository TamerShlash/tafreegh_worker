dir_name = ARGV[0]

Dir.chdir dir_name

def friendly_filename(filename)
  filename.gsub(/[^\p{Word}\s_-]+/, '')
    .gsub(/(^|\b\s)\s+($|\s?\b)/, '\\1\\2')
    .gsub(/\s+/, '_')
end

final_filename = friendly_filename(File.read('video.title').strip) + '.txt'
f = File.open(final_filename, 'w')

Dir['*.transcribed'].each do |file|
  range = file.split('.')[0].split('-')
  f.print("#{range[0].to_i(10)}:00-#{range[1].to_i(10)}:00")
  f.print("\r\n")
  f.print(File.read(file))
  f.print("\r\n\r\n")
end

f.close
puts "Output file is: #{final_filename}"
