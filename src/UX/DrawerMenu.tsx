"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Home, CalendarDays, Settings, Menu } from "lucide-react";

export function DrawerMenu({ slug }: { slug: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const menuItems = [
    {
      label: "Reservas",
      icon: <CalendarDays />,
      href: `/${slug}/business/dashboard`,
    },
    {
      label: "Pendientes",
      icon: <Home />,
      href: `/${slug}/business/dashboard/pending`,
    },
    {
      label: "Ajustes",
      icon: <Settings />,
      href: `/${slug}/business/dashboard/settings`,
    },
  ];

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="ghost" className="fixed top-4 left-4 z-50">
          <Menu size={10} />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-60">
        <DrawerHeader>
          <DrawerTitle>Menú negocio</DrawerTitle>
          <DrawerClose />
        </DrawerHeader>
        <nav className="flex flex-col space-y-2 px-4">
          {menuItems.map(({ label, icon, href }) => (
            <Button
              key={href}
              variant={pathname === href ? "default" : "ghost"}
              onClick={() => router.push(href)}
              className="justify-start w-full"
            >
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
