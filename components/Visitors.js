import Link from "next/link";

const Visitors = ({ visitors }) => {
  return (
    <div className=" overflow-x-auto shadow rounded-lg visitor my-6 border lg:p-4 bg-white ">
      <table className="table-auto w-full ">
        <thead>
          <tr>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
              Email
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100  ">
              Person ID
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border border-gray-200 bg-gray-100">
              Record ID
            </th>
            <th className="rounded px-4 py-4 text-gray-800 ticky top-0  border  border-gray-200 bg-gray-100">
              Option
            </th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor) => (
            <tr key={visitor._id} className="lg:text-center">
              <td className="rounded border px-4 py-2">
                <Link href={`/${visitor._id}`}>
                  <a className=" text-blue-700 hover:underline font-medium">
                    {visitor.email}
                  </a>
                </Link>
              </td>
              <td className="rounded border px-4 py-2">{visitor.pid}</td>
              <td className="rounded border px-4 py-2">{visitor.recordId}</td>
              <td className="rounded border px-2 py-2  ">
                <Link href={`/${visitor._id}/edit`}>
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

export default Visitors;
