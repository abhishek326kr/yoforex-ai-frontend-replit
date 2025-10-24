import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import SearchBar from "@/components/forum/SearchBar";
import ForumCategory from "@/components/forum/ForumCategory";
import ForumPost from "@/components/forum/ForumPost";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { TradingLayout } from "@/components/layout/TradingLayout";

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
  author_username: string;
  category_name: string;
  created_at: string;
  comment_count: number;
  like_count: number;
  view_count: number;
  is_pinned: boolean;
  is_locked: boolean;
}


const Forum: React.FC = () => {
  
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
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
        // Fetch categories
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/forum/categories`
        );
        setCategories(categoriesResponse.data);

        // Fetch recent posts
        const recentPostsResponse = await axios.get(
          `${API_BASE_URL}/forum/posts?sort=created_at&order=desc&limit=10`
        );
        setRecentPosts(recentPostsResponse.data.posts);

        // Fetch popular posts
        const popularPostsResponse = await axios.get(
          `${API_BASE_URL}/forum/posts?sort=view_count&order=desc&limit=10`
        );
        setPopularPosts(popularPostsResponse.data.posts);
      } catch (error) {
        console.error("Error fetching forum data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForumData();
  }, []);

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

  return (
    <TradingLayout>
      <div className="container mx-auto py-2 pl-[0px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Community Forum</h1>
          {isAuthenticated && (
            <Button onClick={() => setLocation("/forum/new-post")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          )}
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

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent Posts</TabsTrigger>
            <TabsTrigger value="popular">Popular Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading categories...</div>
            ) : categories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
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
              <div className="text-center py-8">No categories found.</div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading recent posts...</div>
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
              <div className="text-center py-8">No recent posts found.</div>
            )}
          </TabsContent>

          <TabsContent value="popular" className="mt-6">
            {isLoading ? (
              <div className="text-center py-8">Loading popular posts...</div>
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
              <div className="text-center py-8">No popular posts found.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </TradingLayout>
  );
};

export default Forum;
