import MenuCard from "@/components/cards/menu-card";
import { filterRoutesByRole } from "@/lib/mapper";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES_SIDEBAR } from "@/constants/routes.sidebar";

export default function DashboardHome() {
  const { user } = useAuth();

  const userRole = user?.role || "";

  const availableRoutes = ROUTES_SIDEBAR.navMain;

  const userMenuItems = filterRoutesByRole(userRole, availableRoutes);

  return (
    <div className="p-4 space-y-8">
      <header className="space-y-2">
        <h1 className="text-xl font-extrabold tracking-tight lg:text-2xl">
          Halo,{" "}
          <span className="text-primary">
            {user?.name || user?.username || "Pengguna"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Selamat datang di Dashboard, Anda masuk sebagai{" "}
          <strong className="capitalize">{userRole}</strong>.
        </p>
      </header>

      {userMenuItems.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed rounded-lg bg-secondary/50">
          <p className="text-lg font-medium text-muted-foreground">
            Belum ada menu yang tersedia untuk role Anda saat ini ({userRole}).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userMenuItems.map((item) => (
            <MenuCard key={item.url} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
