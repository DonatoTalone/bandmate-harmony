
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Search } from 'lucide-react';

const MessagesScreen: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dati puliti - nessun mock
  const chats: any[] = [];
  const messages: any[] = [];

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      console.log('Invio messaggio:', newMessage, 'a chat:', selectedChat);
      setNewMessage('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-800">
              <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
              Messaggi
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Lista Chat */}
          <Card className="lg:col-span-1 border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              {/* Barra di ricerca */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cerca conversazioni..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Lista conversazioni */}
              {chats.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Nessun messaggio</h3>
                  <p className="text-sm text-gray-500">
                    Le tue conversazioni appariranno qui quando riceverai o invierai messaggi
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedChat === chat.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                      }`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {chat.nomeUtente?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                              {chat.nomeUtente}
                            </h4>
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {chat.ultimoMessaggio}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Area Chat */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-white">
            <CardContent className="p-0 h-[500px] flex flex-col">
              {selectedChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-600 text-white">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-gray-800">Utente</h3>
                        <p className="text-sm text-gray-600">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Nessun messaggio in questa conversazione</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.isOwn
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="text-sm">{message.messaggio}</p>
                              <p className={`text-xs mt-1 ${
                                message.isOwn ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {message.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Scrivi un messaggio..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium mb-2">Seleziona una chat</p>
                    <p className="text-sm">Scegli una conversazione dalla lista per iniziare a chattare</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesScreen;
