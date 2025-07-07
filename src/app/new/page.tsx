'use client';

import Navbar from '@/components/NavbarNew';
import TaskForm from '@/components/TaskForm';
import { FarcasterWrapper } from '@/components/FarcasterWrapper';

export default function NewTaskPage() {
  return (
    <FarcasterWrapper>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <TaskForm />
      </div>
    </FarcasterWrapper>
  );
}