import { useEffect, useMemo, useState } from 'react';
import type { Task, TaskInput, TaskStatus } from '../types';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks';
import { getErrorMessage } from '../api/client';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'To do' },
  { status: 'IN_PROGRESS', label: 'In progress' },
  { status: 'DONE', label: 'Done' },
];

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(
    () =>
      COLUMNS.map((col) => ({
        ...col,
        tasks: tasks.filter((t) => t.status === col.status),
      })),
    [tasks]
  );

  const handleSubmit = async (input: TaskInput) => {
    try {
      if (editing) {
        const updated = await updateTask(editing.id, input);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditing(null);
      } else {
        const created = await createTask(input);
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      // Re-throw with a readable message so TaskForm can display it
      throw new Error(getErrorMessage(err));
    }
  };

  const handleMove = async (task: Task, status: TaskStatus) => {
    const previous = tasks;
    // Optimistic update — revert if the API call fails
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
    try {
      await updateTask(task.id, { status });
    } catch (err) {
      setTasks(previous);
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
    } catch (err) {
      setTasks(previous);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {error && (
          <div className="mb-4 flex items-center justify-between rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
            <button onClick={() => setError('')} className="text-xs underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <TaskForm editing={editing} onSubmit={handleSubmit} onCancel={() => setEditing(null)} />

          {loading ? (
            <p className="text-sm text-ink/50">Loading tasks…</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {grouped.map((col) => (
                <section key={col.status}>
                  <h2 className="mb-2 flex items-baseline justify-between text-xs font-semibold uppercase tracking-wide text-ink/50">
                    {col.label}
                    <span className="font-normal">{col.tasks.length}</span>
                  </h2>
                  <div className="space-y-2">
                    {col.tasks.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-ink/15 p-3 text-xs text-ink/40">
                        {col.status === 'TODO' ? 'Add a task to get started' : 'Nothing here yet'}
                      </p>
                    ) : (
                      col.tasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onEdit={setEditing}
                          onDelete={handleDelete}
                          onMove={handleMove}
                        />
                      ))
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
