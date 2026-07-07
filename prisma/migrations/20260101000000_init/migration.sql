-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('ADMINISTRADOR', 'COMERCIAL');

-- CreateEnum
CREATE TYPE "Origem" AS ENUM ('INDICACAO', 'TELEFONE', 'WHATSAPP', 'SITE', 'VISITA_PRESENCIAL', 'REDES_SOCIAIS', 'OUTRO');

-- CreateEnum
CREATE TYPE "Servico" AS ENUM ('TROCA_CONTABILIDADE', 'ABERTURA_EMPRESA', 'MEI_REGULARIZACAO', 'FOLHA_PAGAMENTO', 'CONSULTORIA_FISCAL', 'OUTRO');

-- CreateEnum
CREATE TYPE "StatusProspect" AS ENUM ('ATIVO', 'CLIENTE', 'PERDIDO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "papel" "Papel" NOT NULL DEFAULT 'COMERCIAL',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "receberAlertaEmail" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "cnpj" TEXT,
    "contato" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "origem" "Origem" NOT NULL,
    "servico" "Servico" NOT NULL,
    "cadastro" DATE NOT NULL,
    "status" "StatusProspect" NOT NULL DEFAULT 'ATIVO',
    "baixa" DATE,
    "baixaPorId" TEXT,
    "obs" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interacao" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "texto" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,

    CONSTRAINT "Interacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anexo" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "nomeOriginal" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "tamanhoBytes" INTEGER NOT NULL,
    "uploaderId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Anexo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL DEFAULT 'config',
    "diasAlerta" INTEGER NOT NULL DEFAULT 15,
    "destacarLinhas" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Prospect_status_cadastro_idx" ON "Prospect"("status", "cadastro");

-- CreateIndex
CREATE INDEX "Prospect_empresa_idx" ON "Prospect"("empresa");

-- CreateIndex
CREATE INDEX "Prospect_contato_idx" ON "Prospect"("contato");

-- CreateIndex
CREATE INDEX "Prospect_cnpj_idx" ON "Prospect"("cnpj");

-- CreateIndex
CREATE INDEX "Interacao_prospectId_data_idx" ON "Interacao"("prospectId", "data");

-- CreateIndex
CREATE INDEX "Anexo_prospectId_idx" ON "Anexo"("prospectId");

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_baixaPorId_fkey" FOREIGN KEY ("baixaPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interacao" ADD CONSTRAINT "Interacao_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anexo" ADD CONSTRAINT "Anexo_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

