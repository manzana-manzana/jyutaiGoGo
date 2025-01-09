import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {styles} from "@/app/style";
// import {moderateScale} from "react-native-size-matters";
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics

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
        top: verticalScale(27),
        width: horizontalScale(58),
        height: verticalScale(6)
    },
    dig: {
        // borderStyle:'solid',
        // borderWidth:1,
        position: 'absolute',
        top: verticalScale(48),
        width: horizontalScale(58),
        height: verticalScale(28)
    },
});