import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const senha = credentials?.senha;
        if (typeof email !== "string" || typeof senha !== "string" || !email || !senha) {
          return null;
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });
        if (!usuario || !usuario.ativo) return null;

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.papel = user.papel;
        return token;
      }
      // Sessão antiga: se o usuário sumiu do banco (removido/banco recriado) ou foi
      // desativado, retornar null invalida o token e derruba a sessão de vez —
      // senão o proxy vê o cookie como válido e devolve o usuário ao dashboard.
      const atual = await prisma.usuario.findUnique({
        where: { id: token.id },
        select: { ativo: true, papel: true },
      });
      if (!atual?.ativo) return null;
      token.papel = atual.papel;
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.papel = token.papel;
      return session;
    },
  },
});
