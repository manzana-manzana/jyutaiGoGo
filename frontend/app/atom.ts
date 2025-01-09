import { atom } from "jotai";
import { BASE_URL } from "@/config";

// ユーザーデータ型定義
type User = {
  uuid: string;
  latitude: number;
  longitude: number;
};

type Groups = {
  [key: string]: User[];
};

// ???
export const uriAtom = atom<any>(null);

// APIパス
export const apiAddressAtom = atom<string>(BASE_URL);

// 表示screen
export const screenAtom = atom<string>("sec0_1");

// 渋滞に入ったかどうか（位置情報から設定）
export const isJamAtom = atom<boolean>(false);

// 会話するかどうか（ユーザーが選択）
export const isTalkAtom = atom<boolean>(false);

// ルーム内の人数
export const roomInNumberOfPeopleAtom = atom<number>(1);

// ユーザーのuuid
export const clientIdAtom = atom<string | null>(null);

// ユーザーの緯度・経度
export const locationAtom = atom<any>(null);

// ユーザー情報リスト
export const usersAtom = atom<User[]>([]);

// グループ化されたデータ
export const groupsAtom = atom<Groups>({});
