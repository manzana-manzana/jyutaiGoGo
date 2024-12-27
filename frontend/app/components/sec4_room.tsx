import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from "@/app/style";

export default function Sec4_Room()  {
    return (
        <View style={styles.container}>
            <Image style={{width: '100%', height:'100%'}}
                   resizeMode='contain'
                   source={require('../../assets/images/sec4_room_6.png')}/>
        </View>
    );
};
