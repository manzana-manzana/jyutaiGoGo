import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Animated,
  Alert,
} from "react-native";
import { styles } from "@/app/style";
import Metrics from "./metrics";
import { clientIdAtom, screenAtom, usernameAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { useFetchClientId } from "@/app/features/fetchClientId";
// ここは別名で受け取る
import { useUsernameRegistration } from "@/app/features/usernameRegistration";
import { generateUser } from "@/app/features/generateUser";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { horizontalScale, verticalScale, moderateScale } = Metrics;

export default function Sec0_4_username() {
  const [text, setText] = useState("");
  const [userName, setUserName] = useAtom(usernameAtom);
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const [screen, setScreen] = useAtom(screenAtom);
  const [isDisplayInput, setIsDisplayInput] = useState(false);

  // ▼ カスタムフックは「customUsernameRegister」という別名で受け取る
  const customUsernameRegister = useUsernameRegistration();
  const { fetchClientId } = useFetchClientId();

  // 名前の変更を監視
  useEffect(() => {
    setUserName(text);
    console.log("名前入力中: ", text);
  }, [text]);

  // 実際に呼び出す登録処理関数 (ボタンから呼び出す想定)
  const registerUsername = async () => {
    console.log("registerUsername_start");
    console.log("🐯username: ", userName);
    try {
      // 1. ユーザー名を AsyncStorage にセット
      await AsyncStorage.setItem("username", text);

      // 2. DBにユーザー登録
      const clientId = await generateUser(text);
      console.log(
        `✅ id: ${clientId} を string 型で AsyncStorage に保存しました。`,
      );

      // 3. idもストレージに保存
      await AsyncStorage.setItem("clientId", String(clientId));
    } catch (error) {
      console.error("useUsernameRegistrationに失敗", error);
    }

    // 画面表示側のステート更新
    setUserName(text);
    setIsDisplayInput(false);
    moveCar(67, -50, true);

    console.log("registerUsername_end");
  };

  // 初期位置
  const [position, setPosition] = useState({
    top: new Animated.Value(verticalScale(28)),
    left: new Animated.Value(horizontalScale(100)),
  });

  const moveCar = (topPoint: number, leftPoint: number, isEnd: boolean) => {
    Animated.parallel([
      Animated.timing(position.left, {
        toValue: horizontalScale(leftPoint), //36
        duration: 2000,
        useNativeDriver: false,
      }),
      Animated.timing(position.top, {
        toValue: verticalScale(topPoint), //44
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (isEnd) {
        //終了時
        setScreen("sec1");
      } else {
        //開始時
        setIsDisplayInput(true);
      }
    });
  };

  // コンポーネントマウント時に実行
  useEffect(() => {
    console.log("effect------");
    moveCar(44, 36, false);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: "100%" }}
        source={require("../../assets/images/sec4_room.png")}
      />

      <Animated.View
        style={{
          position: "absolute",
          top: position.top,
          left: position.left,
        }}
      >
        <Image
          style={{ width: horizontalScale(27) }}
          resizeMode="contain"
          source={require("../../assets/images/cars/car_name.png")}
        />

        {/* 名前を入力するバルーン部分 */}
        <View style={[{ opacity: isDisplayInput ? 1 : 0 }, thisStyles.area]}>
          <Image
            style={{ width: horizontalScale(100) }}
            resizeMode="contain"
            source={require("../../assets/images/bubbles/b_name.png")}
          />
          <Text style={thisStyles.text}>あなたの名前を入力してください</Text>
          <TextInput
            style={[thisStyles.input]}
            onChangeText={setText}
            value={text}
            keyboardType={"name-phone-pad"}
            placeholder="5文字以内"
            placeholderTextColor="#646464"
            autoCorrect={false}
            maxLength={5}
          />
          <Pressable style={thisStyles.button} onPress={registerUsername}>
            <Text style={thisStyles.buttonText}>登録</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const thisStyles = StyleSheet.create({
  area: {
    position: "absolute",
    top: verticalScale(-20),
    height: verticalScale(20),
    left: horizontalScale(-36),
    alignItems: "center",
  },
  text: {
    position: "absolute",
    top: verticalScale(3),
    fontSize: moderateScale(18),
    textAlign: "center",
    fontWeight: "bold",
    color: "#2B2B2B",
    fontFamily: "BIZ UDPGothic",
  },
  input: {
    position: "absolute",
    top: verticalScale(7),
    width: horizontalScale(31),
    height: verticalScale(5),
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#D9D9D9",
    fontWeight: "bold",
    fontSize: moderateScale(20),
    textAlign: "center",
    color: "#2B2B2B",
    fontFamily: "BIZ UDPGothic",
  },
  button: {
    position: "absolute",
    top: verticalScale(7),
    left: horizontalScale(68),
    width: horizontalScale(15),
    height: verticalScale(5),
    borderRadius: 6,
    backgroundColor: "#737373",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: moderateScale(20),
    color: "white",
    fontWeight: "bold",
    fontFamily: "BIZ UDPGothic",
  },
});
