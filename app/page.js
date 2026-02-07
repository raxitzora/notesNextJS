import NotesClient from "@/components/NotesClient";
import dbConnect from "@/lib/db";
import Note from "@/models/Note";

async function getNotes(){
  await dbConnect();
  const notes = await Note.find({}).sort({createdAt:-1}).lean()

  return notes.map((note)=>({
    ...note,
    _id:note._id.toString()
  }))
}


export default async function Home() {

  const notes = await getNotes()
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">NotesApp</h1>
      <NotesClient initialNotes={notes} />

    </div>
  );
}
