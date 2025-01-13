import { Button, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { generateUser } from "@/app/features/generateUser";
import { useFetchClientId } from "@/app/features/fetchClientId";
import { UsernameRegistration } from "@/app/components/SendUsername";
import { useAtom } from "jotai/index";
import { usernameAtom, clientIdAtom } from "@/app/atom";
import React, { useEffect } from "react";
import { BASE_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [username, setUsername] = useAtom(usernameAtom);
  const [clientId, setClientId] = useAtom(clientIdAtom);

  const { fetchClientId } = useFetchClientId(); // カスタムフックの呼び出し

  useEffect(() => {
    (async () => {
      const id = await fetchClientId();
      setClientId(id);
      const response = await fetch(`${BASE_URL}/api/users/${id}`);
      const data = await response.json();
      console.log("🍉:", data);
      setUsername(data.username);
    })();
  }, []);

  // 検証用のid削除関数
  const resetClientId = async () => {
    try {
      // 保存されている UUID を削除
      await AsyncStorage.removeItem("clientId");
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("userName");

      setClientId(undefined);
      console.log("Client ID をリセットしました");
    } catch (error) {
      console.error("Client ID リセット中にエラーが発生:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["rgba(0,0,0,0.8)", "transparent"]}
        style={styles.background}
      />
      <LinearGradient
        // Button Linear Gradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.button}
      >
        <Text style={styles.text}>Hello world!</Text>
      </LinearGradient>
      <Text style={styles.text}>{username}</Text>
      <Button title="AsyncStorageのid削除" onPress={resetClientId} />

      <UsernameRegistration />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "orange",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 300,
  },
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  text: {
    backgroundColor: "transparent",
    fontSize: 15,
    color: "#fff",
  },
});
