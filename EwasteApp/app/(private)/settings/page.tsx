import AppearanceSettings from "@/components/AppearanceSettings";
export const metadata={title:"Settings · AssetFlow"};
export default function SettingsPage(){
 return <div className="stack">
  <header><div className="badge">AssetFlow preferences</div><h1>Settings</h1>
   <p className="muted">Set up your workspace the way you prefer.</p>
  </header>
  <AppearanceSettings/>
 </div>;
}
