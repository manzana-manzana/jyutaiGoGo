import React, { useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { moderateScale } from 'react-native-size-matters';
import { styles } from '@/app/style'; // ユーザー独自のスタイルをインポート

export default function Sec0_3_Opening() {
    // Video を操作したい場合は useRef を用意しておく
    const videoRef = useRef(null);

    return (
        <View style={styles.container}>
            <Video
                ref={videoRef}
                source={require('../../assets/movies/sec0_3_opening.mp4')}
                style={{ width: '100%', height: '100%' }}
                resizeMode={ResizeMode.COVER} // react-native-videoの "resizeMode='cover'" に相当
                isLooping // react-native-video の repeat={true} に相当
                shouldPlay // デフォルトで自動再生したい場合（react-native-video の autoplay に相当）
                useNativeControls={false} // react-native-video の controls={false} に相当
            />
            <Text style={thisStyles.overlayText}>渋滞GO！GO！</Text>
        </View>
    );
};

const thisStyles = StyleSheet.create({
    overlayText: {
        position: 'absolute',
        top: '20%',
        color: 'blue',
        fontSize: moderateScale(50),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
