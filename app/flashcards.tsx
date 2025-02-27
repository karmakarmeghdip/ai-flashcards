// app/flashcards.js - Screen to view and study flashcards
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert
} from 'react-native';
import { Stack, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const [flashcards, setFlashcards] = useState<{ question: string, answer: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const flip = useSharedValue(0);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const savedFlashcards = await AsyncStorage.getItem('flashcards');

      if (savedFlashcards) {
        setFlashcards(JSON.parse(savedFlashcards));
      } else {
        Alert.alert('No Flashcards', 'No flashcards found. Please generate some first.');
        router.back();
      }
    } catch (error) {
      console.error('Error loading flashcards:', error);
      Alert.alert('Error', 'Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const flipCard = () => {
    flip.value = flip.value ? 0 : 1;
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${flip.value * 180}deg` },
      ],
      opacity: withTiming(flip.value === 0 ? 1 : 0),
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${(flip.value * 180) + 180}deg` },
      ],
      opacity: withTiming(flip.value === 1 ? 1 : 0),
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
    };
  });

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      if (flip.value === 1) flipCard();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      if (flip.value === 1) flipCard();
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Loading flashcards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Study Flashcards',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style="light" />

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Card {currentIndex + 1} of {flashcards.length}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cardContainer}
        onPress={flipCard}
        activeOpacity={0.9}
      >
        {flashcards.length > 0 && (
          <>
            <Animated.View style={[styles.card, frontAnimatedStyle]}>
              <Text style={styles.cardQuestion}>{flashcards[currentIndex].question}</Text>
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
            </Animated.View>

            <Animated.View style={[styles.card, backAnimatedStyle]}>
              <Text style={styles.cardAnswer}>{flashcards[currentIndex].answer}</Text>
              <Text style={styles.tapHint}>Tap to see question</Text>
            </Animated.View>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.navButton, currentIndex === 0 && styles.buttonDisabled]}
          onPress={prevCard}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, currentIndex === flashcards.length - 1 && styles.buttonDisabled]}
          onPress={nextCard}
          disabled={currentIndex === flashcards.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    padding: 15,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#666',
  },
  cardContainer: {
    height: 400,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardQuestion: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
  cardAnswer: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
    lineHeight: 24,
  },
  tapHint: {
    fontSize: 14,
    color: '#999',
    marginTop: 30,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0c0e8',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});