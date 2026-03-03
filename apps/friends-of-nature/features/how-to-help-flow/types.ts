export interface Task {
  taskTitle: string;
  detailedInstructions: string;
  estimatedTime: string;
}

export interface Week {
  week: string;
  title: string;
  tasks: Task[];
  explanation: string;
}
