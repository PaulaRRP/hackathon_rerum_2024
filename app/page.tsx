import React from "react";
import {
  Button,
} from "@tremor/react";
import Link from "next/link";

export default function Page() {
  return (
  <div className="flex flex-col">
    <Link href="/hackathon/d1/"><Button className="w-full mb-10" size="xl">Desafio 1</Button></Link>
    <Link href="/hackathon/d2/"><Button className="w-full" size="xl">Desafio 2</Button></Link>
  </div>
  );
}