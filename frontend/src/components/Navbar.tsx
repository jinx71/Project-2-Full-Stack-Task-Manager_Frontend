import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-ink/10 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold tracking-tight">TaskBench</span>
          <span className="hidden text-xs text-ink/40 sm:inline">full-stack task manager</span>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/60">{user.name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-ink/15 px-3 py-1.5 text-sm hover:bg-ink/5"
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
