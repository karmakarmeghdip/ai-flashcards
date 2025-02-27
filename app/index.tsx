// app/index.js - Home screen with text input and flashcard generation
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
import { App } from '@/server/api';

const client = hc<App>('http://192.168.0.104:8000');
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
        throw new Error('Failed to generate flashcards' + JSON.stringify(await res.json()));
      }
      const { flashcards } = await res.json();

      // Save flashcards to AsyncStorage
      await AsyncStorage.setItem('flashcards', JSON.stringify(flashcards));

      // Navigate to flashcards view
      router.push('/flashcards');
    } catch (error: any) {
      console.error('Error:', error);
      Alert.alert('Error', `Failed to generate flashcards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <Stack.Screen
        options={{
          title: 'Flashcard Generator',
        }}
      />
      <StatusBar style="light" />

      <View style={styles.contentContainer}>
        <Text style={styles.label}>Enter your text content:</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Paste your study material here..."
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.button, content.trim().length < 10 && styles.buttonDisabled]}
          onPress={generateFlashcards}
          disabled={loading || content.trim().length < 10}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Generate Flashcards</Text>
          )}
        </TouchableOpacity>

        {loading && (
          <Text style={styles.loadingText}>
            Creating flashcards... This may take a moment.
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        ><Text>Login</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c0e8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});