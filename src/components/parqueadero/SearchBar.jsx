import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-box">
      <Search size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar por placa, tipo o conductor"
      />
    </label>
  );
}
