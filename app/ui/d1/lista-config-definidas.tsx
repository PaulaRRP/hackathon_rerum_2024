import {
  Title,
  AccordionList,
  Accordion,
  AccordionHeader,
  AccordionBody,
  List,
  ListItem,
  Button,
  Text,
} from "@tremor/react";

interface Props {
  configs: Configuration[];
  onChange: (config: Configuration) => void;
}

interface Configuration {
  apagarBool: boolean;
  nome: string;
  tipoDado: string;
  intervaloMenor?: any;
  intervaloMaior?: any;
  intervaloValoresBool: boolean;
  valores: string[];
  editavelBool: boolean;
  indirecao: {
    nomeColunaAfetada: string;
    intervaloMenor: any;
    intervaloMaior: any;
    valores: string[];
  };
}

export default function ListaConfigDefinidas({ configs, onChange }: Props) {
  return (
    <>
      <Title>Configurações Adicionadas</Title>
      <Text className={configs.length > 0 ? "hidden" : "block"}>Nenhuma Configuração adicionada</Text>
      <AccordionList>
        {configs.map((config, index) => (
          <Accordion key={`configs-${index}`}>
            <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
              Configuração {config.nome}
            </AccordionHeader>
            <AccordionBody className="leading-6">
              <List>
                <ListItem className={config.apagarBool ? "block" : "hidden"}>
                  <span>Apagar Coluna</span>
                </ListItem>
                <ListItem className={config.apagarBool || !config.tipoDado ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Tipo de Dado</span>
                  <span>{config.tipoDado}</span>
                </ListItem>
                <ListItem className={config.apagarBool || !(config.intervaloMenor && config.intervaloMaior) ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Intervalo de Valores</span>
                  <span>{config.intervaloMenor ? `Maior que ${config.intervaloMenor}` : ""} - {config.intervaloMaior ? `Maior que ${config.intervaloMaior}` : ""}</span>
                </ListItem>
                <ListItem className={config.apagarBool || config.valores.length <= 0 ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Valores Aceitos</span>
                  <span>{config.valores.join(",")}</span>
                </ListItem>
                <ListItem className={config.apagarBool ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Coluna é Editável?</span>
                  <span>{config.editavelBool ? "Sim" : "Não"}</span>
                </ListItem>
                <ListItem className={config.apagarBool || !config.indirecao?.nomeColunaAfetada ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Indireção: Nome da Coluna Utilizada</span>
                  <span>{config.indirecao?.nomeColunaAfetada}</span>
                </ListItem>
                <ListItem className={config.apagarBool || !(config.indirecao?.intervaloMenor && config.indirecao.intervaloMaior) ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Indireção: Intervalo de Valores</span>
                  <span>{config.indirecao?.intervaloMenor ? `Maior que ${config.indirecao.intervaloMenor}` : ""} - {config.indirecao?.intervaloMaior ? `Maior que ${config.indirecao.intervaloMaior}` : ""}</span>
                </ListItem>
                <ListItem className={config.apagarBool || config.indirecao.valores.length <= 0 ? "hidden" : "block flex flex-row w-full justify-between"}>
                  <span>Indireção: Valores Aceitos</span>
                  <span>{config.indirecao?.valores.join(",")}</span>
                </ListItem>
              </List>
              <Button className="mt-8" size="xs" variant="primary" onClick={() => onChange((prevConfigurations) => prevConfigurations.filter(configuracao => configuracao.id !== config.id))}>
                Apagar Configuração
              </Button>
            </AccordionBody>
          </Accordion>
        ))}
      </AccordionList>
    </>
  );
}
