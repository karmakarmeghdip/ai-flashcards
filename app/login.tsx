import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { LogIn } from "lucide-react-native";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useColorScheme } from "react-native";
import { VStack } from "@/components/ui/vstack";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // await authClient.signIn();
      throw new Error('Not implemented');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack className="flex-1 bg-ctp-base dark:bg-ctp-mantle">
      {/* Banner at the top */}
      <Box className="pt-16 pb-6 items-center bg-ctp-blue dark:bg-ctp-sapphire">
        <Heading className="text-3xl font-bold text-white">AI Flashcards</Heading>
        <Text className="text-white mt-2">Smart Learning. Smarter Results.</Text>
      </Box>

      {/* Description in the middle */}
      <Box className="flex-1 px-6 justify-center items-center">
        <Heading className="text-xl text-center mb-4 text-ctp-text dark:text-ctp-rosewater">Welcome</Heading>
        <Text className="text-center text-ctp-subtext1 dark:text-ctp-subtext0 mb-6">
          Enhance your learning experience with AI-powered flashcards tailored to your needs.
          Sign in to create, study, and track your progress.
        </Text>

        {error ? (
          <Text className="text-ctp-red dark:text-ctp-peach text-center my-4">{error}</Text>
        ) : null}
      </Box>

      {/* Login button at the bottom */}
      <Box className="px-6 pb-16 items-center">
        <Button
          onPress={login}
          disabled={loading}
          className="w-full flex-row justify-center items-center gap-2 mb-8 bg-ctp-lavender dark:bg-ctp-mauve"
        >
          {!loading ? <LogIn color={isDark ? "#cdd6f4" : "#ffffff"} size={20} /> : null}
          <ButtonText className="text-white">{loading ? "Signing in..." : "Sign in with Google"}</ButtonText>
        </Button>
      </Box>
    </VStack>
  );
}