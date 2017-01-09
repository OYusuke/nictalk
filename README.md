# nictalk
npm module for TTS with NICT

[![NPM](https://nodei.co/npm/nictalk.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nictalk/)

[![Build Status](https://travis-ci.org/OYusuke/nictalk.svg?branch=master)](https://travis-ci.org/OYusuke/nictalk)
[![npm version](https://badge.fury.io/js/nictalk.svg)](https://badge.fury.io/js/nictalk)
[![Dependency Status](https://gemnasium.com/badges/github.com/OYusuke/nictalk.svg)](https://gemnasium.com/github.com/OYusuke/nictalk)
[![Code Climate](https://codeclimate.com/repos/5873bfe4d977d62336001f6a/badges/1077f22d0c74e475197b/gpa.svg)](https://codeclimate.com/repos/5873bfe4d977d62336001f6a/feed)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

### About nictalk
You can use TTS  with nictalk. This module relies on NICT for sounds generation through the Internet.

All processes of TTS (text to speech) are combined into only one command.

I diverted the code of simplayer to a speech.

t`npm install nictalk`.

t`npm install nictalk -g`.

```ruby:qiita.rb
var defaultParams = {
	"version" : "1.1",
	"language" : "ja",
	"voiceType" : "*",
	"audioType" : "audio/x-wav",
	"directory" : ""
};
```