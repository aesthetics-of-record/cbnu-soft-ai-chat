'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  content: string;
  isUser: boolean;
  correction?: string;
  feedback?: string;
  aiResponse?: string;
  contextuallyAppropriate?: boolean;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length,
      content: input,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((msg) => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content,
          })),
        }),
      });

      const aiResponse = await response.json();
      try {
        const parsedContent = JSON.parse(aiResponse.content);
        const aiMessage: Message = {
          id: messages.length + 1,
          content: input,
          isUser: false,
          aiResponse: parsedContent.text,
          correction: parsedContent.correction,
          feedback: parsedContent.feedback,
          contextuallyAppropriate: parsedContent.contextually_appropriate,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (e) {
        // JSON 파싱 실패시 일반 메시지로 처리
        const aiMessage: Message = {
          id: messages.length + 1,
          content: aiResponse.content,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='h-screen flex flex-col'>
      <div className='border-b p-4 bg-white'>
        <h1 className='text-xl font-semibold'>
          AI English Conversation Practice
        </h1>
        <p className='text-sm text-muted-foreground'>
          실시간 교정과 피드백으로 영어 실력을 향상시켜보세요
        </p>
      </div>

      <ScrollArea className='flex-1 p-4'>
        <div className='space-y-6'>
          {messages.map((message) => (
            <div key={message.id} className='space-y-2'>
              <div
                className={`flex ${
                  message.isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.isUser
                    ? message.content
                    : message.aiResponse || message.content}
                </div>
              </div>

              {!message.isUser && (message.correction || message.feedback) && (
                <div className='ml-4 space-y-1'>
                  {message.correction && (
                    <div className='text-sm text-green-600 flex items-center gap-1'>
                      [교정]: {message.correction}
                    </div>
                  )}
                  {message.feedback && (
                    <div className='text-sm text-blue-600 flex items-center gap-1'>
                      [피드백]: {message.feedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className='border-t p-4 bg-white'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='영어로 메시지를 입력하세요...'
              className='flex-1'
            />
            <Button type='submit' size='icon'>
              <Send className='h-4 w-4' />
            </Button>
          </div>
          <p className='text-xs text-muted-foreground'>
            Enter를 눌러 메시지를 보내면 AI가 실시간으로 교정과 피드백을
            제공합니다
          </p>
        </form>
      </div>
    </div>
  );
}
