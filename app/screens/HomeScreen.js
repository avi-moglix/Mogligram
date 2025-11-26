import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AButton from '@atom-design-mog/buttons';
import { logout } from '../redux/authSlice';
import { clearProfile } from '../redux/userSlice';
import { setPosts, setLoading, setError } from '../redux/postsSlice';
import { clearAllData } from '../utils/storage';
import { getInitials } from '../utils/validation';
import { fetchPosts } from '../utils/api';
import { SkeletonCard } from '../components/common/SkeletonLoader';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading, error } = useSelector((state) => state.posts);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    dispatch(setLoading(true));
    const result = await fetchPosts();
    
    if (result.success) {
      dispatch(setPosts(result.data));
    } else {
      dispatch(setError(result.error));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await clearAllData();
    dispatch(logout());
    dispatch(clearProfile());
  };

  const handlePostPress = (post) => {
    navigation.navigate('PostDetail', { postId: post.id });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(user?.identifier || '')}
          </Text>
        </View>
        <Text style={styles.userText} numberOfLines={1}>
          {user?.identifier || 'User'}
        </Text>
      </View>
      <AButton
        title="Logout"
        onPress={handleLogout}
        color="#d9232d"
        size="small"
        variant="outlined"
      />
    </View>
  );

  const renderPostCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePostPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.postAvatar}>
          <Text style={styles.postAvatarText}>
            {item.userId.toString()}
          </Text>
        </View>
        <View style={styles.cardHeaderText}>
          <Text style={styles.cardUserId}>User - {item.userId}</Text>
          <Text style={styles.cardPostId}>Post #{item.id}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardBody} numberOfLines={3}>
        {item.body}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.readMore}>Read More →</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No posts available</Text>
      <AButton
        title="Retry"
        onPress={loadPosts}
        color="#d9232d"
        size="medium"
        variant="solid"
      />
    </View>
  );

  const renderError = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>{error}</Text>
      <AButton
        title="Retry"
        onPress={loadPosts}
        color="#d9232d"
        size="medium"
        variant="solid"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <View style={styles.titleContainer}>
        {/* <Text style={styles.title}>Latest Posts</Text> */}
        <Text style={styles.subtitle}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'} available
        </Text>
      </View>

      {loading && !refreshing ? (
        <ScrollView contentContainerStyle={styles.listContent}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </ScrollView>
      ) : error ? (
        renderError()
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#d9232d']}
              tintColor="#d9232d"
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 35,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#d9232d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  postAvatarText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardUserId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cardPostId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  cardBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  readMore: {
    fontSize: 14,
    color: '#d9232d',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#d9232d',
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default HomeScreen;
