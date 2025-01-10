import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import { useAtom } from "jotai/index";
import { clientIdAtom, usernameAtom } from "@/app/atom";

export const fetchOrGenerateUser = async () => {
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const [username, setUsername] = useAtom(usernameAtom);

  try {
    // AsyncStorage に保存済みの ID を取得
    const storedId = await AsyncStorage.getItem("clientId");
    if (storedId) {
      setClientId(storedId);
      console.log("既存の Client ID:", storedId);
    } else {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      const data = await response.json();
      console.log("🍉🍉🍉🍉🍉🍉🍉🍉", data);
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
