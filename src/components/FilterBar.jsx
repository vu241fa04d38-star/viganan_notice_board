import FilterChip from "./FilterChip.jsx";
import { CATEGORIES, PRIORITIES } from "../data/notices.js";

function ChipRow({ label, options, value, onChange }) {
  return (
    <div className="row">
      <span className="row__label">{label}</span>
      <div className="chips">
        {["All", ...options].map((o) => (
          <FilterChip key={o} label={o} active={value === o} onClick={() => onChange(o)} />
        ))}
      </div>
    </div>
  );
}

export default function FilterBar({ filters, setFilters, onClear, onMarkAll }) {
  const set = (key) => (value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <section className="panel" aria-label="Filters">
      <div className="row">
        <input
          type="search"
          placeholder="Search notices"
          value={filters.query}
          onChange={(e) => set("query")(e.target.value)}
          aria-label="Search notices"
        />
        <select value={filters.sortBy} onChange={(e) => set("sortBy")(e.target.value)} aria-label="Sort notices">
          <option value="priority">Sort by priority</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <button
          type="button"
          className={`btn${filters.importantOnly ? " btn--primary" : ""}`}
          aria-pressed={filters.importantOnly}
          onClick={() => set("importantOnly")(!filters.importantOnly)}
        >
          ⭐ Important only
        </button>
      </div>

      <ChipRow label="Category" options={CATEGORIES} value={filters.category} onChange={set("category")} />
      <ChipRow label="Priority" options={PRIORITIES} value={filters.priority} onChange={set("priority")} />

      <div className="row">
        <span className="row__label">Status</span>
        <div className="chips">
          {["All", "Unread", "Read"].map((o) => (
            <FilterChip key={o} label={o} active={filters.status === o} onClick={() => set("status")(o)} />
          ))}
        </div>
        <div className="row__actions">
          <button type="button" className="btn btn--sm" onClick={onClear}>Clear filters</button>
          <button type="button" className="btn btn--sm btn--primary" onClick={onMarkAll}>Mark all as read</button>
        </div>
      </div>
    </section>
  );
}
