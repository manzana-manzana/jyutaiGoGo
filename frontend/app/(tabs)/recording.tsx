//
// import {Button, View, StyleSheet, Text} from "react-native";
// import { Audio } from "expo-av";
// import React, { useState } from "react";
// import { useAtom, useAtomValue } from "jotai";
// import {apiAddressAtom, storedAtom, testAtom, uriAtom} from "../atom";
//
// export default function Recording() {
//     const [recording, setRecording] = useState<Audio.Recording | null>(null);
//     const [audioUri, setAudioUri] = useAtom(uriAtom); // 保存した録音のURI
//     const [sound, setSound] = useState<Audio.Sound | null>(null); // 再生用サウンド
//     const [test, setTest]=useState('aaa')
//     const [result, setResult] = useState<string | null>(null);
//     const [backRes, setBackRes] = useState("aaa")//テスト用
//     const apiAddress = useAtomValue(apiAddressAtom)//APIアドレス（頭部分）
//
//     async function startRecording() {
//         const recordingOptions: any = {
//             android: {
//                 extension: ".wav", // または ".m4a"
//                 outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
//                 audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
//                 sampleRate: 44100,
//                 numberOfChannels: 1,
//                 bitRate: 128000,
//             },
//             ios: {
//                 extension: ".wav", // または ".m4a"
//                 outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
//                 audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
//                 sampleRate: 44100,
//                 numberOfChannels: 1,
//                 bitRate: 128000,
//             },
//         };
//
//         try {
//             await Audio.requestPermissionsAsync();
//             await Audio.setAudioModeAsync({
//                 allowsRecordingIOS: true,
//                 playsInSilentModeIOS: true,
//             });
//             const newRecording = new Audio.Recording();
//             await newRecording.prepareToRecordAsync(recordingOptions);
//             await newRecording.startAsync();
//             setRecording(newRecording);
//
//         } catch (err) {
//             console.error("Failed to start recording", err);
//         }
//     }
//
//     async function stopRecording() {
//         console.log('stopRecording_________________________')
//         if (recording) {
//             await recording.stopAndUnloadAsync();
//             const uri = recording.getURI();
//             setAudioUri(uri);
//             console.log("f/uri;", JSON.stringify({ uri }));
//
//             const formData = new FormData();
//             formData.append("file", {
//                 uri: uri, //fileData.uri,
//                 type: "audio/wav",//fileData.type,
//                 name: "test.wav"//fileData.name,
//             });
//
//             const voiceText = await fetch(`${apiAddress}/api/jyutai/voice`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 },
//                 body: formData,
//             });
//
//             const responseJson = await voiceText.json();
//
//             console.log("responseJson",responseJson.text )
//             setResult(responseJson.text);
//             setRecording(null);
//         }
//     }
//
//     const apiTest = ()=>{
//         //テスト用関数。後で削除する。
//         console.log('apiTest--')
//
//         fetch(`${apiAddress}/api/jyutai/voice`)
//         .then(res => res.text())
//         .then(res => setTest(res))
//     }
//
//     return (
//         <View style={styles.container}>
//             <View style={styles.buttonWrapper}>
//                 <Button onPress={startRecording} title="Start Recording" />
//             </View>
//             <View style={styles.buttonWrapper}>
//                 <Button onPress={stopRecording} title="Stop Recording" />
//             </View>
//             {/*<View style={styles.buttonWrapper}>*/}
//             {/*    <Button onPress={playAudio} title="Play Audio" />*/}
//             {/*</View>*/}
//             <View style={styles.buttonWrapper}>
//                 <Button onPress={apiTest} title="apiTest" />
//                 <Text style={{backgroundColor: 'white'}}>{result}</Text>
//                 <Text style={{backgroundColor: 'pink'}}>test:{test}</Text>
//                 <Text style={{backgroundColor: 'white'}}>back:{backRes}</Text>
//             </View>
//
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     buttonWrapper: {
//         marginVertical: 8,
//         width: "80%",
//     },
// });
