import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageSourcePropType,
  Animated,
  Pressable,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
// import { moderateScale } from 'react-native-size-matters';
import Metrics from "./metrics";
const { horizontalScale, verticalScale, moderateScale } = Metrics;
import { styles } from "@/app/style";
import { useAtomValue } from "jotai/index";
import {
  carImagesAtom,
  isOpeningEndAtom,
  screenAtom,
  usernameAtom,
} from "@/app/atom";
import { useAtom, useSetAtom } from "jotai";

export default function Sec0_3_Opening() {
  type CarImages = {
    [key: string]: ImageSourcePropType;
  };
  const carImages = useAtomValue<CarImages>(carImagesAtom);
  const [userName, setUserName] = useAtom(usernameAtom);
  const [screen, setScreen] = useAtom(screenAtom);
  const setIsOpeningEnd = useSetAtom(isOpeningEndAtom);
  const [isTitleDisplay, setIsTitleDisplay] = useState(false);
  const [cars, _] = useState([
    carImages["c3_1"],
    carImages["c1_1"],
    carImages["c5_1"],
    carImages["c2_1"],
    carImages["c7_1"],
    carImages["c6_1"],
  ]);
  const [isStartDisplay, setIsStartDisplay] = useState(false);

  // 初期位置
  const [positions, setPositions] = useState(
    new Array(cars.length).fill(0).map((value, index) => ({
      top: new Animated.Value(
        Number.isInteger(index / 2) ? verticalScale(58) : verticalScale(68),
      ),
      left: new Animated.Value(horizontalScale(100)),
      zIndex: Number.isInteger(index / 2)
        ? cars.length - index + 1
        : (cars.length - index + 1) * 2,
    })),
  );

  const moveImagesSequentially = () => {
    const animations = positions.map((position, index) => {
      return Animated.parallel([
        Animated.timing(position.left, {
          toValue: horizontalScale(
            Number.isInteger(index / 2)
              ? Math.floor(14 + Math.floor(index / 2) * 18.5)
              : Math.floor(32 + Math.floor(index / 2) * 18.5),
          ),
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(position.top, {
          toValue: verticalScale(
            Number.isInteger(index / 2)
              ? Math.floor(80 - Math.floor(index / 2) * 5)
              : Math.floor(85 - Math.floor(index / 2) * 5),
          ),
          duration: 500,
          useNativeDriver: false,
        }),
      ]);
    });

    Animated.stagger(400, animations).start(() => {
      setIsTitleDisplay(true);
      setTimeout(() => {
        setIsStartDisplay(true);
      }, 1000);
      setTimeout(() => {
        console.log("移動するよ");
        setIsOpeningEnd(true);
      }, 3000);
    });
  };

  useEffect(() => {
    console.log("effect------");
    setIsStartDisplay(false);
    moveImagesSequentially();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: "100%" }}
        source={require("../../assets/images/sec0_3_opening.png")}
      />
      <View style={[thisStyles.titleArea, { opacity: isTitleDisplay ? 1 : 0 }]}>
        <Image
          style={{ width: horizontalScale(80) }}
          resizeMode="contain"
          source={require("../../assets/images/title.png")}
        />
      </View>
      <View
        style={[
          thisStyles.titleArea,
          { top: "55%", opacity: isStartDisplay ? 1 : 0 },
        ]}
      >
        <Image
          style={{ width: horizontalScale(150) }}
          resizeMode="contain"
          source={require("../../assets/images/start.png")}
        />
      </View>

      {/*<Text*/}
      {/*  style={[{ opacity: isTitleDisplay ? 1 : 0 }, thisStyles.overlayText]}*/}
      {/*>*/}
      {/*  渋滞GO！GO！*/}
      {/*</Text>*/}
      {/*<Text*/}
      {/*  style={[*/}
      {/*    { opacity: isTitleDisplay ? 1 : 0 },*/}
      {/*    thisStyles.overlayText,*/}
      {/*    { top: verticalScale(40) },*/}
      {/*  ]}*/}
      {/*>*/}
      {/*  {!userName ? "名前未登録" : `${userName}さん`}*/}
      {/*</Text>*/}

      {cars.map((car, index) => (
        <Animated.View
          key={index}
          style={{
            position: "absolute",
            top: positions[index].top,
            left: positions[index].left,
            zIndex: positions[index].zIndex,
          }}
        >
          <Image //車
            source={cars[index]}
            style={{ width: horizontalScale(25) }}
            resizeMode="contain"
          />
        </Animated.View>
      ))}

      <Image
        source={carImages[`cw_4`]}
        style={{
          width: horizontalScale(25),
          position: "absolute",
          top: verticalScale(86),
          left: horizontalScale(-6),
        }}
        resizeMode="contain"
      />
      <Image
        source={carImages[`cw_5`]}
        style={{
          width: horizontalScale(25),
          position: "absolute",
          top: verticalScale(92),
          left: horizontalScale(12),
        }}
        resizeMode="contain"
      />
      <Image
        source={carImages[`cw_6`]}
        style={{
          width: horizontalScale(25),
          position: "absolute",
          top: verticalScale(97),
          left: horizontalScale(-7),
        }}
        resizeMode="contain"
      />
    </View>
  );
}

const thisStyles = StyleSheet.create({
  overlayText: {
    position: "absolute",
    top: verticalScale(20),
    color: "blue",
    fontSize: moderateScale(50),
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    top: verticalScale(50), //あとで再計算
    width: horizontalScale(20),
    height: verticalScale(9),
    borderRadius: 40,
    backgroundColor: "#737373",
    justifyContent: "center",
    alignItems: "center",
  },
  titleArea: {
    position: "absolute",
    // justifyContent: 'space-between',
    alignItems: "center",
    justifyContent: "center",
    top: verticalScale(30),
    width: horizontalScale(95),
    height: verticalScale(17),
    // fontWeight: 'bold',
    // textAlign: 'center',
    // backgroundColor: 'white',
    borderRadius: 10,
  },
});
