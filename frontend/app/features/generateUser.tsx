// generateUser.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";

export const generateUser = async (username: string): Promise<string> => {
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
  });

  if (!response.ok) {
    throw new Error("ユーザー生成APIの呼び出しに失敗しました");
  }

  const json = await response.json();
  const [user] = json.user;
  console.log("レスポンス全体を確認:", user); // ← ここで実際のレスポンスを確認する

  const newClientId = user?.id;
  if (!newClientId) {
    throw new Error("サーバーのレスポンスに clientId が含まれていません。");
  }

  console.log("🥒: ", newClientId);

  return newClientId;
};
