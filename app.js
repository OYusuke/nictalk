var voice = new(require("/home/pi/nodejs/nictalk/index.js"))({
		"directory": "/home/pi/nodejs/voices/"
	});

voice.speak("voice", "テスト3",() => console.log("test"));