import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {styles} from "@/app/style";
import {moderateScale} from "react-native-size-matters";


export default function Sec0_2_Opening()  {
    return (
        <View style={styles.container}>
            <Image style={thisStyles.toyota}
                   resizeMode='contain'
                   source={require('../../assets/images/sec0_2_TOYOTA.png')}/>
            <Image style={thisStyles.dig}
                   resizeMode='contain'
                   source={require('../../assets/images/sec0_2_DIG.png')}/>
        </View>
    );
};


const thisStyles = StyleSheet.create({
    toyota: {
        // borderStyle:'solid',
        // borderWidth:1,
        position: 'absolute',
        top: '27%',
        width: '58%',
        height: '6%'
    },
    dig: {
        // borderStyle:'solid',
        // borderWidth:1,
        position: 'absolute',
        top: '48%',
        width: '58%',
        height: '28%'
    },
});