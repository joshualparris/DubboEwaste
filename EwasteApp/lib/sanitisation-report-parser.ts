export type ParsedEraseReport={format:"NWIPE_LOG"|"CSV"|"OTHER_TEXT";observed_serial:string;observed_result:"PASSED"|"FAILED"|"UNKNOWN";match_status:"MATCH"|"MISMATCH"|"UNKNOWN";note:string};

const norm=(value:string)=>value.toUpperCase().replace(/[^A-Z0-9]/g,"");

export function parseEraseReport(text:string,expectedSerial:string,fileName:string):ParsedEraseReport{
 const serial=norm(expectedSerial);
 const isCsv=fileName.toLowerCase().endsWith(".csv");
 const hasNwipe=/\bnwipe\b/i.test(text)||/nwipe[_ -]?log/i.test(fileName);
 const format:ParsedEraseReport["format"]=isCsv?"CSV":hasNwipe?"NWIPE_LOG":"OTHER_TEXT";
 const lines=text.split(/\r?\n/).slice(0,50000).filter(line=>line.length<3000);
 if(serial.length<4)return {format,observed_serial:"",observed_result:"UNKNOWN",match_status:"UNKNOWN",note:"Physical drive serial is missing or too short; manual identification required"};
 const tokenMatch=(line:string)=>{
  // Match a complete delimited drive-serial cell, never a substring of another serial.
  const cells=line.split(/[|,;\t/]/).map(x=>norm(x.trim())).filter(Boolean);
  return cells.includes(serial);
 };
 const rows=lines.filter(line=>tokenMatch(line)&&(/[|,;]/.test(line)));
 if(!rows.length)return {format,observed_serial:"",observed_result:"UNKNOWN",match_status:"MISMATCH",note:"No per-drive summary row containing the complete serial was identified"};
 const outcomes=rows.map(line=>{
   // Accept clear terminal status terms only in the same identified drive row.
   const pass=/(?:\bSUCCESS(?:FUL)?\b|\bCOMPLETED SUCCESSFULLY\b|\bPASSED\b)/i.test(line);
   const failed=/(?:\bFAILED?\b|\bERROR\b|\bABORTED\b|\bCANCELLED\b)/i.test(line);
   return pass&&!failed?"PASSED":failed?"FAILED":"UNKNOWN";
 });
 const unique=[...new Set(outcomes)];
 const outcome=unique.length===1?unique[0]:"UNKNOWN";
 return {format,observed_serial:expectedSerial.trim(),observed_result:outcome,match_status:"MATCH",note:outcome==="UNKNOWN"?"Drive identified, but result is ambiguous. Review original report.":"Candidate drive row found; review original evidence and method before approval"};
}
