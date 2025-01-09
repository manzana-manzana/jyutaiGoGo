import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  IRtcEngineEventHandler,
} from "react-native-agora";
import { BASE_URL } from "@/config";

// アプリケーションの基本情報
const appId = "12d6ce5a43d740298dc00619516bb4b2"; // AgoraのApp ID
const channelName = "tsugu"; // チャンネル名
const uid = 0; // ローカルユーザーのUID（0は自動割り当て）
const hostName = "Aさん"; // ホストの名前（適宜変更してください）

export default function Agora() {
  // Agoraエンジンの参照を保持
  const agoraEngineRef = useRef<IRtcEngine | null>(null);

  // 状態管理
  const [token, setToken] = useState<string>(""); // RTCトークン
  const [isJoined, setIsJoined] = useState(false); // チャンネル参加状態
  const [isHost, setIsHost] = useState(true); // ユーザーの役割（ホスト/オーディエンス）
  const [remoteUid, setRemoteUid] = useState(0); // リモートユーザーのUID
  const [message, setMessage] = useState(""); // ユーザーメッセージ表示用
  const eventHandler = useRef<IRtcEngineEventHandler | null>(null); // Agoraイベントハンドラー

  // コンポーネントのマウント時にAgoraエンジンをセットアップし、アンマウント時にクリーンアップ
  useEffect(() => {
    setupVideoSDKEngine();
    return () => {
      if (agoraEngineRef.current && eventHandler.current) {
        agoraEngineRef.current.unregisterEventHandler(eventHandler.current);
        agoraEngineRef.current.leaveChannel();
        agoraEngineRef.current.release();
      }
    };
  }, []);

  /**
   * Agora SDKの初期設定を行う関数
   */
  const setupVideoSDKEngine = async () => {
    try {
      // Androidの場合、必要なパーミッションを取得
      if (Platform.OS === "android") {
        const hasPermission = await getPermission();
        if (!hasPermission) {
          return;
        }
      }

      // Agoraエンジンの作成
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      console.log("✅ Agora SDKが作成されました");

      // イベントハンドラーの設定
      eventHandler.current = {
        // チャンネル参加成功時のイベント
        onJoinChannelSuccess: () => {
          console.log("🎉 onJoinChannelSuccess イベント発火");
          if (isHost) {
            showMessage("チャンネルを作成しました");
          } else {
            showMessage(`${hostName}のチャンネルに参加しました`);
          }
          setIsJoined(true);
        },
        // リモートユーザーが参加した時のイベント
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          console.log(`👤 onUserJoined イベント発火: リモートUID=${uid}`);
          showMessage("リモートユーザー " + uid + " が参加しました");
          setRemoteUid(uid);
        },
        // リモートユーザーがオフラインになった時のイベント
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          console.log(`👋 onUserOffline イベント発火: リモートUID=${uid}`);
          showMessage(
            "リモートユーザー " + uid + " がチャンネルを退出しました",
          );
          setRemoteUid(0);
        },
      };

      // イベントハンドラーをエンジンに登録
      if (eventHandler.current) {
        agoraEngine.registerEventHandler(eventHandler.current);
        console.log("🔄 イベントハンドラーが登録されました");
      }

      // Agoraエンジンの初期化
      agoraEngine.initialize({
        appId: appId,
      });
      console.log("🚀 Agora SDKが初期化されました");
    } catch (e) {
      console.log("❌ setupVideoSDKEngine エラー:", e);
      showMessage("SDKのセットアップ中にエラーが発生しました");
    }
  };

  /**
   * RTCトークンをサーバーから取得する関数
   */
  const fetchToken = useCallback(() => {
    const url = `${BASE_URL}/api/tokens`;
    const body = JSON.stringify({
      uid,
      channelName: channelName,
      role: isHost
        ? ClientRoleType.ClientRoleBroadcaster
        : ClientRoleType.ClientRoleAudience,
    });
    console.log("🔍 fetchToken - URL:", url);
    console.log("🔍 fetchToken - Body:", body);
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("📩 fetchToken - Response:", res);
        if (+res.code === 200 && typeof res.token === "string") {
          setToken(res.token);
          showMessage("🔑 トークンの取得に成功しました");
        } else {
          showMessage("❌ トークンの取得に失敗しました");
        }
        return res;
      })
      .catch((error) => {
        console.error("⚠️ fetchToken - エラー:", error);
        showMessage("⚠️ トークン取得中にエラーが発生しました");
      });
  }, [isHost]);

  /**
   * チャンネルに参加する関数
   */
  const join = useCallback(async () => {
    if (!token) {
      console.log("🔄 join - トークンが存在しないため取得します");
      await fetchToken();
    }
    if (token && agoraEngineRef.current) {
      try {
        console.log("📡 join - チャンネルに参加します: トークン=", token);
        await agoraEngineRef.current.joinChannel(token, channelName, uid, {
          channelProfile: ChannelProfileType.ChannelProfileLiveBroadcasting, // ライブブロードキャストモード
          clientRoleType: isHost
            ? ClientRoleType.ClientRoleBroadcaster
            : ClientRoleType.ClientRoleAudience, // ユーザーの役割設定
          publishMicrophoneTrack: isHost, // ホストはマイクを公開
          autoSubscribeAudio: true, // オーディオの自動購読
        });
      } catch (e) {
        console.log("❗ join - エラー:", e);
        showMessage("❗ チャンネル参加中にエラーが発生しました");
      }
    }
  }, [fetchToken, isHost, token]);

  /**
   * チャンネルから退出する関数
   */
  const leave = useCallback(async () => {
    if (agoraEngineRef.current && isJoined) {
      try {
        await agoraEngineRef.current.leaveChannel();
        console.log("🏃‍♂️ leave - チャンネルを退出しました");
        setRemoteUid(0);
        setIsJoined(false);
        showMessage("🏃‍♂️ チャンネルを退出しました");
      } catch (e) {
        console.log("❗ leave - エラー:", e);
        showMessage("❗ チャンネル退出中にエラーが発生しました");
      }
    } else {
      showMessage("ℹ️ まだチャンネルに参加していません");
    }
  }, [isJoined]);

  /**
   * メッセージを表示し、一定時間後にクリアする関数
   * @param msg 表示するメッセージ
   */
  const showMessage = (msg: string) => {
    setMessage(msg);
    // 5秒後にメッセージをクリア
    setTimeout(() => setMessage(""), 5000);
  };

  /**
   * パーミッションを取得する関数（Androidのみ）
   */
  async function getPermission() {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          granted["android.permission.RECORD_AUDIO"] !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          showMessage("🚫 マイクの権限が拒否されました");
          return false;
        }
        return true;
      } catch (err) {
        console.warn(err);
        showMessage("⚠️ パーミッション取得中にエラーが発生しました");
        return false;
      }
    }
    return true;
  }

  // ユーザーインターフェースのレンダリング
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>📞 Agora Voice Calling Quickstart</Text>
      <View style={styles.btnContainer}>
        {!isJoined ? (
          <TouchableOpacity onPress={join} style={styles.button}>
            <Text style={styles.buttonText}>🔗 参加する</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={leave} style={styles.button}>
            <Text style={styles.buttonText}>❌ 退出する</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* ローカルユーザーのUID表示 */}
        {isJoined ? (
          <Text style={styles.uidText}>👤 ローカルユーザー UID: {uid}</Text>
        ) : (
          <Text style={styles.uidText}>
            🚀 「参加する」を押すと通話が開始されます。
          </Text>
        )}
        {/* リモートユーザーのUID表示 */}
        {isJoined && remoteUid !== 0 ? (
          <Text style={styles.remoteUidText}>
            👥 リモートユーザー UID: {remoteUid}
          </Text>
        ) : (
          isJoined && (
            <Text style={styles.waitingText}>
              ⏳ リモートユーザーの参加を待っています
            </Text>
          )
        )}
        {/* メッセージ表示 */}
        {message !== "" && <Text style={styles.messageText}>{message}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

// スタイルの定義
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: "#0055cc",
    margin: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  main: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  scroll: {
    flex: 1,
    backgroundColor: "#ddeeff",
    width: "100%",
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
  },
  scrollContainer: {
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  head: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
  },
  uidText: {
    fontSize: 16,
    marginVertical: 5,
  },
  remoteUidText: {
    fontSize: 14,
    color: "#333333",
  },
  waitingText: {
    fontSize: 14,
    color: "#777777",
    marginTop: 10,
  },
  messageText: {
    fontSize: 14,
    color: "#ff0000",
    marginTop: 10,
    textAlign: "center",
  },
});
