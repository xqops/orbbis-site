# Orbbis — Discord Bot Builder

> Editor visual para criar bots Discord sem escrever código.
> Gera um projeto completo em Node.js (Discord.js v14) pronto para hospedar.

## 🚀 Como usar

1. Acesse [orbbis.app/editor](https://orbbis.app/editor)
2. Cole o token do seu bot (Discord Developer Portal)
3. Configure comandos, sistemas e identidade
4. Clique em **"Gerar Bot"** e baixe o ZIP
5. Faça o upload no [Discloud](https://discloud.app), Railway ou Render

## 📁 Estrutura do projeto

```
orbbis/
├── editor.html              ← Editor principal (HTML limpo)
├── index.html               ← Landing page
├── docs.html                ← Documentação
├── privacy.html             ← Política de privacidade
├── server.js                ← Servidor Express (serve os arquivos)
├── package.json
├── discloud.config
│
├── css/
│   └── editor.css           ← Todos os estilos do editor
│
└── js/
    ├── translations.js      ← Strings de interface (EN / PT-BR)
    ├── systems-config.js    ← Configuração dos módulos do bot
    ├── bot-generator.js     ← Geração do código do bot (index.js)
    └── editor.js            ← Lógica da UI e interações
```

## 🛠 Stack

- **Frontend:** HTML, CSS, JavaScript puro (sem frameworks)
- **Backend:** Node.js + Express (serve os arquivos estáticos)
- **Bot gerado:** Discord.js v14, Node.js 20+
- **Hospedagem:** Discloud (via `discloud.config`)

## 📦 Rodar localmente

```bash
npm install
node server.js
# Acesse: http://localhost:8080
```

## 💬 Suporte

- Discord: [discord.gg/3ePFQtkdzm](https://discord.gg/3ePFQtkdzm)

## 📄 Licença

MIT — sinta-se livre para estudar, modificar e distribuir.
