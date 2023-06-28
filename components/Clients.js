import Link from "next/link";

const Clients = ({ clients }) => {
  return (
    <div className=" overflow-x-auto shadow rounded-lg client my-6 border lg:p-4 bg-white ">
      <table className="table-auto w-full ">
        <thead>
          <tr>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100">
              ID
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
              Email
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
              Person ID
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border  border-gray-200 bg-gray-100">
              Option
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id} className="lg:text-center">
              <td className="rounded border px-4 py-2">
                <Link href={`/clients/${client._id}`}>
                  <a className=" text-blue-700 hover:underline font-medium">
                    {client._id}
                  </a>
                </Link>
              </td>
              <td className="rounded border px-4 py-2">{client.email}</td>
              <td className="rounded border px-4 py-2">{client.pid}</td>
              <td className="rounded border px-2 py-2  ">
                <Link href={`/clients/${client._id}/edit`}>
                  <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 lg:px-6 rounded">
                    Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clients;
