import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { usersAtom, groupsAtom, locationAtom ,isJamAtom , roomInNumberOfPeopleAtom} from "./../atom";
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

export default function GroupUsersByLocation() {
  const [users, setUsers] = useAtom(usersAtom);
  const [groups, setGroups] = useAtom(groupsAtom);
  const location = useAtomValue(locationAtom);
  // 渋滞の有無を判定している
  const [isJam, setIsJam] = useAtom(isJamAtom)
  const [roomInNumberOfPeople, setRoomInNumberOfPeople] = useAtom(roomInNumberOfPeopleAtom)


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/users`);
        if (!response.ok) {
          console.error(`APIリクエストに失敗しました: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("ユーザー情報取得中にエラーが発生:", error);
      }
    };

    (async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [location]);

  useEffect(() => {
    // グループ分けロジック
    const groupUsersByLocation = () => {
      const grouped = users.reduce<Groups>((acc, user) => {
        // 緯度と経度を小数点第一位まで切り捨て
        const lat = Math.floor(user.latitude * 10) / 10; // 約11km
        const lon = Math.floor(user.longitude * 10) / 10; // 約9.1km
        const groupKey = `${lat},${lon}`; // グループのキー

        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(user);
        return acc;
      }, {});

      setGroups(grouped);

      // 自分の位置情報から所属グループを特定
      const myLat = Math.floor(location.coords.latitude * 10) / 10;
      const myLon = Math.floor(location.coords.longitude * 10) / 10;
      const myGroupKey = `${myLat},${myLon}`;
      // デバッグ追加
      console.log("💖自分の位置情報:", { myLat, myLon, myGroupKey });
      console.log("😀自分のグループのメンバー:", grouped[myGroupKey]);

      // 自分のグループのメンバー数をチェック()
      const hasMultipleMembers = grouped[myGroupKey]?.length >= 2;
      setIsJam(hasMultipleMembers); // 新しく作るステート
      setRoomInNumberOfPeople(grouped[myGroupKey]?.length)
    };

    if (users.length > 0) {
      groupUsersByLocation();
    }
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
            <Text key={user.uuid} style={{ color: "orange" }}>
              UUID: {user.uuid}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
