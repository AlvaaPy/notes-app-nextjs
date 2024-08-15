import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const { id } = params;
    try {
        const note = await prisma.notesDb.findUnique({
            where: { id },
        });
        if (note) {
            return NextResponse.json(note);
        } else {
            return NextResponse.status(404).json({ message: "Note tidak ada..." });
        }
    } catch (error) {
        console.error("Gagal mendapatkan data:", error);
        return NextResponse.error(new Error("Gagal mendapatkan data...."));
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const { title, body } = await req.json();
    try {
        const updatedNote = await prisma.notesDb.update({
            where: { id },
            data: { title, body },
        });
        return NextResponse.json(updatedNote);
    } catch (error) {
        console.error("Gagal mengedit Note:", error);
        return NextResponse.error(new Error("Gagal mengedit Note...."));
    }
}


export const DELETE = async (request, { params }) => {
    try {
        const note = await prisma.notesDb.delete({
            where: {
                id: params.id, 
            },
        });
        return NextResponse.json({ message: 'Note successfully deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ error: 'Note not found or error deleting note' }, { status: 500 });
    }
};


