// Import React Hooks
import React, { useRef, useState, useEffect, useCallback} from 'react';
// Import user interface elements
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// Import components related to obtaining Android device permissions
import { PermissionsAndroid, Platform } from 'react-native';
// Import Agora SDK
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcConnection,
  IRtcEngineEventHandler,
} from 'react-native-agora';


// Define basic information
const appId = '12d6ce5a43d740298dc00619516bb4b2';
// const token = '007eJxTYHiifWTdUYsrGfvfuTzjnXd50Z4F0+2Uz79Z37RH0ohzQ9sUBQZDoxSz5FTTRBPjFHMTAyNLi5RkAwMzQ0tTQ7OkJJMko8/TKtIbAhkZ2JY1MDEyQCCIz8pQUlyaXsrAAAAoSyHa';
const channelName = 'tsugu';
const uid = 0; // Local user Uid, no need to modify

export default function Agora ()  {
  const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
  const [token, setToken] = useState<string>(''); // RTC Token
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [isHost, setIsHost] = useState(true); // User role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const [message, setMessage] = useState(''); // User prompt message
  const eventHandler = useRef<IRtcEngineEventHandler>(); // Callback functions

  useEffect(() => {
    // Initialize the engine when the App starts
    setupVideoSDKEngine();
    // Release memory when the App is closed
    return () => {
      agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
      agoraEngineRef.current?.release();
    };
  }, []);

  // Define the setupVideoSDKEngine method called when the App starts
  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      eventHandler.current = {
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined channel: ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' joined');
          setRemoteUid(uid);
        },
        onUserOffline: (_connection: RtcConnection, uid: number) => {
          showMessage('Remote user ' + uid + ' left the channel');
          setRemoteUid(0);
        },
      };

      // Register the event handler
      agoraEngine.registerEventHandler(eventHandler.current);
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Send a request to obtain a token to the token server
  const fetchToken = useCallback(() => {
    // Token server URL example: http://12.123.1.123:8082/fetch_rtc_token
    // const url = 'https://jyutaigogo-4a13b4c42afd.herokuapp.com/api/tokens';
    const url = 'http://172.20.10.3:8765/api/tokens'
    const body = JSON.stringify({
      uid,
      channelName: channelName,
      role: isHost
        ? ClientRoleType.ClientRoleBroadcaster
        : ClientRoleType.ClientRoleAudience,
    });
    console.log('fetchToken', url, body);
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => {
        // showMessage('token ' + res.token + 'Already refreshed');
        if (+res.code === 200) {
          setToken(res.token);
        }
        return res;
      });
  }, [isHost]);

  // Define the join method called after clicking the join channel button
  const join = useCallback(async () => {
    if (!token) {
      console.log("token1 : ", token);
      await fetchToken();
    } else {
      try {
        console.log("token2 : ", token);
        if (isHost) {
          // Join the channel as a broadcaster
          agoraEngineRef.current?.joinChannel(token, channelName, uid, {
            // Set channel profile to live broadcast
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
            // Set user role to broadcaster
            clientRoleType: ClientRoleType.ClientRoleBroadcaster,
            // Publish audio collected by the microphone
            publishMicrophoneTrack: true,
            // Automatically subscribe to all audio streams
            autoSubscribeAudio: true,
          });
        } else {
          // Join the channel as an audience
          agoraEngineRef.current?.joinChannel(token, channelName, uid, {
            // Set channel profile to live broadcast
            channelProfile: ChannelProfileType.ChannelProfileCommunication,
            // Set user role to audience
            clientRoleType: ClientRoleType.ClientRoleAudience,
            // Do not publish audio collected by the microphone
            publishMicrophoneTrack: false,
            // Automatically subscribe to all audio streams
            autoSubscribeAudio: true,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  },[fetchToken, isHost, token]);

  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('Left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  // Render user interface
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Agora Voice Calling Quickstart</Text>
      <View style={styles.btnContainer}>
        <Text onPress={join} style={styles.button}>
          Join Channel
        </Text>
        <Text onPress={leave} style={styles.button}>
          Leave Channel
        </Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined ? (
          <Text>Local user uid: {uid}</Text>
        ) : (
          <Text>Join a channel</Text>
        )}
        {isJoined && remoteUid !== 0 ? (
          <Text>Remote user uid: {remoteUid}</Text>
        ) : (
          <Text>Waiting for remote user to join</Text>
        )}
        <Text>{message}</Text>
      </ScrollView>
    </SafeAreaView>
  );

  // Display information
  function showMessage(msg: string) {
    setMessage(msg);
  }
};

// Define user interface styles
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: { flex: 1, alignItems: 'center' },
  scroll: { flex: 1, backgroundColor: '#ddeeff', width: '100%' },
  scrollContainer: { alignItems: 'center' },
  videoView: { width: '90%', height: 200 },
  btnContainer: { flexDirection: 'row', justifyContent: 'center' },
  head: { fontSize: 20 },
});

const getPermission = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
  }
};
