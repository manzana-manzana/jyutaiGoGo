import React, { useRef, useState, useEffect } from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { PermissionsAndroid, Platform, Image } from 'react-native';
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {isJamAtom, isTalkAtom, screenAtom} from "@/app/atom";

export default function Start()  {
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


