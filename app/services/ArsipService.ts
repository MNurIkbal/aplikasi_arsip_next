import fs from "fs";
import path from "path";
import archiver from "archiver";
// @ts-ignore
import zipEncryptable from "archiver-zip-encryptable";
import { prisma } from "../utils/prisma";
import { successResponse, sendError } from "../utils/response"; // Pastikan sendError tersedia
import bcrypt from "bcrypt";
import { GetArsipParams } from "../types/GlobalType";
import { DOKUMEN_RAHASIA } from "../types/Constant";
import { nowWib } from "../utils/helper";

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

    // 2. Setup Archiver (LOGIKA DIPERBAIKI)
    let archive: any;
    

    if (kategori === DOKUMEN_RAHASIA && password_arsip) {
        // Jika rahasia, gunakan zip-encryptable dengan password
        archive = archiver('zip-encryptable', {
            zlib: { level: 9 },
            forceLocalTime: true,
            password: password_arsip || undefined
        });
    } else {
        
        // Jika selain Dokumen Rahasia, gunakan archiver standar tanpa password
        archive = archiver('zip', {
            zlib: { level: 9 }
        });
    }

    try {
        await new Promise((resolve, reject) => {
            // Event ketika file selesai ditulis ke disk
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

                    // Hashing Password hanya jika Rahasia & ada password
                    let hashedPassword = null;
                    if (kategori === "Dokumen Rahasia" && password_arsip) {
                        hashedPassword = await bcrypt.hash(password_arsip, 10);
                    }

                    // Simpan ke DB
                    const newArsip = await prisma.arsip.create({
                        data: {
                            judul,
                            tanggal: new Date(tanggal),
                            kategori: kategori,
                            password_arsip: hashedPassword,
                            params: JSON.stringify(paramsJson),
                            created_at: nowWib(),
                            updated_at: null
                        }
                    });

                    resolve(newArsip);
                } catch (dbError) {
                    reject(dbError);
                }
            });

            // Handle error pada archiver
            archive.on('error', (err: any) => reject(err));

            // Pipe data archive ke file output
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
                    // Selesaikan proses archiver
                    archive.finalize();
                } catch (err) {
                    reject(err);
                }
            };

            processAttachments();
        });

        return successResponse(null, 'Data berhasil ditambahkan', 201);

    } catch (error: any) {
        console.error("Store Service Error:", error);
        return sendError(error.message || "Gagal memproses data", 500);
    }
}


export async function getArsipResource({ search, page, limit,sort,order }: GetArsipParams) {
    const skip = (page - 1) * limit;
    const take = limit;

    // Filter Query
    const where = search
    ? {
        OR: [
            { judul: { contains: search } },
            { kategori: { contains: search } },
        ],
    }
    : {};
    

    try {
    const [data, total] = await Promise.all([
        prisma.arsip.findMany({
            where,
            orderBy: {
            [sort]: order, 
            }, 
            skip,
            take,
        }),
        prisma.arsip.count({ 
            where //
        }),
    ]);

    return {
        data,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
    } catch (error) {
        throw error; // Biarkan ditangkap oleh catch di route.ts
    }
}