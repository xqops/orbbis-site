/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  Orbbis — Bot Editor · Traduções (EN / PT-BR)        ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * Objeto TR com todas as strings de interface.
 * Para adicionar um novo idioma, copie o bloco "en" e
 * crie uma nova chave (ex: "es") com as traduções.
 *
 * Usado por: applyLang() em editor.js
 */

// ── LANG ──
const TR={
  en:{
    'btn-home':'← Back to home',
    'sidebar-logo':'Bot Editor',
    'step1-label':'Token & Identity','step1-desc':'Connect your bot',
    'step2-label':'Commands','step2-desc':'Custom slash commands',
    'step3-label':'Systems','step3-desc':'Modules & features',
    'step4-label':'Download','step4-desc':'Get your bot files','step5-label':'Add to Discord','step5-desc':'Invite your bot','section5-title':'Add to Discord','section5-sub':'Invite your bot to your server with the right permissions.','invite-title':'🔗 Invite Link','invite-sub':"Click to copy your bot invite link and open it in the browser.",'invite-open':'🔗 Open Invite Link','perms-title':'Permissions included','how-title':'📋 How to add your bot','how-step1':'Click <b style="color:var(--ink)">Open Invite Link</b> above','how-step2':'Select your Discord server from the dropdown','how-step3':'Click <b style="color:var(--ink)">Authorize</b>','how-step4':'Complete the CAPTCHA if prompted','how-step5':'Your bot will appear in the member list! 🎉','copy-btn':'Copy','save-title':'Save your project','save-desc':'So you can edit your bot later without starting over.','btn-export':'💾 Save project (orbbis.json)','btn-import':'📂 Import project','welcome-title':'What do you want to do?','welcome-sub':'Start a new bot or continue editing an existing project.','welcome-new':'Start from scratch','welcome-new-desc':'Create a new bot step by step.','welcome-import':'Import project','welcome-import-desc':'Load an orbbis.json and continue where you left off.','welcome-footer':'Free forever · No account needed','invite-placeholder':'⚠️ Validate your token in Step 1 first',
    'section1-badge':'Step 1 of 5','section1-title':'Token & Identity','section1-sub':'Connect your Discord bot and set its personality.',
    'section2-badge':'Step 2 of 5','section2-title':'Commands','section2-sub':'Create custom slash commands for your bot.',
    'section3-badge':'Step 3 of 5','section3-title':'Systems','section3-sub':'Enable powerful features for your bot with one click.',
    'section4-badge':'Step 4 of 5','section5-badge':'Step 5 of 5',
    'card-token-title':'🔑 Bot Token','card-token-sub':'Go to Discord Developer Portal → Your App → Bot → Reset Token → Copy.',
    'card-intents-title':'⚡ Privileged Gateway Intents','card-intents-sub':'Required for your bot to work. Enable these in the Discord Developer Portal.','intents-link-title':'Open Discord Developer Portal','intents-link-sub':'Your App → Bot → Privileged Gateway Intents','intent-presence':'Presence Intent','intent-presence-desc':'Allows the bot to see user presence/status','intent-members':'Server Members Intent','intent-members-desc':'Allows the bot to see server members','intent-message':'Message Content Intent','intent-message-desc':'Allows the bot to read message content','card-identity-title':'🤖 Bot Identity','card-identity-sub':'Set your bot\'s prefix.',
    'card-status-title':'💬 Bot Status','card-status-sub':'What your bot shows as its activity in Discord.',
    'label-token':'Bot Token','label-clientid':'Client ID','label-botname':'Bot Name',
    'label-color':'Embed Color','label-prefix':'Command Prefix','label-status-type':'Status Type',
    'label-status-text':'Status Text','label-status-emoji':'Status Emoji',
    'label-trigger':'Trigger','label-desc':'Description','label-response':'Response',
    'label-image':'Image / GIF',
    'download-title':'Your bot is ready!','download-sub':'Download the ZIP and host it wherever you want — Discloud, Railway, Render. You decide where it runs.',
    'download-btn':'⬇️ Download Bot ZIP',
    'run-local-title':'Run locally on your PC','run-local-sub':'After downloading and extracting the ZIP, open a terminal in the bot folder and run:',
    'run-step1-label':'Step 1 — Install dependencies','run-step2-label':'Step 2 — Start the bot',
    'run-tip-windows':'Right-click inside the bot folder → <b>Open in Terminal</b>',
    'run-tip-linux':'<code style="font-size:11px">cd ~/Downloads/bot-folder</code> then run the commands above',
    'btn-back':'← Back','btn-next':'Continue →','btn-next-final':'🚀 Generate Bot',
    'preview-title':'Live Preview',
    'cmd-empty':'No commands yet. Add your first one!',
    'btn-add-cmd':'+ Add Command',
    'cmd-new':'New Command','cmd-edit':'Edit Command',
    'cmd-cancel':'Cancel','cmd-save':'Save Command',
    'hosting-title':'🌐 Hosting Options','hosting-sub':'Choose where to host your bot. Most options are free.','nodejs-title':'Node.js required to run your bot','nodejs-sub':'Click to download Node.js LTS — free and easy to install','mobile-title':'You\'re on mobile!','mobile-desc':'Running the bot locally requires a computer with Node.js. On mobile, we recommend using a hosting platform like <b>Discloud</b> or <b>Railway</b> below — just upload the ZIP and done!',
    'label-img-pos':'Image Position','pos-below':'Below text','pos-thumbnail':'Top right',
    'img-remove':'✕ Remove image',
    'sys-enabled':'Enabled','sys-disabled':'Disabled',
  },
  pt:{
    'btn-home':'← Voltar ao início',
    'sidebar-logo':'Editor de Bot',
    'step1-label':'Token & Identidade','step1-desc':'Conecte seu bot',
    'step2-label':'Comandos','step2-desc':'Comandos slash personalizados',
    'step3-label':'Sistemas','step3-desc':'Módulos e funcionalidades',
    'step4-label':'Download','step4-desc':'Baixe os arquivos do bot','step5-label':'Adicionar ao Discord','step5-desc':'Convide seu bot','section5-title':'Adicionar ao Discord','section5-sub':'Convide seu bot para o servidor com as permissões certas.','invite-title':'🔗 Link de Convite','invite-sub':'Clique para copiar o link de convite e abrir no navegador.','invite-open':'🔗 Abrir Link de Convite','perms-title':'Permissões incluídas','how-title':'📋 Como adicionar seu bot','how-step1':'Clique em <b style="color:var(--ink)">Abrir Link de Convite</b> acima','how-step2':'Selecione seu servidor Discord no menu','how-step3':'Clique em <b style="color:var(--ink)">Autorizar</b>','how-step4':'Complete o CAPTCHA se solicitado','how-step5':'Seu bot vai aparecer na lista de membros! 🎉','copy-btn':'Copiar','save-title':'Salve seu projeto','save-desc':'Para editar seu bot depois sem precisar começar do zero.','btn-export':'💾 Salvar projeto (orbbis.json)','btn-import':'📂 Importar projeto','welcome-title':'O que você quer fazer?','welcome-sub':'Comece um bot novo do zero ou continue editando um projeto existente.','welcome-new':'Começar do zero','welcome-new-desc':'Crie um novo bot passo a passo.','welcome-import':'Importar projeto','welcome-import-desc':'Carregue um arquivo orbbis.json e continue de onde parou.','welcome-footer':'Grátis para sempre · Sem conta necessária','invite-placeholder':'⚠️ Valide seu token no Passo 1 primeiro',
    'section1-badge':'Passo 1 de 5','section1-title':'Token & Identidade','section1-sub':'Conecte seu bot Discord e defina sua personalidade.',
    'section2-badge':'Passo 2 de 5','section2-title':'Comandos','section2-sub':'Crie comandos slash personalizados para o seu bot.',
    'section3-badge':'Passo 3 de 5','section3-title':'Sistemas','section3-sub':'Ative recursos poderosos para o seu bot com um clique.',
    'section4-badge':'Passo 4 de 5','section5-badge':'Passo 5 de 5',
    'card-token-title':'🔑 Token do Bot','card-token-sub':'Vá no Discord Developer Portal → Seu App → Bot → Resetar Token → Copiar.',
    'card-intents-title':'⚡ Privileged Gateway Intents','card-intents-sub':'Obrigatório para o bot funcionar. Ative no Discord Developer Portal.','intents-link-title':'Abrir Discord Developer Portal','intents-link-sub':'Seu App → Bot → Privileged Gateway Intents','intent-presence':'Presence Intent','intent-presence-desc':'Permite ver o status/presença dos usuários','intent-members':'Server Members Intent','intent-members-desc':'Permite ver os membros do servidor','intent-message':'Message Content Intent','intent-message-desc':'Permite ler o conteúdo das mensagens','card-identity-title':'🤖 Identidade do Bot','card-identity-sub':'Defina o prefixo do seu bot.',
    'card-status-title':'💬 Status do Bot','card-status-sub':'O que seu bot mostra como atividade no Discord.',
    'label-token':'Token do Bot','label-clientid':'Client ID','label-botname':'Nome do Bot',
    'label-color':'Cor do Embed','label-prefix':'Prefixo de Comando','label-status-type':'Tipo de Status',
    'label-status-text':'Texto do Status','label-status-emoji':'Emoji do Status',
    'label-trigger':'Gatilho','label-desc':'Descrição','label-response':'Resposta',
    'label-image':'Imagem / GIF',
    'download-title':'Seu bot está pronto!','download-sub':'Baixe o ZIP e hospede onde quiser — Discloud, Railway, Render. Você decide onde ele vai rodar.',
    'download-btn':'⬇️ Baixar ZIP do Bot',
    'run-local-title':'Rodar localmente no seu PC','run-local-sub':'Após baixar e extrair o ZIP, abra um terminal na pasta do bot e execute:',
    'run-step1-label':'Passo 1 — Instalar dependências','run-step2-label':'Passo 2 — Iniciar o bot',
    'run-tip-windows':'Clique com botão direito dentro da pasta do bot → <b>Abrir no Terminal</b>',
    'run-tip-linux':'<code style="font-size:11px">cd ~/Downloads/pasta-do-bot</code> e execute os comandos acima',
    'btn-back':'← Voltar','btn-next':'Continuar →','btn-next-final':'🚀 Gerar Bot',
    'preview-title':'Preview ao Vivo',
    'cmd-empty':'Nenhum comando ainda. Adicione o primeiro!',
    'btn-add-cmd':'+ Adicionar Comando',
    'cmd-new':'Novo Comando','cmd-edit':'Editar Comando',
    'cmd-cancel':'Cancelar','cmd-save':'Salvar Comando',
    'hosting-title':'🌐 Opções de Hospedagem','hosting-sub':'Escolha onde hospedar seu bot. A maioria é gratuita.','nodejs-title':'Node.js necessário para rodar seu bot','nodejs-sub':'Clique para baixar o Node.js LTS — gratuito e fácil de instalar','mobile-title':'Você está no celular!','mobile-desc':'Rodar o bot localmente requer um computador com Node.js. No celular, recomendamos usar uma plataforma de hospedagem como <b>Discloud</b> ou <b>Railway</b> abaixo — só fazer upload do ZIP e pronto!',
    'label-img-pos':'Posição da Imagem','pos-below':'Abaixo do texto','pos-thumbnail':'Superior direito',
    'img-remove':'✕ Remover imagem',
    'sys-enabled':'Ativado','sys-disabled':'Desativado',
  }
};

let currentLang=localStorage.getItem('orbbis-lang')||'en';

