import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';
import { GlobalSearch } from '../common/GlobalSearch';
import { Notifications } from '../common/Notifications';
import { Toggle } from '../ui/Toggle';
import { ExportModal } from '../common/ExportModal';
import { Button } from '../ui/Button';

interface HeaderProps {
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    return (
        <header className="bg-slate-900 text-white shadow-md shrink-0 z-20">
            <div className="max-w-full mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSidebar} className="text-slate-300 lg:hidden mr-2">
                        <ion-icon name="menu-outline" class="text-2xl"></ion-icon>
                    </button>
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <ion-icon name="cube-outline" class="text-white text-xl"></ion-icon>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold leading-tight tracking-tight">UPVC Pro</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">ERP Suite</p>
                    </div>
                </div>

                <div className="flex-1 mx-8 hidden sm:block max-w-lg">
                    <GlobalSearch />
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    <Button 
                        onClick={() => setIsExportModalOpen(true)}
                        className="hidden sm:flex bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-xs border border-slate-700 transition-colors items-center"
                    >
                        <ion-icon name="download-outline" class="mr-2 text-primary-400"></ion-icon> Export
                    </Button>
                    <div className="hidden md:flex items-center space-x-2">
                        <ion-icon name="sunny-outline" class="text-slate-400"></ion-icon>
                        <Toggle isEnabled={theme === 'dark'} onToggle={toggleTheme} />
                        <ion-icon name="moon-outline" class="text-slate-400"></ion-icon>
                    </div>
                    <Notifications />
                    <div className="relative group">
                        <button className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold">
                                {user?.name.charAt(0)}
                            </div>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-40">
                             <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                 <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{user?.name}</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role}</p>
                             </div>
                             <a href="#/settings" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</a>
                            <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
            <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </header>
    );
};

export default Header;
