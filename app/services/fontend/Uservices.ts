
export const UserService = {
  /**
   * Method untuk membuat user baru (Create)
   * @param data - Objek dari form (name, email, password, role, image)
   */
  create: async (data: any) => {
    const formData = new FormData();

    // Masukkan data teks ke dalam FormData
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("role", data.role);

    // Masukkan file gambar jika ada
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await fetch("/api/users", {
      method: "POST",
      body: formData, // Mengirim FormData secara otomatis mengatur header multipart/form-data
    });

    return response;
  },

  /**
   * Method untuk memperbarui data user (Update)
   * @param id - ID user yang akan diupdate
   * @param data - Data baru dari form
   */
  update: async (id: number, data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);

    // Hanya kirim gambar baru jika user mengupload file baru
    if (data.image) {
      formData.append("image", data.image);
    }


    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      body: formData,
    });

    return response;
  }
};