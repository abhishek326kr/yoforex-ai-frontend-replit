import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { ThumbsUp, Reply, MoreHorizontal, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

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

const ForumComment: React.FC<ForumCommentProps> = ({
  id,
  content,
  authorUsername,
  createdAt,
  likeCount,
  replies = [],
  isAdmin = false,
  isAuthor = false,
  isLiked = false,
  authorRole = 'user',
  replyCount = 0,
  onReply,
  onLike,
  onEdit,
  onDelete
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState(content);
  
  const date = new Date(createdAt);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  
  const handleReplySubmit = () => {
    if (replyContent.trim() && onReply) {
      onReply(id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };
  
  const handleEditSubmit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(id, editContent);
      setIsEditing(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <div className="mb-4">
      <Card className={cn("transition-all duration-200", isEditing && "border-primary/50")}>
        <CardHeader className="pb-2 pt-4 flex flex-row items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials(authorUsername)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-semibold hover:text-primary transition-colors cursor-pointer">
                  {authorUsername}
                </span>
                {authorRole !== 'user' && (
                  <Badge variant={authorRole === 'admin' ? 'destructive' : 'outline'} className="text-xs">
                    {authorRole}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
              {(isAdmin || isAuthor) && (onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-500">Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                  Delete Comment
                                </div>
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                comment and remove it from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => {
                                  setShowDeleteDialog(false);
                                  onDelete(id);
                                }}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <Textarea 
                value={editContent} 
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="resize-none"
                placeholder="Edit your comment..."
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(content);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleEditSubmit}
                  disabled={!editContent.trim() || editContent === content}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-2 flex justify-between">
          <div className="flex items-center gap-4">
            {onLike && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "flex items-center gap-1",
                        isLiked ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                      onClick={() => onLike(id)}
                    >
                      <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
                      {likeCount > 0 && <span className="text-sm">{likeCount}</span>}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? 'Remove like' : 'Like this comment'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {onReply && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "flex items-center gap-1",
                        isReplying ? "text-primary" : "text-muted-foreground hover:text-primary"
                      )}
                      onClick={() => setIsReplying(!isReplying)}
                    >
                      <Reply className="h-4 w-4" />
                      <span className="text-sm">
                        {isReplying ? 'Cancel' : replyCount > 0 ? `${replyCount} Replies` : 'Reply'}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isReplying ? 'Cancel reply' : 'Reply to this comment'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {isReplying && (
        <div className="mt-2 ml-12">
          <Card className="border-primary/30">
            <CardContent className="pt-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getInitials(authorUsername)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea 
                    placeholder={`Reply to ${authorUsername}...`}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleReplySubmit}
                      disabled={!replyContent.trim()}
                    >
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {replies.length > 0 && (
        <div className="ml-12 mt-2 space-y-2">
          {replies.map(reply => (
            <ForumComment
              key={reply.id}
              {...reply}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ForumComment;