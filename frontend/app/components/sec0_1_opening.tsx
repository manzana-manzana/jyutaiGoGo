import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {styles} from "@/app/style";
import {moderateScale} from "react-native-size-matters";
// import {useFonts} from "expo-font";
import {useFonts, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
//Inter_900Black
export default function Sec0_1_Opening()  {
    // const notoSansJP = useFonts(require('../../assets/font/Noto_Sans_JP/static/NotoSansJP-Bold.ttf'))
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
            禁止されています。google
            </Text>
            {/*{fontFamily:NotoSansJP_700Bold},*/}
            <Text style={[{fontFamily:'NotoSansJP_700Bold'}, thisStyles.text]}>
            イヤホンの使用はお控えください。{"\n"}
            道路交通法70条に定められた{"\n"}
            安全運転の義務に違反する{"\n"}
            可能性があります。google
            </Text>
        </View>
        </View>
    );
};

const thisStyles = StyleSheet.create({
    area:{
        position: 'absolute',
        top: '29%',
        height: '42%',
        justifyContent: 'space-between',

    },
    text: {
        // borderStyle:'solid',
        // borderWidth:1,

        // top: '27%',
        // width: '58%',
        // height: '6%',
        fontSize: moderateScale(22),
        textAlign: 'center',
        color: '#2B2B2B',
        fontFamily: 'NotoSansJP_700Bold'
    },

});