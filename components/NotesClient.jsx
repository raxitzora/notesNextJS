"use client"
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const NotesClient = ({ initialNotes }) => {
    const [notes, setNotes] = useState(initialNotes)
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null); 
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const createNote = async (e) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) return;
        setLoading(true);

        try {
            const response = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });

            const result = await response.json();

            if (result.success) {
                setNotes([result.data, ...notes]);
                toast.success("Notes Created successfully");
                setTitle("");
                setContent("");
            }

        } catch (error) {
            console.error("Error creating note:", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();

            if (result.success) {
                setNotes(notes.filter(note => note._id !== id));
                toast.success("Notes Deleted Successfully");
            }

        } catch (error) {
            console.error("Error deleting notes", error);
            toast.error("Something went wrong");
        }
    };

    const updateNote = async (id) => {
        if (!editTitle.trim() || !editContent.trim()) return;
        setLoading(true);

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: editTitle, content: editContent })
            });

            const result = await response.json();

            if (result.success) {
                toast.success("Notes updated successfully");
                setNotes(notes.map(note =>
                    note._id === id ? result.data : note
                ));
                setEditingId(null);
                setEditTitle("");
                setEditContent("");
            }

        } catch (error) {
            console.error("Error updating note", error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const startEdit = (note) => {
        setEditingId(note._id);
        setEditTitle(note.title);
        setEditContent(note.content);
    };

    return (
        <div className="space-y-6">

            {/* Create Note */}
            <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={createNote}>
                <h2 className="text-xl font-semibold mb-4 text-black">Create New Note</h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        className="w-full border-2 border-black rounded-md p-3 text-black"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Note Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full border-2 border-black rounded-md p-3 text-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 border-2 border-black rounded-md hover:bg-blue-700 px-6 py-2 disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Note"}
                    </button>
                </div>
            </form>

            {/* Notes List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Your Notes ({notes.length})</h2>

                {notes.length === 0 ? (
                    <p className="text-gray-500">No Notes yet. Create your first note above.</p>
                ) : (
                    notes.map(note => (
                        <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">

                            {editingId === note._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full border-2 border-black rounded-md p-2 mb-2 text-black"
                                    />

                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        rows={4}
                                        className="w-full border-2 border-black rounded-md p-2 mb-2 text-black"
                                    />

                                    <div className="flex gap-2">
                                        <button
                                            className="bg-green-500 border-2 border-black rounded-md px-4 py-1 text-sm"
                                            onClick={() => updateNote(note._id)}
                                            disabled={loading}
                                        >
                                            {loading ? "Updating..." : "Save"}
                                        </button>

                                        <button
                                            className="bg-gray-400 border-2 border-black rounded-md px-4 py-1 text-sm"
                                            onClick={() => setEditingId(null)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">{note.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                                onClick={() => startEdit(note)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                onClick={() => deleteNote(note._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 mb-2">{note.content}</p>
                                    <p>Created: {new Date(note.createdAt).toLocaleDateString()}</p>

                                    {note.updatedAt !== note.createdAt && (
                                        <p>Updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
                                    )}
                                </>
                            )}

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotesClient;
