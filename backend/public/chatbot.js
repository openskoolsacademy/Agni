var Rs=Object.defineProperty;var Is=(ge,te,oe)=>te in ge?Rs(ge,te,{enumerable:!0,configurable:!0,writable:!0,value:oe}):ge[te]=oe;var R=(ge,te,oe)=>Is(ge,typeof te!="symbol"?te+"":te,oe);(function(){"use strict";var it;function ge(n,e){const t=e==="bottom-left";return`
    :host {
      --primary: ${n||"#4F46E5"};
      --primary-hover: ${n||"#4338CA"};
      --bg: #FFFFFF;
      --surface: #F9FAFB;
      --border: #E5E7EB;
      --text: #111827;
      --text-muted: #6B7280;
      --user-text: #FFFFFF;
      --shadow-lg: 0 12px 36px -4px rgba(0, 0, 0, 0.16), 0 4px 16px -2px rgba(0, 0, 0, 0.08);
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-family: var(--font-family);
      line-height: 1.5;
      font-size: 14px;
      color: var(--text);
      z-index: 2147483647;
      position: fixed;
      ${t?"left: 24px;":"right: 24px;"}
      bottom: 24px;
      display: block;
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* Floating Launcher Button */
    .chatbot-launcher {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: var(--primary);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s ease;
      border: none;
      outline: none;
      user-select: none;
      position: absolute;
      bottom: 0;
      ${t?"left: 0;":"right: 0;"}
      z-index: 10;
    }

    .chatbot-launcher:hover {
      transform: scale(1.08);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
    }

    .chatbot-launcher:active {
      transform: scale(0.95);
    }

    .launcher-icon-chat,
    .launcher-icon-close {
      position: absolute;
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    .launcher-icon-close {
      opacity: 0;
      transform: rotate(-90deg) scale(0.5);
    }

    .chatbot-launcher.is-open .launcher-icon-chat {
      opacity: 0;
      transform: rotate(90deg) scale(0.5);
    }

    .chatbot-launcher.is-open .launcher-icon-close {
      opacity: 1;
      transform: rotate(0deg) scale(1);
    }

    .launcher-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background-color: #10B981;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
    }

    /* Chat Window Container */
    .chatbot-window {
      position: absolute;
      bottom: 74px;
      ${t?"left: 0;":"right: 0;"}
      width: 390px;
      height: 610px;
      max-height: calc(100vh - 110px);
      background: var(--bg);
      border-radius: 20px;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transform-origin: ${t?"bottom left":"bottom right"};
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
      opacity: 0;
      transform: scale(0.92) translateY(16px);
      pointer-events: none;
      visibility: hidden;
    }

    .chatbot-window.is-open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: auto;
      visibility: visible;
    }

    /* Header */
    .chatbot-header {
      padding: 16px 20px;
      background: linear-gradient(135deg, var(--primary) 0%, #312E81 100%);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      flex-shrink: 0;
    }

    .header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      overflow: hidden;
      flex-shrink: 0;
    }

    .bot-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bot-meta h3 {
      font-size: 15px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.2;
    }

    .bot-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      margin-top: 2px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #10B981;
      box-shadow: 0 0 8px #10B981;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-btn {
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #FFFFFF;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .header-btn:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    /* Message Body Scroll Area */
    .chatbot-body {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--surface);
      scroll-behavior: smooth;
    }

    .chatbot-body::-webkit-scrollbar {
      width: 5px;
    }

    .chatbot-body::-webkit-scrollbar-thumb {
      background: #D1D5DB;
      border-radius: 10px;
    }

    /* Message Item */
    .message-row {
      display: flex;
      max-width: 88%;
      animation: msgFadeIn 0.2s ease-out;
    }

    @keyframes msgFadeIn {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .message-row.user {
      align-self: flex-end;
      flex-direction: column;
      align-items: flex-end;
    }

    .message-row.assistant {
      align-self: flex-start;
      flex-direction: column;
      align-items: flex-start;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.55;
      word-break: break-word;
      overflow-wrap: break-word;
      position: relative;
      box-sizing: border-box;
      width: fit-content;
      max-width: 100%;
    }

    .message-row.user .message-bubble {
      background: var(--primary);
      color: var(--user-text);
      border-bottom-right-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }

    .message-row.assistant .message-bubble {
      background: #FFFFFF;
      color: var(--text);
      border-bottom-left-radius: 4px;
      border: 1px solid var(--border);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    /* Markdown Styles inside Message Bubble */
    .message-bubble h1, .message-bubble h2, .message-bubble h3 {
      margin-top: 10px;
      margin-bottom: 6px;
      font-weight: 600;
      line-height: 1.25;
    }
    .message-bubble h1 { font-size: 1.15em; }
    .message-bubble h2 { font-size: 1.08em; }
    .message-bubble h3 { font-size: 1.02em; }
    
    .message-bubble p {
      margin-top: 0;
      margin-bottom: 8px;
    }
    .message-bubble p:last-child {
      margin-bottom: 0;
    }
    
    .message-bubble ul, .message-bubble ol {
      margin-top: 0;
      margin-bottom: 8px;
      padding-left: 18px;
    }
    .message-bubble li {
      margin-bottom: 4px;
    }
    .message-bubble li:last-child {
      margin-bottom: 0;
    }

    .message-bubble strong {
      font-weight: 600;
      color: inherit;
    }
    
    .message-bubble a {
      color: var(--primary);
      text-decoration: underline;
      word-break: break-all;
    }
    
    .message-bubble code {
      background-color: rgba(0,0,0,0.06);
      padding: 2px 4px;
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88em;
    }
    .message-bubble pre {
      background-color: #1f2937;
      color: #f3f4f6;
      padding: 10px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 8px 0;
      font-size: 0.85em;
    }
    .message-bubble pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }

    .message-time {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 6px;
      display: block;
      text-align: right;
    }

    .message-row.user .message-time {
      text-align: right;
      color: rgba(255, 255, 255, 0.75);
    }

    /* Copy & Action Buttons */
    .message-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 5px;
      padding-left: 2px;
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .message-row:hover .message-actions,
    .message-row:focus-within .message-actions {
      opacity: 1;
    }

    @media (hover: none) {
      .message-actions {
        opacity: 0.85;
      }
    }

    .action-chip-btn {
      background: #FFFFFF;
      border: 1px solid var(--border);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
      user-select: none;
    }

    .action-chip-btn:hover {
      background: #F3F4F6;
      color: var(--text);
      border-color: #D1D5DB;
    }

    /* Suggested Questions Section */
    .suggested-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 8px;
    }

    .suggested-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .suggested-btn {
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 9px 14px;
      text-align: left;
      font-size: 13px;
      color: var(--text);
      cursor: pointer;
      transition: all 0.15s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    }

    .suggested-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: #EEF2FF;
      transform: translateY(-1px);
    }

    /* Typing Dots Indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 12px 16px;
      background: #FFFFFF;
      border: 1px solid var(--border);
      border-radius: 18px;
      border-bottom-left-radius: 4px;
      width: fit-content;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    .typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--text-muted);
      animation: typingPulse 1.4s infinite ease-in-out both;
    }

    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typingPulse {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }

    /* Streaming Cursor */
    .streaming-cursor {
      display: inline-block;
      width: 6px;
      height: 14px;
      background: var(--primary);
      margin-left: 3px;
      vertical-align: middle;
      animation: blink 0.8s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Footer Input Area */
    .chatbot-footer {
      padding: 14px 16px;
      background: #FFFFFF;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 6px;
      flex-shrink: 0;
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 6px 10px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
      background: #FFFFFF;
    }

    .chatbot-textarea {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      resize: none;
      font-size: 14px;
      font-family: inherit;
      color: var(--text);
      max-height: 100px;
      min-height: 24px;
      line-height: 1.4;
      padding: 4px 0;
    }

    .chatbot-textarea::placeholder {
      color: var(--text-muted);
    }

    .send-btn {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--primary);
      color: #FFFFFF;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.15s ease, transform 0.1s ease;
      flex-shrink: 0;
    }

    .send-btn:hover:not(:disabled) {
      background: var(--primary-hover);
      transform: scale(1.05);
    }

    .send-btn:disabled {
      background: #E5E7EB;
      color: #9CA3AF;
      cursor: not-allowed;
    }

    .branding-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .branding-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
    }

    /* Mobile Full-Screen Optimization (viewport < 640px) */
    @media (max-width: 640px) {
      :host {
        bottom: 16px;
        ${t?"left: 16px;":"right: 16px;"}
      }

      .chatbot-window {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100vw !important;
        height: 100dvh !important;
        max-height: 100dvh !important;
        border-radius: 0 !important;
        border: none !important;
        z-index: 2147483647 !important;
      }

      .chatbot-window.is-open {
        transform: none !important;
      }
    }
  `}class te{constructor(){this.ctx=null}initCtx(){if(!this.ctx&&typeof window<"u"){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}}playSendSound(){try{if(this.initCtx(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(440,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(880,this.ctx.currentTime+.08),t.gain.setValueAtTime(.08,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.08),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.09)}catch{}}playReceiveSound(){try{if(this.initCtx(),!this.ctx)return;this.ctx.state==="suspended"&&this.ctx.resume();const e=this.ctx.createOscillator(),t=this.ctx.createGain();e.type="sine",e.frequency.setValueAtTime(587.33,this.ctx.currentTime),e.frequency.exponentialRampToValueAtTime(880,this.ctx.currentTime+.07),t.gain.setValueAtTime(.1,this.ctx.currentTime),t.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.16),e.connect(t),t.connect(this.ctx.destination),e.start(),e.stop(this.ctx.currentTime+.17)}catch{}}}const oe=new te;function xt(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var me=xt();function en(n){me=n}var be={exec:()=>null};function _e(n){let e=[];return t=>{let i=Math.max(0,Math.min(3,t-1)),r=e[i];return r||(r=n(i),e[i]=r),r}}function w(n,e=""){let t=typeof n=="string"?n:n.source,i={replace:(r,o)=>{let c=typeof o=="string"?o:o.source;return c=c.replace($.caret,"$1"),t=t.replace(r,c),i},getRegex:()=>new RegExp(t,e)};return i}var br=((n="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+n)}catch{return!1}})(),$={codeRemoveIndent:/^(?: {0,3}\t| {1,4})/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,endingSpaceTabChar:/[ \t]$/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,leadingSpaceTab:/^[ \t]+/,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,numericCharacterReference:/&#(?:(\d{1,7})|[Xx]([A-Fa-f0-9]{1,6}));/g,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:_e(n=>new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:_e(n=>new RegExp(`^ {0,${n}}((?:-[ 	]*){3,}|(?:_[ 	]*){3,}|(?:\\*[ 	]*){3,})(?:\\n+|$)`)),fencesBeginRegex:_e(n=>new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)),headingBeginRegex:_e(n=>new RegExp(`^ {0,${n}}#`)),htmlBeginRegex:_e(n=>new RegExp(`^ {0,${n}}(?:</?(?:${Ne})(?: +|$|/?>)|<(?:script|pre|style|textarea|!--))`,"i")),blockquoteBeginRegex:_e(n=>new RegExp(`^ {0,${n}}>`))},xr=/^(?:[ \t]*(?:\n|$))+/,kr=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,wr=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,$e=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,yr=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,kt=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,tn=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |fences|blockquote|heading|hr|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,nn=w(tn).replace(/bull/g,kt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),Tr=w(tn).replace(/bull/g,kt).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/hr/g,/ {0,3}(?:(?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),wt=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,Er=/^[^\n]+/,yt=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,_r=w(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",yt).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),Ar=w(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,kt).getRegex(),Ne="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",Tt=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,Sr=w("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][a-z0-9-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][a-z0-9-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",Tt).replace("tag",Ne).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),rn=n=>w(wt).replace("hr",$e).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list",n).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ne).getRegex(),vr=rn(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),Rr=rn(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),Ir=w(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",Rr).getRegex(),Et={blockquote:Ir,code:kr,def:_r,fences:wr,heading:yr,hr:$e,html:Sr,lheading:nn,list:Ar,newline:xr,paragraph:vr,table:be,text:Er},sn=w("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",$e).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ne).getRegex(),Lr={...Et,lheading:Tr,table:sn,paragraph:w(wt).replace("hr",$e).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",sn).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*(?:\\n|$))|~~~)[^\\n]*(?:\\n|$)").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",Ne).getRegex()},Cr={...Et,html:w(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",Tt).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:be,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:w(wt).replace("hr",$e).replace("heading",` *#{1,6} *[^
]`).replace("lheading",nn).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},Or=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,Dr=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,on=/^( {2,}|\\)\n(?!\s*$)[ \t]*/,Pr=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,ne=/[\p{P}\p{S}]/u,Ae=/[\s\p{P}\p{S}]/u,Be=/[^\s\p{P}\p{S}]/u,Mr=w(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,Ae).getRegex(),zr=/[\p{Pi}\p{Ps}"']/u,an=/(?!~)[\p{P}\p{S}]/u,Fr=/(?!~)[\s\p{P}\p{S}]/u,$r=/(?:[^\s\p{P}\p{S}]|~)/u,Nr=w(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",br?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),ln=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,Br=w(ln,"u").replace(/punct/g,ne).getRegex(),Hr=w(ln,"u").replace(/punct/g,an).getRegex(),Ur=/^(?:\*+(?:((?!\*)(?!openQuote)punct)|([^\s*]))?)|^_+(?:((?!_)(?!openQuote)punct)|([^\s_]))?/,Gr=w(Ur,"u").replace(/openQuote/g,zr).replace(/punct/g,ne).getRegex(),cn="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",Wr=w(cn,"gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,Ae).replace(/punct/g,ne).getRegex(),jr=w(cn,"gu").replace(/notPunctSpace/g,$r).replace(/punctSpace/g,Fr).replace(/punct/g,an).getRegex(),qr="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)[\\s](\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|(?:(?!\\*)punct|notPunctSpace)(\\*+)(?!\\*)(?=notPunctSpace)",Yr=w(qr,"gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,Ae).replace(/punct/g,ne).getRegex(),Zr=w("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,Ae).replace(/punct/g,ne).getRegex(),Vr="^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)[\\s](_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)|(?:(?!_)punct|notPunctSpace)(_+)(?!_)(?=notPunctSpace)",Xr=w(Vr,"gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,Ae).replace(/punct/g,ne).getRegex(),Qr=w(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,ne).getRegex(),Kr="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",Jr=w(Kr,"gu").replace(/notPunctSpace/g,Be).replace(/punctSpace/g,Ae).replace(/punct/g,ne).getRegex(),ei=w(/\\(punct)/,"gu").replace(/punct/g,ne).getRegex(),ti=w(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),ni=w(Tt).replace("(?:-->|$)","-->").getRegex(),ri=w("^comment|^</[a-zA-Z][a-zA-Z0-9-]*\\s*>|^<[a-zA-Z][a-zA-Z0-9-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",ni).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),un=/\[(?:\\[\s\S]|[^\[\]\\])*\]/,Ke=w(/(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/).replace("brackets",un).getRegex(),ii=w(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",Ke).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),si=w(/^!?\[(label)\]\[(ref)\]/).replace("label",Ke).replace("ref",yt).getRegex(),oi=w(/^!?\[(ref)\](?:\[\])?/).replace("ref",yt).getRegex(),pn=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\]){1,999}/,ai=w(/(?:[^\[\]\\`]*(?:\[(?:brackets|\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\]))){0,999}?[^\[\]\\`]*?/).replace("brackets",un).getRegex(),li=w("reflink|nolink(?!\\()","g").replace("reflink",w(/^!?\[(label)\]\[(ref)\]/).replace("label",ai).replace("ref",pn).getRegex()).replace("nolink",w(/^!?\[(ref)\](?:\[\])?/).replace("ref",pn).getRegex()).getRegex(),hn=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,ci=/[A-Za-z0-9._+-]+@[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/,ui=w(/(?:mailto:email|xmpp:email(?:\/[A-Za-z0-9@.]+)?)/).replace(/email/g,ci).getRegex(),_t={_backpedal:be,anyPunctuation:ei,autolink:ti,blockSkip:Nr,br:on,code:Dr,del:be,delLDelim:be,delRDelim:be,emStrongLDelim:Br,emStrongRDelimAst:Wr,emStrongRDelimUnd:Zr,escape:Or,link:ii,nolink:oi,punctuation:Mr,reflink:si,reflinkSearch:li,tag:ri,text:Pr,url:be},pi={..._t,emStrongLDelim:Gr,emStrongRDelimAst:Yr,emStrongRDelimUnd:Xr,link:w(/^!?\[(label)\]\((.*?)\)/).replace("label",Ke).getRegex(),reflink:w(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",Ke).getRegex()},At={..._t,emStrongRDelimAst:jr,emStrongLDelim:Hr,delLDelim:Qr,delRDelim:Jr,url:w(/^emailProtocol|^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("emailProtocol",ui).replace("protocol",hn).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![\w-])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:w(/^(?:[^a-zA-Z0-9](?=emailProtocol)|(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9](?=emailProtocol)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))))/).replace("protocol",hn).replace(/emailProtocol/g,/(?:mailto|xmpp):/).getRegex()},hi={...At,br:w(on).replace("{2,}","*").getRegex(),text:w(At.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},Je={normal:Et,gfm:Lr,pedantic:Cr},He={normal:_t,gfm:At,breaks:hi,pedantic:pi},di={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},dn=n=>di[n];function G(n,e){if(e){if($.escapeTest.test(n))return n.replace($.escapeReplace,dn)}else if($.escapeTestNoEncode.test(n))return n.replace($.escapeReplaceNoEncode,dn);return n}function fi(n){return n.replace($.numericCharacterReference,(e,t,i)=>{let r=t===void 0?Number.parseInt(i,16):Number.parseInt(t,10);return r===0||r>1114111||r>=55296&&r<=57343?"�":String.fromCodePoint(r)})}function fn(n){try{n=encodeURI(n).replace($.percentDecode,"%")}catch{return null}return n}function gn(n,e){var o;let t=n.replace($.findPipe,(c,u,a)=>{let m=!1,p=u;for(;--p>=0&&a[p]==="\\";)m=!m;return m?"|":" |"}),i=t.split($.splitPipe),r=0;if(i[0].trim()||i.shift(),i.length>0&&!((o=i.at(-1))!=null&&o.trim())&&i.pop(),e)if(i.length>e)i.splice(e);else for(;i.length<e;)i.push("");for(;r<i.length;r++)i[r]=i[r].trim().replace($.slashPipe,"|");return i}function ae(n,e,t){let i=n.length;if(i===0)return"";let r=0;for(;r<i&&n.charAt(i-r-1)===e;)r++;return n.slice(0,i-r)}function mn(n){let e=n.split(`
`),t=e.length-1;for(;t>=0&&$.blankLine.test(e[t]);)t--;return e.length-t<=2?n:e.slice(0,t+1).join(`
`)}function et(n){return n.trim().toLowerCase().toUpperCase().toLowerCase()}function gi(n,e){if(n.indexOf(e[1])===-1)return-1;let t=0;for(let i=0;i<n.length;i++)if(n[i]==="\\")i++;else if(n[i]===e[0])t++;else if(n[i]===e[1]&&(t--,t<0))return i;return t>0?-2:-1}function bn(n,e=0){let t=e,i="";for(let r of n)if(r==="	"){let o=4-t%4;i+=" ".repeat(o),t+=o}else i+=r,t++;return i}function xn(n,e,t,i,r){let o=e.href,c=e.title||null,u=n[1].replace(r.other.outputLinkReplace,"$1"),a=n[0].charAt(0)==="!";i.state.inLink=!0;let m=i.state.linkEmitted,p=i.state.inRawBlock;i.state.linkEmitted=!1;let k=i.inlineTokens(u),g=i.state.linkEmitted;if(i.state.linkEmitted=m,i.state.inLink=!1,!a){if(g){i.state.inRawBlock=p;return}i.state.linkEmitted=!0}return{type:a?"image":"link",raw:t,href:o,title:c,text:u,tokens:k}}function mi(n,e,t){let i=n.match(t.other.indentCodeCompensation);if(i===null)return e;let r=i[1];return e.split(`
`).map(o=>{let c=o.match(t.other.beginningSpace);if(c===null)return o;let[u]=c;return o.slice(Math.min(u.length,r.length))}).join(`
`)}function kn(n,e,t,i){if(!e.includes("<"))return!1;for(let r=0;r<e.length;r++){if(e[r]==="\\"){r++;continue}if(e[r]==="`"){let u=i.inline.code.exec(e.slice(r));if(u){r+=u[0].length-1;continue}}if(e[r]!=="<")continue;let o=n.slice(t+r),c=i.inline.tag.exec(o)||i.inline.autolink.exec(o);if(c){if(c[0].length>e.length-r)return!0;r+=c[0].length-1}}return!1}var tt=class{constructor(n){R(this,"options");R(this,"rules");R(this,"lexer");this.options=n||me}space(n){let e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){let e=this.rules.block.code.exec(n);if(e){let t=this.options.pedantic?e[0]:mn(e[0]),i=t.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t,codeBlockStyle:"indented",text:i}}}fences(n){let e=this.rules.block.fences.exec(n);if(e){let t=e[0],i=mi(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:i}}}heading(n){let e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let i=ae(t,"#");(this.options.pedantic||!i||this.rules.other.endingSpaceTabChar.test(i))&&(t=i.trim())}return{type:"heading",raw:ae(e[0],`
`),depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){let e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:ae(e[0],`
`)}}blockquote(n){let e=this.rules.block.blockquote.exec(n);if(e){let t=ae(e[0],`
`).split(`
`),i="",r="",o=[];for(;t.length>0;){let c=!1,u=[],a;for(a=0;a<t.length;a++)if(this.rules.other.blockquoteStart.test(t[a]))u.push(t[a]),c=!0;else if(!c)u.push(t[a]);else break;t=t.slice(a);let m=u.join(`
`),p=m.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");i=i?`${i}
${m}`:m,r=r?`${r}
${p}`:p;let k=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(p,o,!0),this.lexer.state.top=k,t.length===0)break;let g=o.at(-1);if((g==null?void 0:g.type)==="code")break;if((g==null?void 0:g.type)==="blockquote"){let E=g,b=t.join(`
`),v=E.raw+`
`+b.replace(this.rules.other.blockquoteSetextReplace2,""),y=this.blockquote(v);o[o.length-1]=y;let z=v.substring(y.raw.length).replace(/^\n/,""),ue=z?z.split(`
`).length:0,re=ue?t.slice(0,-ue):t;re.length>0&&(i=`${i}
${re.join(`
`)}`),r=r.substring(0,r.length-E.text.length)+y.text;break}else if((g==null?void 0:g.type)==="list"){let E=g,b=E.raw+`
`+t.join(`
`),v=this.list(b);o[o.length-1]=v,i=i.substring(0,i.length-g.raw.length)+v.raw,r=r.substring(0,r.length-E.raw.length)+v.raw,t=b.substring(o.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:i,tokens:o,text:r}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t=e[1].trim(),i=t.length>1,r={type:"list",raw:"",ordered:i,start:i?+t.slice(0,-1):"",loose:!1,items:[]};t=i?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=i?t:"[*+-]");let o=this.rules.other.listItemRegex(t),c=!1;for(;n;){let a=!1,m="",p="";if(!(e=o.exec(n))||this.rules.block.hr.test(n))break;m=e[0],n=n.substring(m.length);let k=e[2].split(`
`,1)[0],g=e[1].length,E=this.options.pedantic?bn(k,g):k.replace(this.rules.other.leadingSpaceTab,z=>bn(z,g)),b=n.split(`
`,1)[0],v=!E.trim(),y=0;if(this.options.pedantic?(y=2,p=E.trimStart()):v?y=g+1:(y=E.search(this.rules.other.nonSpaceChar),y=y>4?1:y,p=E.slice(y),y+=g),v&&this.rules.other.blankLine.test(b)&&(m+=b+`
`,n=n.substring(b.length+1),a=!0),!a){let z=this.rules.other.nextBulletRegex(y),ue=this.rules.other.hrRegex(y),re=this.rules.other.fencesBeginRegex(y),Q=this.rules.other.headingBeginRegex(y),pe=this.rules.other.htmlBeginRegex(y),Re=this.rules.other.blockquoteBeginRegex(y);for(;n;){let ie=n.split(`
`,1)[0],se;if(b=ie,this.options.pedantic?(b=b.replace(this.rules.other.listReplaceNesting,"  "),se=b):se=b.replace(this.rules.other.leadingSpaceTab,B=>B.replace(this.rules.other.tabCharGlobal,"    ")),re.test(b)||Q.test(b)||pe.test(b)||Re.test(b)||z.test(b)||ue.test(b))break;if(se.search(this.rules.other.nonSpaceChar)>=y||!b.trim())p+=`
`+se.slice(y);else{if(v||E.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||re.test(E)||Q.test(E)||ue.test(E))break;p+=`
`+b}v=!b.trim(),m+=ie+`
`,n=n.substring(ie.length+1),E=se.slice(y)}}r.loose||(c?r.loose=!0:this.rules.other.doubleBlankLine.test(m)&&(c=!0)),r.items.push({type:"list_item",raw:m,task:!!this.options.gfm&&this.rules.other.listIsTask.test(p),loose:!1,text:p,tokens:[]}),r.raw+=m}let u=r.items.at(-1);if(u)u.raw=u.raw.trimEnd(),u.text=u.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let a of r.items)if(this.lexer.state.top=!1,a.tokens=this.lexer.blockTokens(a.text,[]),!r.loose){let m=a.tokens.filter(k=>k.type==="space"),p=m.length>0&&m.some(k=>this.rules.other.anyLine.test(k.raw));r.loose=p}for(let a of r.items){let m=a.tokens[0];if(a.task&&((m==null?void 0:m.type)==="text"||(m==null?void 0:m.type)==="paragraph")){a.text=a.text.replace(this.rules.other.listReplaceTask,""),m.raw=m.raw.replace(this.rules.other.listReplaceTask,""),m.text=m.text.replace(this.rules.other.listReplaceTask,"");for(let k=this.lexer.inlineQueue.length-1;k>=0;k--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[k].src)){this.lexer.inlineQueue[k].src=this.lexer.inlineQueue[k].src.replace(this.rules.other.listReplaceTask,"");break}let p=this.rules.other.listTaskCheckbox.exec(a.raw);if(p){let k={type:"checkbox",raw:p[0]+" ",checked:p[0]!=="[ ]"};a.checked=k.checked,r.loose?a.tokens[0]&&["paragraph","text"].includes(a.tokens[0].type)&&"tokens"in a.tokens[0]&&a.tokens[0].tokens?(a.tokens[0].raw=k.raw+a.tokens[0].raw,a.tokens[0].text=k.raw+a.tokens[0].text,a.tokens[0].tokens.unshift(k)):a.tokens.unshift({type:"paragraph",raw:k.raw,text:k.raw,tokens:[k]}):a.tokens.unshift(k)}}else a.task&&(a.task=!1)}if(r.loose)for(let a of r.items){a.loose=!0;for(let m of a.tokens)m.type==="text"&&(m.type="paragraph")}return r}}html(n){let e=this.rules.block.html.exec(n);if(e){let t=mn(e[0]);return{type:"html",block:!0,raw:t,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:t}}}def(n){let e=this.rules.block.def.exec(n);if(e){let t=et(e[1]).replace(this.rules.other.multipleSpaceGlobal," "),i=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:ae(e[0],`
`),href:i,title:r}}}table(n){var c;let e=this.rules.block.table.exec(n);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=gn(e[1]),i=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=(c=e[3])!=null&&c.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],o={type:"table",raw:ae(e[0],`
`),header:[],align:[],rows:[]};if(t.length===i.length){for(let u of i)this.rules.other.tableAlignRight.test(u)?o.align.push("right"):this.rules.other.tableAlignCenter.test(u)?o.align.push("center"):this.rules.other.tableAlignLeft.test(u)?o.align.push("left"):o.align.push(null);for(let u=0;u<t.length;u++)o.header.push({text:t[u],tokens:this.lexer.inline(t[u]),header:!0,align:o.align[u]});for(let u of r)o.rows.push(gn(u,o.header.length).map((a,m)=>({text:a,tokens:this.lexer.inline(a),header:!1,align:o.align[m]})));return o}}lheading(n){let e=this.rules.block.lheading.exec(n);if(e){let t=e[1].trim();return{type:"heading",raw:ae(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:t,tokens:this.lexer.inline(t)}}}paragraph(n){let e=this.rules.block.paragraph.exec(n);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){let e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){let e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(n){let e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(n){let e=this.rules.inline.link.exec(n);if(e){let t=e[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&kn(n,e[1],t,this.rules))return;let i=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(i)){if(!this.rules.other.endAngleBracket.test(i))return;let c=ae(i.slice(0,-1),"\\");if((i.length-c.length)%2===0)return}else{let c=gi(e[2],"()");if(c===-2)return;if(c>-1){let u=(e[0].indexOf("!")===0?5:4)+e[1].length+c;e[2]=e[2].substring(0,c),e[0]=e[0].substring(0,u).trim(),e[3]=""}}let r=e[2],o="";if(this.options.pedantic){let c=this.rules.other.pedanticHrefTitle.exec(r);c&&(r=c[1],o=c[3])}else o=e[3]?e[3].slice(1,-1):"";return r=r.trim(),this.rules.other.startAngleBracket.test(r)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(i)?r=r.slice(1):r=r.slice(1,-1)),xn(e,{href:r&&r.replace(this.rules.inline.anyPunctuation,"$1"),title:o&&o.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){let i=t[0].charAt(0)==="!"?2:1;if(!this.options.pedantic&&kn(n,t[1],i,this.rules))return;let r=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),o=e[et(r)];if(!o){let c=t[0].charAt(0);return{type:"text",raw:c,text:c}}return xn(t,o,t[0],this.lexer,this.rules)}}emStrong(n,e,t=""){let i=this.rules.inline.emStrongLDelim.exec(n);if(!(!i||!i[1]&&!i[2]&&!i[3]&&!i[4]||i[4]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(i[1]||i[3])||!t||this.rules.inline.punctuation.exec(t))){let r=[...i[0]].length-1,o,c,u=r,a=0,m=i[0][0],p=t===m,k=m==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(k.lastIndex=0,e=e.slice(-1*n.length+r);(i=k.exec(e))!==null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o)continue;if(c=[...o].length,i[3]||i[4]){u+=c;continue}else if(i[5]||i[6]){if(r%3&&!((r+c)%3)){a+=c;continue}if(p)break}if(u-=c,u>0)continue;c=Math.min(c,c+u+a);let g=[...i[0]][0].length,E=n.slice(0,r+i.index+g+c);if(Math.min(r,c)%2){let v=E.slice(1,-1);return{type:"em",raw:E,text:v,tokens:this.lexer.inlineTokens(v)}}let b=E.slice(2,-2);return{type:"strong",raw:E,text:b,tokens:this.lexer.inlineTokens(b)}}}}codespan(n){let e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),i=this.rules.other.nonSpaceChar.test(t),r=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return i&&r&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(n){let e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n,e,t=""){let i=this.rules.inline.delLDelim.exec(n);if(i&&(!i[1]||!t||this.rules.inline.punctuation.exec(t))){let r=[...i[0]].length-1,o,c,u=r,a=this.rules.inline.delRDelim;for(a.lastIndex=0,e=e.slice(-1*n.length+r);(i=a.exec(e))!==null;){if(o=i[1]||i[2]||i[3]||i[4]||i[5]||i[6],!o||(c=[...o].length,c!==r))continue;if(i[3]||i[4]){u+=c;continue}if(u-=c,u>0)continue;c=Math.min(c,c+u);let m=[...i[0]][0].length,p=n.slice(0,r+i.index+m+c),k=p.slice(r,-r);return{type:"del",raw:p,text:k,tokens:this.lexer.inlineTokens(k)}}}}autolink(n){let e=this.rules.inline.autolink.exec(n);if(e){let t,i;return e[2]==="@"?(t=e[1],i="mailto:"+t):(t=e[1],i=t),{type:"link",raw:e[0],text:t,href:i,autolink:!0,tokens:[{type:"text",raw:t,text:t}]}}}url(n){var t;let e;if(e=this.rules.inline.url.exec(n)){let i,r;if(e[2]==="@")i=e[0],r="mailto:"+i;else{let o;do o=e[0],e[0]=((t=this.rules.inline._backpedal.exec(e[0]))==null?void 0:t[0])??"";while(o!==e[0]);i=e[0],e[1]==="www."?r="http://"+e[0]:r=e[0]}return{type:"link",raw:e[0],text:i,href:r,autolink:!0,tokens:[{type:"text",raw:i,text:i}]}}}inlineText(n){let e=this.rules.inline.text.exec(n);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:t?e[0]:fi(e[0]),escaped:t}}}},V=class Kt{constructor(e){R(this,"tokens");R(this,"options");R(this,"state");R(this,"inlineQueue");R(this,"tokenizer");this.tokens=[],this.tokens.links=Object.create(null),this.options=e||me,this.options.tokenizer=this.options.tokenizer||new tt,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,linkEmitted:!1,top:!0};let t={other:$,block:Je.normal,inline:He.normal};this.options.pedantic?(t.block=Je.pedantic,t.inline=He.pedantic):this.options.gfm&&(t.block=Je.gfm,this.options.breaks?t.inline=He.breaks:t.inline=He.gfm),this.tokenizer.rules=t}static get rules(){return{block:Je,inline:He}}static lex(e,t){return new Kt(t).lex(e)}static lexInline(e,t){return new Kt(t).inlineTokens(e)}lex(e){e=e.replace($.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let i=this.inlineQueue[t];this.inlineTokens(i.src,i.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],i=!1){var o,c,u;this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace($.tabCharGlobal,"    ").replace($.spaceLine,""));let r=1/0;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let a;if((c=(o=this.options.extensions)==null?void 0:o.block)!=null&&c.some(p=>(a=p.call({lexer:this},e,t))?(e=e.substring(a.raw.length),t.push(a),!0):!1))continue;if(a=this.tokenizer.space(e)){e=e.substring(a.raw.length);let p=t.at(-1);a.raw.length===1&&p!==void 0?p.raw+=`
`:t.push(a);continue}if(a=this.tokenizer.code(e)){e=e.substring(a.raw.length);let p=t.at(-1);(p==null?void 0:p.type)==="paragraph"||(p==null?void 0:p.type)==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+a.raw,p.text+=`
`+a.text,this.inlineQueue.at(-1).src=p.text):t.push(a);continue}if(a=this.tokenizer.fences(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.heading(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.hr(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.blockquote(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.list(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.html(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.def(e)){e=e.substring(a.raw.length);let p=t.at(-1);(p==null?void 0:p.type)==="paragraph"||(p==null?void 0:p.type)==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+a.raw,p.text+=`
`+a.raw,this.inlineQueue.at(-1).src=p.text):this.tokens.links[a.tag]||(this.tokens.links[a.tag]={href:a.href,title:a.title},t.push(a));continue}if(a=this.tokenizer.table(e)){e=e.substring(a.raw.length),t.push(a);continue}if(a=this.tokenizer.lheading(e)){e=e.substring(a.raw.length),t.push(a);continue}let m=e;if((u=this.options.extensions)!=null&&u.startBlock){let p=1/0,k=e.slice(1),g;this.options.extensions.startBlock.forEach(E=>{g=E.call({lexer:this},k),typeof g=="number"&&g>=0&&(p=Math.min(p,g))}),p<1/0&&p>=0&&(m=e.substring(0,p+1))}if(this.state.top&&(a=this.tokenizer.paragraph(m))){let p=t.at(-1);i&&(p==null?void 0:p.type)==="paragraph"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+a.raw,p.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=p.text):t.push(a),i=m.length!==e.length,e=e.substring(a.raw.length);continue}if(a=this.tokenizer.text(e)){e=e.substring(a.raw.length);let p=t.at(-1);(p==null?void 0:p.type)==="text"?(p.raw+=(p.raw.endsWith(`
`)?"":`
`)+a.raw,p.text+=`
`+a.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=p.text):t.push(a);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}linkInText(e){if(!e.includes("["))return!1;let t=this.tokenizer.rules.inline.link;for(let i of e.matchAll(this.tokenizer.rules.inline.blockSkip))if(t.test(i[0])&&e.charAt(i.index-1)!=="!")return!0;for(let i of e.matchAll(this.tokenizer.rules.inline.reflinkSearch)){let r=i[0],o=r.lastIndexOf("[");if(!(r.charAt(0)==="!"||!Object.hasOwn(this.tokens.links,et(r.slice(o+1,-1))))&&!(o>1&&this.linkInText(r.slice(1,o-1))))return!0}return!1}inlineTokens(e,t=[]){var u,a,m,p,k;this.tokenizer.lexer=this;let i=e;if(this.tokens.links&&e.includes("[")){let g=this.tokenizer.rules.inline.reflinkSearch,E=b=>{let v=b.lastIndexOf("[");if(!Object.hasOwn(this.tokens.links,et(b.slice(v+1,-1))))return b;if(v>1&&b.charAt(0)!=="!"){let y=b.slice(1,v-1);if(this.linkInText(y))return"["+y.replace(g,E)+"]["+"a".repeat(b.length-v-2)+"]"}return"["+"a".repeat(b.length-2)+"]"};i=i.replace(g,E)}i=i.replace(this.tokenizer.rules.inline.anyPunctuation,g=>"+".repeat(g.length)),i=i.replace(this.tokenizer.rules.inline.blockSkip,(g,E,b)=>{let v=b?b.length:0;return g.slice(0,v)+"["+"a".repeat(g.length-v-2)+"]"}),i=((a=(u=this.options.hooks)==null?void 0:u.emStrongMask)==null?void 0:a.call({lexer:this},i))??i;let r=!1,o="",c=1/0;for(;e;){if(e.length<c)c=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}r||(o=""),r=!1;let g;if((p=(m=this.options.extensions)==null?void 0:m.inline)!=null&&p.some(b=>(g=b.call({lexer:this},e,t))?(e=e.substring(g.raw.length),t.push(g),!0):!1))continue;if(g=this.tokenizer.escape(e)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.tag(e)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.link(e)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(g.raw.length);let b=t.at(-1);g.type==="text"&&(b==null?void 0:b.type)==="text"?(b.raw+=g.raw,b.text+=g.text):t.push(g);continue}if(g=this.tokenizer.emStrong(e,i,o)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.codespan(e)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.br(e)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.del(e,i,o)){e=e.substring(g.raw.length),t.push(g);continue}if(g=this.tokenizer.autolink(e)){e=e.substring(g.raw.length),t.push(g);continue}if(!this.state.inLink&&(g=this.tokenizer.url(e))){e=e.substring(g.raw.length),t.push(g);continue}let E=e;if((k=this.options.extensions)!=null&&k.startInline){let b=1/0,v=e.slice(1),y;this.options.extensions.startInline.forEach(z=>{y=z.call({lexer:this},v),typeof y=="number"&&y>=0&&(b=Math.min(b,y))}),b<1/0&&b>=0&&(E=e.substring(0,b+1))}if(g=this.tokenizer.inlineText(E)){e=e.substring(g.raw.length),g.raw.slice(-1)!=="_"&&(o=g.raw.slice(-1)),r=!0;let b=t.at(-1);(b==null?void 0:b.type)==="text"?(b.raw+=g.raw,b.text+=g.text):t.push(g);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t="Infinite loop on byte: "+e;if(this.options.silent)console.error(t);else throw new Error(t)}},nt=class{constructor(n){R(this,"options");R(this,"parser");this.options=n||me}space(n){return""}code({text:n,lang:e,escaped:t}){var o;let i=(o=(e||"").match($.notSpaceStart))==null?void 0:o[0],r=n?n.replace($.endingNewline,"")+`
`:"";return i?'<pre><code class="language-'+G(i)+'">'+(t?r:G(r,!0))+`</code></pre>
`:"<pre><code>"+(t?r:G(r,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}def(n){return""}heading({tokens:n,depth:e}){return`<h${e}>${this.parser.parseInline(n)}</h${e}>
`}hr(n){return`<hr>
`}list(n){let e=n.ordered,t=n.start,i="";for(let c=0;c<n.items.length;c++){let u=n.items[c];i+=this.listitem(u)}let r=e?"ol":"ul",o=e&&t!==1?' start="'+t+'"':"";return"<"+r+o+`>
`+i+"</"+r+`>
`}listitem(n){return`<li>${this.parser.parse(n.tokens)}</li>
`}checkbox({checked:n}){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let e="",t="";for(let r=0;r<n.header.length;r++)t+=this.tablecell(n.header[r]);e+=this.tablerow({text:t});let i="";for(let r=0;r<n.rows.length;r++){let o=n.rows[r];t="";for(let c=0;c<o.length;c++)t+=this.tablecell(o[c]);i+=this.tablerow({text:t})}return i&&(i=`<tbody>${i}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+i+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){let e=this.parser.parseInline(n.tokens),t=n.header?"th":"td";return(n.align?`<${t} align="${n.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${G(n,!0)}</code>`}br(n){return"<br>"}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:e,text:t,tokens:i,autolink:r}){let o=r?G(t,!0):this.parser.parseInline(i),c=fn(n);if(c===null)return o;n=G(c,r);let u='<a href="'+n+'"';return e&&(u+=' title="'+G(e)+'"'),u+=">"+o+"</a>",u}image({href:n,title:e,text:t,tokens:i}){i&&(t=this.parser.parseInline(i,this.parser.textRenderer));let r=fn(n);if(r===null)return G(t);n=r;let o=`<img src="${G(n)}" alt="${G(t)}"`;return e&&(o+=` title="${G(e)}"`),o+=">",o}text(n){return"tokens"in n&&n.tokens?this.parser.parseInline(n.tokens):"escaped"in n&&n.escaped?n.text:G(n.text)}},St=class{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return""+n}image({text:n}){return""+n}br(){return""}checkbox({raw:n}){return n}},X=class Jt{constructor(e){R(this,"options");R(this,"renderer");R(this,"textRenderer");this.options=e||me,this.options.renderer=this.options.renderer||new nt,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new St}static parse(e,t){return new Jt(t).parse(e)}static parseInline(e,t){return new Jt(t).parseInline(e)}parse(e){var i,r;this.renderer.parser=this;let t="";for(let o=0;o<e.length;o++){let c=e[o];if((r=(i=this.options.extensions)==null?void 0:i.renderers)!=null&&r[c.type]){let a=c,m=this.options.extensions.renderers[a.type].call({parser:this},a);if(m!==!1||!["space","hr","heading","code","table","blockquote","list","checkbox","html","def","paragraph","text"].includes(a.type)){t+=m||"";continue}}let u=c;switch(u.type){case"space":{t+=this.renderer.space(u);break}case"hr":{t+=this.renderer.hr(u);break}case"heading":{t+=this.renderer.heading(u);break}case"code":{t+=this.renderer.code(u);break}case"table":{t+=this.renderer.table(u);break}case"blockquote":{t+=this.renderer.blockquote(u);break}case"list":{t+=this.renderer.list(u);break}case"checkbox":{t+=this.renderer.checkbox(u);break}case"html":{t+=this.renderer.html(u);break}case"def":{t+=this.renderer.def(u);break}case"paragraph":{t+=this.renderer.paragraph(u);break}case"text":{t+=this.renderer.text(u);break}default:{let a='Token with "'+u.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return t}parseInline(e,t=this.renderer){var r,o;this.renderer.parser=this;let i="";for(let c=0;c<e.length;c++){let u=e[c];if((o=(r=this.options.extensions)==null?void 0:r.renderers)!=null&&o[u.type]){let m=this.options.extensions.renderers[u.type].call({parser:this},u);if(m!==!1||!["escape","html","link","image","checkbox","strong","em","codespan","br","del","text"].includes(u.type)){i+=m||"";continue}}let a=u;switch(a.type){case"escape":{i+=t.text(a);break}case"html":{i+=t.html(a);break}case"link":{i+=t.link(a);break}case"image":{i+=t.image(a);break}case"checkbox":{i+=t.checkbox(a);break}case"strong":{i+=t.strong(a);break}case"em":{i+=t.em(a);break}case"codespan":{i+=t.codespan(a);break}case"br":{i+=t.br(a);break}case"del":{i+=t.del(a);break}case"text":{i+=t.text(a);break}default:{let m='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(m),"";throw new Error(m)}}}return i}},Ue=(it=class{constructor(n){R(this,"options");R(this,"block");this.options=n||me}preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}emStrongMask(n){return n}provideLexer(n=this.block){return n?V.lex:V.lexInline}provideParser(n=this.block){return n?X.parse:X.parseInline}},R(it,"passThroughHooks",new Set(["preprocess","postprocess","processAllTokens","emStrongMask"])),R(it,"passThroughHooksRespectAsync",new Set(["preprocess","postprocess","processAllTokens"])),it),bi=class{constructor(...n){R(this,"defaults",xt());R(this,"options",this.setOptions);R(this,"parse",this.parseMarkdown(!0));R(this,"parseInline",this.parseMarkdown(!1));R(this,"Parser",X);R(this,"Renderer",nt);R(this,"TextRenderer",St);R(this,"Lexer",V);R(this,"Tokenizer",tt);R(this,"Hooks",Ue);this.use(...n)}walkTokens(n,e){var i,r;let t=[];for(let o of n)switch(t=t.concat(e.call(this,o)),o.type){case"table":{let c=o;for(let u of c.header)t=t.concat(this.walkTokens(u.tokens,e));for(let u of c.rows)for(let a of u)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{let c=o;t=t.concat(this.walkTokens(c.items,e));break}default:{let c=o;(r=(i=this.defaults.extensions)==null?void 0:i.childTokens)!=null&&r[c.type]?this.defaults.extensions.childTokens[c.type].forEach(u=>{let a=c[u].flat(1/0);t=t.concat(this.walkTokens(a,e))}):c.tokens&&(t=t.concat(this.walkTokens(c.tokens,e)))}}return t}use(...n){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(t=>{let i={...t};if(i.async=this.defaults.async||i.async||!1,t.extensions&&(t.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let o=e.renderers[r.name];o?e.renderers[r.name]=function(...c){let u=r.renderer.apply(this,c);return u===!1&&(u=o.apply(this,c)),u}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let o=e[r.level];o?o.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),i.extensions=e),t.renderer){let r=this.defaults.renderer||new nt(this.defaults);for(let o in t.renderer){if(!(o in r))throw new Error(`renderer '${o}' does not exist`);if(["options","parser"].includes(o))continue;let c=o,u=t.renderer[c],a=r[c];r[c]=(...m)=>{let p=u.apply(r,m);return p===!1&&(p=a.apply(r,m)),p||""}}i.renderer=r}if(t.tokenizer){let r=this.defaults.tokenizer||new tt(this.defaults);for(let o in t.tokenizer){if(!(o in r))throw new Error(`tokenizer '${o}' does not exist`);if(["options","rules","lexer"].includes(o))continue;let c=o,u=t.tokenizer[c],a=r[c];r[c]=(...m)=>{let p=u.apply(r,m);return p===!1&&(p=a.apply(r,m)),p}}i.tokenizer=r}if(t.hooks){let r=this.defaults.hooks||new Ue;for(let o in t.hooks){if(!(o in r))throw new Error(`hook '${o}' does not exist`);if(["options","block"].includes(o))continue;let c=o,u=t.hooks[c],a=r[c];Ue.passThroughHooks.has(o)?r[c]=m=>{if(this.defaults.async&&Ue.passThroughHooksRespectAsync.has(o))return(async()=>{let k=await u.call(r,m);return a.call(r,k)})();let p=u.call(r,m);return a.call(r,p)}:r[c]=(...m)=>{if(this.defaults.async)return(async()=>{let k=await u.apply(r,m);return k===!1&&(k=await a.apply(r,m)),k})();let p=u.apply(r,m);return p===!1&&(p=a.apply(r,m)),p}}i.hooks=r}if(t.walkTokens){let r=this.defaults.walkTokens,o=t.walkTokens;i.walkTokens=function(c){let u=[];return u.push(o.call(this,c)),r&&(u=u.concat(r.call(this,c))),u}}this.defaults={...this.defaults,...i}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,e){return V.lex(n,e??this.defaults)}parser(n,e){return X.parse(n,e??this.defaults)}parseMarkdown(n){return(e,t)=>{let i={...t},r={...this.defaults,...i},o=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&i.async===!1)return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return o(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return o(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=n),r.async)return(async()=>{let c=r.hooks?await r.hooks.preprocess(e):e,u=await(r.hooks?await r.hooks.provideLexer(n):n?V.lex:V.lexInline)(c,r),a=r.hooks?await r.hooks.processAllTokens(u):u;r.walkTokens&&await Promise.all(this.walkTokens(a,r.walkTokens));let m=await(r.hooks?await r.hooks.provideParser(n):n?X.parse:X.parseInline)(a,r);return r.hooks?await r.hooks.postprocess(m):m})().catch(o);try{r.hooks&&(e=r.hooks.preprocess(e));let c=(r.hooks?r.hooks.provideLexer(n):n?V.lex:V.lexInline)(e,r);r.hooks&&(c=r.hooks.processAllTokens(c)),r.walkTokens&&this.walkTokens(c,r.walkTokens);let u=(r.hooks?r.hooks.provideParser(n):n?X.parse:X.parseInline)(c,r);return r.hooks&&(u=r.hooks.postprocess(u)),u}catch(c){return o(c)}}}onError(n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,n){let i="<p>An error occurred:</p><pre>"+G(t.message+"",!0)+"</pre>";return e?Promise.resolve(i):i}if(e)return Promise.reject(t);throw t}}},xe=new bi;function A(n,e){return xe.parse(n,e)}A.options=A.setOptions=function(n){return xe.setOptions(n),A.defaults=xe.defaults,en(A.defaults),A},A.getDefaults=xt,A.defaults=me;function xi(...n){return xe.use(...n),A.defaults=xe.defaults,en(A.defaults),A}A.use=xi,A.walkTokens=function(n,e){return xe.walkTokens(n,e)},A.parseInline=xe.parseInline,A.Parser=X,A.parser=X.parse,A.Renderer=nt,A.TextRenderer=St,A.Lexer=V,A.lexer=V.lex,A.Tokenizer=tt,A.Hooks=Ue,A.parse=A,A.options,A.setOptions,A.walkTokens,A.parseInline,X.parse,V.lex;/*! @license DOMPurify 3.4.16 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.16/LICENSE */function wn(n,e){(e==null||e>n.length)&&(e=n.length);for(var t=0,i=Array(e);t<e;t++)i[t]=n[t];return i}function ki(n){if(Array.isArray(n))return n}function wi(n,e){var t=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(t!=null){var i,r,o,c,u=[],a=!0,m=!1;try{if(o=(t=t.call(n)).next,e!==0)for(;!(a=(i=o.call(t)).done)&&(u.push(i.value),u.length!==e);a=!0);}catch(p){m=!0,r=p}finally{try{if(!a&&t.return!=null&&(c=t.return(),Object(c)!==c))return}finally{if(m)throw r}}return u}}function yi(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */function Ti(n,e){return ki(n)||wi(n,e)||Ei(n,e)||yi()}function Ei(n,e){if(n){if(typeof n=="string")return wn(n,e);var t={}.toString.call(n).slice(8,-1);return t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set"?Array.from(n):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?wn(n,e):void 0}}const yn=Object.entries,Tn=Object.setPrototypeOf,_i=Object.isFrozen,Ai=Object.getPrototypeOf,Si=Object.getOwnPropertyDescriptor;let M=Object.freeze,F=Object.seal,Se=Object.create,En=typeof Reflect<"u"&&Reflect,vt=En.apply,Rt=En.construct;M||(M=function(e){return e}),F||(F=function(e){return e}),vt||(vt=function(e,t){for(var i=arguments.length,r=new Array(i>2?i-2:0),o=2;o<i;o++)r[o-2]=arguments[o];return e.apply(t,r)}),Rt||(Rt=function(e){for(var t=arguments.length,i=new Array(t>1?t-1:0),r=1;r<t;r++)i[r-1]=arguments[r];return new e(...i)});const ke=P(Array.prototype.forEach),vi=P(Array.prototype.lastIndexOf),_n=P(Array.prototype.pop),Ge=P(Array.prototype.push),Ri=P(Array.prototype.splice),ve=Array.isArray,We=P(String.prototype.toLowerCase),It=P(String.prototype.toString),An=P(String.prototype.match),je=P(String.prototype.replace),Sn=P(String.prototype.indexOf),Ii=P(String.prototype.trim),Li=P(Number.prototype.toString),Ci=P(Boolean.prototype.toString),vn=typeof BigInt>"u"?null:P(BigInt.prototype.toString),Rn=typeof Symbol>"u"?null:P(Symbol.prototype.toString),U=P(Object.prototype.hasOwnProperty),qe=P(Object.prototype.toString),N=P(RegExp.prototype.test),le=Oi(TypeError);function P(n){return function(e){e instanceof RegExp&&(e.lastIndex=0);for(var t=arguments.length,i=new Array(t>1?t-1:0),r=1;r<t;r++)i[r-1]=arguments[r];return vt(n,e,i)}}function Oi(n){return function(){for(var e=arguments.length,t=new Array(e),i=0;i<e;i++)t[i]=arguments[i];return Rt(n,t)}}function S(n,e){let t=arguments.length>2&&arguments[2]!==void 0?arguments[2]:We;if(Tn&&Tn(n,null),!ve(e))return n;let i=e.length;for(;i--;){let r=e[i];if(typeof r=="string"){const o=t(r);o!==r&&(_i(e)||(e[i]=o),r=o)}n[r]=!0}return n}function Di(n){for(let e=0;e<n.length;e++)U(n,e)||(n[e]=null);return n}function W(n){const e=Se(null);for(const i of yn(n)){var t=Ti(i,2);const r=t[0],o=t[1];U(n,r)&&(ve(o)?e[r]=Di(o):o&&typeof o=="object"&&o.constructor===Object?e[r]=W(o):e[r]=o)}return e}function Pi(n){switch(typeof n){case"string":return n;case"number":return Li(n);case"boolean":return Ci(n);case"bigint":return vn?vn(n):"0";case"symbol":return Rn?Rn(n):"Symbol()";case"undefined":return qe(n);case"function":case"object":{if(n===null)return qe(n);const e=n,t=Y(e,"toString");if(typeof t=="function"){const i=t(e);return typeof i=="string"?i:qe(i)}return qe(n)}default:return qe(n)}}function Y(n,e){for(;n!==null;){const i=Si(n,e);if(i){if(i.get)return P(i.get);if(typeof i.value=="function")return P(i.value)}n=Ai(n)}function t(){return null}return t}function Mi(n){try{return N(n,""),!0}catch{return!1}}const In=M(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","search","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),Lt=M(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","enterkeyhint","exportparts","filter","font","g","glyph","glyphref","hkern","image","inputmode","line","lineargradient","marker","mask","metadata","mpath","part","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),Ct=M(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),zi=M(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),Ot=M(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),Fi=M(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),Ln=M(["#text"]),Cn=M(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","command","commandfor","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","exportparts","face","for","headers","height","hidden","high","href","hreflang","id","inert","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","part","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","slot","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns"]),Dt=M(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dominant-baseline","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","mask-type","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","pointer-events","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-orientation","text-rendering","textlength","type","u1","u2","unicode","values","vector-effect","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),On=M(["accent","accentunder","align","bevelled","close","columnalign","columnlines","columnspacing","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lquote","lspace","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),rt=M(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),$i=F(/{{[\w\W]*|^[\w\W]*}}/g),Ni=F(/<%[\w\W]*|^[\w\W]*%>/g),Bi=F(/\${[\w\W]*/g),Hi=F(/^data-[\-\w.\u00B7-\uFFFF]+$/),Ui=F(/^aria-[\-\w]+$/),Dn=F(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),Gi=F(/^(?:\w+script|data):/i),Wi=F(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),ji=F(/^html$/i),qi=F(/^[a-z][.\w]*(-[.\w]+)+$/i),Pn=F(/<[/\w!]/g),Mn=F(/<[/\w]/g),Yi=F(/<\/no(script|embed|frames)/i),Zi=F(/\/>/i),j={element:1,attribute:2,text:3,cdataSection:4,entityReference:5,entityNode:6,processingInstruction:7,comment:8,document:9,documentType:10,documentFragment:11,notation:12},zn=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"],Vi=M(S({},zn)),Xi=(function(){const n={};return ke(zn,e=>{n[e]=F(new RegExp("</"+e+"(?=[\\t\\n\\f\\r />])","i"))}),M(n)})(),Qi=function(){return typeof window>"u"?null:window},Ki=function(e,t){if(typeof e!="object"||typeof e.createPolicy!="function")return null;let i=null;const r="data-tt-policy-suffix";t&&t.hasAttribute(r)&&(i=t.getAttribute(r));const o="dompurify"+(i?"#"+i:"");try{return e.createPolicy(o,{createHTML(c){return c},createScriptURL(c){return c}})}catch{return console.warn("TrustedTypes policy "+o+" could not be created."),null}},Fn=function(){return{afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},ce=function(e,t,i,r){return U(e,t)&&ve(e[t])?S(r.base?W(r.base):{},e[t],r.transform):i},Pt=function(e,t,i){const r=U(e,t)?e[t]:void 0;return r&&typeof r=="object"?W(r):i()};function $n(){let n=arguments.length>0&&arguments[0]!==void 0?arguments[0]:Qi();const e=d=>$n(d);if(e.version="3.4.16",e.removed=[],!n||!n.document||n.document.nodeType!==j.document||!n.Element)return e.isSupported=!1,e;let t=n.document;const i=t,r=i.currentScript;n.DocumentFragment;const o=n.HTMLTemplateElement,c=n.Node,u=n.Element,a=n.NodeFilter;n.NamedNodeMap===void 0&&(n.NamedNodeMap||n.MozNamedAttrMap),n.HTMLFormElement;const m=n.DOMParser,p=n.trustedTypes,k=u.prototype,g=Y(k,"cloneNode"),E=Y(k,"remove"),b=Y(k,"removeAttributeNode"),v=Y(k,"nextSibling"),y=Y(k,"childNodes"),z=Y(k,"parentNode"),ue=Y(k,"shadowRoot"),re=Y(k,"attributes"),Q=c&&c.prototype?Y(c.prototype,"nodeType"):null,pe=c&&c.prototype?Y(c.prototype,"nodeName"):null,Re=c&&c.prototype?Y(c.prototype,"ownerDocument"):null,ie=function(s){return Q?Q(s):s.nodeType},se=function(s){return pe?pe(s):s.nodeName};if(typeof o=="function"){const d=t.createElement("template");d.content&&d.content.ownerDocument&&(t=d.content.ownerDocument)}let B,we="",Mt,Nn=!1,Ze=0;const Bn=function(){if(Ze>0)throw le('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')},Ie=function(s){Bn(),Ze++;try{return B.createHTML(s)}finally{Ze--}},es=function(s){Bn(),Ze++;try{return B.createScriptURL(s)}finally{Ze--}},ts=function(){return Nn||(Mt=Ki(p,r),Nn=!0),Mt},st=t,zt=st.implementation,Hn=st.createNodeIterator,ns=st.createDocumentFragment,rs=st.getElementsByTagName,is=i.importNode;let I=Fn();e.isSupported=typeof yn=="function"&&typeof z=="function"&&zt&&zt.createHTMLDocument!==void 0;const ss=$i,os=Ni,as=Bi,ls=Hi,cs=Ui,us=Gi,Un=Wi,ps=qi;let Gn=Dn,L=null;const Ft=S({},[...In,...Lt,...Ct,...Ot,...Ln]);let C=null;const $t=S({},[...Cn,...Dt,...On,...rt]);let K=Object.seal(Se(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ve=null,Wn=null;const he=Object.seal(Se(null,{tagCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeCheck:{writable:!0,configurable:!1,enumerable:!0,value:null}}));let jn=!0,Nt=!0,qn=!1,Yn=!0,de=!1,ye=!0,Te=!1,Bt=!1,ot=null,at=null,Ht=!1,Le=!1,lt=!1,ct=!1,Zn=!0,Vn=!1;const Xn="user-content-";let Ut=!0,Gt=!1,Ce={},Oe=null;const Qn=S({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","selectedcontent","style","svg","template","thead","title","video","xmp"]);let Kn=null;const Jn=S({},["audio","video","img","source","image","track"]);let er=null;const tr=S({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),ut="http://www.w3.org/1998/Math/MathML",pt="http://www.w3.org/2000/svg",J="http://www.w3.org/1999/xhtml";let De=J,Wt=!1,jt=null;const hs=S({},[ut,pt,J],It),nr=M(["mi","mo","mn","ms","mtext"]);let qt=S({},nr);const rr=M(["annotation-xml"]);let Yt=S({},rr);const ds=S({},["title","style","font","a","script"]);let Xe=null;const fs=["application/xhtml+xml","text/html"],gs="text/html";let D=null,Pe=null;const ms=t.createElement("form"),ir=function(s){return s instanceof RegExp||s instanceof Function},Zt=function(){let s=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};if(Pe&&Pe===s)return;(!s||typeof s!="object")&&(s={}),s=W(s),Xe=fs.indexOf(s.PARSER_MEDIA_TYPE)===-1?gs:s.PARSER_MEDIA_TYPE,D=Xe==="application/xhtml+xml"?It:We,L=ce(s,"ALLOWED_TAGS",Ft,{transform:D}),C=ce(s,"ALLOWED_ATTR",$t,{transform:D}),jt=ce(s,"ALLOWED_NAMESPACES",hs,{transform:It}),er=ce(s,"ADD_URI_SAFE_ATTR",tr,{transform:D,base:tr}),Kn=ce(s,"ADD_DATA_URI_TAGS",Jn,{transform:D,base:Jn}),Oe=ce(s,"FORBID_CONTENTS",Qn,{transform:D}),Ve=ce(s,"FORBID_TAGS",W({}),{transform:D}),Wn=ce(s,"FORBID_ATTR",W({}),{transform:D}),Ce=U(s,"USE_PROFILES")?s.USE_PROFILES&&typeof s.USE_PROFILES=="object"?W(s.USE_PROFILES):s.USE_PROFILES:!1,jn=s.ALLOW_ARIA_ATTR!==!1,Nt=s.ALLOW_DATA_ATTR!==!1,qn=s.ALLOW_UNKNOWN_PROTOCOLS||!1,Yn=s.ALLOW_SELF_CLOSE_IN_ATTR!==!1,de=s.SAFE_FOR_TEMPLATES||!1,ye=s.SAFE_FOR_XML!==!1,Te=s.WHOLE_DOCUMENT||!1,Le=s.RETURN_DOM||!1,lt=s.RETURN_DOM_FRAGMENT||!1,ct=s.RETURN_TRUSTED_TYPE||!1,Ht=s.FORCE_BODY||!1,Zn=s.SANITIZE_DOM!==!1,Vn=s.SANITIZE_NAMED_PROPS||!1,Ut=s.KEEP_CONTENT!==!1,Gt=s.IN_PLACE||!1,Gn=Mi(s.ALLOWED_URI_REGEXP)?s.ALLOWED_URI_REGEXP:Dn,De=typeof s.NAMESPACE=="string"?s.NAMESPACE:J,qt=Pt(s,"MATHML_TEXT_INTEGRATION_POINTS",()=>S({},nr)),Yt=Pt(s,"HTML_INTEGRATION_POINTS",()=>S({},rr));const l=Pt(s,"CUSTOM_ELEMENT_HANDLING",()=>Se(null));if(K=Se(null),U(l,"tagNameCheck")&&ir(l.tagNameCheck)&&(K.tagNameCheck=l.tagNameCheck),U(l,"attributeNameCheck")&&ir(l.attributeNameCheck)&&(K.attributeNameCheck=l.attributeNameCheck),U(l,"allowCustomizedBuiltInElements")&&typeof l.allowCustomizedBuiltInElements=="boolean"&&(K.allowCustomizedBuiltInElements=l.allowCustomizedBuiltInElements),F(K),de&&(Nt=!1),lt&&(Le=!0),Ce&&(L=S({},Ln),C=Se(null),Ce.html===!0&&(S(L,In),S(C,Cn)),Ce.svg===!0&&(S(L,Lt),S(C,Dt),S(C,rt)),Ce.svgFilters===!0&&(S(L,Ct),S(C,Dt),S(C,rt)),Ce.mathMl===!0&&(S(L,Ot),S(C,On),S(C,rt))),he.tagCheck=null,he.attributeCheck=null,U(s,"ADD_TAGS")&&(typeof s.ADD_TAGS=="function"?he.tagCheck=s.ADD_TAGS:ve(s.ADD_TAGS)&&(L===Ft&&(L=W(L)),S(L,s.ADD_TAGS,D))),U(s,"ADD_ATTR")&&(typeof s.ADD_ATTR=="function"?he.attributeCheck=s.ADD_ATTR:ve(s.ADD_ATTR)&&(C===$t&&(C=W(C)),S(C,s.ADD_ATTR,D))),U(s,"ADD_FORBID_CONTENTS")&&ve(s.ADD_FORBID_CONTENTS)&&(Oe===Qn&&(Oe=W(Oe)),S(Oe,s.ADD_FORBID_CONTENTS,D)),Ut&&(L["#text"]=!0),Te&&S(L,["html","head","body"]),L.table&&(S(L,["tbody"]),delete Ve.tbody),s.TRUSTED_TYPES_POLICY){if(typeof s.TRUSTED_TYPES_POLICY.createHTML!="function")throw le('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if(typeof s.TRUSTED_TYPES_POLICY.createScriptURL!="function")throw le('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');const h=B;B=s.TRUSTED_TYPES_POLICY;try{we=Ie("")}catch(f){throw B=h,f}}else s.TRUSTED_TYPES_POLICY===null?(B=void 0,we=""):(B===void 0&&(B=ts()),B&&typeof we=="string"&&(we=Ie("")));M&&M(s),Pe=s},sr=S({},[...Lt,...Ct,...zi]),or=S({},[...Ot,...Fi]),bs=function(s,l,h){return l.namespaceURI===J?s==="svg":l.namespaceURI===ut?s==="svg"&&(h==="annotation-xml"||qt[h]):!!sr[s]},xs=function(s,l,h){return l.namespaceURI===J?s==="math":l.namespaceURI===pt?s==="math"&&Yt[h]:!!or[s]},ks=function(s,l,h){return l.namespaceURI===pt&&!Yt[h]||l.namespaceURI===ut&&!qt[h]?!1:!or[s]&&(ds[s]||!sr[s])},ws=function(s){let l=z(s);(!l||!l.tagName)&&(l={namespaceURI:De,tagName:"template"});const h=We(s.tagName),f=We(l.tagName);return jt[s.namespaceURI]?s.namespaceURI===pt?bs(h,l,f):s.namespaceURI===ut?xs(h,l,f):s.namespaceURI===J?ks(h,l,f):!!(Xe==="application/xhtml+xml"&&jt[s.namespaceURI]):!1},fe=function(s){Ge(e.removed,{element:s});try{z(s).removeChild(s)}catch{if(E(s),!z(s))throw le("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")}},ar=function(s,l,h){try{b(s,l)}catch{try{s.removeAttribute(h)}catch{}}},ht=function(s){dt(s);const l=y(s);if(l){const f=[];ke(l,x=>{Ge(f,x)}),ke(f,x=>{try{E(x)}catch{}})}const h=re(s);if(h)for(let f=h.length-1;f>=0;--f){const x=h[f],T=x&&x.name;typeof T=="string"&&ar(s,x,T)}},Ee=function(s,l,h){if(!h)try{h=l.getAttributeNode(s)}catch{h=null}Ge(e.removed,{attribute:h||null,from:l});try{h?b(l,h):l.removeAttribute(s)}catch{try{l.removeAttribute(s)}catch{}}if(s==="is")if(Le||lt)try{fe(l)}catch{}else try{l.setAttribute(s,"")}catch{}},ys=function(s){const l=re(s);if(l)for(let h=l.length-1;h>=0;--h){const f=l[h],x=f&&f.name;typeof x!="string"||C[D(x)]||ar(s,f,x)}},dt=function(s){const l=[s];for(;l.length>0;){const h=l.pop();ie(h)===j.element&&ys(h);const f=y(h);if(f)for(let x=f.length-1;x>=0;--x)l.push(f[x])}},lr=function(s,l){return ye?s==="patchsrc"?!0:s==="for"&&l!=="label"&&l!=="output":!1},Ts=function(s){if(!ye)return;const l=[s];for(;l.length>0;){const h=l.pop(),f=ie(h);if(f===j.processingInstruction||f===j.comment&&N(Mn,h.data)){try{E(h)}catch{}continue}if(f===j.element){const T=h,_=D(se(h));try{T.hasAttribute&&T.hasAttribute("patchsrc")&&T.removeAttribute("patchsrc"),T.hasAttribute&&T.hasAttribute("for")&&lr("for",_)&&T.removeAttribute("for")}catch{}}const x=y(h);if(x)for(let T=x.length-1;T>=0;--T)l.push(x[T])}},cr=function(s){let l=null,h=null;if(Ht)s="<remove></remove>"+s;else{const T=An(s,/^[\r\n\t ]+/);h=T&&T[0]}Xe==="application/xhtml+xml"&&De===J&&(s='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+s+"</body></html>");const f=B?Ie(s):s;if(De===J)try{l=new m().parseFromString(f,Xe)}catch{}if(!l||!l.documentElement){l=zt.createDocument(De,"template",null);try{l.documentElement.innerHTML=Wt?we:f}catch{}}const x=l.body||l.documentElement;return s&&h&&x.insertBefore(t.createTextNode(h),x.childNodes[0]||null),De===J?rs.call(l,Te?"html":"body")[0]:Te?l.documentElement:x},ur=function(s){const l=Re?Re(s):s.ownerDocument;return Hn.call(l||s,s,a.SHOW_ELEMENT|a.SHOW_COMMENT|a.SHOW_TEXT|a.SHOW_PROCESSING_INSTRUCTION|a.SHOW_CDATA_SECTION,null)},ft=function(s){return s=je(s,ss," "),s=je(s,os," "),s=je(s,as," "),s},Vt=function(s){var l;s.normalize();const h=Re?Re(s):s.ownerDocument,f=Hn.call(h||s,s,a.SHOW_TEXT|a.SHOW_COMMENT|a.SHOW_CDATA_SECTION|a.SHOW_PROCESSING_INSTRUCTION,null);let x=f.nextNode();for(;x;)x.data=ft(x.data),x=f.nextNode();const T=(l=s.querySelectorAll)===null||l===void 0?void 0:l.call(s,"template");T&&ke(T,_=>{Me(_.content)&&Vt(_.content)})},gt=function(s){const l=pe?pe(s):null;return typeof l!="string"||D(l)!=="form"?!1:typeof s.nodeName!="string"||typeof s.textContent!="string"||typeof s.removeChild!="function"||s.attributes!==re(s)||typeof s.removeAttribute!="function"||typeof s.removeAttributeNode!="function"||typeof s.getAttributeNode!="function"||typeof s.setAttribute!="function"||typeof s.namespaceURI!="string"||typeof s.insertBefore!="function"||typeof s.hasChildNodes!="function"||s.nodeType!==Q(s)||s.childNodes!==y(s)},Me=function(s){if(!Q||typeof s!="object"||s===null)return!1;try{return Q(s)===j.documentFragment}catch{return!1}},Qe=function(s){if(!Q||typeof s!="object"||s===null)return!1;try{return typeof Q(s)=="number"}catch{return!1}};function ee(d,s,l){d.length!==0&&ke(d,h=>{h.call(e,s,l,Pe)})}const Es=function(s,l){return!!(ye&&s.hasChildNodes()&&!Qe(s.firstElementChild)&&N(Pn,s.textContent)&&N(Pn,s.innerHTML)||ye&&s.namespaceURI===J&&Vi[l]&&(Qe(s.firstElementChild)||typeof s.textContent=="string"&&N(Xi[l],s.textContent))||s.nodeType===j.processingInstruction||ye&&s.nodeType===j.comment&&N(Mn,s.data))},mt=function(s,l){if(s instanceof RegExp)return N(s,l);if(s instanceof Function){for(var h=arguments.length,f=new Array(h>2?h-2:0),x=2;x<h;x++)f[x-2]=arguments[x];return!!s(l,...f)}return!1},_s=function(s,l,h){if(!Ve[l]&&fr(l)&&mt(K.tagNameCheck,l))return!1;if(Ut&&!Oe[l]){const f=z(s),x=y(s);if(x&&f){const T=x.length;for(let _=T-1;_>=0;--_){const O=s===h?g(x[_],!0):x[_];f.insertBefore(O,v(s))}}}return fe(s),!0},pr=function(s,l,h,f){return s.length===0?l:l===h||l===f?W(l):l},ze=function(s,l){return s===l||z(s)!==null?!1:(Gt&&dt(s),!0)},hr=function(s,l){if(ee(I.beforeSanitizeElements,s,null),ze(s,l))return!0;if(gt(s))return fe(s),!0;const h=D(se(s));if(L=pr(I.uponSanitizeElement,L,Ft,ot),ee(I.uponSanitizeElement,s,{tagName:h,allowedTags:L}),ze(s,l))return!0;if(Es(s,h))return fe(s),!0;if(Ve[h]||!(he.tagCheck instanceof Function&&he.tagCheck(h))&&!L[h]){const f=_s(s,h,l);return f===!1&&(ee(I.afterSanitizeElements,s,null),ze(s,l))?!0:f}if(ie(s)===j.element&&!ws(s)||(h==="noscript"||h==="noembed"||h==="noframes")&&N(Yi,s.innerHTML))return fe(s),!0;if(de&&s.nodeType===j.text){const f=ft(s.textContent);s.textContent!==f&&(Ge(e.removed,{element:s.cloneNode()}),s.textContent=f)}return ee(I.afterSanitizeElements,s,null),ze(s,l)},dr=function(s,l,h){if(Wn[l]||lr(l,s)||Zn&&(l==="id"||l==="name")&&(h in t||h in ms))return!1;const f=C[l]||he.attributeCheck instanceof Function&&he.attributeCheck(l,s);return Nt&&N(ls,l)||jn&&N(cs,l)?!0:f?er[l]||N(Gn,je(h,Un,""))||(l==="src"||l==="xlink:href"||l==="href")&&s!=="script"&&Sn(h,"data:")===0&&Kn[s]||qn&&!N(us,je(h,Un,""))?!0:!h:fr(s)&&mt(K.tagNameCheck,s)&&mt(K.attributeNameCheck,l,s)||l==="is"&&K.allowCustomizedBuiltInElements&&mt(K.tagNameCheck,h)},As=S({},["annotation-xml","color-profile","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","missing-glyph"]),fr=function(s){return!As[We(s)]&&N(ps,s)},Ss=function(s,l,h,f){if(B&&typeof p=="object"&&typeof p.getAttributeType=="function"&&!h)switch(p.getAttributeType(s,l)){case"TrustedHTML":return Ie(f);case"TrustedScriptURL":return es(f)}return f},vs=function(s,l,h,f){try{return h?s.setAttributeNS(h,l,f):s.setAttribute(l,f),gt(s)?(fe(s),!1):!0}catch{return Ee(l,s),!1}},gr=function(s,l){if(ee(I.beforeSanitizeAttributes,s,null),ze(s,l))return;const h=s.attributes;if(!h||gt(s))return;C=pr(I.uponSanitizeAttribute,C,$t,at);const f={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:C,forceKeepAttr:void 0};let x=h.length;const T=D(s.nodeName);for(;x--;){const _=h[x],O=_.name,Z=_.namespaceURI,q=_.value,Fe=D(O),Qt=q;let H=O==="value"?Qt:Ii(Qt),mr=!1;if(f.attrName=Fe,f.attrValue=H,f.keepAttr=!0,f.forceKeepAttr=void 0,ee(I.uponSanitizeAttribute,s,f),H=f.attrValue,Vn&&(Fe==="id"||Fe==="name")&&Sn(H,Xn)!==0&&(Ee(O,s,_),H=Xn+H,mr=!0),ye&&N(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i,H)){Ee(O,s,_);continue}if(Fe==="attributename"&&An(H,"href")){Ee(O,s,_);continue}if(!f.forceKeepAttr){if(!f.keepAttr){Ee(O,s,_);continue}if(!Yn&&N(Zi,H)){Ee(O,s,_);continue}if(de&&(H=ft(H)),!dr(T,Fe,H)){Ee(O,s,_);continue}H=Ss(T,Fe,Z,H),H!==Qt&&vs(s,O,Z,H)&&mr&&_n(e.removed)}}ee(I.afterSanitizeAttributes,s,null),ze(s,l)},bt=function(s){let l=null;const h=ur(s);for(ee(I.beforeSanitizeShadowDOM,s,null);l=h.nextNode();)if(ee(I.uponSanitizeShadowNode,l,null),hr(l,s),gr(l,s),Me(l.content)&&bt(l.content),ie(l)===j.element){const f=ue(l);Me(f)&&(Xt(f),bt(f))}ee(I.afterSanitizeShadowDOM,s,null)},Xt=function(s){const l=[{node:s,shadow:null}];for(;l.length>0;){const h=l.pop();if(h.shadow){bt(h.shadow);continue}const f=h.node,x=ie(f)===j.element,T=y(f);if(T)for(let _=T.length-1;_>=0;--_)l.push({node:T[_],shadow:null});if(x){const _=pe?pe(f):null;if(typeof _=="string"&&D(_)==="template"){const O=f.content;Me(O)&&l.push({node:O,shadow:null})}}if(x){const _=ue(f);Me(_)&&l.push({node:null,shadow:_},{node:_,shadow:null})}}};return e.sanitize=function(d){let s=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},l=null,h=null,f=null,x=null;if(Wt=!d,Wt&&(d="<!-->"),typeof d!="string"&&!Qe(d)&&(d=Pi(d),typeof d!="string"))throw le("dirty is not a string, aborting");if(!e.isSupported)return d;Bt?(L=ot,C=at):Zt(s),(I.uponSanitizeElement.length>0||I.uponSanitizeAttribute.length>0)&&(L=W(L)),I.uponSanitizeAttribute.length>0&&(C=W(C)),e.removed=[];const T=Gt&&typeof d!="string"&&Qe(d);if(T){Ts(d);const Z=se(d);if(typeof Z=="string"){const q=D(Z);if(!L[q]||Ve[q])throw ht(d),le("root node is forbidden and cannot be sanitized in-place")}if(gt(d))throw ht(d),le("root node is clobbered and cannot be sanitized in-place");try{Xt(d)}catch(q){throw ht(d),q}}else if(Qe(d))l=cr("<!---->"),h=l.ownerDocument.importNode(d,!0),h.nodeType===j.element&&h.nodeName==="BODY"||h.nodeName==="HTML"?l=h:l.appendChild(h),Xt(l);else{if(!Le&&!de&&!Te&&d.indexOf("<")===-1)return B&&ct?Ie(d):d;if(l=cr(d),!l)return Le?null:ct?we:""}l&&Ht&&fe(l.firstChild);const _=T?d:l;try{const Z=ur(_);for(;f=Z.nextNode();)hr(f,_),gr(f,_),Me(f.content)&&bt(f.content)}catch(Z){throw T&&(ht(d),ke(e.removed,q=>{q.element&&dt(q.element)})),Z}if(T){let Z=!1;if(ke(e.removed,q=>{q.element&&(q.element===d&&(Z=!0),dt(q.element))}),Z)throw le("a node selected for removal could not be safely returned; refusing to sanitize in place");return de&&Vt(d),d}if(Le){if(de&&Vt(l),lt)for(x=ns.call(l.ownerDocument);l.firstChild;)x.appendChild(l.firstChild);else x=l;return(C.shadowroot||C.shadowrootmode)&&(x=is.call(i,x,!0)),x}let O=Te?l.outerHTML:l.innerHTML;return Te&&L["!doctype"]&&l.ownerDocument&&l.ownerDocument.doctype&&l.ownerDocument.doctype.name&&N(ji,l.ownerDocument.doctype.name)&&(O="<!DOCTYPE "+l.ownerDocument.doctype.name+`>
`+O),de&&(O=ft(O)),B&&ct?Ie(O):O},e.setConfig=function(){let d=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Zt(d),Bt=!0,ot=L,at=C},e.clearConfig=function(){Pe=null,Bt=!1,ot=null,at=null,B=Mt,we=""},e.isValidAttribute=function(d,s,l){Pe||Zt({});const h=D(d),f=D(s);return dr(h,f,l)},e.addHook=function(d,s){typeof s=="function"&&U(I,d)&&Ge(I[d],s)},e.removeHook=function(d,s){if(U(I,d)){if(s!==void 0){const l=vi(I[d],s);return l===-1?void 0:Ri(I[d],l,1)[0]}return _n(I[d])}},e.removeHooks=function(d){U(I,d)&&(I[d]=[])},e.removeAllHooks=function(){I=Fn()},e}var Ye=$n();A.use({breaks:!0,gfm:!0});class Ji{constructor(e,t){this.config=null,this.conversationId=null,this.isOpen=!1,this.soundEnabled=!0,this.isGenerating=!1,this.lastUserPrompt="",this.messages=[],this.hostEl=null,this.shadow=null,this.windowEl=null,this.launcherEl=null,this.bodyEl=null,this.textareaEl=null,this.sendBtnEl=null,this.escapeHtmlEl=document.createElement("div"),this.boundEscapeHandler=null,this.botId=e,this.backendUrl=t.replace(/\/+$/,""),this.visitorId=this.getOrCreateVisitorId()}getOrCreateVisitorId(){const e=`chatbot_visitor_${this.botId}`;let t=localStorage.getItem(e);return t||(t="v_"+Math.random().toString(36).substring(2,11),localStorage.setItem(e,t)),t}async init(){var e;try{const t=await fetch(`${this.backendUrl}/api/bots/${this.botId}/config`);if(!t.ok){console.error(`[ChatbotWidget] Failed to load config for bot ${this.botId}`);return}this.config=await t.json(),this.soundEnabled=((e=this.config)==null?void 0:e.sound_enabled)??!0,this.mount(),this.config&&this.config.auto_open_delay>0&&setTimeout(()=>{this.isOpen||this.toggleOpen(!0)},this.config.auto_open_delay*1e3)}catch(t){console.error("[ChatbotWidget] Error initializing widget:",t)}}mount(){if(!this.config)return;let e=document.getElementById(`ai-chatbot-host-${this.botId}`);e&&e.remove(),this.hostEl=document.createElement("div"),this.hostEl.id=`ai-chatbot-host-${this.botId}`,this.shadow=this.hostEl.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=ge(this.config.primary_color,this.config.position),this.shadow.appendChild(t);const i=document.createElement("div");i.innerHTML=`
      <!-- Launcher Button -->
      <button class="chatbot-launcher" id="cb-launcher" aria-label="Open chat with ${this.escapeHtml(this.config.name)}">
        <span class="launcher-badge"></span>
        <svg class="launcher-icon-chat" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="launcher-icon-close" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Chat Window -->
      <div class="chatbot-window" id="cb-window" role="dialog" aria-modal="true" aria-label="Chat window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="header-info">
            <div class="bot-avatar">
              ${this.config.avatar_url?`<img src="${this.escapeHtml(this.config.avatar_url)}" alt="${this.escapeHtml(this.config.name)}" />`:"🤖"}
            </div>
            <div class="bot-meta">
              <h3>${this.escapeHtml(this.config.name)}</h3>
              <div class="bot-status">
                <span class="status-dot"></span>
                <span>Online Assistant</span>
              </div>
            </div>
          </div>
          <div class="header-actions">
            <button class="header-btn" id="cb-sound-btn" title="Toggle sound" aria-label="Toggle sound">
              <svg id="cb-sound-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </button>
            <button class="header-btn" id="cb-clear-btn" title="Clear conversation" aria-label="Clear conversation">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="header-btn" id="cb-close-btn" title="Close" aria-label="Close chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-body" id="cb-body">
          <!-- Welcome message & initial greeting -->
          <div class="message-row assistant">
            <div class="message-bubble">
              ${Ye.sanitize(A.parse(this.config.welcome_message||"Hello! How can I help you today?"))}
              <span class="message-time">${this.formatTime(new Date)}</span>
            </div>
          </div>

          <!-- Configurable Suggested Prompt Buttons -->
          ${this.config.suggested_questions&&this.config.suggested_questions.length>0?`
            <div class="suggested-section" id="cb-suggested">
              <span class="suggested-title">Frequently Asked</span>
              ${this.config.suggested_questions.map(r=>`
                <button class="suggested-btn" data-query="${this.escapeHtml(r)}">
                  ${this.escapeHtml(r)}
                </button>
              `).join("")}
            </div>
          `:""}
        </div>

        <!-- Input Footer -->
        <div class="chatbot-footer">
          <div class="input-wrapper">
            <textarea
              class="chatbot-textarea"
              id="cb-textarea"
              rows="1"
              placeholder="Ask me anything..."
              aria-label="Message input"
            ></textarea>
            <button class="send-btn" id="cb-send-btn" title="Send message" disabled aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="branding-footer">
            <span>Powered by</span>
            <a href="#" target="_blank" rel="noopener">Gemini AI</a>
          </div>
        </div>
      </div>
    `,this.shadow.appendChild(i),document.body.appendChild(this.hostEl),this.windowEl=this.shadow.getElementById("cb-window"),this.launcherEl=this.shadow.getElementById("cb-launcher"),this.bodyEl=this.shadow.getElementById("cb-body"),this.textareaEl=this.shadow.getElementById("cb-textarea"),this.sendBtnEl=this.shadow.getElementById("cb-send-btn"),this.bindEvents()}bindEvents(){if(!this.shadow||!this.launcherEl||!this.textareaEl||!this.sendBtnEl)return;this.launcherEl.addEventListener("click",()=>this.toggleOpen());const e=this.shadow.getElementById("cb-close-btn");e==null||e.addEventListener("click",()=>this.toggleOpen(!1));const t=this.shadow.getElementById("cb-clear-btn");t==null||t.addEventListener("click",()=>this.clearChat());const i=this.shadow.getElementById("cb-sound-btn");i==null||i.addEventListener("click",()=>this.toggleSound()),this.textareaEl.addEventListener("input",()=>{var c;this.updateTextareaHeight();const o=!!((c=this.textareaEl)!=null&&c.value.trim());this.sendBtnEl&&(this.sendBtnEl.disabled=!o||this.isGenerating)}),this.textareaEl.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),this.submitMessage())}),this.sendBtnEl.addEventListener("click",()=>{this.submitMessage()});const r=this.shadow.getElementById("cb-suggested");r==null||r.addEventListener("click",o=>{const c=o.target.closest(".suggested-btn");if(c){const u=c.getAttribute("data-query");u&&(this.submitMessage(u),r.remove())}}),this.boundEscapeHandler=o=>{o.key==="Escape"&&this.isOpen&&this.toggleOpen(!1)},window.addEventListener("keydown",this.boundEscapeHandler)}updateTextareaHeight(){this.textareaEl&&(this.textareaEl.style.height="auto",this.textareaEl.style.height=Math.min(this.textareaEl.scrollHeight,100)+"px")}toggleOpen(e){var t,i,r,o;this.isOpen=e!==void 0?e:!this.isOpen,this.isOpen?((t=this.windowEl)==null||t.classList.add("is-open"),(i=this.launcherEl)==null||i.classList.add("is-open"),setTimeout(()=>{var c;return(c=this.textareaEl)==null?void 0:c.focus()},150)):((r=this.windowEl)==null||r.classList.remove("is-open"),(o=this.launcherEl)==null||o.classList.remove("is-open"))}toggleSound(){var t;this.soundEnabled=!this.soundEnabled;const e=(t=this.shadow)==null?void 0:t.getElementById("cb-sound-icon");e&&(e.style.opacity=this.soundEnabled?"1":"0.4")}clearChat(){confirm("Clear your conversation history with this assistant?")&&(this.conversationId=null,this.messages=[],this.bodyEl&&this.config&&(this.bodyEl.innerHTML=`
        <div class="message-row assistant">
          <div class="message-bubble">
            ${Ye.sanitize(A.parse(this.config.welcome_message||"Hello! How can I help you today?"))}
            <span class="message-time">${this.formatTime(new Date)}</span>
          </div>
        </div>
      `))}async submitMessage(e){var o,c,u;const t=(e||((o=this.textareaEl)==null?void 0:o.value)||"").trim();if(!t||this.isGenerating)return;this.lastUserPrompt=t,this.textareaEl&&(this.textareaEl.value="",this.updateTextareaHeight(),this.sendBtnEl&&(this.sendBtnEl.disabled=!0)),this.soundEnabled&&oe.playSendSound(),this.appendMessage({id:"msg_"+Date.now(),role:"user",content:t,timestamp:new Date});const i=(c=this.shadow)==null?void 0:c.getElementById("cb-suggested");i&&i.remove();const r=this.showTypingIndicator();this.scrollToBottom(),this.isGenerating=!0;try{const a=await fetch(`${this.backendUrl}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({botId:this.botId,message:t,conversationId:this.conversationId,visitorId:this.visitorId,stream:!0})});if(r.remove(),!a.ok)throw new Error("Chat API returned an error");if((a.headers.get("content-type")||"").includes("text/event-stream"))await this.handleStreamingResponse(a);else{const p=await a.json();this.conversationId=p.conversationId,this.appendMessage({id:p.messageId||"msg_"+Date.now(),role:"assistant",content:p.reply||"I'm having trouble responding right now.",timestamp:new Date}),this.soundEnabled&&oe.playReceiveSound()}}catch(a){console.error("[ChatbotWidget] Error:",a),r.remove(),this.appendMessage({id:"msg_err_"+Date.now(),role:"assistant",content:"Sorry, I'm having trouble responding right now. Please try again.",timestamp:new Date})}finally{this.isGenerating=!1,this.sendBtnEl&&((u=this.textareaEl)!=null&&u.value.trim())&&(this.sendBtnEl.disabled=!1),this.scrollToBottom()}}async handleStreamingResponse(e){var u;const t=(u=e.body)==null?void 0:u.getReader();if(!t)return;const i=new TextDecoder;let r="";const{rowEl:o,bubbleEl:c}=this.createAssistantMessageBubble();try{for(;;){const{done:a,value:m}=await t.read();if(a)break;const k=i.decode(m,{stream:!0}).split(`
`);for(const g of k)if(g.startsWith("data: ")){const E=g.replace(/^data: /,"").trim();if(!E)continue;try{const b=JSON.parse(E);if(b.type==="start")this.conversationId=b.conversationId;else if(b.type==="chunk"){r+=b.text;const v=Ye.sanitize(A.parse(r));c.innerHTML=v;const y=c.lastElementChild,z=document.createElement("span");z.className="streaming-cursor",y?y.appendChild(z):c.appendChild(z),this.scrollToBottom()}else b.type==="done"?(r=b.text||r,this.finalizeAssistantMessage(o,c,r),this.soundEnabled&&oe.playReceiveSound()):b.type==="error"&&(r=b.error||"Sorry, I'm having trouble responding right now.",this.finalizeAssistantMessage(o,c,r))}catch{}}}}catch(a){console.error("Error during streaming read:",a),r||(r="Sorry, I'm having trouble responding right now."),this.finalizeAssistantMessage(o,c,r)}}createAssistantMessageBubble(){var i;const e=document.createElement("div");e.className="message-row assistant";const t=document.createElement("div");return t.className="message-bubble",t.innerHTML='<span class="streaming-cursor"></span>',e.appendChild(t),(i=this.bodyEl)==null||i.appendChild(e),this.scrollToBottom(),{rowEl:e,bubbleEl:t}}finalizeAssistantMessage(e,t,i){const r=Ye.sanitize(A.parse(i));t.innerHTML=`
      ${r}
      <span class="message-time">${this.formatTime(new Date)}</span>
    `,this.renderAssistantActions(e,i),this.scrollToBottom()}renderAssistantActions(e,t){const i=document.createElement("div");i.className="message-actions";const r=document.createElement("button");if(r.className="action-chip-btn",r.innerHTML=`
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>
    `,r.addEventListener("click",()=>{navigator.clipboard.writeText(t),r.innerHTML="<span>✓ Copied!</span>",setTimeout(()=>{r.innerHTML=`
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>Copy</span>
        `},2e3)}),i.appendChild(r),this.lastUserPrompt){const o=document.createElement("button");o.className="action-chip-btn",o.innerHTML=`
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        <span>Regenerate</span>
      `,o.addEventListener("click",()=>{this.lastUserPrompt&&(e.remove(),this.submitMessage(this.lastUserPrompt))}),i.appendChild(o)}e.appendChild(i)}appendMessage(e){if(this.messages.push(e),!this.bodyEl)return;const t=document.createElement("div");t.className=`message-row ${e.role}`;const i=document.createElement("div");i.className="message-bubble";let r=this.escapeHtml(e.content);e.role==="assistant"&&(r=Ye.sanitize(A.parse(e.content))),i.innerHTML=`
      ${r}
      <span class="message-time">${this.formatTime(e.timestamp)}</span>
    `,t.appendChild(i),e.role==="assistant"&&this.renderAssistantActions(t,e.content),this.bodyEl.appendChild(t),this.scrollToBottom()}showTypingIndicator(){var t;const e=document.createElement("div");return e.className="message-row assistant",e.innerHTML=`
      <div class="typing-indicator">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>
    `,(t=this.bodyEl)==null||t.appendChild(e),e}scrollToBottom(){this.bodyEl&&(this.bodyEl.scrollTop=this.bodyEl.scrollHeight)}escapeHtml(e){return this.escapeHtmlEl.textContent=e,this.escapeHtmlEl.innerHTML}destroy(){this.boundEscapeHandler&&(window.removeEventListener("keydown",this.boundEscapeHandler),this.boundEscapeHandler=null),this.hostEl&&(this.hostEl.remove(),this.hostEl=null)}formatTime(e){return e.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}}(function(){if(typeof window>"u")return;function n(){var o;let e=document.currentScript;e||(e=document.querySelector("script[data-bot-id]"));let t=e==null?void 0:e.getAttribute("data-bot-id"),i=e==null?void 0:e.getAttribute("data-backend-url");if(!t&&((o=window.ChatbotConfig)!=null&&o.botId)&&(t=window.ChatbotConfig.botId),!t){console.warn('[ChatbotWidget] Missing data-bot-id attribute on script tag. Example: <script src="..." data-bot-id="YOUR_BOT_ID"><\/script>');return}if(!i)if(e!=null&&e.src)try{const c=new URL(e.src);i=`${c.protocol}//${c.host}`}catch{i=window.location.origin}else i=window.location.origin;const r=new Ji(t,i);r.init(),window.ChatbotWidget={instance:r,open:()=>r.toggleOpen(!0),close:()=>r.toggleOpen(!1),toggle:()=>r.toggleOpen()}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",n):n()})()})();
