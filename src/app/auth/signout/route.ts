import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("sosakai_admin_session");

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.signOut();
    }
  } catch {
    // Continuar con el cierre de sesión local
  }

  revalidatePath("/", "layout");
  return NextResponse.redirect(new URL("/", req.url), {
    status: 302,
  });
}
