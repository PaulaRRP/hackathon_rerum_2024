"use client";

import React, { useState } from "react";
import {
  Card,
  Divider,
  Text,
  TextInput,
  Button,
  NumberInput,
  Title,
  Grid,
  SearchSelect,
  SearchSelectItem,
  Switch,
  DatePicker,
} from "@tremor/react";
import Papa from "papaparse";
import ListaConfigDefinidas from "@/app/ui/d1/lista-config-definidas";
import CamposEstruturaDados from "@/app/ui/d1/campos-estrutura-dados";
import clsx from "clsx";
import { useRouter } from "next/router";

interface CsvJson {
  titulo: string;
  linhas: string[];
  colunas: string[];
  valores: string[][];
}

export const getKeys = (json: any) => {
  const keys = new Set<string>();
  const extractKeys = (obj: any) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        keys.add(key.trim());
        if (typeof obj[key] === "object" && obj[key] !== null) {
          extractKeys(obj[key]);
        }
      }
    }
  };
  if (Array.isArray(json)) {
    json.forEach((item) => extractKeys(item));
  } else {
    extractKeys(json);
  }

  return Array.from(keys);
};

interface Configuration {
  id: number;
  apagarBool: boolean;
  nome: string;
  tipoDado: string;
  intervaloMenor?: any;
  intervaloMaior?: any;
  intervaloValoresBool: boolean;
  valores: string[];
  editavelBool: boolean;
  indirecao?: {
    nomeColunaAfetada: string;
    intervaloMenor: any;
    intervaloMaior: any;
    valores: string[];
  };
}

const DashboardPage = (): JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [fileJson, setFileJson] = useState<any>(null);
  const [colunas, setColunas] = useState<string[]>([]);
  const [dataTypeValue, setDataTypeValue] = useState<string>("");
  const [seriesValue, setSeriesColumnValue] = useState<string>("");
  const [isSwitchDeleteColumnOn, setIsSwitchOn] = useState<boolean>(false);
  const [isSwitchOnAut, setIsSwitchAutOn] = useState<boolean>(false);
  const [fileValue, setFileValue] = useState<CsvJson | null>(null);
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [minDateValue, setMinDateValue] = useState<Date | undefined>(undefined);
  const [maxDateValue, setMaxDateValue] = useState<Date | undefined>(undefined);
  const [indirecaoColumnValue, setIndirecaoColumnValue] = useState<string>("");
  const [nomeColuna, setNomeColuna] = useState<string | undefined>(undefined);
  const [minTimeValue, setMinTimeValue] = useState<string | undefined>();
  const [maxTimeValue, setMaxTimeValue] = useState<string | undefined>();
  const [filterBoolean, setFilterBoolean] = useState<boolean | undefined>();
  const [canEditColumn, setCanEditColumn] = useState<boolean>(true);
  const [limiteCaracteres, setLimiteCaracteres] = useState<
    number | undefined
  >();
  const [minValueIndirecao, setMinValueIndirecao] = useState<
    number | undefined
  >();
  const [maxValueIndirecao, setMaxValueIndirecao] = useState<
    number | undefined
  >();
  const [minDateValueIndirecao, setMinDateValueIndirecao] = useState<
    Date | undefined
  >();
  const [maxDateValueIndirecao, setMaxDateValueIndirecao] = useState<
    Date | undefined
  >();
  const [minTimeValueIndirecao, setMinTimeValueIndirecao] = useState<
    string | undefined
  >();
  const [maxTimeValueIndirecao, setMaxTimeValueIndirecao] = useState<
    string | undefined
  >();
  const [filterBooleanIndirecao, setFilterBooleanIndirecao] = useState<
    boolean | undefined
  >();
  const [intervaloValores, setIntervaloValores] = useState<
    string | undefined
  >();
  const [intervaloValoresIndirecao, setIntervaloValoresIndirecao] =
    useState<string>("");
  const [tamanhoTabInicio, setTamanhoTabInicio] = useState<
    number | undefined
  >();
  const [tamanhoTabFinal, setTamanhoTabFinal] = useState<number | undefined>();
  const [nomeTabela, setNomeTabela] = useState<string>("");

  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  const handleSwitchDeleteColumnChange = (value: boolean): void => {
    setIsSwitchOn(value);
  };

  const handleSwitchAutChange = (value: boolean): void => {
    setIsSwitchAutOn(value);
  };

  const handleUpdateCSV = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFile(e.target.files?.[0] || null);
  };

  const handleOnSubmitFile = (e: React.FormEvent): void => {
    e.preventDefault();

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = function (event) {
        const csvOutput = event.target?.result as string;

        const json = Papa.parse(csvOutput, { header: true }).data;

        setFileJson(json);
        setFileValue(json);

        const keys = getKeys(json);
        setColunas(keys);
      };

      fileReader.readAsText(file);
    }
  };

  const handleOnSubmit = async (): Promise<void> => {
    console.log("Submit");

    const data = {
      nomeTabela: nomeTabela,
      tabelaCSV: fileJson,
      tamanhoTabInicio: tamanhoTabInicio,
      TamanhoTabFinal: tamanhoTabFinal,
      config: configurations,
    };

    fetch("/api/your-endpoint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(result => {
        console.log("Success:", result);
        // Recarregar a página após a requisição ser bem-sucedida
        window.location.reload();
      })
      .catch(error => {
        console.error("Error:", error);
      });
      
  };

  const handleAddConfiguration = (): void => {
    console.log("Add Configuration");

    let intervaloMenor;
    let intervaloMaior;
    let intervalorMenorIndirecao;
    let intervalorMaiorIndirecao;

    if (dataTypeValue === "1" || dataTypeValue === "2") {
      intervaloMaior = maxValue;
      intervaloMenor = minValue;
      intervalorMaiorIndirecao = maxValueIndirecao;
      intervalorMenorIndirecao = minValueIndirecao;
    }

    if (dataTypeValue === "3") {
      intervaloMaior = maxDateValue;
      intervaloMenor = minDateValue;
      intervalorMaiorIndirecao = maxDateValueIndirecao;
      intervalorMenorIndirecao = minDateValueIndirecao;
    }

    if (dataTypeValue === "5") {
      intervaloMaior = maxTimeValue;
      intervaloMenor = minTimeValue;
      intervalorMaiorIndirecao = maxTimeValueIndirecao;
      intervalorMenorIndirecao = minTimeValueIndirecao;
    }

    if (dataTypeValue === "6") {
      intervaloMaior = filterBoolean;
    }

    const config: Configuration = {
      id: configurations.length + 1,
      apagarBool: isSwitchDeleteColumnOn,
      nome: nomeColuna ?? seriesValue,
      tipoDado: dataTypeValue,
      intervaloMenor,
      intervaloMaior,
      intervaloValoresBool: isSwitchOnAut,
      valores: intervaloValores?.split(",") ?? [],
      editavelBool: canEditColumn,
      indirecao: {
        nomeColunaAfetada: indirecaoColumnValue,
        intervaloMenor: minValueIndirecao,
        intervaloMaior: maxValueIndirecao,
        valores: intervaloValoresIndirecao?.split(",") ?? [],
      },
    };

    setConfigurations((prev) => prev.concat(config));

    setIsSwitchOn(false);
    setNomeColuna("");
    setSeriesColumnValue("");
    setDataTypeValue("");
    setIsSwitchAutOn(false);
    setIntervaloValores(undefined);
    setCanEditColumn(true);
    setIndirecaoColumnValue("");
    setIntervaloValoresIndirecao("");
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="text-2xl mb-10 text-center">Módulo de Importação</Title>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card className="col-span-1">
          <Title>Importação do CSV</Title>
          <div className="align-center">
            <form>
              <input
                className="mt-4"
                type={"file"}
                id={"csvFileInput"}
                accept={".csv"}
                onChange={handleUpdateCSV}
              />
              <Button
                className="mt-4 bg-red-700 border-red-700 hover:bg-red-800"
                size="xs"
                variant="primary"
                onClick={handleOnSubmitFile}
              >
                Importar arquivo
              </Button>
            </form>
          </div>

          <div className={clsx(fileJson ? "block" : "hidden")}>
            <Divider>Nome da Tabela:</Divider>
            <TextInput
              className="my-4"
              placeholder="Nome da tabela"
              value={nomeTabela}
              onValueChange={setNomeTabela}
            />
            <Divider>Definição da Estrutura de Dados:</Divider>
            <CamposEstruturaDados
              json={fileJson}
              series={seriesValue}
              colunas={colunas}
              setSeriesValue={setSeriesColumnValue}
              isSwitchDeleteColumnOn={isSwitchDeleteColumnOn}
              dataTypeValue={dataTypeValue}
              setDataTypeValue={setDataTypeValue}
              minValue={minValue}
              setMinValue={setMinValue}
              maxValue={maxValue}
              setMaxValue={setMaxValue}
              minDateValue={minDateValue}
              setMinDateValue={setMinDateValue}
              maxDateValue={maxDateValue}
              setMaxDateValue={setMaxDateValue}
              minTimeValue={minTimeValue}
              setMinTimeValue={setMinTimeValue}
              maxTimeValue={maxTimeValue}
              setMaxTimeValue={setMaxTimeValue}
              filterBoolean={filterBoolean}
              setFilterBoolean={setFilterBoolean}
              isSwitchOnAut={isSwitchOnAut}
              setIsSwitchAutOn={setIsSwitchAutOn}
              handleSwitchDeleteColumnChange={handleSwitchDeleteColumnChange}
              limiteCaracteres={limiteCaracteres}
              setLimiteCaracteres={setLimiteCaracteres}
              nomeColuna={nomeColuna}
              setNomeColuna={setNomeColuna}
              intervaloValores={intervaloValores}
              setIntervaloValores={setIntervaloValores}
            />

            <div className={clsx(isSwitchDeleteColumnOn ? "hidden" : "block")}>
              <Divider>Indireção (opcional)</Divider>
              <div>
                <div className="mb-4 mt-4">
                  <div
                    className={clsx(
                      "mt-8",
                      dataTypeValue === "1" || dataTypeValue === "2"
                        ? "block"
                        : "hidden"
                    )}
                  >
                    <Text className="mt-4">Intervalo de Valores</Text>
                    <Grid numItemsSm={1} numItemsLg={1} className="gap-4 mt-4">
                      <NumberInput
                        value={minValueIndirecao}
                        onValueChange={setMinValueIndirecao}
                        placeholder="Maior que"
                      />
                      <NumberInput
                        value={maxValueIndirecao}
                        onValueChange={setMaxValueIndirecao}
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
                      value={minDateValueIndirecao}
                      onValueChange={setMinDateValueIndirecao}
                    />
                    <DatePicker
                      placeholder="Data Menor Que"
                      className="mx-auto max-w-md"
                      value={maxDateValueIndirecao}
                      onValueChange={setMaxDateValueIndirecao}
                    />
                  </div>

                  <div
                    className={clsx(
                      "mt-4 mb-4 space-y-4",
                      dataTypeValue === "4" ? "block" : "hidden"
                    )}
                  >
                    <TextInput
                      className="my-4"
                      placeholder={`Valor de ${seriesValue}`}
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
                      onValueChange={(value) => setMinTimeValueIndirecao(value)}
                      value={minTimeValueIndirecao}
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
                      onValueChange={(value) => setMaxTimeValueIndirecao(value)}
                      value={maxTimeValueIndirecao}
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
                      onValueChange={(value) =>
                        setFilterBooleanIndirecao(Boolean(value))
                      }
                      value={filterBooleanIndirecao ? "true" : "false"}
                    >
                      <SearchSelectItem value={"false"}>False</SearchSelectItem>
                      <SearchSelectItem value={"true"}>True</SearchSelectItem>
                    </SearchSelect>
                  </div>
                </div>

                <SearchSelect
                  placeholder="Selecione a Coluna da Indireção"
                  onValueChange={(value) => setIndirecaoColumnValue(value)}
                  value={indirecaoColumnValue}
                >
                  {colunas.map((coluna, i) => (
                    <SearchSelectItem
                      key={`colunaindirecao-${i}`}
                      value={coluna}
                    >
                      {coluna}
                    </SearchSelectItem>
                  ))}
                </SearchSelect>
                <TextInput
                  className="my-4"
                  placeholder="Valores de indireção separados por vírgula"
                  value={intervaloValoresIndirecao}
                  onValueChange={setIntervaloValoresIndirecao}
                />
                <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                  Todas as linhas cujo valor da coluna atual (definida no passo
                  da definição da Estrutura de Dados) atender ao intervalo
                  definido, e cuja coluna de indireção possuir um dos valores
                  definidos, serão salvos. As demais que não atenderem não serão
                  salvas na tabela.
                </p>
              </div>

              <Divider>Máscaras de Edição:</Divider>
              <div className="flex items-center space-x-3 my-4">
                <Switch
                  id="switch"
                  name="switch"
                  checked={canEditColumn}
                  onChange={setCanEditColumn}
                />
                <label htmlFor="switch" className="text-sm text-gray-500">
                  Coluna é editável
                </label>
              </div>
            </div>

            <Button
              className="mt-8"
              size="xs"
              variant="primary"
              onClick={handleAddConfiguration}
            >
              Adicionar configuração
            </Button>
          </div>
        </Card>

        <div className="col-span-2">
          <Card className="w-full">
            <Divider>Definir Tamanho da Tabela</Divider>

            <div className="mt-8">
              <Text className="mt-4">Intervalo de linhas aceitas</Text>
              <Grid numItemsSm={1} numItemsLg={1} className="gap-4 mt-4">
                <NumberInput
                  placeholder="A partir da linha"
                  value={tamanhoTabInicio}
                  onValueChange={setTamanhoTabInicio}
                />
                <NumberInput
                  placeholder="Até a linha"
                  value={tamanhoTabFinal}
                  onValueChange={setTamanhoTabFinal}
                />
              </Grid>
            </div>
          </Card>

          <div className="my-4 space-y-4">
            <ListaConfigDefinidas
              configs={configurations}
              onChange={setConfigurations}
            />
          </div>
          <Button
            className="mt-8 w-full"
            size="lg"
            variant="primary"
            onClick={() => {
              void handleOnSubmit();
            }}
          >
            Confirmar e salvar
          </Button>
        </div>
      </Grid>
    </main>
  );
}


export default DashboardPage;