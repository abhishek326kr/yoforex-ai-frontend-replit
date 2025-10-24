import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageSquare, ThumbsUp, Eye, Pin, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ForumPostProps {
  id: number;
  title: string;
  content: string;
  authorUsername: string;
  categoryName: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  viewCount: number;
  isPinned: boolean;
  isLocked: boolean;
  preview?: boolean;
}

const ForumPost: React.FC<ForumPostProps> = ({
  id,
  title,
  content,
  authorUsername,
  categoryName,
  createdAt,
  commentCount,
  likeCount,
  viewCount,
  isPinned,
  isLocked,
  preview = false,
}) => {
  const navigate = useNavigate();
  const date = new Date(createdAt);
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });

  // Strip HTML for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const contentPreview = preview 
    ? `${stripHtml(content).substring(0, 150)}${stripHtml(content).length > 150 ? '...' : ''}`
    : content;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle 
            className="text-xl cursor-pointer hover:text-primary flex items-center gap-2"
            onClick={() => navigate(`/forum/post/${id}`)}
          >
            {isPinned && <Pin size={16} className="text-yellow-500" />}
            {isLocked && <Lock size={16} className="text-red-500" />}
            {title}
          </CardTitle>
          <Badge>{categoryName}</Badge>
        </div>
        <CardDescription className="flex items-center gap-2">
          Posted by {authorUsername} {timeAgo}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preview ? (
          <p className="text-sm text-muted-foreground">{contentPreview}</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MessageSquare size={16} />
            {commentCount}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp size={16} />
            {likeCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={16} />
            {viewCount}
          </span>
        </div>
        {preview && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/forum/post/${id}`)}
          >
            Read More
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ForumPost;