"use client";
import {useActionState} from "react";
import {rotateLibraryCode} from "./actions";
export function LibraryCodeControl(){
 const [state,formAction,pending]=useActionState(rotateLibraryCode,{code:null as string|null,error:null as string|null});
 return <section className="card stack">
   <h2>Library of Things volunteer access</h2>
   <p>Generate a strong access code for new Library of Things volunteers. This rotates any old Library of Things code. Existing user accounts are unaffected. Only global admins can do this.</p>
   <form action={formAction}><button type="submit" className="button" disabled={pending}>{pending?"Generating…":"Generate or rotate volunteer code"}</button></form>
   {state.error?<p className="error" role="alert">{state.error}</p>:null}
   {state.code?<div role="status" className="success">
     <strong>Copy this code now. It will not be shown again.</strong>
     <p><code style={{fontSize:"14px",overflowWrap:"anywhere",userSelect:"all"}}>{state.code}</code></p>
     <p>Give it privately to your approved Library of Things volunteers. Do not paste it into public pages, issue trackers or GitHub.</p>
   </div>:null}
 </section>;
}
