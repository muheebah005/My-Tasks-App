import { useState, useEffect} from 'react';
import { Alert, FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import TaskItem from './src/components/TaskItem';
import { scheduleTaskNotification } from './src/utils/Notification';
import { cancelNotification } from './src/utils/Notification';
import { saveTasks,loadTasks } from './src/utils/Storage';

const Priorities = ['High', 'Medium', 'Low'];

export default function App() {
  const [text, setText] = useState('');
  const [task, setTask] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('Low');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(true);

  const addTask = async () => {
    if(text.trim() === ''){
      Alert.alert('Task cannot be empty')
      return;
    } 
    const newTask ={
        id: Date.now().toString(),
        text: text.trim(),
        priority: selectedPriority,
        completed: false,
        notificationId: null,
      };
      
      const notificationId = await scheduleTaskNotification(newTask.text);
      newTask.notificationId = notificationId;

      setTask([...task, newTask]);
      setText('')

      Keyboard.dismiss();
  };

  const completedTask = async (id) => {
    const updatedTasks = await Promise.all(
      task.map(async (item) => {
        if (item.id === id) {
          if (!item.completed && item.notificationId) {
            await cancelNotification(item.notificationId);
          }

          return {
            ...item,
            completed: !item.completed,
          };
        }
        return item;
      })
    );
    setTask(updatedTasks);
  };

  const deleteTask = async (id) => {
    const taskToDelete = task.find((item) => item.id === id);
      if (taskToDelete?.notificationId) {
        await cancelNotification(taskToDelete.notificationId);
      }
        const updated = task.filter((item) => item.id !== id);
          setTask(updated);
};

  const handleSaveEdit = (id, newText) => {
  if (newText.trim() === '') {
    Alert.alert('Task cannot be empty');
    return;
  }
  const updated = task.map((item) =>
    item.id === id ? { ...item, text: newText.trim() } : item
  );
  setTask(updated);
  setEditingTaskId(null);
  setEditingText('');
};

useEffect(() => {
  (async () => {
    const savedTasks = await loadTasks(); 
    setTask(savedTasks);
    setLoading(false);
  })();
}, []);

useEffect(() => {
  if (!loading) {
    saveTasks(task);
  }
}, [task, loading]);

  return (
   <KeyboardAvoidingView style={styles.container} behavior="padding">
    <Text style={styles.title}>My Tasks</Text>
    <FlatList
    data={task}
    keyExtractor={(item) => item.id}
    renderItem={({item}) => ( 
      <TaskItem 
            id={item.id}
            text={item.text}
            priority={item.priority}
            completed={item.completed}
            onToggleComplete={completedTask}
            onDelete={deleteTask}
            isEditing={editingTaskId === item.id}
            editedText={editingText}
            setEditedText={setEditingText}
            onStartEdit={() => {
              if (!item.completed) {
                setEditingTaskId(item.id);
                setEditingText(item.text);
              }
            }}
            onSaveEdit={handleSaveEdit}/>
    )}/>

    {/* text input */}
    <View style={styles.textInputContainer}>
    <TextInput
    placeholder='Enter a task'
    value={text}
    onChangeText={setText}
    style={styles.textInput}/>

     {/* add button */}
    <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
      <Feather name="plus" size={24} color="black" />
    </TouchableOpacity>
    </View>

    {/* priority */}
    <View style={styles.priorityContainer}>
      {Priorities.map((priority) => (
        <TouchableOpacity key={priority} style={[styles.priorityButton, selectedPriority === priority && styles.selectedPriority]} onPress={() => setSelectedPriority(priority)}>
          <Text style={[styles.priorityText, selectedPriority === priority && styles.selectedPriorityText]}>{priority}</Text>
        </TouchableOpacity>
      ))}
    </View>
   </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8FBC8F',
  },
  title: {
    padding:10,
    fontSize: 24,
    marginTop:20,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Arial',
    color: '#fff'
  },
  textInput: {
    flex:1,
    padding: 15,
    marginHorizontal:10,
    marginLeft:30,
    width:260,
    borderRadius:18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#fff',
    fontSize:18,
    
  },
  textInputContainer: {
    flexDirection: 'row'
  },
  addTaskButton: {
    padding: 10,
    marginRight: 10,
    width:50,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderRadius:25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 10,
    marginLeft:30,
  }, 
  priorityButton: {
    padding:10,
    backgroundColor: '#008080',
    marginLeft:10,
    marginBottom:10,
    borderRadius:15,
  },
  priorityText: {
    color: '#fff',
  },
  selectedPriority: {
    backgroundColor: '#6B8E23'
  },
  selectedPriorityText:{
    color: '#FDF5E6'
  },
});
