import { build } from "esbuild";
import { createRequire } from "node:module";
import path from "node:path";
const root=process.cwd();
const require=createRequire(path.join(root,"package.json"));
const fixture=`let mode='signed-out';let calls=0;
export function setMode(value){mode=value;calls=0} export function rpcCalls(){return calls}
export async function createClient(){return {auth:{getUser:async()=>({data:{user:mode==='signed-out'?null:{id:'qa'}}})},rpc:async()=>{calls++;return {data:mode==='inactive'?null:{id:'qa',selected:'repair_cafe',role:'volunteer'},error:mode==='failure'?{message:'unavailable'}:null}}}}`;
const result=await build({stdin:{contents:`export {getProgrammeContext,requireProgrammeContext} from './lib/programme-context';export {setMode,rpcCalls} from '@/lib/supabase/server';`,resolveDir:root},bundle:true,write:false,platform:'node',format:'cjs',tsconfig:path.join(root,'tsconfig.json'),plugins:[{name:'isolated-auth-boundaries',setup(b){
 b.onResolve({filter:/^@\/lib\/supabase\/server$/},()=>({path:'client',namespace:'qa'}));
 b.onLoad({filter:/.*/,namespace:'qa'},()=>({contents:fixture,loader:'js'}));
 b.onResolve({filter:/^next\/navigation$/},()=>({path:'redirect',namespace:'redirect-qa'}));
 b.onLoad({filter:/.*/,namespace:'redirect-qa'},()=>({contents:`export function redirect(url){throw new Error('REDIRECT:'+url)}`,loader:'js'}));
}}]});
const Module=require('node:module');const m=new Module('programme-auth-qa.cjs');m.paths=Module._nodeModulePaths(root);m._compile(result.outputFiles[0].text,'programme-auth-qa.cjs');const q=m.exports;
q.setMode('signed-out');const signedOut=await q.getProgrammeContext();if(signedOut.context!==null||q.rpcCalls()!==0)throw Error('Signed-out callers must not execute programme RPC');
try{await q.requireProgrammeContext();throw Error('Missing sign-in redirect')}catch(e){if(!e.message.startsWith('REDIRECT:/login'))throw e}
q.setMode('inactive');try{await q.requireProgrammeContext();throw Error('Missing inactive-account redirect')}catch(e){if(!e.message.startsWith('REDIRECT:/login'))throw e}
q.setMode('active');if((await q.requireProgrammeContext()).context.role!=='volunteer')throw Error('Active membership lost');
q.setMode('failure');try{await q.getProgrammeContext();throw Error('Backend failure accepted')}catch(e){if(!e.message.includes('could not be loaded'))throw e}
console.log('PASS: signed-out redirect without anonymous RPC, inactive account, active membership, backend failure.');
