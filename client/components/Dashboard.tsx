"use client";

import Tasks from "./Tasks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";

export function DashboardComponent() {
  const { user, setUser } = useDashboardStore();
  const { setTasks } = useTaskStore();
  const router = useRouter();

  const fetchTasks = async () => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/alltasks`;
    const headers = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": user?.token || "",
      },
      body: JSON.stringify({ user: user?.email }),
    };

    try {
      const res = await fetch(url, headers);
      const result = await res.json();
      setTasks(result.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    setUser(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") as string)
        : null
    );
  }, []);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-secondary dark:bg-background text-black border border-gray-700">
      <div className="flex-1 p-8 overflow-auto">
        
        <Tasks />
      </div>
    </div>
  );
}
