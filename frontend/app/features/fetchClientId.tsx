// fetchClientId.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai";
import { clientIdAtom, usernameAtom } from "@/app/atom";

/**
 * AsyncStorage から clientId を取得するカスタムフック
 * clientId が存在しない場合は undefined を返します。
 */
export const useFetchClientId = () => {
  const [clientId, setClientId] = useAtom(clientIdAtom);
  const [username] = useAtom(usernameAtom);

  const fetchClientId = async (): Promise<string | undefined> => {
    try {
      // AsyncStorage から clientId を取得
      const storedId = await AsyncStorage.getItem("clientId");

      if (storedId) {
        setClientId(storedId);
        return storedId;
      } else {
        // clientId が存在しない場合は、undefined を返す
        setClientId(undefined);
        return undefined;
      }
    } catch (error) {
      console.error("clientId取得中のエラー:", error);
      return undefined;
    }
  };

  return { fetchClientId };
};
