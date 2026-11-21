import { Settings } from "lucide-react";

export default function Footer({ onOpenPreferences }) {
  return (
    <footer className="py-8 bg-background border-t border-border text-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-text-secondary text-sm">
          &copy; {new Date().getFullYear()} Utkarsh Pachauri. All rights reserved.
        </p>
        <button
          type="button"
          onClick={onOpenPreferences}
          className="text-xs text-text-secondary hover:text-white transition-colors flex items-center gap-1.5 focus:outline-none focus:underline"
          aria-label="Open analytics & privacy preferences"
        >
          <Settings className="w-3.5 h-3.5 text-accent" />
          Analytics Preferences
        </button>
      </div>
    </footer>
  );
}
