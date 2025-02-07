"use client";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { EmptyTask } from "@/lib/constants";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { TaskPriority, TaskStatus } from "@/types/types";
import { useDashboardStore } from "@/store/dashboardStore";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AddTaskModal = () => {
  const { newTask, updateTask, setNewTask, addTask } = useTaskStore();
  const { isAddModalOpen, setIsAddModalOpen } = useModalStore();
  const { user } = useDashboardStore();
  const { toast } = useToast();

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewTask(EmptyTask);
  };

  const handleAddTask = async () => {
    try {
      const url = newTask._id
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/addtask`;

      const bodyData = { ...newTask, user: user?.email };

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (!newTask._id && user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }

      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (newTask._id) {
        updateTask(newTask);
        toast({
          title: "Task Updated",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });
      } else {
        addTask(data.task);
        toast({
          title: "Task Added",
          variant: "default",
          className: "bg-green-400 text-black",
          duration: 2000,
        });
      }

      setNewTask(EmptyTask);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error in handleAddTask:", error);

      let errorMessage = "Failed to add/update task";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open={isAddModalOpen} onOpenChange={handleAddModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{newTask._id ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Task Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-left">
              Title
            </Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="col-span-3"
            />
          </div>

          {/* Task Description */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-left">
              Description
            </Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="col-span-3"
            />
          </div>

          {/* Task Status */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-left">
              Status
            </Label>
            <Select
              value={newTask.status || "To Do"}
              onValueChange={(value) => setNewTask({ ...newTask, status: value as TaskStatus })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
                <SelectItem value="To Do">To Do</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Priority */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-left">
              Priority
            </Label>
            <Select
              value={newTask.priority || "Urgent"}
              onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border border-gray-700">
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="Weekend">Weekend</SelectItem>
                <SelectItem value="Monthend">Monthend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Task Due Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-left">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={newTask.dueDate ? format(newTask.dueDate, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  dueDate: e.target.value ? new Date(e.target.value) : undefined,
                })
              }
              className="col-span-3 w-fit"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleAddTask}>
            {newTask._id ? "Save Changes" : "Add Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;