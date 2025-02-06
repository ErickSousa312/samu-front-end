import { useState } from "react";
import DatePicker from "react-datepicker";

interface MetricsCardProps {
  title: string;
  value: number | string;
  change: {
    value: string;
    percentage?: string;
    isPositive: boolean;
  };
  chart?: React.ReactNode;
  cities: string[]; // Lista de cidades do banco de dados
  filters: {
    city: string;
    year: string;
    month: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const months = [
  { name: "Janeiro", value: "1" },
  { name: "Fevereiro", value: "2" },
  { name: "Março", value: "3" },
  { name: "Abril", value: "4" },
  { name: "Maio", value: "5" },
  { name: "Junho", value: "6" },
  { name: "Julho", value: "7" },
  { name: "Agosto", value: "8" },
  { name: "Setembro", value: "9" },
  { name: "Outubro", value: "10" },
  { name: "Novembro", value: "11" },
  { name: "Dezembro", value: "12" },
];

export const CardsDashboardsFilter = ({
  title,
  value,
  change,
  chart,
  cities,
  filters,
  onFilterChange,
}: MetricsCardProps) => {
  const [dropdownVisible, setDropdownVisible] = useState(false); // Controle de visibilidade do dropdown
  const [availableCities, setAvailableCities] = useState<string[]>(cities);
  const [selectedYear, setSelectedYear] = useState<Date | null>(null);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleChange = (key: string, value: string) => {
    onFilterChange(key, value);
  };

  function getYears(): number[] {
    const years = [];
    for (let year = 2012; year <= new Date().getFullYear(); year++) {
      years.push(year);
    }
    console.log(years);
    return years.reverse();
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-1 pt-2 w-64 h-14 items-center relative">
      <div className="flex flex-row h-10 items-center gap-2 justify-center">
        <h3 className="text-dm items-center ml-2 flex justify-center text-muted-foreground text-center">
          {title}
        </h3>

        {/* Botão que alterna a visibilidade do dropdown */}
        <button
          onClick={toggleDropdown}
          className="text-sm p-2 bg-blue-500 text-white rounded mr-1 w-4/5"
        >
          {dropdownVisible ? "Fechar" : "Abrir"}
        </button>

        {/* Dropdown que aparece ao clicar no botão */}
        {dropdownVisible && (
          <div
            className="absolute top-full left-0 w-full bg-white border rounded shadow-lg mt-2 z-10"
            style={{ zIndex: 1000 }}
          >
            <div className="p-3">
              {/* Filtro para cidade */}
              <div className="flex flex-col mb-2">
                <label className="text-sm">Cidade</label>
                <select
                  className="mt-1 p-2 border rounded-md text-sm"
                  value={filters.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                >
                  <option value="">Selecione a cidade</option>
                  {availableCities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-sm">Ano</label>
                <select
                  className="mt-1 p-2 border rounded-md text-sm max-h-60 overflow-y-auto"
                  value={filters.city}
                  onChange={(e) => handleChange("year", e.target.value)}
                >
                  <option value="">Selecione o ano</option>
                  {getYears().map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro para mês */}
              <div className="flex flex-col mb-2">
                <label className="text-sm">Mês</label>
                <select
                  className="mt-1 p-2 border rounded-md text-sm"
                  value={filters.month}
                  onChange={(e) => handleChange("month", e.target.value)}
                >
                  <option value="">Selecione o mês</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
