# Alana Behind the Scenes ✦

O QG da Alana: ideias, conteúdos, músicas, astrologia e muito glitter.

## Rodar no seu PC

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Colocar no ar (Vercel)

1. Cria um repositório no GitHub chamado `alanabts` e sobe esta pasta.
2. Entra em vercel.com > **Add New > Project** > escolhe o repositório `alanabts` > **Deploy**.
3. O link fica `alanabts.vercel.app` (se o nome estiver livre).

Toda vez que você der `git push`, o site atualiza sozinho.

## Onde mexer

| O que | Arquivo |
|---|---|
| Playlists e podcasts do player | `config/midia.ts` |
| Frases do dia | `config/frases.ts` |
| Temas das notícias e palavras bloqueadas | `config/noticias.ts` |
| Abas do menu | `config/site.ts` |
| Cores e visual | `app/globals.css` |
