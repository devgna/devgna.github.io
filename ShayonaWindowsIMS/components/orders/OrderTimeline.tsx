
import React from 'react';
import { OrderStatus } from '../../types';
import { ORDER_STATUSES } from '../../constants';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus }) => {
  const currentStatusIndex = ORDER_STATUSES.indexOf(currentStatus);

  return (
    <div className="flex items-center my-6 overflow-x-auto pb-4">
      {ORDER_STATUSES.map((status, index) => {
        const isCompleted = index < currentStatusIndex;
        const isActive = index === currentStatusIndex;

        return (
          <React.Fragment key={status}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted ? 'bg-green-500' : ''}
                  ${isActive ? 'bg-primary-500 ring-4 ring-primary-200 dark:ring-primary-800' : ''}
                  ${!isCompleted && !isActive ? 'bg-gray-300 dark:bg-gray-600' : ''}
                `}
              >
                {isCompleted ? (
                   <ion-icon name="checkmark-outline" class="text-white"></ion-icon>
                ) : (
                    <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500'}`}></span>
                )}
              </div>
              <p className={`mt-2 text-xs text-center min-w-[60px] ${isActive ? 'font-bold text-primary-600 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400'}`}>
                {status}
              </p>
            </div>
            {index < ORDER_STATUSES.length - 1 && (
              <div className={`flex-1 h-1 ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
