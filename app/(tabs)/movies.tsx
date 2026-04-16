import { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { useFavourites } from "../../contexts/FavouritesContext";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Movie, getTrendingMovies, fallbackMovies } from "../../data/movies";
import { searchMovies as searchTMDBMovies } from "../../data/tmdb";

function searchLocalMovies(query: string, movies: Movie[]): Movie[] {
  const lowerQuery = query.toLowerCase().trim();
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.director.toLowerCase().includes(lowerQuery) ||
    movie.genre.some((g) => g.toLowerCase().includes(lowerQuery))
  );
}

export default function MovieListScreen() {
  const { colors } = useTheme();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      setInitialLoading(true);
      const trending = await getTrendingMovies();
      const movies = trending.length > 0 ? trending : fallbackMovies;
      setAllMovies(movies);
      setResults(movies);
      setInitialLoading(false);
      setLoading(false);
    };
    loadTrending();
  }, []);

  const handleSearch = useCallback(async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults(allMovies);
      return;
    }
    setLoading(true);
    
    try {
      const tmdbResults = await searchTMDBMovies(text);
      if (tmdbResults.length > 0) {
        setResults(tmdbResults);
      } else {
        const localResults = searchLocalMovies(text, allMovies);
        setResults(localResults);
      }
    } catch {
      const localResults = searchLocalMovies(text, allMovies);
      setResults(localResults);
    }
    setLoading(false);
  }, [allMovies]);

  const handleFavourite = (item: Movie) => {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "Please sign in to add favourites", [
        { text: "Cancel", style: "cancel" },
        { text: "Sign In", onPress: () => router.push("/(tabs)/login") },
      ]);
      return;
    }
    toggleFavourite(item);
  };

  const goToDetail = (item: Movie) => {
    const id = item.imdbID || item.id.toString();
    router.push({
      pathname: `/movie/${id}`,
      params: { movie: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={() => goToDetail(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.year, { color: colors.textSecondary }]}>{item.year}</Text>
        {item.rating > 0 && (
          <View style={styles.row}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>
              {item.rating.toFixed(1)}
            </Text>
          </View>
        )}
        <View style={styles.genreRow}>
          {item.genre.slice(0, 2).map((g: string) => (
            <View key={g} style={[styles.genreBadge, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.genreText, { color: colors.primary }]}>{g}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={() => handleFavourite(item)}
      >
        <Ionicons
          name={isFavourite(item.id, item.imdbID) ? "heart" : "heart-outline"}
          size={24}
          color={isFavourite(item.id, item.imdbID) ? "#EF4444" : colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (initialLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search movies..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
        </View>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search movies..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : results.length === 0 ? (
        <View style={styles.loader}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No movies found
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, height: 46 },
  list: { padding: 16, paddingBottom: 24 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
  emptyText: { fontSize: 14, marginTop: 8 },
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
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  rating: { fontSize: 13, marginLeft: 4 },
  genreRow: { flexDirection: "row", gap: 6 },
  genreBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  genreText: { fontSize: 11, fontWeight: "600" },
  heartBtn: { padding: 12, justifyContent: "center" },
});
