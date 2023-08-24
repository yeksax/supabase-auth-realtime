# SvelteKit + Supabase

> Webapp desenvolvido em Svelte e potencializado pelo Supabase, explorando suas funcionalidades de autenticação segura e recursos em tempo real. Um curto projeto para estudos a respeito de desenvolvimento web.
## Features

- 🕵️‍♂ Observação de alterações no banco de dados em tempo real. 
- 👥 Detector de presença
- 📢 Transmissão de eventos
- 🔐 Autenticação com OAuth
- ✉️ Autenticação com e-mail e senha
- 🔑 Recuperação de senhas
- 🪄 Magic Links
## Stack

- SvelteKit
- Supabase
- Typescript
- Tailwind

## Setup

### Supabase

1. Crie um novo projeto na [Supabase](https://supabase.com/dashboard/new/)
	- Lembre-se de definir a região para um local próximo de você para reduzir latência. 
2. Aguarde alguns instantes (ou minutos) e assim que estiver pronto:
	- Em **Project API Keys** guarde o token `anon public`
	- Em **Project Configuration** guarde a `project url`
3. Autorizando os [auth providers](https://supabase.com/dashboard/project/_/auth/providers) (opcional caso queira fazer login com Github)
	- Procure por Github e autorize
	- Visite a aba de OAuth Apps no [Github](https://github.com/settings/developers) > New OAuth App
	- Em **Homepage URL** insira um link para a página, localmente, o padrão é http://localhost:5173 
	- Em **Authorization callback URL** cole o **Callback URL (for OAuth)** dado pela Supabase
	- Copie o **Client ID** e preencha na Supabase
	- Gere um novo **Client Secret** e preencha na Supabase
4. Hora de [criar as tabelas](https://supabase.com/dashboard/project/_/sql/new) , copie e cole as queries abaixo no **SQL Editor**

```sql
/* Criando a tabela de mensagens */

create table
 public.messages (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone not null default now(),
  content text not null default ''::text,
  author uuid null,

  constraint messages_author_fkey foreign key (author) references auth.users (id) on delete set null
 ) tablespace pg_default;


/* Permitindo Row Level Security e Realtime */

alter table public.messages enable row level security;

alter publication supabase_realtime add table messages;

create schema if not exists realtime;


/* Criando as políticas */
  
create policy "Autorizar INSERT para usuários autenticados apenas" on "public"."messages" as PERMISSIVE for insert
 to authenticated with check (true);

create policy "Autorizar SELECT para usuários autenticados apenas" on "public"."messages" as PERMISSIVE for
select

 to authenticated using (true);
```

### A codebase

5. Clone o repositório `git clone https://github.com/yeksax/supabase-auth-realtime`
6. Vá para o diretório do projeto `cd supabase-auth-realtime`
7. Instale as dependências com `npm install`
8. Crie seu `.env` na raiz do projeto e insira as keys que pegamos no passo 2

```env
PUBLIC_SUPABASE_ANON_KEY=********
PUBLIC_SUPABASE_URL=********
```

9. Execute com `npm run dev`

#### Opcional

- Atualize a definição dos tipos do banco de dados 
	- Faça login em sua conta do Supabase via CLI com `npx supabase login`
	- Em `package.json`, em `scripts`, atualize `supabase-types` substituindo `[project-id]` pelo id do seu projeto
	- Rode o script com `npm run supabase-types`