// app/index.js - Home screen with text input and flashcard generation
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
// import { hc } from 'hono/client';
const { hc } = require('hono/dist/client') as typeof import('hono/client');
import type { App } from '@/server/api';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const client = hc<App>('http://localhost:3000');
console.log('client:', client);

export default function HomeScreen() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50 dark:bg-gray-900"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Flashcard Generator',
          headerStyle: {
            backgroundColor: '#3b82f6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <StatusBar style="light" />

      <VStack space="md" className="p-6 pt-8">
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
          Enter your study content:
        </Text>
        <Textarea className="mb-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
          <TextareaInput
            multiline
            className="min-h-[200px] p-4 text-base text-gray-700 dark:text-gray-200"
            placeholder="Paste your study material here..."
            value={content}
            onChangeText={setContent}
            textAlignVertical="top"
          />
        </Textarea>

        <Button
          onPress={generateFlashcards}
          className={`rounded-xl ${content.trim().length < 10
            ? 'bg-gray-300 dark:bg-gray-700'
            : 'bg-blue-600 dark:bg-blue-500'
            }`}
          disabled={loading || content.trim().length < 10}
        >
          {loading ? (
            <ButtonSpinner color="#fff" size="small" />
          ) : (
            <ButtonText className="font-bold text-white">Generate Flashcards</ButtonText>
          )}
        </Button>

        {loading && (
          <Text className="text-center text-gray-600 dark:text-gray-300 italic mt-2">
            Creating flashcards... This may take a moment.
          </Text>
        )}

        <Button
          onPress={() => router.push('/login')}
          className="mt-4 bg-transparent border border-blue-500 rounded-xl hover:bg-blue-500"
        >
          <ButtonText className="text-blue-600 dark:text-blue-400 font-medium">
            Login
          </ButtonText>
        </Button>
      </VStack>
    </KeyboardAvoidingView>
  );
}