
import React from 'react';
import { Card } from '../ui/Card';
import { useData } from '../../hooks/useData';
import { Link } from 'react-router-dom';

const ProductionSchedule: React.FC = () => {
  const { productionJobs } = useData();
  const today = new Date().toISOString().split('T')[0];
  const todaysJobs = productionJobs.filter(job => job.startDate === today);

  return (
    <Card>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Today's Production Schedule</h3>
            <Link to="/production" className="text-sm text-primary-600 hover:underline">View All</Link>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto">
            {todaysJobs.length > 0 ? (
                todaysJobs.map(job => (
                    <div key={job.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-700 dark:text-gray-300">Order #{job.orderId}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Assigned to: {job.assignedTo}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {job.stage}
                        </span>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No jobs scheduled for today.</p>
            )}
        </div>
    </Card>
  );
};

export default ProductionSchedule;
