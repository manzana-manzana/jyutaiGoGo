import React, {useEffect} from 'react';
import {Animated, Image, StyleSheet, View} from 'react-native';
import {styles} from "@/app/style";
// import {moderateScale} from "react-native-size-matters";
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics

export default function Sec0_2_Opening()  {
    const fadeAnim = new Animated.Value(0);
    useEffect(() => {
        // 2. アニメーションの定義
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);


    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <View style={styles.container}>
                <Image style={thisStyles.toyota}
                       resizeMode='contain'
                       source={require('../../assets/images/sec0_2_TOYOTA.png')}/>
                <Image style={thisStyles.dig}
                       resizeMode='contain'
                       source={require('../../assets/images/sec0_2_DIG.png')}/>
            </View>
        </Animated.View>
    );
};


const thisStyles = StyleSheet.create({
    toyota: {
        position: 'absolute',
        top: verticalScale(27),
        width: horizontalScale(58),
        height: verticalScale(6)
    },
    dig: {
        position: 'absolute',
        top: verticalScale(48),
        width: horizontalScale(58),
        height: verticalScale(28)
    },
});