import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="task/[id]" options={{ title: "Edit task" }} />
    </Stack>
  );
}
