interface FiltersProps {
  search: string;
  setSearch: (value: string) => void;

  status: string;
  setStatus: (value: string) => void;

  source: string;
  setSource: (value: string) => void;
}

const Filters=({
  search,
  setSearch,
  status,
  setStatus,
  source,
  setSource,
}: FiltersProps)=> {

  return (
    <div className="flex gap-3 mb-4 flex-wrap">

      <input
        type="text"
        placeholder="Search name/email"
        className="border p-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2 rounded"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select
        className="border p-2 rounded"
        value={source}
        onChange={(e) => setSource(e.target.value)}
      >
        <option value="">All Source</option>
        <option value="Website">Website</option>
        <option value="Instagram">Instagram</option>
        <option value="Referral">Referral</option>
      </select>

    </div>
  );
}



export default Filters;