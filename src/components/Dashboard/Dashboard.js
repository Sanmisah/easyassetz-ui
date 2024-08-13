import React from "react";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400">
        This is the dashboard page where you can view your profile and
        transactions.
      </p>

      <div className="flex space-x-4">
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
        <div className="cursor-pointer flex items-center gap-8 bg-gray-100 p-4 rounded-lg w-64 h-52">
          comming soon!!
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
