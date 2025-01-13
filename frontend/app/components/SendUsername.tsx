import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { generateUser } from "@/app/features/generateUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAtom } from "jotai/index";
import { usernameAtom } from "@/app/atom";

export const UsernameRegistration = () => {
  const [nickname, setNickname] = useState("");
  const [username, setUsername] = useAtom(usernameAtom);

  const handleRegister = async () => {
    try {
      // 1. generateUserでusersテーブルにユーザー登録
      const clientId = await generateUser(nickname);
      // 2. id を Asyncstorageに保存
      await AsyncStorage.setItem("clientId", String(clientId));
      console.log(`id: ${clientId} をstring型でAsyncStorageに保存しました。`);
      // 3. id を atomにも保存
      setUsername(nickname);
      Alert.alert("登録処理", `ニックネーム「${nickname}」を登録しました！`);
    } catch (error) {
      console.log("username登録中にエラー発生:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="ニックネームを入力してください"
        value={nickname}
        onChangeText={(text) => setNickname(text)}
      />
      <Button
        title="登録する"
        onPress={handleRegister}
        disabled={!nickname.trim()} // ニックネームが空の場合はボタンを無効化
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
});
