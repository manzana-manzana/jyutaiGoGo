import React, { useRef, useState, useEffect } from "react";

import { PermissionsAndroid, Platform, View, Image } from "react-native";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  clientIdAtom,
  isOpeningEndAtom,
  isTalkAtom,
  screenAtom,
  usernameAtom,
} from "@/app/atom";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "@/app/style";
import Sec3_Read from "@/app/components/sec3_read";
import Sec1_Wait from "@/app/components/sec1_wait";
import Sec0_1_Opening from "@/app/components/sec0_1_opening";
import Sec0_2_Opening from "@/app/components/sec0_2_opening";
import Sec0_3_Opening from "@/app/components/sec0_3_opening";
import Sec0_4_username from "@/app/components/sec0_4_username";
import Sec4_Room from "@/app/components/sec4_room";

import { useFonts, NotoSansJP_700Bold } from "@expo-google-fonts/noto-sans-jp";
import { BASE_URL } from "@/config";
import { useFetchClientId } from "@/app/features/fetchClientId";

export default function HomeScreen() {
  const [screen, setScreen] = useAtom(screenAtom);
  const [isTalk, setIsTalk] = useAtom(isTalkAtom);
  const [isOpeningEnd, setIsOpeningEnd] = useAtom(isOpeningEndAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [clientId, setClientId] = useAtom(clientIdAtom);

  const { fetchClientId } = useFetchClientId(); // カスタムフックの呼び出し

  let [fontsLoaded] = useFonts({
    NotoSansJP_700Bold,
  });

  // const getUserName = async () => {
  //   const getName: string | null = await AsyncStorage.getItem("username");
  //   console.log(getName, typeof getName);
  //   if (getName) {
  //     setUsername(getName);
  //   } else {
  //     setUsername("");
  //   }
  // };

  useEffect(() => {
    (async () => {
      const id = await fetchClientId();
      setClientId(id);
      const response = await fetch(`${BASE_URL}/api/users/${id}`);
      const data = await response.json();
      console.log("🍉:", data);
      setUsername(data.username);
    })();
  }, []);

  useEffect(() => {
    switch (screen) {
      case "sec0_1":
        // getUserName();
        setIsOpeningEnd(false);
        setTimeout(() => {
          setScreen("sec0_2");
        }, 3000);
        break;
      case "sec0_2":
        setTimeout(() => {
          setScreen("sec0_3");
        }, 2000);
        break;
      case "sec0_3":
        console.log("end--", isOpeningEnd);
        if (isOpeningEnd) {
          if (!username) {
            setScreen("sec0_4");
          } else {
            setScreen("sec1");
          }
        }
        break;
      case "sec1":
        if (isTalk) {
          setScreen("sec4");
        }
        break;
      case "sec4":
        if (!isTalk) {
          setScreen("sec1");
        }
        break;
    }
  }, [screen, isTalk, isOpeningEnd]);

  return (
    <View style={styles.container}>
      {screen === "sec0_1" ? (
        <Sec0_1_Opening />
      ) : screen === "sec0_2" ? (
        <Sec0_2_Opening />
      ) : screen === "sec0_3" ? (
        <Sec0_3_Opening />
      ) : screen === "sec0_4" ? (
        <Sec0_4_username />
      ) : screen === "sec1" ? (
        <Sec1_Wait />
      ) : // screen === "sec3" ? <Sec3_Read /> :　一旦、後回し
      screen === "sec4" ? (
        <Sec4_Room />
      ) : (
        ""
      )}
    </View>
  );
}

const getPermission = async () => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};
