import dbConnect from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function POST(request){
    try {
        await dbConnect();
        const body = await request.json();
        const note = await Note.create(body);

        return NextResponse.json({success:true,data:note},{status:201})
        
    } catch (error) {
        return NextResponse.json({success:false,error:error.message},{status:400})
        
    }
}