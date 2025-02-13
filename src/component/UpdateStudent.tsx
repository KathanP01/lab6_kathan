"use client";
import { useState, useEffect } from "react";

interface Student {
  _id: string;
  name: string;
  email: string;
  age: number;
}

export default function UpdateStudent() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState<number | "">("");

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setName(student.name);
    setEmail(student.email);
    setAge(student.age);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    const updatedStudent = { name, email, age };
    const response = await fetch(`/api/students/${selectedStudent._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedStudent),
    });

    if (response.ok) {
      alert("Student updated successfully!");
      setStudents((prev) =>
        prev.map((s) =>
          s._id === selectedStudent._id
            ? { ...s, name, email, age: Number(age) }
            : s
        )
      );

      // Reset form
      setSelectedStudent(null);
      setName("");
      setEmail("");
      setAge("");
    } else {
      alert("Error updating student.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Update Student</h2>

      {/* Student List */}
      <ul className="mb-4">
        {students.map((student) => (
          <li key={student._id} className="mb-2">
            {student.name} - {student.email}
            <button
              onClick={() => handleSelectStudent(student)}
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Update Form */}
      {selectedStudent && (
        <form onSubmit={handleUpdate} className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="p-2 border rounded w-full"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update
          </button>
        </form>
      )}
    </div>
  );
}
