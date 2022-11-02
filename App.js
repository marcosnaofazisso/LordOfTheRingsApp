import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';

import api from './api';
import ConversationItem from './ConversationItem';

import Voice from '@react-native-community/voice';
import Tts from 'react-native-tts';

export default function App() {

  const [sessionId, setSessionId] = useState("")
  const [message, setMessage] = useState({})
  const [conversation, setConversation] = useState([])
  const [audioSended, setAudioSended] = useState(false)


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
        response.data.output.generic.forEach(answer => {
          setConversation((conversation) => [...conversation, { text: answer.text, user: false }])
        })
      }
      getFirstMessages()
      return
    }
  }, [sessionId])

  useEffect(() => {
    console.log("Loading....")
    if (Object.keys(message).length > 0) handleSubmit()
  }, [audioSended])



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


  const listenAnswers = () => {
    //language for Brazilian Portuguese
    Tts.setDefaultLanguage('pt-BR');
    for (i = 3; i > 0; i--) {
      const answer = conversation[conversation.length - i].text;
      Tts.speak(answer);
    }
  };

  const onSpeechRecognized = (e) => {
    console.log("recogninzed", e)
  }

  const onSpeechStart = (e) => {
    console.log("start handler==>>>", e)
  }

  const onSpeechEnd = (e) => {
    console.log("stop handler", e)
  }

  const onSpeechResults = (e) => {
    let text = e.value[0]
    console.log("speech result handler", e)
    setMessage({ text: text, user: true })
    setAudioSended(current => !current)
  }

  const startRecording = async () => {
    try {
      //language for Brazilian Portuguese
      Voice.start('pt-Br')
    } catch (error) {
      console.log("error raised", error)
    }
  }

  const stopRecording = async () => {
    try {
      Voice.stop()
    } catch (error) {
      console.log("error raised", error)
    }
  }


  Voice.onSpeechStart = onSpeechStart;
  Voice.onSpeechEnd = onSpeechEnd;
  Voice.onSpeechResults = onSpeechResults;


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
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.audioField}>
        <TouchableOpacity style={styles.listenButton} onPress={listenAnswers}>
          <Text style={styles.buttonText}>Listen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordButton}
          activeOpacity={0.9}
          onPressIn={startRecording}
          onPressOut={stopRecording}>
          <Text style={styles.buttonText}>Record</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}


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
    justifyContent: 'center',
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
    width: 250,
    backgroundColor: "#fff"
  },
  sendButton: {
    backgroundColor: '#40bf40',
    borderRadius: 8,
    padding: 15,
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFF',
  },
  audioField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f2f2f2"
  },
  recordButton: {
    flex: 1,
    margin: 5,
    backgroundColor: '#ff0000',
    borderRadius: 8,
    padding: 15,
    color: '#fff'
  },
  listenButton: {
    flex: 1,
    margin: 5,
    backgroundColor: 'tomato',
    borderRadius: 8,
    padding: 15,
  },
})