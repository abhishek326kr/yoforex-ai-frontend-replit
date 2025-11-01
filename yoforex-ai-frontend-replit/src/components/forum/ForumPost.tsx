import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { MessageSquare, ThumbsUp, Eye, Pin, Lock, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { cn } from '@/lib/utils';

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
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: () => void;
  isBookmarked?: boolean;
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
  onLike,
  onBookmark,
  onShare,
  isBookmarked = false,
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

  const handleNavigate = () => {
    if (preview) {
      navigate(`/forum/post/${id}`);
    }
  };

  return (
    <Card 
      className={cn(
        "mb-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        preview && "hover:border-primary/50 cursor-pointer",
        isPinned && "border-yellow-500/50"
      )}
      onClick={preview ? handleNavigate : undefined}
      role="article"
      aria-label={`Forum post: ${title} by ${authorUsername}`}
    >
      <CardHeader className="space-y-2 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback aria-label={`${authorUsername}'s avatar`}>{authorUsername[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle 
                className={cn(
                  "text-xl line-clamp-2 hover:text-primary transition-colors",
                  preview && "cursor-pointer"
                )}
                id={`post-title-${id}`}
              >
                {title}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span>{authorUsername}</span>
                <span>•</span>
                <span>{timeAgo}</span>
                {isPinned && (
                  <>
                    <span>•</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Pin className="h-4 w-4 text-yellow-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pinned Post</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
                {isLocked && (
                  <>
                    <span>•</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className="h-4 w-4 text-red-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Thread Locked</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="ml-2">
            {categoryName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {preview ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{contentPreview}</p>
        ) : (
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        )}
      </CardContent>

      <CardFooter className="pt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4" role="group" aria-label="Post interactions">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-muted-foreground hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike?.();
                  }}
                  aria-label={`Like this post (${likeCount} likes)`}
                >
                  <ThumbsUp className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">{likeCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Like this post</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    preview && navigate(`/forum/post/${id}`);
                  }}
                  aria-label={`View comments (${commentCount} comments)`}
                >
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">{commentCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Comments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-muted-foreground focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${viewCount} views`}
                  disabled
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  <span className="text-sm">{viewCount}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Views</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-2" role="group" aria-label="Post actions">
          {onBookmark && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookmark();
                    }}
                    aria-label={isBookmarked ? 'Remove bookmark from this post' : 'Bookmark this post'}
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Bookmark 
                      className={cn(
                        "h-4 w-4",
                        isBookmarked ? "fill-current text-primary" : "text-muted-foreground"
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {onShare && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShare();
                    }}
                    aria-label="Share this post"
                    className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Share2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {preview && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/forum/post/${id}`);
              }}
              className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label={`Read full post: ${title}`}
            >
              Read More
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForumPost;