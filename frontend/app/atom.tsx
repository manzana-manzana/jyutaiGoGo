import { atom } from "jotai";
import { BASE_URL } from "@/config";
import { ImageSourcePropType } from "react-native";
import { useState } from "react";

// ユーザーデータ型定義
type User = {
  id: number;
  username: string;
  latitude: number;
  longitude: number;
  isMyAccount: boolean;
};

type Groups = {
  [key: string]: User[];
};

// ユーザー名 （かぶってる）
export const usernameAtom = atom<string | null>(null);

// APIパス
// export const apiAddressAtom = atom<string>('http://192.168.1.9:2929');
export const apiAddressAtom = atom<string>(BASE_URL);

// 表示screen
export const screenAtom = atom<string>("sec0_1");

// 渋滞に入ったかどうか（位置情報から設定）
export const isJamAtom = atom<boolean>(false);

// 会話するかどうか（ユーザーが選択）
export const isTalkAtom = atom<boolean>(false);

// ルーム内の人数
export const roomInNumberOfPeopleAtom = atom<number>(2);

// ユーザーのid
export const clientIdAtom = atom<string | undefined>(undefined);

// ユーザーの緯度・経度
export const locationAtom = atom<any>(null);

// ユーザー情報リスト
export const usersAtom = atom<User[]>([]);

// グループ化されたデータ
export const groupsAtom = atom<Groups>({});

// 通話グループの参加者データ
// export const roomMemberAtom = atom<User[]>([]);

// type User = {
//   id: number;
//   username: string;
//   latitude: number;
//   longitude: number;
//   isMyAccount: boolean;
// };
//位置情報で設定したルームメンバーの配列(ルーム画面での車表示で使用)
export const roomMemberAtom = atom([
  { id: 111, username: "コアラ", isMyAccount: false },
  { id: 222, username: "パンダ", isMyAccount: true },
  { id: 222, username: "ペンギン", isMyAccount: false },
]);

//オープニングムービー終了判定
export const isOpeningEndAtom = atom<boolean>(false);

//top画面の文字
export const fontAtom = atom(require("@/app/features/fetchClientId"));

//車関係の画像データ
type CarImages = {
  [key: string]: ImageSourcePropType;
};
export const carImagesAtom = atom<CarImages>({
  c1_0: require("../assets/images/cars/car1_0.png") as ImageSourcePropType,
  c1_1: require("../assets/images/cars/car1_1.png") as ImageSourcePropType,
  c2_0: require("../assets/images/cars/car2_0.png") as ImageSourcePropType,
  c2_1: require("../assets/images/cars/car2_1.png") as ImageSourcePropType,
  c3_0: require("../assets/images/cars/car3_0.png") as ImageSourcePropType,
  c3_1: require("../assets/images/cars/car3_1.png") as ImageSourcePropType,
  c4_0: require("../assets/images/cars/car4_0.png") as ImageSourcePropType,
  c4_1: require("../assets/images/cars/car4_1.png") as ImageSourcePropType,
  c5_0: require("../assets/images/cars/car5_0.png") as ImageSourcePropType,
  c5_1: require("../assets/images/cars/car5_1.png") as ImageSourcePropType,
  c6_0: require("../assets/images/cars/car6_0.png") as ImageSourcePropType,
  c6_1: require("../assets/images/cars/car6_1.png") as ImageSourcePropType,
  c7_0: require("../assets/images/cars/car7_0.png") as ImageSourcePropType,
  c7_1: require("../assets/images/cars/car7_1.png") as ImageSourcePropType,
  c8_0: require("../assets/images/cars/car8_0.png") as ImageSourcePropType,
  c8_1: require("../assets/images/cars/car8_1.png") as ImageSourcePropType,
  cw_1: require("../assets/images/cars/car_wait_1.png") as ImageSourcePropType,
  cw_2: require("../assets/images/cars/car_wait_2.png") as ImageSourcePropType,
  cw_3: require("../assets/images/cars/car_wait_3.png") as ImageSourcePropType,
  cw_4: require("../assets/images/cars/car_wait_4.png") as ImageSourcePropType,
  cw_5: require("../assets/images/cars/car_wait_5.png") as ImageSourcePropType,
  cw_6: require("../assets/images/cars/car_wait_6.png") as ImageSourcePropType,
  cb_0: require("../assets/images/bubbles/b0.png") as ImageSourcePropType,
  cb_1: require("../assets/images/bubbles/b1.png") as ImageSourcePropType,
  cb_2: require("../assets/images/bubbles/b2.png") as ImageSourcePropType,
  cb_3: require("../assets/images/bubbles/b3.png") as ImageSourcePropType,
  cb_4: require("../assets/images/bubbles/b4.png") as ImageSourcePropType,
  cb_5: require("../assets/images/bubbles/b5.png") as ImageSourcePropType,
  cb_6: require("../assets/images/bubbles/b6.png") as ImageSourcePropType,
  cb_7: require("../assets/images/bubbles/b7.png") as ImageSourcePropType,
  cb_8: require("../assets/images/bubbles/b8.png") as ImageSourcePropType,
});
