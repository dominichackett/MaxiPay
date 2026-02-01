import React from 'react';
import { View, Text, ScrollView } from 'react-native';

const HistoryScreen = () => {
  // Placeholder data for payment history
  const paymentHistory = [
    { id: '1', date: '2024-01-28', description: 'Taxi Ride', amount: '-$15.50', type: 'expense' },
    { id: '2', date: '2024-01-27', description: 'Wallet Top-up', amount: '+$50.00', type: 'income' },
    { id: '3', date: '2024-01-26', description: 'Grocery Delivery', amount: '-$35.25', type: 'expense' },
    { id: '4', date: '2024-01-25', description: 'Taxi Ride', amount: '-$12.00', type: 'expense' },
    { id: '5', date: '2024-01-24', description: 'Friend Payment', amount: '+$10.00', type: 'income' },
    { id: '6', date: '2024-01-23', description: 'Restaurant', amount: '-$22.80', type: 'expense' },
    { id: '7', date: '2024-01-22', description: 'Online Purchase', amount: '-$75.00', type: 'expense' },
    { id: '8', date: '2024-01-21', description: 'Taxi Ride', amount: '-$18.00', type: 'expense' },
  ];

  return (
    <View className="flex-1 bg-white pt-4">
      <Text className="text-3xl font-bold text-center text-gray-800 mb-6">Payment History</Text>
      <ScrollView className="flex-1 px-4">
        {paymentHistory.map((item) => (
          <View
            key={item.id}
            className={`flex-row justify-between items-center p-4 mb-3 rounded-xl shadow-md
              ${item.type === 'expense' ? 'bg-red-100 border-l-4 border-red-400' : 'bg-green-100 border-l-4 border-green-400'}`}
          >
            <View>
              <Text className="text-lg font-semibold text-gray-800">{item.description}</Text>
              <Text className="text-sm text-gray-500">{item.date}</Text>
            </View>
            <Text className={`text-xl font-bold ${item.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
              {item.amount}
            </Text>
          </View>
        ))}
        {/* Add some padding at the bottom of the scroll view */}
        <View className="h-4" />
      </ScrollView>
    </View>
  );
};

export default HistoryScreen;