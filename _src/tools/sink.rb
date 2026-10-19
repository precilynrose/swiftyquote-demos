require 'webrick'
root, out = ARGV[0], ARGV[1]
s = WEBrick::HTTPServer.new(Port: 8766, BindAddress: '127.0.0.1', DocumentRoot: root, AccessLog: [], Logger: WEBrick::Log.new(nil, 0))
s.mount_proc '/save' do |req, res|
  res['Access-Control-Allow-Origin'] = '*'
  name = File.basename(req.path)
  File.binwrite(File.join(out, name), req.body.to_s)
  res.body = "saved #{name} #{req.body.to_s.bytesize}"
end
s.start
