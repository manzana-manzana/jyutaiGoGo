import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
  Button,
  ImageSourcePropType,
} from "react-native";
import { styles } from "@/app/style";
import Metrics from "./metrics";
const { horizontalScale, verticalScale, moderateScale } = Metrics;
import {
  carImagesAtom,
  isJamAtom,
  isTalkAtom,
  roomMemberAtom,
} from "@/app/atom";
import { useAtom } from "jotai/index";
import { LinearGradient } from "expo-linear-gradient";
import { useAtomValue } from "jotai";

type Person = {
  id: number;
  username: string;
  isMyAccount: boolean;
};
type Members = {
  id: number;
  username: string;
  isMyAccount: boolean;
  carNo: number;
  beforeFile: string;
  afterFile: string;
};
type CarImages = {
  [key: string]: ImageSourcePropType;
};

export default function Sec4_Room() {
  // const [roomInNumberOfPeople,setRoomInNumberOfPeople] = useAtom(roomInNumberOfRoomMember)
  const [isJam, setIsJam] = useAtom(isJamAtom);
  const [isTalk, setIsTalk] = useAtom(isTalkAtom);
  const carImages = useAtomValue<CarImages>(carImagesAtom);
  const [roomMember, setRoomMember] = useAtom(roomMemberAtom);

  const [count, setCount] = useState(10);
  const [isExit, setIsExit] = useState(false);
  const [isRoom, setIsRoom] = useState<boolean>(false); //true：トーク開始
  const [isCompReading, setIsCompReading] = useState<boolean>(false); //true:読み込み完了(メッセージ変更用)
  const [maxNum, setMaxNum] = useState(6);
  const [isFirst, setIsFirst] = useState(true);
  const [existsCars, setExistsCars] = useState(0);
  const [members, setMembers] = useState<Members[]>([]);
  const [isDisplayName, setIsDisplayName] = useState<boolean>(false);

  const placeMultipleCars = () => {
    console.log("placeMultipleCars-start--");
    console.log("🐙roomMembers", roomMember);

    //いなくなったメンバーを削除
    const getMembersArray: Members[] = members.filter((member) =>
      roomMember.some((obj) => obj.id === member.id),
    );

    //新規メンバーを追加
    let newMembers: Person[] = [];
    if (isFirst) {
      newMembers = roomMember;
    } else {
      newMembers = roomMember.filter((obj) =>
        members.every((member) => member.id !== obj.id),
      );
    }

    //新規メンバーの情報追加
    newMembers.forEach((obj) => {
      //車の色をダブらないように設定
      let carNo = 0;
      while (carNo === 0) {
        const getNo = Math.floor(Math.random() * 8) + 1;
        if (!getMembersArray.some((member) => member.carNo === getNo)) {
          carNo = getNo;
        }
      }

      const carFileNameBefore = `c${carNo}_1`;
      const carFileNameAfter = obj.isMyAccount ? `c${carNo}_1` : `c${carNo}_0`;

      getMembersArray.push({
        id: obj.id,
        username: obj.username,
        isMyAccount: obj.isMyAccount,
        carNo: carNo,
        beforeFile: carFileNameBefore,
        afterFile: carFileNameAfter,
      });
    });
    console.log("isRoom--", isRoom);

    const sortArray: Members[] = [];
    let addIndex = 0;
    for (let i = 0; i < getMembersArray.length; i++) {
      const myNum = roomMember.length <= 3 ? 2 : 4; //ユーザー車位置は参加者3人までなら2、4人以上なら4

      if (i + 1 === myNum) {
        sortArray.push(
          getMembersArray.filter((member) => member.isMyAccount)[0],
        );
      } else {
        sortArray.push(
          getMembersArray.filter((member) => !member.isMyAccount)[addIndex],
        );
        addIndex++;
      }
    }
    sortArray.forEach((value, index) => {
      console.log(value);
    });
    setMembers(sortArray);
    console.log("----placeMultipleCars-end--", sortArray.length, "人/members");
  };

  // 初期位置
  const [positions, setPositions] = useState(
    new Array(maxNum).fill(0).map((value, index) => ({
      top: new Animated.Value(
        Number.isInteger(index / 2) ? verticalScale(28) : verticalScale(38),
      ),
      left: new Animated.Value(horizontalScale(100)),
      zIndex: Number.isInteger(index / 2)
        ? maxNum - index + 1
        : (maxNum - index + 1) * 2,
    })),
  );

  const moveImagesSequentially = (isReturn: boolean) => {
    console.log(
      "moveImagesSequentially-start--",
      "exists",
      existsCars,
      "台 / numbers",
      members.length,
      "台",
      "perople",
      roomMember.length,
    );

    const animations = positions
      .slice(0, roomMember.length)
      .map((position, index) => {
        return Animated.parallel([
          Animated.timing(position.left, {
            toValue: horizontalScale(
              Number.isInteger(index / 2)
                ? Math.floor(14 + Math.floor(index / 2) * 18.5)
                : Math.floor(32 + Math.floor(index / 2) * 18.5),
            ),
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(position.top, {
            toValue: verticalScale(
              Number.isInteger(index / 2)
                ? Math.floor(51 - Math.floor(index / 2) * 5)
                : Math.floor(56 - Math.floor(index / 2) * 5),
            ),
            duration: 1000,
            useNativeDriver: false,
          }),
        ]);
      });

    const returnAnimations = positions
      .slice(0, existsCars)
      .map((position, index) => {
        return Animated.parallel([
          Animated.timing(position.left, {
            toValue: horizontalScale(100),
            duration: 0,
            useNativeDriver: false,
          }),
          Animated.timing(position.top, {
            toValue: Number.isInteger(index / 2)
              ? verticalScale(28)
              : verticalScale(38),
            duration: 0,
            useNativeDriver: false,
          }),
        ]);
      });

    const endAnimations = positions
      .slice(0, existsCars)
      .map((position, index) => {
        return Animated.parallel([
          Animated.timing(position.left, {
            toValue: horizontalScale(-50),
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(position.top, {
            toValue: Number.isInteger(index / 2)
              ? verticalScale(67)
              : verticalScale(78),
            duration: 1000,
            useNativeDriver: false,
          }),
        ]);
      });

    if (isReturn) {
      //増減時（車の初期値への戻し必要）
      console.log("return-start---");
      const returnAnimated = () => {
        Animated.sequence([
          Animated.stagger(100, endAnimations),
          Animated.stagger(0, returnAnimations),
        ]).start(() => {
          placeMultipleCars(); //車の配列を作りなおし
          Animated.stagger(1000, animations).start(() => {
            setIsDisplayName(true);
            setExistsCars(roomMember.length);
            console.log("--return-end---");
          });
        });
      };
      returnAnimated();
    } else {
      //初回（初期値への戻し不要）
      console.log("not return --start");
      Animated.stagger(1000, animations).start(() => {
        setIsCompReading(true);
        setTimeout(() => {
          setIsDisplayName(true);
          setIsRoom(true);
          setExistsCars(roomMember.length);
          console.log("--not return --end");
        }, 2000);
      });
    }

    // setIsReturn(false)
    console.log("----moveImagesSequentially-end--");
  };

  useEffect(() => {
    console.log("effect-------------------------------");
    setIsDisplayName(false);

    if (isFirst) {
      //初回
      placeMultipleCars();
      moveImagesSequentially(false);

      setIsFirst(false);
    } else {
      //増減時
      moveImagesSequentially(true);
      setIsFirst(false);
    }
  }, [roomMember]);

  const startExit = () => {
    if (!isExit) {
      setIsExit(true);
      let countNum = 2;
      const countDownTimer = setInterval(() => {
        if (countNum <= 1) {
          setIsExit(false);
          setCount(10);
          setIsJam(false);
          setIsTalk(false);
          setIsRoom(false);
          setIsCompReading(false);
          setIsFirst(true);
          clearInterval(countDownTimer);
        } else {
          countNum--;
          setCount(countNum);
        }
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={{ width: "100%", height: "100%" }}
        source={require("../../assets/images/sec4_room.png")}
      />

      <View
        style={{
          position: "absolute",
          top: "65%",
          left: "70%",
          backgroundColor: "yellow",
        }}
      >
        {/*<Button*/}
        {/*  title="人数を増やす(停止中)"*/}
        {/*  // onPress={() => {*/}
        {/*  //   console.log("⭐️up");*/}
        {/*  //   if (roomMember.length <= 5) {*/}
        {/*  //     const random = Math.floor(Math.random() * 1000);*/}
        {/*  //     setRoomMember((prevRoomMember) => [*/}
        {/*  //       ...prevRoomMember,*/}
        {/*  //       {*/}
        {/*  //         id: `u${random}`,*/}
        {/*  //         username: "追加",*/}
        {/*  //         isMyAccount: false,*/}
        {/*  //       },*/}
        {/*  //     ]);*/}
        {/*  //   }*/}
        {/*  // }}*/}
        {/*  color="red"*/}
        {/*  accessibilityLabel="button"*/}
        {/*/>*/}
      </View>

      <View
        style={{
          position: "absolute",
          top: "70%",
          left: "70%",
          backgroundColor: "skyblue",
        }}
      >
        {/*<Button*/}
        {/*  title="人数をへらす"*/}
        {/*  onPress={() => {*/}
        {/*    console.log("🩷down");*/}
        {/*    let no = 0;*/}
        {/*    while (no === 0) {*/}
        {/*      const random = Math.floor(Math.random() * roomMember.length);*/}
        {/*      if (!roomMember[random].isMyAccount) {*/}
        {/*        no = random;*/}
        {/*      }*/}
        {/*    }*/}
        {/*    const newArr = roomMember.filter((_, index) => index !== no);*/}
        {/*    setRoomMember(newArr);*/}
        {/*  }}*/}
        {/*  color="red"*/}
        {/*  accessibilityLabel="button"*/}
        {/*/>*/}
      </View>

      <View style={[{ opacity: isRoom ? 1 : 0 }, thisStyles.main]}>
        <Pressable style={thisStyles.button} onPress={startExit}>
          <Text style={thisStyles.buttonText}>退出</Text>
        </Pressable>
        <View style={thisStyles.peopleArea}>
          <Text style={thisStyles.peopleText1}>現在</Text>
          <Text style={thisStyles.peopleText2}>{members.length}</Text>
          <Text style={thisStyles.peopleText3}>名</Text>
        </View>
      </View>

      <View style={[{ opacity: isRoom ? 0 : 1 }, thisStyles.main]}>
        <LinearGradient
          colors={["rgba(255, 255, 255, 1)", "rgba(217,217,217,0.7)"]}
          end={{ x: 0.5, y: 0.75 }}
          style={thisStyles.waitArea}
        />
        <LinearGradient
          colors={["rgba(217,217,217,0.7)", "rgba(217,217,217,0)"]}
          end={{ x: 0.5, y: 0.75 }}
          style={thisStyles.waitArea2}
        />
        <Text style={thisStyles.waitText1}>
          {isCompReading ? "参加しました！" : "読み込み中"}
        </Text>

        <Image
          source={carImages[`cw_1`]}
          style={{
            width: horizontalScale(25),
            position: "absolute",
            top: verticalScale(57),
            left: horizontalScale(-6),
          }}
          resizeMode="contain"
        />
        <Image
          source={carImages[`cw_2`]}
          style={{
            width: horizontalScale(25),
            position: "absolute",
            top: verticalScale(62),
            left: horizontalScale(12),
          }}
          resizeMode="contain"
        />
        <Image
          source={carImages[`cw_3`]}
          style={{
            width: horizontalScale(25),
            position: "absolute",
            top: verticalScale(67),
            left: horizontalScale(-7),
          }}
          resizeMode="contain"
        />
      </View>

      {members.map((member, index) => (
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
            source={
              carImages[`${isRoom ? member.afterFile : member.beforeFile}`]
            }
            style={{ width: horizontalScale(25) }}
            resizeMode="contain"
          />

          <View
            style={{
              opacity: isRoom ? 1 : 0,
              top: verticalScale(-14),
              left: horizontalScale(2),
            }}
          >
            <Image //吹き出し
              source={carImages[`cb_${member.isMyAccount ? member.carNo : 0}`]}
              style={{ width: horizontalScale(25) }}
              resizeMode="contain"
            />
            <Text //名前
              style={thisStyles.nameText}
            >
              {member.username}
            </Text>
          </View>
        </Animated.View>
      ))}

      <View style={[thisStyles.countArea, { opacity: isExit ? 1 : 0 }]}>
        <Text style={thisStyles.countText1}>まもなくルームから退出します</Text>
        <Text style={thisStyles.countText2}>{count}</Text>
      </View>
    </View>
  );
}

const thisStyles = StyleSheet.create({
  main: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    top: verticalScale(75), //あとで再計算
    width: horizontalScale(72),
    height: verticalScale(9),
    borderRadius: 40,
    backgroundColor: "#737373",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: moderateScale(20),
    fontFamily: "BIZ UDPGothic",
    color: "white",
  },
  peopleArea: {
    position: "absolute",
    flexDirection: "row",
    top: verticalScale(15), //あとで再計算
    width: horizontalScale(50),
    height: verticalScale(11),
  },
  peopleText1: {
    fontWeight: "bold",
    fontSize: moderateScale(24),
    fontFamily: "BIZ UDPGothic",
    color: "#2B2B2B",
  },
  peopleText2: {
    position: "absolute",
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
    fontSize: moderateScale(90),
    fontFamily: "BIZ UDPGothic",
    color: "#1A1311",
  },
  peopleText3: {
    position: "absolute",
    right: 0,
    bottom: 0,
    fontWeight: "bold",
    fontSize: moderateScale(24),
    fontFamily: "BIZ UDPGothic",
    color: "#2B2B2B",
  },
  countArea: {
    position: "absolute",
    alignItems: "center",
    top: verticalScale(30), //あとで再計算
    width: horizontalScale(95),
    height: verticalScale(26),
    borderRadius: 10,
    backgroundColor: "white",
    zIndex: 99,
  },
  countText1: {
    position: "absolute",
    top: verticalScale(5), //17
    fontWeight: "bold",
    fontSize: moderateScale(22),
    fontFamily: "BIZ UDPGothic",
    color: "black",
  },
  countText2: {
    position: "absolute",
    top: verticalScale(12), //46
    textAlign: "center",
    width: "100%",
    fontWeight: "bold",
    fontSize: moderateScale(70),
    fontFamily: "BIZ UDPGothic",
    color: "black",
  },
  waitArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: verticalScale(36 * 0.75),
    alignItems: "center",
  },
  waitArea2: {
    position: "absolute",
    top: verticalScale(36 * 0.75),
    left: 0,
    width: "100%",
    height: verticalScale(36 * 0.25),
    alignItems: "center",
  },
  waitText1: {
    fontWeight: "bold",
    fontSize: moderateScale(40),
    fontFamily: "BIZ UDPGothic",
    color: "#2B2B2B",
    position: "absolute",
    top: verticalScale(19),
  },

  nameText: {
    fontWeight: "bold",
    fontSize: moderateScale(16),
    left: horizontalScale(1),
    top: verticalScale(-4.5),
    width: horizontalScale(23),
    textAlign: "center",
  },
});
