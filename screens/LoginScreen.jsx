import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { auth } from "../firebase";
import { Alert } from "react-native";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const signIn = async () => {
    try {
      let user = await auth.signInWithEmailAndPassword(email, password);
      console.log(user);
      if (user) {
        navigation.replace("Home");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Invalid Credentials");
    }
  };
  return (
    <KeyboardAvoidingView behavior="margin" style={styles.container}>
      <StatusBar style="dark" />
      <Image
        source={{
          uri: "https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png",
        }}
        style={styles.headerImage}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Email"
          autofocus
          type="email"
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <Input
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={(val) => setPassword(val)}
          autofocus
          onSubmitEditing={signIn}
          type="password"
        />
      </View>
      <Button
        containerStyle={styles.button}
        onPress={() => signIn()}
        title="Login"
      />
      <Button
        containerStyle={styles.button}
        title="Register"
        onPress={() => navigation.navigate("Register")}
        type="outline"
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  headerImage: {
    width: 200,
    height: 200,
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});
