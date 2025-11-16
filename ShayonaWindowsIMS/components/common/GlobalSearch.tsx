
import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce';

interface SearchResult {
    type: string;
    id: string;
    title: string;
    link: string;
}

export const GlobalSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { salesOrders, customers, inventory } = useData();

    useEffect(() => {
        if (debouncedSearchTerm) {
            const orderResults = salesOrders
                .filter(o => o.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                .map(o => ({ type: 'Order', id: o.id, title: `Order #${o.id}`, link: `/orders/${o.id}` }));

            const customerResults = customers
                .filter(c => c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                .map(c => ({ type: 'Customer', id: c.id, title: c.name, link: `/customers` }));

            const inventoryResults = inventory
                .filter(i => i.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || i.sku.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
                .map(i => ({ type: 'Inventory', id: i.id, title: `${i.name} (${i.sku})`, link: `/inventory` }));
            
            setResults([...orderResults, ...customerResults, ...inventoryResults]);
        } else {
            setResults([]);
        }
    }, [debouncedSearchTerm, salesOrders, customers, inventory]);

    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200);
    };

    return (
        <div className="relative">
            <div className="relative">
                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <ion-icon name="search-outline" class="text-gray-400"></ion-icon>
                </span>
                <input
                    type="text"
                    placeholder="Search orders, customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={handleBlur}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>
            {isFocused && results.length > 0 && (
                <div className="absolute z-10 mt-2 w-full max-h-80 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                    <ul>
                        {results.map(result => (
                            <li key={`${result.type}-${result.id}`}>
                                <Link to={result.link} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{result.title}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.type}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
