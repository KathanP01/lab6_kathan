import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

// UPDATE a student by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    
    const { id } = await params; 
    await connectDB();
    const { name, email, age } = await req.json();

    const updatedStudent = await Student.findByIdAndUpdate(id, { name, email, age }, { new: true });

    if (!updatedStudent) {
      console.error("Student not found for update.");
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error("Error during PUT request: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a student by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    
    const { id } = await params; 
    await connectDB();

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      console.error("Student not found for delete.");
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error during DELETE request: ", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
