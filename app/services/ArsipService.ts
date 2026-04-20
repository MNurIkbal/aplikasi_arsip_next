import fs from "fs";
import path from "path";
import archiver from "archiver";
import zipEncryptable from "archiver-zip-encryptable";
import { prisma } from "../utils/prisma";
import { successResponse, sendError } from "../utils/response";
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

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${judul.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.zip`;
    const filePath = path.join(uploadDir, fileName);
    const output = fs.createWriteStream(filePath);

    let archive: any;


    if (kategori === DOKUMEN_RAHASIA && password_arsip) {
        archive = archiver('zip-encryptable', {
            zlib: { level: 9 },
            forceLocalTime: true,
            password: password_arsip || undefined
        });
    } else {

        archive = archiver('zip', {
            zlib: { level: 9 }
        });
    }

    try {
        await new Promise((resolve, reject) => {
            output.on('close', async () => {
                try {
                    const paramsJson = attachments.map((item) => {
                        return {
                            nama_dokumen: item.nama_dokumen,
                            file: item.savedFileName || null
                        };
                    });

                    const finalData = {
                        items: paramsJson,
                        zip: `/uploads/zip/${fileName}`
                    };

                    let hashedPassword = null;
                    if (kategori === DOKUMEN_RAHASIA && password_arsip) {
                        hashedPassword = await bcrypt.hash(password_arsip, 10);
                    }

                    const newArsip = await prisma.arsip.create({
                        data: {
                            judul,
                            tanggal: new Date(tanggal),
                            kategori: kategori,
                            password_arsip: hashedPassword,
                            params: JSON.stringify(finalData),
                            created_at: nowWib(),
                            updated_at: null
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

                            const safeName = item.nama_dokumen
                                .replace(/[^a-z0-9]/gi, "_")
                                .toLowerCase();

                            const fileNameRaw = `${safeName}-${Date.now()}${originalExt}`;
                            const filePathRaw = path.join(uploadDir, fileNameRaw);

                            fs.writeFileSync(filePathRaw, buffer);

                            archive.append(buffer, { name: fileNameRaw });

                            item.savedFileName = fileNameRaw;
                        }
                    }

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


export async function getArsipResource({ search, page, limit, sort, order }: GetArsipParams) {
    const skip = (page - 1) * limit;
    const take = limit;

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
                where
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
        throw error;
    }
}