"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCourse } from "@/lib/learning/catalog";

async function learningUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles")
    .select("active").eq("id", user.id).maybeSingle();
  if (!profile?.active) redirect("/login?error=Account%20inactive");
  const { data: membership } = await supabase.from("program_access")
    .select("program").eq("user_id", user.id).limit(1);
  if (!membership?.length) redirect("/login?error=No%20volunteer%20area%20assigned");
  return { supabase, user };
}

export async function enrolInCourse(formData: FormData) {
  const slug = String(formData.get("course") ?? "");
  if (!getCourse(slug)) redirect("/learn?error=Unknown%20course");
  const { supabase, user } = await learningUser();
  const { error } = await supabase.from("learning_enrolments")
    .upsert({ user_id: user.id, course_slug: slug },
      { onConflict: "user_id,course_slug", ignoreDuplicates: true });
  if (error) redirect("/learn?error=Unable%20to%20enrol.%20Please%20tell%20the%20coordinator.");
  revalidatePath("/learn");
  redirect("/learn/" + slug + "?message=enrolled");
}

export async function completeLearningLesson(formData: FormData) {
  const courseSlug = String(formData.get("course") ?? "");
  const lessonSlug = String(formData.get("lesson") ?? "");
  const course = getCourse(courseSlug);
  const lesson = course?.lessons.find(l => l.id === lessonSlug);
  if (!course || !lesson) redirect("/learn?error=Unknown%20lesson");
  const path = "/learn/" + courseSlug + "/" + lessonSlug;
  const { supabase, user } = await learningUser();
  const { data: enrolment } = await supabase.from("learning_enrolments")
    .select("course_slug").eq("user_id", user.id).eq("course_slug", courseSlug).maybeSingle();
  if (!enrolment) redirect("/learn/" + courseSlug + "?error=Enrol%20before%20starting");

  if (lessonSlug === course.lessons[course.lessons.length - 1].id) {
    const answer = Number(formData.get("answer"));
    if (!formData.has("answer") || !Number.isInteger(answer) || answer !== course.check.answer) {
      redirect(path + "?result=retry");
    }
  } else if (String(formData.get("practice_done")) !== "yes") {
    redirect(path + "?result=practice");
  }

  const { error } = await supabase.from("learning_progress")
    .upsert({ user_id: user.id, course_slug: courseSlug, lesson_slug: lessonSlug },
      { onConflict: "user_id,course_slug,lesson_slug", ignoreDuplicates: true });
  if (error) redirect(path + "?result=save-error");
  revalidatePath("/learn");
  revalidatePath("/learn/" + courseSlug);
  revalidatePath(path);
  redirect(path + "?result=complete");
}
