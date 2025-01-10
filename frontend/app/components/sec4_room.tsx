import React, {useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View, Animated, Dimensions, Button, ImageSourcePropType} from 'react-native';
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
import {getMediaPlayerCacheManager} from "react-native-agora";
// import addCustomEqualityTester = jasmine.addCustomEqualityTester;

type CarImages = {
    [key: string]: ImageSourcePropType;
};
const carImages:CarImages = {
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

type Person = {uuid: string,username: string,isMe: boolean};
type Members = {uuid: string, username: string, isMe: boolean,
    carNo: number, beforeFile:string, afterFile:string}



const addAtom = {uuid:'u444', username:'マイク', isMe:false}

export default function Sec4_Room()  {
    // const [roomInNumberOfPeople,setRoomInNumberOfPeople] = useAtom(roomInNumberOfPeopleAtom)
    const [isJam, setIsJam] = useAtom(isJamAtom)
    const [isTalk, setIsTalk] = useAtom(isTalkAtom)
    const [count, setCount]= useState(10)
    const [isExit, setIsExit]= useState(false)
    // const [carNoArray, setCarNoArray] = useState<number[]>([])
    // const [carFileArray, setCarFileArray] = useState<string[][]>([])
    // const [myNum, setMyNum]= useState<number>(0)
    const [isRoom,setIsRoom]= useState<boolean>(false)
    const [isCompReading, setIsCompReading] = useState<boolean>(false)
    const [maxNum, setMaxNum] = useState(6)
    const [isFirst, setIsFirst] = useState(true)
    const [existsCars, setExistsCars] = useState(0)
    const [differenceCars, setDifferenceCars]= useState(0)
    const [members, setMembers]= useState<Members[]>([])

    //テスト用に配置
    const [peopleAtom , setPeopleAtom] = useState<Person[]>([
        {uuid:'u11111', username:'たろう', isMe:false},
        {uuid:'u22222', username:'しげりんご', isMe:true},
        {uuid:'u33333', username:'ミニオン', isMe:false},
    ])
    // const [isReturn, setIsReturn] = useState(false)

    const placeMultipleCars = () => {
        console.log('placeMultipleCars---')
        console.log('peopleAtom',peopleAtom)
        // const getCarNoArray: number[] = []//carNoArray.slice()
        // const getCarFileArray: string[][] = []//carFileArray.slice()



        //いなくなったメンバーを削除
        const getMembersArray: Members[] = members.filter(member=>
                    peopleAtom.some(obj => obj.uuid === member.uuid))
        console.log('削除メンバーを除いた既存メンバー',getMembersArray)

        //新規メンバーを追加
        let newMembers: Person[]=[]
        if(isFirst) {
            newMembers = peopleAtom
        }else{
                // newMembers = peopleAtom.filter(obj =>
                // members.some(member => obj.uuid !== member.uuid))
            newMembers = peopleAtom.filter(obj => members.every(member => member.uuid !== obj.uuid))
        }
        console.log('isFirst',isFirst)
        console.log('新規メンバー',newMembers.length,'人',newMembers)

        // const myNum = (roomInNumberOfPeople <= 3 ? 2 : 4)//ユーザー車位置は参加者3人までなら2、4人以上なら4
        // for (let i = 1; i <= maxNum; i++) {
        //新規メンバーの情報追加
        newMembers.forEach((obj)=>{
            console.log('処理メンバー--',obj)
            //車の色をダブらないように設定
            let carNo = 0
            while (carNo === 0) {
                const getNo = Math.floor(Math.random() * 8) + 1;
                if (!getMembersArray.some(member => member.carNo === getNo)) {
                    // if (!   getCarNoArray.includes(getNo)) {
                    carNo = getNo
                    // getCarNoArray.push(getNo)
                }
            }
// console.log('carNo：',carNo)
            const carFileNameBefore = `c${carNo}_1`
            const  carFileNameAfter = obj.isMe ? `c${carNo}_1` : `c${carNo}_0`
            // const  carFileNameAfter = i === myNum ? `c${carNo}_1` : `c${carNo}_0`
                // const carFileName = i === myNum ? `c${carNo}_1` : `c${carNo}_0`
            getMembersArray.push( {uuid: obj.uuid, username: obj.username, isMe: obj.isMe,
                carNo: carNo, beforeFile:carFileNameBefore, afterFile:carFileNameAfter})
                // getCarFileArray    [carFileNameBefore,carFileNameAfter])
        })
        // }
        console.log('isRoom--',isRoom)
        // console.log(getCarNoArray)
        // setCarFileArray(getCarFileArray)
        // setCarNoArray(getCarNoArray)
        console.log(getMembersArray.length,'人　',getMembersArray)
        setMembers(getMembersArray)
    }

    // 初期位置
    const [positions, setPositions] = useState(
        new Array(maxNum).fill(0).map((value,index) => ({
            top: new Animated.Value(Number.isInteger(index/2)?
                verticalScale(28):verticalScale(38)),
            left: new Animated.Value(horizontalScale(100)),
                // Number.isInteger(index/2)?
                // horizontalScale(100):horizontalScale(100)),
            zIndex: maxNum - index + 1
        }))
    );

    const moveImagesSequentially = (isReturn:boolean) => {
        console.log('moveImagesSequentially---',peopleAtom.length,'台')

        const animations = positions.slice(0,peopleAtom.length).map((position, index) => {
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

        const returnAnimations =  positions.map((position, index) => {
            return Animated.parallel([
                Animated.timing(position.left, {
                    toValue: horizontalScale(100),
                    duration: 10,
                    useNativeDriver: false,
                }),
                Animated.timing(position.top, {
                    toValue: Number.isInteger(index/2)? verticalScale(28):verticalScale(38),
                    duration: 10,
                    useNativeDriver: false,
                })
            ]);
        });
//existscars
        const endAnimations =  positions.slice(0,peopleAtom.length).map((position, index) => {

            return Animated.parallel([
                Animated.timing(position.left, {
                    toValue: horizontalScale(-50),
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(position.top, {
                    toValue: Number.isInteger(index/2)? verticalScale(67):verticalScale(78),
                    duration: 1000,
                    useNativeDriver: false,
                })
            ]);
        });

        if(isReturn){
            console.log('return')
            const returnAnimated = ()=> {
                Animated.sequence([
                    Animated.stagger(100, endAnimations),
                    Animated.stagger(0, returnAnimations),
                ]).start(() => {
                    placeMultipleCars()
                    Animated.stagger(1000, animations).start()
                });
            }
            returnAnimated()
        }else {
            Animated.stagger(1000, animations).start();
        }
        console.log('is-2-',isRoom)

        // setIsReturn(false)
    };

    useEffect(() => {
        console.log('effect----------')
            placeMultipleCars()
            moveImagesSequentially(false);

            //ここあとで制御変更する⭐️通話開始したら切り替え
            setTimeout(()=>{
                    setIsCompReading(true)}
                ,(members.length + 1) * 1000)
            setTimeout(()=>{
                    setIsRoom(true)}
                ,(members.length + 3) * 1000)
        // setTargetCars(roomInNumberOfPeople)
        setExistsCars(members.length)
    }, []);

    useEffect(() => {
console.log('-------------------')
        if(!isFirst) {
            // console.log('人数変更', roomInNumberOfPeople, '元人数', carFileArray.length, '/ position:', positions.length)
            // setIsReturn(true)
            // if(roomInNumberOfPeople < existsCars){

                setDifferenceCars(existsCars - members.length)
            // }else{
            //     setDifferenceCars(0)
            // }

            moveImagesSequentially(true);
            // setMyNum(roomInNumberOfPeople <= 3 ? 1 : 3)
        }
        // setTargetCars(roomInNumberOfPeople)
        setIsFirst(false)
        setExistsCars(members.length)
    }, [peopleAtom]);

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
                    setIsFirst(true)
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
                <Button title='人数を増やす' onPress={()=>{
                    if (members.length <= 5) {
                        const random =Math.floor(Math.random() * 1000)
                        setPeopleAtom((prevPeopleAtom) => [...prevPeopleAtom,  {
                            uuid: `u${random}`,username: '追加',isMe: false,
                        }]);
                    }
                }}

                    color="red" accessibilityLabel="button"/></View>

            <View style={{position:'absolute', top:'70%',left:'50%', backgroundColor:'skyblue'}}>
                <Button title='人数をへらす' onPress={()=> {
                    // setRoomInNumberOfPeople(roomInNumberOfPeople-1)
                }}
                        color="red" accessibilityLabel="button"/></View>

            <View style={[{opacity: isRoom ? 1:0},thisStyles.main]}>
                <Pressable style={thisStyles.button} onPress={startExit} >
                    <Text style={thisStyles.buttonText}>退出</Text>
                </Pressable>
                <View style={thisStyles.peopleArea}>
                    <Text style={thisStyles.peopleText1}>現在</Text>
                    <Text style={thisStyles.peopleText2}>{members.length}</Text>
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

            {/*{carFileArray.slice(0,roomInNumberOfPeople+ (differenceCars>0?differenceCars:0))*/}
            {members.map((member, index) => (
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

                        source={carImages[`${isCompReading? member.afterFile: member.beforeFile}`]}
                        // source={carImages[`${isCompReading? carFileArray[index][1]: carFileArray[index][0]}`]}

                            // `${carFile}${?!isRoom
                        // || index === ((roomInNumberOfPeople + (differenceCars<0? differenceCars:0))<=3?1:3) ? 1 : 0}`]}
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