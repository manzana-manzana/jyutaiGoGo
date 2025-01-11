import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput,  Pressable} from 'react-native';
import {styles} from "@/app/style";
import Metrics from './metrics'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {screenAtom, userNameAtom, usersAtom} from "@/app/atom";
import {useAtom} from "jotai";
const { horizontalScale, verticalScale, moderateScale } = Metrics;


export default function Sec0_4_username()  {
    const [text, setText] = useState('');
    const [userName, setUserName] = useAtom<string>(userNameAtom)
    const [screen, setScreen] = useAtom(screenAtom)

    const registerUserName=async ()=>{
        console.log('registerUserName')
        await AsyncStorage.setItem("username", text);
        setUserName(text)
        setScreen('sec1')
        console.log('registerUserName_end')
    }



    return (

        <View style={styles.container}>
            <View style={thisStyles.area}>
                <Text style={thisStyles.text}>名前登録してね</Text>
                <TextInput
                    style={[thisStyles.input,thisStyles.text]}
                    onChangeText={setText}
                    value={text}
                    keyboardType={'name-phone-pad'}
                    />
                <Pressable style={thisStyles.button} onPress={registerUserName} >
                    <Text style={thisStyles.text}>登録</Text>
                </Pressable>

                {/*<Pressable style={thisStyles.button} onPress={getUserName} >*/}
                {/*    <Text style={thisStyles.text}>かくにん</Text>*/}
                {/*</Pressable>*/}
            </View>
        </View>
    );
};

const thisStyles = StyleSheet.create({
    area:{
        position: 'absolute',
        top: verticalScale(29),
        height: verticalScale(30),
        width: horizontalScale(90),
        // justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor:'white'
    },
    text: {
        fontSize: moderateScale(22),
        textAlign: 'center',
        color: '#2B2B2B',
        fontFamily:  'BIZ UDPGothic',
    },
    input: {
        width: horizontalScale(70),
        height: verticalScale(6),
        // margin: 12,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    button: {
        // position: 'absolute',
        // top: verticalScale(75),//あとで再計算
        width: horizontalScale(20),
        height: verticalScale(9),
        borderRadius: 40,
        backgroundColor:'#737373',
        justifyContent: 'center',
        alignItems: 'center',
    },
});