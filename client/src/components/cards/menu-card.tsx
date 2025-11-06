import type { SidebarItem } from "@/constants/routes.sidebar";
import { Link } from "react-router";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface MenuCardProps {
  item: SidebarItem;
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => (
  <Link to={item.url} key={item.url} className="block h-full">
    <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="flex-grow space-y-2 pb-2">
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

export default MenuCard;
