import { Alert } from "react-native";
import { generateUser } from "@/app/features/generateUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai/index";
import { usernameAtom } from "@/app/atom";

export const useUsernameRegistration = () => {
  const [username, setUsername] = useAtom(usernameAtom);
  console.log('useUsernameRegistration--start---')

  return async () => {
    try {
      // 1. generateUserでusersテーブルにユーザー登録
      if (!username) {
        return;
      }
      const clientId = await generateUser(username);
      console.log("✅ usersテーブルに登録完了");
      // 2. id を Asyncstorageに保存
      await AsyncStorage.setItem("clientId", String(clientId));
      console.log(
        `✅ id: ${clientId} をstring型でAsyncStorageに保存しました。`,
      );
      // Alert.alert("登録処理", `ニックネーム「${username}」を登録しました！`);
    } catch (error) {
      console.log("username登録中にエラー発生:", error);
    }
  };
};
