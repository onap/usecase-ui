export class Recorder {
  mediaStreams: any;
  audioInput: any;
  recorder: any;
  leftDataList: any[] = [];
  rightDataList: any[] = [];

  throwError(message) {
      alert(message);
      throw new function () { this.toString = function () { return message; } };
  }

  // start sound recording
  beforeStartRecord() {
      let getUserMedia = window.navigator.mediaDevices.getUserMedia || null;
      if (!getUserMedia) {
          this.throwError('The current browser does not support recording.');
          return;
      }
      window.navigator.mediaDevices.getUserMedia({
          audio: true
      }).then(mediaStream => {
          this.mediaStreams = mediaStream;
          this.startRecord();
      }).catch(err => {

      })
  }

  startRecord() {
      // Clear data before recording again
      let audioContext = new (window["AudioContext"] || window["webkitAudioContext"])();
      this.recorder = this.createJSNode(audioContext);
      this.recorder.connect(audioContext.destination);
      this.recorder.onaudioprocess = (event) => {
          // console.log(event.inputBuffer);
          let audioBuffer = event.inputBuffer;
          let leftChannelData = audioBuffer.getChannelData(0),
              rightChannelData = audioBuffer.getChannelData(1);
          // console.log(leftChannelData, rightChannelData);
          // need to clone data
          this.leftDataList.push(leftChannelData.slice(0));
          this.rightDataList.push(rightChannelData.slice(0));
      }
      this.audioInput = audioContext.createMediaStreamSource(this.mediaStreams);
  }

  createJSNode(audioContext) {
      const BUFFER_SIZE = 4096;
      const INPUT_CHANNEL_COUNT = 2;
      const OUTPUT_CHANNEL_COUNT = 2;
      let creator = audioContext.createScriptProcessor || audioContext.createJavaScriptNode;
      creator = creator.bind(audioContext);
      return creator(BUFFER_SIZE,
          INPUT_CHANNEL_COUNT, OUTPUT_CHANNEL_COUNT);
  }

  // stop sound recording
  stopRecord() {
      this.mediaStreams.getAudioTracks()[0].stop();
      this.recorder.disconnect();
      this.audioInput.disconnect();
  }

  // Play recording related functional components
  mergeArray(list) {
      let length = list.length * list[0].length;
      let data = new Float32Array(length),
          offset = 0;
      for (let i = 0; i < list.length; i++) {
          data.set(list[i], offset);
          offset += list[i].length;
      }
      return data;
  }

  playRecord() {
    let leftData = this.mergeArray(this.leftDataList);
    let rightData = this.mergeArray(this.rightDataList);
    let allData = this.interleaveLeftAndRight(leftData, rightData);
    let blob = this.createWavFile(allData);
    let _URL = window["URL"] || window["webkitURL"];
    return _URL.createObjectURL(blob);
  }

  // Cross merge left and right channel data
  interleaveLeftAndRight(left, right) {
      let totalLength = left.length + right.length;
      let data = new Float32Array(totalLength);
      for (let i = 0; i < left.length; i++) {
          let k = i * 2;
          data[k] = left[i];
          data[k + 1] = right[i];
      }
      return data;
  }

  createWavFile(audioData) {
      const WAV_HEAD_SIZE = 44;
      let buffer = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE),
      // need to use a view to manipulate the buffer
      view = new DataView(buffer);
      // Write wav header information
      // Resource exchange file identifier
      this.writeUTFBytes(view, 0, 'RIFF');
      // The total number of bytes from the beginning of the next address to the end of the file is - 8
      view.setUint32(4, 44 + audioData.length * 2, true);
      // Wav file flag
      this.writeUTFBytes(view, 8, 'WAVE');
      // Waveform format flag
      this.writeUTFBytes(view, 12, 'fmt ');
      // Filter bytes, generally 0x10 = 16
      view.setUint32(16, 16, true);
      // sample format (raw)
      view.setUint16(20, 1, true);
      // stereo (2 channels)
      view.setUint16(22, 2, true);
      // sample rate
      view.setUint32(24, 44100, true);
      // byte rate (sample rate * block align)
      view.setUint32(28, 44100 * 2, true);
      // block align (channel count * bytes per sample)
      view.setUint16(32, 2 * 2, true);
      // bits per sample
      view.setUint16(34, 16, true);
      // data sub-chunk
      // data chunk identifier
      this.writeUTFBytes(view, 36, 'data');
      // data chunk length
      view.setUint32(40, audioData.length * 2, true);

      // Write PCM data
      let length = audioData.length;
      let index = 44;
      let volume = 1;
      for (let i = 0; i < length; i++) {
          view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
          index += 2;
      }
      return new Blob([new Uint8Array(buffer)], { type: 'audio/wav' });
  }

  writeUTFBytes(view, offset, string) {
      var lng = string.length;
      for (var i = 0; i < lng; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
      }
  }
}