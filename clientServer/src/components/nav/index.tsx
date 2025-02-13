// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/useAuthStore";
import { useUser } from "@/store/UserStore";
import {
  MessageSquareText,
  Kanban,
  KeyRound,
  Plus,
  Cog,
  UserPlus,
  DoorOpen,
} from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const NavLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const navItems = [
  // { icon: <FolderKanban/>, label: "Projects", href: "/projects" },
  // { icon: <Settings/>, label: "Settings", href: "/settings" },
  // ];
  const { setRegisterModalOpen, setLoginModalOpen, setProfileModalOpen } =
    useAuthStore();
  const { isLoggedIn, setDialogOpen, setIsLoggedIn } = useUser();


 const handleLogout = ()=>{
  setIsLoggedIn(false);
  localStorage.setItem("authToken", "");
  navigate(`/`);
 }


  // const MobileMenu = () => (
  //   <Sheet>
  //     <SheetTrigger asChild>
  //       <button className="md:bg-secondary rounded-sm p-2">
  //         <Menu size={16} />
  //       </button>
  //     </SheetTrigger>
  //     <SheetContent side="right" className="w-[80%] xs:w-[60%] sm:w-[40%]  p-3">
  //       <div className="">
  //         <a href="/" className="font-semibold text-xl text-border font-caveat">
  //           PLANSTER
  //         </a>
  //       </div>
  //       <div className="h-full flex flex-col bg-white">
  //         {/* Navigation Items */}
  //         <div className="flex-1 overflow-auto py-4">
  //           {navItems.map((item) => (
  //             <a
  //               key={item.href}
  //               href={item.href}
  //               className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
  //               onClick={() => close()}
  //             >
  //               <item.icon size={20} />
  //               <span>{item.label}</span>
  //             </a>
  //           ))}
  //         </div>

  //         {/* Auth Buttons */}
  //         <div className="border-t p-4 pb-8 flex flex-col gap-2">
  //           <button
  //             className=" flex flex-row items-center gap-2 bg-secondary rounded-sm py-2 px-3 text-primary font-semibold"
  //             onClick={() => setLoginModalOpen(true)}
  //           >
  //             <LogIn className="h-4 w-4 mr-2 text-primary" strokeWidth={3} />
  //             Login
  //           </button>
  //           <button
  //             className=" flex flex-row items-center gap-2 bg-secondary rounded-sm py-2 px-3 text-primary font-semibold"
  //             onClick={() => setRegisterModalOpen(true)}
  //           >
  //             <UserPlus className="h-4 w-4 mr-2 text-primary" strokeWidth={3} />
  //             Sign up
  //           </button>
  //         </div>
  //       </div>
  //     </SheetContent>
  //   </Sheet>
  // );

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
              {/* <nav className="md:flex items-center gap-6">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-sm text-white hover:text-gray-900 transition-colors"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </nav> */}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Action Buttons */}
              {isLoggedIn ? (
                <>
                  <Link
                    className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold"
                    to={""}
                    onClick={() => {
                      setDialogOpen(true);
                    }}
                  >
                    <Plus className="h-5.5 w-5.5" strokeWidth={3} />
                    <span className="hidden px-1 lg:flex">Create</span>
                  </Link>
                  <Link
                    to="/projects"
                    className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold"
                  >
                    <Kanban className="h-5.5 w-5.5" strokeWidth={3} />

                    <span className="hidden px-1 lg:flex">Projects</span>
                  </Link>

                  <Link
                    to={"/conversation"}
                    className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold"
                  >
                    <MessageSquareText
                      className="h-5.5 w-5.5 text-primary"
                      strokeWidth={3}
                    />
                    <span className="hidden px-1 lg:flex">Messages</span>
                  </Link>
                  <button
                    className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                    onClick={() => setProfileModalOpen(true)}
                  >
                    <Cog
                      className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                      strokeWidth={3}
                    />
                    <span className="hidden px-1 lg:flex">Settings</span>
                  </button>
                  <button
                    className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                    onClick={() => handleLogout()}
                  >
                    <DoorOpen
                      className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                      strokeWidth={3}
                    />
                    <span className="hidden px-1 lg:flex">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  {/* Auth buttons - Desktop */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex flex-row items-center gap-2 bg-secondary rounded-sm py-1 px-1 md:px-3 text-primary font-semibold"
                      onClick={() => setLoginModalOpen(true)}
                    >
                      <KeyRound
                        className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                        strokeWidth={3}
                      />
                      <span className="hidden px-1 lg:flex">Login</span>
                    </button>
                    <button
                      className="flex flex-row items-center gap-2  bg-secondary rounded-sm py-1 px-1 md:px-3  text-primary font-semibold "
                      onClick={() => setRegisterModalOpen(true)}
                    >
                      <UserPlus
                        className="h-5.5 w-5.5 mr-0 lg:mr-2 text-primary"
                        strokeWidth={3}
                      />
                      <span className="hidden px-1 lg:flex">Sign up</span>
                    </button>
                  </div>
                  {/* Mobile Menu */}
                  {/* <MobileMenu /> */}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      {location.pathname === "/" ? (
        <main className="flex-1 bg-heroBg  bg-cover bg-center flex flex-col items-center justify-center relative font-caveat ">
          {children}
        </main>
      ) : location.pathname === "/conversation" ? (
        <main className="flex-1 bg-secondary w-full h-full flex flex-col  items-center justify-start ">
          {children}
        </main>
      ) : location.pathname === "/welcome" ? (
        <main className="flex-1 bg-[#89a6ac]   bg-cover bg-center  flex flex-col  items-center justify-center  relative  font-caveat  ">
          {children}
        </main>
      ) : (
        <main className="flex-1 bg-gray-300 w-full h-full p-4 ">
          {children}
        </main>
      )}
    </div>
  );
};

export default NavLayout;
