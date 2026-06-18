/**
 * ╔═══════════════════════════════════════════════════════╗
 * ║  Orbbis — Bot Editor · Lógica Principal              ║
 * ╚═══════════════════════════════════════════════════════╝
 *
 * Contém toda a lógica de UI e interação do editor:
 *
 *   PARTICLES         — animação de partículas ao fundo
 *   THEME             — alternância dark/light mode
 *   STATE             — variáveis globais de estado do editor
 *   STEPS             — navegação entre os 5 passos do editor
 *   TOKEN             — validação e preview do token do bot
 *   EMOJI PICKER      — seletor de emoji para o perfil do bot
 *   PREVIEW           — preview ao vivo (mockup Discord)
 *   COMMANDS          — criação e edição de comandos slash
 *   IMAGE UPLOAD      — upload de imagens para as respostas
 *   SYSTEMS           — renderização dos cards de sistema
 *   DOWNLOAD SUMMARY  — resumo final antes do download
 *   LANG (setLang)    — troca de idioma EN ↔ PT-BR
 *   APPLY LANG        — aplica traduções a todos os elementos
 *   IMPORT / EXPORT   — salvar e carregar projetos .json
 *   WELCOME SCREEN    — tela inicial (novo / importar)
 *   STARS CANVAS      — animação de estrelas do welcome
 *   MOBILE DETECTION  — aviso para usuários móveis
 *
 * Depende de: translations.js, systems-config.js, bot-generator.js
 */

// ── PARTICLES ──
(function(){
  const container=document.getElementById('particles');
  for(let i=0;i<20;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;animation-duration:${6+Math.random()*12}s;animation-delay:${Math.random()*8}s;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;opacity:${0.2+Math.random()*0.4}`;
    container.appendChild(p);
  }
})();

// ── THEME ──
(function(){
  const t=localStorage.getItem('orbbis-theme');
  const dark=window.matchMedia('(prefers-color-scheme:dark)').matches;
  const theme=t||(dark?'dark':'light');
  document.documentElement.setAttribute('data-theme',theme);
  document.getElementById('theme-btn').textContent=theme==='dark'?'☀️':'🌙';
})();
function toggleTheme(){
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',next);
  localStorage.setItem('orbbis-theme',next);
  document.getElementById('theme-btn').textContent=next==='dark'?'☀️':'🌙';
}

// ── STATE ──
let currentStep=1;
const totalSteps=5;
let commands=[];
let editingCmdIdx=-1;
const catData={};
let selectedEmoji='🤖';
let selectedPrefix='/';
let selectedStatus='Watching';
// ── STEPS ──
function goStep(n){
  if(n<1||n>totalSteps) return;
  document.querySelectorAll('.step-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.step-item').forEach(i=>i.classList.remove('active'));
  document.getElementById('page-'+n).classList.add('active');
  document.getElementById('step-item-'+n).classList.add('active');
  for(let i=1;i<n;i++){
    document.getElementById('step-item-'+i).classList.add('done');
    const connEl=document.getElementById('conn-'+i);if(connEl) connEl.classList.add('done');
  }
  currentStep=n;
  document.getElementById('btn-back').style.visibility=n===1?'hidden':'visible';
  document.getElementById('btn-next').textContent=n===4?'🚀 Generate Bot':n===totalSteps?'🎉 Done!':'Continue →';
  document.getElementById('step-progress').textContent=`Step ${n} of ${totalSteps}`;
  if(n===3){
    renderSystems();
    // Fecha todos os configs abertos
    Object.keys(systems).forEach(id=>{
      const el=document.getElementById('sys-config-'+id);
      if(el) el.style.display='none';
    });
  }
  if(n===4) renderDownloadSummary();
  applyLang();
  if(n===5) renderInviteStep();
}
function nextStep(){if(currentStep<totalSteps)goStep(currentStep+1);}
function prevStep(){if(currentStep>1)goStep(currentStep-1);}

// ── TOKEN ──
let tokenTimer=null;
function toggleToken(){
  const i=document.getElementById('token');
  const b=document.querySelector('.token-eye');
  i.type=i.type==='password'?'text':'password';
  b.textContent=i.type==='password'?'👁️':'🙈';
}
function onTokenChange(){
  clearTimeout(tokenTimer);
  const v=document.getElementById('token').value.trim();
  const s=document.getElementById('token-status');
  if(!v){s.style.display='none';return;}
  s.style.display='flex';s.className='token-status loading';s.textContent='⏳ Validating...';
  tokenTimer=setTimeout(()=>validateToken(v),900);
}
async function validateToken(token){
  const s=document.getElementById('token-status');
  try{
    const r=await fetch('https://discord.com/api/users/@me',{headers:{Authorization:`Bot ${token}`}});
    if(!r.ok) throw new Error('invalid');
    const u=await r.json();
    s.className='token-status ok';
    s.innerHTML=`✅ Found: <b style="color:var(--ink);margin-left:4px">${u.username}</b>`;
    document.getElementById('client-id').value=u.id;

    // Sempre atualiza nome com o do Discord Developer Portal
    document.getElementById('preview-name').textContent=u.username;

    // Sempre atualiza ícone com o do Discord Developer Portal
    const av=document.getElementById('preview-av');
    if(u.avatar){
      const avatarUrl=`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}.png?size=128`;
      av.innerHTML=`<img src="${avatarUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" alt="bot avatar"/>`;
      av.style.background='transparent';
    } else {
      // Sem avatar — usa avatar padrão do Discord
      const defaultIdx=parseInt(u.id)%5;
      const defaultUrl=`https://cdn.discordapp.com/embed/avatars/${defaultIdx}.png`;
      av.innerHTML=`<img src="${defaultUrl}" style="width:100%;height:100%;border-radius:50%;object-fit:cover" alt="bot avatar"/>`;
      av.style.background='transparent';
    }
    updatePreview();
  }catch(e){
    s.className='token-status err';
    s.textContent='❌ Invalid token. Check and try again.';
  }
}
function onPrefixInput(input){
  // Permite apenas pontuações — bloqueia letras, números, aspas, setas, vírgulas, chaves, colchetes, sublinhados
  const blocked=/[a-zA-Z0-9"'<>,{}\[\]_\s*#@&]/g;
  const clean=input.value.replace(blocked,'');
  input.value=clean;
  // Desativa todos os pills se não bater com nenhum
  const pills=['/',  '!','?','.'];
  document.querySelectorAll('.prefix-pill').forEach(b=>{
    b.classList.toggle('active',b.textContent.startsWith(clean)&&pills.includes(clean));
  });
  updatePreview();
}

function setImgPos(pos){
  document.getElementById('cmd-img-pos').value=pos;
  document.getElementById('pos-below').style.border=pos==='below'?'1.5px solid var(--purple)':'1.5px solid var(--border2)';
  document.getElementById('pos-below').style.background=pos==='below'?'var(--purplegl)':'transparent';
  document.getElementById('pos-below').style.color=pos==='below'?'var(--purplel)':'var(--muted)';
  document.getElementById('pos-thumbnail').style.border=pos==='thumbnail'?'1.5px solid var(--purple)':'1.5px solid var(--border2)';
  document.getElementById('pos-thumbnail').style.background=pos==='thumbnail'?'var(--purplegl)':'transparent';
  document.getElementById('pos-thumbnail').style.color=pos==='thumbnail'?'var(--purplel)':'var(--muted)';
  updateCmdPreview();
}

function setPrefix(p){
  selectedPrefix=p;
  document.querySelectorAll('.prefix-pill').forEach(b=>b.classList.toggle('active',b.textContent.startsWith(p)));
  document.getElementById('prefix').value=p;
  updatePreview();
}

function setStatus(s){
  selectedStatus=s;
  document.querySelectorAll('.status-pill').forEach(b=>b.classList.toggle('active',b.textContent.includes(s)));
  updatePreview();
}

// ── EMOJI PICKER ──
const emojiCats={
  '🎮 Gaming':['🎮','🕹️','🏆','⚔️','🛡️','🎯','🎲','🎪','🃏','🎰'],
  '🌙 Night':['🌙','⭐','🌟','💫','✨','🌌','🌃','🌠','🌙','🔮'],
  '🎵 Music':['🎵','🎶','🎸','🎹','🥁','🎺','🎻','🎤','🎧','🎼'],
  '✨ Magic':['✨','🔮','🧿','🌀','💎','👑','🦋','🌈','🎆','🎇'],
  '🤖 Tech':['🤖','💻','⚡','🔧','⚙️','🛸','🌐','📡','💡','🔬'],
};
let currentCat='🤖 Tech';
function renderEmojiPicker(){
  const cats=document.getElementById('emoji-cats');
  const grid=document.getElementById('emoji-grid');
  cats.innerHTML=Object.keys(emojiCats).map(c=>`<button class="emoji-cat-btn ${c===currentCat?'active':''}" onclick="setCat('${c}')">${c.split(' ')[0]}</button>`).join('');
  grid.innerHTML=(emojiCats[currentCat]||[]).map(e=>`<button class="emoji-btn" onclick="selectEmoji('${e}')">${e}</button>`).join('');
}
function setCat(c){currentCat=c;renderEmojiPicker();}
function selectEmoji(e){
  selectedEmoji=e;
  document.getElementById('status-emoji-btn').textContent=e;
  document.getElementById('emoji-picker-status').style.display='none';
  updatePreview();
}
function toggleEmojiPicker(id){
  const p=document.getElementById('emoji-picker-'+id);
  if(p.style.display==='none'){p.style.display='block';renderEmojiPicker();}
  else p.style.display='none';
}

// ── PREVIEW ──
function updatePreview(){
  const prefix=document.getElementById('prefix').value||'/';
  document.getElementById('info-prefix').textContent=prefix;
  document.getElementById('info-cmds').textContent=commands.length;
  document.getElementById('info-sys').textContent=Object.values(systems).filter(s=>s.enabled).length;
}

// ── COMMANDS ──
function renderCommands(){
  const list=document.getElementById('cmd-list');
  const empty=document.getElementById('cmd-empty');
  if(!commands.length){list.innerHTML='';empty.style.display='block';return;}
  empty.style.display='none';
  list.innerHTML=commands.map((c,i)=>`
    <div class="cmd-card">
      <div class="flex items-center">
        <span class="cmd-badge">${c.prefix}${c.name}</span>
        <div style="margin-left:10px">
          <div class="cmd-name">${c.name}</div>
          <div class="cmd-desc">${c.description||'No description'}</div>
        </div>
      </div>
      <div class="flex gap8">
        <button class="icon-btn" onclick="editCmd(${i})">✏️</button>
        <button class="icon-btn del" onclick="deleteCmd(${i})">🗑️</button>
      </div>
    </div>`).join('');
  updatePreview();
}
function openCmdEditor(idx=-1){
  editingCmdIdx=idx;
  document.getElementById('cmd-editor-wrap').style.display='block';
  if(idx>=0){
    const c=commands[idx];
    document.getElementById('cmd-editor-title').textContent='Edit Command';
    document.getElementById('cmd-prefix-sel').value=c.prefix||'/';
    document.getElementById('cmd-name').value=c.name||'';
    document.getElementById('cmd-desc').value=c.description||'';
    document.getElementById('cmd-content').value=c.content||'';
    document.getElementById('cmd-image-url').value=c.image_url||'';
    if(c.image_url){
      document.getElementById('cmd-img-preview').src=c.image_url;
      document.getElementById('cmd-img-preview').style.display='block';
      document.getElementById('cmd-img-ph').style.display='none';
      document.getElementById('cmd-img-area').classList.add('has-img');
      document.getElementById('cmd-img-remove').style.display='block';
    } else {removeCmdImg();}
  } else {
    document.getElementById('cmd-editor-title').textContent='New Command';
    ['cmd-name','cmd-desc','cmd-content'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('cmd-prefix-sel').value='/';
    removeCmdImg();
  }
  updateCmdPreview();
  document.getElementById('cmd-editor-wrap').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function editCmd(i){openCmdEditor(i);}
function closeCmdEditor(){document.getElementById('cmd-editor-wrap').style.display='none';editingCmdIdx=-1;}
function saveCmd(){
  const name=document.getElementById('cmd-name').value.trim().toLowerCase().replace(/\s+/g,'_');
  if(!name){alert('Enter a command name.');return;}
  const cmd={
    prefix:document.getElementById('cmd-prefix-sel').value,
    name,
    description:document.getElementById('cmd-desc').value.trim(),
    content:document.getElementById('cmd-content').value.trim(),
    image_url:document.getElementById('cmd-image-url').value,
    img_pos:document.getElementById('cmd-img-pos')?.value||'below',
  };
  if(editingCmdIdx>=0) commands[editingCmdIdx]=cmd;
  else commands.push(cmd);
  closeCmdEditor();renderCommands();
}
function deleteCmd(i){if(confirm('Delete this command?')){commands.splice(i,1);renderCommands();}}
function fmt(before,after){
  const ta=document.getElementById('cmd-content');
  const s=ta.selectionStart,e=ta.selectionEnd;
  const sel=ta.value.substring(s,e)||'text';
  ta.value=ta.value.substring(0,s)+before+sel+after+ta.value.substring(e);
  ta.focus();ta.selectionStart=s+before.length;ta.selectionEnd=s+before.length+sel.length;
  updateCmdPreview();
}
function updateCmdPreview(){
  const content=document.getElementById('cmd-content').value;
  const imgUrl=document.getElementById('cmd-image-url').value;
  const imgPos=document.getElementById('cmd-img-pos')?.value||'below';
  const name=document.getElementById('preview-name').textContent||'My Bot';
  // Pega o avatar atual preservando imagem se existir
  const currentAv=document.getElementById('preview-av');
  const avContent=currentAv?currentAv.innerHTML:selectedEmoji;
  const avStyle=currentAv&&currentAv.innerHTML.includes('<img')?'background:transparent':
    `background:linear-gradient(135deg,#7c3aed,#a78bfa)`;
  const body=document.getElementById('preview-body');
  let html=`<div class="discord-msg" id="preview-msg">
    <div class="discord-av" id="preview-av" style="${avStyle}">${avContent}</div>
    <div class="discord-msg-body">
      <div class="discord-msg-name"><span id="preview-name">${name}</span><span class="discord-app-badge">APP</span></div>`;
  if(content) html+=`<div class="discord-msg-text">${escapeHtml(content).replace(/\*\*(.*?)\*\*/g,'<b>$1</b>').replace(/\*(.*?)\*/g,'<i>$1</i>').replace(/__(.*?)__/g,'<u>$1</u>').replace(/~~(.*?)~~/g,'<s>$1</s>')}</div>`;
  if(imgUrl&&imgPos==='below') html+=`<div class="discord-embed" style="border-left-color:#7c3aed"><img src="${imgUrl}" class="discord-embed-img" onerror="this.style.display='none'"/></div>`;
  if(imgUrl&&imgPos==='thumbnail') html+=`<div class="discord-embed" style="border-left-color:#7c3aed;display:flex;justify-content:space-between;align-items:flex-start"><span style="font-size:12px;color:#b5bac1">${escapeHtml(content||'')}</span><img src="${imgUrl}" style="width:60px;height:60px;border-radius:4px;object-fit:cover;margin-left:8px;flex-shrink:0" onerror="this.style.display='none'"/></div>`;
  html+='</div></div>';
  body.innerHTML=html;
}
function escapeHtml(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// ── IMAGE UPLOAD ──
async function uploadCmdImg(input){
  const file=input.files[0];if(!file) return;
  document.getElementById('cmd-img-ph').innerHTML='<div style="font-size:22px;margin-bottom:6px">⏳</div><div style="font-size:12px;color:var(--muted)">Uploading...</div>';
  const form=new FormData();
  form.append('key','d4eee98984784cbbadf32dd4faf1cd1d');
  form.append('image',file);
  try{
    const r=await fetch('https://api.imgbb.com/1/upload',{method:'POST',body:form});
    const d=await r.json();
    if(d?.data?.url){
      document.getElementById('cmd-image-url').value=d.data.url;
      document.getElementById('cmd-img-preview').src=d.data.url;
      document.getElementById('cmd-img-preview').style.display='block';
      document.getElementById('cmd-img-ph').style.display='none';
      document.getElementById('cmd-img-area').classList.add('has-img');
      document.getElementById('cmd-img-remove').style.display='block';
      document.getElementById('img-pos-wrap').style.display='block';
      updateCmdPreview();
    }
  }catch(e){
    document.getElementById('cmd-img-ph').innerHTML='<div style="font-size:22px">⚠️</div><div style="font-size:12px;color:var(--red)">Upload failed. Try again.</div>';
  }
}
function removeCmdImg(){
  document.getElementById('cmd-image-url').value='';
  document.getElementById('cmd-img-file').value='';
  document.getElementById('cmd-img-preview').style.display='none';
  document.getElementById('cmd-img-preview').src='';
  document.getElementById('cmd-img-ph').style.display='block';
  document.getElementById('cmd-img-ph').innerHTML='<div style="font-size:28px;margin-bottom:6px">🖼️</div><div style="font-size:12px;color:var(--muted);font-weight:600">Click to upload image or GIF</div><div style="font-size:11px;color:var(--dim);margin-top:4px">PNG, JPG, GIF · Uploaded to ImgBB</div>';
  document.getElementById('img-pos-wrap').style.display='none';
  document.getElementById('cmd-img-pos').value='below';
  setImgPos('below');
}

// ── SYSTEMS ──
function renderSystems(){
  const t=TR[currentLang]||TR.en;
  const grid=document.getElementById('systems-grid');
  grid.innerHTML=Object.entries(systems).map(([id,sys])=>{
    const fieldsHtml=sys.fields.map(f=>{
      const val=f.default!==undefined?f.default:'';
      const inputStyle='width:100%;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;color:var(--ink);font-family:Inter,sans-serif;font-size:12px;padding:8px 10px;outline:none';
      const labelHtml=`<div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--dim);margin-bottom:5px">${getLbl(f.id,id)}</div>`;
      let inputHtml='';
      if(f.type==='toggle') return `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;font-size:12px;font-weight:600;color:var(--muted)"><span>${getLbl(f.id,id)}</span><label class="toggle"><input type="checkbox" id="sys-${id}-${f.id}" ${val?'checked':''}><span class="toggle-slider"></span></label></div>`;
      if(f.type==='upload') return `
        <div style="margin-bottom:10px">
          <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--dim);margin-bottom:5px">${getLbl(f.id,id)}</div>
          <div id="sys-${id}-${f.id}-area" onclick="document.getElementById('sys-${id}-${f.id}-file').click()" style="border:2px dashed var(--border2);border-radius:8px;padding:10px;text-align:center;cursor:pointer;background:var(--bg);transition:all .15s" onmouseover="this.style.borderColor='var(--purple)'" onmouseout="this.style.borderColor='var(--border2)'">
            <div id="sys-${id}-${f.id}-ph" style="font-size:11px;color:var(--muted)">🖼️ ${getSysUpload()}</div>
            <img id="sys-${id}-${f.id}-preview" src="" style="display:none;max-width:100%;max-height:80px;border-radius:6px" alt=""/>
          </div>
          <input type="file" id="sys-${id}-${f.id}-file" accept="image/*,.gif" style="display:none" onchange="uploadSysImg('${id}','${f.id}',this)"/>
          <input type="hidden" id="sys-${id}-${f.id}" value=""/>
          <button id="sys-${id}-${f.id}-remove" onclick="removeSysImg('${id}','${f.id}')" style="display:none;margin-top:4px;width:100%;padding:4px;background:transparent;border:1px dashed rgba(239,68,68,.25);border-radius:6px;color:var(--red);font-size:10px;cursor:pointer">✕ Remove</button>
        </div>`;
      if(f.type==='textarea'||f.type==='textarea-fmt'){
        const toolbar=f.type==='textarea-fmt'?`
        <div style="display:flex;gap:3px;flex-wrap:wrap;padding:6px 8px;background:var(--bg4);border:1.5px solid var(--border);border-radius:8px 8px 0 0;border-bottom:none">
          <button type="button" onclick="fmtSys('${id}','${f.id}','**','**')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer" title="Bold"><b>B</b></button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','*','*')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer" title="Italic"><i>I</i></button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','__','__')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer" title="Underline"><u>U</u></button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','~~','~~')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer" title="Strike"><s>S</s></button>
          <button type="button" onclick="fmtSys('${id}','${f.id}',String.fromCharCode(96),String.fromCharCode(96))" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">\`</button>
          <button type="button" onclick="fmtSys('${id}','${f.id}',String.fromCharCode(96,96,96)+'\\n','\\n'+String.fromCharCode(96,96,96))" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">···</button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','> ','')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">"</button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','||','||')" style="font-size:11px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">||</button>
          <div style="width:1px;background:var(--border2);margin:0 2px"></div>
          <button type="button" onclick="fmtSys('${id}','${f.id}','{user}','')" style="font-size:10px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">@user</button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','{server}','')" style="font-size:10px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">{server}</button>
          <button type="button" onclick="fmtSys('${id}','${f.id}','{membercount}','')" style="font-size:10px;font-weight:700;padding:3px 7px;border-radius:5px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer">#count</button>
        </div><div style="font-size:10px;color:var(--gold);background:rgba(245,158,11,0.08);border:1px solid rgba(245,158,11,0.2);border-radius:6px;padding:5px 9px;margin-top:6px;line-height:1.5">⚠️ <b>__sublinhado__</b> não funciona em embeds.</div>`:'';
        const varLegend=f.type==='textarea-fmt'?`<div style="font-size:10px;color:var(--dim);margin-top:5px;line-height:1.6">
          <b style="color:var(--muted)">{user}</b> → member mention &nbsp;·&nbsp;
          <b style="color:var(--muted)">{username}</b> → member name &nbsp;·&nbsp;
          <b style="color:var(--muted)">{server}</b> → server name &nbsp;·&nbsp;
          <b style="color:var(--muted)">{membercount}</b> → total members
        </div>`:'';
        const radius=f.type==='textarea-fmt'?'0 0 8px 8px':'8px';
        inputHtml=toolbar+`<textarea id="sys-${id}-${f.id}" placeholder="${f.placeholder||''}" style="${inputStyle};resize:vertical;min-height:120px;border-radius:${radius}${f.type==='textarea-fmt'?';border-top:none':''}">${val}</textarea>`+varLegend;
      }
      else if(f.type==='select') inputHtml=`<select id="sys-${id}-${f.id}" style="${inputStyle};cursor:pointer">${(f.options||[]).map(o=>`<option value="${o}" ${o===val?'selected':''}>${o.charAt(0).toUpperCase()+o.slice(1)}</option>`).join('')}</select>`;
      else if(f.type==='color') inputHtml=`<input type="color" id="sys-${id}-${f.id}" value="${val}" style="width:100%;height:36px;padding:3px 6px;background:var(--bg);border:1.5px solid var(--border);border-radius:8px;cursor:pointer"/>`;
      else if(f.type==='categories-editor'){
        const cats=Array.isArray(val)?val:(Array.isArray(f.default)?f.default:[]);
        const sid='sys-'+id+'-'+f.id;
        catData[sid]=cats;
        const rows=cats.map((c,i)=>'<div class="cat-row">'
          +'<input class="cat-emoji-input" value="'+(c.emoji||'').split('"').join('&quot;')+'" placeholder="🎫" oninput="updateCatField(\''+id+'\',\''+f.id+'\','+i+',\'emoji\',this.value)"/>'
          +'<input class="cat-name-input" value="'+(c.name||'').split('"').join('&quot;')+'" placeholder="Name" oninput="updateCatField(\''+id+'\',\''+f.id+'\','+i+',\'name\',this.value)"/>'
          +'<input class="cat-desc-input" value="'+(c.desc||'').split('"').join('&quot;')+'" placeholder="Description" oninput="updateCatField(\''+id+'\',\''+f.id+'\','+i+',\'desc\',this.value)"/>'
          +'<button class="cat-del-btn" onclick="removeCat(\''+id+'\',\''+f.id+'\','+i+')">✕</button>'
          +'</div>').join('');
        inputHtml='<div class="cat-editor" id="'+sid+'-list">'+rows+'</div>'
          +'<button class="cat-add-btn" onclick="addCat(\''+id+'\',\''+f.id+'\')">+ Add Category</button>';
      }
      else if(f.type==='number') inputHtml=`<input type="number" id="sys-${id}-${f.id}" value="${val}" min="0" style="${inputStyle}"/>`;
      else inputHtml=`<input type="text" id="sys-${id}-${f.id}" value="${val}" placeholder="${f.placeholder||''}" style="${inputStyle}"/>`;
      return `<div style="margin-bottom:10px">${labelHtml}${inputHtml}</div>`;
    }).join('');

    return `<div class="sys-card ${sys.enabled?'enabled':''}" id="sys-card-${id}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px">
        <div>
          <div style="font-size:22px;margin-bottom:6px;user-select:none">${sys.icon}</div>
          <div class="sys-name">${getSysName(id)}</div>
          <div class="sys-desc">${getSysDesc(id)}</div>
        </div>
        <label class="toggle" style="margin-top:4px;flex-shrink:0">
          <input type="checkbox" ${sys.enabled?'checked':''} onchange="toggleSystem('${id}',this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="sys-toggle-row">
        <span class="sys-status-label" style="font-size:11px;color:${sys.enabled?'var(--purplel)':'var(--dim)'};font-weight:600">${sys.enabled?t['sys-enabled']:t['sys-disabled']}</span>
        <button onclick="toggleSysConfig('${id}')" style="font-size:10px;font-weight:700;padding:3px 10px;border-radius:6px;border:1px solid var(--border2);background:transparent;color:var(--muted);cursor:pointer;letter-spacing:.3px;text-transform:uppercase">⚙️ Config</button>
      </div>
      <div id="sys-config-${id}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
        ${fieldsHtml}
      </div>
    </div>`;
  }).join('');
  updatePreview();
}

function updateCatField(sysId,fieldId,idx,key,val){const k='sys-'+sysId+'-'+fieldId;if(!catData[k])return;catData[k][idx][key]=val;}
function addCat(sysId,fieldId){const k='sys-'+sysId+'-'+fieldId;if(!catData[k])catData[k]=[];const i=catData[k].length;catData[k].push({emoji:'🎫',name:'New Category',desc:'Description'});const list=document.getElementById(k+'-list');if(!list)return;const row=document.createElement('div');row.className='cat-row';row.innerHTML='<input class="cat-emoji-input" value="🎫" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'emoji\',this.value)"/><input class="cat-name-input" value="New Category" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'name\',this.value)"/><input class="cat-desc-input" value="Description" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'desc\',this.value)"/><button class="cat-del-btn" onclick="removeCat(\''+sysId+'\',\''+fieldId+'\','+i+')">✕</button>';list.appendChild(row);}
function removeCat(sysId,fieldId,idx){const k='sys-'+sysId+'-'+fieldId;if(!catData[k])return;catData[k].splice(idx,1);const list=document.getElementById(k+'-list');if(!list)return;list.innerHTML=catData[k].map((c,i)=>'<div class="cat-row"><input class="cat-emoji-input" value="'+(c.emoji||'').replace(/"/g,"&quot;")+'" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'emoji\',this.value)"/><input class="cat-name-input" value="'+(c.name||'').replace(/"/g,"&quot;")+'" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'name\',this.value)"/><input class="cat-desc-input" value="'+(c.desc||'').replace(/"/g,"&quot;")+'" oninput="updateCatField(\''+sysId+'\',\''+fieldId+'\','+i+',\'desc\',this.value)"/><button class="cat-del-btn" onclick="removeCat(\''+sysId+'\',\''+fieldId+'\','+i+')">✕</button></div>').join('');}

function fmtSys(sysId, fieldId, before, after){
  const ta=document.getElementById(`sys-${sysId}-${fieldId}`);
  if(!ta) return;
  const s=ta.selectionStart,e=ta.selectionEnd;
  const sel=ta.value.substring(s,e)||'text';
  ta.value=ta.value.substring(0,s)+before+sel+after+ta.value.substring(e);
  ta.focus();
  ta.selectionStart=s+before.length;
  ta.selectionEnd=s+before.length+sel.length;
}

async function uploadSysImg(sysId, fieldId, input){
  const file=input.files[0]; if(!file) return;
  const ph=document.getElementById(`sys-${sysId}-${fieldId}-ph`);
  ph.textContent='⏳ Uploading...';
  const form=new FormData();
  form.append('key','d4eee98984784cbbadf32dd4faf1cd1d');
  form.append('image',file);
  try{
    const r=await fetch('https://api.imgbb.com/1/upload',{method:'POST',body:form});
    const d=await r.json();
    if(d?.data?.url){
      document.getElementById(`sys-${sysId}-${fieldId}`).value=d.data.url;
      const preview=document.getElementById(`sys-${sysId}-${fieldId}-preview`);
      preview.src=d.data.url; preview.style.display='block';
      ph.style.display='none';
      document.getElementById(`sys-${sysId}-${fieldId}-area`).style.borderColor='var(--green)';
      document.getElementById(`sys-${sysId}-${fieldId}-remove`).style.display='block';
    }
  }catch(e){ ph.textContent='❌ Upload failed. Try again.'; }
}

function removeSysImg(sysId, fieldId){
  document.getElementById(`sys-${sysId}-${fieldId}`).value='';
  document.getElementById(`sys-${sysId}-${fieldId}-file`).value='';
  document.getElementById(`sys-${sysId}-${fieldId}-preview`).style.display='none';
  document.getElementById(`sys-${sysId}-${fieldId}-ph`).style.display='block';
  document.getElementById(`sys-${sysId}-${fieldId}-ph`).textContent='🖼️ Click to upload GIF / Image';
  document.getElementById(`sys-${sysId}-${fieldId}-area`).style.borderColor='var(--border2)';
  document.getElementById(`sys-${sysId}-${fieldId}-remove`).style.display='none';
}

function toggleSysConfig(id){
  const el=document.getElementById('sys-config-'+id);
  el.style.display=el.style.display==='none'?'block':'none';
}
function toggleSystem(id,enabled){
  systems[id].enabled=enabled;
  const t=TR[currentLang]||TR.en;
  const card=document.getElementById('sys-card-'+id);
  if(!card) return;
  card.classList.toggle('enabled',enabled);
  const statusSpan=card.querySelector('.sys-status-label');
  if(statusSpan){
    statusSpan.textContent=enabled?t['sys-enabled']:t['sys-disabled'];
    statusSpan.style.color=enabled?'var(--purplel)':'var(--dim)';
  }
  updatePreview();
}

function renderDownloadSummary(){
  const name=document.getElementById('preview-name').textContent||'My Bot';
  const t=TR[currentLang]||TR.en;
  document.querySelector('.download-title').textContent=`${name} ${currentLang==='pt'?'está pronto! 🎉':'is ready! 🎉'}`;
}

function setLang(lang){
  currentLang=lang;
  localStorage.setItem('orbbis-lang',lang);
  document.getElementById('lang-en').style.background=lang==='en'?'var(--ink)':'transparent';
  document.getElementById('lang-en').style.color=lang==='en'?'var(--bg)':'var(--dim)';
  document.getElementById('lang-pt').style.background=lang==='pt'?'var(--ink)':'transparent';
  document.getElementById('lang-pt').style.color=lang==='pt'?'var(--bg)':'var(--dim)';
  applyLang();
  const sysGrid=document.getElementById('systems-grid');
  if(sysGrid&&sysGrid.children.length) renderSystems();
}

function applyLang(){
  const t=TR[currentLang]||TR.en;
  // Elementos com data-t
  const htmlKeys=new Set(['how-step1','how-step2','how-step3','how-step4','how-step5','mobile-desc','run-tip-windows','run-tip-linux']);
  document.querySelectorAll('[data-t]').forEach(el=>{
    const key=el.getAttribute('data-t');
    if(!t[key]) return;
    if(htmlKeys.has(key)) el.innerHTML=t[key];
    else el.textContent=t[key];
  });
  // Botão home
  const btnHome=document.getElementById('btn-home');
  if(btnHome) btnHome.textContent=t['btn-home'];
  // Bottom nav
  const btnBack=document.getElementById('btn-back');
  const btnNext=document.getElementById('btn-next');
  if(btnBack) btnBack.textContent=t['btn-back'];
  if(btnNext) btnNext.textContent=currentStep===totalSteps?t['btn-next-final']:t['btn-next'];
  // Progress
  const prog=document.getElementById('step-progress');
  if(prog) prog.textContent=currentLang==='pt'?`Passo ${currentStep} de ${totalSteps}`:`Step ${currentStep} of ${totalSteps}`;
  // Preview title
  const pt=document.getElementById('preview-title-text');
  if(pt) pt.textContent=t['preview-title'];
  // Cmd empty
  const ce=document.getElementById('cmd-empty-text');
  if(ce) ce.textContent=t['cmd-empty'];
  // Btn add cmd
  const ba=document.getElementById('btn-add-cmd');
  if(ba) ba.textContent=t['btn-add-cmd'];
  // Elemento com link — usa innerHTML para preservar o link
  const cardTokenSub=document.getElementById('card-token-sub');
  if(cardTokenSub){
    if(currentLang==='pt'){
      cardTokenSub.innerHTML='Vá no <a href="https://discord.com/developers/applications" target="_blank" style="color:var(--purplel);font-weight:600">Discord Developer Portal</a> → Seu App → Bot → Resetar Token → Copiar.';
    } else {
      cardTokenSub.innerHTML='Go to <a href="https://discord.com/developers/applications" target="_blank" style="color:var(--purplel);font-weight:600">Discord Developer Portal</a> → Your App → Bot → Reset Token → Copy.';
    }
  }
  const tokenInput=document.getElementById('token');
  if(tokenInput) tokenInput.placeholder=currentLang==='pt'?'Cole seu token de bot aqui...':'Paste your bot token here...';
  const clientInput=document.getElementById('client-id');
  if(clientInput) clientInput.placeholder=currentLang==='pt'?'Detectado automaticamente...':'Auto-detected from token...';
  const cmdNameInput=document.getElementById('cmd-name');
  if(cmdNameInput) cmdNameInput.placeholder=currentLang==='pt'?'ola':'hello';
  const cmdDescInput=document.getElementById('cmd-desc');
  if(cmdDescInput) cmdDescInput.placeholder=currentLang==='pt'?'O que esse comando faz?':'What does this command do?';
  const cmdContentInput=document.getElementById('cmd-content');
  if(cmdContentInput) cmdContentInput.placeholder=currentLang==='pt'?'Resposta do bot...':'Bot\'s response...';
  const statusInput=document.getElementById('status-text');
  if(statusInput) statusInput.placeholder='orbbis.app';
  // Title
  document.title=currentLang==='pt'?'Orbbis — Editor de Bot':'Orbbis — Bot Editor';
}

// ── INIT ──
try { setLang(currentLang); } catch(e) {}
try { renderCommands(); } catch(e) {}
try { updatePreview(); } catch(e) {}

// ── WELCOME SCREEN ──
function dismissWelcome(){
  const ws=document.getElementById('welcome-screen');
  ws.classList.add('hiding');
  setTimeout(()=>ws.style.display='none',400);
}
function startFresh(){ dismissWelcome(); }
function importFromWelcome(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const p=JSON.parse(e.target.result);
      // Accept any JSON with bot data
      if(!p.bot) p.bot = {};
      if(!p.version) p.version = '1.0';
      applyImport(p);
      dismissWelcome();
    }catch(err){
      alert(currentLang==='pt'?'❌ Arquivo inválido. Use um arquivo orbbis.json.':'❌ Invalid file. Use an orbbis.json file.');
    }
    input.value='';
  };
  reader.readAsText(file);
}
function applyImport(p){
  if(p.bot.token) document.getElementById('token').value=p.bot.token;
  if(p.bot.clientId) document.getElementById('client-id').value=p.bot.clientId;
  if(p.bot.prefix){document.getElementById('prefix').value=p.bot.prefix;setPrefix(p.bot.prefix);}
  if(p.bot.statusText) document.getElementById('status-text').value=p.bot.statusText;
  if(p.bot.statusType) setStatus(p.bot.statusType);
  if(p.bot.name){
    document.getElementById('preview-name').textContent=p.bot.name;
    const hero=document.getElementById('bot-identity-hero');
    if(hero){hero.style.display='flex';const n=document.getElementById('bot-hero-name');if(n)n.textContent=p.bot.name;}
  }
  if(Array.isArray(p.commands)) commands=p.commands;
  if(p.systems){Object.entries(p.systems).forEach(([id,enabled])=>{if(systems[id])systems[id].enabled=enabled;});}
  window._pendingSysConfig=p.systemsConfig||{};
  updatePreview();
  renderCommands();
  goStep(1);
}
function importProject(input){
  const file=input.files[0];
  if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const p=JSON.parse(e.target.result);
      // Accept any JSON with bot data
      if(!p.bot) p.bot = {};
      if(!p.version) p.version = '1.0';
      applyImport(p);
      alert(currentLang==='pt'?`✅ Projeto "${p.bot.name}" importado!`:`✅ Project "${p.bot.name}" imported!`);
    }catch(err){
      alert(currentLang==='pt'?'❌ Arquivo inválido.':'❌ Invalid file.');
    }
    input.value='';
  };
  reader.readAsText(file);
}
function exportProject(){
  const botName=document.getElementById('preview-name').textContent||'My Bot';
  const token=document.getElementById('token').value.trim();
  const clientId=document.getElementById('client-id').value.trim();
  const prefix=document.getElementById('prefix').value||'/';
  const statusText=document.getElementById('status-text').value||'';
  const sysConfig=getSysConfig();
  const enabledSystems={};
  Object.entries(systems).forEach(([id,sys])=>{enabledSystems[id]=sys.enabled;});
  const project={version:'1.0',exportedAt:new Date().toISOString(),bot:{name:botName,token,clientId,prefix,statusType:selectedStatus,statusText,statusEmoji:selectedEmoji},commands,systems:enabledSystems,systemsConfig:sysConfig};
  const jsonStr=JSON.stringify(project,null,2);
  const b64=btoa(unescape(encodeURIComponent(jsonStr)));
  const a=document.createElement('a');
  a.href='data:application/json;base64,'+b64;
  a.download=(botName.toLowerCase().replace(/\s+/g,'-'))+'-orbbis.json';
  a.style.display='none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ── INVITE STEP ──
function renderInviteStep(){
  const clientId=document.getElementById('client-id').value.trim();
  if(!clientId){
    const el=document.getElementById('invite-link-text');
    el.textContent=(currentLang||'en')==='pt'?'⚠️ Valide seu token no Passo 1 primeiro':'⚠️ Validate your token in Step 1 first';
    el.setAttribute('data-t','invite-placeholder');
    document.getElementById('invite-link-open').href='#';
    return;
  }
  const perms={'View Channels':1024,'Send Messages':2048,'Embed Links':16384,'Attach Files':32768,'Read Message History':65536,'Use Slash Commands':2147483648};
  if(systems.moderation?.enabled){perms['Ban Members']=4;perms['Kick Members']=2;perms['Moderate Members']=1073741824;perms['Manage Messages']=8192;}
  if(systems.automod?.enabled){perms['Manage Messages']=8192;perms['Timeout Members']=1073741824;}
  if(systems.logs?.enabled){perms['View Audit Log']=128;}
  if(systems.autorole?.enabled){perms['Manage Roles']=268435456;}
  if(systems.tickets?.enabled){perms['Manage Channels']=16;}
  const permInt=Object.values(perms).reduce((acc,v)=>acc|v,0);
  const url=`https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permInt}&scope=bot%20applications.commands`;
  document.getElementById('invite-link-text').textContent=url;
  document.getElementById('invite-link-open').href=url;
  const list=document.getElementById('perms-list');
  const red=new Set(['Ban Members','Kick Members','Moderate Members']);
  const gold=new Set(['Manage Messages','Manage Roles','Manage Channels','Timeout Members']);
  list.innerHTML=Object.keys(perms).map(p=>{
    const color=red.has(p)?'var(--red)':gold.has(p)?'var(--gold)':'var(--purplel)';
    const bg=red.has(p)?'rgba(239,68,68,0.1)':gold.has(p)?'rgba(245,158,11,0.1)':'var(--purplegl)';
    return `<span style="font-size:10px;font-weight:600;padding:3px 9px;border-radius:999px;background:${bg};color:${color};border:1px solid ${color}22">${p}</span>`;
  }).join('');
}
function copyInviteLink(){
  const url=document.getElementById('invite-link-text').textContent;
  if(!url||url.startsWith('⚠️')) return;
  navigator.clipboard.writeText(url).then(()=>{
    const btn=document.getElementById('copy-invite-btn');
    btn.textContent=currentLang==='pt'?'✓ Copiado!':'✓ Copied!';
    btn.style.background='var(--green)';
    setTimeout(()=>{btn.textContent=currentLang==='pt'?'Copiar':'Copy';btn.style.background='var(--purple)';},2000);
  });
}


// ── WELCOME STARS ──
(function(){
  const canvas=document.getElementById('welcome-stars');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  let W,H,stars=[];
  function resize(){
    const dpr=window.devicePixelRatio||1;
    W=canvas.parentElement.offsetWidth||window.innerWidth; H=canvas.parentElement.offsetHeight||window.innerHeight;
    canvas.width=W*dpr; canvas.height=H*dpr;
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.scale(dpr,dpr);
    buildStars();
  }
  function buildStars(){
    stars=[];
    for(let i=0;i<200;i++){
      stars.push({
        x:Math.random()*W, y:Math.random()*H,
        r:0.2+Math.random()*0.8,
        alpha:0.2+Math.random()*0.6,
        twinkle:0.005+Math.random()*0.015,
        phase:Math.random()*Math.PI*2,
        vx:(Math.random()-0.5)*0.02,
        vy:(Math.random()-0.5)*0.02,
      });
    }
  }
  resize();
  window.addEventListener('resize',resize);
  let t=0;
  function loop(){
    t+=1;
    ctx.clearRect(0,0,W,H);
    stars.forEach(s=>{
      s.x+=s.vx; s.y+=s.vy;
      if(s.x<0)s.x=W; if(s.x>W)s.x=0;
      if(s.y<0)s.y=H; if(s.y>H)s.y=0;
      const tw=0.5+0.5*Math.sin(t*s.twinkle+s.phase);
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(200,190,255,${s.alpha*tw})`;
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
})();


// ── MOBILE DETECTION ──
(function(){
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if(isMobile){
    const el = document.getElementById('mobile-warning');
    if(el) el.style.display = 'block';
  }
})();

