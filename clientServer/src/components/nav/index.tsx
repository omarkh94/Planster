import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";
import {
  Bell,
  FolderKanban,
  Home,
  LogIn,
  Menu,
  Plus,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import React from "react";
import { useLocation } from "react-router-dom";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: FolderKanban, label: "Projects", href: "/projects" },
    { icon: Users, label: "Team", href: "/team" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];
  const { setRegisterModalOpen } = useAuthStore();

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden bg-secondary rounded-sm p-2">
          <Menu size={16} />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] xs:w-[60%] sm:w-[40%]  p-3">
        <div className="">
          <a href="/" className="font-semibold text-xl text-border font-caveat">
            PLANSTER
          </a>
        </div>
        <div className="h-full flex flex-col bg-white">
          {/* Navigation Items */}
          <div className="flex-1 overflow-auto py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => close()}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="border-t p-4 pb-8 flex flex-col gap-2">
            <button
              className=" flex flex-row items-center gap-2 bg-secondary rounded-sm py-2 px-3 text-primary font-semibold"
              onClick={() => console.log("Open login modal")}
            >
              <LogIn className="h-4 w-4 mr-2 text-primary" strokeWidth={3} />
              Login
            </button>
            <button
              className=" flex flex-row items-center gap-2 bg-secondary rounded-sm py-2 px-3 text-primary font-semibold"
              onClick={() => console.log("Open signup modal")}
            >
              <UserPlus className="h-4 w-4 mr-2 text-primary" strokeWidth={3} />
              Sign up
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen flex flex-col font-glory">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-primary">
        <div className="mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo and Desktop Nav */}
            <div className="flex items-center gap-8">
              <a
                href="/"
                className="font-semibold text-xl text-secondary font-caveat"
              >
                PLANSTER
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-white hover:text-gray-900 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Action Buttons */}
              <button className="flex bg-secondary rounded-sm p-2">
                <Plus className="h-4 w-4 text-primary " strokeWidth={3} />
              </button>

              <button className="flex bg-secondary rounded-sm p-2">
                <Bell className="h-4 w-4 text-primary" strokeWidth={3} />
              </button>

              {/* Auth buttons - Desktop */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-3 text-primary font-semibold"
                  onClick={() => console.log("Open login modal")}
                >
                  <LogIn
                    className="h-4 w-4 mr-2 text-primary"
                    strokeWidth={3}
                  />
                  Login
                </button>
                <button
                  className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-3 text-primary font-semibold"
                  onClick={() => setRegisterModalOpen(true)}
                >
                  <UserPlus
                    className="h-4 w-4 mr-2 text-primary"
                    strokeWidth={3}
                  />
                  Sign up
                </button>
              </div>

              {/* Mobile Menu */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>
      {location.pathname === "/" ? (
        <main className="flex-1 bg-heroBg  bg-cover bg-center flex flex-col items-center justify-center relative font-caveat ">
          {children}
        </main>
      ) : (
        <main className="flex-1 bg-gray-300 w-full p-4 ">{children}</main>
      )}
    </div>
  );
};

export default NavLayout;
