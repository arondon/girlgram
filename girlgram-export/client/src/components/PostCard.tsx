import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share, Bookmark, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostWithAuthorAndCircle, CommentWithAuthor } from "@shared/schema";

interface PostCardProps {
  post: PostWithAuthorAndCircle;
  onLike: (postId: number, isLiked: boolean) => void;
  isLiking?: boolean;
}

export default function PostCard({ post, onLike, isLiking }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Fetch comments when expanded
  const { data: comments = [] } = useQuery<CommentWithAuthor[]>({
    queryKey: ["/api/posts", post.id, "comments"],
    enabled: showComments,
  });

  const getDisplayName = (user: any) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.email || "User";
  };

  const getInitials = (user: any) => {
    const name = getDisplayName(user);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getCircleColor = (circleName: string) => {
    switch (circleName) {
      case "Study & School Life": return "bg-blue-100 text-blue-700";
      case "Mental Wellness & Self-Care": return "bg-green-100 text-green-700";
      case "Creative Space": return "bg-purple-100 text-purple-700";
      case "Style & Beauty": return "bg-pink-100 text-pink-700";
      case "College & Career": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article className="bg-white border-b border-gray-100 p-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage 
            src={post.author.profileImageUrl || undefined} 
            alt={getDisplayName(post.author)}
          />
          <AvatarFallback className="bg-primary text-white">
            {getInitials(post.author)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-800">
              {getDisplayName(post.author)}
            </h3>
            <Badge className={`text-xs font-medium ${getCircleColor(post.circle.name)}`}>
              {post.circle.name}
            </Badge>
            <span className="text-gray-500 text-sm">{timeAgo}</span>
          </div>
          
          <p className="text-gray-700 mb-3 whitespace-pre-wrap">
            {post.content}
          </p>
          
          {post.imageUrl && (
            <img 
              src={post.imageUrl} 
              alt="Post content" 
              className="w-full h-48 object-cover rounded-lg mb-3" 
            />
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(post.id, post.isLiked)}
                disabled={isLiking}
                className={`hover:text-red-500 ${post.isLiked ? 'text-red-500' : 'text-gray-600'}`}
              >
                <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likesCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                className="text-gray-600 hover:text-secondary"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">{post.commentsCount}</span>
              </Button>
              
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-accent">
                <Share className="w-4 h-4" />
              </Button>
            </div>
            
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 space-y-3">
              {/* Add Comment */}
              <div className="flex items-center space-x-2">
                <Textarea
                  placeholder="Write a supportive comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="flex-1 text-sm"
                />
                <Button 
                  size="sm"
                  disabled={!newComment.trim()}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage 
                        src={comment.author.profileImageUrl || undefined} 
                        alt={getDisplayName(comment.author)}
                      />
                      <AvatarFallback className="bg-secondary text-white text-xs">
                        {getInitials(comment.author)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-sm text-gray-800">
                          {getDisplayName(comment.author)}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-4">
                    No comments yet. Be the first to share your thoughts! 💕
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
