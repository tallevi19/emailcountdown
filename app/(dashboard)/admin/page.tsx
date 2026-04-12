import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) =>
  e.trim()
);

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (!ADMIN_EMAILS.includes(session.user.email ?? "")) redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { timers: { where: { isArchived: false } } } },
    },
    take: 100,
  });

  const totalTimers = await prisma.timer.count();
  const totalUsers = await prisma.user.count();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      {/* Platform stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Total Timers", value: totalTimers },
          {
            label: "Free Users",
            value: users.filter((u) => u.plan === "FREE").length,
          },
          {
            label: "Paid Users",
            value: users.filter((u) => u.plan !== "FREE").length,
          },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users (last 100)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-2 font-medium">Email</th>
                  <th className="text-left p-2 font-medium">Plan</th>
                  <th className="text-left p-2 font-medium">Timers</th>
                  <th className="text-left p-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="p-2">
                      <p className="font-medium">{user.email}</p>
                      {user.name && (
                        <p className="text-xs text-muted-foreground">
                          {user.name}
                        </p>
                      )}
                    </td>
                    <td className="p-2">
                      <Badge
                        variant={user.plan === "FREE" ? "outline" : "default"}
                        className="text-xs"
                      >
                        {user.plan}
                      </Badge>
                    </td>
                    <td className="p-2 text-muted-foreground">
                      {user._count.timers}
                    </td>
                    <td className="p-2 text-xs text-muted-foreground">
                      {format(user.createdAt, "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
