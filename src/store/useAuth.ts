import { create } from "zustand";
import { load, save } from "../utils/storage";
type User = { id: string; email: string; name: string; dob?: string };
type State = {
  user: User | null;
  token: string | null;
  signIn: (e: string, p: string) => Promise<void>;
  signUp: (u: User & { password: string }) => Promise<void>;
  signOut: () => void;
};
const usersKey = "users_db_bad";

export const useAuth = create<State>((set) => ({
  user: load<User | null>("auth_user", null),
  token: load<string | null>("auth_token", null),

  async signIn(email, password) {
    const db: any[] = load(usersKey, [
      { id: "u1", email: "myca2@gmail.com	", password: "myca2", name: "Demo User" }
    ]);
    const f = db.find(u => u.email.toLowerCase()===email.toLowerCase() && u.password===password);
    if (!f) throw new Error("Credenciais inválidas.");
    const token = btoa(`${f.id}:${Date.now()}`);
    const user = { id: f.id, email: f.email, name: f.name, dob: f.dob };
    save("auth_user", user); save("auth_token", token);
    set({ user, token });
  },

  async signUp(u) {
    const db: any[] = load(usersKey, []);
    if (db.some(x => x.email.toLowerCase() === u.email.toLowerCase())) throw new Error("E-mail já cadastrado");
    db.push(u); save(usersKey, db);
    const token = btoa(`${u.id}:${Date.now()}`);
    save("auth_user", { id: u.id, email: u.email, name: u.name, dob: u.dob });
    save("auth_token", token);
    set({ user: { id: u.id, email: u.email, name: u.name, dob: u.dob }, token });
  },

  signOut() {
    save("auth_user", null); save("auth_token", null);
    set({ user: null, token: null });
  }
}));
