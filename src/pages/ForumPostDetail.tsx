import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronLeft, MessageSquare, ThumbsUp, Eye, Pin, Lock, Edit, Trash2 } from 'lucide-react';
import ForumComment from '@/components/forum/ForumComment';
import ForumPost from '@/components/forum/ForumPost';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';
import { TradingLayout } from '@/components/layout/TradingLayout';

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_username: string;
  category_id: number;
  category_name: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  like_count: number;
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
}

interface Comment {
  id: number;
  content: string;
  author_id: number;
  author_username: string;
  post_id: number;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
  like_count: number;
  replies: Comment[];
}

const ForumPostDetail: React.FC = () => {
  const [, params] = useLocation();
  const postId = Number(params?.toString().split('/').pop());  // Ensure postId is a number
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAuthor = post?.author_id === user?.id;
  const canModify = isAdmin || isAuthor;

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch post details
        const postResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}`);
        setPost(postResponse.data);

        // Fetch comments
        const commentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching post details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load post details',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostDetails();
    }
  }, [postId, toast]);

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to post comments',
        variant: 'destructive',
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: 'Empty Comment',
        description: 'Comment cannot be empty',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
        content: newComment,
      });

      // Add the new comment to the list
      const newCommentData = response.data;
      setComments([...comments, newCommentData]);
      setNewComment('');

      toast({
        title: 'Comment Posted',
        description: 'Your comment has been posted successfully',
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin moderation functions
  const handlePinPost = async (postId: number, isPinned: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/forum/posts/${postId}`, {
        is_pinned: isPinned,
      });

      if (post) {
        setPost({ ...post, is_pinned: isPinned });
      }
      toast({
        title: 'Success',
        description: isPinned ? 'Post pinned successfully' : 'Post unpinned successfully',
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleLockPost = async (postId: number, isLocked: boolean) => {
    try {
      await axios.patch(`${API_BASE_URL}/forum/posts/${postId}`, {
        is_locked: isLocked,
      });

      if (post) {
        setPost({ ...post, is_locked: isLocked });
      }
      toast({
        title: 'Success',
        description: isLocked ? 'Post locked successfully' : 'Post unlocked successfully',
      });
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update post. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!canModify) return;

    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/forum/posts/${postId}`);

      toast({
        title: 'Post Deleted',
        description: 'The post has been deleted successfully',
      });

      setLocation('/forum');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const handleReply = async (parentId: number, content: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to reply to comments',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
        content,
        parent_id: parentId,
      });

      // Update comments with the new reply
      const fetchCommentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
      setComments(fetchCommentsResponse.data);

      toast({
        title: 'Reply Posted',
        description: 'Your reply has been posted successfully',
      });
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to post reply',
        variant: 'destructive',
      });
    }
  };

  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like comments',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/forum/comments/${commentId}/like`);

      // Update comments to reflect the new like
      const fetchCommentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
      setComments(fetchCommentsResponse.data);
    } catch (error) {
      console.error('Error liking comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to like comment',
        variant: 'destructive',
      });
    }
  };

  const handleLikePost = async () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to like posts',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/forum/posts/${postId}/like`);

      // Update post to reflect the new like
      const postResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}`);
      setPost(postResponse.data);
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: 'Error',
        description: 'Failed to like post',
        variant: 'destructive',
      });
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      await axios.put(`${API_BASE_URL}/forum/comments/${commentId}`, { content });

      // Update comments to reflect the edit
      const fetchCommentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
      setComments(fetchCommentsResponse.data);

      toast({
        title: 'Comment Updated',
        description: 'Your comment has been updated successfully',
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update comment',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/forum/comments/${commentId}`);

      // Update comments to reflect the deletion
      const fetchCommentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
      setComments(fetchCommentsResponse.data);

      toast({
        title: 'Comment Deleted',
        description: 'The comment has been deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <Button onClick={() => navigate('/forum')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>
      </div>
    );
  }

  return (
    <TradingLayout>
    <div className="container mx-auto py-8 px-4">
      <Breadcrumb className="mb-6">
        <BreadcrumbItem>
          <BreadcrumbLink href="/forum">Forum</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href={`/forum/category/${post.category_id}`}>{post.category_name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Post</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="mb-6">
        <ForumPost
          id={post.id}
          title={post.title}
          content={post.content}
          authorUsername={post.author_username}
          categoryName={post.category_name}
          createdAt={post.created_at}
          commentCount={post.comment_count}
          likeCount={post.like_count}
          viewCount={post.view_count}
          isPinned={post.is_pinned}
          isLocked={post.is_locked}
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="outline" onClick={() => navigate('/forum')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Forum
        </Button>

        {isAuthenticated && !post.is_locked && (
          <Button variant="outline" onClick={handleLikePost}>
            <ThumbsUp className="mr-2 h-4 w-4" />
            Like
          </Button>
        )}

        {canModify && (
          <Button variant="outline" onClick={() => navigate(`/forum/edit-post/${post.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}

        {canModify && (
          <Button variant="outline" className="text-red-500" onClick={handleDeletePost}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        )}

        {isAdmin && (
          <>
            <Button variant="outline" onClick={() => handlePinPost(post.id, !post.is_pinned)}>
              <Pin className="mr-2 h-4 w-4" />
              {post.is_pinned ? 'Unpin' : 'Pin'}
            </Button>

            <Button variant="outline" onClick={() => handleLockPost(post.id, !post.is_locked)}>
              <Lock className="mr-2 h-4 w-4" />
              {post.is_locked ? 'Unlock' : 'Lock'}
            </Button>
          </>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5" />
        Comments ({comments.length})
      </h2>

      {!post.is_locked && isAuthenticated && (
        <div className="mb-6">
          <Textarea
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={4}
            className="mb-2"
          />
          <Button 
            onClick={handleSubmitComment} 
            disabled={isSubmitting || !newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      )}

      {post.is_locked && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <Lock className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This thread is locked. No new comments can be posted.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <ForumComment
              key={comment.id}
              id={comment.id}
              content={comment.content}
              authorUsername={comment.author_username}
              createdAt={comment.created_at}
              likeCount={comment.like_count}
              replies={comment.replies.map((reply) => ({
                id: reply.id,
                content: reply.content,
                authorUsername: reply.author_username,
                createdAt: reply.created_at,
                likeCount: reply.like_count,
              }))}
              isAdmin={isAdmin}
              onReply={!post.is_locked ? handleReply : undefined}
              onLike={isAuthenticated ? handleLikeComment : undefined}
              onEdit={(comment.author_id === user?.id || isAdmin) && !post.is_locked ? handleEditComment : undefined}
              onDelete={(comment.author_id === user?.id || isAdmin) ? handleDeleteComment : undefined}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
    </TradingLayout>
  );
};

export default ForumPostDetail;
