import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { reorderProjects } from "@/lib/projects";
import { handleWriteError } from "../route";

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }
  try {
    const body = (await req.json()) as { ids?: unknown };
    if (!Array.isArray(body.ids) || body.ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "Expected an array of project ids." }, { status: 400 });
    }
    await reorderProjects(body.ids as string[]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
