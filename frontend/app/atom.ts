import { atom } from "jotai";

export const uriAtom = atom<any>(null);

//APIパス
// export const apiAddressAtom = atom<string>("http://192.168.1.13:2929")
export const apiAddressAtom = atom<string>(`http://192.168.1.2:2929`);

//表示screen
export const screenAtom = atom<string>("sec0_1");

//渋滞に入ったかどうか（位置情報から設定）
export const isJamAtom = atom<boolean>(false);

//会話するかどうか（ユーザーが選択）
export const isTalkAtom = atom<boolean>(false);

//ルーム内の人数
export const roomInNumberOfPeopleAtom = atom<number>(1)
