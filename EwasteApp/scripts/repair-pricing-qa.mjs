import fs from "node:fs";
import assert from "node:assert/strict";
import ts from "typescript";
const code=fs.readFileSync("components/RepairPricingStudio.tsx","utf8");
const file=ts.createSourceFile("RepairPricingStudio.tsx",code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const variable=file.statements.flatMap(s=>ts.isVariableStatement(s)?Array.from(s.declarationList.declarations):[])
  .find(s=>s.name.getText(file)==="cases");
assert.ok(variable && variable.initializer && ts.isArrayLiteralExpression(variable.initializer),
 "The real interactive pricing scenarios must be statically inspectable");
function value(expr){
 if(ts.isStringLiteral(expr)||ts.isNoSubstitutionTemplateLiteral(expr))return expr.text;
 if(ts.isNumericLiteral(expr))return Number(expr.text);
 if(ts.isPrefixUnaryExpression(expr))return -Number(expr.operand.getText(file));
 if(ts.isArrayLiteralExpression(expr))return expr.elements.map(value);
 throw new Error("Unexpected non-literal case field: "+expr.getText(file).slice(0,40));
}
const cases=variable.initializer.elements.map(node=>{
 assert.ok(ts.isObjectLiteralExpression(node));
 return Object.fromEntries(node.properties.map(p=>{
  assert.ok(ts.isPropertyAssignment(p));
  return [p.name.getText(file),value(p.initializer)];
 }));
});
assert.equal(cases.length,4,"Three teaching cases and one unseen transfer case");
const expected=[194.6666666667,90.50,643.5897435897,320.833333333];
const choices=new Set(cases.map(c=>c.correct));
assert.equal(choices.size,3,"Correct answer positions must vary");
cases.forEach((c,i)=>{
 const internal=c.parts+c.hours*c.rate+c.overhead+c.risk;
 const sale=internal/(1-c.margin/100);
 assert.ok(Math.abs(sale-expected[i])<0.0001,"Incorrect expected ex-GST quote "+i);
 assert.ok(c.margin>0&&c.margin<100&&c.hours>0&&c.rate>0);
 assert.equal(c.choices.length,3);
 assert.ok(c.choices.every(x=>x.length>=35),"Avoid one-word or cue-heavy answers");
 const lens=c.choices.map(x=>x.length);
 assert.ok(Math.max(...lens)/Math.min(...lens)<1.65,
  "Correct choice should not be reliably identified by answer length in scenario "+i);
 assert.ok(c.why.length>=100&&c.detail.length>=80,
  "Scenarios must explain real decisions, not mere slogans");
});
assert.ok(code.includes("Math.abs(Number(num)-t.ex)")&&code.includes("35 words")&&
 code.includes("rework")&&code.includes("written")&&code.includes("quoteNumbers")===false,
 "Assessment must check calculation, explanation, risk and written notices");
assert.ok(code.includes("type=\\"number\\"")===false || code.includes("step=\\".01\\""),
 "Numeric quote input must support cents");
assert.ok(!code.includes("Peter Tosh") && !code.includes("parristechservices@gmail.com"),
 "Do not embed real customers or business authentication context in public assessment");
assert.ok(code.includes("URL.createObjectURL") && code.includes("Download fictional worked-case portfolio"),
 "The learner must be able to export worked examples for an evidence portfolio");
console.log("Repair pricing QA PASS: 4 scenarios, independently checked arithmetic, safety decisions, distinct answer positions, portfolio.");
