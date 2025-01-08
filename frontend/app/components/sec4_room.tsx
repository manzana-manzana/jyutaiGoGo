import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Animated, Dimensions} from 'react-native';
import {styles} from "@/app/style";
// import {moderateScale} from "react-native-size-matters";
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics
import {isJamAtom, isTalkAtom, roomInNumberOfPeopleAtom} from "@/app/atom";
import {useAtomValue} from "jotai";
import {useAtom} from "jotai/index";
// import Animated from "react-native-reanimated";


export default function Sec4_Room()  {
    const roomInNumberOfPeople = useAtomValue(roomInNumberOfPeopleAtom)
    const [isJam, setIsJam] = useAtom(isJamAtom)
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const [count, setCount]= useState(10)
    const [isExit, setIsExit]= useState(false)
    const { width, height } = Dimensions.get('window');

    // 初期位置
    const [positions, setPositions] = useState(
        new Array(6).fill(0).map((value,index) => ({
            top: new Animated.Value(Number.isInteger(index/2)?verticalScale(28):verticalScale(38)),
            left: new Animated.Value(Number.isInteger(index/2)?horizontalScale(100):horizontalScale(100)),
        }))
    );

    // アニメーションを順番に実行するための関数
    const moveImagesSequentially = () => {
        const animations = positions.map((position, index) => {
            return Animated.sequence([
                Animated.timing(position.left, {
                    toValue: horizontalScale(Number.isInteger(index/2)?
                        Math.floor(10 + Math.floor(index/2) * 21.5): Math.floor(22+ Math.floor(index/2) * 21.5)),
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(position.top, {
                    toValue: verticalScale(Number.isInteger(index/2)?
                        Math.floor(52 - Math.floor(index/2) * 5.5): Math.floor(59 - Math.floor(index/2) * 5.5)),
                    duration: 1000,
                    useNativeDriver: false,
                })
            ]);
        });

        // すべてのアニメーションを順番に実行
        Animated.stagger(1000, animations).start(); // 1秒ごとに次の画像が動く
    };

    useEffect(() => {
        moveImagesSequentially(); // アニメーション開始
    }, []);

    // const fadeAnim = new Animated.Value(0)
    // useEffect(() => {
    //     Animated.timing(fadeAnim,{
    //         toValue: 1,
    //         duration: 1000,
    //         useNativeDriver: true,
    //     }).start()
    // }, []);

    const startExit = ()=>{
        if(!isExit){
            setIsExit(true)
            let countNum=11
            const countDownTimer = setInterval(()=>{
                if(countNum<=1){
                    setIsExit(false)
                    setCount(10)
                    setIsJam(false)
                    setIsTalk(false)
                    clearInterval(countDownTimer)
                    console.log("timer_end__")
                }else{
                    countNum--
                    setCount(countNum)
                }
            },1000)
        }
    }

    return (
        <View style={styles.container}>
            <Image style={{width: '100%', height:'100%'}}
                   resizeMode='contain'
                   source={require('../../assets/images/sec4_room.png')}/>
            <Pressable style={thisStyles.button} onPress={startExit} >
                <Text style={thisStyles.buttonText}>退出</Text>
            </Pressable>
            <View style={thisStyles.peopleArea}>
                <Text style={thisStyles.peopleText1}>現在</Text>
                <Text style={thisStyles.peopleText2}>{roomInNumberOfPeople}</Text>
                <Text style={thisStyles.peopleText3}>名</Text>
            </View>
            <View style={[thisStyles.countArea,{opacity: isExit ? 1:0 }]}>
                <Text style={thisStyles.countText1}>まもなくルームから退出します</Text>
                <Text style={thisStyles.countText2}>{count}</Text>
            </View>

            {positions.map((position, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        top: position.top,
                        left: position.left,
                        // width: 100,
                        // height: 100,
                    }}
                >
                    <Image
                        source={require('../../assets/images/cars/car1_1.png')}
                        // image=${index + 1}` }} // 画像のソース（適宜変更）
                        style={{ width: 106 }}
                        resizeMode='contain'
                    />
                </Animated.View>
            ))}

            {/*<Animated.View style={{*/}
            {/*    opacity: fadeAnim,*/}
            {/*    position: 'absolute',*/}
            {/*    top:100}}>*/}
            {/*    <Image style={{width:106}}*/}
            {/*           resizeMode='contain'*/}
            {/*           source={require('../../assets/images/cars/car1_0.png')}/>*/}
            {/*</Animated.View>*/}

            {/*<Animated.View*/}
            {/*    style={{*/}
            {/*        position: 'absolute',*/}
            {/*        top: position.top, // topの位置をアニメーションで変更*/}
            {/*        left: position.left, // leftの位置をアニメーションで変更*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Image style={{width:106}}*/}
            {/*           resizeMode='contain'*/}
            {/*           source={require('../../assets/images/cars/car1_0.png')}/>*/}
            {/*</Animated.View>*/}


        </View>
    );
};

const thisStyles = StyleSheet.create({
    button: {
        position: 'absolute',
        top: verticalScale(75),//あとで再計算
        width: horizontalScale(72),
        height: verticalScale(9),
        borderRadius: 40,
        backgroundColor:'#737373',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        fontWeight: 'bold',
        fontSize: moderateScale(20),
        fontFamily: 'BIZ UDPGothic',
        color:'white',

    },
    peopleArea: {
        position: 'absolute',
        flexDirection: 'row',
        top: verticalScale(15),//あとで再計算
        width: horizontalScale(50),
        height: verticalScale(11),
    },
    peopleText1: {
        fontWeight: 'bold',
        fontSize: moderateScale(24),
        fontFamily: 'BIZ UDPGothic',
        color:'#2B2B2B',
    },
    peopleText2: {
        position: 'absolute',
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        fontSize: moderateScale(90),
        fontFamily: 'BIZ UDPGothic',
        color:'#1A1311',
    },
    peopleText3: {
        position: 'absolute',
        right: 0,
        bottom:0,
        fontWeight: 'bold',
        fontSize: moderateScale(24),
        fontFamily: 'BIZ UDPGothic',
        color:'#2B2B2B',

    },
    countArea: {
        position: 'absolute',
        alignItems:'center',
        top: verticalScale(30),//あとで再計算
        width: horizontalScale(95),
        height: verticalScale(26),
        borderRadius: 10,
        backgroundColor: 'white'
    },
    countText1: {
        position: 'absolute',
        top: verticalScale(5),//17
        fontWeight: 'bold',
        fontSize: moderateScale(22),
        fontFamily: 'BIZ UDPGothic',
        color:'black',
    },
    countText2: {
        position: 'absolute',
        top: verticalScale(12),//46
        textAlign: 'center',
        width: '100%',
        fontWeight: 'bold',
        fontSize: moderateScale(70),
        fontFamily: 'BIZ UDPGothic',
        color:'black',
    },

})