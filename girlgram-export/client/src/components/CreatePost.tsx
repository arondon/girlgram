import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Palette, BarChart3, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Circle, InsertPost } from "@shared/schema";

export default function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [selectedCircle, setSelectedCircle] = useState<string>("");

  // Fetch circles for post creation
  const { data: circles = [] } = useQuery<Circle[]>({
    queryKey: ["/api/circles"],
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: InsertPost) => {
      await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      setContent("");
      setSelectedCircle("");
      setIsExpanded(false);
      toast({
        title: "Success! 🎉",
        description: "Your post has been shared with the community!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please write something before posting!",
        variant: "destructive",
      });
      return;
    }

    if (!selectedCircle) {
      toast({
        title: "Circle required",
        description: "Please select a circle for your post!",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      content: content.trim(),
      circleId: parseInt(selectedCircle),
      authorId: user?.id || "",
    });
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.firstName || user?.email || "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section className="p-4 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src={user?.profileImageUrl} 
            alt={getDisplayName()}
          />
          <AvatarFallback className="bg-primary text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          {isExpanded ? (
            <Card className="border-2 border-primary/20">
              <CardContent className="p-4 space-y-4">
                <Textarea
                  placeholder="What's on your mind today? 💭"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="border-0 p-0 resize-none focus-visible:ring-0 text-gray-700"
                />
                
                <Select value={selectedCircle} onValueChange={setSelectedCircle}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a circle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {circles.map((circle) => (
                      <SelectItem key={circle.id} value={circle.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <span>
                            {circle.icon === "fas fa-book" && "📚"}
                            {circle.icon === "fas fa-heart" && "💖"}
                            {circle.icon === "fas fa-palette" && "🎨"}
                            {circle.icon === "fas fa-sparkles" && "✨"}
                            {circle.icon === "fas fa-graduation-cap" && "🎓"}
                          </span>
                          <span>{circle.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                      <Camera className="w-4 h-4 mr-1" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                      <Palette className="w-4 h-4 mr-1" />
                      Art
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Poll
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false);
                        setContent("");
                        setSelectedCircle("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSubmit}
                      disabled={createPostMutation.isPending}
                      className="bg-gradient-to-r from-primary to-secondary hover:from-pink-500 hover:to-purple-500"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      {createPostMutation.isPending ? "Posting..." : "Post"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full text-left p-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              What's on your mind today? 💭
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
