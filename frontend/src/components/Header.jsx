"use client";

import { Menu, Bell, User } from "lucide-react";

export function Header({ onMenuClick }) {
  return (
    <header className="border-b border-border bg-sidebar">
      <div className="px-4 md:px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <div className="hidden md:flex items-center gap-2 flex-1">
          <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
