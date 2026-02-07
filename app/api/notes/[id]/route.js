import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(request,{params}){
    try {
        const {id} = await params;
        await dbConnect()
        const note = await Note.findByIdAndDelete(id)

        if(!note){
            NextResponse.json({success:false,error:"Note not found"},{status:404})
        }
        return NextResponse.json({success:true,data:{}})
        
    } catch (error) {
        return NextResponse.json({success:false,error:message},{status:400})
        
    }

}