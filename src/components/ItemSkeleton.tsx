import React from "react";

const ItemSkeleton = () => {
  return (
    <div className="space-y-4 mb-6">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="p-4 md:p-8 border dark:border-gray-700 rounded-lg transition-colors bg-gray-100 dark:bg-gray-800 animate-pulse"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>

            <div className="flex-[0.5]">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>

            <div className="flex-[1.5]">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>

            <div className="flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            </div>

            <div className="flex gap-3">
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemSkeleton;
