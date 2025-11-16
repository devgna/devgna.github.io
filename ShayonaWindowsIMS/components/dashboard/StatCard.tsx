
import React from 'react';
import { Card } from '../ui/Card';

interface StatCardProps {
  icon: string;
  title: string;
  value: string | number;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, label, color }) => {
  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-full mr-4`} style={{ backgroundColor: `${color}1A`, color: color }}>
            <ion-icon name={icon} class="text-2xl"></ion-icon>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
