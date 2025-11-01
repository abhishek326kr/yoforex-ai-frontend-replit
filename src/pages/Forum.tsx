import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PlusCircle, TrendingUp, Users, MessageSquare, Sparkles, FileText } from "lucide-react";
import SearchBar from "@/components/forum/SearchBar";
import ForumCategory from "@/components/forum/ForumCategory";
import ForumPost from "@/components/forum/ForumPost";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { TradingLayout } from "@/components/layout/TradingLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface SearchFilters {
  categoryId?: string;
  sortBy: 'recent' | 'popular' | 'comments' | 'likes';
  timeRange: 'all' | 'today' | 'week' | 'month' | 'year';
  showPinned: boolean;
  showResolved: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  post_count: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_username: string;
  category_name: string;
  created_at: string;
  comment_count: number;
  like_count: number;
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
}

interface ForumStats {
  total_posts: number;
  active_members: number;
  topics_today: number;
}

const Forum: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<ForumStats>({ total_posts: 0, active_members: 0, topics_today: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    categoryId: undefined,
    sortBy: 'recent',
    timeRange: 'all',
    showPinned: false,
    showResolved: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForumData = async () => {
      setIsLoading(true);
      try {
        const [categoriesRes, allPostsRes, recentPostsRes, popularPostsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/forum/categories`),
          axios.get(`${API_BASE_URL}/forum/posts?sort=created_at&order=desc&limit=20`),
          axios.get(`${API_BASE_URL}/forum/posts?sort=created_at&order=desc&limit=10`),
          axios.get(`${API_BASE_URL}/forum/posts?sort=view_count&order=desc&limit=10`),
        ]);

        setCategories(categoriesRes.data);
        setAllPosts(allPostsRes.data.posts || []);
        setRecentPosts(recentPostsRes.data.posts || []);
        setPopularPosts(popularPostsRes.data.posts || []);

        const totalPosts = allPostsRes.data.posts?.length || 0;
        const uniqueAuthors = new Set(allPostsRes.data.posts?.map((p: Post) => p.author_id) || []).size;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPosts = allPostsRes.data.posts?.filter((p: Post) => 
          new Date(p.created_at) >= today
        ).length || 0;

        setStats({
          total_posts: totalPosts,
          active_members: uniqueAuthors,
          topics_today: todayPosts,
        });

        if (isAuthenticated && user) {
          const myPostsRes = await axios.get(
            `${API_BASE_URL}/forum/posts?author_id=${user.id}&sort=created_at&order=desc&limit=10`
          );
          setMyPosts(myPostsRes.data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching forum data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumData();
  }, [isAuthenticated, user]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams();
      queryParams.set('q', searchQuery);
      if (searchFilters.categoryId) queryParams.set('category', searchFilters.categoryId);
      queryParams.set('sort', searchFilters.sortBy);
      queryParams.set('time', searchFilters.timeRange);
      if (searchFilters.showPinned) queryParams.set('pinned', 'true');
      if (searchFilters.showResolved) queryParams.set('resolved', 'true');
      
      setLocation(`/forum/search?${queryParams.toString()}`);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-6">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">{description}</p>
        {!isAuthenticated ? (
          <Button 
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            onClick={() => setLocation('/auth')}
          >
            <Users className="h-4 w-4 mr-2" />
            Sign In to Post
          </Button>
        ) : (
          <Button 
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            onClick={() => setLocation('/forum/new-post')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <TradingLayout>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Community Forum
              </h1>
              <p className="text-muted-foreground text-lg">
                Connect with traders, share insights, and learn together
              </p>
            </div>
            {isAuthenticated && (
              <Button 
                onClick={() => setLocation("/forum/new-post")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg"
                size="lg"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                New Post
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold">{stats.total_posts}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-full bg-green-500/20 p-3">
                  <Users className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">{stats.active_members}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Topics Today</p>
                  <p className="text-2xl font-bold">{stats.topics_today}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            filters={searchFilters}
            onFiltersChange={setSearchFilters}
            categories={categories}
            onSearch={handleSearch}
            className="mb-6"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              All Posts
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular
            </TabsTrigger>
            {isAuthenticated && (
              <TabsTrigger value="my-posts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                My Posts
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : allPosts.length > 0 ? (
              <div className="space-y-4">
                {allPosts.map((post) => (
                  <ForumPost
                    key={post.id}
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
                    preview={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No Posts Yet"
                description="Be the first to start a discussion in the community forum!"
              />
            )}
          </TabsContent>

          <TabsContent value="categories" className="mt-0">
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-32" />
                  </Card>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <ForumCategory
                    key={category.id}
                    id={category.id}
                    name={category.name}
                    description={category.description || ""}
                    color={category.color}
                    postCount={category.post_count}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No Categories Found"
                description="Categories will appear here once they are created by administrators."
              />
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : recentPosts.length > 0 ? (
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <ForumPost
                    key={post.id}
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
                    preview={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="No Recent Posts"
                description="Check back later for the latest discussions from the community."
              />
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-0">
            {isLoading ? (
              <LoadingSkeleton />
            ) : popularPosts.length > 0 ? (
              <div className="space-y-4">
                {popularPosts.map((post) => (
                  <ForumPost
                    key={post.id}
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
                    preview={true}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No Popular Posts"
                description="Popular posts with the most views and engagement will appear here."
              />
            )}
          </TabsContent>

          {isAuthenticated && (
            <TabsContent value="my-posts" className="mt-0">
              {isLoading ? (
                <LoadingSkeleton />
              ) : myPosts.length > 0 ? (
                <div className="space-y-4">
                  {myPosts.map((post) => (
                    <ForumPost
                      key={post.id}
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
                      preview={true}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="No Posts Yet"
                  description="You haven't created any posts yet. Click 'New Post' to share your first discussion!"
                />
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </TradingLayout>
  );
};

export default Forum;
