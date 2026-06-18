/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  Orbbis — Bot Editor · Configuração dos Sistemas     ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * `systems`   — configuração de cada módulo/feature do bot
 *              (welcome, goodbye, automod, logs, tickets, etc.)
 *              Cada sistema tem: icon, name, desc, enabled, fields[]
 *
 * `SYS_LABELS`— traduções dos labels dos campos de sistema (EN/PT-BR)
 *
 * Para adicionar um novo sistema:
 *   1. Adicione uma entrada em `systems` com os campos desejados.
 *   2. Adicione as traduções correspondentes em SYS_LABELS.
 *   3. Implemente a lógica de geração em bot-generator.js.
 */

const systems={
  welcome:{icon:'👋',name:'Welcome Message',desc:'Send a custom message when a member joins.',enabled:false,fields:[
    {id:'welcome_channel',label:'Channel (name or ID)',type:'text',default:'general',placeholder:'general'},
    {id:'welcome_msg',label:'Message',type:'textarea-fmt',default:'Welcome {user} to **{server}**! 👋 You are member #{membercount}.',placeholder:'Welcome {user} to {server}!'},
    {id:'welcome_dm',label:'Send as DM instead',type:'toggle',default:false},
    {id:'welcome_embed',label:'Use Embed',type:'toggle',default:false},
    {id:'welcome_embed_color',label:'Embed Color',type:'color',default:'#7c3aed'},
    {id:'welcome_embed_title',label:'Embed Title',type:'text',default:'Welcome!',placeholder:'Welcome to {server}!'},
    {id:'welcome_image',label:'Image / GIF URL',type:'text',default:'',placeholder:'https://... or leave empty'},
    {id:'welcome_image_upload',label:'Or upload Image / GIF',type:'upload',default:''},
  ]},
  goodbye:{icon:'🚪',name:'Goodbye Message',desc:'Send a message when a member leaves.',enabled:false,fields:[
    {id:'goodbye_channel',label:'Channel (name or ID)',type:'text',default:'general',placeholder:'general'},
    {id:'goodbye_msg',label:'Message',type:'textarea-fmt',default:'Goodbye {user}! We will miss you. 😢',placeholder:'Goodbye {user}!'},
    {id:'goodbye_embed',label:'Use Embed',type:'toggle',default:false},
    {id:'goodbye_image',label:'Image / GIF URL',type:'text',default:'',placeholder:'https://... or leave empty'},
    {id:'goodbye_image_upload',label:'Or upload Image / GIF',type:'upload',default:''},
  ]},
  automod:{icon:'🔰',name:'Auto-Moderation',desc:'Auto-delete banned words and take action.',enabled:false,fields:[
    {id:'automod_words',label:'Banned Words (comma separated)',type:'textarea',default:'',placeholder:'word1, word2, word3...'},
    {id:'automod_action',label:'Action',type:'select',options:['warn','timeout','kick','ban'],default:'warn'},
    {id:'automod_warn_msg',label:'Warning Message',type:'text',default:'⚠️ {user}, that word is not allowed!',placeholder:'⚠️ {user}, watch your language!'},
    {id:'automod_anti_invite',label:'Block Discord Invite Links',type:'toggle',default:false},
    {id:'automod_anti_spam',label:'Anti-Spam (5+ msgs/5s)',type:'toggle',default:false},
    {id:'automod_log_channel',label:'Log Channel (name or ID)',type:'text',default:'',placeholder:'mod-logs'},
  ]},
  logs:{icon:'📋',name:'Server Logs',desc:'Log member joins, leaves, bans, message edits and deletes.',enabled:false,fields:[
    {id:'logs_channel',label:'Log Channel (name or ID)',type:'text',default:'logs',placeholder:'server-logs'},
    {id:'logs_joins',label:'Log member joins',type:'toggle',default:true},
    {id:'logs_leaves',label:'Log member leaves',type:'toggle',default:true},
    {id:'logs_bans',label:'Log bans & kicks',type:'toggle',default:true},
    {id:'logs_msg_edit',label:'Log message edits',type:'toggle',default:true},
    {id:'logs_msg_delete',label:'Log message deletes',type:'toggle',default:true},
  ]},
  autorole:{icon:'🎭',name:'Auto Role',desc:'Automatically give a role when a member joins.',enabled:false,fields:[
    {id:'autorole_role',label:'Role Name (exact)',type:'text',default:'Member',placeholder:'Member'},
    {id:'autorole_bots',label:'Also give to bots',type:'toggle',default:false},
  ]},
  giveaway:{icon:'🎰',name:'Giveaway',desc:'Run giveaways with /giveaway start.',enabled:false,fields:[
    {id:'giveaway_duration',label:'Default Duration (minutes)',type:'number',default:60},
    {id:'giveaway_emoji',label:'Reaction Emoji',type:'text',default:'🎉',placeholder:'🎉'},
    {id:'giveaway_winner_msg',label:'Winner Message',type:'text',default:'🎊 {winner} won **{prize}**!',placeholder:'🎊 {winner} won {prize}!'},
    {id:'giveaway_min_account_age',label:'Min Account Age (days)',type:'number',default:0},
  ]},
  polls:{icon:'📊',name:'Polls',desc:'Create polls with /poll.',enabled:false,fields:[
    {id:'polls_yes',label:'Yes Emoji',type:'text',default:'👍',placeholder:'👍'},
    {id:'polls_no',label:'No Emoji',type:'text',default:'👎',placeholder:'👎'},
    {id:'polls_duration',label:'Default Duration (minutes)',type:'number',default:30},
    {id:'polls_show_results',label:'Show results after poll ends',type:'toggle',default:true},
  ]},
  tickets:{icon:'🎫',name:'Support Tickets',desc:'Let users open private support tickets with categories.',enabled:false,fields:[
    {id:'tickets_channel',label:'Channel to send embed (name)',type:'text',default:'',placeholder:'support'},
    {id:'tickets_category',label:'Ticket Category (folder name)',type:'text',default:'Tickets',placeholder:'Tickets'},
    {id:'tickets_embed_title',label:'Embed Title',type:'text',default:'🎫 Support Center',placeholder:'Support Center'},
    {id:'tickets_embed_desc',label:'Embed Description',type:'textarea',default:'Need help? Click the button below to open a ticket.\n\nYou will choose the **category** of your problem and our team will assist you shortly.',placeholder:'Need help? Click below to open a ticket.'},
    {id:'tickets_btn_label',label:'Open Button Label',type:'text',default:'Open Ticket',placeholder:'Open Ticket'},
    {id:'tickets_btn_emoji',label:'Open Button Emoji',type:'text',default:'🎫',placeholder:'🎫'},
    {id:'tickets_close_label',label:'Close Button Label',type:'text',default:'Close Ticket',placeholder:'Close Ticket'},
    {id:'tickets_welcome_msg',label:'Welcome Message (inside ticket)',type:'textarea',default:'Thanks for opening a ticket! Our team will be with you shortly. 💬',placeholder:'Thanks for opening a ticket!'},
    {id:'tickets_ping_role',label:'Ping Role (name or ID)',type:'text',default:'',placeholder:'Support Team'},
    {id:'tickets_log_channel',label:'Log Channel',type:'text',default:'',placeholder:'ticket-logs'},
    {id:'tickets_categories',label:'Ticket Categories',type:'categories-editor',default:[{emoji:'💰',name:'Payment',desc:'Payment, billing or refund issues'},{emoji:'🔧',name:'Technical Support',desc:'Bugs, errors or technical problems'},{emoji:'👤',name:'Account',desc:'Account access, password or data'},{emoji:'❓',name:'General Question',desc:'General questions about products or services'}]},
  ]},
  moderation:{icon:'🔨',name:'Moderation',desc:'Ban, kick, mute, warn commands with logging.',enabled:false,fields:[
    {id:'mod_log_channel',label:'Mod Log Channel',type:'text',default:'mod-logs',placeholder:'mod-logs'},
    {id:'mod_warn_threshold',label:'Warns before auto-kick',type:'number',default:3},
    {id:'mod_mute_role',label:'Mute Role Name',type:'text',default:'Muted',placeholder:'Muted'},
    {id:'mod_dm_on_punish',label:'DM user when punished',type:'toggle',default:true},
    {id:'mod_delete_cmds',label:'Delete command after use',type:'toggle',default:true},
  ]},
  info:{icon:'📌',name:'Server Info',desc:'Enable /ping, /serverinfo, /userinfo, /avatar.',enabled:true,fields:[
    {id:'info_ping',label:'/ping — Bot latency',type:'toggle',default:true},
    {id:'info_serverinfo',label:'/serverinfo — Server details',type:'toggle',default:true},
    {id:'info_userinfo',label:'/userinfo — User details',type:'toggle',default:true},
    {id:'info_avatar',label:'/avatar — Show avatar',type:'toggle',default:true},
  ]},
};
const sysValues={};

// ── SYSTEM LABELS TRANSLATION ──
const SYS_LABELS={
  en:{
    // Welcome
    'welcome_channel':'Channel (name or ID)','welcome_msg':'Message','welcome_dm':'Send as DM instead',
    'welcome_embed':'Use Embed','welcome_embed_color':'Embed Color','welcome_embed_title':'Embed Title',
    'welcome_image':'Image / GIF URL','welcome_image_upload':'Or upload Image / GIF',
    // Goodbye
    'goodbye_channel':'Channel (name or ID)','goodbye_msg':'Message','goodbye_embed':'Use Embed',
    'goodbye_image':'Image / GIF URL','goodbye_image_upload':'Or upload Image / GIF',
    // AutoMod
    'automod_words':'Banned Words (comma separated)','automod_action':'Action',
    'automod_warn_msg':'Warning Message','automod_anti_invite':'Block Discord Invite Links',
    'automod_anti_spam':'Anti-Spam (5+ msgs/5s)','automod_log_channel':'Log Channel (name or ID)',
    // Logs
    'logs_channel':'Log Channel (name or ID)','logs_joins':'Log member joins',
    'logs_leaves':'Log member leaves','logs_bans':'Log bans & kicks',
    'logs_msg_edit':'Log message edits','logs_msg_delete':'Log message deletes',
    // AutoRole
    'autorole_role':'Role Name (exact)','autorole_bots':'Also give to bots',
    // Giveaway
    'giveaway_duration':'Default Duration (minutes)','giveaway_emoji':'Reaction Emoji',
    'giveaway_winner_msg':'Winner Message','giveaway_min_account_age':'Min Account Age (days)',
    // Polls
    'polls_yes':'Yes Emoji','polls_no':'No Emoji','polls_duration':'Default Duration (minutes)',
    'polls_show_results':'Show results after poll ends',
    // Tickets
    'tickets_category':'Category Name','tickets_label':'Open Button Label',
    'tickets_emoji':'Open Button Emoji','tickets_msg':'Welcome Message',
    'tickets_close_label':'Close Button Label','tickets_ping_role':'Ping Role (name or ID)',
    'tickets_log_channel':'Log Channel',
    // Moderation
    'mod_log_channel':'Mod Log Channel','mod_warn_threshold':'Warns before auto-kick',
    'mod_mute_role':'Mute Role Name','mod_dm_on_punish':'DM user when punished',
    'mod_delete_cmds':'Delete command after use',
    // Info
    'info_ping':'/ping — Bot latency','info_serverinfo':'/serverinfo — Server details',
    'info_userinfo':'/userinfo — User details','info_avatar':'/avatar — Show avatar',
    // Sys names/descs
    'sys-welcome-name':'Welcome Message','sys-welcome-desc':'Send a custom message when a member joins.',
    'sys-goodbye-name':'Goodbye Message','sys-goodbye-desc':'Send a message when a member leaves.',
    'sys-automod-name':'Auto-Moderation','sys-automod-desc':'Auto-delete banned words and take action.',
    'sys-logs-name':'Server Logs','sys-logs-desc':'Log member joins, leaves, bans, message edits and deletes.',
    'sys-autorole-name':'Auto Role','sys-autorole-desc':'Automatically give a role when a member joins.',
    'sys-giveaway-name':'Giveaway','sys-giveaway-desc':'Run giveaways with /giveaway start.',
    'sys-polls-name':'Polls','sys-polls-desc':'Create polls with /poll.',
    'sys-tickets-name':'Support Tickets','sys-tickets-desc':'Let users open private support tickets.',
    'sys-moderation-name':'Moderation','sys-moderation-desc':'Ban, kick, mute, warn commands with logging.',
    'sys-info-name':'Server Info','sys-info-desc':'Enable /ping, /serverinfo, /userinfo, /avatar.',
    'sys-upload':'Click to upload GIF / Image',
  },
  pt:{
    // Welcome
    'welcome_channel':'Canal (nome ou ID)','welcome_msg':'Mensagem','welcome_dm':'Enviar como DM',
    'welcome_embed':'Usar Embed','welcome_embed_color':'Cor do Embed','welcome_embed_title':'Título do Embed',
    'welcome_image':'URL de Imagem / GIF','welcome_image_upload':'Ou enviar Imagem / GIF',
    // Goodbye
    'goodbye_channel':'Canal (nome ou ID)','goodbye_msg':'Mensagem','goodbye_embed':'Usar Embed',
    'goodbye_image':'URL de Imagem / GIF','goodbye_image_upload':'Ou enviar Imagem / GIF',
    // AutoMod
    'automod_words':'Palavras banidas (separadas por vírgula)','automod_action':'Ação',
    'automod_warn_msg':'Mensagem de aviso','automod_anti_invite':'Bloquear links de convite do Discord',
    'automod_anti_spam':'Anti-Spam (5+ msgs/5s)','automod_log_channel':'Canal de log (nome ou ID)',
    // Logs
    'logs_channel':'Canal de log (nome ou ID)','logs_joins':'Registrar entradas de membros',
    'logs_leaves':'Registrar saídas de membros','logs_bans':'Registrar bans & kicks',
    'logs_msg_edit':'Registrar edições de mensagens','logs_msg_delete':'Registrar exclusões de mensagens',
    // AutoRole
    'autorole_role':'Nome do Cargo (exato)','autorole_bots':'Dar também a bots',
    // Giveaway
    'giveaway_duration':'Duração padrão (minutos)','giveaway_emoji':'Emoji de reação',
    'giveaway_winner_msg':'Mensagem do vencedor','giveaway_min_account_age':'Idade mínima da conta (dias)',
    // Polls
    'polls_yes':'Emoji Sim','polls_no':'Emoji Não','polls_duration':'Duração padrão (minutos)',
    'polls_show_results':'Mostrar resultado ao finalizar',
    // Tickets
    'tickets_category':'Nome da Categoria','tickets_label':'Label do Botão de Abrir',
    'tickets_emoji':'Emoji do Botão','tickets_msg':'Mensagem de Boas-vindas',
    'tickets_close_label':'Label do Botão de Fechar','tickets_ping_role':'Cargo a mencionar (nome ou ID)',
    'tickets_log_channel':'Canal de log',
    // Moderation
    'mod_log_channel':'Canal de log de moderação','mod_warn_threshold':'Avisos antes do auto-kick',
    'mod_mute_role':'Nome do Cargo Mudo','mod_dm_on_punish':'Enviar DM ao punir',
    'mod_delete_cmds':'Deletar comando após uso',
    // Info
    'info_ping':'/ping — Latência do bot','info_serverinfo':'/serverinfo — Detalhes do servidor',
    'info_userinfo':'/userinfo — Detalhes do usuário','info_avatar':'/avatar — Mostrar avatar',
    // Sys names/descs
    'sys-welcome-name':'Mensagem de Boas-vindas','sys-welcome-desc':'Envie uma mensagem quando um membro entrar.',
    'sys-goodbye-name':'Mensagem de Despedida','sys-goodbye-desc':'Envie uma mensagem quando um membro sair.',
    'sys-automod-name':'Auto-Moderação','sys-automod-desc':'Deletar palavras banidas e tomar ação automaticamente.',
    'sys-logs-name':'Logs do Servidor','sys-logs-desc':'Registrar entradas, saídas, bans, edições e exclusões.',
    'sys-autorole-name':'Cargo Automático','sys-autorole-desc':'Dar um cargo automaticamente quando um membro entrar.',
    'sys-giveaway-name':'Sorteio','sys-giveaway-desc':'Realize sorteios com /giveaway start.',
    'sys-polls-name':'Enquetes','sys-polls-desc':'Crie enquetes com /poll.',
    'sys-tickets-name':'Tickets de Suporte','sys-tickets-desc':'Deixe usuários abrirem tickets privados.',
    'sys-moderation-name':'Moderação','sys-moderation-desc':'Comandos ban, kick, mute, warn com logs.',
    'sys-info-name':'Info do Servidor','sys-info-desc':'Ative /ping, /serverinfo, /userinfo, /avatar.',
    'sys-upload':'Clique para enviar GIF / Imagem',
  }
};

function getLbl(fieldId,sysId){
  const t=SYS_LABELS[currentLang]||SYS_LABELS.en;
  return t[fieldId]||fieldId;
}
function getSysName(id){ return (SYS_LABELS[currentLang]||SYS_LABELS.en)[`sys-${id}-name`]||systems[id]?.name||id; }
function getSysDesc(id){ return (SYS_LABELS[currentLang]||SYS_LABELS.en)[`sys-${id}-desc`]||systems[id]?.desc||''; }
function getSysUpload(){ return (SYS_LABELS[currentLang]||SYS_LABELS.en)['sys-upload']||'Click to upload GIF / Image'; }

