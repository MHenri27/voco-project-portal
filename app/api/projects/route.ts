import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { createProject, listProjects, ReadOnlyError } from "@/lib/projects";
import { parseProjectInput, ValidationError } from "@/lib/validate";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }
  const projects = await listProjects({ includeDrafts: true });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }
  try {
    const input = parseProjectInput(await req.json());
    const project = await createProject(input);
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    return handleWriteError(err);
  }
}

export function handleWriteError(err: unknown) {
  if (err instanceof ValidationError) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  if (err instanceof ReadOnlyError) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }
  if (err instanceof Error && err.message.includes("duplicate key")) {
    return NextResponse.json({ error: "Sellise slug'iga projekt on juba olemas." }, { status: 409 });
  }
  console.error(err);
  return NextResponse.json({ error: "Midagi läks valesti." }, { status: 500 });
}
