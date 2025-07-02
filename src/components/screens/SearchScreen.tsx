
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventSearchTab from '@/components/search/EventSearchTab';
import UserSearchTab from '@/components/search/UserSearchTab';

const SearchScreen: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen pb-20">
      <div className="p-4 space-y-6">
        <div className="text-center bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Cerca Opportunità 🎵
          </h1>
          <p className="text-gray-600 mt-1">Trova eventi e musicisti disponibili</p>
        </div>

        <Tabs defaultValue="eventi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-sm">
            <TabsTrigger value="eventi" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              🎼 Eventi
            </TabsTrigger>
            <TabsTrigger value="musicisti" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              🎵 Musicisti
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="eventi">
            <EventSearchTab />
          </TabsContent>
          
          <TabsContent value="musicisti">
            <UserSearchTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SearchScreen;
