import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Accordion from '@atom-design-mog/accordions';
import AButton from '@atom-design-mog/buttons';
import { setCurrentPost, setComments } from '../redux/postsSlice';
import { fetchPostById, fetchCommentsByPostId, fetchPhotosByAlbumId } from '../utils/api';

const { width } = Dimensions.get('window');

const PostDetailScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const dispatch = useDispatch();
  const { currentPost, comments } = useSelector((state) => state.posts);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredPhoto, setFeaturedPhoto] = useState(null);

  useEffect(() => {
    loadPostDetails();
  }, [postId]);

  const loadPostDetails = async () => {
    setLoading(true);
    setError(null);

    // Fetch post
    const postResult = await fetchPostById(postId);
    if (!postResult.success) {
      setError(postResult.error);
      setLoading(false);
      return;
    }

    // Fetch comments
    const commentsResult = await fetchCommentsByPostId(postId);
    if (!commentsResult.success) {
      setError(commentsResult.error);
      setLoading(false);
      return;
    }

    // Set featured photo using Picsum Photos API (seed based on postId for consistency)
    setFeaturedPhoto({
      id: postId,
      url: `https://picsum.photos/seed/${postId}/800/600`,
      thumbnailUrl: `https://picsum.photos/seed/${postId}/400/300`,
    });

    dispatch(setCurrentPost(postResult.data));
    dispatch(setComments(commentsResult.data));
    setLoading(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AButton
            title="Back"
            onPress={() => navigation.goBack()}
            color="#d9232d"
            size="medium"
            variant="text"
          />
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d9232d" />
          <Text style={styles.loadingText}>Loading post...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <AButton
            title="Back"
            onPress={() => navigation.goBack()}
            color="#d9232d"
            size="medium"
            variant="text"
          />
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <AButton
            title="Retry"
            onPress={loadPostDetails}
            color="#d9232d"
            size="medium"
            variant="solid"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <AButton
          title="Back"
          onPress={() => navigation.goBack()}
          color="#d9232d"
          size="medium"
          variant="text"
        />
        <Text style={styles.headerTitle}>Post Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Content */}
        {currentPost && (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.postAvatar}>
                <Text style={styles.postAvatarText}>
                  {currentPost.userId.toString()}
                </Text>
              </View>
              <View style={styles.postHeaderText}>
                <Text style={styles.postUserId}>User - {currentPost.userId}</Text>
                <Text style={styles.postId}>Post #{currentPost.id}</Text>
              </View>
            </View>

            <Text style={styles.postTitle}>{currentPost.title}</Text>
            
            {/* Featured Photo */}
            {featuredPhoto && (
              <View style={styles.photoSection}>
                <Image
                  source={{ uri: featuredPhoto.url }}
                  style={styles.featuredPhoto}
                  resizeMode="cover"
                />
              </View>
            )}
            
            <Text style={styles.postBody}>{currentPost.body}</Text>
          </View>
        )}

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsTitleContainer}>
            <Text style={styles.commentsTitle}>Comments</Text>
            <Text style={styles.commentsCount}>
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </Text>
          </View>

          {comments.length > 0 ? (
            <View style={styles.accordionContainer}>
              <Accordion
                items={comments.map((comment) => ({
                  title: comment.name,
                  content: `Email - ${comment.email}\n\n${comment.body}`,
                }))}
                allowMultiple={true}
              />
            </View>
          ) : (
            <View style={styles.noComments}>
              <Text style={styles.noCommentsText}>No comments yet</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#d9232d',
    marginBottom: 16,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  postHeaderText: {
    flex: 1,
  },
  postUserId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  photoSection: {
    marginVertical: 16,
  },
  featuredPhoto: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  commentsSection: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  commentsTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  commentsCount: {
    fontSize: 14,
    color: '#666',
  },
  accordionContainer: {
    marginBottom: 16,
  },
  noComments: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  noCommentsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default PostDetailScreen;
