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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import clsx from "clsx";

interface CsvJson {
  titulo: string;
  linhas: string[];
  colunas: string[];
  valores: string[][];
}

export default function DashboardPage(): JSX.Element {
  const [operationValue, setOperationValue] = useState<string>("");
  const [fileValue, setFileValue] = useState<CsvJson | null>(null);
  const [acceptedValues, setAcceptedValues] = useState<string>("");
  const [database, setDatabase] = useState<string>("");
  const [nomeColuna, setNomeColuna] = useState<string>("");
  const [tipoDado, setTipoDado] = useState<string>("");
  const [numeroMaiorQue, setNumeroMaiorQue] = useState<number | undefined>(
    undefined
  );
  const [numeroMenorQue, setNumeroMenorQue] = useState<number | undefined>(
    undefined
  );
  const [minimoCaracteres, setMinimoCaracteres] = useState<number | undefined>(
    undefined
  );
  const [maximoCaracteres, setMaximoCaracteres] = useState<number | undefined>(
    undefined
  );
  const [dataMaiorQue, setDataMaiorQue] = useState<Date | undefined>(undefined);
  const [dataMenorQue, setDataMenorQue] = useState<Date | undefined>(undefined);
  const [horaMaiorQue, setHoraMaiorQue] = useState<string>("");
  const [horaMenorQue, setHoraMenorQue] = useState<string>("");
  const [filtroBoleano, setFiltroBoleano] = useState<string>("");
  const [valoresAceitos, setValoresAceitos] = useState<string>("");
  const [tamanhoMinimo, setTamanhoMinimo] = useState<number | undefined>(
    undefined
  );
  const [tamanhoMaximo, setTamanhoMaximo] = useState<number | undefined>(
    undefined
  );
  const [intervaloMaiorQueIndirecao, setIntervaloMaiorQueIndirecao] = useState<
    number | undefined
  >(undefined);
  const [intervaloMenorQueIndirecao, setIntervaloMenorQueIndirecao] = useState<
    number | undefined
  >(undefined);
  const [dataMaiorQueIndirecao, setDataMaiorQueIndirecao] = useState<
    Date | undefined
  >(undefined);
  const [dataMenorQueIndirecao, setDataMenorQueIndirecao] = useState<
    Date | undefined
  >(undefined);
  const [horaMaiorQueIndirecao, setHoraMaiorQueIndirecao] =
    useState<string>("");
  const [horaMenorQueIndirecao, setHoraMenorQueIndirecao] =
    useState<string>("");
  const [filtroBoleanoIndirecao, setFiltroBoleanoIndirecao] =
    useState<string>("");
  const [valoresAceitosIndirecao, setValoresAceitosIndirecao] =
    useState<string>("");
  const [nomeColunaIndirecao, setNomeColunaIndirecao] = useState<string>("");

  useEffect(() => {
    // CHAMAR A ROTA PARA PEGAR AS SÉRIES UPADAS AQUI DENTRO
    fetch("/api/your-endpoint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(result => {
        console.log("Success:", result);
      })
      .catch(error => {
        console.error("Error:", error);
      });

  }, []);

  const handleOnSubmit = (): void => {
    // Lógica para gerar a tabela: Faz a requisição para o backend voltar todos os dados de uma tabela
    fetch("/api/your-endpoint", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
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
      })
      .catch(error => {
        console.error("Error:", error);
      });

      //Armazena os dados da tabela no estado aqui
  };

  const handleFilter = (): void => {
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

  const searchBD = (): void => {};

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-10 mx-auto max-w-7xl">
      <Title className="text-2xl mb-10 text-center">Módulo de Edição</Title>
      <Grid
        numItemsSm={2}
        numItemsLg={1}
        className="w-full gap-6 justify-center items-center"
      >
        <Card className="w-full flex flex-col items-center justify-center">
          <Divider>Banco de Dados</Divider>

          <div className="w-full">
            <SearchSelect
              placeholder="Selecione o Banco de Dados"
              onValueChange={setDatabase}
              value={database}
            >
              <SearchSelectItem value="1">Diferenciação</SearchSelectItem>
            </SearchSelect>

            <div className="w-full flex justify-end">
              <Button
                className="mt-8"
                size="xs"
                variant="primary"
                onClick={searchBD}
              >
                Selecionar banco de dados
              </Button>
            </div>

            <Divider>Filtros para busca</Divider>
            <Text className="mt-4">Nome da Coluna</Text>
            <SearchSelect
              placeholder="Nome da Coluna"
              onValueChange={setNomeColuna}
              value={nomeColuna}
              className="gap-4 mt-4"
            >
              <SearchSelectItem value="1">Nome da coluna 01</SearchSelectItem>
              <SearchSelectItem value="2">Nome da coluna 02</SearchSelectItem>
            </SearchSelect>

            <Text className="mt-4">Tipo de Dado</Text>
            <SearchSelect
              placeholder="Tipo de Dado"
              onValueChange={setTipoDado}
              value={tipoDado}
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
                <NumberInput
                  placeholder="Maior que"
                  value={numeroMaiorQue}
                  onValueChange={setNumeroMaiorQue}
                />
                <NumberInput
                  placeholder="Menor que"
                  value={numeroMenorQue}
                  onValueChange={setNumeroMenorQue}
                />
              </Grid>

              <Text className="mt-4 mb-4">Tamanho do campo</Text>
              <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                <NumberInput
                  placeholder="Quantidade mínima de caracteres"
                  value={minimoCaracteres}
                  onValueChange={setMinimoCaracteres}
                />
                <NumberInput
                  placeholder="Quantidade máxima de caracteres"
                  value={maximoCaracteres}
                  onValueChange={setMaximoCaracteres}
                />
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
                value={dataMaiorQue}
                onValueChange={setDataMaiorQue}
              />
              <DatePicker
                placeholder="Data Menor Que"
                className="mt-4"
                value={dataMenorQue}
                onValueChange={setDataMenorQue}
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
                onValueChange={setHoraMaiorQue}
                value={horaMaiorQue}
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
                onValueChange={setHoraMenorQue}
                value={horaMenorQue}
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
                operationValue === "6" ? "block" : "hidden"
              )}
            >
              <SearchSelect
                placeholder="Definir valor"
                onValueChange={setFiltroBoleano}
                value={filtroBoleano}
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
                value={valoresAceitos}
                onValueChange={setValoresAceitos}
              />
              <Text className="mt-4 mb-4">Tamanho do campo</Text>
              <Grid numItemsSm={1} numItemsLg={2} className="gap-4 mt-4">
                <NumberInput
                  placeholder="Quantidade mínima de caracteres"
                  value={tamanhoMinimo}
                  onValueChange={setTamanhoMinimo}
                />
                <NumberInput
                  placeholder="Quantidade máxima de caracteres"
                  value={tamanhoMaximo}
                  onValueChange={setTamanhoMaximo}
                />
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
                <NumberInput
                  placeholder="Maior que"
                  value={intervaloMaiorQueIndirecao}
                  onValueChange={setIntervaloMaiorQueIndirecao}
                />
                <NumberInput
                  placeholder="Menor que"
                  value={intervaloMenorQueIndirecao}
                  onValueChange={setIntervaloMenorQueIndirecao}
                />
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
                value={dataMaiorQueIndirecao}
                onValueChange={setDataMaiorQueIndirecao}
              />
              <DatePicker
                placeholder="Data Menor Que"
                className="mt-4"
                value={dataMenorQueIndirecao}
                onValueChange={setDataMenorQueIndirecao}
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
                onValueChange={setHoraMaiorQueIndirecao}
                value={horaMaiorQueIndirecao}
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
                onValueChange={setHoraMenorQueIndirecao}
                value={horaMenorQueIndirecao}
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
                onValueChange={setFiltroBoleanoIndirecao}
                value={filtroBoleanoIndirecao}
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
                value={valoresAceitosIndirecao}
                onValueChange={setValoresAceitosIndirecao}
              />
            </div>

            <Text className="mt-4">Nome da Coluna</Text>
            <SearchSelect
              placeholder="Selecione a Coluna da Indireção"
              onValueChange={setNomeColunaIndirecao}
              value={nomeColunaIndirecao}
              className="gap-4 mt-4"
            >
              <SearchSelectItem value="1">Nome da coluna 01</SearchSelectItem>
              <SearchSelectItem value="2">Nome da coluna 02</SearchSelectItem>
            </SearchSelect>

            <Text className="mt-4 mb-4">Valores aceitos</Text>
            <TextInput
              className="text-sm text-gray-500"
              placeholder="Valores separados por vírgula"
              value={acceptedValues}
              onValueChange={setAcceptedValues}
            />

            <Text className="mt-4 mb-4">
              Todas as linhas cujo valor da coluna atual atender ao intervalo
              definido, e cuja coluna de indireção possuir um dos valores
              definidos, serão buscados.
            </Text>
          </div>

          <div className="w-full flex justify-end">
            <Button
              className="mt-8"
              size="xs"
              variant="primary"
              onClick={handleFilter}
            >
              Realizar busca para edição
            </Button>
          </div>
        </Card>
          

      <Table>
        <TableHead>
          <TableRow>
            {/* COLOCAR NOMES DAS COLUNAS AQUI + UMA COLUNA PRA OPCOES */}
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Sales ($)</TableHeaderCell>
            <TableHeaderCell>Region</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell className="text-left">
              Working Hours (h)
            </TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* COLOCAR OS DADOS DAS COLUNAS NAS LINHAS ABAIXO */}
          {/* {data.map((item) => ( */}
            <TableRow key={`a`}>
              <TableCell className="text-left">item.name</TableCell>
              <TableCell className="text-left">item.sales</TableCell>
              <TableCell className="text-left">item.region</TableCell>
              <TableCell className="text-left">item.status</TableCell>
              <TableCell className="text-left">item.hours</TableCell>
            </TableRow>
          {/* ))} */}
        </TableBody>
      </Table>

      </Grid>
    </main>
  );
}
