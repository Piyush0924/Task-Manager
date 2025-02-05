import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Task } from "@/types/types";
import { Calendar, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditDeleteMenu from "./EditDeleteMenu";
import { useTaskStore } from "@/store/taskStore";
import { useModalStore } from "@/store/modalStore";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import useLogout from "@/hooks/useLogout";

// Define the TaskStatus type (you can place this in your types file)
export type TaskStatus = "To Do" | "In Progress" | "Completed";

const Tasks: React.FC = () => {
  const { toast } = useToast();
  const { tasks, setTasks } = useTaskStore();
  const { setIsAddModalOpen } = useModalStore();
  const [selectedTab, setSelectedTab] = useState<TaskStatus>("To Do");
  const logout = useLogout();

  const updateTaskStatus = async (task: Task) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/updatetask`;
      const headers = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, status: task.status }),
      };
      await fetch(url, headers);
      toast({ title: "Task Updated", className: "bg-green-400 text-black", duration: 2000 });
    } catch (error) {
      toast({ title: "Error updating task", className: "bg-red-400 text-black", duration: 2000 });
      console.error("Error:", error);
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const draggedItemId = result.draggableId;
    const sourceColumn = result.source.droppableId as TaskStatus;
    const destinationColumn = result.destination.droppableId as TaskStatus;
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceColumn === destinationColumn) {
      const newTasks = Array.from(tasks);
      const [movedTask] = newTasks.splice(sourceIndex, 1);
      newTasks.splice(destinationIndex, 0, movedTask);
      setTasks(newTasks);
    } else {
      const taskIndex = tasks.findIndex((task) => task._id === draggedItemId);
      if (taskIndex !== -1) {
        const updatedTask = { ...tasks[taskIndex], status: destinationColumn };
        const newTasks = [...tasks.slice(0, taskIndex), updatedTask, ...tasks.slice(taskIndex + 1)];
        setTasks(newTasks);
        updateTaskStatus(updatedTask);
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-screen flex flex-col">
        <div className="mb-4 flex items-center justify-between p-4 bg-gray-100 shadow">
          <h2 className="text-xl md:text-2xl font-bold dark:text-black">
            {selectedTab} Tasks
          </h2>
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-600 p-5 flex flex-col">
            <h2 className="text-2xl font-bold mb-4">📌 Task Board</h2>
            <div className="flex flex-col space-y-2">
              {["To Do", "In Progress", "Completed"].map((status) => (
                <button
                  key={status}
                  className={`text-left py-2 px-4 rounded-full ${
                    selectedTab === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-500 text-gray-100"
                  }`}
                  onClick={() => setSelectedTab(status as TaskStatus)} // Casting correctly here
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          {/* Tasks List */}
          <div className="flex-1 bg-white p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Button className=" bg-red-600 text-white" variant="ghost" onClick={logout}>
                Logout
              </Button>
            </div>
            <Droppable droppableId={selectedTab}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {tasks
                    .filter((task) => task.status === selectedTab)
                    .map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-4 border rounded-md bg-white shadow-md"
                          >
                            
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-lg">{task.title}</h3>
                              <Badge>{task.priority}</Badge>
                              <div className="mt-2 flex justify-between items-center">
                              <EditDeleteMenu task={task} />
                            </div>
                            </div>
                            <p>{task.description}</p>
                            <div className="text-sm text-gray-500 mt-2">
                              <Calendar className="inline mr-2 h-4 w-4" />
                              {task.dueDate
                                ? format(new Date(task.dueDate), "MMM dd, yyyy")
                                : "No due date"} {/* Default fallback */}
                            </div>
                           
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Tasks;
