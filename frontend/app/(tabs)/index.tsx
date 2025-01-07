import React, { useRef, useState, useEffect } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PermissionsAndroid, Platform, Image } from 'react-native';
import {useAtom, useSetAtom} from "jotai";
import {isTalkAtom, screenAtom} from "@/app/atom";

import {styles} from "@/app/style";
import Sec3_Read from "@/app/components/sec3_read"
import Sec1_Wait from "@/app/components/sec1_wait";
import Sec0_1_Opening from "@/app/components/sec0_1_opening";
import Sec0_2_Opening from "@/app/components/sec0_2_opening";
import Sec0_3_Opening from "@/app/components/sec0_3_opening";
import Sec4_Room from "@/app/components/sec4_room";

export default function HomeScreen()  {
  const [screen, setScreen] = useAtom(screenAtom)
  const [isTalk, setIsTalk] = useAtom(isTalkAtom)

  useEffect(() => {
    switch (screen){
      case 'sec0_1':
        setTimeout(() => {
          setScreen('sec0_2')
        }, 3000);
      break;
      case 'sec0_2':
        setTimeout(() => {
          setScreen('sec0_3')
        }, 2000);
        break;
      case 'sec0_3':
        setTimeout(() => {
          setScreen('sec1')
        }, 5000);
        break;
      case 'sec1':
        if(isTalk){
          setScreen('sec4')
        }
        break;
      case 'sec4':
        if(!isTalk){
          setScreen('sec1')
        }
        break;
    }
  }, [screen, isTalk]);

  return (
      <View style={styles.container}>

        {screen === "sec0_1" ? <Sec0_1_Opening /> :
            screen === "sec0_2" ? <Sec0_2_Opening /> :
            screen === "sec0_3" ? <Sec0_3_Opening /> :
            screen === "sec1" ? <Sec1_Wait /> :
            // screen === "sec3" ? <Sec3_Read /> :　一旦、後回し
            screen === "sec4" ? <Sec4_Room /> :""
        }

      </View>
  )
};


const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};


