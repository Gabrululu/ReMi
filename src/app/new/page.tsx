import Navbar from '@/components/NavbarNew';
import TaskForm from '@/components/TaskForm';

export default function NewTaskPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <TaskForm />
    </div>
  );
}