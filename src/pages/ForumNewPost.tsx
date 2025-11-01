import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/forum/RichTextEditor';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronLeft, Lightbulb, Eye, Save, Send, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { useToast } from '@/components/ui/use-toast';
import { TradingLayout } from '@/components/layout/TradingLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
}

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 10000;

const ForumNewPost: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create a post',
        variant: 'destructive',
      });
      setLocation('/auth');
      return;
    }

    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/forum/categories`);
        setCategories(response.data);
        if (response.data.length > 0) {
          setCategoryId(response.data[0].id.toString());
        }

        const savedDraft = localStorage.getItem('forum_post_draft');
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          setTitle(draft.title || '');
          setContent(draft.content || '');
          if (draft.categoryId) setCategoryId(draft.categoryId);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [isAuthenticated, setLocation, toast]);

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    const draft = { title, content, categoryId };
    localStorage.setItem('forum_post_draft', JSON.stringify(draft));
    
    setTimeout(() => {
      setIsSavingDraft(false);
      toast({
        title: 'Draft Saved',
        description: 'Your post has been saved as a draft',
      });
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      toast({
        title: 'Title Too Long',
        description: `Title must be ${MAX_TITLE_LENGTH} characters or less`,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/forum/posts`, {
        title,
        content,
        category_id: parseInt(categoryId),
      });

      localStorage.removeItem('forum_post_draft');

      toast({
        title: 'Post Created',
        description: 'Your post has been created successfully',
      });

      setLocation(`/forum/post/${response.data.id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const contentLength = stripHtml(content).length;
  const titleLength = title.length;

  if (isLoading) {
    return (
      <TradingLayout>
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        </div>
      </TradingLayout>
    );
  }

  return (
    <TradingLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/forum">Forum</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink>New Post</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Create New Post
            </h1>
            <p className="text-muted-foreground">Share your insights with the community</p>
          </div>
          <Button variant="outline" onClick={() => setLocation('/forum')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Post Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="title" className="text-sm font-medium">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <span className={cn(
                        "text-xs",
                        titleLength > MAX_TITLE_LENGTH ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {titleLength}/{MAX_TITLE_LENGTH}
                      </span>
                    </div>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a clear, descriptive title"
                      required
                      maxLength={MAX_TITLE_LENGTH}
                      className={cn(
                        titleLength > MAX_TITLE_LENGTH && "border-red-500"
                      )}
                    />
                    {titleLength > MAX_TITLE_LENGTH && (
                      <p className="text-xs text-red-500">Title exceeds maximum length</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="content" className="text-sm font-medium">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <span className={cn(
                        "text-xs",
                        contentLength > MAX_CONTENT_LENGTH ? "text-red-500" : "text-muted-foreground"
                      )}>
                        {contentLength}/{MAX_CONTENT_LENGTH}
                      </span>
                    </div>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Write your post content here... Use the formatting toolbar to style your text."
                      minHeight="400px"
                    />
                    {contentLength > MAX_CONTENT_LENGTH && (
                      <p className="text-xs text-red-500">Content exceeds maximum length</p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/forum')}
                      disabled={isSubmitting || isSavingDraft}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSaveDraft}
                      disabled={isSubmitting || isSavingDraft || (!title.trim() && !content.trim())}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSavingDraft ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPreview(true)}
                      disabled={!title.trim() || !content.trim()}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !title.trim() || !content.trim() || !categoryId || titleLength > MAX_TITLE_LENGTH || contentLength > MAX_CONTENT_LENGTH}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">1</Badge>
                    <p><strong>Be specific:</strong> Use a clear, descriptive title that summarizes your post</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">2</Badge>
                    <p><strong>Add context:</strong> Provide background information to help others understand</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">3</Badge>
                    <p><strong>Use formatting:</strong> Break up text with headers, lists, and emphasis</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">4</Badge>
                    <p><strong>Be respectful:</strong> Maintain a professional and courteous tone</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="mt-0.5">5</Badge>
                    <p><strong>Proofread:</strong> Review your post before publishing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-lg">Formatting Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bold</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + B</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Italic</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + I</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Link</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + K</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Undo</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + Z</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Redo</span>
                    <code className="bg-muted px-2 py-1 rounded text-xs">Ctrl/Cmd + Y</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/30 bg-orange-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  Community Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Please ensure your post follows our community guidelines:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>No spam or self-promotion</li>
                  <li>Stay on topic</li>
                  <li>Respect other members</li>
                  <li>No offensive content</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{title || 'Untitled Post'}</DialogTitle>
              <DialogDescription>
                Preview of how your post will appear to other users
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge>{categories.find(c => c.id.toString() === categoryId)?.name || 'Category'}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">Just now</span>
              </div>
              <div 
                className="prose prose-invert max-w-none" 
                dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">No content to preview</p>' }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TradingLayout>
  );
};

export default ForumNewPost;
