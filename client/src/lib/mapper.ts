import type { AuthUser } from "@/api/auth";
import type { SidebarItem } from "@/constants/routes.sidebar";

export const filterRoutesByRole = (role: string | undefined, routes: SidebarItem[]): SidebarItem[] => {
    if (!role) return [];
    return routes
        .flatMap(route => {
            const isRouteAllowed = !route.allowedRoles || route.allowedRoles.includes(role as AuthUser['role']);
            if (!isRouteAllowed) {
                return [];
            }
            return [route];
        })
        .filter((item): item is SidebarItem => !!item);
};

export const convertSnakeCaseToTitleCase = (snakeCaseString: string): string => {
    const spaceSeparatedString = snakeCaseString.replace(/_/g, ' ');

    if (spaceSeparatedString.length === 0) {
        return '';
    }

    const firstChar = spaceSeparatedString.charAt(0).toUpperCase();
    const restOfString = spaceSeparatedString.slice(1);

    return firstChar + restOfString;
}