import { createAsset } from "../actions";
import { ModelAutofill } from "@/components/ModelAutofill";
import { createClient } from "@/lib/supabase/server";

export default async function NewAssetPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: models } = await supabase
    .from("model_support")
    .select("manufacturer,model_name,aliases,identifiers,category,support_summary,lock_risks,battery_notes,likely_route,source_url,source_checked,confidence")
    .order("manufacturer")
    .order("model_name");

  return (
    <div className="stack">
      <div>
        <div className="badge">Front-door foundation</div>
        <h1>New intake</h1>
        <p className="muted">This first slice creates the private asset record. The full interactive triage wizard comes next.</p>
      </div>

      {error ? <div className="error">{error}</div> : null}

      <form action={createAsset} className="card form">
        <div className="two">
          <label>
            Category
            <select name="category" required defaultValue="LAPTOP">
              <option value="LAPTOP">Windows/Mac laptop</option>
              <option value="DESKTOP">Desktop</option>
              <option value="PHONE">Phone</option>
              <option value="TABLET">Tablet</option>
              <option value="CHROMEBOOK">Chromebook</option>
              <option value="MONITOR">Monitor</option>
              <option value="TV">TV</option>
              <option value="NETWORKING">Networking</option>
              <option value="PRINTER">Printer</option>
              <option value="PARTS">Parts</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>
            Source / supplier
            <input name="source_name" placeholder="Business, donor or source" />
          </label>
        </div>

        <ModelAutofill models={models ?? []} />

        <label>
          Serial / IMEI
          <input name="serial_imei" placeholder="Record before the device moves further" />
        </label>

        <div className="two">
          <label>
            Ownership / authority verified?
            <select name="ownership_verified" required defaultValue="yes">
              <option value="yes">Yes</option>
              <option value="no">No — do not accept</option>
            </select>
          </label>

          <label>
            Data-bearing?
            <select name="data_bearing" required defaultValue="yes">
              <option value="yes">Yes / assume yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <label>
          Initial route
          <select name="initial_route" required defaultValue="HOLD">
            <option value="HOLD">Hold / further triage</option>
            <option value="REFURBISH">Refurbish candidate</option>
            <option value="PARTS">Parts candidate</option>
            <option value="DONATE">Donation candidate</option>
            <option value="RECYCLE">Recycle candidate</option>
          </select>
        </label>

        <label>
          Notes
          <textarea name="notes" placeholder="Visible damage, accessories, source context, immediate observations" />
        </label>

        <button className="button" type="submit">Accept and create asset</button>
      </form>
    </div>
  );
}
