import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { ThumbsUp, Reply, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Textarea } from '../ui/textarea';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

interface ForumCommentProps {
  id: number;
  content: string;
  authorUsername: string;
  createdAt: string;
  likeCount: number;
  replies?: ForumCommentProps[];
  isAdmin?: boolean;
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

  return (
    <div className="mb-4">
      <Card>
        <CardHeader className="pb-2 pt-4 flex flex-row items-start gap-4">
          <Avatar>
            <AvatarFallback>{getInitials(authorUsername)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">{authorUsername}</span>
                <span className="text-xs text-muted-foreground ml-2">{timeAgo}</span>
              </div>
              {(isAdmin || onEdit || onDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onEdit && (
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem 
                        className="text-red-500"
                        onClick={() => onDelete(id)}
                      >
                        Delete
                      </DropdownMenuItem>
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
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleEditSubmit}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </CardContent>
        <CardFooter className="pt-0 pb-2 flex justify-between">
          <div className="flex items-center gap-4">
            {onLike && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-muted-foreground"
                onClick={() => onLike(id)}
              >
                <ThumbsUp size={16} />
                {likeCount > 0 && <span>{likeCount}</span>}
              </Button>
            )}
            {onReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-muted-foreground"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply size={16} />
                Reply
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {isReplying && (
        <div className="mt-2 ml-12">
          <Textarea 
            placeholder="Write your reply..." 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsReplying(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleReplySubmit}>
              Post Reply
            </Button>
          </div>
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