
"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Info,
  Mic,
  Calendar as CalendarIcon,
  BookOpen,
  ImageIcon,
  UserCog,
  LogOut,
  Ticket,
  User,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const Logo = () => {
    return <Image src="/images/unilife_logo.png" alt="Unilife Logo" width={140} height={40} className="object-contain" />;
};

type Role = "Admin" | "Panitia" | "Member";

export const navItems: {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: Role[];
}[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ['Admin', 'Panitia'] },
  { href: "/users", icon: UserCog, label: "User", roles: ['Admin'] },
  { href: "/committee", icon: Users, label: "Panitia", roles: ['Admin', 'Panitia'] },
  { href: "/events", icon: CalendarIcon, label: "Event", roles: ['Admin', 'Panitia'] },
  { href: "/lineup", icon: Mic, label: "Line Up", roles: ['Admin', 'Panitia'] },
  { href: "/tickets", icon: Ticket, label: "Tiket", roles: ['Admin', 'Panitia'] },
  { href: "/banners", icon: ImageIcon, label: "Banner", roles: ['Admin', 'Panitia'] },
  { href: "/recap", icon: BookOpen, label: "Recap", roles: ['Admin', 'Panitia'] },
  { href: "/about", icon: Info, label: "About", roles: ['Admin', 'Panitia'] },
  { href: "/profile", icon: User, label: "Profile", roles: ['Admin', 'Panitia'] },
  { href: "/settings", icon: Settings, label: "Settings", roles: ['Admin', 'Panitia'] },
];

export function MainSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { hasRole, user } = useAuth();

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path;
        return pathname.startsWith(path);
    };

    const handleLogout = () => {
      sessionStorage.removeItem('loggedInUser');
      router.push('/login');
    };

    const visibleNavItems = navItems.filter(item => hasRole(item.roles));

    if (!user) {
        return null;
    }

    return (
        <Sidebar>
            <SidebarHeader className="pt-6 pb-8 px-4">
                <div className="h-10 flex items-center">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {visibleNavItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton 
                                asChild 
                                isActive={isActive(item.href)}
                                className="justify-start data-[active=true]:border-l-4 data-[active=true]:border-sidebar-border data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground rounded-none"
                                variant="default"
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-base font-medium">{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout} className="justify-start" variant="default">
                      <LogOut className="h-5 w-5"/>
                      <span className="text-base font-medium">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
