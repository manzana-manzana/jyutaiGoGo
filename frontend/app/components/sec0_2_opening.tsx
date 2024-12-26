import React from 'react';
import {Image, View} from 'react-native';
import {styles} from "@/app/style";


export default function Sec0_2_Opening()  {
    return (
        <View style={{gap:50}}>
            <Image style={{width: 200}}
                   resizeMode='contain'
                   source={require('../../assets/images/TOYOTA.jpg')}/>
        </View>
    );
};