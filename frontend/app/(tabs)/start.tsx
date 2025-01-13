import React, { useRef, useState, useEffect } from 'react';
import {
    Button, Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TouchableHighlight,
    View,
} from 'react-native';
import { PermissionsAndroid, Platform, Image } from 'react-native';
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {isJamAtom, isTalkAtom, screenAtom} from "@/app/atom";
import Metrics from "@/app/components/metrics";
const {horizontalScale, verticalScale, moderateScale} = Metrics

// import Svg, { Rect, LinearGradient, Stop } from 'react-native-svg'; // SvgとLinearGradient、Stopをインポート


// import { LinearGradient } from 'expo-linear-gradient';

export default function Start(props: {
    colors: string[];
    text: string;
    useBorderGradient?: boolean;
    useInnerGradient?: boolean;
})  {
    const [screen, setScreen] = useAtom(screenAtom)
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const setIsJam = useSetAtom(isJamAtom)

    return (
        <View style={{marginTop:50}}>


            <Text>{screen}</Text>
            <Button title='最初に戻る/　ここをクリック後、手動でHomeへGO' onPress={()=>{
                setScreen('sec0_1')
                setIsJam(false)
                setIsTalk(false)
            }}  />
            {/*<Button title='待機中へ戻る' onPress={()=>setScreen('sec1')} />*/}
            <Text>isTalk:{isTalk}</Text>

            <Pressable style={thisStyles.button} onPress={()=>{
                setScreen('sec0_4')

                console.log()
            }} >
                <Text>名前を変える</Text>
            </Pressable>

        </View>
    )
};


const getPermission = async () => {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
    }
};

const thisStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        position: 'absolute',
        top: verticalScale(50),//あとで再計算
        width: horizontalScale(20),
        height: verticalScale(9),
        borderRadius: 40,
        backgroundColor:'#737373',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

