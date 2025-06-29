import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Circle } from "@shared/schema";

interface CircleIconProps {
  circle: Circle;
  isJoined: boolean;
}

export default function CircleIcon({ circle, isJoined }: CircleIconProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const circleMutation = useMutation({
    mutationFn: async (action: "join" | "leave") => {
      if (action === "join") {
        await apiRequest("POST", `/api/circles/${circle.id}/join`);
      } else {
        await apiRequest("DELETE", `/api/circles/${circle.id}/leave`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/circles/user"] });
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
        description: "Failed to update circle membership",
        variant: "destructive",
      });
    },
  });

  const getIcon = () => {
    switch (circle.icon) {
      case "fas fa-book": return "📚";
      case "fas fa-heart": return "💖";
      case "fas fa-palette": return "🎨";
      case "fas fa-sparkles": return "✨";
      case "fas fa-graduation-cap": return "🎓";
      default: return "🌟";
    }
  };

  const getBgColor = () => {
    switch (circle.color) {
      case "blue": return "from-blue-300 to-blue-400";
      case "green": return "from-green-300 to-green-400";
      case "purple": return "from-purple-300 to-purple-400";
      case "pink": return "from-pink-300 to-pink-400";
      case "yellow": return "from-yellow-300 to-yellow-400";
      default: return "from-gray-300 to-gray-400";
    }
  };

  const handleClick = () => {
    const action = isJoined ? "leave" : "join";
    circleMutation.mutate(action);
  };

  return (
    <div className="flex-shrink-0 text-center">
      <Button
        variant="ghost"
        className="p-0 h-auto bg-transparent hover:bg-transparent"
        onClick={handleClick}
        disabled={circleMutation.isPending}
      >
        <div className={`w-16 h-16 bg-gradient-to-br ${getBgColor()} rounded-full flex items-center justify-center mb-2 shadow-md transition-transform hover:scale-105 ${
          isJoined ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}>
          <span className="text-white text-xl">{getIcon()}</span>
        </div>
      </Button>
      <span className="text-xs text-gray-600 font-medium">
        {circle.name.split(' ')[0]}
        {isJoined && (
          <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-1"></div>
        )}
      </span>
    </div>
  );
}
