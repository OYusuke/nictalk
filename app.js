var voice = new(require("nictalk"))({
		"directory": "/home/pi/nodejs/nictalk/"
	});

voice.speak("voice","テスト");
