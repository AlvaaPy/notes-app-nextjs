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
                id: params.id, // id is already a string
            },
        });
        return NextResponse.json({ message: 'Note successfully deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting note:', error);
        return NextResponse.json({ error: 'Note not found or error deleting note' }, { status: 500 });
    }
};

// export async function DELETE(req, { params }) {
//     const { id } = params;
//     try {
//         console.log(`Mencoba menghapus catatan dengan ID: ${id}`);

//         // Periksa apakah catatan ada sebelum menghapusnya
//         const note = await prisma.notesDb.findUnique({
//             where: { id },
//         });

//         if (!note) {
//             console.log("Catatan tidak ditemukan");
//             return NextResponse.json({ message: "Catatan tidak ditemukan..." }, { status: 404 });
//         }

//         // Lakukan penghapusan catatan
//         await prisma.notesDb.delete({
//             where: { id },
//         });

//         console.log("Catatan berhasil dihapus");
//         return NextResponse.json({ message: "Catatan berhasil dihapus..." }, { status: 204 });
//     } catch (error) {
//         console.error("Error saat menghapus catatan:", error.message || error);
//         return NextResponse.json({ message: "Gagal menghapus catatan..." }, { status: 500 });
//     }
// }

