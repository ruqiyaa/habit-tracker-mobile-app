import { useLocalSearchParams, useRouter } from "expo-router";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function TaskDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
}
