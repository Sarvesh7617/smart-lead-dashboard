import type { Lead } from "../Types/lead";

interface Props {
  leads: Lead[]
  role?: "admin" | "sales";
}

const LeadTable=({ leads,role }: Props)=> {

  return (
    <div className="overflow-x-auto bg-white rounded shadow">

      <table className="w-full border-collapse">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">Created</th>
            {role === "admin" && (
              <th className="p-3 text-left">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id} className="border-t">

              <td className="p-3">{lead.name}</td>

              <td className="p-3">{lead.email}</td>

              <td className="p-3">{lead.status}</td>

              <td className="p-3">{lead.source}</td>

              <td className="p-3">
                {new Date(lead.createdAt).toLocaleDateString()}
              </td>

              {role === "admin" && (

                <td className="p-3 flex gap-2">

                  <button
                    className="bg-yellow-400 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>

              )}

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}



export default LeadTable;