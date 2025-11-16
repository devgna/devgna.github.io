import React from 'react';
import { useData } from '../../hooks/useData';
import { Card } from '../ui/Card';

export const ActivityLog: React.FC = () => {
    const { activityLog } = useData();

    return (
        <Card>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Activity Log</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
                <ul className="space-y-4">
                    {activityLog.slice().reverse().map(log => (
                        <li key={log.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{log.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.details}</p>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex justify-between items-center">
                                <span>by {log.user}</span>
                                <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};