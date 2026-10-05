import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateJobDetails } from "../actions";

export default async function EditJobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();

  const [{ data: job }, { data: customers }] = await Promise.all([
    supabase
      .from("jobs")
      .select("id,job_code,customer_id,source_site,contact_name,expected_asset_count,expected_weight_kg,work_instructions")
      .eq("id", id)
      .single(),
    supabase.from("customers").select("id,name").order("name"),
  ]);

  if (!job) notFound();

  return (
    <div className="stack">
      <div>
        <div className="badge">Edit job</div>
        <h1>{job.job_code}</h1>
        <p className="muted">
          Update operational job details. The job code stays fixed so references, labels and audit history remain stable.
        </p>
      </div>

      {query.error ? <div className="error">{query.error}</div> : null}

      <form action={updateJobDetails} className="card form">
        <input type="hidden" name="job_id" value={job.id} />

        <label>
          Customer/source
          <select name="customer_id" defaultValue={job.customer_id ?? ""}>
            <option value="">Unassigned / one-off source</option>
            {(customers ?? []).map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </label>

        <div className="two">
          <label>
            Source site
            <input name="source_site" defaultValue={job.source_site ?? ""} />
          </label>
          <label>
            Contact
            <input name="contact_name" defaultValue={job.contact_name ?? ""} />
          </label>
        </div>

        <div className="two">
          <label>
            Expected asset count
            <input
              name="expected_asset_count"
              type="number"
              min="0"
              defaultValue={job.expected_asset_count ?? ""}
            />
          </label>
          <label>
            Expected weight (kg)
            <input
              name="expected_weight_kg"
              type="number"
              min="0"
              step="0.001"
              defaultValue={job.expected_weight_kg ?? ""}
            />
          </label>
        </div>

        <label>
          Work instructions
          <textarea
            name="work_instructions"
            defaultValue={job.work_instructions ?? ""}
            placeholder="Customer handling, data, segregation or reporting instructions"
          />
        </label>

        <div className="actions">
          <button className="button" type="submit">Save job changes</button>
          <Link className="button secondary" href={"/jobs/" + job.id}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}
