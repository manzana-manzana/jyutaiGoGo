import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GroupUsersByLocation from "./GroupUsersByLocation";
import { useAtom } from "jotai";
import { locationAtom, clientIdAtom } from "../atom";
import { BASE_URL } from "@/config";

export default function Locations() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [location, setLocation] = useAtom(locationAtom);
  const [clientId, setClientId] = useAtom(clientIdAtom);

  useEffect(() => {
    (async () => {
      console.log("初回レンダリング");

      // 位置情報のリクエスト
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("位置情報へのアクセスが拒否されました。");
        return;
      }

      // subscriptionの設定
      const sub: any = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1, // 1m動いたら更新
          timeInterval: 500, // 0.5秒で更新
        },
        async (loc) => {
          setLocation(loc);
        },
      );

      // 継続取得開始
      setSubscription(sub);
    })();
  }, []);

  useEffect(() => {
    const fetchOrGenerateClientId = async () => {
      try {
        // AsyncStorage に保存済みの ID を取得
        const storedId = await AsyncStorage.getItem("clientId");
        if (storedId) {
          setClientId(storedId);
          console.log("既存の Client ID:", storedId);
        } else {
          // サーバーから新しい ID を取得
          const response = await fetch(`${BASE_URL}/api/assign-id`);
          const data = await response.json();
          const newClientId = data.clientId;

          // ID を AsyncStorage に保存
          await AsyncStorage.setItem("clientId", newClientId);
          setClientId(newClientId);
          console.log("新しい Client ID:", newClientId);
        }
      } catch (error) {
        console.error("Client ID の取得中にエラーが発生:", error);
      }
    };

    (async () => {
      try {
        await fetchOrGenerateClientId();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (!location) return;

    const insertLocation = async () => {
      console.log(new Date().toLocaleString());
      console.log("👽location監視のuseEffect");
      console.log("✅ clientId:", clientId);

      // バックエンドにデータを送信
      await fetch(`${BASE_URL}/api/users/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: clientId,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("📍 location データ送信成功");
          } else {
            console.error("🚨 location データ送信失敗:", response.status);
          }
        })
        .catch((error) => {
          console.error("🚨 location データ送信中にエラーが発生:", error);
        });
    };

    (async () => {
      try {
        await insertLocation();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [location, clientId]); // clientId を依存配列に追加

  const stopWatching = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);

      console.log("subscription: ", subscription);
      console.log("🐙stop watching");
    }
  };

  // 検証用のuuid削除関数
  const resetClientId = async () => {
    try {
      // 保存されている UUID を削除
      await AsyncStorage.removeItem("clientId");
      setClientId(null);
      console.log("Client ID をリセットしました");
    } catch (error) {
      console.error("Client ID リセット中にエラーが発生:", error);
    }
  };

  let text = "位置情報を取得しています...";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    const { latitude, longitude } = location.coords;
    text = `[現在地]\n緯度 ${latitude}\n経度 ${longitude}`;
  }

  return (

  <GroupUsersByLocation />
    // <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    //   <GroupUsersByLocation />
    //
    //   <Text style={{ color: "green" }}>{text}</Text>
    //   {!subscription ? (
    //     // <Button title="継続取得開始" onPress={startWatching} />
    //     <Button title="何も起きないよ" />
    //   ) : (
    //     <>
    //       <Button title="継続取得停止" onPress={stopWatching} />
    //       <Text style={{ color: "green" }}>
    //         Client ID: {clientId || "取得中..."}
    //       </Text>
    //       <Button title="AsyncStorageのuuid削除" onPress={resetClientId} />
    //     </>
    //   )}
    // </View>
  );
}
