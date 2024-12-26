import React, {useEffect, useState} from 'react';
import Video from 'react-native-video';
import {Button, StyleSheet, Text, View} from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {styles} from "@/app/style";
import {useAtom} from "jotai";
import {apiAddressAtom, isJamAtom, isTalkAtom} from "@/app/atom";
import {amiVoice} from "@/app/components/sec1_wait_amiVoice";
import {useAtomValue} from "jotai/index";
import { Audio } from "expo-av";


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
            await sound.setOnPlaybackStatusUpdate((status) => {
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
                controls={false}
                repeat={true}
            />
            <View style={thisStyles.overlay}>
                <Text style={thisStyles.overlayText}>待機中...</Text>
                <Text style={[thisStyles.overlayText,{top:'50%',fontSize: 20}]}>jam: {String(isJam)}/ rec: {String(isReording)}</Text>
                <Button title='渋滞発生（クリック）' onPress={()=>{setIsJam(!isJam); setIsRecordingSuccessful(false)}}
                        color="pink" accessibilityLabel="button"/>
            </View>
            {/*<View style={thisStyles.jamText}>*/}
                <View style={[thisStyles.jamText, { opacity: isJam ? 1:0 }]}>
                    <Text style={[styles.text,{fontSize:moderateScale(17), fontWeight:'normal'}]}>
                        渋滞に入りました。{"\n"}
                        周囲の人と会話ができます。
                    </Text>
                    <Text style={[styles.text,{fontSize:moderateScale(25), fontWeight:'bold'}]}>会話に参加しますか？</Text>
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
        top: '20%',
        width:200,
        color: 'gray',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        textAlign: 'center',
    },

    jamText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        gap:20,
        top: '40%',
        width:'80%',
        height:150,
        color: 'white',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius:10

    },

});