const PILOT_ENDPOINT='__PILOT_ENDPOINT__';
const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl',{antialias:false,alpha:false});
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced){ const a=document.getElementById('mercanim'); if(a) a.remove(); }

const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const fs=`
precision highp float;
uniform vec2 u_res;uniform float u_time;uniform vec2 u_mouse;uniform float u_calm;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float h21(vec2 p){p=fract(p*vec2(234.34,435.345));p+=dot(p,p+34.23);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 float a=h21(i),b=h21(i+vec2(1,0)),c=h21(i+vec2(0,1)),d=h21(i+vec2(1,1));
 return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.55;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.13+11.7;a*=.5;}return v;}
vec3 sky(vec3 rd,float t){
 float y=clamp(rd.y*.5+.5,0.,1.);
 vec3 col=mix(vec3(.96,.975,.99),vec3(.68,.79,.91),pow(y,1.3));
 float cl=fbm(vec2(rd.x*1.6+t*.006,rd.y*4.2+rd.z*.7));
 col=mix(col,vec3(1.),smoothstep(.38,.90,cl)*.60*(1.-y*.30));
 col+=vec3(1.)*smoothstep(.60,.95,fbm(vec2(rd.x*4.5-t*.004,rd.y*9.)))*.20;
 return col;}
float sdEll(vec3 p,vec3 r){float k0=length(p/r);float k1=length(p/(r*r));return k0*(k0-1.)/k1;}
float sdRB(vec3 p,vec3 b,float r){vec3 q=abs(p)-b;
 return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-r;}
float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}
float leftF(vec3 p,float t,vec2 m,float cm){
 float sc=(1.-cm*.45)*1.55;
 vec3 q=p-vec3((-.98-cm*1.05)+m.x*.06,.00+cm*.10+m.y*.05,-.15);
 q/=sc;q.yz*=rot(.08);q.xy*=rot(-.05);
 q.x+=sin(t*.5)*.02;q.y+=cos(t*.4)*.018;
 float a=sdEll(q-vec3(.30,.56,.02),vec3(.34,.46,.26));
 float b=sdEll(q-vec3(-.12,.00,.05),vec3(.44,.44,.26));
 float c=sdEll(q-vec3(.28,-.54,-.03),vec3(.30,.38,.22));
 return smin(smin(a,b,.30),c,.30)*sc;}
float rightF(vec3 p,float t,vec2 m,float cm){
 float sc=(1.-cm*.45)*1.55;
 vec3 q=p-vec3((.98+cm*1.05)+m.x*.05,.02-cm*.06+m.y*.04,-.10);
 q/=sc;q.xy*=rot(.06+sin(t*.45)*.012);
 float up=sdEll(q-vec3(-.26,.52,.00),vec3(.32,.44,.24));
 float lo=sdEll(q-vec3(-.28,-.50,.00),vec3(.32,.42,.24));
 float mid=sdEll(q-vec3(.18,.00,.05),vec3(.46,.50,.26));
 float d=smin(smin(up,lo,.28),mid,.28);
 vec3 qs=q-vec3(.52,.72,-.05);qs.xy*=rot(-.55);
 float slab=sdRB(qs,vec3(.80,.15,.05),.10);
 return smin(d,slab,.20)*sc;}
float map(vec3 p,float t,vec2 m,float cm){return min(leftF(p,t,m,cm),rightF(p,t,m,cm));}
vec3 calcN(vec3 p,float t,vec2 m,float cm){const vec2 e=vec2(.0015,-.0015);
 return normalize(e.xyy*map(p+e.xyy,t,m,cm)+e.yyx*map(p+e.yyx,t,m,cm)+
 e.yxy*map(p+e.yxy,t,m,cm)+e.xxx*map(p+e.xxx,t,m,cm));}
void main(){
 vec2 uv=(gl_FragCoord.xy*2.-u_res)/u_res.y;
 float t=u_time;vec2 m=u_mouse;float cm=u_calm;
 vec3 ro=vec3(m.x*.13,m.y*.09,3.55);
 vec3 rd=normalize(vec3(uv,-2.05));
 float dist=0.;float hit=-1.;
 for(int i=0;i<76;i++){vec3 pos=ro+rd*dist;float d=map(pos,t,m,cm);
  if(d<.0012*max(dist,1.)){hit=1.;break;}dist+=d*.92;if(dist>10.)break;}
 vec3 col;
 if(hit>0.){vec3 pos=ro+rd*dist;vec3 n=calcN(pos,t,m,cm);
  float fre=pow(clamp(1.+dot(rd,n),0.,1.),3.);
  vec3 refl=reflect(rd,n);vec3 refr=refract(rd,n,.72);
  vec3 cRefl=mix(sky(refl,t),vec3(1.),.22);
  col=mix(sky(refr,t)*vec3(.97,.985,1.),cRefl,clamp(fre*.9,0.,1.));
  vec3 irid=.5+.5*cos(6.28318*(vec3(0.,.33,.67)+dot(n,-rd)*2.2+t*.04));
  col+=irid*fre*.07;
  vec3 sun=normalize(vec3(.35,.75,.55));
  col+=vec3(1.)*pow(max(dot(refl,sun),0.),70.)*.9;
  col+=vec3(1.)*pow(max(dot(refl,normalize(vec3(-.5,.4,.8))),0.),90.)*.5;
  col+=fre*.12;
 } else col=sky(rd,t);
 float open=1.-cm*.62;
 float lens=exp(-pow(length(uv*vec2(2.5,.92)),1.6)*1.9)*open;
 col+=vec3(1.)*lens*.42;
 col+=vec3(.94,.97,1.)*exp(-pow(length(uv*vec2(5.2,1.5)),2.)*2.2)*.30*open;
 col=clamp(col,0.,1.2);col=pow(col,vec3(.94));
 col+=(h21(gl_FragCoord.xy+t)-.5)/255.;
 gl_FragColor=vec4(col,1.);}`;

let prog,uR,uT,uM,uC;
function sh(t,s){const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);
 if(!gl.getShaderParameter(o,gl.COMPILE_STATUS))console.error(gl.getShaderInfoLog(o));return o;}
if(gl){prog=gl.createProgram();
 gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
 gl.linkProgram(prog);gl.useProgram(prog);
 const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const l=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(l);
 gl.vertexAttribPointer(l,2,gl.FLOAT,false,0,0);
 uR=gl.getUniformLocation(prog,'u_res');uT=gl.getUniformLocation(prog,'u_time');
 uM=gl.getUniformLocation(prog,'u_mouse');uC=gl.getUniformLocation(prog,'u_calm');}
function resize(){const s=Math.min(devicePixelRatio||1,2)*.62;
 canvas.width=Math.floor(innerWidth*s);canvas.height=Math.floor(innerHeight*s);
 if(gl)gl.viewport(0,0,canvas.width,canvas.height);}
addEventListener('resize',()=>{resize();if(reduced)draw(4.0);});resize();

let mx=0,my=0,smx=0,smy=0;
addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth)*2-1;my=-((e.clientY/innerHeight)*2-1);});
const calmFor={chooser:0,human:1,agent:1,mc:.85,site:1};
let calmT=calmFor[document.body.dataset.view]!==undefined?calmFor[document.body.dataset.view]:1;let calm=calmT;
function draw(t){if(!gl)return;
 smx+=(mx-smx)*.06;smy+=(my-smy)*.06;calm+=(calmT-calm)*.045;
 gl.uniform2f(uR,canvas.width,canvas.height);
 gl.uniform1f(uT,reduced?4.0:t);
 gl.uniform2f(uM,smx,smy);gl.uniform1f(uC,calm);
 gl.drawArrays(gl.TRIANGLES,0,3);}
let running=true;
document.addEventListener('visibilitychange',()=>{running=!document.hidden;
 if(running&&!reduced)requestAnimationFrame(loop);});
function loop(){if(!running)return;
 if(document.body.dataset.view!=='agent')draw(performance.now()/1000);
 if(!reduced)requestAnimationFrame(loop);}
if(gl&&document.body.dataset.view!=='agent'){reduced?draw(4.0):requestAnimationFrame(loop);}

const ROUTES={chooser:'/',human:'/human/',agent:'/agent/',mc:'/model-citizen/',site:'/kya/'};
function go(v){location.href=ROUTES[v]||'/';}

function choose(v,btn){
 const st=document.getElementById('status');
 st.textContent=(v==='human'?'Human':'Agent')+' selected';
 btn.classList.add('pressed');
 if(reduced){go(v);return;}
 setTimeout(()=>{btn.classList.remove('pressed');go(v);},520);}
async function submitPilot(ev){
 ev.preventDefault();
 const f=ev.target;
 const data={name:f.querySelector('#f1').value.trim(),org:f.querySelector('#f2').value.trim(),
  email:f.querySelector('#f3').value.trim(),pilot:f.querySelector('#f4').value.trim(),
  commit:f.querySelector('#f5').checked,website:f.querySelector('#hp').value};
 const btn=document.querySelector('.dock .pill');
 const err=document.getElementById('formerr');
 if(err)err.textContent='';
 if(!data.name||!data.org||!data.email||!data.pilot||!data.commit){
  if(err)err.textContent='All fields and the commitment are required.';return;}
 if(PILOT_ENDPOINT.indexOf('http')!==0){
  location.href='mailto:tima@aeoess.com?subject='+encodeURIComponent('Pilot request: '+data.org)+
   '&body='+encodeURIComponent('Name: '+data.name+'\nOrganization: '+data.org+'\nEmail: '+data.email+'\n\n'+data.pilot);
  return;}
 if(btn){btn.disabled=true;btn.textContent='Sending';}
 try{
  const ctl=new AbortController();const tm=setTimeout(function(){ctl.abort();},20000);
  const r=await fetch(PILOT_ENDPOINT,{method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify(data),signal:ctl.signal});
  clearTimeout(tm);
  if(!r.ok)throw new Error('http '+r.status);
  const safe=data.email.replace(/[<>&"]/g,'');
  document.querySelector('.mcform').innerHTML='<div class="sentmsg"><p class="para"><b>Request received.</b> We will contact you.</p><p class="micro terms">A confirmation email is on its way to '+safe+'.</p></div>';
  if(btn)btn.style.display='none';
 }catch(e){
  if(btn){btn.disabled=false;btn.textContent='Sign us up';}
  if(err)err.innerHTML='Could not send right now. Email us instead: <a href="mailto:tima@aeoess.com">tima@aeoess.com</a>';
 }}
