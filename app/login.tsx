import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

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
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (<Box className="flex items-center justify-center h-full">
    <Heading className="m-4">Login</Heading>
    <Button><ButtonText>Google</ButtonText></Button>
  </Box>);
}