import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ForumCategoryProps {
  id: number;
  name: string;
  description: string;
  color: string;
  postCount: number;
}

const ForumCategory: React.FC<ForumCategoryProps> = ({
  id,
  name,
  description,
  color,
  postCount,
}) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle 
            className="text-xl cursor-pointer hover:text-primary"
            onClick={() => navigate(`/forum/category/${id}`)}
            style={{ borderLeft: `4px solid ${color}`, paddingLeft: '0.75rem' }}
          >
            {name}
          </CardTitle>
          <Badge variant="outline">{postCount} posts</Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="pt-2 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/forum/category/${id}`)}
        >
          View Discussions
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForumCategory;