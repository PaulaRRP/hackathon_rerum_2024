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
  DatePicker,
  AccordionList,
  AccordionHeader,
  AccordionBody,
  Accordion,
  List,
  ListItem,
} from "@tremor/react";
import csvToJson from "convert-csv-to-json";
import clsx from "clsx";

// Interface para tipagem do JSON gerado a partir do CSV
interface CsvJson {
  titulo: string;
  linhas: string[]; // Linhas (ex.: anos ou identificadores)
  colunas: string[]; // Colunas do CSV
  valores: string[][]; // Valores em uma matriz bidimensional
}

export default function DashboardPage(): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [operationValue, setOperationValue] = useState<string>("");
  const [seriesValue, setSeriesValue] = useState<string>("");
  const [isSwitchOn, setIsSwitchOn] = useState<boolean>(false);
  const [isSwitchOnAut, setIsSwitchAutOn] = useState<boolean>(false);
  const [fileValue, setFileValue] = useState<CsvJson | null>(null);
  const [minValue, setMinValue] = useState<number | undefined>(undefined);
  const [maxValue, setMaxValue] = useState<number | undefined>(undefined);
  const [minDivValue, setMinDivValue] = useState<number | undefined>(undefined);
  const [maxDivValue, setMaxDivValue] = useState<number | undefined>(undefined);
  const [minTimeValue, setMinTimeValue] = useState<string | undefined>(
    undefined
  );
  const [maxTimeValue, setMaxTimeValue] = useState<string | undefined>(
    undefined
  );

  const handleSwitchChange = (value: boolean): void => {
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    // Lógica para gerar derivado
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
                onChange={handleOnChange}
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
                checked={isSwitchOn}
                onChange={handleSwitchChange}
              />
              <label htmlFor="switch" className="text-sm text-gray-500">
                Apagar Coluna
              </label>
            </div>

            <div className={clsx(isSwitchOn ? "hidden" : "block")}>
              <TextInput className="my-4" placeholder="Nome da Coluna" />

              <SearchSelect
                placeholder="Tipo de Dado da Coluna"
                onValueChange={(value) => setOperationValue(value)}
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
                  operationValue === "1" || operationValue === "2"
                    ? "block"
                    : "hidden"
                )}
              >
                <Text className="mt-4">Intervalo de Valores</Text>
                <Grid numItemsSm={1} numItemsLg={1} className="gap-4 mt-4">
                  <NumberInput placeholder="Maior que" />
                  <NumberInput placeholder="Menor que" />
                </Grid>
              </div>

              <div
                className={clsx(
                  "mt-4 mb-4 space-y-4",
                  operationValue === "3" ? "block" : "hidden"
                )}
              >
                <DatePicker
                  placeholder="Data Maior Que"
                  className="mx-auto max-w-md"
                />
                <DatePicker
                  placeholder="Data Menor Que"
                  className="mx-auto max-w-md"
                />
              </div>

              <div
                className={clsx(
                  "mt-4 mb-4 space-y-4",
                  operationValue === "5" ? "block" : "hidden"
                )}
              >
                <SearchSelect
                  placeholder="Hora a partir de"
                  onValueChange={(value) => console.log(value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0"); // Garantir que as horas tenham 2 dígitos
                    return (
                      <SearchSelectItem key={hour} value={hour}>
                        {`${hour}:00`}
                      </SearchSelectItem>
                    );
                  })}
                </SearchSelect>

                <SearchSelect
                  placeholder="Hora até"
                  onValueChange={(value) => console.log(value)}
                >
                  {Array.from({ length: 24 }, (_, i) => {
                    const hour = i.toString().padStart(2, "0"); // Garantir que as horas tenham 2 dígitos
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
                  operationValue === "6" ? "block" : "hidden"
                )}
              >
                <SearchSelect
                  placeholder="Definir valor"
                  onValueChange={(value) => console.log(value)}
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
                  onChange={handleSwitchAutChange}
                />
                <label htmlFor="switch" className="text-sm text-gray-500">
                  Definir conjunto de valores
                </label>
              </div>
              <TextInput
                className={clsx("mt-4", isSwitchOnAut ? "block" : "hidden")}
                placeholder="Valores separados por vírgula"
              />
            </div>

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
                  checked={isSwitchOnAut}
                  onChange={handleSwitchAutChange}
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
            <Title>Configurações Adicionadas</Title>
            <AccordionList>
              <Accordion>
                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Configuração Coluna 1
                </AccordionHeader>
                <AccordionBody className="leading-6">
                  <List>
                    <ListItem>
                      <span>Roger Federer</span>
                      <span>10,550</span>
                    </ListItem>
                    <ListItem>
                      <span>Rafel Nadal</span>
                      <span>9,205</span>
                    </ListItem>
                    <ListItem>
                      <span>Novak Djokovic</span>
                      <span>8,310</span>
                    </ListItem>
                    <ListItem>
                      <span>Andy Murray</span>
                      <span>7,030</span>
                    </ListItem>
                  </List>
                  <Button className="mt-8" size="xs" variant="primary">
                    Apagar Configuração
                  </Button>
                </AccordionBody>
              </Accordion>
              <Accordion>
                <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  Configuração Coluna 2
                </AccordionHeader>
                <AccordionBody className="leading-6">
                  <List>
                    <ListItem>
                      <span>Roger Federer</span>
                      <span>10,550</span>
                    </ListItem>
                    <ListItem>
                      <span>Rafel Nadal</span>
                      <span>9,205</span>
                    </ListItem>
                    <ListItem>
                      <span>Novak Djokovic</span>
                      <span>8,310</span>
                    </ListItem>
                    <ListItem>
                      <span>Andy Murray</span>
                      <span>7,030</span>
                    </ListItem>
                  </List>
                </AccordionBody>
              </Accordion>
            </AccordionList>
          </div>
          <Button
            className="mt-8 w-full"
            size="lg"
            variant="primary"
            onClick={handleDownloadCSV}
          >
            Confirmar e salvar
          </Button>
        </div>
      </Grid>
    </main>
  );
}
