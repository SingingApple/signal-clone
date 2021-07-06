import { useNavigation } from "@react-navigation/native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { StyleSheet, View, SafeAreaView, FlatList } from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from "../components/CustomListItem";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);
  {
    console.log(chats);
  }
  const navigation = useNavigation();
  const signOut = async () => {
    await auth.signOut();
    navigation.replace("Login");
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Smratry Club",
      headerStyle: { backgroundColor: "#333" },
      headerTintColor: "white",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity onPress={() => signOut()}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            marginRight: 20,
            width: 80,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity>
            <AntDesign name="camerao" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
    setLoading(false);
  }, [navigation]);
  console.log("CHATS", chats);
  if (loading) {
    return <ActivityIndicator size="large" color="green" />;
  }

  const enterChat = (id, chatName) => {
    navigation.navigate("UserChat", {
      id: id,
      chatName: chatName,
    });
  };

  return (
    <SafeAreaView>
      <FlatList
        data={chats}
        style={styles.container}
        key={({ item }) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <CustomListItem
              id={item.id}
              enterChat={enterChat}
              chatName={item.data.chatName}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
