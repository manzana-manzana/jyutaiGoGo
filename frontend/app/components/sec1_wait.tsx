import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
// import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Metrics from "./metrics";
const { horizontalScale, verticalScale, moderateScale } = Metrics;
import { styles } from "@/app/style";
import { useAtom } from "jotai";
import {
  apiAddressAtom,
  isJamAtom,
  isTalkAtom,
  carImagesAtom,
} from "@/app/atom";
// import {amiVoice} from "@/app/components/sec1_wait_amiVoice";
import { useAtomValue } from "jotai/index";
import { Audio, Video } from "expo-av";
import { number } from "prop-types";

let counter = 0;
const repeatNum = 2;

import GroupUsersByLocation from "@/app/components/GroupUsersByLocation";
import Locations from "@/app/components/Locations";

// import {Button, View, StyleSheet, Text} from "react-native";
// import { Audio } from "expo-av";
// import React, { useState } from "react";
// import { useAtom, useAtomValue } from "jotai";
// import {apiAddressAtom, storedAtom, testAtom, uriAtom} from "../atom";

type Ami = {
  recording: null | Audio.Recording;
  startRecording: () => void;
  stopRecording: (
    apiAddress: string,
  ) => Promise<
    | { isResYes: boolean; isResNo: boolean; text: any; isMatch: boolean }
    | undefined
  >;
};

const amiVoice: Ami = {
  recording: null,
  startRecording: async function () {
    console.log("-startRecording_________________________");
    this.recording = null;
    const recordingOptions: any = {
      android: {
        extension: ".wav", // または ".m4a"
        // outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_PCM_16BIT,
        // audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_DEFAULT,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
      },
      ios: {
        extension: ".wav", // または ".m4a"
        // outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_LINEARPCM,
        // audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
      },
    };

    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      this.recording = newRecording;
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  },
  stopRecording: async function (apiAddress) {
    console.log("stopRecording_________________________");
    if (this.recording) {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      console.log("f/uri;", JSON.stringify({ uri }));

      const formData: any = new FormData();
      formData.append("file", {
        uri: uri, //fileData.uri,
        type: "audio/wav", //fileData.type,
        name: "test.wav", //fileData.name,
      });

      const voiceText = await fetch(`${apiAddress}/api/jyutai/voice`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      let resA = await voiceText.json();
      resA = resA.text;
      console.log("resA変換前", resA);

      //ひらがな変換
      const katakanaToHiragana = (str: string) => {
        return str.replace(/[\u30A1-\u30F6]/g, function (match) {
          return String.fromCharCode(match.charCodeAt(0) - 0x60);
        });
      };

      //全角変換
      const toFullWidth = (str: string) => {
        return str.replace(/[\x20-\x7E]/g, function (char) {
          const code = char.charCodeAt(0);
          if (code >= 33 && code <= 126) {
            return String.fromCharCode(code + 0xfee0);
          }
          return char;
        });
      };

      resA = katakanaToHiragana(resA);
      resA = toFullWidth(resA);
      console.log("resA:", resA);

      this.recording = null;

      //「ひらがな、漢字、全角英字」で判定　（カタカナ、半角は除く）
      const isResYes = !!(
        resA.includes("はい") ||
        resA.includes("ＯＫ") ||
        resA.includes("いえす")
      );

      const isResNo = !!resA.includes("いいえ");

      const isMatch = !!(
        resA.includes("はい") ||
        resA.includes("ＯＫ") ||
        resA.includes("いえす") ||
        resA.includes("いいえ")
      );

      return {
        isResYes: isResYes,
        isResNo: isResNo,
        text: resA,
        isMatch: isMatch,
      };
    }
  },
};

export default function Sec1_Wait() {
  const [isJam, setIsJam] = useAtom(isJamAtom); //テスト用に設置。本来は位置取得時にSet。
  const [isTalk, setIsTalk] = useAtom(isTalkAtom);
  const apiAddress = useAtomValue(apiAddressAtom); //APIアドレス（頭部分）
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [isRecordingSuccessful, setIsRecordingSuccessful] = useState(false);
  const [isSoundFinish, setIsSoundFinish] = useState(false);
  const [isMatchWord, setIsMatchWord] = useState(false);
  const [isNotTalk, setIsNotTalk] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  type CarImages = {
    [key: string]: ImageSourcePropType;
  };
  const carImages = useAtomValue<CarImages>(carImagesAtom);

  //車ムービー_ここから_______________________________________
  // const position,setPosition] = useState([
  const [position1, setPosition1] = useState({
    top: new Animated.Value(verticalScale(28)),
    left: new Animated.Value(horizontalScale(100)),
  });
  const [position2, setPosition2] = useState({
    top: new Animated.Value(verticalScale(37)),
    left: new Animated.Value(horizontalScale(100)),
  });

  const setEndPoint = (
    left: Animated.Value,
    top: Animated.Value,
    topNum: number,
    leftNum: number,
  ) => {
    // console.log("carNum;",carNum)
    return [
      Animated.timing(left, {
        toValue: horizontalScale(leftNum), //11
        duration: 4000,
        useNativeDriver: false,
      }),
      Animated.timing(top, {
        toValue: verticalScale(topNum), //51
        duration: 4000,
        useNativeDriver: false,
      }),
    ];
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.parallel(
            setEndPoint(position1.left, position1.top, 67, -50),
          ),
          Animated.parallel(
            setEndPoint(position2.left, position2.top, 37, 100),
          ),
        ]),
        Animated.parallel(setEndPoint(position2.left, position2.top, 78, -50)),
      ]),
    ).start();
  }, []);
  //車ムービー_ここまで_______________________________________
  const fadeAnim1 = new Animated.Value(0);
  const fadeAnim2 = new Animated.Value(0);
  const fadeAnim3 = new Animated.Value(0);
  useEffect(() => {
    console.log(
      `[anime]soundFin:${isSoundFinish},recordingSuc:${isRecordingSuccessful},recoding:${isRecording}`,
    );
    if (isSoundFinish && !isRecordingSuccessful) {
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
    setTimeout(() => {
      if (isSoundFinish && !isRecordingSuccessful) {
        Animated.timing(fadeAnim2, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    }, 800);
    setTimeout(() => {
      if (isSoundFinish && !isRecordingSuccessful) {
        Animated.timing(fadeAnim3, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      }
    }, 1600);
  }, [isSoundFinish, isRecordingSuccessful, isRecording]);

  //マイクムービー_ここまで_______________________________________

  // const playSound = async () => {
  //   console.log("load　sound");
  //   if (isJam) {
  //     const { sound } = await Audio.Sound.createAsync(
  //       require("../../assets/voice/sec1_read_kakunin.mp3"),
  //     );
  //
  //     // setSound(sound);
  //     await sound.replayAsync();
  //     sound.setOnPlaybackStatusUpdate((status) => {
  //       // 1. ステータスが読み込み完了しているかどうかをチェック
  //       if (!status.isLoaded) {
  //         // ここでは status は AVPlaybackStatusError かもしれない
  //         console.log("音声のロードに失敗、もしくはまだロード中");
  //         return;
  //       }
  //       // 2. ステータスが成功かつ loaded であるとわかった時点で
  //       //    status は AVPlaybackStatusSuccess として扱える
  //       if (status.didJustFinish) {
  //         console.log("音声再生が終了");
  //

  const playSound = async () => {
    console.log("load　sound");
    let soundFile;
    if (isJam) {
      if (isRetry) {
        soundFile = require("../../assets/voice/sec1_wait_retry.mp3");
      } else if (isNotTalk) {
        soundFile = require("../../assets/voice/sec1_wait_wait.mp3");
      } else {
        soundFile = require("../../assets/voice/sec1_wait_kakunin.mp3");
      }
      const { sound } = await Audio.Sound.createAsync(soundFile);

      // setSound(sound);
      await sound.replayAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        // 1. ステータスが読み込み完了しているかどうかをチェック
        if (!status.isLoaded) {
          // ここでは status は AVPlaybackStatusError かもしれない
          console.log("音声のロードに失敗、もしくはまだロード中");
          return;
        }
        // 2. ステータスが成功かつ loaded であるとわかった時点で
        //    status は AVPlaybackStatusSuccess として扱える
        if (status.didJustFinish) {
          setIsSoundFinish(true);
          console.log("音声再生が終了");
        }
      });
    }
  };

  const getAmiVoice = async () => {
    setIsRecording(true);
    setRecordingText("");
    setIsRecordingSuccessful(false);
    setIsRetry(false);
    await amiVoice.startRecording();
    setTimeout(async () => {
      const amiRes = await amiVoice.stopRecording(apiAddress);
      setIsRecording(false);

      if (!amiRes) {
        return; // amiResの型ガード (TypeScriptエラー回避)
      }

      console.log("sec1_amires;", amiRes);
      amiRes.isResYes && amiRes.isMatch ? setIsTalk(true) : setIsTalk(false);
      amiRes.isResNo && amiRes.isMatch
        ? setIsNotTalk(true)
        : setIsNotTalk(false);
      setRecordingText(amiRes.text);
      !amiRes.isMatch ? setIsRetry(true) : setIsRetry(false);
      setIsRecordingSuccessful(true);
    }, 3000);
  };

  useEffect(() => {
    counter = 0;
    setIsSoundFinish(false);
    setIsMatchWord(false);
    console.log("isJam", isJam);
    if (isJam) {
      console.log("play");
      const func = async () => {
        console.log("isJam実行だよ");
        await playSound();
        console.log("--playおわり");
      };
      func().then(() => {});
    }
    return console.log("");
  }, [isJam]);

  useEffect(() => {
    if (isSoundFinish) {
      const funcAmi = async () => {
        await getAmiVoice();
      };
      funcAmi().then(() => {});
    }
  }, [isSoundFinish]);

  useEffect(() => {
    if (isNotTalk) {
      console.log("useE isNotTalk in");
      playSound();
      setTimeout(() => {
        setIsJam(false);
        setIsNotTalk(false);
      }, 3000);
    }
  }, [isNotTalk]);

  useEffect(() => {
    if (isRetry) {
      console.log("useE isRetry in");
      setIsNotTalk(false);
      const funcRetry = async () => {
        setIsSoundFinish(false);
        await playSound();
      };
      const funcNotTalk = () => {
        setIsNotTalk(true);
        setIsRetry(false);
      };
      repeatNum >= ++counter ? funcRetry() : funcNotTalk();
    }
  }, [isRetry]);

  //             sound.unloadAsync();

  return (
    <View style={styles.container}>
      <Locations />
      {/*<Video*/}
      {/*    source={require('../../assets/movies/sec1_wait.mp4')}*/}
      {/*    style={{ width: '70%', height: '40%' }}*/}
      {/*    useNativeControls={false} // react-native-video の controls={false} に相当*/}
      {/*    isLooping // react-native-video の repeat={true} に相当*/}
      {/*/>*/}
      <Image
        style={{ width: "100%", height: "100%" }}
        source={require("../../assets/images/sec1_wait.png")}
      />

      <Animated.View
        style={{
          position: "absolute",
          top: position1.top,
          left: position1.left,
        }}
      >
        <Image
          style={{ width: horizontalScale(27) }}
          resizeMode="contain"
          source={carImages["c3_1"]}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: "absolute",
          top: position2.top,
          left: position2.left,
        }}
      >
        <Image
          style={{ width: horizontalScale(27) }}
          resizeMode="contain"
          source={carImages["c3_1"]}
        />
      </Animated.View>

      <View
        style={{ position: "absolute", top: "10%", backgroundColor: "yellow" }}
      >
        <Button
          title="渋滞発生（クリック）"
          onPress={() => {
            setIsJam(!isJam);
            setIsRecordingSuccessful(false);
          }}
          color="red"
          accessibilityLabel="button"
        />
      </View>
      <View
        style={{ position: "absolute", top: "15%", backgroundColor: "yellow" }}
      >
        <Button
          title="ルームへ移動"
          onPress={() => {
            setIsTalk(true);
          }}
          color="red"
          accessibilityLabel="button"
        />
      </View>

      <View style={[thisStyles.jamArea, { opacity: isJam ? 0.9 : 0 }]}>
        <View style={thisStyles.jamArea2}>
          <Text style={[thisStyles.jamText1, { top: "0%" }]}>
            渋滞に入りました。{"\n"}
            周囲の人と会話ができます。{"\n"}
          </Text>
          <Text style={thisStyles.jamText2}>会話に参加しますか？</Text>
        </View>
        <View style={thisStyles.jamArea3}>
          <Text
            style={[
              thisStyles.jamText3,
              { top: "50%", opacity: isRetry ? 1 : 0 },
            ]}
          >
            もう一度話してください
          </Text>
        </View>
        <Text
          style={[
            thisStyles.overlayText,
            {
              top: "80%",
              fontSize: moderateScale(24),
              color: "#00B4AA",
              opacity: isNotTalk ? 1 : 0,
            },
          ]}
        >
          待機画面に戻ります
        </Text>
      </View>

      <View
        style={[
          thisStyles.micArea,
          { opacity: isSoundFinish && !isRecordingSuccessful ? 1 : 0 },
        ]}
      >
        <Image
          style={{ width: horizontalScale(27) }}
          resizeMode="contain"
          source={require("../../assets/images/mic.png")}
        />
      </View>
      <View
        style={[
          thisStyles.micArea,
          { opacity: isSoundFinish && !isRecordingSuccessful ? 1 : 0 },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim1 }}>
          <Image
            style={{ width: horizontalScale(33) }}
            resizeMode="contain"
            source={require("../../assets/images/circle1.png")}
          />
        </Animated.View>
      </View>
      <View
        style={[
          thisStyles.micArea,
          { opacity: isSoundFinish && !isRecordingSuccessful ? 1 : 0 },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim2 }}>
          <Image
            style={{ width: horizontalScale(46) }}
            resizeMode="contain"
            source={require("../../assets/images/circle2.png")}
          />
        </Animated.View>
      </View>
      <View
        style={[
          thisStyles.micArea,
          { opacity: isSoundFinish && !isRecordingSuccessful ? 1 : 0 },
        ]}
      >
        <Animated.View style={{ opacity: fadeAnim3 }}>
          <Image
            style={{ width: horizontalScale(59) }}
            resizeMode="contain"
            source={require("../../assets/images/circle3.png")}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const thisStyles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: verticalScale(19),
    width: "100%",
    // height:200,
    color: "gray",
    fontSize: moderateScale(50),
    fontWeight: "bold",
    alignItems: "center",
  },

  overlayText: {
    position: "absolute",
    // top: verticalScale(10),
    color: "#2B2B2B",
    fontSize: moderateScale(40),
    fontFamily: "BIZ UDPGothic",
    fontWeight: "bold",
  },

  jamArea: {
    position: "absolute",
    // justifyContent: 'space-between',
    alignItems: "center",
    justifyContent: "center",
    top: verticalScale(36),
    width: horizontalScale(95),
    height: verticalScale(28),
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  jamArea2: {
    justifyContent: "center",
  },
  jamArea3: {
    justifyContent: "center",
  },
  jamText1: {
    fontSize: moderateScale(26),
    fontFamily: "BIZ UDPGothic",
    textAlign: "center",
  },
  jamText2: {
    fontSize: moderateScale(30),
    fontWeight: "bold",
    fontFamily: "BIZ UDPGothic",
    textAlign: "center",
  },
  jamText3: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    fontFamily: "BIZ UDPGothic",
    textAlign: "center",
    color: "#D70915",
  },
  jamText4: {
    fontSize: moderateScale(24),
    fontWeight: "bold",
    fontFamily: "BIZ UDPGothic",
    textAlign: "center",
    color: "#00B4AA",
  },

  micArea: {
    position: "absolute",
    // justifyContent: 'space-between',
    alignItems: "center",
    justifyContent: "center",
    top: verticalScale(70),
    width: horizontalScale(95),
    height: verticalScale(17),
  },
});
