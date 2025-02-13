"use client";
import { useEffect, useState } from "react";
import { Student } from "@/types/student";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      // Update existing student
      await fetch(`/api/students/${editingStudent._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      setEditingStudent(null);  
    } else {
      // Add new student
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
    }
    setForm({ name: "", email: "", age: "" });
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });
    fetchStudents();
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({ name: student.name, email: student.email, age: student.age.toString() });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{editingStudent ? "Edit Student" : "Add Student"}</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <button className="bg-blue-500 text-white p-2 w-full">
          {editingStudent ? "Update Student" : "Add Student"}
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {students.map((student) => (
          <li key={student._id} className="border p-2 flex justify-between">
            <span>{student.name} - {student.email} - {student.age} years old</span>
            <div>
              <button onClick={() => handleEdit(student)} className="text-yellow-500 mr-2">Edit</button>
              <button onClick={() => handleDelete(student._id!)} className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
