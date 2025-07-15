// components/navbar.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <nav className="flex items-center px-4 lg:px-24 pt-3 pb-3 border-b bg-background">
      {/* Mobile Layout */}
      <div className="flex md:hidden items-center w-full gap-3">
        {/* Logo */}
        <div 
          className="w-8 h-8 bg-black rounded-full flex items-center justify-center cursor-pointer"
          onClick={handleLogoClick}
        >
          <span className="text-white font-bold text-sm">e</span>
        </div>

        {/* Mobile Search - Full Width */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Quick Search...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-16 bg-muted rounded-full border-0 focus:border-0 focus-visible:ring-0 w-full"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>

        {/* Mobile Right Side */}
        {user ? (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        ) : (
          <Button asChild size="sm" variant="outline">
            <Link href="/auth/login">Sign in</Link>
          </Button>
        )}

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg md:hidden z-50">
          <div className="flex flex-col gap-2 p-4">
            <Button variant="ghost" className="justify-start" asChild>
              <Link href="/government" onClick={() => setShowMobileMenu(false)}>
                Government
              </Link>
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                className="justify-start" 
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center w-full">
        {/* Left Side - Logo and Navigation */}
        <div className="flex items-center gap-6 flex-1">
          <div 
            className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={handleLogoClick}
          >
            <span className="text-white font-bold">e</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-transparent"
              asChild
            >
              <Link href="/government">Government</Link>
            </Button>
          </div>
        </div>

        {/* Center - Search Bar */}
        <div className="flex flex-1 justify-center px-8">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Quick Search...."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-16 bg-muted rounded-full border-0 focus:border-0 focus-visible:ring-0 w-full"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Right Side - Auth */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hey, {user.email}!
              </span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" variant="default">
                <Link href="/auth/sign-up">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}