#!/usr/bin/env node
'use strict';

const fs = require("fs"),
			childProcess = require("child_process"),
			req = require("request");

const defaultParams = {
	"version" : "1.1",
	"language" : "ja",
	"voiceType" : "*",
	"audioType" : "audio/x-wav",
	"directory" : ""
};

class NICTalk {

	constructor(argv = defaultParams){
		for (let prop in defaultParams) this[prop] = argv[prop] ? argv[prop] : defaultParams[prop];
	}

	setParams (argv) {
		for (let prop in defaultParams) this[prop] = argv[prop] ? argv[prop] : this[prop];
	}
	setLanguage (language) {
		this.language = language ? language : this.language;
	}
	setDirectory (directory) {
		this.directory = directory ? directory : this.directory;
	}

	speak (...argvs) {
		argvs = typeof argvs[0] === 'object' ? argvs[0] : argvs;
		var file = argvs[0],
				text = argvs.length > 1 ? argvs[1] : "",
				callback = argvs.length > 1 ? argvs[argvs.length - 1] : "",
				path = this.directory + file + ".wav";
		if(argvs.length === 2){
			typeof argvs[1] === 'function' ? text = "" : callback = "";
		}
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
					}]
			}),
			json: true
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) {
				try {
					fs.writeFile(path, body["result"]["audio"], "base64", () => {
						return _play(path, callback);
					});
				} catch (e) {
					return console.log(e);
				}
			} else {
				console.log(error);
			}
		}).on("error", (err) => console.log(err));
	}

}

var _play = (...argv) => {
  var mediaSoundPlayer = '"(New-Object System.Media.SoundPlayer "' + filepath + '").PlaySync()',
  		player = process.platform === 'darwin' ? 'afplay' : 'aplay',
			filepath = typeof argv[0] === 'string' ? [argv[0]] : argv[0],
		  callback = argv[1] ? argv[1] : (error) => {if(error) throw error};

  return process.platform === 'win32' ?
		childProcess.exec('powershell.exe ' + mediaSoundPlayer, callback) :
		childProcess.execFile(player, filepath, callback);
};

module.exports = NICTalk;

if (require.main && require.main.id === module.id) (new module.exports()).speak(process.argv.slice(2));
