import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  View
} from 'react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
const { hc } = require('hono/dist/client') as typeof import('hono/client');
import type { App } from '@/server/api';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { } from '@catppuccin/tailwindcss';

const client = hc<App>('http://localhost:3000');
console.log('client:', client);

export default function HomeScreen() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();

  const generateFlashcards = async () => {
    if (content.trim().length < 10) {
      Alert.alert('Error', 'Please enter more text content to generate meaningful flashcards.');
      return;
    }

    setLoading(true);

    try {
      const res = await client.generate.$post({ json: { content } });
      console.log('res:', res);
      if (!res.ok) {
        throw new Error(`Failed to generate flashcards ${JSON.stringify(await res.json())}`);
      }
      const { flashcards } = await res.json();

      // Save flashcards to AsyncStorage
      await AsyncStorage.setItem('flashcards', JSON.stringify(flashcards));

      // Navigate to flashcards view
      router.push('/flashcards');
    } catch (error: unknown) {
      console.error('Error:', error);
      Alert.alert('Error', `Failed to generate flashcards: ${(error as Error)?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <View className='mocha'>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-ctp-base dark:bg-ctp-mantle"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Flashcard Generator',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? '#313244' : '#1e66f5', // ctp-blue variants
          },
          headerTintColor: colorScheme === 'dark' ? '#f5e0dc' : '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <VStack space="md" className="p-6 pt-8">
        <Text className="text-xl font-semibold text-ctp-text dark:text-ctp-rosewater mb-2">
          Enter your study content:
        </Text>
        <Textarea className="mb-4 border-2 border-ctp-surface1 dark:border-ctp-surface2 rounded-xl">
          <TextareaInput
            multiline
            className="min-h-[40vh] p-4 text-base text-ctp-text dark:text-ctp-text"
            placeholder="Paste your study material here..."
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
            placeholderTextColor={colorScheme === 'dark' ? '#a6adc8' : '#9ca0b0'} // ctp-subtext0 variants
          />
        </Textarea>

        <Button
          onPress={generateFlashcards}
          className={`rounded-xl ${content.trim().length < 10
            ? 'bg-ctp-overlay0 dark:bg-ctp-overlay1'
            : 'bg-ctp-surface0 dark:bg-ctp-surface1'
            }`}
          disabled={loading || content.trim().length < 10}
        >
          {loading ? (
            <ButtonSpinner color="#ffffff" size="small" />
          ) : (
            <ButtonText className="font-bold text-ctp-text">Generate Flashcards</ButtonText>
          )}
        </Button>

        {loading && (
          <Text className="text-center text-ctp-subtext0 dark:text-ctp-subtext0 italic mt-2">
            Creating flashcards... This may take a moment.
          </Text>
        )}

        <Button
          onPress={() => router.push('/login')}
          className="mt-4 bg-transparent border border-ctp-blue dark:border-ctp-lavender rounded-xl hover:bg-ctp-blue/10 dark:hover:bg-ctp-lavender/10"
        >
          <ButtonText className="text-ctp-blue dark:text-ctp-lavender font-medium">
            Login
          </ButtonText>
        </Button>
      </VStack>
    </KeyboardAvoidingView>
    // </View>
  );
}