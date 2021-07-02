import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text } from "react-native-elements";
import { auth } from "../firebase";
const RegisterScreen = ({}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const navigation = useNavigation();
  const register = async () => {
    try {
      let authUser = await auth.createUserWithEmailAndPassword(email, password);
      console.log(authUser);
      authUser.user.updateProfile({
        displayName: name,
        photoURL:
          imageUrl ||
          "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png",
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "back",
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Create a Signal Account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autofocus
          type="text"
          value={name}
          onChangeText={(val) => setName(val)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(val) => setPassword(val)}
        />
        <Input
          placeholder="Image"
          type="file"
          value={imageUrl}
          onChangeText={(val) => setImageUrl(val)}
          onSubmitEditing={register}
        />
      </View>
      <Button
        containerStyle={styles.buttons}
        raise
        title="Register"
        onPress={() => register()}
      />
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  buttons: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
});
