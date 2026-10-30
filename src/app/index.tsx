import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function Index() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const saved = await AsyncStorage.getItem("tasks");
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {
        console.log("Failed to load tasks", e);
      }
      setLoaded(true);
    }
    loadTasks();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, loaded]);

  function addTask() {
    if (task.trim() === "") return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: task.trim(),
      done: false,
    };
    setTasks([newTask, ...tasks]);
    setTask("");
  }

  function toggleTask(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>
      <Text style={styles.subtitle}>
        {doneCount} of {tasks.length} completed
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          placeholder="What needs to be done?"
          placeholderTextColor="#9ca3af"
          value={task}
          onChangeText={setTask}
          onSubmitEditing={addTask}
          style={styles.input}
        />
        <Pressable
          onPress={addTask}
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet. Add your first one! ✨</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() => toggleTask(item.id)}
              style={styles.cardLeft}
            >
              <View style={[styles.circle, item.done && styles.circleDone]}>
                {item.done && <Text style={styles.check}>✓</Text>}
              </View>
              <Text style={[styles.taskText, item.done && styles.taskTextDone]}>
                {item.text}
              </Text>
            </Pressable>

            <Pressable onPress={() => deleteTask(item.id)} hitSlop={10}>
              <Text style={styles.delete}>✕</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#afcee1",
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0e2e42",
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    marginTop: 4,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#254f69",
    width: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 28,
    lineHeight: 30,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#254f69",
    justifyContent: "center",
    alignItems: "center",
  },
  circleDone: {
    backgroundColor: "#254f69",
  },
  check: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  taskText: {
    fontSize: 17,
    color: "#194d70",
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  delete: {
    fontSize: 18,
    color: "#ef4444",
    paddingLeft: 10,
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: 40,
    fontSize: 16,
  },
});
