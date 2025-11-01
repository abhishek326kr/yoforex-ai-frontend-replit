import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  TrendingUp, 
  HelpCircle, 
  Lightbulb, 
  AlertCircle,
  BookOpen,
  Users,
  FileText,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForumCategoryProps {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

const getCategoryIcon = (name: string) => {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('general') || lowercaseName.includes('discussion')) {
    return MessageSquare;
  }
  if (lowercaseName.includes('help') || lowercaseName.includes('support') || lowercaseName.includes('question')) {
    return HelpCircle;
  }
  if (lowercaseName.includes('strategy') || lowercaseName.includes('strategies')) {
    return TrendingUp;
  }
  if (lowercaseName.includes('tip') || lowercaseName.includes('guide') || lowercaseName.includes('tutorial')) {
    return Lightbulb;
  }
  if (lowercaseName.includes('announcement') || lowercaseName.includes('news')) {
    return AlertCircle;
  }
  if (lowercaseName.includes('education') || lowercaseName.includes('learning')) {
    return BookOpen;
  }
  if (lowercaseName.includes('community') || lowercaseName.includes('social')) {
    return Users;
  }
  return FileText;
};

const getCategoryGradient = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 hover:border-pink-500/50',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 hover:border-yellow-500/50',
    indigo: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30 hover:border-indigo-500/50',
    teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/30 hover:border-teal-500/50',
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 hover:border-cyan-500/50',
  };
  return colorMap[color] || 'from-gray-500/20 to-gray-600/10 border-gray-500/30 hover:border-gray-500/50';
};

const getIconColor = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    pink: 'text-pink-500',
    yellow: 'text-yellow-500',
    indigo: 'text-indigo-500',
    teal: 'text-teal-500',
    cyan: 'text-cyan-500',
  };
  return colorMap[color] || 'text-gray-500';
};

const getBgColor = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20',
    red: 'bg-red-500/20',
    pink: 'bg-pink-500/20',
    yellow: 'bg-yellow-500/20',
    indigo: 'bg-indigo-500/20',
    teal: 'bg-teal-500/20',
    cyan: 'bg-cyan-500/20',
  };
  return colorMap[color] || 'bg-gray-500/20';
};

const ForumCategory: React.FC<ForumCategoryProps> = ({
  id,
  name,
  description,
  color,
  postCount,
}) => {
  const navigate = useNavigate();
  const Icon = getCategoryIcon(name);

  const handleClick = () => {
    navigate(`/forum/category/${id}`);
  };

  return (
    <Card 
      className={cn(
        'transition-all duration-300 cursor-pointer group overflow-hidden',
        'hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1',
        'bg-gradient-to-br',
        getCategoryGradient(color)
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className={cn('rounded-lg p-3 transition-transform group-hover:scale-110', getBgColor(color))}>
            <Icon className={cn('h-6 w-6', getIconColor(color))} />
          </div>
          <Badge 
            variant="secondary" 
            className="bg-background/50 backdrop-blur-sm"
          >
            {postCount} {postCount === 1 ? 'post' : 'posts'}
          </Badge>
        </div>
        <CardTitle className="text-xl group-hover:text-primary transition-colors">
          {name}
        </CardTitle>
        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
          {description || 'Join the discussion and share your thoughts'}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-0 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {postCount === 0 ? 'Be the first to post!' : 'View discussions'}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          className="group-hover:bg-primary/10 group-hover:text-primary transition-all"
        >
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForumCategory;
