import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { cores } from '../../theme';

export default function LayoutAbas() {
  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: '#8293A2',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { height: 64, paddingTop: 6, paddingBottom: 9, backgroundColor: '#FFFFFF', borderTopColor: cores.borda },
      }}
    >
      <Tabs.Screen name="dashboard" options={{
        title: 'Início',
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'grid' : 'grid-outline'} size={size} color={color} />,
      }} />
      <Tabs.Screen name="cadastro" options={{
        title: 'Cadastrar',
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person-add' : 'person-add-outline'} size={size} color={color} />,
      }} />
      <Tabs.Screen name="alunos" options={{
        title: 'Alunos',
        tabBarIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'people' : 'people-outline'} size={size} color={color} />,
      }} />
    </Tabs>
  );
}
