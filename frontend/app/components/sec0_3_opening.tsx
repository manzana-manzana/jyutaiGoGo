import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet, Image, ImageSourcePropType, Animated} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
// import { moderateScale } from 'react-native-size-matters';
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics
import { styles } from '@/app/style';
import {useAtomValue} from "jotai/index";
import {carImagesAtom} from "@/app/atom";
import {useAtom, useSetAtom} from "jotai";

export default function Sec0_3_Opening() {
    type CarImages = {
        [key: string]: ImageSourcePropType;
    };
    const carImages = useAtomValue<CarImages>(carImagesAtom)
    const [isTitleDisplay , setIsTitleDisplay]= useState(false)
    const [cars, _] = useState([carImages['c3_1'],carImages['c1_1'],carImages['c5_1'],
                                        carImages['c2_1'],carImages['c7_1'],carImages['c6_1'],])

    // 初期位置
    const [positions, setPositions] = useState(
        new Array(cars.length).fill(0).map((value,index) => ({
            top: new Animated.Value(Number.isInteger(index/2)?
                verticalScale(58):verticalScale(68)),
            left: new Animated.Value(horizontalScale(100)),
            zIndex: Number.isInteger(index/2)? (cars.length - index + 1):(cars.length - index + 1)*2
        }))
    );

    const moveImagesSequentially = () => {

        const animations = positions.map((position, index) => {
            return Animated.parallel([
                Animated.timing(position.left, {
                    toValue: horizontalScale(Number.isInteger(index/2)?
                        Math.floor(14 + Math.floor(index/2) * 18.5):
                        Math.floor(32+ Math.floor(index/2) * 18.5)),
                    duration: 500,
                    useNativeDriver: false,
                }),
                Animated.timing(position.top, {
                    toValue: verticalScale(Number.isInteger(index/2)?
                        Math.floor(80 - Math.floor(index/2) * 5):
                        Math.floor(85 - Math.floor(index/2) * 5)),
                    duration: 500,
                    useNativeDriver: false,
                })
            ]);
        });

        Animated.stagger(100, animations).start(()=>{
            setIsTitleDisplay(true)
        })
    };

    useEffect(() => {
        console.log('effect------')
        moveImagesSequentially();
    }, []);


    return (
        <View style={styles.container}>
            <Image style={{width: '100%', height:'100%'}}
                   source={require('../../assets/images/sec0_3_opening.png')}/>
            {/*<Video*/}
            {/*    ref={videoRef}*/}
            {/*    source={require('../../assets/movies/sec0_3_opening.mp4')}*/}
            {/*    style={{ width: '100%', height: '100%' }}*/}
            {/*    resizeMode={ResizeMode.COVER} // react-native-videoの "resizeMode='cover'" に相当*/}
            {/*    isLooping // react-native-video の repeat={true} に相当*/}
            {/*    shouldPlay // デフォルトで自動再生したい場合（react-native-video の autoplay に相当）*/}
            {/*    useNativeControls={false} // react-native-video の controls={false} に相当*/}
            {/*/>*/}
            <Text style={[{opacity:isTitleDisplay?1:0},thisStyles.overlayText]}>渋滞GO！GO！</Text>

            {cars.map((car, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        top: positions[index].top,
                        left: positions[index].left,
                        zIndex:positions[index].zIndex
                    }}
                >
                    <Image //車
                        source={cars[index]}
                        style={{ width: horizontalScale(25)}}
                        resizeMode='contain'
                    />

                </Animated.View>
            ))}

            <Image
                source={carImages[`cw_4`]}
                style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(86), left: horizontalScale(-6)}}
                resizeMode='contain'
            />
            <Image
                source={carImages[`cw_5`]}
                style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(92), left: horizontalScale(12)}}
                resizeMode='contain'
            />
            <Image
                source={carImages[`cw_6`]}
                style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(97), left: horizontalScale(-7)}}
                resizeMode='contain'
            />
        </View>
    );
};

const thisStyles = StyleSheet.create({
    overlayText: {
        position: 'absolute',
        top: verticalScale(20),
        color: 'blue',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
