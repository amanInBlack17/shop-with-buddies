
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Plus, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShoppingRoomProps {
  onJoinRoom: (roomId: string) => void;
}

export const ShoppingRoom = ({ onJoinRoom }: ShoppingRoomProps) => {
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const mockActiveRooms = [
    { id: 'room1', name: 'Weekend Shopping', members: 3, host: 'Sarah M.', activity: 'Electronics' },
    { id: 'room2', name: 'Wedding Prep', members: 5, host: 'Mike R.', activity: 'Fashion' },
    { id: 'room3', name: 'Home Decor Hunt', members: 2, host: 'Lisa K.', activity: 'Home & Garden' },
  ];

  const createRoom = () => {
    setIsCreating(true);
    setTimeout(() => {
      const newRoomId = 'room_' + Math.random().toString(36).substr(2, 9);
      setIsCreating(false);
      onJoinRoom(newRoomId);
      toast({
        title: "Room Created!",
        description: "Your shopping room is ready. Share the link with friends!",
      });
    }, 1000);
  };

  const joinRoom = (roomId: string) => {
    onJoinRoom(roomId);
    toast({
      title: "Joined Room!",
      description: "Welcome to the shopping session!",
    });
  };

  const copyRoomLink = (roomId: string) => {
    navigator.clipboard.writeText(`https://coshop.app/room/${roomId}`);
    toast({
      title: "Link Copied!",
      description: "Room link copied to clipboard",
    });
  };

  return (
    <div className="space-y-8">
      {/* Create or Join Room */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Create Room */}
        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Shopping Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-purple-100">
              Start a new shopping session and invite friends to join you
            </p>
            <Button 
              onClick={createRoom}
              disabled={isCreating}
              className="w-full bg-white text-purple-600 hover:bg-gray-100"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </Button>
          </CardContent>
        </Card>

        {/* Join Room */}
        <Card className="bg-gradient-to-br from-blue-500 to-teal-500 text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ExternalLink className="w-5 h-5" />
              <span>Join Room</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-blue-100">
              Enter a room code to join an existing shopping session
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button 
                onClick={() => joinRoom(roomCode)}
                disabled={!roomCode}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Join
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Rooms */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Active Shopping Rooms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockActiveRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{room.name}</h3>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {room.activity}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gray-200">
                      {room.host.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Hosted by {room.host}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{room.members} members</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyRoomLink(room.id)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => joinRoom(room.id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
