import type { PageServerLoad } from "./$types"
import { redirect, error } from "@sveltejs/kit";

const ALLOWED_EMAILS = [
  "mau.uehara@gmail.com",
  "liasegre@gmail.com"
];

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth();

  if (session?.user?.email && !ALLOWED_EMAILS.includes(session.user.email)) {
    error(403, {message: "You are not allowed to access this page"});
  }

  if (session?.user?.name) {
    redirect(303, `/`)
  }
  
  return {
    session,
  };
}