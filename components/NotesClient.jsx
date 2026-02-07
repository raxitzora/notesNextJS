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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

            {/* Create Note */}
            <form
                onSubmit={createNote}
                className="bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-sm p-5 sm:p-6 lg:p-8"
            >
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
                    Create New Note
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Note title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm sm:text-base
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    />

                    <textarea
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm sm:text-base
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg
                                   bg-blue-600 px-6 py-2.5 text-sm sm:text-base font-medium text-white
                                   hover:bg-blue-700 active:scale-[0.98]
                                   disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Creating..." : "Create Note"}
                    </button>
                </div>
            </form>

            {/* Notes List */}
            <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Your Notes ({notes.length})
                </h2>

                {notes.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
                        No notes yet. Create your first note above.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {notes.map(note => (
                            <div
                                key={note._id}
                                className="group relative bg-white border border-gray-200 rounded-xl
                                           p-5 shadow-sm hover:shadow-md transition"
                            >
                                {editingId === note._id ? (
                                    <>
                                        <input
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-2
                                                       focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />

                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={4}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2 mb-3
                                                       focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                        />

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateNote(note._id)}
                                                disabled={loading}
                                                className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm
                                                           text-white hover:bg-green-700 disabled:opacity-50 transition"
                                            >
                                                {loading ? "Saving..." : "Save"}
                                            </button>

                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 rounded-md bg-gray-200 px-3 py-2 text-sm
                                                           text-gray-700 hover:bg-gray-300 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2">
                                                {note.title}
                                            </h3>

                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => startEdit(note)}
                                                    className="text-xs text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteNote(note._id)}
                                                    className="text-xs text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 line-clamp-4 mb-3">
                                            {note.content}
                                        </p>

                                        <div className="text-xs text-gray-400 space-y-0.5">
                                            <p>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
                                            {note.updatedAt !== note.createdAt && (
                                                <p>Updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotesClient;
