// Look at the line below: We will put your Cloudflare Worker address here in Milestone 6
const API_URL = "https://quiz-submit-api.dk9444455.workers.dev";

(function(){
  /* ================= DIAGRAMS (inline SVG) ================= */
  const pc = (x,y,l) => `<g transform="translate(${x},${y})"><rect x="-16" y="-14" width="32" height="22" rx="3" class="scr"/><rect x="-12" y="-10" width="24" height="14" rx="1.5" class="scr2"/><path d="M-9 15H9M0 8V15" class="st"/>${l?`<text y="30" class="cap">${l}</text>`:''}</g>`;
  const sw = (x,y,l) => `<g transform="translate(${x},${y})"><rect x="-26" y="-11" width="52" height="22" rx="4" class="swb"/>${[-16,-5.3,5.3,16].map(px=>`<rect x="${px-3}" y="-3" width="6" height="6" rx="1" class="swp"/>`).join('')}${l?`<text y="27" class="cap">${l}</text>`:''}</g>`;
  const rt = (x,y,l) => `<g transform="translate(${x},${y})"><circle r="19" class="rtb"/><path d="M-10 -4H10M6 -8L10 -4L6 0M10 5H-10M-6 1L-10 5L-6 9" class="rta"/>${l?`<text y="34" class="cap">${l}</text>`:''}</g>`;
  const fw = (x,y,l) => `<g transform="translate(${x},${y})"><rect x="-24" y="-20" width="48" height="40" rx="4" class="fwb"/><path d="M-24 -7H24M-24 7H24M0 -20V-7M-12 -7V7M12 -7V7M0 7V20" class="fwl"/>${l?`<text y="36" class="cap">${l}</text>`:''}</g>`;
  const cloud = (x,y,l) => `<g transform="translate(${x},${y})" class="cloud"><circle cx="-16" cy="5" r="13"/><circle cx="1" cy="-5" r="18"/><circle cx="19" cy="5" r="13"/><rect x="-16" y="5" width="35" height="13"/>${l?`<text y="38" class="cap" style="fill:var(--muted)">${l}</text>`:''}</g>`;
  const line = (a,b,c,d) => `<path d="M${a} ${b}L${c} ${d}" class="ln"/>`;
  const svg = (w,h,body) => `<svg class="dg" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Network diagram">${body}</svg>`;
  const ring = (cx,cy,r,n,off=-90) => Array.from({length:n}, (_,k) => {
    const a = (off + k*360/n) * Math.PI/180;
    return [+(cx + r*Math.cos(a)).toFixed(1), +(cy + r*Math.sin(a)).toFixed(1)];
  });

  const DIAG = {
    star(){
      const c = [180,115], p = ring(180,115,82,6);
      return svg(360,230, p.map(q => line(c[0],c[1],q[0],q[1])).join('') + sw(180,115) + p.map(q => pc(q[0],q[1])).join(''));
    },
    bus(){
      const top = [70,180,290], bot = [125,235];
      return svg(360,230,
        `<path d="M28 115H332" class="ln" style="stroke-width:4"/><rect x="24" y="106" width="5" height="18" rx="1" class="term"/><rect x="331" y="106" width="5" height="18" rx="1" class="term"/>` +
        top.map(x => line(x,74,x,115)).join('') + bot.map(x => line(x,115,x,156)).join('') +
        top.map(x => pc(x,60)).join('') + bot.map(x => pc(x,170)).join(''));
    },
    ring(){
      const p = ring(180,115,78,6);
      return svg(360,230, p.map((q,k) => { const n = p[(k+1)%p.length]; return line(q[0],q[1],n[0],n[1]); }).join('') + p.map(q => pc(q[0],q[1])).join(''));
    },
    mesh(){
      const p = ring(180,118,78,5); let l = '';
      for(let a=0;a<p.length;a++) for(let b=a+1;b<p.length;b++) l += line(p[a][0],p[a][1],p[b][0],p[b][1]);
      return svg(360,230, l + p.map(q => pc(q[0],q[1])).join(''));
    },
    tree(){
      const l2 = [[95,108],[265,108]], l3 = [[55,182],[135,182],[225,182],[305,182]];
      return svg(360,230,
        l2.map(q => line(180,34,q[0],q[1])).join('') +
        l3.map((q,k) => { const par = l2[k<2?0:1]; return line(par[0],par[1],q[0],q[1]-12); }).join('') +
        sw(180,34) + l2.map(q => sw(q[0],q[1])).join('') + l3.map(q => pc(q[0],q[1])).join(''));
    },
    routing(){
      return svg(420,240,
        line(75,118,210,118) + line(210,118,345,118) +
        line(75,118,45,178) + line(75,118,105,178) + line(345,118,315,178) + line(345,118,375,178) +
        `<text x="75" y="76" class="ttl">LAN 1</text><text x="345" y="76" class="ttl">LAN 2</text>` +
        sw(75,118) + sw(345,118) + pc(45,180) + pc(105,180) + pc(315,180) + pc(375,180) +
        `<text x="75" y="226" class="ipl">192.168.1.0/24</text><text x="345" y="226" class="ipl">192.168.2.0/24</text>` +
        `<rect x="182" y="94" width="56" height="48" rx="8" class="qbox"/><text x="210" y="128" class="qm">?</text>`);
    },
    firewall(){
      return svg(420,210,
        line(90,100,176,100) + line(224,100,318,100) + line(318,100,378,58) + line(318,100,378,142) +
        `<rect x="284" y="26" width="128" height="148" rx="10" class="zone"/><text x="348" y="196" class="ttl">Internal LAN</text>` +
        cloud(58,96,'Internet') + fw(200,100,'Firewall') + sw(318,100) + pc(378,56) + pc(378,144));
    }
  };

  /* ================= QUESTIONS ================= */
  const TOPICS = [
    {name:'Network basics & topologies', from:1,  to:8},
    {name:'Networking devices & routing', from:9,  to:14},
    {name:'IP addressing & subnetting',  from:15, to:20},
    {name:'Security & firewalls',         from:21, to:25}
  ];

  const Q = [
    {t:'Which type of network usually connects computers inside a single building, such as a school or an office?',
     o:['WAN','LAN','MAN','PAN'], a:1,
     w:'A LAN (Local Area Network) covers a small area such as one building or campus. A WAN covers cities or countries.'},
    {t:'Which network topology is shown in the diagram?', d:'star',
     o:['Bus','Ring','Star','Mesh'], a:2,
     w:'In a star topology every device connects to one central device, usually a switch.'},
    {t:'Which network topology is shown in the diagram?', d:'bus',
     o:['Bus','Star','Tree','Ring'], a:0,
     w:'In a bus topology all devices share one main cable called the backbone, with terminators at both ends.'},
    {t:'Which network topology is shown in the diagram?', d:'ring',
     o:['Mesh','Bus','Star','Ring'], a:3,
     w:'In a ring topology each device connects to exactly two neighbours, forming a closed loop with no central device.'},
    {t:'Which network topology is shown in the diagram?', d:'mesh',
     o:['Star','Ring','Bus','Mesh'], a:3,
     w:'In a mesh topology devices have direct links to many or all other devices. It is very reliable but needs a lot of cabling.'},
    {t:'Which network topology is shown in the diagram?', d:'tree',
     o:['Ring','Star','Tree','Bus'], a:2,
     w:'A tree topology links several star networks together in a hierarchy, with a root switch at the top.'},
    {t:'In a star topology, what happens if the central switch fails?',
     o:['All devices lose connectivity','Only one PC is affected','Traffic reroutes through a ring','Nothing changes'], a:0,
     w:'The central switch is a single point of failure. Cables from each device all lead to it, so the whole network goes down.'},
    {t:'Which type of network connects devices across different cities or countries, such as the Internet?',
     o:['LAN','WAN','PAN','VLAN'], a:1,
     w:'A WAN (Wide Area Network) spans large geographic areas. The Internet is the best-known example.'},

    {t:'Which device connects computers within a LAN and forwards data using MAC addresses?',
     o:['Hub','Modem','Repeater','Switch'], a:3,
     w:'A switch learns MAC addresses and sends frames only to the port where the destination device is connected.'},
    {t:'Which device sends incoming data out of every port, regardless of which computer it is meant for?',
     o:['Router','Hub','Switch','Firewall'], a:1,
     w:'A hub is a simple repeater. It broadcasts everything it receives to all other ports.'},
    {t:'Which device lets laptops and phones connect to a wired network over Wi-Fi?',
     o:['Wireless access point','Hub','Modem','Patch panel'], a:0,
     w:'A wireless access point (AP) bridges Wi-Fi clients onto the wired LAN.'},
    {t:'LAN 1 and LAN 2 use different IP networks and must communicate. Which device belongs at the “?” position?', d:'routing',
     o:['Hub','Router','Repeater','Switch'], a:1,
     w:'A router connects different IP networks and forwards packets between them. A switch or hub only connects devices inside the same network.'},
    {t:'What is the default gateway configured on a PC?',
     o:['The IP address of the router used to reach other networks','The MAC address of the switch','The address of the DNS server','The PC’s own IP address'], a:0,
     w:'When a PC sends data to another network, it hands the packet to its default gateway, which is the local router’s IP address.'},
    {t:'What does a router use to decide where to forward a packet?',
     o:['The cable colour','Its MAC address table','The PC’s hostname','Its routing table'], a:3,
     w:'A router looks up the destination IP address in its routing table to find the best next hop.'},

    {t:'How many bits are there in an IPv4 address?',
     o:['16','48','64','32'], a:3,
     w:'An IPv4 address is 32 bits long, written as four 8-bit octets such as 192.168.1.10.'},
    {t:'Which of these is a private IPv4 address?',
     o:['8.8.8.8','45.33.12.9','192.168.1.25','142.250.1.1'], a:2,
     w:'Private ranges are 10.0.0.0/8, 172.16.0.0/12 and 192.168.0.0/16. They are used inside local networks and are not routed on the Internet.'},
    {t:'How many usable host addresses does a <code>/24</code> network have?',
     o:['255','256','254','252'], a:2,
     w:'A /24 has 8 host bits: 2⁸ = 256 addresses. Subtract the network and broadcast addresses to get 254 usable hosts.'},
    {t:'You split <code>192.168.1.0/24</code> into 4 equal subnets. Which prefix length should you use?',
     o:['/25','/26','/27','/28'], a:1,
     w:'4 subnets need 2 extra bits (2² = 4). 24 + 2 = /26, which gives four subnets of 64 addresses each.'},
    {t:'What is the network address of the host <code>192.168.1.70/26</code>?',
     o:['192.168.1.0','192.168.1.32','192.168.1.64','192.168.1.128'], a:2,
     w:'A /26 has blocks of 64 addresses: 0, 64, 128, 192. The address .70 falls in the block starting at .64.'},
    {t:'Which service automatically gives devices an IP address, subnet mask and default gateway?',
     o:['DHCP','DNS','FTP','SMTP'], a:0,
     w:'DHCP hands out IP settings automatically. DNS translates names to IP addresses.'},

    {t:'What is the main job of a firewall?',
     o:['Store backups of files','Speed up the Internet connection','Filter network traffic using security rules','Assign IP addresses to devices'], a:2,
     w:'A firewall inspects traffic and allows or blocks it according to a set of rules.'},
    {t:'In the diagram, what does the firewall do between the Internet and the internal LAN?', d:'firewall',
     o:['Converts electrical signals into light','Gives every PC a new MAC address','Stores web pages for later use','Allows or blocks traffic according to its rules'], a:3,
     w:'The firewall sits at the boundary between the untrusted Internet and the trusted internal network and controls what may pass.'},
    {t:'Which of these is the strongest password?',
     o:['password123','Rahul2005','12345678','T7#mQ!x9vL2p'], a:3,
     w:'A strong password is long and mixes upper and lower case letters, numbers and symbols, and contains no personal details or common words.'},
    {t:'An email that looks like it is from your bank asks you to click a link and enter your password. What is this attack called?',
     o:['Phishing','Port scanning','Defragmentation','Routing'], a:0,
     w:'Phishing tricks people into revealing sensitive information through fake emails or websites. Never enter credentials from an unexpected link.'},
    {t:'Which web address prefix shows that the connection to a website is encrypted?',
     o:['http://','https://','ftp://','telnet://'], a:1,
     w:'HTTPS uses TLS to encrypt traffic between your browser and the website. Look for the padlock icon too.'}
  ];
  const N = Q.length, L = 'ABCD';

  /* ================= STATE & HELPERS ================= */
  const S = {view:'intro', i:0, ans:Array(N).fill(null), name:'', email:'', t0:0, t1:0, filter:'all', err:'', syncMsg:'', syncType:''};
  const $ = s => document.querySelector(s);
  const view = $('#view'), controls = $('#controls'), main = $('#main');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topicOf = k => TOPICS.find(t => k+1 >= t.from && k+1 <= t.to);
  const isMono = s => /^[\d\/]/.test(s);
  const answered = () => S.ans.filter(a => a !== null).length;
  const score = () => S.ans.reduce((n,a,k) => n + (a === Q[k].a ? 1 : 0), 0);
  const optHTML = o => `<span class="txt ${isMono(o)?'m':''}">${o}</span>`;

  /* ================= VIEWS ================= */
  function introHTML(){
    return `
    <section class="intro">
      <div>
        <p class="kind">Computer networks · Beginner level</p>
        <h1>Basic Networking Quiz</h1>
        <p class="sub">Twenty-five multiple-choice questions on how networks are built, connected and protected. Diagrams are included where they help.</p>
        <ul class="topics">
          ${TOPICS.map(t => `<li><span class="n">${t.to-t.from+1} questions</span><span>${esc(t.name)}</span></li>`).join('')}
        </ul>
        <ul class="rules">
          <li>Each question has four options and one correct answer.</li>
          <li>Every question is worth 1 mark. There is no negative marking.</li>
          <li>You can go back and change answers until you submit.</li>
        </ul>
      </div>
      <div class="panel card">
        <h2>Enter your details</h2>
        <p>Your name appears on the result page.</p>
        <label class="field"><span>Full name</span><input id="f-name" type="text" autocomplete="name" value="${esc(S.name)}" placeholder="e.g. John Doe"></label>
        <label class="field"><span>Email address <em>(optional)</em></span><input id="f-email" type="email" autocomplete="email" value="${esc(S.email)}" placeholder="name@example.com"></label>
        <p class="msg-err" id="err" role="alert">${esc(S.err)}</p>
        <button class="btn primary" type="button" data-act="start">Start quiz</button>
      </div>
    </section>`;
  }

  function questionHTML(k){
    const q = Q[k], t = topicOf(k);
    return `
    <section class="qwrap ${q.d ? 'has-d' : ''}">
      ${q.d ? `<div class="panel dgram">${DIAG[q.d]()}<p class="dcap">Study the diagram</p></div>` : ''}
      <div class="panel qcard">
        <div class="q-meta"><span class="num">Question ${k+1} of ${N}</span><span>${esc(t.name)}</span></div>
        <p class="q-text">${q.t}</p>
        <div class="opts" role="radiogroup" aria-label="Answer options">
          ${q.o.map((o,j) => `
            <button type="button" class="opt ${S.ans[k]===j?'picked':''}" role="radio" aria-checked="${S.ans[k]===j}" data-act="pick" data-j="${j}">
              <span class="letter">${L[j]}</span>${optHTML(o)}
            </button>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function reviewHTML(){
    const left = N - answered();
    return `
    <section class="panel">
      <div class="rev-head">
        <h2>Review your answers</h2>
        <p>${answered()} of ${N} questions answered. Select a number to go back to that question, or submit when you are ready.</p>
        ${left ? `<div class="notice">${left} question${left===1?' is':'s are'} unanswered. Unanswered questions score zero.</div>` : ''}
      </div>
      <div class="tiles">
        ${Q.map((q,k) => `<button type="button" class="tile ${S.ans[k]!==null?'ans':''}" data-act="goto" data-n="${k}" aria-label="Question ${k+1}, ${S.ans[k]!==null?'answered':'unanswered'}">${k+1}</button>`).join('')}
      </div>
    </section>`;
  }

  function fmtTime(ms){ const s = Math.round(ms/1000); return Math.floor(s/60) + ' min ' + String(s%60).padStart(2,'0') + ' sec'; }

  function resultsHTML(){
    const sc = score(), pct = Math.round(sc/N*100);
    const band = pct >= 80 ? ['ok','Excellent work'] : pct >= 60 ? ['mid','Good effort'] : ['low','Keep practising'];
    const msg = pct >= 80 ? 'You have a strong grasp of basic networking.'
              : pct >= 60 ? 'You know the fundamentals. Review the questions you missed below.'
              : 'Read the explanations below, then try the quiz again.';
    const C = 2*Math.PI*54, off = C * (1 - sc/N);
    const col = band[0]==='ok' ? 'var(--ok)' : band[0]==='mid' ? 'var(--accent)' : 'var(--bad)';
    const wrongN = Q.filter((q,k) => S.ans[k] !== q.a).length;
    return `
    <section class="panel res-top">
      <div class="donut" role="img" aria-label="Score ${sc} out of ${N}">
        <svg viewBox="0 0 120 120"><circle class="trk" cx="60" cy="60" r="54" fill="none" stroke-width="10"/><circle class="val" id="ring" cx="60" cy="60" r="54" fill="none" stroke-width="10" stroke-linecap="round" stroke="${col}" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${C.toFixed(2)}" data-off="${off.toFixed(2)}"/></svg>
        <div class="mid"><div class="big">${sc}<small> / ${N}</small></div><div class="pct">${pct}%</div></div>
      </div>
      <div class="res-info">
        <h2>${esc(S.name)}</h2>
        <div class="band ${band[0]}">${band[1]}</div>
        <p style="margin:0 0 14px;color:var(--muted);font-size:15.5px">${msg}</p>
        <div class="meta">
          ${S.email ? `<span>Email: <b>${esc(S.email)}</b></span>` : ''}
          <span>Answered: <b>${answered()} / ${N}</b></span>
          <span>Time taken: <b>${fmtTime(S.t1 - S.t0)}</b></span>
          <span>Submitted: <b>${esc(new Date(S.t1).toLocaleString())}</b></span>
        </div>
        ${S.syncMsg ? `<div class="sync-status ${S.syncType}">${S.syncMsg}</div>` : ''}
      </div>
    </section>

    <section class="panel sec">
      <h3>Score by topic</h3>
      <div class="bars">
        ${TOPICS.map(t => {
          const total = t.to - t.from + 1; let ok = 0;
          for(let k=t.from-1;k<t.to;k++) if(S.ans[k] === Q[k].a) ok++;
          return `<div class="bar-row"><span>${esc(t.name)}</span><div class="bar"><i style="width:${ok/total*100}%"></i></div><span class="sc">${ok} / ${total}</span></div>`;
        }).join('')}
      </div>
    </section>

    <section class="panel sec">
      <h3>Answer review</h3>
      <div class="filters">
        <button type="button" class="chip ${S.filter==='all'?'on':''}" data-act="filter" data-f="all">All questions (${N})</button>
        <button type="button" class="chip ${S.filter==='wrong'?'on':''}" data-act="filter" data-f="wrong">Needs review (${wrongN})</button>
      </div>
      ${Q.map((q,k) => {
        const a = S.ans[k], state = a === null ? 'none' : a === q.a ? 'ok' : 'bad';
        if(S.filter === 'wrong' && state === 'ok') return '';
        return `
        <article class="ritem ${state}">
          <div class="rhead"><span class="badge ${state}">${state==='ok'?'Correct':state==='bad'?'Incorrect':'Not answered'}</span><span>Question ${k+1} · ${esc(topicOf(k).name)}</span></div>
          <p class="rq">${q.t}</p>
          ${q.d ? `<div class="rdg">${DIAG[q.d]()}</div>` : ''}
          <div class="rops">
            ${q.o.map((o,j) => {
              const cls = j === q.a ? 'right' : j === a ? 'wrong' : '';
              const tag = j === q.a ? (j === a ? 'Your answer · correct' : 'Correct answer') : j === a ? 'Your answer' : '';
              return `<div class="rop ${cls}"><span class="letter">${L[j]}</span>${optHTML(o)}${tag ? `<span class="tag">${tag}</span>` : ''}</div>`;
            }).join('')}
          </div>
          <p class="why">${q.w}</p>
        </article>`;
      }).join('') || '<p style="color:var(--muted)">Nothing to review. Every question was answered correctly.</p>'}
    </section>`;
  }

  /* ================= CHROME ================= */
  function renderChrome(){
    const v = S.view;
    $('#who').textContent = v === 'intro' ? '' : S.name;
    $('#count').textContent = v === 'quiz' ? `Question ${S.i+1} of ${N}` : v === 'review' ? 'Review' : v === 'result' ? 'Result' : '';

    $('#ticks').innerHTML = (v === 'quiz' || v === 'review') ? Q.map((q,k) => {
      let c = 'tick';
      if(S.ans[k] !== null) c += ' ans';
      if(v === 'quiz' && S.i === k) c += ' cur';
      if(k === 7 || k === 13 || k === 19) c += ' gap';
      return `<button type="button" class="${c}" data-act="goto" data-n="${k}" title="Question ${k+1}" aria-label="Go to question ${k+1}"></button>`;
    }).join('') : '';

    if(v === 'quiz'){
      controls.innerHTML = `
        <button class="btn" type="button" data-act="prev" ${S.i===0?'disabled':''}>← Previous</button>
        <span class="mid">${answered()} of ${N} answered</span>
        <button class="btn primary" type="button" data-act="next">${S.i === N-1 ? 'Review answers' : 'Next →'}</button>`;
    } else if(v === 'review'){
      controls.innerHTML = `
        <button class="btn" type="button" data-act="goto" data-n="${N-1}">← Back to questions</button>
        <span class="mid">${answered()} of ${N} answered</span>
        <button class="btn primary" type="button" data-act="submit">Submit quiz</button>`;
    } else if(v === 'result'){
      controls.innerHTML = `
        <button class="btn" type="button" data-act="print">Print result</button>
        <button class="btn primary" type="button" data-act="retake">Take the quiz again</button>`;
    } else controls.innerHTML = '';
  }

  function render(keepScroll){
    const y = main.scrollTop;
    view.innerHTML = S.view === 'intro' ? introHTML()
      : S.view === 'quiz' ? questionHTML(S.i)
      : S.view === 'review' ? reviewHTML() : resultsHTML();
    renderChrome();
    main.scrollTop = keepScroll ? y : 0;
    if(S.view === 'result'){
      const ring = $('#ring');
      if(ring) requestAnimationFrame(() => requestAnimationFrame(() => { ring.style.strokeDashoffset = ring.dataset.off; }));
    }
  }

  /* ================= SUBMIT TO CLOUDFLARE ================= */
  async function submitQuiz(){
    S.t1 = Date.now();
    S.view = 'result';
    S.filter = 'all';

    const sc = score();
    const pct = Math.round((sc / N) * 100);
    const band = pct >= 80 ? 'Excellent work' : pct >= 60 ? 'Good effort' : 'Keep practising';
    const timeSec = Math.round((S.t1 - S.t0) / 1000);

    if(!API_URL || API_URL.includes("https://quiz-submit-api.dk9444455.workers.dev")){
      S.syncMsg = 'ℹ️ Note: Worker URL not configured yet. Complete Milestone 6 to save to D1.';
      S.syncType = 'wait';
      render();
      return;
    }

    S.syncMsg = '⏳ Saving result to database...';
    S.syncType = 'wait';
    render();

    try {
      const resp = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: S.name,
          email: S.email || null,
          score: sc,
          totalQuestions: N,
          percentage: pct,
          timeTakenSec: timeSec,
          band: band
        })
      });

      if (resp.ok) {
        S.syncMsg = '✅ Score and details recorded securely in database!';
        S.syncType = 'ok';
      } else {
        S.syncMsg = '⚠️ Quiz completed, but saving to database failed.';
        S.syncType = 'bad';
      }
    } catch(err) {
      console.error("Backend error:", err);
      S.syncMsg = '⚠️ Could not connect to the database worker.';
      S.syncType = 'bad';
    }
    render(true);
  }

  /* ================= ACTIONS ================= */
  function start(){
    const name = S.name.trim(), email = S.email.trim();
    const okEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!name){ S.err = 'Please enter your name to begin.'; }
    else if(!okEmail){ S.err = 'That email address does not look right. Fix it or leave it blank.'; }
    else { S.err = ''; S.name = name; S.email = email; S.view = 'quiz'; S.i = 0; S.t0 = Date.now(); render(); return; }
    render(true);
    const f = $(!name ? '#f-name' : '#f-email');
    if(f){ f.classList.add('err'); f.focus(); }
  }
  function reset(){
    S.ans = Array(N).fill(null); S.view = 'intro'; S.i = 0; S.filter = 'all'; S.err = ''; S.syncMsg = ''; S.syncType = '';
    render();
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-act]'); if(!el) return;
    switch(el.dataset.act){
      case 'start': start(); break;
      case 'pick': S.ans[S.i] = +el.dataset.j; render(true); break;
      case 'prev': if(S.i > 0){ S.i--; render(); } break;
      case 'next': if(S.i < N-1){ S.i++; render(); } else { S.view = 'review'; render(); } break;
      case 'goto': S.i = +el.dataset.n; S.view = 'quiz'; render(); break;
      case 'submit': submitQuiz(); break;
      case 'filter': S.filter = el.dataset.f; render(true); break;
      case 'print': window.print(); break;
      case 'retake': reset(); break;
    }
  });

  document.addEventListener('input', e => {
    if(e.target.id === 'f-name') S.name = e.target.value;
    if(e.target.id === 'f-email') S.email = e.target.value;
    if(e.target.classList && e.target.classList.contains('err')) e.target.classList.remove('err');
  });

  document.addEventListener('keydown', e => {
    if(e.target.matches('input, textarea')){
      if(e.key === 'Enter' && S.view === 'intro'){ e.preventDefault(); start(); }
      return;
    }
    if(e.ctrlKey || e.metaKey || e.altKey || S.view !== 'quiz') return;
    if(e.key === 'ArrowRight'){ if(S.i < N-1){ S.i++; } else { S.view = 'review'; } render(); }
    else if(e.key === 'ArrowLeft' && S.i > 0){ S.i--; render(); }
    else if(e.key.length === 1){
      const j = 'abcd1234'.indexOf(e.key.toLowerCase());
      if(j >= 0){ S.ans[S.i] = j % 4; render(true); }
    }
  });

  render();
})();
