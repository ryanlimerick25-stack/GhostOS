import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ is_pro: false });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const is_pro = user.publicMetadata?.is_pro === true;

  return Response.json({ is_pro });
}
