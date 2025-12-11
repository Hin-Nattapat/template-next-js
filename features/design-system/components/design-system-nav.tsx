"use client";

import {
  AlertCircle,
  ChevronDown,
  Coffee,
  Layout,
  Palette,
  RectangleHorizontal,
  SquareDot,
  Type,
} from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface INavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: INavItem[] = [
  { id: "introduction", label: "Introduction", icon: Coffee },
  { id: "colors", label: "Colors", icon: Palette },
  { id: "typography", label: "Typography", icon: Type },
  { id: "buttons", label: "Buttons", icon: RectangleHorizontal },
  { id: "forms", label: "Forms", icon: SquareDot },
  { id: "cards", label: "Cards", icon: Layout },
  { id: "feedback", label: "Feedback", icon: AlertCircle },
  { id: "accordion", label: "Accordion", icon: ChevronDown },
];

const DesignSystemNav = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-24 h-fit space-y-1">
      <div className="mb-4">
        <h3 className="text-foreground text-sm font-semibold">BrewHub</h3>
        <p className="text-muted-foreground text-xs">Design System</p>
      </div>
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default DesignSystemNav;
