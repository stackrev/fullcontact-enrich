import Link from "next/link";
import Head from "next/head";
import { useEffect } from 'react';
import io from 'socket.io-client';

const Home = ({ }) => {
  
  useEffect(() => {
    const socket = io('http://147.182.133.115:3001');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socket.on('dataFromServer', (data) => {
      console.log('Received data from server:', data);
      // Do something with the received data
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen antialiased bg-gray-200 flex  flex-col items-center ">
      <Head>
        <title>Website Traffic Monitoring</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container max-w-screen px-6">
        <div className="py-8">
          <h1 className="text-3xl font-medium text-gray-800 ">
            Website Traffic Monitoring
          </h1>
          <h3 className=" font-medium text-lg text-gray-600">
            Using FullContact API
          </h3>
        </div>
<div>Traffic</div>

      </main>

    </div>
  );
};

export default Home;
