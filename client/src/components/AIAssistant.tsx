
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

import { useState, useEffect, useRef } from "react";
import { sendChatMessage } from "@/lib/api";
import { ChatMessage } from "@shared/types";

interface AIAssistantProps {
  latitude: number;
  longitude: number;
}

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: number;
}

// Voice recognition setup
let recognition: SpeechRecognition | null = null;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
}

function speakMessage(text: string) {
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = 'en-US';
  speech.pitch = 1.6; 
  speech.rate = 1.0; 
  speech.volume = 1.0;
  window.speechSynthesis.speak(speech);
}

function startVoiceRecognition(setIsOpen: (isOpen: boolean) => void) {
  if (!recognition) return;
  
  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
    const triggerPhrases = ['hey attila', 'hay attila', 'hey atilla', 'hay atilla'];
    if (triggerPhrases.some(phrase => transcript.includes(phrase))) {
      setIsOpen(true);
      speakMessage("Quack! I'm here!");
    }
  };

  recognition.start();
}

export default function AIAssistant({ latitude, longitude }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startVoiceRecognition(setIsOpen);
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const initialGreeting = "Quack! How are you? How can I assist you?";
      setMessages([{
        role: "assistant",
        content: initialGreeting,
        timestamp: Date.now()
      }]);
      const speech = new SpeechSynthesisUtterance(initialGreeting);
      speech.lang = 'en-US';
      speech.pitch = 1.6;
      speech.rate = 1.0;
      speech.volume = 1.0;
      window.speechSynthesis.speak(speech);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !latitude || !longitude) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: Date.now()
    };
    setMessages([...messages, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      
      const response = await sendChatMessage(message, latitude, longitude);

      const speech = new SpeechSynthesisUtterance(response.message);
      speech.lang = 'en-US';
      speech.pitch = 1.6;
      speech.rate = 1.0;
      speech.volume = 1.0;
      window.speechSynthesis.speak(speech);

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: Date.now()
      };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = "Oh feathers! I seem to be having a bit of trouble with that request. Could you try asking again in a slightly different way? I'm still learning to swim in these data waters!";
      const speech = new SpeechSynthesisUtterance(errorMessage);
      speech.lang = 'en-US';
      speech.pitch = 1.6;
      speech.rate = 1.0;
      speech.volume = 1.0;
      window.speechSynthesis.speak(speech);

      const errorMessageObject: ChatMessage = {
        role: "assistant",
        content: errorMessage,
        timestamp: Date.now()
      };
      setMessages(prevMessages => [...prevMessages, errorMessageObject]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {!isOpen && (
        <div 
          className="bg-primary shadow-lg rounded-full w-14 h-14 flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <span role="img" aria-label="duck" className="text-3xl duck-bounce yellow-duck">🦆</span>
        </div>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 md:w-96 overflow-hidden">
          <div className="bg-primary p-3 flex justify-between items-center">
            <div className="flex items-center">
              <span role="img" aria-label="duck" className="text-3xl mr-2 duck-bounce yellow-duck">🦆</span>
              <div>
                <h3 className="text-white font-medium">Attila</h3>
                <p className="text-white/80 text-xs">Waddling through local risks & safety</p>
              </div>
            </div>
            <button 
              className="text-white/80 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-icons">close</span>
            </button>
          </div>

          <div className="chat-container p-3 overflow-y-auto flex flex-col space-y-3 bg-neutral-50">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`message ${
                  msg.role === "user" 
                    ? "self-end bg-blue-500 text-white rounded-lg rounded-br-none" 
                    : "self-start bg-yellow-50 border border-yellow-200 rounded-lg rounded-tl-none text-neutral-800 duck-message"
                } p-2 px-3 text-sm flex items-center gap-2`}
              >
                {msg.content}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => speakMessage(msg.content)}
                    className="ml-2 text-neutral-500 hover:text-neutral-700"
                  >
                    <span className="material-icons text-sm">volume_up</span>
                  </button>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="message self-start bg-yellow-50 border border-yellow-200 rounded-lg rounded-tl-none p-2 px-3 text-sm text-neutral-800 typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>

          <div className="p-3 border-t border-neutral-200 bg-white">
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Quack at me with your questions..." 
                className="flex-1 border border-neutral-300 rounded-l-lg p-2 text-sm focus:outline-none focus:border-primary" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button 
                className="bg-primary text-white p-2 rounded-r-lg hover:bg-primary-dark"
                onClick={handleSendMessage}
                title="Send message"
              >
                <span className="material-icons">send</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}