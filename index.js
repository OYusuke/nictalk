var fs = require("fs"),
		childProcess = require('child_process');
		req = require("request"),
		Buffer = require("Buffer"),

var defaultParams = {"version" : "1.1", "language" : "ja", "voiceType" : "*", "audioType" : "audio/x-wav", "directory" : "./voices/"};

var NICTalk = function(argv){
	argv = !argv ? defaultParams : argv;
	this.version = argv.version ? argv.version : defaultParams.version;
	this.language = argv.language ? argv.language : defaultParams.language;
	this.voiceType = argv.voiceType ? argv.voiceType : defaultParams.voiceType;
	this.audioType = argv.audioType ? argv.audioType : defaultParams.audioType;
	this.directory = argv.directory ? argv.directory : defaultParams.directory;
}

NICTalk.prototype = {

	setParams : function(argv) {
		this.version = argv.version ? argv.version : this.version;
		this.language = argv.language ? argv.language : this.language;
		this.voiceType = argv.voiceType ? argv.voiceType : this.voiceType;
		this.audioType = argv.audioType ? argv.audioType : this.audioType;
		this.directory = argv.directory ? argv.directory : this.directory;
	},

	setLanguage : function(language) {
		this.language = language ? language : this.language;
	},

	setDirectory : function(directory) {
		this.directory = directory ? directory : this.directory;
	},

	speak : function() {
		arguments = typeof(arguments[0]) === 'object' ? arguments[0] : arguments;
		var file = arguments[0],
				text = arguments.length > 1 ? arguments[1] : "",
				callback = arguments.length > 1 ? arguments[arguments.length - 1] : "";
		if (arguments.length == 2) {
			if (typeof(arguments[1]) === 'function')
				text = "";
			else
				callback = "";
		}
	
		var path = this.directory + file + ".wav";
		if (!text)
			return _play(path, callback);
		req.post({
			url: "http://rospeex.ucri.jgn-x.jp/nauth_json/jsServices/VoiceTraSS",
			form: JSON.stringify({
				method: "speak",
				params: [this.version, {
						"language": this.language,
						"text": text,
						"voiceType": this.voiceType,
						"audioType": this.audioType
					}
				]
			}),
			json: true
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				try {
					fs.writeFile(path, new Buffer(body["result"]["audio"], "base64"), function () {
						return _play(path, callback);
					});
				} catch (e) {
					return _play('/home/pi/nodejs/voices/sayingError.wav', callback);
				}
			}
		}).on("error", function (err) {
			return _play('/home/pi/nodejs/voices/sayingError.wav', callback);
		});
	}
};

function _play(filepath, callback) {
  var mediaSoundPlayer = '"(New-Object System.Media.SoundPlayer "' + filepath + '").PlaySync()';
  var player = process.platform === 'darwin' ? 'afplay' : 'aplay';

  if (typeof filepath === 'string') {
    filepath = [filepath];
  }

  if (! callback) {
    callback = function(error) {
      if (error) throw error;
    }
  }

  return process.platform === 'win32'
    ? childProcess.exec('powershell.exe ' + mediaSoundPlayer, callback)
    : childProcess.execFile(player, filepath, callback);
}

module.exports = NICTalk;

if (require.main && require.main.id === module.id) {
  (new NICTalk()).speak(process.argv.slice(2));
}
