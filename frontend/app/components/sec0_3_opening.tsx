import React from 'react';
import {Text, View} from 'react-native';
import Video from "react-native-video";
// import { Video } from 'expo-video';
import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {styles} from "@/app/style";
// import movieFile from "../../assets/movies/sec0_3_opening.mov"

export default function Sec0_3_Opening()  {


    return (
        <View style={styles.container}>
            <Video
                source={require('../../assets/movies/sec0_3_opening.mov')}
                style={{ width: '100%', height: '100%' }}
                controls={false}
                repeat={true}
                resizeMode="cover"
                // shouldPlay={true}
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