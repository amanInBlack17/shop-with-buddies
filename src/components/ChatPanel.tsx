
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Smile, Image, Link } from 'lucide-react';

interface ChatPanelProps {
  roomId: string;
}

export const ChatPanel = ({ roomId }: ChatPanelProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'SM',
      message: 'Hey! Check out this headphone deal 🎧',
      timestamp: '2:45 PM',
      type: 'text'
    },
    {
      id: 2,
      user: 'Mike R.',
      avatar: 'MR',
      message: 'Looks great! Adding to wishlist 👍',
      timestamp: '2:46 PM',
      type: 'text'
    },
    {
      id: 3,
      user: 'You',
      avatar: 'JD',
      message: 'What about this yoga mat? Perfect for our home gym!',
      timestamp: '2:47 PM',
      type: 'text'
    },
    {
      id: 4,
      user: 'Sarah M.',
      avatar: 'SM',
      message: 'Love it! The reviews are amazing ⭐⭐⭐⭐⭐',
      timestamp: '2:48 PM',
      type: 'text'
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        user: 'You',
        avatar: 'JD',
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Group Chat</span>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            3 online
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.timestamp}</span>
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-sm">{msg.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick reactions */}
        <div className="flex space-x-2 mb-4">
          {['👍', '❤️', '😍', '🔥', '💯'].map((emoji) => (
            <Button
              key={emoji}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 text-lg"
              onClick={() => {
                const reactionMessage = {
                  id: messages.length + 1,
                  user: 'You',
                  avatar: 'JD',
                  message: emoji,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'reaction'
                };
                setMessages([...messages, reactionMessage]);
              }}
            >
              {emoji}
            </Button>
          ))}
        </div>

        {/* Message input */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Smile className="w-4 h-4 text-gray-400" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Image className="w-4 h-4 text-gray-400" />
              </Button>
            </div>
          </div>
          <Button 
            onClick={sendMessage}
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
