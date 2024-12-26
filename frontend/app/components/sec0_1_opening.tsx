import React from 'react';
import {Text, View} from 'react-native';
import {styles} from "@/app/style";

export default function Sec0_1_Opening()  {
    return (
        <View style={{gap:50}}>
            <Text style={styles.text}>
            本アプリを走行しながら{"\n"}
            操作することはお控えください。{"\n"}
            ながら運転は道路交通法により{"\n"}
            禁止されています。
            </Text>
            <Text style={styles.text}>
            イヤホンの使用はお控えください。{"\n"}
            道路交通法70条に定められた{"\n"}
            安全運転の義務に違反する{"\n"}
            可能性があります。
            </Text>
        </View>
    );
};