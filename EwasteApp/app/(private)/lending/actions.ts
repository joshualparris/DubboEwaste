"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireProgrammeContext } from "@/lib/programme-context";
function done(error?: string): never { redirect("/lending?" + (error ? "error=" + encodeURIComponent(error) : "success=Loan%20record%20updated")); }
export async function checkoutItem(form: FormData) {
  const due = new Date(String(form.get("due_at")));
  if (!Number.isFinite(due.getTime()) || due.getTime() <= Date.now()) done("Choose a future due date.");
  const data = z.object({asset_id:z.string().uuid(),borrower_id:z.string().uuid(),due_at:z.string().datetime(),condition_out:z.string().trim().min(1).max(1000),notes:z.string().max(2000)}).safeParse({asset_id:form.get("asset_id"),borrower_id:form.get("borrower_id"),due_at:due.toISOString(),condition_out:form.get("condition_out"),notes:String(form.get("notes") || "")});
  if (!data.success) done("Check the borrower, due date and condition.");
  const { supabase, context } = await requireProgrammeContext();
  const { error } = await supabase.from("item_loans").insert({...data.data,programme:"library_of_things",created_by:context.id});
  if (error) done(error.message); revalidatePath("/lending"); done();
}
export async function returnItem(form: FormData) {
  const id = z.string().uuid().safeParse(form.get("loan_id"));
  const condition = String(form.get("condition_in") || "").trim();
  if (!id.success || !condition || condition.length > 1000) done("Record the condition on return.");
  const { supabase } = await requireProgrammeContext();
  const { data, error } = await supabase.from("item_loans").update({returned_at:new Date().toISOString(),condition_in:condition}).eq("id",id.data).is("returned_at",null).select("id").single();
  if (error || !data) done("This loan is unavailable or already returned."); revalidatePath("/lending"); done();
}
