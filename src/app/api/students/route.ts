import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

// GET all students
export async function GET() {
  await connectDB();
  const students = await Student.find();
  return NextResponse.json(students, { status: 200 });
}

// POST a new student
export async function POST(req: Request) {
  await connectDB();
  const { name, email, age } = await req.json();
  const newStudent = new Student({ name, email, age });
  await newStudent.save();
  return NextResponse.json(newStudent, { status: 201 });
}

// PUT (Update student)
export async function PUT(req: Request) {
  await connectDB();
  const { id, name, email, age } = await req.json();
  const updatedStudent = await Student.findByIdAndUpdate(id, { name, email, age }, { new: true });
  return NextResponse.json(updatedStudent, { status: 200 });
}

// DELETE student
export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Student.findByIdAndDelete(id);
  return NextResponse.json({ message: "Student deleted" }, { status: 200 });
}
