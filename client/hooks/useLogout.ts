// hooks/useLogout.ts

import { useToast } from "@/hooks/use-toast";
import { useTaskStore } from "@/store/taskStore";
import { useDashboardStore } from "@/store/dashboardStore";

const useLogout = () => {
  const { setUser } = useDashboardStore();
  const { setTasks } = useTaskStore();
  const { toast } = useToast();

  const logout = () => {
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
      variant: "destructive",
      duration: 2000,
    });
    setUser(null);
    setTasks([]);
  };

  return logout;
};

export default useLogout;
