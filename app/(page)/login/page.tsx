"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store";
import { loginSchema } from "@/app/lib/validation";

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-xl"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error API */}
          {error && (
            <p className="text-red-500 text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 cursor-pointer bg-indigo-600 text-white rounded-xl"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}