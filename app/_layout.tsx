import { Stack } from 'expo-router';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme, View } from 'react-native';

export default function Layout() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="system">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#313244' : '#1e66f5', // ctp-blue variants
          },
          headerTintColor: colorScheme === 'dark' ? '#f5e0dc' : '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

    </GluestackUIProvider>
  );
}