import { ref } from 'vue'

export const useDragAndDrop = () => {
  const draggedIndex = ref<number | null>(null)
  const dragOverIndex = ref<number | null>(null)

  const handleDragStart = (index: number) => {
    draggedIndex.value = index
  }

  const handleDragOver = (event: DragEvent, index: number) => {
    event.preventDefault()
    dragOverIndex.value = index
  }

  const handleDragEnd = () => {
    draggedIndex.value = null
    dragOverIndex.value = null
  }

  const handleDrop = (event: DragEvent, items: string[], onReorder: (newOrder: string[]) => void) => {
    event.preventDefault()
    
    if (draggedIndex.value === null || dragOverIndex.value === null) return
    if (draggedIndex.value === dragOverIndex.value) return

    const newOrder = [...items]
    const [movedItem] = newOrder.splice(draggedIndex.value, 1)
    if (!movedItem) return
    if (dragOverIndex.value === null) return  
    newOrder.splice(dragOverIndex.value, 0, movedItem)

    onReorder(newOrder)
    
    draggedIndex.value = null
    dragOverIndex.value = null
  }

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDrop,
  }
}

