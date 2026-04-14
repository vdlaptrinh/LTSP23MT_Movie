import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useFavourites } from "../../contexts/FavouritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function FavouritesScreen() {
  const { colors } = useTheme();
  const { favourites, toggleFavourite } = useFavourites();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="lock-closed-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Login Required</Text>
        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
          Sign in to view your favourite movies
        </Text>
        <TouchableOpacity
          style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/login")}
        >
          <Text style={styles.browseText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (favourites.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Ionicons name="heart-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>No Favourites Yet</Text>
        <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
          Tap the heart icon on any movie to add it here
        </Text>
        <TouchableOpacity
          style={[styles.browseBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/movies")}
        >
          <Text style={styles.browseText}>Browse Movies</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: (typeof favourites)[0] }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => router.push(`/movie/${item.imdbID || item.id}`)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.year, { color: colors.textSecondary }]}>{item.year}</Text>
        <View style={styles.row}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFavourite(item)}>
        <Ionicons name="heart" size={24} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favourites}
        keyExtractor={(item) => (item.imdbID || item.id).toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  emptySub: { fontSize: 14, textAlign: "center", marginTop: 8, marginBottom: 24 },
  browseBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  browseText: { color: "#FFF", fontWeight: "600", fontSize: 15 },
  list: { padding: 16, paddingBottom: 24 },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  poster: { width: 100, height: 150, resizeMode: "cover" },
  info: { flex: 1, padding: 12, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  year: { fontSize: 13, marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center" },
  rating: { fontSize: 13, marginLeft: 4 },
  heartBtn: { padding: 12, justifyContent: "center" },
});