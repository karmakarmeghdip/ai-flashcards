import { Stack } from 'expo-router';



import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";



export default function Layout() {
  return (
    <GluestackUIProvider mode="system"><Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    /></GluestackUIProvider>
  );
}