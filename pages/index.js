import Head from "next/head";
import { v4 as uuidv4 } from "uuid";
import fetch from "isomorphic-unfetch";

const Home = ({ visitlogs }) => {
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
        {visitlogs.length ? (
          <table className="table-auto w-full mt-3">
            <thead>
              <tr>
                <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                  Person ID
                </th>
                <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
                  IP Address
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
              {visitlogs.map((item) => (
                <tr key={uuidv4()} className="lg:text-center">
                  <td className="rounded border px-4 py-2">{item.pid}</td>
                  <td className="rounded border px-4 py-2">{item.ip}</td>
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

export async function getServerSideProps(context) {
  const res = await fetch(`http://localhost:3000/api/log`);
  const { data } = await res.json();

  return { props: { visitlogs: data } };
}

export default Home;
