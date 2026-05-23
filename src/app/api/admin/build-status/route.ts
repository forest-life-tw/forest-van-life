import { NextResponse } from "next/server";

export type DeploymentStatus = "QUEUED" | "BUILDING" | "READY" | "ERROR" | "CANCELED" | "UNKNOWN";

export type BuildStatusResponse = {
  status: DeploymentStatus;
  createdAt?: number;
  readyAt?: number;
};

export async function GET() {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;

  if (!token || !projectId) {
    return NextResponse.json({ status: "UNKNOWN" } satisfies BuildStatusResponse);
  }

  const teamId = process.env.VERCEL_TEAM_ID;
  const qs = new URLSearchParams({ projectId, limit: "1" });
  if (teamId) qs.set("teamId", teamId);

  const res = await fetch(`https://api.vercel.com/v6/deployments?${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ status: "UNKNOWN" } satisfies BuildStatusResponse);
  }

  const data = await res.json();
  const d = data.deployments?.[0];
  if (!d) return NextResponse.json({ status: "UNKNOWN" } satisfies BuildStatusResponse);

  return NextResponse.json({
    status: d.state as DeploymentStatus,
    createdAt: d.createdAt,
    readyAt: d.readyAt ?? undefined,
  } satisfies BuildStatusResponse);
}
