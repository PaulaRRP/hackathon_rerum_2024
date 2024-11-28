import {
  SearchSelect,
  SearchSelectItem,
  Switch,
  TextInput,
  Grid,
  NumberInput,
  DatePicker,
  Text,
} from "@tremor/react";
import clsx from "clsx";

interface Props {
  setSeriesValue: (value: string) => void;
  isSwitchDeleteColumnOn: boolean;
  dataTypeValue: string;
  setDataTypeValue: (value: string) => void;
  minValue: number | undefined;
  setMinValue: (value: number) => void;
  maxValue: number | undefined;
  setMaxValue: (value: number) => void;
  minDateValue: Date | undefined;
  setMinDateValue: (value: Date) => void;
  maxDateValue: Date | undefined;
  setMaxDateValue: (value: Date) => void;
  minTimeValue: string | undefined;
  setMinTimeValue: (value: string) => void;
  maxTimeValue: string | undefined;
  setMaxTimeValue: (value: string) => void;
  filterBoolean: boolean | undefined;
  setFilterBoolean: (value: boolean) => void;
  isSwitchOnAut: boolean;
  setIsSwitchAutOn: (value: boolean) => void;
  handleSwitchDeleteColumnChange: (value: boolean) => void;
}

export default function CamposEstruturaDados({
  setSeriesValue,
  isSwitchDeleteColumnOn,
  dataTypeValue,
  setDataTypeValue,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  minDateValue,
  setMinDateValue,
  maxDateValue,
  setMaxDateValue,
  minTimeValue,
  setMinTimeValue,
  maxTimeValue,
  setMaxTimeValue,
  filterBoolean,
  setFilterBoolean,
  isSwitchOnAut,
  setIsSwitchAutOn,
  handleSwitchDeleteColumnChange,
}: Props): JSX.Element {
  return (
    <div className="w-full">
      <SearchSelect
        placeholder="Selecione a Coluna"
        onValueChange={(value) => setSeriesValue(value)}
      >
        <SearchSelectItem value="1">Diferenciação</SearchSelectItem>
      </SearchSelect>
      <div className="flex items-center space-x-3 my-4">
        <Switch
          id="switch"
          name="switch"
          checked={isSwitchDeleteColumnOn}
          onChange={handleSwitchDeleteColumnChange}
        />
        <label htmlFor="switch" className="text-sm text-gray-500">
          Apagar Coluna
        </label>
      </div>

      <div className={clsx(isSwitchDeleteColumnOn ? "hidden" : "block")}>
        <TextInput className="my-4" placeholder="Nome da Coluna" />

        <SearchSelect
          placeholder="Tipo de Dado da Coluna"
          onValueChange={(value) => setDataTypeValue(value)}
        >
          <SearchSelectItem value="1">Inteiro</SearchSelectItem>
          <SearchSelectItem value="2">Real</SearchSelectItem>
          <SearchSelectItem value="3">Data</SearchSelectItem>
          <SearchSelectItem value="4">String</SearchSelectItem>
          <SearchSelectItem value="5">Hora</SearchSelectItem>
          <SearchSelectItem value="6">Booleano</SearchSelectItem>
        </SearchSelect>

        <div
          className={clsx(
            "mt-8",
            dataTypeValue === "1" || dataTypeValue === "2" ? "block" : "hidden"
          )}
        >
          <Text className="mt-4">Intervalo de Valores</Text>
          <Grid numItemsSm={1} numItemsLg={1} className="gap-4 mt-4">
            <NumberInput
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              placeholder="Maior que"
            />
            <NumberInput
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              placeholder="Menor que"
            />
          </Grid>
        </div>

        <div
          className={clsx(
            "mt-4 mb-4 space-y-4",
            dataTypeValue === "3" ? "block" : "hidden"
          )}
        >
          <DatePicker
            placeholder="Data Maior Que"
            className="mx-auto max-w-md"
            value={minDateValue}
            onValueChange={setMinDateValue}
          />
          <DatePicker
            placeholder="Data Menor Que"
            className="mx-auto max-w-md"
            value={maxDateValue}
            onValueChange={setMaxDateValue}
          />
        </div>

        <div
          className={clsx(
            "mt-4 mb-4 space-y-4",
            dataTypeValue === "5" ? "block" : "hidden"
          )}
        >
          <SearchSelect
            placeholder="Hora a partir de"
            onValueChange={(value) => setMinTimeValue(value)}
            value={minTimeValue}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0");
              return (
                <SearchSelectItem key={hour} value={hour}>
                  {`${hour}:00`}
                </SearchSelectItem>
              );
            })}
          </SearchSelect>

          <SearchSelect
            placeholder="Hora até"
            onValueChange={(value) => setMaxTimeValue(value)}
            value={maxTimeValue}
          >
            {Array.from({ length: 24 }, (_, i) => {
              const hour = i.toString().padStart(2, "0");
              return (
                <SearchSelectItem key={hour} value={hour}>
                  {`${hour}:00`}
                </SearchSelectItem>
              );
            })}
          </SearchSelect>
        </div>

        <div
          className={clsx(
            "mt-4 mb-4 space-y-4",
            dataTypeValue === "6" ? "block" : "hidden"
          )}
        >
          <SearchSelect
            placeholder="Definir valor"
            onValueChange={(value) => setFilterBoolean(Boolean(value))}
            value={filterBoolean ? "true" : "false"}
          >
            <SearchSelectItem value={"false"}>False</SearchSelectItem>
            <SearchSelectItem value={"true"}>True</SearchSelectItem>
          </SearchSelect>
        </div>

        <div className="flex items-center space-x-3 my-4">
          <Switch
            id="switch"
            name="switch"
            checked={isSwitchOnAut}
            onChange={setIsSwitchAutOn}
          />
          <label htmlFor="switch" className="text-sm text-gray-500">
            Definir conjunto de valores permitidos
          </label>
        </div>
        <TextInput
          className={clsx("mt-4", isSwitchOnAut ? "block" : "hidden")}
          placeholder="Valores separados por vírgula"
        />
      </div>
    </div>
  );
}
