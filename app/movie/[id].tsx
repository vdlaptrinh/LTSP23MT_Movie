import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useFavourites } from "../../contexts/FavouritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Movie } from "../../data/movies";
import { getTMDBMovieDetail, getMovieDetail } from "../../data/tmdb";

export default function MovieDetailScreen() {
  const { id, movie: movieParam } = useLocalSearchParams<{ id: string; movie?: string }>();
  const { colors } = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (movieParam) {
        try {
          const passedMovie = JSON.parse(movieParam) as Movie;
          setMovie(passedMovie);
          setLoading(false);
          return;
        } catch {
          // continue to fetch from API
        }
      }

      const idStr = id || "";
      const isImdb = idStr.startsWith("tt");

      if (isImdb) {
        try {
          const apiMovie = await getMovieDetail(idStr);
          setMovie(apiMovie);
        } catch {
          setMovie(null);
        }
      } else {
        const numericId = parseInt(idStr, 10);
        if (!isNaN(numericId)) {
          try {
            const apiMovie = await getTMDBMovieDetail(numericId);
            setMovie(apiMovie);
          } catch {
            setMovie(null);
          }
        } else {
          setMovie(null);
        }
      }
      setLoading(false);
    })();
  }, [id, movieParam]);

  const handleFavourite = (m: Movie) => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "Please sign in to add favourites", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/(tabs)/login") },
      ]);
      return;
    }
    if (m) toggleFavourite(m);
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Movie not found</Text>
      </View>
    );
  }

  const fav = isFavourite(movie.id, movie.imdbID);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleFavourite(movie)} style={styles.backBtn}>
          <Ionicons name={fav ? "heart" : "heart-outline"} size={24} color={fav ? "#EF4444" : colors.text} />
        </TouchableOpacity>
      </View>

      <Image source={{ uri: movie.poster }} style={styles.hero} />

      <View style={[styles.body, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>{movie.title}</Text>

        <View style={styles.metaRow}>
          {movie.rating > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{movie.rating.toFixed(1)}</Text>
            </View>
          )}
          {movie.year > 0 && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{movie.year}</Text>
            </View>
          )}
          {movie.duration && movie.duration !== "N/A" && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{movie.duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.genreRow}>
          {movie.genre.map((g) => (
            <View key={g} style={[styles.genreBadge, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.genreText, { color: colors.primary }]}>{g}</Text>
            </View>
          ))}
        </View>

        {movie.overview ? (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Overview</Text>
            <Text style={[styles.overview, { color: colors.textSecondary }]}>{movie.overview}</Text>
          </View>
        ) : null}

        {movie.director ? (
          <View style={[styles.section, { borderTopColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Director</Text>
            <Text style={[styles.overview, { color: colors.textSecondary }]}>{movie.director}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  hero: { width: "100%", height: 300, resizeMode: "cover" },
  body: {
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  metaRow: { flexDirection: "row", gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 14 },
  genreRow: { flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  genreBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  genreText: { fontSize: 12, fontWeight: "600" },
  section: { borderTopWidth: 1, paddingTop: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  overview: { fontSize: 15, lineHeight: 22 },
});