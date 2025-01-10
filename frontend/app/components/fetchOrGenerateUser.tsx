import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import { useAtom } from "jotai";
import { clientIdAtom, usernameAtom } from "@/app/atom";

// カスタムフック作成
export const useFetchOrGenerateUser = () => {
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const [username] = useAtom(usernameAtom);

  const fetchOrGenerateUser = async () => {
    try {
      const storedId = await AsyncStorage.getItem("clientId");
      if (storedId) {
        setClientId(storedId);
      } else {
        const response = await fetch(`${BASE_URL}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        const newClientId = data.clientId;

        await AsyncStorage.setItem("clientId", newClientId);
        setClientId(newClientId);
      }
    } catch (error) {
      console.error("エラー:", error);
    }
  };

  return { fetchOrGenerateUser };
};
