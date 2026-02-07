"use client"
import React,{useState} from 'react'
import toast from 'react-hot-toast';

const NotesClient = ({initialNotes}) => {
    const [notes,setNotes] = useState(initialNotes)
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [loading,setLoading] = useState(false);

    const createNote = async(e)=>{
        e.preventDefault()

        if(!title.trim() || !content.trim()) return;
        setLoading(true);
        try {
            const response = await fetch("/api/notes",
                {method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({title,content})
            })

            const result = await response.json();
            if(result.success){
                setNotes([result.data,...notes])
                toast.success("Notes Created successfully")
                setTitle("")
                setContent("")
            }
            
            setLoading(false)
            
        } catch (error) {
            console.error("Error creating note:",error);
            toast.error("Something went wrong")
            
            
        }
    }

    const deleteNote = async(id)=>{
        try {
            const response = await fetch(`/api/notes/${id}`,{
                method:"DELETE"
            })
            const result = await response.json();

            if(result.success){
                setNotes(notes.filter((note)=>note._id!==id))
                toast.success("Notes Deleted Successfully")

            }

            
        } catch (error) {
            console.error("Error deleting notes");
            toast.error("Something went wrong")
            
            
        }

    }
  return (
    <div className='space-y-6'>

        <form className='bg-white p-6 rounded-lg shadow-md' onSubmit={createNote}>
            <h2 className='text-xl font-semibold mb-4 text-black'>Create New Note</h2>
            <div className='space-y-4'>
                <input 
                type="text"
                className='w-full border-2 border-black rounded-md p-3 text-black hover:border-3'
                placeholder='Note Title'
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
                />

                <textarea 
                placeholder='Note Content'
                value={content} 
                onChange={(e)=>setContent(e.target.value)}
                rows={4}
                className='w-full border-2 border-black rounded-md p-3 text-black hover:border-3'
                />

                <button
                type='submit'
                disabled={loading}
                
                className='bg-blue-500 border-2 border-black rounded-md hover:bg-blue-700 px-6 disabled:opacity-50'>
                    {loading?'Creating...':"Create Note"}
                </button>
            </div>
        </form>

        <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Your Notes ({notes.length})</h2>

            {notes.length===0?(<p className='text-gray-500'>No Notes yet Create First Note Above</p>):
            (
                notes.map((note)=>(
                    <div key={note._id} className='bg-white p-6 rounded-lg shadow-md'>
                        <div className='flex justify-between items-start mb-2'>
                            <h3 className='text-lg font-semibold'>{note.title}</h3>
                            <div className='flex gap-2'>
                                <button className='text-blue-500 hover:text-blue-700 text-sm'>Edit</button>
                                <button className='text-red-500 hover:text-red-700 text-sm'onClick={()=>deleteNote(note._id)}>Delete</button>
                            </div>
                        </div>
                        <p className='text-gray-500 mb-2'>
                            {note.content}
                        </p>
                        <p>Created:{new Date(note.createdAt).toLocaleDateString()}</p>
                        {note.updatedAt!==note.createdAt && (
                            <p>Updated:{new Date(note.updatedAt).toLocaleDateString()}</p>
                        )}


                    </div>
                ))
            )}

        </div>
        
  
    </div>
    
  )
}

export default NotesClient
