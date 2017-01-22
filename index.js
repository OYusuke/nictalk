#!/usr/bin/env node
'use strict';

const fs = require('fs'),
      http = require('http'),
      childProcess = require('child_process');

const defaultParams = {
  'version': '1.1',
  'language': 'ja',
  'voiceType': '*',
  'audioType': 'audio/x-wav',
  'directory': ''
};

class NICTalk {

  constructor(argv = defaultParams) {
    for (let prop in defaultParams) this[prop] = argv[prop] ? argv[prop] : defaultParams[prop];
  }

  setParams(argv) {
    for (let prop in defaultParams) this[prop] = argv[prop] ? argv[prop] : this[prop];
  }
  setLanguage(language) {
    this.language = language ? language : this.language;
  }
  setDirectory(directory) {
    this.directory = directory ? directory : this.directory;
  }

  speak(...argvs) {
    argvs = typeof argvs[0] === 'object' ? argvs[0] : argvs;
    var file = argvs[0],
    text = argvs.length > 1 ? argvs[1] : '',
    callback = argvs.length > 1 ? argvs[argvs.length - 1] : '',
    path = this.directory + file + '.wav';
    argvs.length === 2 && (typeof argvs[1] === 'function' ? text = '' : callback = '');

    var postData = JSON.stringify({
      method: 'speak',
      params: [this.version, {
        'language': this.language,
        'text': text,
        'voiceType': this.voiceType,
        'audioType': this.audioType
      }]
    });
    text ? _getSound(path, postData, callback) : _playSound(path, callback);
  }
}

var _playSound = (...argv) => {
  var mediaSoundPlayer = '"(New-Object System.Media.SoundPlayer "' + filepath + '").PlaySync()',
  player = process.platform === 'darwin' ? 'afplay' : 'aplay',
  filepath = typeof argv[0] === 'string' ? [argv[0]] : argv[0],
  callback = argv[1] ? argv[1] : (error) => {
    if (error) throw error;
  };

  return process.platform === 'win32' ?
  childProcess.exec('powershell.exe ' + mediaSoundPlayer, callback) :
  childProcess.execFile(player, filepath, callback);
};

var _getSound = (path, postData, callback) => {
  var options = {
    hostname: 'rospeex.ucri.jgn-x.jp',
    method: 'POST',
    path: '/nauth_json/jsServices/VoiceTraSS',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  var req = http.request(options, (res) => {
    var data = "";
    res.setEncoding('utf8')
    .on('data', (chunk) => data += chunk)
    .on('end', () => {
      try {
        fs.writeFile(path, JSON.parse(data).result.audio, 'base64', () => {
          return _playSound(path, callback);
        });
      } catch (e) {
        return console.log(e);
      }
    });
  }).on('error', (e) => console.log(e));
  req.write(postData);
  req.end();
};

module.exports = NICTalk;

require.main && require.main.id === module.id && (new module.exports()).speak(process.argv.slice(2));
