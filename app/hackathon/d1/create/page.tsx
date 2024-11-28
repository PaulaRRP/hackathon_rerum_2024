"use client";
import React, { useState, useEffect } from "react";
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
} from "@tremor/react";
import csvToJson from "convert-csv-to-json";
import ListaConfigDefinidas from "@/app/ui/d1/lista-config-definidas";
import CamposEstruturaDados from "@/app/ui/d1/campos-estrutura-dados";
import clsx from "clsx";

interface CsvJson {
  titulo: string;
  linhas: string[];
  colunas: string[];
  valores: string[][];
}

export default function DashboardPage(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [dataTypeValue, setDataTypeValue] = useState<string>("");
  const [seriesValue, setSeriesValue] = useState<string>("");
  const [isSwitchDeleteColumnOn, setIsSwitchOn] = useState<boolean>(false);
  const [isSwitchOnAut, setIsSwitchAutOn] = useState<boolean>(false);
  const [fileValue, setFileValue] = useState<CsvJson | null>(null);
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [minDateValue, setMinDateValue] = useState<Date | undefined>(undefined);
  const [maxDateValue, setMaxDateValue] = useState<Date | undefined>(undefined);
  const [minTimeValue, setMinTimeValue] = useState<string | undefined>(
    undefined
  );
  const [maxTimeValue, setMaxTimeValue] = useState<string | undefined>(
    undefined
  );
  const [filterBoolean, setFilterBoolean] = useState<boolean | undefined>(
    undefined
  );
  const [canEditColumn, setCanEditColumn] = useState<boolean | undefined>(true);

  const handleSwitchDeleteColumnChange = (value: boolean): void => {
    setIsSwitchOn(value);
  };

  const handleSwitchAutChange = (value: boolean): void => {
    setIsSwitchAutOn(value);
  };

  useEffect(() => {
    // CHAMAR A ROTA PARA PEGAR AS SÉRIES UPADAS AQUI DENTRO
  }, []);

  const csvJSON = (csv: string, titulo: string): CsvJson => {
    const lines = csv.split("\n");
    let result: CsvJson = {
      titulo,
      linhas: [],
      colunas: [],
      valores: [],
    };
    const headers = lines[0].split('"');
    result.colunas = headers.filter((header) => header.length > 3);

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;

      const currentline = lines[i].split(",");

      for (let j = 0; j < headers.length; j++) {
        if (!currentline[j]) continue;

        const valor = currentline[j].replace(/[\s\r]/g, "");
        if (j === 0) {
          result.linhas.push(valor.split(",")[0]);
        } else {
          result.valores.push(valor.split(","));
        }
      }
    }

    return result;
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
        const json = csvJSON(csvOutput, file.name);
        setFileValue(json);
      };

      fileReader.readAsText(file);
    }
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    console.log("Submit");
  };

  const handleDownloadCSV = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!fileValue) return;

    const linhas: string[][] = [];
    fileValue.valores.forEach((arrayValor, index) => {
      const ano = fileValue.linhas[index];
      linhas.push([ano, ...arrayValor]);
    });

    const strColunas = fileValue.colunas
      .map((coluna) => `"${coluna}"`)
      .join(",");
    const strLinhas = linhas.map((linha) => `"${linha.join('","')}"`);

    const csvContent = `data:text/csv;charset=utf-8," ",${strColunas},\r,${strLinhas.join(
      ",\r,"
    )}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "derivado.csv");

    document.body.appendChild(link);
    link.click();
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
                disabled
                onClick={handleOnSubmitFile}
              >
                Importar arquivo
              </Button>
            </form>
          </div>

          <Divider>Definição da Estrutura de Dados:</Divider>
          <CamposEstruturaDados
            setSeriesValue={setSeriesValue}
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
          />

          <div className={clsx(isSwitchDeleteColumnOn ? "hidden" : "block")}>
            {/* @TODO: TEM QUE ARRUMAR ISSO AQUI */}
            <Divider>Filtrar Valores</Divider>

            <div>
              <TextInput className="my-4" placeholder="Valor Coluna Estado" />
              <SearchSelect
                placeholder="Selecione a Coluna Indireção"
                onValueChange={(value) => setSeriesValue(value)}
              >
                <SearchSelectItem value="1">Cidade (dinâmico)</SearchSelectItem>
              </SearchSelect>
              <TextInput
                className="my-4"
                placeholder="Valor Coluna de Cidade"
              />
              <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Todas as linhas que possuem valor a ser filtrado na coluna{" "}
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
            onClick={handleDownloadCSV}
          >
            Adicionar configuração
          </Button>
        </Card>

        <div className="col-span-2">
          <Card className="w-full">
            <Divider>Definir Tamanho da Tabela</Divider>

            <div className="mt-8">
              <Text className="mt-4">Intervalo de linhas aceitas</Text>
              <Grid numItemsSm={1} numItemsLg={1} className="gap-4 mt-4">
                <NumberInput placeholder="A partir da linha" />
                <NumberInput placeholder="Até a linha" />
              </Grid>
            </div>
          </Card>

          <div className="my-4 space-y-4">
            <ListaConfigDefinidas />
          </div>
          <Button
            className="mt-8 w-full"
            size="lg"
            variant="primary"
            onClick={handleOnSubmit}
          >
            Confirmar e salvar
          </Button>
        </div>
      </Grid>
    </main>
  );
}
