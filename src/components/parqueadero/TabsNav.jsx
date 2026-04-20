const tabs = [
  { value: "dashboard", label: "Panel" },
  { value: "entrada", label: "Registrar entrada" },
  { value: "salida", label: "Registrar salida y cobro" },
];

export default function TabsNav({ activeTab, onChange }) {
  return (
    <nav className="tabs-nav" aria-label="Navegación principal">
      {tabs.map((tab) => (
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
