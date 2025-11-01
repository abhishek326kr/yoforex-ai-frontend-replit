import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { 
  ChevronLeft, 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Pin, 
  Lock, 
  Edit, 
  Trash2, 
  Share2,
  Calendar,
  User,
  TrendingUp,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import ForumComment from '@/components/forum/ForumComment';
import RichTextEditor from '@/components/forum/RichTextEditor';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';
import { TradingLayout } from '@/components/layout/TradingLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface ForumCommentProps {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
  likeCount: number;
  replies?: ForumCommentProps[];
  isAdmin?: boolean;
  isAuthor?: boolean;
  isLiked?: boolean;
  authorRole?: string;
  replyCount?: number;
  onReply?: (parentId: number, content: string) => void;
  onLike?: (commentId: number) => void;
  onEdit?: (commentId: number, content: string) => void;
  onDelete?: (commentId: number) => void;
}

const transformCommentToProps = (comment: Comment): ForumCommentProps => ({
  id: comment.id,
  content: comment.content,
  authorUsername: comment.author_username,
  createdAt: comment.created_at,
  likeCount: comment.like_count,
  replies: comment.replies?.map(transformCommentToProps),
});

const ForumPostDetail: React.FC = () => {
  const [, params] = useLocation();
  const postId = Number(params?.toString().split('/').pop());
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAuthor = post?.author_id === user?.id;
  const canModify = isAdmin || isAuthor;

  useEffect(() => {
    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        const [postResponse, commentsResponse, allPostsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/forum/posts/${postId}`),
          axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`),
          axios.get(`${API_BASE_URL}/forum/posts?limit=5`),
        ]);

        setPost(postResponse.data);
        setComments(commentsResponse.data);

        const related = allPostsResponse.data.posts?.filter((p: Post) => 
          p.id !== postId && 
          (p.category_id === postResponse.data.category_id || 
           p.author_id === postResponse.data.author_id)
        ).slice(0, 4) || [];
        
        setRelatedPosts(related);
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

  const handleSharePost = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Link Copied',
        description: 'Post link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

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
      await axios.post(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
        content: newComment,
      });

      const commentsResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}/comments`);
      setComments(commentsResponse.data);
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
        description: 'Failed to update post',
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
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!canModify) return;

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
      await axios.post(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
        content,
        parent_id: parentId,
      });

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

      const postResponse = await axios.get(`${API_BASE_URL}/forum/posts/${postId}`);
      setPost(postResponse.data);

      toast({
        title: 'Success',
        description: 'Post liked successfully',
      });
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
    return (
      <TradingLayout>
        <div className="container mx-auto py-6 px-4 max-w-7xl">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </TradingLayout>
    );
  }

  if (!post) {
    return (
      <TradingLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The post you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate('/forum')}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </TradingLayout>
    );
  }

  const postDate = new Date(post.created_at);
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true });

  return (
    <TradingLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/forum">Forum</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/forum/category/${post.category_id}`}>
              {post.category_name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>Post</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className={cn(post.is_pinned && "border-yellow-500/50")}>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant="outline" className="bg-primary/10">
                        {post.category_name}
                      </Badge>
                      {post.is_pinned && (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                      {post.is_locked && (
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {post.author_username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{post.author_username}</p>
                      {isAuthor && (
                        <Badge variant="secondary" className="text-xs">Author</Badge>
                      )}
                      {isAdmin && post.author_id === user?.id && (
                        <Badge variant="destructive" className="text-xs">Admin</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {timeAgo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.view_count} views
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div 
                  className="prose prose-invert max-w-none mb-6" 
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <Separator className="my-6" />

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => navigate('/forum')}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>

                  {isAuthenticated && !post.is_locked && (
                    <Button variant="outline" onClick={handleLikePost}>
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Like ({post.like_count})
                    </Button>
                  )}

                  <Button variant="outline" onClick={handleSharePost}>
                    {copied ? <Check className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Share'}
                  </Button>

                  {canModify && (
                    <Button variant="outline" onClick={() => navigate(`/forum/edit-post/${post.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  )}

                  {canModify && (
                    <>
                      <Button 
                        variant="outline" 
                        className="text-red-500 hover:text-red-600" 
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>

                      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this post? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600"
                              onClick={handleDeletePost}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => handlePinPost(post.id, !post.is_pinned)}
                      >
                        <Pin className="mr-2 h-4 w-4" />
                        {post.is_pinned ? 'Unpin' : 'Pin'}
                      </Button>

                      <Button 
                        variant="outline" 
                        onClick={() => handleLockPost(post.id, !post.is_locked)}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {post.is_locked ? 'Unlock' : 'Lock'}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!post.is_locked && isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Add a comment</p>
                    <RichTextEditor
                      content={newComment}
                      onChange={setNewComment}
                      placeholder="Share your thoughts..."
                      minHeight="150px"
                    />
                    <Button 
                      onClick={handleSubmitComment} 
                      disabled={isSubmitting || !newComment.trim()}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                ) : !isAuthenticated ? (
                  <Card className="bg-muted/30 border-dashed">
                    <CardContent className="pt-6 text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Sign in to join the discussion
                      </p>
                      <Button onClick={() => setLocation('/auth')}>
                        Sign In
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-yellow-500/5 border-yellow-500/20">
                    <CardContent className="pt-6 flex items-center gap-3">
                      <Lock className="h-5 w-5 text-yellow-500" />
                      <p className="text-sm text-muted-foreground">
                        This thread is locked. No new comments can be posted.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {comments.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    <Separator />
                    {comments.map((comment) => (
                      <ForumComment
                        key={comment.id}
                        {...transformCommentToProps(comment)}
                        isAdmin={isAdmin}
                        isAuthor={comment.author_id === user?.id}
                        onReply={!post.is_locked ? handleReply : undefined}
                        onLike={isAuthenticated ? handleLikeComment : undefined}
                        onEdit={(comment.author_id === user?.id || isAdmin) && !post.is_locked ? handleEditComment : undefined}
                        onDelete={(comment.author_id === user?.id || isAdmin) ? handleDeleteComment : undefined}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {relatedPosts.length > 0 && (
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Related Posts
                  </CardTitle>
                  <CardDescription>
                    Similar discussions you might find interesting
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {relatedPosts.map((relatedPost) => (
                    <Card 
                      key={relatedPost.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => setLocation(`/forum/post/${relatedPost.id}`)}
                    >
                      <CardContent className="p-4">
                        <p className="font-medium line-clamp-2 mb-2">
                          {relatedPost.title}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {relatedPost.author_username}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {relatedPost.comment_count}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Post Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Views
                  </span>
                  <span className="font-semibold">{post.view_count}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    Likes
                  </span>
                  <span className="font-semibold">{post.like_count}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Comments
                  </span>
                  <span className="font-semibold">{comments.length}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Posted
                  </span>
                  <span className="text-sm">{timeAgo}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TradingLayout>
  );
};

export default ForumPostDetail;
