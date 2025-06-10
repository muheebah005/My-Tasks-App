import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import { TextInput } from 'react-native';
import { useState, useEffect } from 'react';

const TaskItem = ({
  id, 
  text ,
  priority , 
  completed, 
  onToggleComplete, 
  onDelete,
  isEditing,
  editedText,
  setEditedText,
  onStartEdit,
  onSaveEdit,}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
  let timeout;

  if (showTooltip) {
    timeout = setTimeout(() => {
      setShowTooltip(false);
    }, 2000); 
  }

  return () => clearTimeout(timeout);
}, [showTooltip]);

  return (
      <View style={[styles.taskItem, completed && styles.completedTask]}>
        <TouchableOpacity onPress={() => !isEditing && onToggleComplete(id)}>
          <Feather name={completed ? 'check-square' : 'square'} size={22} color={completed ? 'blue' : 'white'} style={styles.checkBox}/>
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            value={editedText}
            onChangeText={setEditedText}
            style={[styles.taskText, styles.editInput]}
            autoFocus
          />
        ) : (
          <Text style={[styles.taskText, completed && styles.completedText]}>
            {text}
          </Text>
        )}

        <View style={styles.priorityContainer}>
        <TouchableOpacity
            onPress={() => setShowTooltip(!showTooltip)}
            activeOpacity={0.8}
          >
          <View style={[styles.priorityDot, 
              priority === 'High' && { backgroundColor: 'red' },
              priority === 'Medium' && { backgroundColor: 'orange' },
              priority === 'Low' && { backgroundColor: 'blue' },
            completed && {opacity: 0.5}]}  />
             </TouchableOpacity>

             {showTooltip && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>
                    {priority === 'High' && 'Urgent task!'}
                    {priority === 'Medium' && 'Important task!'}
                    {priority === 'Low' && 'Can be done later..'}
                  </Text>
                </View>
              )}
          

          {isEditing ? (
            <TouchableOpacity onPress={() => onSaveEdit(id, editedText)}>
              <Feather name="check" size={20} color="blue" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onStartEdit}>
              <Feather name="edit" size={18} color="blue"  disabled={completed} style={{ opacity: completed ? 0.3 : 1, marginLeft: 15 }} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => onDelete(id)}>
            <Feather name="trash-2" size={20} color="white" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        </View>
      </View>
    
  );
};



export default TaskItem

const styles = StyleSheet.create({
  taskItem: {
    flexDirection:'row',
    backgroundColor: '#008080',
    padding:20,
    marginHorizontal:10,
    marginTop: 30,
    borderRadius:10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  taskText: {
    flex:1,
    fontSize:18,
    marginTop:10,
    color:'#fff'
  }, 
  completedText: {
    textDecorationLine: 'line-through',
    color: '#ccc',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
    marginRight:10
  },
  priorityBadge: {
    fontSize:15,
    color: '#fff',
    marginRight:5
  },
  checkBox: {
    marginRight:10,
    marginTop:7
  },
  priorityDot: {
    width:18,
    height:18,
    borderRadius:25
  },
  tooltip: {
  position: 'absolute',
  top: -35,
  left: 0,
  backgroundColor: 'black',
  padding: 6,
  borderRadius: 6,
  zIndex: 1,
  maxWidth: 150,
},
tooltipText: {
  color: 'white',
  fontSize: 12,
  textAlign: 'center',
},
completedTask: {
  backgroundColor: '#5A7874'
}
})