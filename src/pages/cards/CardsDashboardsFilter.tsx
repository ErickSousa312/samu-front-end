import { SlidersHorizontal } from "lucide-react";
import { RecordSetProps, RecordGetProps } from "@/@types/types";
interface Props {
  title: string;
  value?: string | number;
  change?: { value: string; percentage?: string; isPositive: boolean };
  cities: string[];
  recordSetProps: RecordSetProps;
  recordGetProps: RecordGetProps;
}
const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
export const CardsDashboardsFilter = ({
  cities,
  recordSetProps,
  recordGetProps,
}: Props) => {
  const years = Array.from(
    { length: new Date().getFullYear() - 2012 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );

  const hasActiveFilters =
    !!recordGetProps.city() || !!recordGetProps.year() || !!recordGetProps.month();

  const resetFilters = () => {
    recordSetProps.city("");
    recordSetProps.codCity("");
    recordSetProps.year("");
    recordSetProps.month("");
  };

  return (
    <section
      className="panel filter-panel"
      aria-label="Filtros dos indicadores"
    >
      <div className="filter-header">
        <h2 className="filter-title">
          <SlidersHorizontal size={17} aria-hidden="true" />
          Filtrar indicadores
        </h2>
        <button
          type="button"
          className="button button-secondary filter-reset"
          onClick={resetFilters}
          disabled={!hasActiveFilters}
        >
          Limpar filtros
        </button>
      </div>

      <div className="filter-grid">
        <div className="field">
          <label htmlFor="filter-city">Município</label>
          <select
            id="filter-city"
            className="input"
            value={recordGetProps.city()}
            onChange={(e) => {
              recordSetProps.city(e.target.value);
              recordSetProps.codCity("");
            }}
          >
            <option value="">Todos os municípios</option>
            {cities.map((city) => (
              <option value={city} key={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-year">Ano</label>
          <select
            id="filter-year"
            className="input"
            value={recordGetProps.year()}
            onChange={(e) => recordSetProps.year(e.target.value)}
          >
            <option value="">Todos os anos</option>
            {years.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="filter-month">Mês</label>
          <select
            id="filter-month"
            className="input"
            value={recordGetProps.month()}
            onChange={(e) => recordSetProps.month(e.target.value)}
          >
            <option value="">Todos os meses</option>
            {months.map((month, i) => (
              <option value={i + 1} key={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
