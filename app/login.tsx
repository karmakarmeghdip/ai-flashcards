import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { View, Text, Input, Button } from "tamagui";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const auth = useAuth();

  const login = async () => {
    try {
      setLoading(true);
      setError('');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      throw new Error('Not implemented');
      // await authClient.signIn();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text>{error}</Text> : null}
      <Button
        onPress={login}
        disabled={loading}
      >Login</Button>
    </View>
  );
}