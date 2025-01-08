import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

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
  const [users, setUsers] = useState<User[]>([]); // ユーザー情報リスト
  const [groups, setGroups] = useState<Groups>({}); // グループ化されたデータ

  useEffect(() => {
    // 仮のデータ（バックエンドから取得する想定）
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.11.5:8080/api/users");
        if (!response.ok) {
          throw new Error(`APIリクエストに失敗しました: ${response.status}`);
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("ユーザー情報取得中にエラーが発生:", error);
      }
    };

    fetchUsers();
  }, []);

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
