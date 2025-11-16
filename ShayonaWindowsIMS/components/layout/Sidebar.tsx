import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { NAV_ITEMS } from '../../constants';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const { user } = useAuth();
    
    const activeLink = 'flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-primary-700 rounded-lg';
    const inactiveLink = 'flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors duration-200';

    const filteredNavItems = NAV_ITEMS.filter(item => user && item.roles.includes(user.role));

    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black opacity-50 z-30 lg:hidden ${isOpen ? 'block' : 'hidden'}`}
                onClick={toggleSidebar}
            ></div>

            <aside
                className={`fixed inset-y-0 left-0 bg-slate-800 text-white w-64 space-y-6 py-4 px-3 z-40 transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}
            >
                <nav className="flex-1">
                    <ul className="space-y-1">
                        {filteredNavItems.map(item => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => (isActive ? activeLink : inactiveLink)}
                                    onClick={() => { if(window.innerWidth < 1024) toggleSidebar() } }
                                >
                                    <ion-icon name={item.icon} class="mr-3 text-lg"></ion-icon>
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
