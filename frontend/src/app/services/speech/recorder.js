//adopted for IBM 2017-01-27 wln

"use strict";
module.exports = (function (Resampler) {
	// variables
	var leftchannel = [];
	var recorder = null;
	var recording = false;
	var recordingLength = 0;
	var volume = null;
	var audioInput = null;
	var sampleRate = null;
	var outputsampleRate = 16000;
	var audioContext = null;
	var context = null;
	var outputString;
	var blob = null;
	var searchEngineURL = null;

	// feature detection
	if (!navigator.getUserMedia)
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia || navigator.msGetUserMedia;

	if (navigator.getUserMedia) {
		navigator.getUserMedia({audio:true}, success, function(e) {
			alert('Error capturing audio.');
		});
	}
	else
		alert('getUserMedia not supported in this browser.');


	///////////////////////////////////////////////////////////
	// Start/stop recording events
	///////////////////////////////////////////////////////////

	function recordstart() {
		if (!recording) {
			recording = true;
			// reset the buffers for the new recording
			leftchannel.length = 0;
			recordingLength = 0;
		}
	}

	function recordstop() {
		// we stop recording
		recording = false;

		// we flat the left channel down
		var leftBuffer = mergeBuffers ( leftchannel, recordingLength );
		var interleaved = leftBuffer;

		// we create our wav file
		var buffer = new ArrayBuffer(44 + interleaved.length * 2);
		var view = new DataView(buffer);

		// RIFF chunk descriptor
		writeUTFBytes(view, 0, 'RIFF');
		view.setUint32(4, 44 + interleaved.length * 2, true);
		writeUTFBytes(view, 8, 'WAVE');
		// FMT sub-chunk
		writeUTFBytes(view, 12, 'fmt ');
		view.setUint32(16, 16, true);
		view.setUint16(20, 1, true);
		// mono (1 channel)
		view.setUint16(22, 1, true);
		view.setUint32(24, outputsampleRate, true);
		view.setUint32(28, outputsampleRate * 2, true);
		view.setUint16(32, 2, true);
		view.setUint16(34, 16, true);
		// data sub-chunk
		writeUTFBytes(view, 36, 'data');
		view.setUint32(40, interleaved.length * 2, true);

		console.log("Write len: " + interleaved.length);

		// write the PCM samples
		var lng = interleaved.length;
		var index = 44;
		var volume = 1;
		// convert to 16bit signed int
		for (var i = 0; i < lng; i++){
			view.setInt16(index, interleaved[i] * (0x7FFF * volume), true);
			index += 2;
		}

		// give blob(recording) to upload function
		blob = new Blob ( [ view ], { type : 'audio/wav' } );
		//upload(blob);
		return blob;
	}



	///////////////////////////////////////////////////////////
	// Upload function
	//
	// -- Crucial Part --
	//
	///////////////////////////////////////////////////////////

	function escapeHtml(unsafe) {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	///////////////////////////////////////////////////////////
	// MergeBuffers function
	///////////////////////////////////////////////////////////

	function mergeBuffers(channelBuffer, recordingLength){
		var result = new Float32Array(recordingLength);
		var offset = 0;
		var lng = channelBuffer.length;
		for (var i = 0; i < lng; i++){
			var buffer = channelBuffer[i];

			result.set(buffer, offset);
			offset += buffer.length;
		}
		return result;
	}

	function writeUTFBytes(view, offset, string){
		var lng = string.length;
		for (var i = 0; i < lng; i++){
			view.setUint8(offset + i, string.charCodeAt(i));
		}
	}

	///////////////////////////////////////////////////////////
	// If GetUserMedia gets access to mic
	///////////////////////////////////////////////////////////

	function success(e){
		// creates the audio context
		audioContext = window.AudioContext || window.webkitAudioContext;
		context = new audioContext();

		// we query the context sample rate (varies depending on platforms)
		sampleRate = context.sampleRate;

		console.log('succcess');

		console.log("Samplerate: " + sampleRate);

		// creates a gain node
		volume = context.createGain();

		// creates an audio node from the microphone incoming stream
		audioInput = context.createMediaStreamSource(e);

		// connect the stream to the gain node
		audioInput.connect(volume);

			/* From the spec: This value controls how frequently the audioprocess event is
		dispatched and how many sample-frames need to be processed each call.
		Lower values for buffer size will result in a lower (better) latency.
		Higher values will be necessary to avoid audio breakup and glitches */
		var bufferSize = 2048;
		recorder = context.createScriptProcessor(bufferSize, 2, 2);

		var resampler = new Resampler(sampleRate, outputsampleRate, 1, Math.ceil(bufferSize/sampleRate*outputsampleRate), false);

		recorder.onaudioprocess = function(e) {
			if (!recording) return;

			var left = e.inputBuffer.getChannelData (0);
			var left_resampled = resampler.resampler(left, left.length);

			leftchannel.push (left_resampled.slice());
			recordingLength += left_resampled.length;
		}

		// we connect the recorder
		volume.connect (recorder);
		recorder.connect (context.destination);
	}

	return {
		recordStart: recordstart,
		recordStop: recordstop,
		escapeHtml: escapeHtml,
		mergeBuffers: mergeBuffers,
		writeUTFBytes: writeUTFBytes,
		success: success
	}

});
