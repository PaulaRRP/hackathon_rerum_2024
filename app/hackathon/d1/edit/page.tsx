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
  DatePicker,
} from "@tremor/react";
import clsx from "clsx";


interface CsvJson {
  titulo: string;
  linhas: string[]; 
  colunas: string[]; 
  valores: string[][]; 
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

  const searchBD = (e: React.MouseEvent<HTMLButtonElement>): void => {

  };

  const [isSearchClicked, setIsSearchClicked] = useState(false);


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="text-2xl mb-10 text-center">Módulo de Edição</Title>
      <Grid numItemsSm={2} numItemsLg={1} className="w-full gap-6 justify-center items-center">
        <Card className="w-full flex flex-col items-center justify-center">
          <Divider>Banco de Dados</Divider>
  
          <div className="w-full">
            <SearchSelect
              placeholder="Selecione o Banco de Dados"
              onValueChange={(value) => setSeriesValue(value)}
            >
              <SearchSelectItem value="1">Diferenciação</SearchSelectItem>
            </SearchSelect>

            <div className="w-full flex justify-end">
              <Button
                className="mt-8"
                size="xs"
                variant="primary"
                onClick={() => {
                  setIsSearchClicked(true); 
                  searchBD; 
                }}
              >
                Selecionar banco de dados
              </Button>
            </div>
  
            <Divider>Filtros para busca</Divider>
            <Text className="mt-4" >Nome da Coluna</Text>
            <SearchSelect 
                    placeholder="Nome da Coluna"
                    onValueChange={(value) => setOperationValue(value)}
                    className="gap-4 mt-4"
                  >
                    <SearchSelectItem value="1">Nome da coluna 01</SearchSelectItem>
                    <SearchSelectItem value="2">Nome da coluna 02</SearchSelectItem>
                  </SearchSelect>

            <Text className="mt-4" >Tipo de Dado</Text>
            <SearchSelect
                placeholder="Tipo de Dado"
                onValueChange={(value) => setOperationValue(value)}
                className="gap-4 mt-4"
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
                <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                  <NumberInput placeholder="Maior que" />
                  <NumberInput placeholder="Menor que" />
                </Grid>

                <Text className="mt-4 mb-4">Tamanho do campo</Text>
                <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                  <NumberInput placeholder="Quantidade mínima de caracteres " />
                  <NumberInput placeholder="Quantidade máxima de caracteres" />
                </Grid>
            </div>

            <div
                className={clsx(
                  "mt-4 mb-4 space-y-4 flex flex-row gap-x-4",
                  operationValue === "3" ? "block" : "hidden"
                )}
              >
                <DatePicker
                  placeholder="Data Maior Que"
                  className="mt-4"
                />
                <DatePicker
                  placeholder="Data Menor Que"
                  className="mt-4 "
                />
            </div>

            <div
                className={clsx(
                  "mt-4 mb-4  flex flex-row gap-x-4",
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

            <div
              className={clsx(
                "mt-4 mb-4",
                operationValue === "4" ? "block" : "hidden"
              )}
            >
              <Text className="mt-4 mb-4">Valores aceitos</Text>
               <TextInput
                className="text-sm text-gray-500"
                placeholder="Valores separados por vírgula"
              />
              <Text className="mt-4 mb-4">Tamanho do campo</Text>
                <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                  <NumberInput placeholder="Quantidade mínima de caracteres " />
                  <NumberInput placeholder="Quantidade máxima de caracteres" />
                </Grid>
            </div>

            <Divider>Indireção</Divider>

            <div
                className={clsx(
                  "mt-8",
                  operationValue === "1" || operationValue === "2"
                    ? "block"
                    : "hidden"
                )}
            >
              <Text className="mt-4">Intervalo de Valores</Text>
                <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                  <NumberInput placeholder="Maior que" />
                  <NumberInput placeholder="Menor que" />
                </Grid>
            </div>

            <div
                className={clsx(
                  "mt-4 mb-4 space-y-4 flex flex-row gap-x-4",
                  operationValue === "3" ? "block" : "hidden"
                )}
              >
                <DatePicker
                  placeholder="Data Maior Que"
                  className="mt-4"
                />
                <DatePicker
                  placeholder="Data Menor Que"
                  className="mt-4 "
                />
            </div>

            <div
                className={clsx(
                  "mt-4 mb-4  flex flex-row gap-x-4",
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

            <div
              className={clsx(
                "mt-4 mb-4",
                operationValue === "4" ? "block" : "hidden"
              )}
            >
              <Text className="mt-4 mb-4">Valores aceitos</Text>
               <TextInput
                className="text-sm text-gray-500"
                placeholder="Valores separados por vírgula"
              />
            </div>

            <Text className="mt-4" >Nome da Coluna</Text>
            <SearchSelect 
                    placeholder="Selecione a Coluna da Indireção"
                    onValueChange={(value) => setOperationValue(value)}
                    className="gap-4 mt-4"
                  >
                    <SearchSelectItem value="1">Nome da coluna 01</SearchSelectItem>
                    <SearchSelectItem value="2">Nome da coluna 02</SearchSelectItem>
            </SearchSelect>

            <Text className="mt-4 mb-4">Valores aceitos</Text>
               <TextInput
                className="text-sm text-gray-500"
                placeholder="Valores separados por vírgula"
              />

            <Text className="mt-4 mb-4">Todas as linhas cujo valor da coluna atual atender ao intervalo definido, e cuja coluna de indireção possuir um dos valores definidos, serão buscados.</Text>

          </div>

          <div className="w-full flex justify-end">
              <Button
                className="mt-8"
                size="xs"
                variant="primary"
                onClick={handleDownloadCSV}
              >
                Realizar busca para edição
              </Button>
            </div>
        </Card>
      </Grid>
    </main>
  );
}