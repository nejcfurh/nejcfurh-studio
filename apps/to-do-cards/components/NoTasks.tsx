interface NoTasksProps {
  type: 'active' | 'completed';
}

export default function NoTasks({ type }: NoTasksProps) {
  return (
    <div className="card-task-line" style={{ width: 'auto' }}>
      <p className="card-task-name">
        {type === 'active'
          ? 'No tasks yet! Create a task below...'
          : 'No tasks on this list were completed yet!'}
      </p>
    </div>
  );
}
