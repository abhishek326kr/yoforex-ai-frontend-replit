import { useEffect, useState, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import axios from "axios";

type NewsItem = {
  headline: string;
  summary: string;
  url: string;
  time: string;
  source: string;
  sentiment: string;
};

const PAGE_SIZE = 5;
const PAGINATION_WINDOW = 3;

// Loading Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

interface TradingTipsProps {
  horizontalLayout?: boolean;
  showPagination?: boolean;
}

export default function TradingTips({ horizontalLayout = false, showPagination = true }: TradingTipsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [windowStart, setWindowStart] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages] = useState(10); // Assuming 10 pages for now

  // Handle page changes
  const handlePageChange = useCallback((pageNum: number) => {
    // Prevent page changes during animation
    if (isAnimating) return;
    
    // Don't go beyond page limits
    if (pageNum < 1 || pageNum > totalPages) return;
    
    // Set animation state
    setIsAnimating(true);
    
    // Update page and fetch news
    setPage(pageNum);
    fetchNews(pageNum);
    
    // Adjust window start if needed
    if (pageNum >= windowStart + PAGINATION_WINDOW) {
      setWindowStart(pageNum - 1);
    } else if (pageNum < windowStart) {
      setWindowStart(Math.max(1, pageNum));
    }
  }, [windowStart, isAnimating, totalPages]);

  // Navigation handlers
  const handleNextPage = useCallback(() => handlePageChange(page + 1), [handlePageChange, page]);
  const handlePrevPage = useCallback(() => handlePageChange(page - 1), [handlePageChange, page]);
  // const handleNextWindow = useCallback(() => handlePageChange(windowStart + 1), [handlePageChange, windowStart]);
  // const handlePrevWindow = useCallback(() => handlePageChange(Math.max(1, windowStart - 1)), [handlePageChange, windowStart]);

  const fetchNews = async (pageNum: number) => {
    try {
      setLoading(true);
      setIsAnimating(true);
      setError(null);
      
      const response = await axios.get(`${import.meta.env.VITE_PUBLIC_API_BASE_URL}/news/news/?page=${pageNum}&limit=${PAGE_SIZE}`);
      if (!response) throw new Error('Failed to fetch news');
      
      const data = response.data;
      console.log(response.data)
      if (Array.isArray(data)) {
        setNews(data);
      } else if (Array.isArray(data?.results)) {
        setNews(data.results);
      } else {
        setNews([]);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load trading tips. Please try again later.');
      setNews([]);
    } finally {
      setLoading(false);
      setTimeout(() => setIsAnimating(false), 300); // Match this with animation duration
    }
  };

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const displayItems = horizontalLayout && !showPagination ? news.slice(0, 3) : news;

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-6 pt-4">
        <CardTitle className="text-lg font-semibold">
          {horizontalLayout ? 'Latest Market News' : 'Trading News'}
        </CardTitle>
        <button 
          onClick={() => fetchNews(1)} 
          disabled={loading}
          className="p-1.5 rounded-full hover:bg-muted transition-colors"
          aria-label="Refresh news"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent className={`flex-1 overflow-hidden ${horizontalLayout ? 'px-2' : ''}`}>
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
            <p className="text-rose-400 mb-4">{error}</p>
            <button 
              onClick={() => fetchNews(page)}
              className="px-4 py-2 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSpinner />
            ) : news.length > 0 ? (
              <div className={horizontalLayout ? 'flex gap-4 pb-4' : 'space-y-4'}>
                {displayItems.map((item, index) => (
                  <motion.div
                    key={`${item.headline}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`${horizontalLayout ? 'min-w-[300px] max-w-[350px]' : 'w-full'} ${
                      !horizontalLayout ? 'border-b border-muted/50 last:border-0 pb-4 last:pb-0' : ''
                    }`}
                  >
                    <Card className={`h-full ${horizontalLayout ? 'hover:shadow-md transition-shadow' : ''}`}>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-foreground group-hover:underline line-clamp-2">
                                {item.headline}
                              </span>
                              <span 
                                className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                  item.sentiment === 'positive' 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : item.sentiment === 'negative'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-blue-500/10 text-blue-500'
                                }`}
                              >
                                {item.sentiment}
                              </span>
                            </div>
                            <div 
                              className="text-sm text-muted-foreground line-clamp-3 prose prose-sm prose-invert"
                              dangerouslySetInnerHTML={{ __html: item.summary }}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">{item.source}</span>
                              <span className="text-xs text-muted-foreground">{item.time}</span>
                            </div>
                          </div>
                        </CardContent>
                      </a>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <p className="text-slate-400">No trading tips available</p>
                <button 
                  onClick={() => fetchNews(1)}
                  className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                </button>
              </div>
            )}
          </AnimatePresence>
        )}
      </CardContent>
      {(!horizontalLayout || showPagination) && (
        <CardFooter className="flex items-center justify-between px-6 py-3 border-t">
          <div className="flex-1 flex justify-between sm:justify-start">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={page === 1 || loading}
              className="mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = windowStart + i;
                if (pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${page === pageNum ? 'font-bold' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage} 
            disabled={page >= totalPages || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}