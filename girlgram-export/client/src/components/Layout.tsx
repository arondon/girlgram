import { Link, useLocation } from "wouter";
import { Bell, Home, Users, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    window.location.href = "/api/logout";
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

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/circles", icon: Users, label: "Circles" },
    { path: "/create", icon: Plus, label: "Create", special: true },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 text-white sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary text-lg">💕</span>
            </div>
            <h1 className="text-xl font-bold">GirlGram</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-xs w-4 h-4 rounded-full flex items-center justify-center text-gray-800">
                3
              </span>
            </Button>
            
            <div className="relative group">
              <Avatar className="w-8 h-8 border-2 border-white cursor-pointer">
                <AvatarImage 
                  src={user?.profileImageUrl} 
                  alt={getDisplayName()}
                />
                <AvatarFallback className="bg-white text-primary text-sm">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              {/* Dropdown menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{getDisplayName()}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            if (item.special) {
              return (
                <Link key={item.path} href={item.path}>
                  <button className="flex flex-col items-center space-y-1">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  </button>
                </Link>
              );
            }
            
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center space-y-1 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-gray-400 hover:text-secondary"
                }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
