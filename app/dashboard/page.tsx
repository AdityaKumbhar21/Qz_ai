import { auth, currentUser } from "@clerk/nextjs/server";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <DashboardClient
        user={{
          name: user?.firstName + " " + user?.lastName || user?.username || "User",
          email: user?.emailAddresses[0]?.emailAddress || "",
          image: user?.imageUrl || null,
        }}
      />
    </div>
  );
}
