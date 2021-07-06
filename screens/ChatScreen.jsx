import React, { useLayoutEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
} from "react-native";
import firebase from "firebase";
import { db, auth } from "../firebase";
import { Avatar } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Keyboard } from "react-native";
const ChatScreen = () => {
  const route = useRoute();
  console.log(route.params.id);
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .onSnapshot((snapShot) =>
        setMessages(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);
  console.log(messages);
  const sendMessage = () => {
    Keyboard.dismiss;
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.chatName,
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            source={{
              uri:
                messages[0]?.data.photoURL ||
                "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            width: 80,
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={110}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map((message) =>
                message.data.email === auth.currentUser.email ? (
                  <View key={message.data.id} style={styles.receiver}>
                    <Avatar
                      position="absolute"
                      rounded
                      bottom={-15}
                      right={-3}
                      size={30}
                      source={{ uri: message.data.photoURL }}
                    />
                    <Text style={styles.receiverText}>
                      {message.data.message}
                    </Text>
                  </View>
                ) : (
                  <View key={message.data.id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      rounded
                      bottom={-15}
                      right={-3}
                      size={30}
                      source={{ uri: message.data.photoURL }}
                    />
                    <Text style={styles.senderText}>
                      {message.data.displayName}
                    </Text>
                    <Text style={styles.senderText}>
                      {message.data.message}
                    </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                onSumbitEditing={sendMessage}
                value={input}
                placeholder="Type your message"
                style={styles.textInput}
                onChangeText={(text) => setInput(text)}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" color="#2B68E6" size={24} />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  receiver: {
    top: 0,
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },
  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    width: "100%",
  },
  textInput: {
    bottom: 0,
    left: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#EDEDED",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
});
