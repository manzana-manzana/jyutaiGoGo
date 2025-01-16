import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { usersAtom, groupsAtom, locationAtom, roomMemberAtom, isJamAtom, roomInNumberOfPeopleAtom } from "./../atom";
import { BASE_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function GroupUsersByLocation() {
  const [users, setUsers] = useAtom(usersAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const location = useAtomValue(locationAtom);
  const [roomMember, setRoomMember] = useAtom(roomMemberAtom);
  const [isJam, setIsJam] = useAtom(isJamAtom);
  const [roomInNumberOfPeople, setRoomInNumberOfPeople] = useAtom(roomInNumberOfPeopleAtom);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users`);
        if (!response.ok) {
          console.error(`APIリクエストに失敗しました: ${response.status}`);
        }
        const clientId = await AsyncStorage.getItem("clientId");
        const data = await response.json();
        const users: User[] = data.map((user: any) => {
          return {
            id: user.user_id,
            username: user.username,
            latitude: user.latitude,
            longitude: user.longitude,
            isMyAccount: user.user_id === Number(clientId),
          };
        });
        setUsers(users);
      } catch (error) {
        console.error("ユーザー情報取得中にエラーが発生:", error);
      }
    };

    // (async () => {
    //   try {
    //     await fetchUsers();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // })();

      // 1分間隔でfetchUsersを実行
      const interval = setInterval(async () => {
          try {
              await fetchUsers();
          } catch (error) {
              console.error(error);
          }
      }, 60000); // 60秒 = 1分

      // クリーンアップ関数
      return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (users.length === 0) return;

    // 1. グループ分け
    const grouped = users.reduce<Groups>((acc, user) => {
      const lat = Math.floor(user.latitude * 10) / 10;
      const lon = Math.floor(user.longitude * 10) / 10;
      const groupKey = `${lat},${lon}`;

      // 同じグループキーに属するユーザーを配列にまとめる
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(user);
      return acc;
    }, {});
    setGroups(grouped);

    // 2.自分が含まれるグループだけ フラットにして roomMember に
    const roomMemberData = Object.values(grouped) // 各グループ配列を取得
      .filter((members) => members.some((member) => member.isMyAccount))
      .flat();

    setRoomMember(roomMemberData);

      // 自分の位置情報
      const myLat = Math.floor(location.coords.latitude * 10) / 10;
      const myLon = Math.floor(location.coords.longitude * 10) / 10;
      const myGroupKey = `${myLat},${myLon}`;

      console.log("💖自分の位置情報:", { myLat, myLon, myGroupKey });
      console.log("😀自分のグループのメンバー:", grouped[myGroupKey]);

      const hasMultipleMembers = grouped[myGroupKey]?.length >= 2;
      setIsJam(hasMultipleMembers);
      setRoomInNumberOfPeople(grouped[myGroupKey]?.length);
  }, [users]);

  return (
    <View>
      <Text>グループ化されたデータ:</Text>
      {Object.entries(groups).map(([groupKey, members]) => (
        <View key={groupKey} style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold", color: "orange" }}>
            グループ {groupKey}:
          </Text>
          {members.map((user) => (
            <Text key={user.id} style={{ color: "orange" }}>
              ID{user.id}: {user.username}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
