import type { Task, TaskStatus } from '../types';

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (task: Task, status: TaskStatus) => void;
}

const PRIORITY_STYLES: Record<Task['priority'], string> = {
  HIGH: 'bg-rose-50 text-rose-700 border-rose-200',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
  LOW: 'bg-slate-50 text-slate-600 border-slate-200',
};

const STATUS_RAIL: Record<TaskStatus, string> = {
  TODO: 'border-l-slate-300',
  IN_PROGRESS: 'border-l-teal-650',
  DONE: 'border-l-emerald-500',
};

const NEXT_STATUS: Record<TaskStatus, { label: string; to: TaskStatus } | null> = {
  TODO: { label: 'Start', to: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Mark done', to: 'DONE' },
  DONE: null,
};

const TaskCard = ({ task, onEdit, onDelete, onMove }: Props) => {
  const next = NEXT_STATUS[task.status];
  const overdue =
    task.dueDate && task.status !== 'DONE' && new Date(task.dueDate) < new Date();

  return (
    <article
      className={`rounded-lg border border-ink/10 border-l-4 bg-white p-3 shadow-sm ${STATUS_RAIL[task.status]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className={`text-sm font-medium ${task.status === 'DONE' ? 'text-ink/40 line-through' : ''}`}>
          {task.title}
        </h3>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority.toLowerCase()}
        </span>
      </div>

      {task.description && (
        <p className="mt-1 text-xs leading-relaxed text-ink/60">{task.description}</p>
      )}

      {task.dueDate && (
        <p className={`mt-2 text-xs ${overdue ? 'font-medium text-rose-600' : 'text-ink/50'}`}>
          Due {new Date(task.dueDate).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' })}
          {overdue && ' — overdue'}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 text-xs">
        {next && (
          <button onClick={() => onMove(task, next.to)} className="font-medium text-teal-650 hover:underline">
            {next.label}
          </button>
        )}
        <button onClick={() => onEdit(task)} className="text-ink/50 hover:text-ink">
          Edit
        </button>
        <button onClick={() => onDelete(task.id)} className="text-ink/50 hover:text-rose-600">
          Delete
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
