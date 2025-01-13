import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { generateUser } from "@/app/features/generateUser";
import { useFetchClientId } from "@/app/features/fetchClientId";
import { NicknameRegistration } from "@/app/components/SendUsername";
import { useAtom } from "jotai/index";
import { usernameAtom, clientIdAtom } from "@/app/atom";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";

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
      <NicknameRegistration />
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
