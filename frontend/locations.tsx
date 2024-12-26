import React, { useState, useEffect } from 'react';
import { View, Text, Button, Platform } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
    const [location, setLocation] = useState<any>(null);
    const [errorMsg, setErrorMsg] = useState<string|null>(null);
    const [subscription, setSubscription] = useState<any>(null);

    useEffect(() => {
        (async () => {
            // 位置情報のリクエスト
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('位置情報へのアクセスが拒否されました。');
                return;
            }

            // 現在地を取得
            let currentLocation: any = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);

            // バックエンドに送る
            await fetch('/api/users/locations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(location),
            });

        })();
    }, []);

    const startWatching = async () => {
        if (!subscription) {
            const sub: any = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10, // 10m動いたら更新
                    timeInterval: 5000, // 0.5秒で更新
                },
                async (loc) => {
                    setLocation(loc);

                    // バックエンドに送る
                    await fetch('/api/users/locations', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(location),
                    });
                }
            );
            setSubscription(sub);
        }
    };

    const stopWatching = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        }
    };

    console.log(location);

    let text = '位置情報を取得しています...';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        const { latitude, longitude } = location.coords;
        text = `[現在地]\n緯度 ${latitude}\n経度 ${longitude}`;
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{color: 'green'}}>{text}</Text>
            {!subscription ? (
                <Button title="継続取得開始" onPress={startWatching} />
            ) : (
                <Button title="継続取得停止" onPress={stopWatching} />
            )}
        </View>
    );
}
