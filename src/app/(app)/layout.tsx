
"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { MainSidebar, navItems } from "@/components/main-sidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { user } = useAuth();

  const getPageTitle = () => {
    const currentNavItem = navItems.find((item) => {
        if (item.href === "/dashboard") return pathname === item.href;
        // Handle pages that might not be in the main nav like /profile or /settings
        if (pathname.startsWith(item.href) && item.href !== "/") {
          return true;
        }
        return false;
    });
    return currentNavItem ? currentNavItem.label : "Dashboard";
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:px-6">
      <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger className="text-foreground"/>}
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{getPageTitle()}</h1>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full"
          >
            <Avatar className="h-10 w-10 border-2 border-primary/50">
              <AvatarImage data-ai-hint="person user" src="https://placehold.co/40x40.png" alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name || 'Guest'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ''}
                  </p>
              </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
           </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isClient, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isClient && !user) {
        router.push('/login');
    }
  }, [isClient, user, router]);

  if (!user && isClient) {
      return null; // or a loading spinner
  }
  
  return (
    <SidebarProvider>
        <MainSidebar />
        <div className="flex flex-col w-full">
          <AppHeader />
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-6 md:gap-8">
            {children}
          </main>
        </div>
    </SidebarProvider>
  );
}
