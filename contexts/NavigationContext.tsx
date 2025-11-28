
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ViewState } from '../types';

interface NavigationContextType {
  view: ViewState;
  setView: (view: ViewState) => void;
  location: string;
  setLocation: (path: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setViewState] = useState<ViewState>('HOME');

  // Map paths to views for wouter compatibility
  const setLocation = (path: string) => {
    if (path === '/checkout') setView('CHECKOUT');
    else if (path === '/wallet') setView('WALLET');
    else if (path === '/dashboard') setView('LIBRARY'); // Map dashboard to library for now
    else if (path === '/library') setView('LIBRARY');
    else if (path === '/') setView('MARKETPLACE');
    else if (path.includes('login')) setView('LOGIN');
    else if (path === '/studio') setView('STUDIO');
    else if (path === '/maps') setView('MAPS');
    else if (path === '/vision') setView('VISION');
    else setView('MARKETPLACE'); // Default
  };

  const setView = (v: ViewState) => {
    setViewState(v);
  }

  const location = view === 'MARKETPLACE' ? '/' : `/${view.toLowerCase()}`;

  return (
    <NavigationContext.Provider value={{ view, setView, location, setLocation }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Mimic wouter's useLocation hook
export const useLocation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useLocation must be used within NavigationProvider");
  return [context.location, context.setLocation] as const;
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) throw new Error("useNavigation must be used within NavigationProvider");
  return context;
};