import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Animated, Dimensions, Button} from 'react-native';
import {styles} from "@/app/style";
// import {moderateScale} from "react-native-size-matters";
import Metrics from './metrics'
const {horizontalScale, verticalScale, moderateScale} = Metrics
import {isJamAtom, isTalkAtom, roomInNumberOfPeopleAtom} from "@/app/atom";
import {useAtomValue} from "jotai";
import {useAtom} from "jotai/index";
// import LinearGradient from 'react-native-linear-gradient';
// import Animated from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';

const carImages = {
    c1_0:require(`../../assets/images/cars/car1_0.png`),
    c1_1:require(`../../assets/images/cars/car1_1.png`),
    c2_0:require(`../../assets/images/cars/car2_0.png`),
    c2_1:require(`../../assets/images/cars/car2_1.png`),
    c3_0:require(`../../assets/images/cars/car3_0.png`),
    c3_1:require(`../../assets/images/cars/car3_1.png`),
    c4_0:require(`../../assets/images/cars/car4_0.png`),
    c4_1:require(`../../assets/images/cars/car4_1.png`),
    c5_0:require(`../../assets/images/cars/car5_0.png`),
    c5_1:require(`../../assets/images/cars/car5_1.png`),
    c6_0:require(`../../assets/images/cars/car6_0.png`),
    c6_1:require(`../../assets/images/cars/car6_1.png`),
    c7_0:require(`../../assets/images/cars/car7_0.png`),
    c7_1:require(`../../assets/images/cars/car7_1.png`),
    c8_0:require(`../../assets/images/cars/car8_0.png`),
    c8_1:require(`../../assets/images/cars/car8_1.png`),
    cw_1:require(`../../assets/images/cars/car_wait_1.png`),
    cw_2:require(`../../assets/images/cars/car_wait_2.png`),
    cw_3:require(`../../assets/images/cars/car_wait_3.png`),
}

export default function Sec4_Room()  {
    const [roomInNumberOfPeople,setRoomInNumberOfPeople] = useAtom(roomInNumberOfPeopleAtom)
    const [isJam, setIsJam] = useAtom(isJamAtom)
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const [count, setCount]= useState(10)
    const [isExit, setIsExit]= useState(false)
    const [carNoArray, setCarNoArray] = useState<number[]>([])
    const [carFileArray, setCarFileArray] = useState<string[]>([])
    const [myNum, setMyNum]= useState(0)
    const [isRoom,setIsRoom]= useState(false)
    const [isCompReading, setIsCompReading] = useState(false)

    const placeMultipleCars = (startNum:number) => {
        console.log('placeMultipleCars---',startNum)
        const getCarNoArray: number[] = carNoArray.slice()
        const getCarFileArray: string[] = carFileArray.slice()
        setMyNum(roomInNumberOfPeople <= 3 ? 1 : 3)//ユーザー車位置は参加者3人までなら2、4人以上なら4

        for (let i = startNum; i <= roomInNumberOfPeople; i++) {
            let carNo = 0
            while (carNo === 0) {
                const getNo = Math.floor(Math.random() * 8) + 1;
                if (!getCarNoArray.includes(getNo)) {
                    carNo = getNo
                    getCarNoArray.push(getNo)
                }
            }
            const carFileName = `c${carNo}_`
            // const carFileName = i === myNum ? `c${carNo}_1` : `c${carNo}_0`
            getCarFileArray.push(carFileName)
        }
        console.log('is--',isRoom)
        console.log(getCarNoArray)
        setCarFileArray(getCarFileArray)
        setCarNoArray(getCarNoArray)
    }

    // 初期位置
    const [positions, setPositions] = useState(
        new Array(7).fill(0).map((value,index) => ({
            top: new Animated.Value(Number.isInteger(index/2)?
                verticalScale(28):verticalScale(38)),
            left: new Animated.Value(Number.isInteger(index/2)?
                horizontalScale(100):horizontalScale(100)),
            zIndex: roomInNumberOfPeople - index + 1
        }))
    );

    const moveImagesSequentially = () => {
        console.log('moveImagesSequentially---')
        const animations = positions.map((position, index) => {
            return Animated.parallel([
                Animated.timing(position.left, {
                    toValue: horizontalScale(Number.isInteger(index/2)?
                        Math.floor(14 + Math.floor(index/2) * 18.5):
                        Math.floor(32+ Math.floor(index/2) * 18.5)),
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(position.top, {
                    toValue: verticalScale(Number.isInteger(index/2)?
                        Math.floor(51 - Math.floor(index/2) * 5):
                        Math.floor(56 - Math.floor(index/2) * 5)),
                    duration: 1000,
                    useNativeDriver: false,
                })
            ]);
        });

        Animated.stagger(1000, animations).start();
        console.log('is-2-',isRoom)
    };

    useEffect(() => {
        console.log('effect----------')
            // placeMultipleCars(1)
            // moveImagesSequentially();

            //ここあとで制御変更する⭐️通話開始したら切り替え
            setTimeout(()=>{
                    setIsCompReading(true)}
                ,(roomInNumberOfPeople + 1) * 1000)
            setTimeout(()=>{
                    setIsRoom(true)}
                ,(roomInNumberOfPeople + 3) * 1000)

    }, []);

    useEffect(() => {
        console.log('人数変更',roomInNumberOfPeople,'元人数',carFileArray.length)
            if(roomInNumberOfPeople < carFileArray.length) {
                //人数減少
                console.log('down')
                const getCarNoArray: number[] = carNoArray.slice(0,roomInNumberOfPeople)
                const getCarFileArray: string[] = carFileArray.slice(0,roomInNumberOfPeople)
                setCarNoArray(getCarNoArray)
                setCarFileArray(getCarFileArray)
                setMyNum(roomInNumberOfPeople <= 3 ? 1 : 3)
                moveImagesSequentially();
            }else {
                //人数増加
                console.log('up')
                placeMultipleCars(carFileArray.length + 1)
                moveImagesSequentially();
            }

    }, [roomInNumberOfPeople]);

    const startExit = ()=>{
        if(!isExit){
            setIsExit(true)
            let countNum=2
            const countDownTimer = setInterval(()=>{
                if(countNum<=1){
                    setIsExit(false)
                    setCount(10)
                    setIsJam(false)
                    setIsTalk(false)
                    setIsRoom(false)
                    setIsCompReading(false)
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
                   source={require('../../assets/images/sec4_room.png')}/>

            <View style={{position:'absolute', top:'65%',left:'50%',backgroundColor:'yellow'}}>
                <Button title='人数を増やす' onPress={()=>{setRoomInNumberOfPeople(roomInNumberOfPeople+1)}}
                        color="red" accessibilityLabel="button"/></View>

            <View style={{position:'absolute', top:'70%',left:'50%', backgroundColor:'skyblue'}}>
                <Button title='人数をへらす' onPress={()=>{setRoomInNumberOfPeople(roomInNumberOfPeople-1)}}
                        color="red" accessibilityLabel="button"/></View>

            <View style={[{opacity: isRoom ? 1:0},thisStyles.main]}>
                <Pressable style={thisStyles.button} onPress={startExit} >
                    <Text style={thisStyles.buttonText}>退出</Text>
                </Pressable>
                <View style={thisStyles.peopleArea}>
                    <Text style={thisStyles.peopleText1}>現在</Text>
                    <Text style={thisStyles.peopleText2}>{roomInNumberOfPeople}</Text>
                    <Text style={thisStyles.peopleText3}>名</Text>
                </View>
            </View>

            <View style={[{opacity: isRoom ?0:1},thisStyles.main]}>
                {/*<View style={thisStyles.waitArea}></View>*/}
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(255, 255, 255, 1)','rgba(217,217,217,0.7)']}
                    end={{ x: 0.5, y: 0.75 }}
                    style={thisStyles.waitArea}
                />
                <LinearGradient
                    // Background Linear Gradient
                    colors={['rgba(217,217,217,0.7)','rgba(217,217,217,0)']}
                    end={{ x: 0.5, y: 0.75 }}
                    style={thisStyles.waitArea2}
                />

                    <Text style={thisStyles.waitText1}>{isCompReading?'参加しました！': '読み込み中'}</Text>
                {/*</View>*/}
                {/*<View style={thisStyles.waitArea2}></View>*/}

                <Image
                    source={carImages[`cw_1`]}
                    style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(57), left: horizontalScale(-6)}}
                    resizeMode='contain'
                />
                <Image
                    source={carImages[`cw_2`]}
                    style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(62), left: horizontalScale(12)}}
                    resizeMode='contain'
                />
                <Image
                    source={carImages[`cw_3`]}
                    style={{ width: horizontalScale(25) , position:'absolute', top: verticalScale(67), left: horizontalScale(-7)}}
                    resizeMode='contain'
                />
            </View>

            {/*{positions.map((position, index) => (*/}
            {carFileArray.map((carFile, index) => (
                <Animated.View
                    key={index}
                    style={{
                        position: 'absolute',
                        top: positions[index].top,
                        left: positions[index].left,
                        zIndex: positions[index].zIndex
                    }}
                >
                    <Image
                        source={carImages[`${carFile}${!isRoom || index === myNum ? 1 : 0}`]}
                        // source={carImages[`${carFileArray[index]}${!isRoom || index === myNum ? 1 : 0}`]}
                        style={{ width: horizontalScale(25) }}
                        resizeMode='contain'
                    />
                </Animated.View>
            ))}

            <View style={[thisStyles.countArea,{opacity: isExit ? 1:0 }]}>
                <Text style={thisStyles.countText1}>まもなくルームから退出します</Text>
                <Text style={thisStyles.countText2}>{count}</Text>
            </View>

        </View>
    );
};

const thisStyles = StyleSheet.create({
    main:{
        position:'absolute',
        top:0,
        left:0,
        width:'100%',
        height:'100%',
        alignItems:'center'
    },
    button: {
        position: 'absolute',
        top: verticalScale(75),//あとで再計算
        width: horizontalScale(72),
        height: verticalScale(9),
        borderRadius: 40,
        backgroundColor:'#737373',
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: 'white',
        zIndex:99
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
    waitArea: {
        position: 'absolute',
        top: 0,
        left:0,
        width: '100%',
        height: verticalScale(36*0.75),
        // backgroundColor: 'rgba(255, 255, 255, 0.54)',
        // backgroundColor:'linear-gradient(180deg,#D9D9D9 100%, #FFFFFF 78%)',
        // backGround: 'linear-gradient(180deg, #D9D9D9 100%, #FFFFFF 78%)',
        alignItems:'center'
    },
    waitArea2: {
        position: 'absolute',
        top: verticalScale(36*0.75),
        left:0,
        width: '100%',
        height: verticalScale(36*0.25),
        // backgroundColor: 'rgba(255, 255, 255, 0.4)',
        // backgroundColor:'linear-gradient(180deg,#D9D9D9 100%, #FFFFFF 78%)',
        // backGround: 'linear-gradient(180deg, #D9D9D9 100%, #FFFFFF 78%)',
        alignItems:'center'
    },
    waitText1: {
        fontWeight: 'bold',
        fontSize: moderateScale(40),
        fontFamily: 'BIZ UDPGothic',
        color:'#2B2B2B',
        position:'absolute',
        top:verticalScale(19)
    },
})