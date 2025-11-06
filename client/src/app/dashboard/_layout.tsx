import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/toggles/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";

const formatBreadcrumbLabel = (segment: string) => {
  return segment
    .split(/-|_/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function LayoutDashoard() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, _refreshUser, user } = useAuth();

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbItems = segments.map((segment, index) => {
    if (segment.length <= 2) return null; // Skip short segments like "c" or "e"
    if (/^[a-zA-Z0-9]{10,}$/.test(segment)) return null; // Skip likely IDs like "37rw7r5m2kg6rck"

    const path = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const label = formatBreadcrumbLabel(segment);

    return (
      <>
        {index > 0 && <BreadcrumbSeparator key={`sep-${index}`} />}
        <BreadcrumbItem key={path}>
          {isLast ? (
            <BreadcrumbPage>{label}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink>
              <Link to={path}>{label}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>
      </>
    );
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    _refreshUser();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-3">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink>
                    <Link to={"/"}>Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbSeparator />
                {breadcrumbItems}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="space-x-2">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* Profil Picture */}
            <Popover>
              <PopoverTrigger>
                <div className="cursor-pointer flex items-center gap-2 rounded-md px-4 py-0.5 hover:bg-muted">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {(user?.name || user?.role || "U")[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-left font-semibold">
                      {user?.name}
                    </p>
                    <p className="text-xs text-left">{user?.role}</p>
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-min">
                <Button onClick={handleLogout} variant="ghost">
                  <LogOut /> Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
