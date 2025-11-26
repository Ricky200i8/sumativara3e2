// types/task.ts
export type Task = {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: string;
    userId: number; // para que solo el usuario vea sus tareas
  };