import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { deleteProject, getProjectById, updateProject } from "@/lib/projects";
import { parseProjectInput } from "@/lib/validate";
import { handleWriteError } from "../route";

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) {
    return NextResponse.json({ error: "Projekti ei leitud." }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(req: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const input = parseProjectInput(await req.json());
    const project = await updateProject(id, input);
    if (!project) {
      return NextResponse.json({ error: "Projekti ei leitud." }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (err) {
    return handleWriteError(err);
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Pole autoriseeritud." }, { status: 401 });
  }
  const { id } = await params;
  try {
    const removed = await deleteProject(id);
    if (!removed) {
      return NextResponse.json({ error: "Projekti ei leitud." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleWriteError(err);
  }
}
