"use client";
import {QRCodeSVG} from "qrcode.react";
export default function QRPoster({eventId,title,date}:{eventId:string;title:string;date:string}){
 const url="https://dubbo-ewaste-app.vercel.app/repair-cafe-volunteers/check-in?event="+encodeURIComponent(eventId);
 return <section style={{border:"2px solid #c9d8cd",borderRadius:16,padding:20,textAlign:"center",maxWidth:480,margin:"auto"}}>
  <h2>Volunteer check-in</h2><p><strong>{title}</strong></p><p>{date}</p>
  <div style={{display:"inline-block",background:"#fff",padding:12}}><QRCodeSVG value={url} size={240} marginSize={2} level="M"/></div>
  <p>Scan with your phone camera, sign in to Repair Café Dubbo, then tap <strong>Check in</strong> or <strong>Check out</strong>.</p>
  <p style={{overflowWrap:"anywhere",fontSize:12}}>{url}</p>
  <button type="button" className="button secondary" onClick={()=>window.print()}>Print QR poster</button>
 </section>;
}
