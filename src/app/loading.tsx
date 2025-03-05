const Loading = () => {
  return (
    <div className="flex justify-center px-6 w-full min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="w-full lg:max-w-[90%] mt-4 md:mt-8">
        <div className="flex flex-col lg:flex-row lg:gap-8">
          {/* Left column - Table */}
          <div className="lg:w-2/3 order-2 lg:order-1">
            <div className="flex justify-between items-center mb-6">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-32 rounded"></div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-64 rounded"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
                ></div>
              ))}
            </div>
          </div>

          {/* Right column - Forms */}
          <div className="lg:w-1/3 order-1 lg:order-2 mb-8 lg:mb-0 space-y-6">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-32 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
