// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL || "";
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// export const handleRegister = async (
//   userId: string,
//   password: string,
//   firstName: string,
//   lastName: string
// ): Promise<{ success: true }> => {
//   if (!userId) throw new Error("User is not defined");

//   const { error: pwError } = await supabase.auth.updateUser({ password });
//   if (pwError) throw new Error("Failed to set password: " + pwError.message);

//   const { error: profileError } = await supabase
//     .from("profiles")
//     .update({
//       first_name: firstName,
//       last_name: lastName,
//     })
//     .eq("id", userId);

//   if (profileError)
//     throw new Error("Failed to update profile: " + profileError.message);

//   return { success: true };
// };
