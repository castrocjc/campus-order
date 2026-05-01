import { StyleSheet, Text, View } from "react-native";

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>COFIGO</Text>
      <Text style={styles.subtitle}>Explorar funcionalidades</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#3b1f12",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#f57c00",
    fontWeight: "700",
  },
});