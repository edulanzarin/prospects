# Navecon — Sistema de Prospecção Comercial

Sistema interno de prospecção de clientes da Navecon: cadastro de prospects, histórico de
contatos, anexos, alerta automático de prospects parados e acompanhamento em dashboard.

Stack: Next.js (App Router) + PostgreSQL + Prisma, autenticação própria (Auth.js/Credentials),
100% dockerizado.

## Rodando em produção (servidor)

Pré-requisitos: Docker e Docker Compose instalados no servidor.

1. Copie o arquivo de variáveis de ambiente e edite os valores:

   ```bash
   cp .env.example .env
   ```

   Preencha pelo menos:
   - `POSTGRES_PASSWORD` — senha do banco.
   - `NEXTAUTH_SECRET` — gere com `openssl rand -base64 32`.
   - `NEXTAUTH_URL` — endereço pelo qual o sistema será acessado, ex.:
     `http://192.168.0.10:4013` (IP do servidor na rede local, porta 4013).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credenciais do administrador criado automaticamente
     no primeiro start.
   - `SMTP_*` (opcional) — se preenchido, o sistema envia todo dia um resumo por e-mail dos
     prospects em alerta para quem ativar a opção em "Configurações". Se deixar em branco, o
     sistema funciona normalmente e apenas não envia e-mails.

2. Suba os containers:

   ```bash
   docker compose up -d --build
   ```

   Isso cria o banco Postgres, aplica as migrations, cria o usuário administrador (se ainda
   não existir) e inicia o sistema — sem nenhum passo manual adicional.

3. Acesse `http://<ip-do-servidor>:4013` e entre com o e-mail/senha definidos em
   `ADMIN_EMAIL`/`ADMIN_PASSWORD`.

Dados do Postgres e os arquivos anexados aos prospects ficam em volumes Docker nomeados
(`pgdata` e `uploads_data`), preservados entre `docker compose down`/`up`.

Para atualizar após alterações no código, rode novamente `docker compose up -d --build` — a
migration e o seed são idempotentes (seguros de rodar mais de uma vez).

## Desenvolvimento local

```bash
npm install
npx prisma generate
npm run dev
```

Requer um `DATABASE_URL` válido no `.env` apontando para um Postgres (pode ser o mesmo do
`docker-compose.yml` rodando localmente com `docker compose up db`, ou `npx prisma dev` para
um Postgres local descartável).
