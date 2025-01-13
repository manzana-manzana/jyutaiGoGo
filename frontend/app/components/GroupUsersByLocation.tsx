import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useAtom, useAtomValue } from "jotai";
import { usersAtom, groupsAtom, locationAtom, isJamAtom, roomInNumberOfPeopleAtom } from "./../atom";
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
  const [isJam, setIsJam] = useAtom(isJamAtom);
  const [roomInNumberOfPeople, setRoomInNumberOfPeople] = useAtom(roomInNumberOfPeopleAtom);

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

  // グループ分けロジック
  const groupUsersByLocation = () => {
    const grouped = users.reduce<Groups>((acc, user) => {
      const lat = Math.floor(user.latitude * 10) / 10;
      const lon = Math.floor(user.longitude * 10) / 10;
      const groupKey = `${lat},${lon}`;

      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(user);
      return acc;
    }, {});

    setGroups(grouped);

    const myLat = Math.floor(location.coords.latitude * 10) / 10;
    const myLon = Math.floor(location.coords.longitude * 10) / 10;
    const myGroupKey = `${myLat},${myLon}`;

    console.log("💖自分の位置情報:", { myLat, myLon, myGroupKey });
    console.log("😀自分のグループのメンバー:", grouped[myGroupKey]);

    const hasMultipleMembers = grouped[myGroupKey]?.length >= 2;
    setIsJam(hasMultipleMembers);
    setRoomInNumberOfPeople(grouped[myGroupKey]?.length);
  };

  useEffect(() => {
    // 初回実行
    (async () => {
      try {
        await fetchUsers();
      } catch (error) {
        console.error(error);
      }
    })();

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
  }, [location]); // locationが変更されたときにインターバルをリセット

  useEffect(() => {
    if (users.length > 0) {
      groupUsersByLocation();
    }
  }, [users]);

  return <></>;
}