import { useState } from "react";
import axiosInstance from "../helper/axiosHelper";
import type { AxiosError } from "axios";
import type { apiResponse } from "../Types/ApiResponse";

interface Props {
  closeModal: () => void;
  refreshLeads: () => void;
}

const CreateLeadModal = ({closeModal,refreshLeads,}: Props) => {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("New");

  const [source, setSource] = useState("Website");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    try {

      setLoading(true);

      setError("");

      await axiosInstance.post("/leads", {
        name,
        email,
        status,
        source,
      });

      refreshLeads();

      closeModal();

    } 
    catch (error) {

      const axiosError =error as AxiosError<apiResponse<null>>;

      setError(axiosError.response?.data.message || "Failed to create lead");
    } 
    finally {

      setLoading(false);
    }
  };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white p-6 rounded-lg w-[400px]">

        <h2 className="text-2xl font-bold mb-4">
          Create Lead
        </h2>

        {error && (
          <p className="text-red-500 mb-3">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >

          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <select
            className="w-full border p-2 rounded"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>

          <select
            className="w-full border p-2 rounded"
            value={source}
            onChange={(e) =>
              setSource(e.target.value)
            }
          >
            <option>Website</option>
            <option>Instagram</option>
            <option>Referral</option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {loading
                ? "Creating..."
                : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateLeadModal;