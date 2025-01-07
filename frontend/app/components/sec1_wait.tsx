import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {styles} from "@/app/style";
import {useAtom} from "jotai";
import {apiAddressAtom, isJamAtom, isTalkAtom} from "@/app/atom";
import {amiVoice} from "@/app/components/sec1_wait_amiVoice";
import {useAtomValue} from "jotai/index";
import { Audio, Video } from "expo-av";


export default function Sec1_Wait()  {
    const [isJam, setIsJam] = useAtom(isJamAtom)//テスト用に設置。本来は位置取得時にSet。
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const apiAddress = useAtomValue(apiAddressAtom)//APIアドレス（頭部分）
    const [isReording, setIsRecording] = useState(false)
    const [recordingText, setRecordingText] = useState('')
    const [isRecordingSuccessful, setIsRecordingSuccessful] = useState(false)

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
            <Video
                source={require('../../assets/movies/sec1_wait.mp4')}
                style={{ width: '70%', height: '40%' }}
                useNativeControls={false} // react-native-video の controls={false} に相当
                isLooping // react-native-video の repeat={true} に相当
            />
            <View style={thisStyles.overlay}>
                <Text style={thisStyles.overlayText}>待機中...</Text>
                {/*<Text style={[thisStyles.overlayText,{top:'50%',fontSize: 20}]}>jam: {String(isJam)}/ rec: {String(isReording)}</Text>*/}
                <Button title='渋滞発生（クリック）' onPress={()=>{setIsJam(!isJam); setIsRecordingSuccessful(false)}}
                        color="pink" accessibilityLabel="button"/>
            </View>
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
        top: '15%',
        width:200,
        height:200,
        color: 'gray',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        textAlign: 'center',
    },

    overlayText: {
        position: 'absolute',
        top: '19%',
        color: '#2B2B2B',
        fontSize: moderateScale(40),
        fontFamily: 'BIZ UDPGothic',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    jamArea: {
        position: 'absolute',
        // justifyContent: 'space-between',
        alignItems: 'center',
        justifyContent: "center",
        top: '36%',
        width:'95%',
        height: '17%',
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
