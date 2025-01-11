import React from 'react';
import {StyleSheet, Text, View, Dimensions } from 'react-native';
import {styles} from "@/app/style";
// import {moderateScale} from "react-native-size-matters";
import {useFonts, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import Metrics from './metrics'
const { verticalScale, moderateScale } = Metrics;

// import {vw, vh} from 'react-native-viewport-units';

export default function Sec0_1_Opening()  {
    let [fontsLoaded] = useFonts({
        NotoSansJP_700Bold,
    });

    return (

        <View style={styles.container}>
        <View style={thisStyles.area}>
            <Text style={[thisStyles.text]}>
            本アプリを走行しながら{"\n"}
            操作することはお控えください。{"\n"}
            ながら運転は道路交通法により{"\n"}
            禁止されています。
            </Text>
            <Text style={[{fontFamily:'NotoSansJP_700Bold'}, thisStyles.text]}>
            イヤホンの使用はお控えください。{"\n"}
            道路交通法70条に定められた{"\n"}
            安全運転の義務に違反する{"\n"}
            可能性があります。
            </Text>
        </View>
        </View>
    );
};

const thisStyles = StyleSheet.create({
    area:{
        position: 'absolute',
        top: verticalScale(29),
        height: verticalScale(42),
        width:'100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        width: '100%',
        height: verticalScale(21),
        fontSize: moderateScale(22),
        textAlign: 'center',
        color: '#2B2B2B',
        fontFamily: 'NotoSansJP_700Bold',
        // backgroundColor:"pink"
    },

});