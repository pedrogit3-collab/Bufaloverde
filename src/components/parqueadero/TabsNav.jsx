const tabs = [
  { value: "dashboard", label: "Panel" },
  { value: "entrada", label: "Registrar entrada" },
  { value: "salida", label: "Registrar salida y cobro" },
  { value: "reportes", label: "Historial y reportes" },
  { value: "admin", label: "Administracion", onlyAdmin: true },
];

export default function TabsNav({ activeTab, esAdmin, onChange }) {
  const visibles = tabs.filter((tab) => esAdmin || !tab.onlyAdmin);

  return (
    <nav className="tabs-nav" aria-label="Navegacion principal">
      {visibles.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={activeTab === tab.value ? "tab active" : "tab"}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
