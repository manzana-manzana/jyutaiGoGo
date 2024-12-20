import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { Asset } from "expo-asset";
import { useAtom } from "jotai";
import { uriAtom } from "../atom";

const API_KEY =
  "9C5246C7C0A6DAB7AD857208E083B04A546268FD00A517388563AC9A4E79727C21F5D5684F";

export default function App() {
  const [result, setResult] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useAtom(uriAtom); // 保存した録音のURI

  useEffect(() => {
    (async () => {
      const asset = Asset.fromModule(
        require("../../assets/voice/otukaresama01kawamoto 2.mp3"),
      );
      await asset.downloadAsync();
      setAudioUri(asset.localUri || asset.uri);
    })();
  }, []);

  const transcribe = async () => {
    console.log(audioUri);

    if (!audioUri) return;

    // Web環境ではBlobを取得してバイナリデータに変換
    let fileData;
    if (audioUri.startsWith("blob:")) {
      const response = await fetch(audioUri);
      fileData = await response.blob(); // Blobを取得
    } else {
      fileData = {
        uri: audioUri,
        name: "test.wav",
        type: "audio/wav",
      };
    }

    const formData = new FormData();
    // AmiVoice特有のパラメータ
    formData.append("d", "-a-general");
    formData.append("u", API_KEY);
    formData.append("a", fileData as any);

    const response = await fetch("https://acp-api.amivoice.com/v1/recognize", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    const json = await response.json();
    console.log(json);
    setResult(json);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ color: "green" }}>{audioUri}</Text>
      <Button title="文字起こし" onPress={transcribe} />
      {result && (
        <Text style={{ color: "green" }}>
          {JSON.stringify(result, null, 2)}
        </Text>
      )}
    </View>
  );
}
