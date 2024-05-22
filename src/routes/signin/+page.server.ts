import type { PageServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (events) => {
  const session = await events.locals.auth()
  console.log(session);

  if (session?.user?.name) {
    redirect(303, `/`)
  }
  
  return {
    session,
  };
}