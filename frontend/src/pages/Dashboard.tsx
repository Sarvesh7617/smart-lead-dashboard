import { useEffect, useState } from "react";
import type { Lead } from "../Types/lead";
import axiosInstance from "../helper/axiosHelper";
import type { AxiosError, AxiosResponse } from "axios";
import type { apiResponse } from "../Types/ApiResponse";
import Filters from "../component/Filters";
import LeadTable from "../component/LeadTable";
import Navbar from "../component/Navbar";
import CreateLeadModal from "../component/CreateLeadModal";
import { useAuth } from "../context/AuthContext";



// Pagination interface
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalpages: number;
}

// Response data interface
interface LeadsProps {
  leads: Lead[];
  pagination: Pagination;
}




const Dashboard=()=> {

  const [leads, setLeads] = useState<Lead[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [source, setSource] = useState("");

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [openModal, setOpenModal] = useState(false);

  const {user}=useAuth();


  const fetchLeads = async (
    page:number,
    search:string,
    status:string,
    source:string
  ) => {

    try {
      setLoading(true);

        const query = new URLSearchParams({
            page: String(page),
            search,
            status,
            source,
        });

      const res:AxiosResponse<apiResponse<LeadsProps>> = await axiosInstance.get(`/leads?${query}`);

      setLeads(res.data.data.leads);

      setTotalPages(res.data.data.pagination.totalpages);

    } 
    catch (error) {
        const axiosError=error as AxiosError<apiResponse<null>>
        console.log(axiosError.response?.data.message);
    } 
    finally {
      setLoading(false);
    }
  };


  const handleExportCSV = async () => {

    try {

      const response =await axiosInstance.get("/leads/export/csv",{responseType: "blob",});

      const url =window.URL.createObjectURL(new Blob([response.data]));

      const link =document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "leads.csv"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

    } 
    catch (error) {

      const axiosError=error as AxiosError<apiResponse<null>>
      console.log(axiosError.response?.data.message);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source]);


  useEffect(() => {
    if (user)
      fetchLeads(page, debouncedSearch, status, source);
  }, [page, debouncedSearch, status, source, user]);


  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  }, [search]);


  return (

    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Leads Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track your leads
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={handleExportCSV}
              className="bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Export CSV
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg shadow-sm"
              >
                Add Lead
              </button>
            )}

          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          <Filters
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            source={source}
            setSource={setSource}
          />

          <div className="mt-6">

            {loading ? (
              <p className="text-center text-gray-500">
                Loading...
              </p>
            ) : leads.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl font-semibold text-gray-600">
                  No leads found
                </p>

                <p className="text-gray-400 mt-2">
                  Try changing filters or add new leads
                </p>
              </div>
            ) : (
              <LeadTable leads={leads} role={user?.role} />
            )}

          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-8">

            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>

            <span className="font-medium text-gray-700">
              {page} / {totalPages}
            </span>

            <button
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>

          </div>
        </div>
        {openModal && ( 
          <CreateLeadModal 
            closeModal={() => setOpenModal(false)} 
            refreshLeads={() => fetchLeads( page, debouncedSearch, status, source ) } 
          /> 
        )}
      </div>
    </div>
  );
}




export default Dashboard;