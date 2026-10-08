"use client";
import { useState } from "react";
export function LocalDateTimeInput({name}:{name:string}) {
  const [iso,setIso]=useState("");
  return <><input type="datetime-local" required onChange={event=>{
    const date=new Date(event.target.value);setIso(Number.isFinite(date.getTime())?date.toISOString():"");
  }}/><input type="hidden" name={name} value={iso}/></>;
}
