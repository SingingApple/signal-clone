import React, { useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
const AddChatScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);
  const [input, setInput] = useState("");

  const createChat = async () => {
    try {
      await db.collection("chats").add({
        chatName: input,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={(val) => setInput(val)}
        onSubmitEditing={() => createChat()}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="#333" />
        }
      />
      <Button title="Add Chat" onPress={() => createChat()} />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({});
