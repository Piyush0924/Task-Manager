"use client"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { useModalStore } from "@/store/modalStore"

const Header = () => {
  const { setIsAddModalOpen } = useModalStore()

  return (
    <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
      <Plus className="mr-2 h-4 w-4" /> Add Task
    </Button>
  )
}

export default Header
