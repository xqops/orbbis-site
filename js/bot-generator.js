/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  Orbbis — Bot Generator · Geração do Código do Bot   ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * Funções responsáveis por gerar o código-fonte do bot
 * e empacotá-lo em um arquivo ZIP para download.
 *
 * getSysConfig()     — lê os valores dos sistemas configurados no editor
 * generateIndexJs()  — gera o index.js completo do bot Discord.js
 * generateZip()      — monta o ZIP (index.js + package.json + discloud.config)
 *                      e dispara o download no navegador
 *
 * O bot gerado usa: discord.js v14, Node.js 20+
 */

// ── ZIP GENERATOR ──
function getSysConfig(){
  const cfg={};
  Object.entries(systems).forEach(([id,sys])=>{
    cfg[id]={};
    sys.fields.forEach(f=>{
      const el=document.getElementById(`sys-${id}-${f.id}`);
      if(!el) return;
      if(f.type==='categories-editor'){cfg[id][f.id]=catData['sys-'+id+'-'+f.id]||f.default||[];return;}
      if(f.type==='toggle') cfg[id][f.id]=el.checked;
      else if(f.type==='number') cfg[id][f.id]=parseInt(el.value)||f.default;
      else if(f.type==='upload') cfg[id][f.id]=el.value||'';
      else cfg[id][f.id]=el.value||f.default;
    });
  });
  return cfg;
}

function generateZip(platform='generic'){
  try{
  const token=document.getElementById('token').value.trim();
  const clientId=document.getElementById('client-id').value.trim();
  const botName=document.getElementById('preview-name').textContent||'My Bot';
  const prefix=document.getElementById('prefix').value||'/';
  const statusType=selectedStatus;
  const statusText=document.getElementById('status-text').value||'';
  const statusEmoji=selectedEmoji;
  const accentHex='7c3aed';

  if(!token){alert(currentLang==='pt'?'⚠️ Adicione seu token no Passo 1!':'⚠️ Please add your bot token in Step 1!');goStep(1);return;}

  const enabledSystems=Object.entries(systems).filter(([,s])=>s.enabled).map(([id])=>id);
  const sysConfig=getSysConfig();

  const indexJs=generateIndexJs(token,clientId,botName,prefix,statusType,statusText,statusEmoji,accentHex,commands,enabledSystems,sysConfig);
  const packageJson=JSON.stringify({name:botName.toLowerCase().replace(/\s+/g,'-'),version:'1.0.0',main:'index.js',scripts:{start:'node index.js'},dependencies:{'discord.js':'^14.14.1','dotenv':'^16.4.5'}},null,2);
  const envFile=`TOKEN=${token}\nCLIENT_ID=${clientId}\n`;
  const envExample=`TOKEN=your_bot_token_here\nCLIENT_ID=your_client_id_here\n`;
  const readme=generateReadme(botName,prefix,enabledSystems);
  const discloudConfig=`NAME=${botName}\nTYPE=bot\nMAIN=index.js\nRAM=100\nVERSION=recommended\nAVATAR=https://cdn.discordapp.com/embed/avatars/0.png\n`;

  // Platform-specific files
  let platformFiles=[];
  let zipSuffix='-bot';
  if(platform==='generic'){
    platformFiles=[
      {name:'start.bat',content:`@echo off\necho Installing dependencies...\nnpm install\necho.\necho Starting bot...\nnode index.js\npause\n`},
      {name:'start.sh',content:`#!/bin/bash\necho "Installing dependencies..."\nnpm install\necho ""\necho "Starting bot..."\nnode index.js\n`},
      {name:'HOW_TO_RUN.md',content:`# How to run your bot\n\n## Windows\nDouble-click **start.bat**\n\n## Linux / Mac\n1. Open terminal in this folder\n2. Run: \`chmod +x start.sh && ./start.sh\`\n\n## Manual\n\`\`\`\nnpm install\nnode index.js\n\`\`\`\n\n> Make sure [Node.js](https://nodejs.org) is installed first!\n`},
    ];
    zipSuffix='';
  } else if(platform==='discloud'){
    platformFiles=[{name:'discloud.config',content:`NAME=${botName}\nTYPE=bot\nMAIN=index.js\nRAM=100\nVERSION=recommended\nAUTORESTART=true\n`}];
    zipSuffix='-discloud';
  } else if(platform==='railway'){
    platformFiles=[
      {name:'railway.json',content:JSON.stringify({deploy:{startCommand:'node index.js',restartPolicyType:'ON_FAILURE'}},null,2)},
      {name:'Procfile',content:'worker: node index.js\n'},
      {name:'RAILWAY_SETUP.md',content:`# Railway Setup\n\n1. Create a project on [Railway](https://railway.app)\n2. Go to **Variables** and add:\n   - \`TOKEN\` = your bot token\n   - \`CLIENT_ID\` = your client ID\n3. Deploy!\n`},
    ];
    zipSuffix='-railway';
  } else if(platform==='render'){
    platformFiles=[
      {name:'render.yaml',content:`services:\n  - type: worker\n    name: ${botName.toLowerCase().replace(/\s+/g,'-')}\n    env: node\n    buildCommand: npm install\n    startCommand: node index.js\n    envVars:\n      - key: TOKEN\n        sync: false\n      - key: CLIENT_ID\n        sync: false\n`},
      {name:'RENDER_SETUP.md',content:`# Render Setup\n\n1. Create a **Background Worker** on [Render](https://render.com)\n2. Connect your GitHub repo\n3. Set **Build**: \`npm install\`, **Start**: \`node index.js\`\n4. Add env vars: \`TOKEN\` and \`CLIENT_ID\`\n`},
    ];
    zipSuffix='-render';
  } else if(platform==='digitalocean'){
    platformFiles=[
      {name:'DIGITALOCEAN_SETUP.md',content:`# DigitalOcean Setup\n\n## App Platform\n1. Push to GitHub\n2. Create App on [DigitalOcean](https://cloud.digitalocean.com/apps)\n3. Add env vars: \`TOKEN\` and \`CLIENT_ID\`\n\n## Droplet (VPS)\n1. Create Ubuntu Droplet\n2. SSH in and run:\n\`\`\`\nnpm install\nnode index.js\n\`\`\`\n`},
    ];
    zipSuffix='-digitalocean';
  }

  buildZip([
    {name:'index.js',content:indexJs},
    {name:'package.json',content:packageJson},
    {name:'.env',content:envFile},
    {name:'.env.example',content:envExample},
    {name:'README.md',content:readme},
    ...platformFiles
  ],botName.toLowerCase().replace(/\s+/g,'-')+zipSuffix);
  }catch(err){
    alert('Erro ao gerar o ZIP: '+err.message);
    console.error(err);
  }
}

function generateIndexJs(token,clientId,botName,prefix,statusType,statusText,statusEmoji,accentHex,cmds,enabledSystems,cfg={}){
  const accent=parseInt(accentHex,16)||0x7c3aed;
  const w=cfg.welcome||{};const a=cfg.automod||{};const g=cfg.giveaway||{};
  const p=cfg.polls||{};const tk=cfg.tickets||{};const x=cfg.xp||{};
  const ec=cfg.economy||{};const md=cfg.moderation||{};const lg=cfg.logs||{};
  const ar=cfg.autorole||{};const gb=cfg.goodbye||{};const inf=cfg.info||{};

  let code=`const { Client, GatewayIntentBits, Partials, REST, Routes, ActivityType, Events, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN || '${token}';
const CLIENT_ID = process.env.CLIENT_ID || '${clientId}';
const PREFIX = '${prefix}';
const ACCENT = ${accent};

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const rest = new REST({ version: '10' }).setToken(TOKEN);
const warnings = new Map();
const spamTrack = new Map();
${enabledSystems.includes('tickets')?`let ticketCount = 1;`:''}

function embed(data){ return new EmbedBuilder().setColor(ACCENT).setTimestamp(Date.now()).setFooter({ text: '${botName}' }).setTitle(data.title||null).setDescription(data.desc||null); }
function replace(str, member){ return (str||'').replace(/\\{user\\}/g,\`<@\${member.id}>\`).replace(/\\{username\\}/g,member.user?.username||member.username||'').replace(/\\{server\\}/g,member.guild?.name||'').replace(/\\{membercount\\}/g,String(member.guild?.memberCount||0)); }
async function findChannel(guild, name){ return guild.channels.cache.find(c=>c.name===name||c.id===name); }
async function findRole(guild, name){ return guild.roles.cache.find(r=>r.name===name||r.id===name); }

// ── READY ──
client.once(Events.ClientReady, async () => {
  console.log(\`✅ ${botName} online as \${client.user.username}\`);
  ${statusText.trim()?`client.user.setPresence({ activities: [{ name: '${(statusEmoji+' '+statusText).trim()}', type: ActivityType.${statusType} }], status: 'online' });`:`client.user.setPresence({ status: 'online' });`}

  const slashCmds = [
    ${cmds.map(c=>`{ name: '${c.name}', description: '${(c.description||'Custom command').replace(/'/g,"\\'")}' }`).join(',\n    ')}
    ${enabledSystems.includes('info')?`
    ,{ name: 'ping', description: 'Check bot latency' }
    ,{ name: 'serverinfo', description: 'Show server information' }
    ,{ name: 'userinfo', description: 'Show user info', options: [{ type: 6, name: 'user', description: 'The user', required: false }] }
    ,{ name: 'avatar', description: 'Show user avatar', options: [{ type: 6, name: 'user', description: 'The user', required: false }] }`:''}
    ${enabledSystems.includes('moderation')?`
    ,{ name: 'ban', description: 'Ban a member', options: [{ type: 6, name: 'user', description: 'User to ban', required: true },{ type: 3, name: 'reason', description: 'Reason', required: false }] }
    ,{ name: 'kick', description: 'Kick a member', options: [{ type: 6, name: 'user', description: 'User to kick', required: true },{ type: 3, name: 'reason', description: 'Reason', required: false }] }
    ,{ name: 'mute', description: 'Timeout a member', options: [{ type: 6, name: 'user', description: 'User to mute', required: true },{ type: 4, name: 'minutes', description: 'Duration in minutes', required: true },{ type: 3, name: 'reason', description: 'Reason', required: false }] }
    ,{ name: 'warn', description: 'Warn a member', options: [{ type: 6, name: 'user', description: 'User to warn', required: true },{ type: 3, name: 'reason', description: 'Reason', required: true }] }
    ,{ name: 'warnings', description: 'Show warnings of a member', options: [{ type: 6, name: 'user', description: 'The user', required: true }] }
    ,{ name: 'clearwarn', description: 'Clear warnings of a member', options: [{ type: 6, name: 'user', description: 'The user', required: true }] }
    ,{ name: 'purge', description: 'Delete messages', options: [{ type: 4, name: 'amount', description: 'Amount to delete', required: true }] }`:''}
    ${enabledSystems.includes('giveaway')?`,{ name: 'giveaway', description: 'Giveaway commands', options: [{ type: 1, name: 'start', description: 'Start a giveaway', options: [{ type: 3, name: 'prize', description: 'Prize', required: true },{ type: 4, name: 'minutes', description: 'Duration in minutes', required: false }] }] }`:''}
    ${enabledSystems.includes('polls')?`,{ name: 'poll', description: 'Create a poll', options: [{ type: 3, name: 'question', description: 'Poll question', required: true }] }`:''}
    ${enabledSystems.includes('tickets')?`,{ name: 'tickets', description: 'Post the ticket panel (admin)', defaultMemberPermissions: '8' }`:''}
  ].filter(Boolean);

  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: slashCmds });
    console.log(\`✅ \${slashCmds.length} commands registered!\`);
  } catch(e) { console.error('Commands error:', e); }
});

// ── INTERACTIONS ──
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand() && !interaction.isButton() && !interaction.isStringSelectMenu()) return;

  // ── BUTTON HANDLERS ──
  if (interaction.isButton()) {
    ${enabledSystems.includes('tickets')?`
    // Open ticket → show category select menu
    if (interaction.customId === 'open_ticket') {
      const existing = interaction.guild.channels.cache.find(c => c.topic?.includes(\`owner:\${interaction.user.id}\`));
      if (existing) return interaction.reply({ content: \`❌ You already have an open ticket: \${existing}\`, ephemeral: true });
      const tCats = ${JSON.stringify(tk.tickets_categories||[{emoji:'🛠️',name:'Support',desc:'General support'},{emoji:'💳',name:'Billing',desc:'Payments and billing'},{emoji:'👤',name:'Account',desc:'Account issues'}])};
      const selectRow = { type:1, components:[{ type:3, customId:'select_ticket_category', placeholder:'Select a category...', options: tCats.map(c=>({ label:\`\${c.emoji||''} \${c.name}\`.trim(), value:c.name.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,100), description:(c.desc||'').slice(0,100) })) }] };
      return interaction.reply({ embeds:[embed({ title:'🎫 Open Ticket', desc:'Select the category that best describes your issue.' })], components:[selectRow], ephemeral:true });
    }
    // Close ticket → ask confirmation
    if (interaction.customId === 'close_ticket') {
      if (!interaction.channel.topic?.includes('owner:') && !interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
        return interaction.reply({ content: '❌ This is not a ticket channel.', ephemeral: true });
      }
      const confirmRow = { type:1, components:[
        { type:2, style:4, label:'✅ Confirm', customId:'confirm_close' },
        { type:2, style:2, label:'❌ Cancel', customId:'cancel_close' }
      ]};
      return interaction.reply({ content: '⚠️ Are you sure you want to close this ticket?', components:[confirmRow], ephemeral:true });
    }
    // Confirm close
    if (interaction.customId === 'confirm_close') {
      await interaction.reply({ content: '🔒 Closing ticket in 5 seconds...' });
      ${enabledSystems.includes('tickets')&&tk.tickets_log_channel?`
      const logChClose = await findChannel(interaction.guild, '${tk.tickets_log_channel}');
      if (logChClose) logChClose.send({ embeds:[embed({ title:'🔒 Ticket Closed', desc:\`**Channel:** \${interaction.channel.name}\\n**Closed by:** \${interaction.user.username}\` })] }).catch(()=>{});
      `:''}
      setTimeout(() => interaction.channel.delete().catch(()=>{}), 5000);
      return;
    }
    // Cancel close
    if (interaction.customId === 'cancel_close') {
      return interaction.reply({ content: '✅ Cancelled — ticket stays open.', ephemeral: true });
    }
    `:''}
    return;
  }

  // ── SELECT MENU HANDLERS ──
  if (interaction.isStringSelectMenu()) {
    ${enabledSystems.includes('tickets')?`
    if (interaction.customId === 'select_ticket_category') {
      const catValue = interaction.values[0];
      const tCats = ${JSON.stringify(tk.tickets_categories||[{emoji:'🛠️',name:'Support',desc:'General support'},{emoji:'💳',name:'Billing',desc:'Payments and billing'},{emoji:'👤',name:'Account',desc:'Account issues'}])};
      const catObj = tCats.find(c=>c.name.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,100)===catValue)||{ name:catValue, emoji:'🎫' };
      const catLabel = \`\${catObj.emoji||''} \${catObj.name}\`.trim();
      const existing = interaction.guild.channels.cache.find(c => c.topic?.includes(\`owner:\${interaction.user.id}\`));
      if (existing) return interaction.reply({ content: \`❌ You already have an open ticket: \${existing}\`, ephemeral:true });
      await interaction.deferReply({ ephemeral:true });
      const guild = interaction.guild;
      // Auto-create ticket category if needed
      let ticketCat = guild.channels.cache.find(c=>c.name==='${(tk.tickets_category||'🎫 Tickets').replace(/'/g,"\\'")}' && c.type===4);
      if (!ticketCat) ticketCat = await guild.channels.create({ name:'${(tk.tickets_category||'🎫 Tickets').replace(/'/g,"\\'")}', type:4 }).catch(()=>null);
      const chName = \`ticket-\${String(ticketCount).padStart(4,'0')}\`;
      ticketCount++;
      const overwrites = [
        { id:guild.id, deny:[PermissionFlagsBits.ViewChannel] },
        { id:interaction.user.id, allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory,PermissionFlagsBits.AttachFiles] },
        { id:guild.members.me.id, allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ManageChannels,PermissionFlagsBits.ReadMessageHistory] }
      ];
      ${tk.tickets_ping_role?`const pingRole = await findRole(guild,'${tk.tickets_ping_role}'); if(pingRole) overwrites.push({ id:pingRole.id, allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages] });`:''}
      const ch = await guild.channels.create({ name:chName, type:0, parent:ticketCat?.id||null, permissionOverwrites:overwrites });
      await ch.setTopic(\`owner:\${interaction.user.id} | ticket:#\${ticketCount-1}\`).catch(()=>{});
      const closeRow = { type:1, components:[{ type:2, style:4, label:'${(tk.tickets_close_label||'🔒 Close Ticket').replace(/'/g,"\\'")}', customId:'close_ticket' }] };
      ${tk.tickets_ping_role?`const pingRole2 = await findRole(guild,'${tk.tickets_ping_role}');`:''}
      await ch.send({
        content:\`<@\${interaction.user.id}>${tk.tickets_ping_role?` <@&\${pingRole2?.id||''}>`:''}\`,
        embeds:[embed({ title:"${(tk.tickets_embed_title||'🎫 Support Center').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'')}", desc:replace("${(tk.tickets_welcome_msg||'Thanks for opening a ticket! Describe your issue and our team will assist you.').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'')}",interaction.member)+\`\\n\\n**Category:** \${catLabel}\` })],
        components:[closeRow]
      });
      // Auto-create log channel if configured
      ${tk.tickets_log_channel?`
      let logChNew = await findChannel(guild,'${tk.tickets_log_channel}');
      if (!logChNew) logChNew = await guild.channels.create({ name:'${tk.tickets_log_channel}', type:0, permissionOverwrites:[{ id:guild.id, deny:[PermissionFlagsBits.ViewChannel] },{ id:guild.members.me.id, allow:[PermissionFlagsBits.ViewChannel,PermissionFlagsBits.SendMessages,PermissionFlagsBits.ReadMessageHistory] }] }).catch(()=>null);
      if (logChNew) {
        const myPerms = logChNew.permissionsFor(guild.members.me);
        if (!myPerms?.has(PermissionFlagsBits.SendMessages)) {
          await logChNew.permissionOverwrites.edit(guild.members.me.id, { ViewChannel:true, SendMessages:true, ReadMessageHistory:true }).catch(()=>{});
        }
        logChNew.send({ embeds:[embed({ title:'📂 Ticket Opened', desc:\`**User:** \${interaction.user.username}\\n**Category:** \${catLabel}\\n**Channel:** \${ch}\` })] }).catch(()=>{});
      }
      `:''}
      return interaction.editReply({ content:\`✅ Ticket created: \${ch}\` });
    }
    `:''}
    return;
  }

  const cmd = interaction.commandName;
  const guild = interaction.guild;

  // ── CUSTOM COMMANDS ──
  ${cmds.map(c=>`if (cmd === '${c.name}') {
    const replyData = { content: replace('${c.content.replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'').replace(/`/g,'\\`')}', interaction.member) };
    ${c.image_url?`replyData.embeds = [{ ${c.img_pos==='thumbnail'?`thumbnail: { url: '${c.image_url}' }`:`image: { url: '${c.image_url}' }`}, color: ACCENT }];`:''}
    return interaction.reply(replyData);
  }`).join('\n  ')}

  ${enabledSystems.includes('info')?`
  // ── INFO COMMANDS ──
  if (cmd === 'ping') return interaction.reply({ content: \`🏓 Pong! \\\`\${client.ws.ping}ms\\\`\`, ephemeral: true });

  if (cmd === 'serverinfo') {
    const e = embed({ title: guild.name })
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: '👥 Members', value: String(guild.memberCount), inline: true },
        { name: '📢 Channels', value: String(guild.channels.cache.size), inline: true },
        { name: '🎭 Roles', value: String(guild.roles.cache.size), inline: true },
        { name: '👑 Owner', value: \`<@\${guild.ownerId}>\`, inline: true },
        { name: '📅 Created', value: \`<t:\${Math.floor(guild.createdTimestamp/1000)}:D>\`, inline: true }
      );
    return interaction.reply({ embeds: [e] });
  }

  if (cmd === 'userinfo') {
    const target = interaction.options.getUser('user') || interaction.user;
    const member = await guild.members.fetch(target.id).catch(()=>null);
    const e = embed({ title: target.username })
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: '🆔 ID', value: target.id, inline: true },
        { name: '📅 Account Created', value: \`<t:\${Math.floor(target.createdTimestamp/1000)}:D>\`, inline: true },
        { name: '📥 Joined Server', value: member ? \`<t:\${Math.floor(member.joinedTimestamp/1000)}:D>\` : 'N/A', inline: true }
      );
    return interaction.reply({ embeds: [e] });
  }

  if (cmd === 'avatar') {
    const target = interaction.options.getUser('user') || interaction.user;
    return interaction.reply({ embeds: [embed({ title: \`\${target.username}'s Avatar\` }).setImage(target.displayAvatarURL({ size: 512 }))] });
  }`:''}

  ${enabledSystems.includes('moderation')?`
  // ── MODERATION ──
  if (cmd === 'ban') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await guild.members.fetch(target.id).catch(()=>null);
    if (!member) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    ${md.mod_dm_on_punish!==false?`await target.send(\`🔨 You were **banned** from **\${guild.name}**. Reason: \${reason}\`).catch(()=>{});`:''}
    await member.ban({ reason }).catch(()=>{});
    const logCh = await findChannel(guild, '${md.mod_log_channel||'mod-logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '🔨 Member Banned', desc: \`**User:** \${target.username}\\n**Moderator:** \${interaction.user.username}\\n**Reason:** \${reason}\` })] });
    return interaction.reply({ embeds: [embed({ title: '🔨 Banned', desc: \`**\${target.username}** has been banned. Reason: \${reason}\` })] });
  }

  if (cmd === 'kick') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await guild.members.fetch(target.id).catch(()=>null);
    if (!member) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    ${md.mod_dm_on_punish!==false?`await target.send(\`👢 You were **kicked** from **\${guild.name}**. Reason: \${reason}\`).catch(()=>{});`:''}
    await member.kick(reason).catch(()=>{});
    const logCh = await findChannel(guild, '${md.mod_log_channel||'mod-logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '👢 Member Kicked', desc: \`**User:** \${target.username}\\n**Moderator:** \${interaction.user.username}\\n**Reason:** \${reason}\` })] });
    return interaction.reply({ embeds: [embed({ title: '👢 Kicked', desc: \`**\${target.username}** has been kicked. Reason: \${reason}\` })] });
  }

  if (cmd === 'mute') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    const mins = interaction.options.getInteger('minutes') || 10;
    const reason = interaction.options.getString('reason') || 'No reason provided';
    const member = await guild.members.fetch(target.id).catch(()=>null);
    if (!member) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
    await member.timeout(mins * 60000, reason).catch(()=>{});
    ${md.mod_dm_on_punish!==false?`await target.send(\`🔇 You were **muted** in **\${guild.name}** for \${mins} minutes. Reason: \${reason}\`).catch(()=>{});`:''}
    return interaction.reply({ embeds: [embed({ title: '🔇 Muted', desc: \`**\${target.username}** muted for \${mins} minutes. Reason: \${reason}\` })] });
  }

  if (cmd === 'warn') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');
    const key = guild.id+':'+target.id;
    const warns = warnings.get(key) || [];
    warns.push({ reason, by: interaction.user.username, at: new Date().toISOString() });
    warnings.set(key, warns);
    ${md.mod_dm_on_punish!==false?`await target.send(\`⚠️ You received a **warning** in **\${guild.name}**. Reason: \${reason}. Total warnings: \${warns.length}\`).catch(()=>{});`:''}
    const logCh = await findChannel(guild, '${md.mod_log_channel||'mod-logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '⚠️ Member Warned', desc: \`**User:** \${target.username}\\n**Moderator:** \${interaction.user.username}\\n**Reason:** \${reason}\\n**Total Warns:** \${warns.length}\` })] });
    if (warns.length >= ${md.mod_warn_threshold||3}) {
      const member = await guild.members.fetch(target.id).catch(()=>null);
      if (member) { await member.kick('Exceeded warn limit').catch(()=>{}); return interaction.reply({ content: \`⚠️ \${target.username} warned and auto-kicked (reached \${warns.length} warnings).\` }); }
    }
    return interaction.reply({ embeds: [embed({ title: '⚠️ Warning Issued', desc: \`**\${target.username}** warned. Total: **\${warns.length}/${md.mod_warn_threshold||3}**. Reason: \${reason}\` })] });
  }

  if (cmd === 'warnings') {
    const target = interaction.options.getUser('user');
    const key = guild.id+':'+target.id;
    const warns = warnings.get(key) || [];
    const desc = warns.length ? warns.map((w,i)=>\`**\${i+1}.** \${w.reason} — by \${w.by}\`).join('\\n') : 'No warnings.';
    return interaction.reply({ embeds: [embed({ title: \`⚠️ Warnings for \${target.username}\`, desc })] });
  }

  if (cmd === 'clearwarn') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const target = interaction.options.getUser('user');
    warnings.delete(guild.id+':'+target.id);
    return interaction.reply({ content: \`✅ Cleared all warnings for **\${target.username}**.\` });
  }

  if (cmd === 'purge') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({ content: '❌ No permission.', ephemeral: true });
    const amount = Math.min(interaction.options.getInteger('amount'), 100);
    await interaction.channel.bulkDelete(amount, true).catch(()=>{});
    return interaction.reply({ content: \`🗑️ Deleted **\${amount}** messages.\`, ephemeral: true });
  }`:''}

  ${enabledSystems.includes('polls')?`
  if (cmd === 'poll') {
    const q = interaction.options.getString('question');
    const msg = await interaction.reply({ embeds: [embed({ title: '📊 '+q })], fetchReply: true });
    await msg.react('${p.polls_yes||'👍'}');
    await msg.react('${p.polls_no||'👎'}');
    ${(p.polls_duration||30)>0?`setTimeout(async () => {
      const fetched = await msg.fetch();
      const yes = fetched.reactions.cache.get('${p.polls_yes||'👍'}')?.count-1||0;
      const no = fetched.reactions.cache.get('${p.polls_no||'👎'}')?.count-1||0;
      msg.reply({ embeds: [embed({ title: '📊 Poll Results: '+q, desc: \`${p.polls_yes||'👍'} **\${yes}** vs ${p.polls_no||'👎'} **\${no}**\\n\\n\${yes>no?'✅ Yes wins!':no>yes?'❌ No wins!':'🤝 It\\'s a tie!'}\` })] });
    }, ${(p.polls_duration||30)*60000});`:''}
  }`:''}

  ${enabledSystems.includes('tickets')?`
  if (cmd === 'tickets') {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.reply({ content: "❌ You need 'Manage Channels' permission to post the ticket panel.", ephemeral: true });
    }
    let targetCh = interaction.channel;
    ${tk.tickets_channel?`const found = await findChannel(interaction.guild,'${tk.tickets_channel}'); if(found) targetCh=found;`:''}
    const openRow = { type:1, components:[{ type:2, style:1, label:'${(tk.tickets_open_label||'🎫 Open Ticket').replace(/'/g,"\\'")}', customId:'open_ticket' }] };
    await targetCh.send({ embeds:[embed({ title:"${(tk.tickets_embed_title||'🎫 Support Center').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'')}", desc:"${(tk.tickets_embed_desc||'Need help? Click the button below to open a ticket. You will choose the category of your problem and our team will assist you shortly.').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'')}" })], components:[openRow] });
    return interaction.reply({ content:\`✅ Ticket panel posted in \${targetCh}!\`, ephemeral:true });
  }
`:''}

  ${enabledSystems.includes('giveaway')?`
  if (cmd === 'giveaway') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'start') {
      const prize = interaction.options.getString('prize');
      const mins = interaction.options.getInteger('minutes') || ${g.giveaway_duration||60};
      const ends = new Date(Date.now() + mins * 60000);
      const emoji = '${g.giveaway_emoji||'🎉'}';
      const msg = await interaction.reply({
        embeds: [embed({ title: \`${g.giveaway_emoji||'🎰'} GIVEAWAY\`, desc: \`**Prize:** \${prize}\\n**React with \${emoji} to enter!**\\n**Ends:** <t:\${Math.floor(ends/1000)}:R>\\n**Hosted by:** \${interaction.user}\` })],
        fetchReply: true
      });
      await msg.react(emoji);
      setTimeout(async () => {
        const fetched = await msg.fetch();
        const reaction = fetched.reactions.cache.get(emoji);
        if (!reaction) return msg.reply('No entries for the giveaway!');
        const users = (await reaction.users.fetch()).filter(u => !u.bot);
        if (!users.size) return msg.reply('No valid entries!');
        const winner = users.random();
        if (!winner) return msg.reply('Could not pick a winner.');
        const winMsg = '${(g.giveaway_winner_msg||'🎊 {winner} won **{prize}**!').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}';
        msg.reply(winMsg.replace('{winner}',\`<@\${winner.id}>\`).replace('{prize}',prize));
      }, mins * 60000);
    }
  }`:''}
});

// ── MESSAGE EVENTS ──
client.on(Events.MessageCreate, async msg => {
  if (msg.author.bot || !msg.guild) return;

  ${enabledSystems.includes('automod')?`
  // AutoMod
  const BANNED_WORDS = '${(a.automod_words||'').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}'.split(',').map(w=>w.trim().toLowerCase()).filter(Boolean);
  const msgContent = msg.content.toLowerCase();
  let violated = BANNED_WORDS.length && BANNED_WORDS.some(w=>msgContent.includes(w));
  ${a.automod_anti_invite?`violated = violated || /discord\\.gg\\/|discord\\.com\\/invite\\//i.test(msg.content);`:''}
  ${a.automod_anti_spam?`const spamKey = msg.guild.id+':'+msg.author.id;
  const spamData = spamTrack.get(spamKey) || { count: 0, timer: null };
  spamData.count++;
  clearTimeout(spamData.timer);
  spamData.timer = setTimeout(()=>spamTrack.delete(spamKey), 5000);
  spamTrack.set(spamKey, spamData);
  if (spamData.count >= 5) violated = true;`:''}
  if (violated) {
    await msg.delete().catch(()=>{});
    const warnMsg = '${(a.automod_warn_msg||'⚠️ {user}, that word is not allowed!').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}'.replace('{user}',\`<@\${msg.author.id}>\`);
    const action = '${a.automod_action||'warn'}';
    const warning = await msg.channel.send(warnMsg);
    setTimeout(()=>warning.delete().catch(()=>{}), 5000);
    if (action === 'timeout') await msg.member.timeout(5*60000, 'AutoMod').catch(()=>{});
    else if (action === 'kick') await msg.member.kick('AutoMod').catch(()=>{});
    else if (action === 'ban') await msg.member.ban({ reason: 'AutoMod' }).catch(()=>{});
    ${a.automod_log_channel?`const logCh = await findChannel(msg.guild, '${a.automod_log_channel}'); if(logCh) logCh.send({ embeds: [embed({ title: '🔰 AutoMod Action', desc: \`**User:** \${msg.author.username}\\n**Action:** \${action}\\n**Content:** \${msg.content.slice(0,100)}\` })] });`:''}
    return;
  }`:''}
});

// ── MEMBER JOIN ──
client.on(Events.GuildMemberAdd, async member => {
  ${enabledSystems.includes('welcome')?`
  // Welcome
  const welcomeMsg = replace('${(w.welcome_msg||'Welcome {user} to **{server}**!').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}', member);
  ${w.welcome_dm?`await member.send(welcomeMsg).catch(()=>{});`
  :`const wCh = await findChannel(member.guild, '${w.welcome_channel||'general'}');
  if (wCh) {
    ${w.welcome_embed?`wCh.send({ embeds: [new EmbedBuilder().setColor('${w.welcome_embed_color||'#7c3aed'}').setTitle('${(w.welcome_embed_title||'Welcome!').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}').setDescription(welcomeMsg).setThumbnail(member.user.displayAvatarURL()).setTimestamp()] });`
    :`wCh.send(welcomeMsg);`}
  }`}`:''}
  ${enabledSystems.includes('autorole')?`
  // Auto Role
  const role = await findRole(member.guild, '${ar.autorole_role||'Member'}');
  if (role ${ar.autorole_bots?'':'&& !member.user.bot'}) await member.roles.add(role).catch(()=>{});`:''}
  ${enabledSystems.includes('logs')?`
  if (${lg.logs_joins!==false}) {
    const logCh = await findChannel(member.guild, '${lg.logs_channel||'logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '✅ Member Joined', desc: \`<@\${member.id}> | \${member.user.username}\\nAccount created: <t:\${Math.floor(member.user.createdTimestamp/1000)}:R>\` }).setThumbnail(member.user.displayAvatarURL())] });
  }`:''}
});

// ── MEMBER LEAVE ──
client.on(Events.GuildMemberRemove, async member => {
  ${enabledSystems.includes('goodbye')?`
  const goodbyeMsg = replace('${(gb.goodbye_msg||'Goodbye {user}! We will miss you. 😢').replace(/'/g,"\\'").replace(/\n/g,'\\n').replace(/\r/g,'')}', member);
  const gbCh = await findChannel(member.guild, '${gb.goodbye_channel||'general'}');
  if (gbCh) {
    ${gb.goodbye_embed?`gbCh.send({ embeds: [embed({ title: 'Goodbye!', desc: goodbyeMsg }).setThumbnail(member.user.displayAvatarURL())] });`:`gbCh.send(goodbyeMsg);`}
  }`:''}
  ${enabledSystems.includes('logs')?`
  if (${lg.logs_leaves!==false}) {
    const logCh = await findChannel(member.guild, '${lg.logs_channel||'logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '❌ Member Left', desc: \`\${member.user.username}\\nJoined: \${member.joinedAt?'<t:'+Math.floor(member.joinedTimestamp/1000)+':R>':'Unknown'}\` }).setThumbnail(member.user.displayAvatarURL())] });
  }`:''}
});

${enabledSystems.includes('logs')&&(lg.logs_msg_edit||lg.logs_msg_delete)?`
// ── MESSAGE LOGS ──
client.on(Events.MessageUpdate, async (oldMsg, newMsg) => {
  if (!oldMsg.guild || oldMsg.author?.bot || oldMsg.content === newMsg.content) return;
  if (${!!lg.logs_msg_edit}) {
    const logCh = await findChannel(oldMsg.guild, '${lg.logs_channel||'logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '✏️ Message Edited', desc: \`**Author:** \${oldMsg.author?.username}\\n**Channel:** \${oldMsg.channel}\\n**Before:** \${oldMsg.content?.slice(0,500)||'N/A'}\\n**After:** \${newMsg.content?.slice(0,500)||'N/A'}\` })] });
  }
});

client.on(Events.MessageDelete, async msg => {
  if (!msg.guild || msg.partial || msg.author?.bot) return;
  if (${!!lg.logs_msg_delete}) {
    const logCh = await findChannel(msg.guild, '${lg.logs_channel||'logs'}');
    if (logCh) logCh.send({ embeds: [embed({ title: '🗑️ Message Deleted', desc: \`**Author:** \${msg.author?.username}\\n**Channel:** \${msg.channel}\\n**Content:** \${msg.content?.slice(0,500)||'[Attachment/Unknown]'}\` })] });
  }
});`:''}

${enabledSystems.includes('logs')&&lg.logs_bans?`
// ── BAN LOGS ──
client.on(Events.GuildBanAdd, async ban => {
  const logCh = await findChannel(ban.guild, '${lg.logs_channel||'logs'}');
  if (logCh) logCh.send({ embeds: [embed({ title: '🔨 Member Banned', desc: \`**User:** \${ban.user.username}\\n**Reason:** \${ban.reason||'No reason provided'}\` })] });
});
client.on(Events.GuildBanRemove, async ban => {
  const logCh = await findChannel(ban.guild, '${lg.logs_channel||'logs'}');
  if (logCh) logCh.send({ embeds: [embed({ title: '✅ Member Unbanned', desc: \`**User:** \${ban.user.username}\` })] });
});`:''}

client.login(TOKEN);
`;
  return code;
}

function generateReadme(botName,prefix,enabledSystems){
  return `# ${botName}

Bot created with [Orbbis](https://orbbis.app) — the Discord bot builder platform.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Edit \`.env\` and add your bot token:
\`\`\`
TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
\`\`\`

3. Run the bot:
\`\`\`bash
node index.js
\`\`\`

## Commands

- \`${prefix}ping\` — Check bot latency
${commands.map(c=>`- \`${c.prefix}${c.name}\` — ${c.description||'Custom command'}`).join('\n')}

## Enabled Systems

${enabledSystems.map(s=>`- ${systems[s].icon} ${systems[s].name}`).join('\n')||'No systems enabled.'}

## Hosting

Upload the ZIP to [Discloud](https://discloud.app) for free 24/7 hosting.

---
Built with ❤️ using [Orbbis](https://orbbis.app)
`;
}

// ── ZIP BUILDER ──
function buildZip(files,zipName){
  function crc32(data){
    const table=new Int32Array(256);
    for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=(c&1)?0xEDB88320^(c>>>1):(c>>>1);table[i]=c;}
    let c=0xFFFFFFFF;
    for(let i=0;i<data.length;i++)c=table[(c^data[i])&0xFF]^(c>>>8);
    return(c^0xFFFFFFFF)>>>0;
  }
  function str2u8(s){const b=new TextEncoder().encode(s);return b;}
  function u32(v){return new Uint8Array([v&0xFF,(v>>8)&0xFF,(v>>16)&0xFF,(v>>24)&0xFF]);}
  function u16(v){return new Uint8Array([v&0xFF,(v>>8)&0xFF]);}

  const entries=[];let offset=0;
  const allParts=[];

  for(const f of files){
    const nameBytes=str2u8(f.name);
    const dataBytes=str2u8(f.content);
    const crc=crc32(dataBytes);
    const localHeader=new Uint8Array([
      0x50,0x4B,0x03,0x04,0x14,0x00,0x00,0x00,0x00,0x00,
      0x00,0x00,0x00,0x00,
      ...u32(crc),...u32(dataBytes.length),...u32(dataBytes.length),
      ...u16(nameBytes.length),0x00,0x00,...nameBytes
    ]);
    allParts.push(localHeader,dataBytes);
    entries.push({nameBytes,crc,size:dataBytes.length,offset});
    offset+=localHeader.length+dataBytes.length;
  }

  let cdSize=0,cdStart=offset;
  for(const e of entries){
    const cd=new Uint8Array([
      0x50,0x4B,0x01,0x02,0x14,0x00,0x14,0x00,0x00,0x00,0x00,0x00,
      0x00,0x00,0x00,0x00,
      ...u32(e.crc),...u32(e.size),...u32(e.size),
      ...u16(e.nameBytes.length),0x00,0x00,0x00,0x00,0x00,0x00,
      0x00,0x00,0x00,0x00,0x00,0x00,
      ...u32(e.offset),...e.nameBytes
    ]);
    allParts.push(cd);cdSize+=cd.length;
  }

  const eocd=new Uint8Array([
    0x50,0x4B,0x05,0x06,0x00,0x00,0x00,0x00,
    ...u16(entries.length),...u16(entries.length),
    ...u32(cdSize),...u32(cdStart),0x00,0x00
  ]);
  allParts.push(eocd);

  const total=allParts.reduce((s,p)=>s+p.length,0);
  const buf=new Uint8Array(total);let pos=0;
  for(const p of allParts){buf.set(p,pos);pos+=p.length;}

  const blob=new Blob([buf],{type:'application/zip'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=zipName+'.zip';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{URL.revokeObjectURL(url);document.body.removeChild(a);},5000);
  // Show fallback modal in case browser blocked silent download
  const modal=document.createElement('div');
  modal.style.cssText='position:fixed;top:20px;right:20px;background:#7c3aed;color:#fff;padding:16px 22px;border-radius:12px;z-index:99999;font-family:sans-serif;font-size:14px;font-weight:700;box-shadow:0 4px 20px rgba(0,0,0,.3);display:flex;align-items:center;gap:12px';
  modal.innerHTML='<span>📦 ZIP pronto!</span><a href="'+url+'" download="'+zipName+'.zip'+'" style="background:#fff;color:#7c3aed;padding:6px 14px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:700">Clique aqui se não baixou</a><span onclick="this.parentNode.remove()" style="cursor:pointer;opacity:.7;font-size:18px">×</span>';
  document.body.appendChild(modal);
  setTimeout(()=>{if(modal.parentNode)modal.remove();},10000);
}

