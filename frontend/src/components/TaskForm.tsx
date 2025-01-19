import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types';

interface Props {
  editing: Task | null;
  onSubmit: (input: TaskInput) => Promise<void>;
  onCancel: () => void;
}

const EMPTY: TaskInput = { title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: null };

const TaskForm = ({ editing, onSubmit, onCancel }: Props) => {
  const [form, setForm] = useState<TaskInput>(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description ?? '',
        status: editing.status,
        priority: editing.priority,
        dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : null,
      });
    } else {
      setForm(EMPTY);
    }
  }, [editing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSubmit({ ...form, dueDate: form.dueDate || null });
      setForm(EMPTY);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save task');
    } finally {
      setSaving(false);
    }
  };

  const input =
    'w-full rounded-md border border-ink/15 bg-white px-3 py-2 text-sm focus:border-teal-650 focus:outline-none focus:ring-1 focus:ring-teal-650';

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-semibold">{editing ? 'Edit task' : 'New task'}</h2>

      <div className="mt-3 space-y-3">
        <input
          className={input}
          placeholder="Task title"
          value={form.title}
          maxLength={200}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className={`${input} resize-none`}
          rows={3}
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-ink/60">
            Status
            <select
              className={`${input} mt-1`}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
            >
              <option value="TODO">To do</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
          </label>
          <label className="text-xs text-ink/60">
            Priority
            <select
              className={`${input} mt-1`}
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
        </div>
        <label className="block text-xs text-ink/60">
          Due date
          <input
            type="date"
            className={`${input} mt-1`}
            value={form.dueDate ?? ''}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value || null })}
          />
        </label>
      </div>

      {error && <p className="mt-3 text-xs text-rose-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-teal-650 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Add task'}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} className="rounded-md border border-ink/15 px-4 py-2 text-sm hover:bg-ink/5">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
