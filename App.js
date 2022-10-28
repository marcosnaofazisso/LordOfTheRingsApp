import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';

import api from './api';

import ConversationItem from './ConversationItem';

export default function App() {

  const [sessionId, setSessionId] = useState("")
  const [message, setMessage] = useState({})
  const [conversation, setConversation] = useState([])

  useEffect(() => {
    const getSessionId = async () => {
      const response = await api.get('/api/session')
      setSessionId(response.data.session_id)
      console.log("GET Status Code: ", response.status);
    }
    getSessionId()
    return
  }, [])

  useEffect(() => {
    if (sessionId !== "") {
      const getFirstMessages = async () => {
        const response = await api.post('/api/message', { "session_id": sessionId })
        const arrayOfAnswers = response.data.output.generic
        arrayOfAnswers.forEach(answer => {
          setConversation((conversation) => [...conversation, { text: answer.text, user: false }])
        })
      }
      getFirstMessages()
      return
    }
  }, [sessionId])

  const handleSubmit = () => {
    Keyboard.dismiss()
    setConversation((conversation) => [...conversation, message])

    api.post('/api/message', {
      "session_id": sessionId,
      "input": {
        "message_type": "text",
        "text": message.text
      }
    })
      .then(response => {
        response.data.output.generic.forEach(answer => {
          setConversation((conversation) => [...conversation, { text: answer.text, user: false }])
        })
      })
      .catch(error => console.log(error))
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sessionIdText}>SESSION ID: {sessionId}</Text>
      <ScrollView>
        <View style={styles.conversationField}>
          {conversation.map((item, index) => {
            return (
              <View key={index}>
                <ConversationItem isUserMessage={item.user}>{item.text}</ConversationItem>
              </View>
            )
          })}
        </View>
      </ScrollView>
      <View style={styles.messageField}>
        <TextInput
          style={styles.textInput}
          placeholder={"Type your message..."}
          value={message}
          onChangeText={(text) => setMessage({ text: text, user: true })} />
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit} >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sessionIdText: {
    margin: 5,
    fontSize: 14,
    fontWeight: 'bold'
  },
  conversationField: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    borderColor: "gray",
  },
  messageField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
    backgroundColor: "#f2f2f2"

  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "gray",
    width: 280,
    backgroundColor: "#fff"
  },
  sendButton: {
    backgroundColor: '#40bf40',
    borderRadius: 8,
    padding: 15,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFF',
  },

});