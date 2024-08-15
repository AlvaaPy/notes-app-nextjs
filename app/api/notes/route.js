import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const notes = await prisma.notesDb.findMany();
        return NextResponse.json(notes);
    } catch (error) {
        console.error("Gagal mendapatkan list Notes:", error);
        return NextResponse.error(new Error('Gagal mendapatkan list Notes....'));
    }
}

export async function POST(req) {
    const { title, body } = await req.json();
    try {
        const newNote = await prisma.notesDb.create({
            data: {
                title,
                body,
            },
        });
        return NextResponse.json(newNote, { status: 201 }); 
    } catch (error) {
        console.error("Gagal membuat catatan:", error); 
        return NextResponse.error(new Error('Gagal membuat catatan....'));
    }
}
