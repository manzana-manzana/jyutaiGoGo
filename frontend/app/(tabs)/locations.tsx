import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    (async () => {
      console.log("初回レンダリング");

      // 位置情報のリクエスト
      let { status } = await Location.requestForegroundPermissionsAsync();
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
    const insertLocation = async () => {
      // バックエンドに送る
      console.log(new Date().toLocaleString());
      console.log("👽location監視のuseEffect");

      await fetch("http://192.168.11.5:8080/api/users/locations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "user_5000", // userIdを入れるようにする
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }),
      });
    };
    insertLocation();
  }, [location]);
  // }, [subscription, location]);

  const stopWatching = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);

      console.log("subscription: ", subscription);
      console.log("🐙stop watching");
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ color: "green" }}>{text}</Text>
      {!subscription ? (
        // <Button title="継続取得開始" onPress={startWatching} />
        <Button title="何も起きないよ" />
      ) : (
        <>
          <Button title="継続取得停止" onPress={stopWatching} />
        </>
      )}
    </View>
  );
}
