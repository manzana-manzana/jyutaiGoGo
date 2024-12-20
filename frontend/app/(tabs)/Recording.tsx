import { Button, View, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { useAtom } from "jotai";
import { uriAtom } from "../atom";

const recordingOptions: any = {
  android: {
    extension: ".wav", // または ".m4a"
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav", // または ".m4a"
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
};

export default function Recording() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useAtom(uriAtom); // 保存した録音のURI
  const [sound, setSound] = useState<Audio.Sound | null>(null); // 再生用サウンド

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    if (recording) {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // 録音したファイルのURIを取得
      setAudioUri(uri); // URIを保存
      console.log("Recording stored at", uri);
      setRecording(null);
    }
  }

  async function playAudio() {
    if (audioUri) {
      try {
        console.log("Loading sound...");
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);

        console.log("Playing sound...");
        await sound.playAsync();
      } catch (err) {
        console.error("Failed to play sound", err);
      }
    } else {
      console.log("No audio URI found");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button onPress={startRecording} title="Start Recording" />
      </View>
      <View style={styles.buttonWrapper}>
        <Button onPress={stopRecording} title="Stop Recording" />
      </View>
      <View style={styles.buttonWrapper}>
        <Button onPress={playAudio} title="Play Audio" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    marginVertical: 8,
    width: "80%",
  },
});
