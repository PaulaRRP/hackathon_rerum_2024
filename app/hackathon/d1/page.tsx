import React from "react";
import {
  Button,
} from "@tremor/react";
import Link from "next/link";

export default function Page() {
  return (
  <div className="flex flex-col">
    <Link href="/hackathon/d1/create/"><Button className="w-full mb-10" size="xl">Fazer upload de novo CSV</Button></Link>
    <Link href="/hackathon/d1/edit/"><Button className="w-full" size="xl">Editar um Banco de Dados</Button></Link>
  </div>
  );
}