import Link from "next/link";
import Head from "next/head";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from "uuid";

const Home = ({ }) => {
  const [itemList, setItemList] = useState([]);

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
      setItemList((prevList) => [...prevList, data]);
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
        {itemList.length ? (
          <table className="table-auto w-full mt-3">
            <thead>
              <tr>
                <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                  Person ID
                </th>
                <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                  DateTime
                </th>
                <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                  Recognized
                </th>
              </tr>
            </thead>
            <tbody>
              {itemList.map((item) => (
                <tr key={uuidv4()} className="lg:text-center">
                  <td className="rounded border px-4 py-2">{item.pid}</td>
                  <td className="rounded border px-4 py-2">{item.date}</td>
                  <td className="rounded border px-4 py-2">{item.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <></>
        )}

      </main>

    </div>
  );
};

export default Home;
