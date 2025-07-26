import React from 'react';
import Head from 'next/head';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';

const Dashboard: React.FC = () => {
  return (
    <>
      <Head>
        <title>Dashboard - Credit Card Optimizer</title>
        <meta name="description" content="Credit Card Rewards Optimization Dashboard" />
      </Head>
      
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
          
          <StatsCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendingChart />
            <RecentTransactions />
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard; 