import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { useAuth } from "../../context/AuthContext";

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  timestamp: string;
}

interface CourseChatProps {
  courseId: string;
}

const CourseChat: React.FC<CourseChatProps> = ({ courseId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    const socketInstance = io("http://localhost:3000", {
      auth: { token },
    });

    socketInstance.on("connect", () => {
      console.log("Connected to chat server");
      socketInstance.emit("joinCourseChat", courseId);
    });

    socketInstance.on("chatHistory", (history: Message[]) => {
      setMessages(history);
    });

    socketInstance.on("newMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    socketInstance.on("error", (error: { message: string }) => {
      console.error("Chat error:", error.message);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [courseId, token]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !newMessage.trim()) return;

    socket.emit("sendMessage", {
      courseId,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">
                {message.sender.name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-700 bg-gray-100 rounded-lg p-3 max-w-[80%] break-words">
              {message.content}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseChat;
