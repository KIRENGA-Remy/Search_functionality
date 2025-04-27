import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function NotFound(){
  return(
    <View style={styles.container}>
      <Text>Page Not Found</Text>
      <Link href={"/"} style={styles.link}>Go to Home </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center'},
  link: {color: 'blue', marginTop: 16}
})