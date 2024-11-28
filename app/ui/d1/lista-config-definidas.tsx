import {
  Title,
  AccordionList,
  Accordion,
  AccordionHeader,
  AccordionBody,
  List,
  ListItem,
  Button
} from "@tremor/react";

export default function ListaConfigDefinidas() {
  return (
    <>
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
    </>
  );
}
