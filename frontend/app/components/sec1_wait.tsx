import React, {useEffect, useRef, useState} from 'react';
import {Animated, Button, Image, StyleSheet, Text, View} from 'react-native';
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics
import {styles} from "@/app/style";
import {useAtom} from "jotai";
import {apiAddressAtom, isJamAtom, isTalkAtom} from "@/app/atom";
// import {amiVoice} from "@/app/components/sec1_wait_amiVoice";
import {useAtomValue} from "jotai/index";
import { Audio, Video } from "expo-av";
import {number} from "prop-types";

// import {Button, View, StyleSheet, Text} from "react-native";
// import { Audio } from "expo-av";
// import React, { useState } from "react";
// import { useAtom, useAtomValue } from "jotai";
// import {apiAddressAtom, storedAtom, testAtom, uriAtom} from "../atom";

const amiVoice = {
    recording: null,
    startRecording: async function(){
        console.log('-startRecording_________________________')
        this.recording = null
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
    stopRecording:async function(apiAddress:string){
        console.log('stopRecording_________________________')
        if (this.recording) {
            await this.recording.stopAndUnloadAsync();
            const uri = this.recording.getURI();
            console.log("f/uri;", JSON.stringify({uri}));

            const formData:any = new FormData();
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
            const katakanaToHiragana = (str:string) => {
                return str.replace(/[\u30A1-\u30F6]/g, function(match) {
                    return String.fromCharCode(match.charCodeAt(0) - 0x60);
                });
            }

            //全角変換
            const  toFullWidth = (str:string) => {
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

export default function Sec1_Wait()  {
    const [isJam, setIsJam] = useAtom(isJamAtom)//テスト用に設置。本来は位置取得時にSet。
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const apiAddress = useAtomValue(apiAddressAtom)//APIアドレス（頭部分）
    const [isReording, setIsRecording] = useState(false)
    const [recordingText, setRecordingText] = useState('')
    const [isRecordingSuccessful, setIsRecordingSuccessful] = useState(false)

    //車ムービー_ここから_______________________________________
    // const position,setPosition] = useState([
    const [position1,setPosition1] =useState(
        {top: new Animated.Value(verticalScale(28)),
        left: new Animated.Value(horizontalScale(100))}
    );
    const [position2, setPosition2]=useState(
        {top: new Animated.Value(verticalScale(37)),
        left: new Animated.Value(horizontalScale(100))}
);

    const setEndPoint = (left:Animated.Value, top:Animated.Value,topNum:number,leftNum:number)=>{
        // console.log("carNum;",carNum)
        return [
            Animated.timing(left, {
                toValue: horizontalScale(leftNum),//11
                duration: 4000,
                useNativeDriver: false,
            })
            ,
            Animated.timing(top, {
                toValue: verticalScale(topNum),//51
                duration: 4000,
                useNativeDriver: false,
            }),

        ]
    }

    useEffect(() => {

            // console.log(position1)
            Animated.loop(

                Animated.sequence([
                    Animated.parallel([
                        Animated.parallel(setEndPoint(position1.left, position1.top, 67, -50)),
                        // Animated.parallel(setEndPoint(position2.left, position2.top, 78, 100)),
                        // Animated.parallel(setEndPoint(position2.left, position2.top, 78, 100)),
                        Animated.parallel(setEndPoint(position2.left, position2.top, 37, 100))
                    ]),
                    Animated.parallel(setEndPoint(position2.left, position2.top, 78, -50)),

                // Animated.parallel(setEndPoint(position2.current.left,position2.current.top,40,90)),
                // Animated.delay(1000),
            ])
            ).start()
            // setPosition1( {top: new Animated.Value(verticalScale(28)),
            //     left: new Animated.Value(horizontalScale(100))})
            // setPosition2( {top: new Animated.Value(verticalScale(35)),
            //     left: new Animated.Value(horizontalScale(100))})
            // ).start()

        // Animated.loop(
        //     Animated.sequence([
                // Animated.delay(1000),
                // Animated.parallel(setEndPoint(position1.current.left,position1.current.top,67)),
            //     Animated.parallel(setEndPoint(position2.current.left,position2.current.top,78)),
            //
            // ])
        // ).start()

        // Animated.loop(
        //     Animated.sequence([
        //     Animated.delay(5000),
        //     Animated.parallel(setEndPoint(1,78)),
        //     ])
        // ).start()
    }, []);
    //車ムービー_ここまで_______________________________________

    const playSound = async () => {
        console.log('load　sound')
        if (isJam) {

            const {sound} = await Audio.Sound.createAsync(
                require('../../assets/voice/sec1_read_kakunin.mp3')
            );
            // setSound(sound);
            await sound.replayAsync();
            sound.setOnPlaybackStatusUpdate((status) => {
                // 1. ステータスが読み込み完了しているかどうかをチェック
                if (!status.isLoaded) {
                    // ここでは status は AVPlaybackStatusError かもしれない
                    console.log('音声のロードに失敗、もしくはまだロード中');
                    return;
                }
                // 2. ステータスが成功かつ loaded であるとわかった時点で
                //    status は AVPlaybackStatusSuccess として扱える
                if (status.didJustFinish) {
                    console.log('音声再生が終了');
                }
            })
        }
    }

    const getAmiVoice = async()=>{
        setIsRecording(true)
        setRecordingText('')
        setIsRecordingSuccessful(false)
        await amiVoice.startRecording()
        setTimeout(async() => {
            setIsRecording(false)
            const amiRes = await amiVoice.stopRecording(apiAddress)

            if (!amiRes) {
                return; // amiResの型ガード (TypeScriptエラー回避)
            }

            console.log("sec1_amires;",amiRes)
            setIsTalk(amiRes.isRes)
            setRecordingText(amiRes.text)
            setIsRecordingSuccessful(true)
        }, 2000);
    }


    useEffect(() => {
        console.log("isJam",isJam)
        if(isJam){
            console.log("play")
            const func = async()=> {
                console.log('isJam実行だよ')
                await playSound()
                console.log('--playおわり')

                setTimeout(async() => {
                    await getAmiVoice()
                }, 2000);
            }
            func().then(()=>{})
        }
        return console.log('')
    }, [isJam]);

    //             sound.unloadAsync();

    return (
        <View style={styles.container}>
            <Image style={{width: '100%', height:'100%'}}
                   resizeMode='contain'
                   source={require('../../assets/images/sec1_wait.png')}/>

            <Animated.View
                style={{
                    position: 'absolute',
                    top: position1.top,
                    left: position1.left,
                }}
            >
                <Image style={{width:horizontalScale(27)}}
                       resizeMode='contain'
                       source={require('../../assets/images/cars/car3_1.png')}/>
            </Animated.View>

            <Animated.View
                style={{
                    position: 'absolute',
                    top: position2.top,
                    left: position2.left,
                }}>
                <Image style={{width:horizontalScale(27)}}
                       resizeMode='contain'
                       source={require('../../assets/images/cars/car3_1.png')}/>
            </Animated.View>


            {/*<Video*/}
            {/*    source={require('../../assets/movies/sec1_wait.mp4')}*/}
            {/*    style={{ width: '70%', height: '40%' }}*/}
            {/*    useNativeControls={false} // react-native-video の controls={false} に相当*/}
            {/*    isLooping // react-native-video の repeat={true} に相当*/}
            {/*/>*/}
            <View style={{position:'absolute', top:'10%', backgroundColor:'yellow'}}>
            <Button title='渋滞発生（クリック）' onPress={()=>{setIsJam(!isJam); setIsRecordingSuccessful(false)}}
                    color="red" accessibilityLabel="button"/>
            </View>
            {/*<View style={thisStyles.overlay}>*/}
            {/*    <Text style={thisStyles.overlayText}>待機中...</Text>*/}
                {/*<Text style={[thisStyles.overlayText,{top:'50%',fontSize: 20}]}>jam: {String(isJam)}/ rec: {String(isReording)}</Text>*/}

            {/*</View>*/}
            {/*<View style={thisStyles.jamText}>*/}
                <View style={[thisStyles.jamArea, { opacity: isJam ? 1:0 }]}>
                    <View style={thisStyles.jamArea2}>
                    <Text style={thisStyles.jamText1}>
                        渋滞に入りました。{"\n"}
                        周囲の人と会話ができます。{"\n"}
                    </Text>
                    <Text style={thisStyles.jamText2}>会話に参加しますか？</Text>
                </View>
                <Text style={[thisStyles.overlayText,
                    {top:'60%', fontSize:moderateScale(30), color:'red',  opacity: isReording ? 1:0 , backgroundColor:"pink"}]}>音声認識中</Text>
                <Text style={[thisStyles.overlayText,
                    {top:'60%', fontSize:moderateScale(20), color:'red',  opacity: !isReording && isRecordingSuccessful ? 1:0 , backgroundColor:"pink"}]}>
                        通話しません。{"\n"}
                    認識した音声：{"\n"}
                    {recordingText}
                </Text>
                </View>
        </View>
    );
};

const thisStyles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: verticalScale(19),
        width: '100%',
        // height:200,
        color: 'gray',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        alignItems:'center'
    },

    overlayText: {
        position: 'absolute',
        // top: verticalScale(10),
        color: '#2B2B2B',
        fontSize: moderateScale(40),
        fontFamily: 'BIZ UDPGothic',
        fontWeight: 'bold',

    },

    jamArea: {
        position: 'absolute',
        // justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: "center",
        top: verticalScale(36),
        width: horizontalScale(95),
        height: verticalScale(17),
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius:10,

    },
    jamArea2:{
        justifyContent: 'center',
    },
    jamText1: {
        fontSize: moderateScale(26),
        fontFamily: 'BIZ UDPGothic',
        textAlign: 'center',
    },
    jamText2: {
        fontSize: moderateScale(30),
        fontWeight: 'bold',
        fontFamily: 'BIZ UDPGothic',
        textAlign: 'center',
    },

});
