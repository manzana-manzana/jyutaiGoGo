import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Animated, Alert,
} from "react-native";
import { styles } from "@/app/style";
import Metrics from "./metrics";
import { clientIdAtom, screenAtom, usernameAtom, usersAtom } from "@/app/atom";
import { useAtom } from "jotai";
import { useFetchClientId } from "@/app/features/fetchClientId";
import { useUsernameRegistration } from "@/app/features/usernameRegistration";
import {generateUser} from "@/app/features/generateUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { horizontalScale, verticalScale, moderateScale } = Metrics;

export default function Sec0_4_username() {
  const [text, setText] = useState("");
  const [userName, setUserName] = useAtom(usernameAtom);
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const [screen, setScreen] = useAtom(screenAtom);
  const [isDisplayInput, setIsDisplayInput] = useState(false);

  const { fetchClientId } = useFetchClientId(); // カスタムフックの呼び出し
  // const usernameRegister = useUsernameRegistration();

  // useEffect(() => {
  //   setUserName(text);
  //   console.log("名前入力中: ", text);
  // }, [text]);


  // const usernameRegister=async ()=>{
  //
  //   console.log('registerUserName')
  //   await AsyncStorage.setItem("username", text);
  //   setUserName(text)
  //   // setScreen('sec1')
  //   setIsDisplayInput(false)
  //   moveCar(67,-50,true)
  //   const clientId = await generateUser(text);
  //   console.log(
  //               `✅ id: ${clientId} をstring型でAsyncStorageに保存しました。`,
  //           );
  //   console.log('registerUserName_end')
  // }
  // const usernameRegister = async() =>{
  //   try {
  //     // 1. generateUserでusersテーブルにユーザー登録
  //     if (!username) {
  //       return;
  //     }
  //     const clientId = await generateUser(username);
  //     console.log("✅ usersテーブルに登録完了");
  //     // 2. id を Asyncstorageに保存
  //     await AsyncStorage.setItem("clientId", String(clientId));
  //     console.log(
  //         `✅ id: ${clientId} をstring型でAsyncStorageに保存しました。`,
  //     );
  //     // Alert.alert("登録処理", `ニックネーム「${username}」を登録しました！`);
  //   } catch (error) {
  //     console.log("username登録中にエラー発生:", error);
  //   }
  // }


  const registerUsername = async () => {
    console.log("registerUsername_start");
    console.log("🐯username: ", userName);
    try {
      // await usernameRegister();
      await AsyncStorage.setItem("username", text);
      const clientId = await generateUser(text);
      console.log(
          `✅ id: ${clientId} をstring型でAsyncStorageに保存しました。`,
      );
    } catch (error) {
      console.error("useUsernameRegistrationに失敗", error);
    }
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

      {/*<View style={thisStyles.area}>*/}
      {/*    <Text style={thisStyles.text}>名前登録してね</Text>*/}
      {/*    <TextInput*/}
      {/*        style={[thisStyles.input,thisStyles.text]}*/}
      {/*        onChangeText={setText}*/}
      {/*        value={text}*/}
      {/*        keyboardType={'name-phone-pad'}*/}
      {/*        />*/}
      {/*    <Pressable style={thisStyles.button} onPress={registerUsername} >*/}
      {/*        <Text style={thisStyles.text}>登録</Text>*/}
      {/*    </Pressable>*/}

      {/*<Pressable style={thisStyles.button} onPress={getUserName} >*/}
      {/*    <Text style={thisStyles.text}>かくにん</Text>*/}
      {/*</Pressable>*/}
      {/*</View>*/}
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
    // width: horizontalScale(90),
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // backgroundColor:'white'
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
    // margin: 12,
    // borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#D9D9D9",

    fontWeight: 'bold',
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
  buttonText:{
    fontSize: moderateScale(20),
    color:'white',
    fontWeight: 'bold',
    fontFamily: "BIZ UDPGothic",
  }
});
