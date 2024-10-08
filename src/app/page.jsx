"use client"
import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react'
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import Dropdown from '@/components/dropdown';
import Inputfield from '@/components/inputfield';
import Link from 'next/link';

const Page = () => {
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession()
      console.log(session);
      if(session){
        if (session.user.provider === "github") {
          const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: session.user.name,
              email: session.user.email,
              password: null,
              provider: session.user.provider
            }),
          });
        }
      }
    }
    fetchSession()
  }, [])
  const [messages, setMessages] = useState([]);  // Store all messages

  const handleSaveInput = (userMessage) => {
    // Add user message and Omega's response to the messages array
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: userMessage },
      { sender: 'omega', text: 'Romega: I received your message!' },  // Simple Omega response
    ]);
  };

  return (
    <div className="h-screen bg-indigo-950 p-6">
      <div className="flex justify-between p-3">
        <div className='flex relative cursor-pointer'>
          <p className='absolute bg-blue-600 text-white p-3 rounded-full px-8 cursor-pointer'>Upload</p>
        <input className="opacity-0 absolute cursor-pointer" type="file" placeholder='Upload' />
        </div>
        <div className=' text-4xl text-white font-bold'>ROMEGA.AI</div>
        <Link href={"/Login"}>
        <div className="bg-gray-800 rounded-full hover:bg-gray-600 text-white px-6 py-2 border border-gray-500 font-bold cursor-pointer transition duration-300 ease-in-out">
          Login
        </div>
        </Link>
      </div>

      <div className="flex justify-center items-center space-x-6 mt-10">
        <Dropdown />
        <Inputfield saveInput={handleSaveInput} />
      </div>

      {/* Chat display */}
      <div className="mt-10 max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="chat-container overflow-y-auto h-64 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page