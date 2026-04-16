import fs from "fs";
import path from "path";
import archiver from "archiver";
// @ts-ignore
import zipEncryptable from "archiver-zip-encryptable";
import { prisma } from "../utils/prisma";
import { successResponse, sendError } from "../utils/response"; // Pastikan sendError tersedia
import bcrypt from "bcrypt";

archiver.registerFormat('zip-encryptable', zipEncryptable);

export async function store(data: {
    judul: string;
    tanggal: string;
    kategori: string;
    password_arsip?: string | null;
    attachments: any[];
}) {
    const { judul, attachments, password_arsip, tanggal, kategori } = data;

    // 1. Validasi Folder
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${judul.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.zip`;
    const filePath = path.join(uploadDir, fileName);
    const output = fs.createWriteStream(filePath);

    // 2. Setup Archiver
    const archive = archiver('zip-encryptable', {
        zlib: { level: 9 },
        forceLocalTime: true,
        password: password_arsip || undefined 
    });

    try {
        const result = await new Promise((resolve, reject) => {
            output.on('close', async () => {
                try {
                    // Mapping Params ke JSON
                    const paramsJson = attachments.map((item) => {
                        const originalExt = path.extname(item.file?.name || '');
                        return {
                            nama_dokumen: item.nama_dokumen,
                            file: `${item.nama_dokumen}${originalExt}`
                        };
                    });

                    // Hashing Password jika Rahasia
                    let hashedPassword = null;
                    if (kategori === "Dokumen Rahasia" && password_arsip) {
                        hashedPassword = await bcrypt.hash(password_arsip, 10);
                    }

                    // Simpan ke DB
                    const newArsip = await prisma.arsip.create({
                        data: {
                            judul,
                            tanggal: new Date(tanggal),
                            kategori: kategori, // Casting Enum
                            password_arsip: hashedPassword,
                            params: JSON.stringify(paramsJson), // Format JSON
                        }
                    });

                    resolve(newArsip);
                } catch (dbError) {
                    reject(dbError);
                }
            });

            archive.on('error', (err: any) => reject(err));
            archive.pipe(output);

            const processAttachments = async () => {
                try {
                    for (const item of attachments) {
                        if (item.file && item.file instanceof File) {
                            const arrayBuffer = await item.file.arrayBuffer();
                            const buffer = Buffer.from(arrayBuffer);
                            const originalExt = path.extname(item.file.name);
                            const internalFileName = `${item.nama_dokumen}${originalExt}`;
                            archive.append(buffer, { name: internalFileName });
                        }
                    }
                    archive.finalize();
                } catch (err) {
                    reject(err);
                }
            };

            processAttachments();
        });

        // JIKA BERHASIL
        return successResponse(null, 'Data berhasil ditambahkan', 201);

    } catch (error: any) {
        // JIKA ERROR
        console.error("Store Service Error:", error);
        return sendError(error.message || "Gagal memproses data", 500);
    }
}