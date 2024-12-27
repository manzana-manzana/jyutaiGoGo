import {Button, View, StyleSheet, Text} from "react-native";
import { Audio } from "expo-av";
import React, { useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import {apiAddressAtom, storedAtom, testAtom, uriAtom} from "../atom";

export const amiVoice = {
    recording: null,
    startRecording: async()=> {
        console.log('-startRecording_________________________')
        const recordingOptions= {
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

        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const newRecording = new Audio.Recording();
            await newRecording.prepareToRecordAsync(recordingOptions);
            await newRecording.startAsync();
            this.recording = newRecording

        } catch (err) {
            console.error("Failed to start recording", err);
        }
    }
    ,
     stopRecording:async(apiAddress) =>{
        console.log('stopRecording_________________________')
        if (this.recording) {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            console.log("f/uri;", JSON.stringify({uri}));

            const formData = new FormData();
            formData.append("file", {
                uri: uri, //fileData.uri,
                type: "audio/wav",//fileData.type,
                name: "test.wav"//fileData.name,
            });

            const voiceText = await fetch(`${apiAddress}/api/jyutai/voice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            let resA = await voiceText.json();
            resA = resA.text
            console.log('resA変換前',resA)

            //ひらがな変換
            const katakanaToHiragana = (str) => {
                return str.replace(/[\u30A1-\u30F6]/g, function(match) {
                    return String.fromCharCode(match.charCodeAt(0) - 0x60);
                });
            }

            //全角変換
            const  toFullWidth = (str) => {
                return str.replace(/[\x20-\x7E]/g, function (char) {
                    const code = char.charCodeAt(0);
                    if (code >= 33 && code <= 126) {
                        return String.fromCharCode(code + 0xFEE0);
                    }
                    return char;
                });
            }

            resA = katakanaToHiragana(resA)
            resA = toFullWidth(resA)
            console.log("resA:",resA)

            this.recording = null

            //「ひらがな、漢字、全角英字」で判定　（カタカナ、半角は除く）
            const isRes = !!(resA.includes("はい") ||
                resA.includes("ＯＫ") ||
                resA.includes("いえす"));

            return {isRes: isRes, text: resA }
        }
    }
}
