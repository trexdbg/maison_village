/**
 * Maison Village — maquette architecturale meublée.
 * Reconstruction indicative à partir de plans cotés et photographies, sans métrage certifié.
 * Moteur libre Three.js ; aucun compte ni outil externe nécessaire.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const host = document.querySelector('#viewer-canvas');
const roomName = document.querySelector('#room-name');
const roomDetail = document.querySelector('#room-detail');
const roomArea = document.querySelector('#room-area');
const roomPhoto = document.querySelector('#room-photo');
const floorCaption = document.querySelector('#floor-caption');
const labelHint = document.querySelector('#viewer-help');
const roofButton = document.querySelector('#btn-roof');
const furnitureButton = document.querySelector('#btn-furniture');
const topButton = document.querySelector('#btn-top');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#c4dce0');
scene.fog = new THREE.FogExp2('#c4dce0', 0.012);
const camera = new THREE.PerspectiveCamera(45, 1, 0.12, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('aria-label', 'Vue 3D de la maison à manipuler avec la souris ou le doigt');
host.append(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = true;
controls.minDistance = 2;
controls.maxDistance = 60;
controls.maxPolarAngle = Math.PI * 0.495;
controls.target.set(4, 4.1, 4.2);
camera.position.set(25, 16.5, 25.5);
controls.update();

scene.add(new THREE.HemisphereLight('#ecfaff', '#b39b75', 2.35));
const sun = new THREE.DirectionalLight('#fff5e2', 3.15);
sun.position.set(-12, 24, 17);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -27; sun.shadow.camera.right = 27;
sun.shadow.camera.top = 27; sun.shadow.camera.bottom = -27;
sun.shadow.normalBias = 0.024;
scene.add(sun);

function canvasTexture(kind, w = 256, h = 256) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  // Small deterministic grain — no remote textures or heavy dependencies.
  let seed = 7927;
  const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  if (kind === 'stucco') {
    ctx.fillStyle = '#e7c99a'; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6500; i++) {
      ctx.fillStyle = random() > .5 ? 'rgba(255,253,235,.13)' : 'rgba(105,75,51,.08)';
      ctx.fillRect(random()*w, random()*h, 1.5+random()*2, 1+random()*2);
    }
  } else if (kind === 'wood') {
    ctx.fillStyle = '#c4a078'; ctx.fillRect(0,0,w,h);
    for (let row=0; row<8; row++) {
      const x=row*w/8; ctx.fillStyle=row%3===0?'#caaa84':row%3===1?'#d2b28b':'#c69e76';
      ctx.fillRect(x+1,0,w/8-2,h);ctx.fillStyle='rgba(94,65,36,.27)';ctx.fillRect(x,0,2,h);
      for(let k=0;k<18;k++) {ctx.strokeStyle=`rgba(105,69,38,${.02+random()*.10})`;ctx.beginPath();ctx.moveTo(x+5+random()*(w/8-10),0);ctx.bezierCurveTo(x+random()*w/8,h*.3,x+random()*w/8,h*.68,x+random()*w/8,h);ctx.stroke();}
    }
  } else if (kind === 'tile') {
    ctx.fillStyle = '#e3d8c8';ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = '#c6bdb1';ctx.lineWidth = 2;
    for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(i*w/4,0);ctx.lineTo(i*w/4,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*h/4);ctx.lineTo(w,i*h/4);ctx.stroke();}
    for(let i=0;i<500;i++){ctx.fillStyle='rgba(95,85,77,.045)';ctx.fillRect(random()*w,random()*h,2,2);}
  } else if (kind === 'stone') {
    ctx.fillStyle='#d6c6aa';ctx.fillRect(0,0,w,h);
    for(let i=0;i<1300;i++){ctx.fillStyle=random()>.5?'rgba(255,255,246,.19)':'rgba(95,82,62,.07)';ctx.fillRect(random()*w,random()*h,random()*10,random()*3);}
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  return texture;
}
const mat = {
  stucco: new THREE.MeshStandardMaterial({map:canvasTexture('stucco'),color:'#fff0d8',roughness:.97}),
  interior: new THREE.MeshStandardMaterial({color:'#f3f1e9',roughness:.95}),
  sage: new THREE.MeshStandardMaterial({color:'#91a391',roughness:.97}),
  peach: new THREE.MeshStandardMaterial({color:'#ecc6b8',roughness:.97}),
  wood: new THREE.MeshStandardMaterial({map:canvasTexture('wood'),roughness:.83}),
  stone: new THREE.MeshStandardMaterial({map:canvasTexture('stone'),roughness:.88}),
  tile: new THREE.MeshStandardMaterial({map:canvasTexture('tile'),roughness:.82}),
  white: new THREE.MeshStandardMaterial({color:'#f8f6ef',roughness:.55}),
  warmwhite: new THREE.MeshStandardMaterial({color:'#e9e4d8',roughness:.85}),
  metal: new THREE.MeshStandardMaterial({color:'#456757',metalness:.35,roughness:.41}),
  green: new THREE.MeshStandardMaterial({color:'#3d7257',metalness:.1,roughness:.65}),
  mint: new THREE.MeshStandardMaterial({color:'#739981',roughness:.82}),
  terracotta: new THREE.MeshStandardMaterial({color:'#bb663e',roughness:.87}),
  terracotta2: new THREE.MeshStandardMaterial({color:'#d58a58',roughness:.87}),
  dark: new THREE.MeshStandardMaterial({color:'#414649',roughness:.63}),
  charcoal: new THREE.MeshStandardMaterial({color:'#343b40',roughness:.62}),
  sofa: new THREE.MeshStandardMaterial({color:'#252e32',roughness:.81}),
  pink: new THREE.MeshStandardMaterial({color:'#d89898',roughness:.87}),
  linen: new THREE.MeshStandardMaterial({color:'#f8eee5',roughness:.96}),
  glass: new THREE.MeshPhysicalMaterial({color:'#93cbd3',transparent:true,opacity:.36,roughness:.08,metalness:.05,side:THREE.DoubleSide,depthWrite:false}),
  glassClear: new THREE.MeshPhysicalMaterial({color:'#cbe6e1',transparent:true,opacity:.25,roughness:.05,side:THREE.DoubleSide,depthWrite:false}),
  water: new THREE.MeshPhysicalMaterial({color:'#35acc5',roughness:.11,metalness:.1,transparent:true,opacity:.92}),
  // Le terrain au rez-de-jardin est de la roche excavée, jamais une pelouse.
  bedrock: new THREE.MeshStandardMaterial({map:canvasTexture('stone'),color:'#9f9688',roughness:1}),
  poolLiner: new THREE.MeshStandardMaterial({color:'#b4d4d1',roughness:.83}),
  tree: new THREE.MeshStandardMaterial({color:'#4b7650',roughness:1}),
  tree2: new THREE.MeshStandardMaterial({color:'#688b58',roughness:1}),
  bark: new THREE.MeshStandardMaterial({color:'#86705a',roughness:1}),
  concrete: new THREE.MeshStandardMaterial({color:'#a5a49d',roughness:.95}),
};

const levels = [0,1,2].map(i=>{
  const l={slab:new THREE.Group(),walls:new THREE.Group(),cut:new THREE.Group(),architecture:new THREE.Group(),furniture:new THREE.Group(),hotspots:new THREE.Group(),labels:new THREE.Group(),trim:new THREE.Group()};
  for (const [name,g] of Object.entries(l)){g.name=`Etage ${i} / ${name}`;scene.add(g);}
  return l;
});
const exterior = new THREE.Group(); scene.add(exterior);
const roof = new THREE.Group(); scene.add(roof);

function cube(g,x,y,z,w,h,d,m,cast=true){
  if(w<=0||h<=0||d<=0)return null;
  const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);
  mesh.position.set(x+w/2,y+h/2,z+d/2);
  mesh.castShadow=cast; mesh.receiveShadow=true;g.add(mesh);return mesh;
}
function cyl(g,x,y,z,r,h,m,segments=12){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,segments),m);o.position.set(x,y+h/2,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function sphere(g,x,y,z,r,m){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;g.add(o);return o;}
function plankFloor(g,x,z,w,d,y,m=mat.wood){cube(g,x,y-.14,z,w,.14,d,m,false);}
function border(g,x,z,w,d,y,m=mat.wood){const s=.045;cube(g,x,y,z,w,s,.055,m,false);cube(g,x,y,z+d-.055,w,s,.055,m,false);cube(g,x,y,z,.055,s,d,m,false);cube(g,x+w-.055,y,z,.055,s,d,m,false);}
function rail(g,x,y,z,w,d){const n=Math.max(2,Math.ceil((w||d)/.20));for(let i=0;i<=n;i++){const t=i/n;cube(g,x+t*w,y,z+t*d,.028,.78,.028,mat.green,false)}cube(g,x,y+.78,z,Math.max(.028,w),.05,Math.max(.028,d),mat.green,false)}

// Individual opening segments make the windows/doors actual holes in the facades.
// horiz = wall along X; otherwise wall along Z. openings use [start,end,bottom,top,type].
function wall(g, axis, constant, start, end, y, height, thickness, material, openings=[]){
  const cuts=[start,end,...openings.flatMap(o=>[o[0],o[1]])].sort((a,b)=>a-b);
  const unique=[...new Set(cuts.map(n=>Number(n.toFixed(4))))];
  for(let i=0;i<unique.length-1;i++){
    const a=unique[i],b=unique[i+1];if(b-a<.025)continue;
    const o=openings.find(o=>a>=o[0]-.001&&b<=o[1]+.001);
    const bands=o?[[0,o[2]],[o[3],height]]:[[0,height]];
    for(const [low,high] of bands)if(high-low>.02){
      if(axis==='x')cube(g,a,y+low,constant,b-a,high-low,thickness,material);
      else cube(g,constant,y+low,a,thickness,high-low,b-a,material);
    }
  }
  const level=levels.find(l=>l.walls===g);
  if(level&&material===mat.stucco){
    // Vue en coupe : suivre les véritables ouvertures de la façade à hauteur d'allège.
    const lowOpenings=openings.filter(o=>o[2]<.72&&o[3]>.015).map(o=>[o[0],o[1],Math.max(0,o[2]),Math.min(.72,o[3]),'']);
    wall(level.cut,axis,constant,start,end,y,.72,thickness,mat.interior,lowOpenings);
  }
  const detail=level&&material===mat.stucco?level.trim:g;
  for(const o of openings){
    if(o[4]==='window'||o[4]==='sliding')addWindow(detail,axis,constant,o[0],o[1],y+o[2],o[3]-o[2],o[4]==='sliding');
    else if(['door','french','swing','solid','garage'].includes(o[4]))addDoor(detail,axis,constant,o[0],o[1],y+o[2],o[3]-o[2],o[4]);
  }
}
// Huisseries alignées sur les réservations, et non vitrages plaqués sur un mur plein.
function addWindow(g,axis,c,a,b,y,h,sliding=false){
  const w=b-a,t=.065,bar=.047,depth=.115,segments=sliding?3:2;
  if(axis==='x'){
    cube(g,a,y,c-.074,w,t,depth,mat.white,false);
    cube(g,a,y+h-t,c-.074,w,t,depth,mat.white,false);
    cube(g,a,y,c-.074,t,h,depth,mat.white,false);
    cube(g,b-t,y,c-.074,t,h,depth,mat.white,false);
    cube(g,a+t,y+t,c-.027,w-2*t,h-2*t,.016,mat.glassClear,false);
    for(let i=1;i<segments;i++)cube(g,a+i*w/segments-bar/2,y,c-.076,bar,h,.125,mat.white,false);
    if(sliding){
      cube(g,a,y+.095,c-.086,w,.018,.022,mat.metal,false);
      cube(g,a,y+h-.105,c-.086,w,.018,.022,mat.metal,false);
      cube(g,a+w*.64,y+h*.40,c-.091,.025,.19,.025,mat.metal,false);
    }else{
      cube(g,a+w*.5-.016,y+h*.44,c-.10,.031,.20,.026,mat.white,false);
    }
    cube(g,a-.04,y-.06,c-.102,w+.08,.07,.16,mat.stone,false);
  }else{
    cube(g,c-.074,y,a,depth,t,w,mat.white,false);
    cube(g,c-.074,y+h-t,a,depth,t,w,mat.white,false);
    cube(g,c-.074,y,a,depth,h,t,mat.white,false);
    cube(g,c-.074,y,b-t,depth,h,t,mat.white,false);
    cube(g,c-.026,y+t,a+t,.017,h-2*t,w-2*t,mat.glassClear,false);
    for(let i=1;i<segments;i++)cube(g,c-.076,y,a+i*w/segments-bar/2,.125,h,bar,mat.white,false);
    if(sliding){
      cube(g,c-.095,y+.10,a,.025,.018,w,mat.metal,false);
      cube(g,c-.096,y+h*.39,a+w*.63,.027,.19,.025,mat.metal,false);
    }
    cube(g,c-.102,y-.06,a-.04,.16,.07,w+.08,mat.stone,false);
  }
}
function addDoor(g,axis,c,a,b,y,h,type='french'){
  if(type==='open')return;
  const w=b-a,frame=.065;
  // Cadre périphérique, linteau et seuil.
  if(axis==='x'){
    cube(g,a,y,c-.08,frame,h,.13,mat.white,false);
    cube(g,b-frame,y,c-.08,frame,h,.13,mat.white,false);
    cube(g,a,y+h-.075,c-.08,w,.075,.13,mat.white,false);
    cube(g,a,y-.035,c-.085,w,.035,.16,mat.stone,false);
  }else{
    cube(g,c-.08,y,a,.13,h,frame,mat.white,false);
    cube(g,c-.08,y,b-frame,.13,h,frame,mat.white,false);
    cube(g,c-.08,y+h-.075,a,.13,.075,w,mat.white,false);
    cube(g,c-.085,y-.035,a,.16,.035,w,mat.stone,false);
  }
  if(type==='garage'){
    const shutterMat=new THREE.MeshStandardMaterial({color:'#ecece8',metalness:.35,roughness:.45});
    if(axis==='x'){
      cube(g,a+frame,y+.03,c-.038,w-2*frame,h-.15,.045,shutterMat,false);
      for(let i=1;i<18;i++)cube(g,a+frame,y+.03+i*(h-.15)/18,c-.07,w-2*frame,.014,.012,mat.warmwhite,false);
    }else{
      cube(g,c-.038,y+.03,a+frame,.045,h-.15,w-2*frame,shutterMat,false);
      for(let i=1;i<18;i++)cube(g,c-.07,y+.03+i*(h-.15)/18,a+frame,.012,.014,w-2*frame,mat.warmwhite,false);
    }
    return;
  }
  const solid=type==='solid'||type==='swing';
  const material=type==='solid'?mat.green:type==='swing'?mat.warmwhite:mat.glassClear;
  if(axis==='x'){
    cube(g,a+frame,y+.025,c-.021,w-2*frame,h-.115,.038,material,false);
    if(solid){
      for(let k=0;k<3;k++)cube(g,a+.14,y+.18+k*(h-.32)/3,c-.047,w-.28,(h-.39)/3,.014,type==='solid'?mat.mint:mat.white,false);
    }else{
      cube(g,(a+b)/2-.024,y+.04,c-.087,.048,h-.16,.13,mat.white,false);
    }
    cube(g,b-.19,y+h*.47,c-.075,.075,.023,.045,mat.metal,false);
  }else{
    cube(g,c-.021,y+.025,a+frame,.038,h-.115,w-2*frame,material,false);
    if(solid){
      for(let k=0;k<3;k++)cube(g,c-.047,y+.18+k*(h-.32)/3,a+.14,.014,(h-.39)/3,w-.28,type==='solid'?mat.mint:mat.white,false);
    }else{
      cube(g,c-.085,y+.04,(a+b)/2-.024,.13,h-.16,.048,mat.white,false);
    }
    cube(g,c-.076,y+h*.47,b-.19,.045,.023,.075,mat.metal,false);
  }
}
function shutter(g,x,y,z,w,h){
  cube(g,x,y,z,w,h,.065,mat.green,false);
  for(let k=0;k<15;k++)cube(g,x+.04,y+.075+k*(h-.12)/15,z-.017,w-.08,.025,.022,mat.mint,false);
}
function privacyBars(g,axis,c,a,b,y,h){
  for(let v=a+.10;v<=b-.06;v+=.23){if(axis==='x')cube(g,v,y,c,.025,h,.022,mat.dark,false);else cube(g,c,y,v,.022,h,.025,mat.dark,false)}
  if(axis==='x'){cube(g,a,y+h*.2,c,b-a,.027,.028,mat.dark,false);cube(g,a,y+h*.82,c,b-a,.027,.028,mat.dark,false)}
  else{cube(g,c,y+h*.2,a,.027,.028,b-a,mat.dark,false);cube(g,c,y+h*.82,a,.027,.028,b-a,mat.dark,false)}
}
function lowPartition(g,axis,c,a,b,y,height=.86,openings=[]){
  wall(g,axis,c,a,b,y,height,.115,mat.interior,openings.map(o=>[o[0],o[1],o[2],o[3],'']));
  // Cloison haute en vue extérieure ; coupe basse et passage dégagé en vue d'étage.
  const i=levels.findIndex(l=>l.cut===g);
  if(i>=0)wall(levels[i].walls,axis,c,a,b,y,[2.67,2.66,2.76][i],.12,mat.interior,openings.map(o=>[o[0],o[1],0,2.15,o[4]==='solid'?'solid':'swing']));
}
function trimLine(g,a,b,color=mat.terracotta2){const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],dist=Math.hypot(dx,dy,dz);const o=new THREE.Mesh(new THREE.CylinderGeometry(.032,.032,dist,6),color);o.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx,dy,dz).normalize());o.castShadow=false;g.add(o);}

function openEdge(g,x0,x1,z,y,height=.62){cube(g,x0,y,z,x1-x0,height,.14,mat.interior);}
function sideEdge(g,x,z0,z1,y,height=.62){cube(g,x,y,z0,.14,height,z1-z0,mat.interior);}
// Les parapets extérieurs sont construits automatiquement par wall() à partir
// des mêmes percements que les murs hauts. Une porte n'est jamais obstruée en coupe.
// --- Ground floor: based on 12.95 × 8.77 m plan ---
plankFloor(levels[0].slab,-4.48,0,12.95,8.77,.04,mat.concrete);
// La chambre photographiée dispose d'un parquet clair, pas d'un sol de garage.
plankFloor(levels[0].slab,.14,.16,3.75,2.84,.09,mat.wood);
wall(levels[0].walls,'x',0,-4.48,8.47,0,2.67,.22,mat.stucco,[[.75,1.83,1.08,2.05,'window']]);
wall(levels[0].walls,'x',8.57,-4.48,8.47,0,2.67,.22,mat.stucco,[[-3.70,-1.08,0,2.30,'garage'],[.63,1.51,1.00,2.06,'window'],[4.40,8.08,0,2.36,'open']]);
wall(levels[0].walls,'z',-4.48,0,8.77,0,2.67,.2,mat.stucco);
wall(levels[0].walls,'z',8.25,0,8.77,0,2.67,.2,mat.stucco);
// Ground entry arch in the front facade; portal and one roll-up garage door.
// Le rideau roulant est placé dans son ouverture, sans masquer le percement.
cube(levels[0].trim,-3.76,-.025,8.80,2.78,.05,.25,mat.stone,false);
// White plaster arch, not a rectangular garage front.
const archShape=new THREE.Shape();archShape.moveTo(0,0);archShape.lineTo(3.75,0);archShape.lineTo(3.75,2.55);archShape.lineTo(0,2.55);archShape.closePath();
const archHole=new THREE.Path();archHole.moveTo(.18,0);archHole.lineTo(.18,1.87);archHole.absarc(1.875,1.87,1.695,Math.PI,0,true);archHole.lineTo(3.57,0);archHole.closePath();archShape.holes.push(archHole);
const archMesh=new THREE.Mesh(new THREE.ExtrudeGeometry(archShape,{depth:.2,bevelEnabled:false,curveSegments:18}),mat.stucco);
archMesh.position.set(4.29,.06,8.86);archMesh.castShadow=true;archMesh.receiveShadow=true;levels[0].trim.add(archMesh);
// Ground interior: garage, technical / laundry, staircase and side garage.
lowPartition(levels[0].cut,'z',0,.10,8.58,0,.78,[[5.55,6.42,0,.78,'']]);
// L'ancienne petite cloison devant la volée droite est retirée pour dégager le départ.
lowPartition(levels[0].cut,'z',4.04,2.25,8.58,0,.78,[[6.30,7.15,0,.78,''],[7.22,8.11,0,.78,'solid']]);
// Accès à la première volée et sortie du retour entièrement libres au RDC.
// Aucune cloison ni porte battante sur x=2.18 : l'ancien mur barrait la
// première marche (z=3.46 à 4.35) malgré l'ouverture placée en face du retour.
// Les marches et leurs deux rampes conservent leur géométrie d'origine.
lowPartition(levels[0].cut,'x',3.40,0,2.18,0,.76);
lowPartition(levels[0].cut,'x',3.1,0,4,0,.76,[[2.51,3.34,0,.76,'']]);
lowPartition(levels[0].cut,'x',6.05,4.04,8.25,0,.76,[[4.49,5.40,0,.76,'']]);
// Garage au rez-de-chaussée : deux volumes libres, sans voiture ni guidage de pneus.
function cabinet(g,x,y,z,w,h,d,m=mat.warmwhite){cube(g,x,y,z,w,h,d,m);cube(g,x,y,z+d-.012,w,.02,.022,mat.wood,false);}
// La pièce accolée aux WC sous escalier correspond à la chambre photographiée,
// et non à la buanderie précédemment dessinée : on retire ici les machines fictives.
// Le mobilier est ajouté après la déclaration de groundBedroom().
// Garages dégagés, avec rangements et atelier à l'arrière comme sur la nouvelle photo.
function storage(g,x,z,y,w=1.45) {
  for(const xx of [x,x+w-.05])cube(g,xx,y,z,.05,1.78,.42,mat.metal,false);
  for(let i=1;i<=4;i++)cube(g,x,y+i*.34,z,w,.045,.43,mat.wood,false);
  for(let i=0;i<4;i++)cube(g,x+.13+(i%2)*.55,y+.39+i*.34,z+.06,.43,.16,.27,i%2?mat.warmwhite:mat.wood,false);
}
function bench(g,x,z,y,w=1.4) {
  cube(g,x,y+.80,z,w,.09,.62,mat.wood);
  for(const xx of [x+.07,x+w-.11])for(const zz of [z+.07,z+.52])cube(g,xx,y,zz,.04,.80,.04,mat.metal);
}
storage(levels[0].furniture,-4.05,6.87,.05,1.35);
bench(levels[0].furniture,-2.33,6.88,.05,1.3);
storage(levels[0].furniture,6.26,4.74,.05,1.44);
bench(levels[0].furniture,4.71,4.84,.05,1.31);
cyl(levels[0].furniture,5.39,.06,6.11,.24,.75,mat.terracotta2,16);
// Front small window & shutter.
// Fenêtre réelle prise dans la maçonnerie, avec volet vert et barreaux.
shutter(levels[0].trim,.16,1.00,8.84,.35,1.08);
shutter(levels[0].trim,1.61,1.00,8.84,.34,1.08);
privacyBars(levels[0].trim,'x',8.90,.68,1.46,1.08,.90);
// Porte d'entrée verte dans la cloison du porche, distincte du garage ouvert.
for(let z=0;z<8.7;z+=.36)cube(levels[0].cut,-4.48,.04,z,12.95,.012,.006,mat.warmwhite,false);

// --- Main living floor. Main part 8.47m wide, 8.90m deep + west loggia. ---
const y1=2.72;
// Trémie réelle de l'escalier : le plancher est découpé, non recouvert par une dalle pleine.
plankFloor(levels[1].slab,0,0,2.18,3.44,y1,mat.tile);
plankFloor(levels[1].slab,0,5.36,2.18,3.54,y1,mat.tile);
plankFloor(levels[1].slab,2.18,0,6.29,8.90,y1,mat.tile);
plankFloor(levels[1].slab,-4.22,5.59,4.22,3.31,y1,mat.tile);
// Les deux ouvertures barrées côté chambre et séjour (z = 0) sont rebouchées
// directement dans la géométrie 3D, y compris en vue en coupe.
wall(levels[1].walls,'x',0,0,8.47,y1,2.66,.18,mat.stucco);
wall(levels[1].walls,'x',8.72,0,8.47,y1,2.66,.18,mat.stucco,[[1.40,3.34,.81,2.11,'window'],[4.35,8.20,.71,2.36,'sliding']]);
// Suppression de la baie barrée sur le mur extérieur côté cuisine (x = 0).
// La fenêtre non barrée située côté chambre est conservée.
wall(levels[1].walls,'z',0,0,8.90,y1,2.66,.18,mat.stucco,[[.4,1.85,.75,2.1,'window']]);
// Fenêtre barrée entre salle à manger et terrasse/piscine (x = 8.29) rebouchée ;
// la porte-fenêtre et la baie de la loggia restent présentes.
wall(levels[1].walls,'z',8.29,0,8.90,y1,2.66,.18,mat.stucco,[[1.20,2.65,0,2.35,'french'],[6.62,8.50,.24,2.30,'sliding']]);
// Low partition walls, with cut door gaps.
lowPartition(levels[1].cut,'z',3.96,.1,3.46,y1,.78);lowPartition(levels[1].cut,'z',3.96,3.46,5.93,y1,.82,[[4.20,5.04,0,.82,'']]);lowPartition(levels[1].cut,'z',3.96,6.00,8.9,y1,.77,[[7.02,7.94,0,.77,'']]);
lowPartition(levels[1].cut,'x',3.50,0,3.96,y1,.74,[[2.50,3.37,0,.74,'']]);
lowPartition(levels[1].cut,'x',5.95,0,3.96,y1,.74,[[2.70,3.55,0,.74,'']]);
lowPartition(levels[1].cut,'x',6.35,4,8.29,y1,.72,[[5.17,7.48,0,.72,'']]);
// Stronger room flooring based on photographic details.
plankFloor(levels[1].slab,.16,.16,3.62,3.18,y1+.018,mat.wood);
plankFloor(levels[1].slab,2.18,3.58,1.63,2.17,y1+.018,mat.wood);
plankFloor(levels[1].slab,.16,5.36,2.02,.39,y1+.018,mat.wood);
plankFloor(levels[1].slab,4.12,.16,4.13,6.03,y1+.018,mat.tile);
// Green privacy railing: balcony on street façade, characteristic of the real house.
cube(levels[1].trim,4.60,3.49,8.99,3.50,.74,.09,mat.green,false);
for(let v=4.7;v<=8.05;v+=.19)cube(levels[1].trim,v,3.51,9.09,.024,.7,.025,mat.mint,false);
// First-floor loggias have glazed fronts, painted side edges.
for(const x of [-4.22,-.15])cube(levels[1].trim,x,y1,5.59,.15,1.28,3.3,mat.stucco);
addWindow(levels[1].trim,'x',8.72,-4.12,-.10,y1+.18,2.25,true);
for(let v=-4.17;v<-.16;v+=.82)cube(levels[1].trim,v,y1+.14,8.74,.045,2.20,.085,mat.white,false);
// Rear of left loggia is a glazed room.
addWindow(levels[1].trim,'x',5.58,-4.05,-.12,y1+.16,2.26,true);
// Right loggia partition with full height opening.
for(const x of [4.0,8.29])cube(levels[1].trim,x,y1,6.3,.15,1.2,2.6,mat.stucco);
// La baie de la loggia figure déjà dans son ouverture en façade, sans vitrage doublé.
// Window shutters and barred first-floor bedroom window.
shutter(levels[1].trim,0.87,y1+.75,8.97,.39,1.45);
privacyBars(levels[1].trim,'x',8.94,1.42,3.33,y1+.75,1.33);

// --- Upper floor, square building footprint 8.47m by 6.83m. ---
const y2=5.42;
// Trémie alignée sur celle de l'étage inférieur : 2,18 x 1,92 m.
plankFloor(levels[2].slab,0,0,2.18,3.44,y2,mat.wood);
plankFloor(levels[2].slab,0,5.36,2.18,1.47,y2,mat.wood);
plankFloor(levels[2].slab,2.18,0,6.29,6.83,y2,mat.wood);
wall(levels[2].walls,'x',0,0,8.47,y2,2.76,.18,mat.stucco,[[.83,1.98,.83,2.12,'window'],[5.30,6.85,.76,2.11,'window']]);
wall(levels[2].walls,'x',6.66,0,8.47,y2,2.76,.18,mat.stucco,[[1.13,2.04,.87,2.04,'window'],[5.48,7.20,.88,2.11,'window']]);
wall(levels[2].walls,'z',0,0,6.83,y2,2.76,.18,mat.stucco,[[.90,2.3,.83,2.15,'window']]);
wall(levels[2].walls,'z',8.29,0,6.83,y2,2.76,.18,mat.stucco,[[1.07,2.34,.88,2.11,'window']]);
lowPartition(levels[2].cut,'z',2.52,.08,3.48,y2,.83,[[1.06,1.91,0,.83,'']]);
lowPartition(levels[2].cut,'z',2.52,3.48,6.75,y2,.83,[[4.46,5.30,0,.83,''],[5.82,6.58,0,.83,'']]);
lowPartition(levels[2].cut,'z',4.05,.08,6.75,y2,.83,[[1.22,2.12,0,.83,''],[3.98,4.88,0,.83,'']]);
lowPartition(levels[2].cut,'x',3.46,0,2.50,y2,.81);
lowPartition(levels[2].cut,'x',3.38,4.04,8.27,y2,.81);
lowPartition(levels[2].cut,'x',5.36,0,2.51,y2,.81);
// Colors & tile floors in wet rooms.
plankFloor(levels[2].slab,.13,.12,2.24,3.18,y2+.015,mat.tile);
plankFloor(levels[2].slab,.13,5.38,2.24,1.30,y2+.015,mat.tile);
// Signature emerald shutters on the street-facing windows.
for(const x of [5.05,7.24])shutter(levels[2].trim,x,y2+.87,6.88,.35,1.28);
privacyBars(levels[2].trim,'x',6.77,1.15,2.03,y2+.83,1.28);

// Naturalistic stylised objects, inspired by the user-supplied real interior photographs.
function bed(g,x,z,w,d,y,accent=mat.linen,headOnZ=true){
  cube(g,x,y,z,w,.25,d,mat.wood);cube(g,x+.07,y+.25,z+.10,w-.14,.21,d-.2,mat.white);
  cube(g,x+.09,y+.47,z+.16,w-.18,.09,d-.27,accent);
  for(let k=0;k<2;k++)cube(g,x+.10+k*(w-.20)/2,y+.51,z+d-.57,(w-.23)/2,.12,.45,mat.linen);
  cube(g,x,y+.24,z+d-.16,w,.85,.13,mat.wood);
  for(const xx of [x+.09,x+w-.18])cube(g,xx,y-.01,z+.07,.07,.20,.09,mat.wood);
}
function dining(g,x,z,y){
  cube(g,x,y+.71,z,2.25,.085,1.05,mat.white);
  for(const xx of [x+.16,x+2.04])for(const zz of [z+.14,z+.84])cyl(g,xx,y,zz,.032,.71,mat.white,7);
  const places=[[x+.45,z-.29,0],[x+1.47,z-.29,0],[x+.45,z+1.34,0],[x+1.47,z+1.34,0]];
  for(const [xx,zz] of places){cube(g,xx,y+.42,zz,.43,.07,.43,mat.white);for(const xleg of [xx+.1,xx+.34])for(const zleg of [zz+.08,zz+.31])cube(g,xleg,y+.04,zleg,.035,.40,.036,mat.wood);cube(g,xx,y+.49,zz+.36,.43,.35,.065,mat.white);}
  cyl(g,x+1.05,y+.80,z+.51,.14,.055,mat.linen,18);
}
function sofa(g,x,z,y){
  cube(g,x,y+.15,z,2.43,.35,.94,mat.sofa);cube(g,x,y+.48,z+.70,2.43,.68,.26,mat.sofa);
  for(const xx of [x+.06,x+2.15])cube(g,xx,y+.4,z,.23,.44,.9,mat.sofa);
  for(let k=0;k<3;k++)cube(g,x+.30+k*.63,y+.49,z+.17,.56,.105,.58,mat.charcoal);
  cube(g,x+.39,y+.7,z+.87,.42,.22,.07,mat.pink);
}
function wardrobe(g,x,z,y,w=1.4){cube(g,x,y,z,w,2.03,.55,mat.wood);cube(g,x+w/2-.014,y+.05,z+.55,.026,1.88,.04,mat.warmwhite,false);for(const xx of [x+w*.45,x+w*.55])cube(g,xx,y+1.0,z+.57,.018,.21,.02,mat.metal,false);}
function bureau(g,x,z,y){cube(g,x,y+.75,z,1.25,.08,.59,mat.white);for(const xx of [x+.04,x+1.17])for(const zz of [z+.05,z+.50])cube(g,xx,y+.02,zz,.045,.72,.045,mat.wood);cube(g,x+.20,y+.80,z+.14,.35,.022,.28,mat.dark);}
// Chambre du niveau habitable : aménagement inspiré de la photographie fournie.
// Emprise x=.15..3.78, z=.15..3.34 : le lit ne coupe ni la fenêtre sur x=0
// ni le passage x=2.50..3.37 vers le palier (z=3.50).
function groundBedroom(g,y){
  // Le groupe est légèrement reculé par rapport à la cloison arrière (z=3.10).
  const bedroomObjects=new THREE.Group();
  bedroomObjects.position.z=-.16;
  g.add(bedroomObjects);
  g=bedroomObjects;
  const oak=new THREE.MeshStandardMaterial({color:'#c9a57a',roughness:.87});
  const oakEdge=new THREE.MeshStandardMaterial({color:'#a67e58',roughness:.88});
  const cream=new THREE.MeshStandardMaterial({color:'#eee8dd',roughness:1});
  const cotton=new THREE.MeshStandardMaterial({color:'#f9f4e9',roughness:1});
  const linenBeige=new THREE.MeshStandardMaterial({color:'#d7c8b4',roughness:1});
  const olive=new THREE.MeshStandardMaterial({color:'#8f9e86',roughness:1});
  const rattan=new THREE.MeshStandardMaterial({color:'#c68b44',roughness:.94,side:THREE.DoubleSide});
  const foliage=new THREE.MeshStandardMaterial({color:'#70876a',roughness:1});

  // Tapis écru, lit double 160 × 200, tête de lit contre le mur plein est.
  cube(g,1.40,y+.028,.62,2.25,.026,2.18,cream,false);
  cube(g,1.61,y+.18,.85,2.11,.22,1.65,oak);
  for(const bx of [1.69,3.56])for(const bz of [.93,2.35])
    cube(g,bx,y+.035,bz,.075,.19,.075,oakEdge);
  cube(g,1.66,y+.41,.90,1.98,.24,1.55,cotton);
  // Couette et plaid au pied du lit, plis lisibles en vue plongeante.
  cube(g,1.69,y+.658,.925,1.38,.08,1.50,linenBeige);
  cube(g,1.73,y+.742,.95,.32,.027,1.45,olive,false);
  for(const bz of [1.03,1.80]){
    cube(g,3.16,y+.66,bz,.38,.115,.58,cotton);
    cube(g,3.18,y+.78,bz+.08,.20,.035,.42,cream,false);
  }
  cube(g,3.70,y+.33,.78,.135,.91,1.79,oak);
  cube(g,3.66,y+.56,.85,.052,.56,1.65,linenBeige,false);

  // Deux petits chevets en bois, lampes et quelques livres.
  for(const z of [.26,2.67]){
    cube(g,3.14,y+.38,z,.45,.095,.36,oak);
    for(const x of [3.19,3.51])for(const zz of [z+.05,z+.29])
      cube(g,x,y+.04,zz,.035,.34,.035,oakEdge);
  }
  cyl(g,3.38,y+.48,.45,.052,.22,oakEdge,12);
  const lampShade=new THREE.Mesh(new THREE.CylinderGeometry(.10,.15,.18,16),cream);
  lampShade.position.set(3.38,y+.79,.45);g.add(lampShade);
  cube(g,3.22,y+.48,2.74,.22,.032,.14,cotton,false);
  cube(g,3.25,y+.52,2.76,.20,.025,.12,olive,false);

  // Commode bois clair à tiroirs crème, du côté libre de la fenêtre.
  cube(g,.30,y+.05,2.70,1.18,.79,.43,oak);
  cube(g,.35,y+.12,3.105,1.08,.64,.020,cream,false);
  for(let i=0;i<3;i++){
    cube(g,.36,y+.14+i*.21,3.133,1.06,.012,.008,oakEdge,false);
    cube(g,.81,y+.21+i*.21,3.136,.16,.018,.018,oakEdge,false);
  }
  cube(g,.27,y+.84,2.67,1.24,.055,.49,oak);
  // Bouquet et diffuseur identifiables sur la photo.
  cyl(g,.59,y+.90,2.88,.070,.17,cotton,12);
  for(const dx of [-.08,0,.08]){
    trimLine(g,[.59,y+1.07,2.88],[.59+dx,y+1.24,2.88+dx],foliage);
    sphere(g,.59+dx,y+1.25,2.88+dx,.052,cotton);
  }
  cyl(g,1.24,y+.90,2.88,.039,.14,cream,10);
  for(let k=0;k<3;k++)
    trimLine(g,[1.24,y+1.01,2.88],[1.19+k*.04,y+1.27,2.84+k*.03],oakEdge);

  // Store en lin au-dessus de la fenêtre à volets verts, sans cacher le vitrage.
  cube(g,.19,y+2.13,.44,.075,.19,1.40,linenBeige,false);
  cube(g,.20,y+2.10,.48,.045,.045,1.31,cream,false);

  // Placard derrière des rideaux écrus, pliés contre le pan de mur droit.
  cube(g,3.815,y+2.43,2.62,.035,.055,.59,oakEdge,false);
  for(let i=0;i<9;i++){
    const z=2.63+i*.062;
    cube(g,3.805+(i%2)*.016,y+.06,z,.025,2.31,.061,i%2?cream:linenBeige,false);
  }
  // Climatisation discrète, au-dessus de la zone rideau/porte de la photo.
  cube(g,3.725,y+2.30,2.77,.16,.25,.45,cotton,false);
  cube(g,3.719,y+2.33,2.81,.012,.020,.37,oakEdge,false);

  // Suspension en fibres tressées ajourées, analogue à celle de la photo.
  const cx=2.47,cz=1.69;
  cyl(g,cx,y+2.29,cz,.066,.21,mat.dark,14);
  trimLine(g,[cx,y+2.29,cz],[cx,y+2.08,cz],mat.dark);
  const rings=[[2.10,.24],[1.97,.34],[1.79,.32],[1.69,.22]];
  for(const [height,radius] of rings){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(radius,.017,5,28),rattan);
    ring.rotation.x=Math.PI/2;ring.position.set(cx,y+height,cz);ring.castShadow=false;g.add(ring);
  }
  for(let i=0;i<22;i++){
    const a=i*Math.PI*2/22,co=Math.cos(a),si=Math.sin(a);
    for(let j=0;j<rings.length-1;j++){
      const [h0,r0]=rings[j], [h1,r1]=rings[j+1];
      trimLine(g,[cx+co*r0,y+h0,cz+si*r0],[cx+co*r1,y+h1,cz+si*r1],rattan);
    }
  }
  sphere(g,cx,y+1.87,cz,.058,mat.warmwhite);
}

function kitchen(g,y){
  // Graphite fronts, light oak worktop and L-shape as photographed.
  cube(g,.17,y,.30,3.51,.88,.64,mat.charcoal);cube(g,.16,y+.88,.28,3.55,.075,.67,mat.wood);
  cube(g,.17,y,6.28,.65,.88,2.30,mat.charcoal);cube(g,.17,y+.88,6.28,.69,.07,2.30,mat.wood);
  cube(g,3.06,y,6.28,.72,.88,2.25,mat.charcoal);cube(g,3.05,y+.88,6.28,.76,.07,2.25,mat.wood);
  cube(g,3.04,y,8.16,.76,2.04,.66,mat.charcoal);
  for(let k=0;k<3;k++)cube(g,.34+k*.91,y+1.45,6.30,.87,.68,.34,mat.charcoal);
  cube(g,1.55,y+.94,.34,.96,.018,.47,mat.dark,false);for(const xx of [1.82,2.16])for(const zz of [.49,.72])cyl(g,xx,y+.96,zz,.095,.013,mat.metal,12);
  cube(g,2.47,y+.10,.30,.62,.68,.08,mat.dark,false);cube(g,2.52,y+.19,.24,.52,.49,.024,mat.glass,false);
  // Breakfast high table and pair of stools.
  cube(g,1.14,y+1.04,7.0,1.86,.08,.65,mat.wood);
  for(let k=0;k<2;k++){const xx=1.42+k*.91;cyl(g,xx,y+.0,7.89,.048,.79,mat.metal);cyl(g,xx,y+.80,7.89,.29,.06,mat.white,12)}
}
function bath(g,x,z,y){
  cube(g,x,y+.08,z,1.92,.58,.79,mat.white);cube(g,x+.11,y+.63,z+.10,1.70,.027,.59,mat.warmwhite,false);
  cube(g,x+.19,y+.66,z+.18,1.55,.016,.45,mat.glassClear,false);
  cyl(g,x+1.58,y+.67,z+.53,.07,.20,mat.metal,14);
}
function vanity(g,x,z,y){cube(g,x,y+.16,z,1.20,.67,.53,mat.pink);cube(g,x,y+.83,z,1.20,.09,.53,mat.white);cyl(g,x+.72,y+.90,z+.23,.20,.03,mat.warmwhite,20);cyl(g,x+.75,y+.96,z+.23,.025,.16,mat.metal,9)}
function toilet(g,x,z,y){cube(g,x,y+.17,z,.42,.37,.65,mat.white);cyl(g,x+.22,y+.47,z+.33,.25,.09,mat.white,18);cube(g,x+.02,y+.49,z+.49,.38,.16,.10,mat.white)}
// Escalier selon le plan fourni : demi-tournant GAUCHE, sans palier.
// Emprise dessinée : 2,13 m de long, 90 cm puis 87 cm de large.
// Départ à droite dans la volée du HAUT du plan, progression vers la gauche,
// 8 marches balancées en éventail à l'extrémité gauche, puis retour vers la
// droite dans la volée du BAS. Les WC se glissent sous ce tournant au RDC.
function stairs(parent,x,z,y){
  const g = new THREE.Group();
  g.name = 'Escalier demi-tournant gauche - deux volees paralleles et marches balancees';
  parent.add(g);
  const h = y < 1 ? 2.67 : 2.70; // raccord exact aux dalles à 2,72 et 5,42 m
  const rise = h/18;
  const xLeft=x+.055, xPivot=x+.925, xRight=x+2.13;
  const zTop=z+.055, zMid=z+.945, zBottom=z+1.825;
  const run=(xRight-xPivot)/5;
  const tread = new THREE.MeshStandardMaterial({color:'#eee7dc',roughness:.76});
  const riser = new THREE.MeshStandardMaterial({color:'#ddd4c7',roughness:.82,side:THREE.DoubleSide});
  const nosing = new THREE.MeshStandardMaterial({color:'#ae8463',roughness:.72});
  const steel = new THREE.MeshStandardMaterial({color:'#38433f',metalness:.38,roughness:.47});
  const pt=(xx,zz)=>({x:xx,z:zz});

  // Chaque marche est un véritable plateau polygonal horizontal, avec une
  // contremarche verticale. On conserve la forme rayonnante du plan, pas un L.
  function addStep(outline,number,front){
    const top=y+number*rise;
    const path=new THREE.Shape();
    path.moveTo(outline[0].x,outline[0].z);
    for(let k=1;k<outline.length;k++)path.lineTo(outline[k].x,outline[k].z);
    path.closePath();
    const geom=new THREE.ExtrudeGeometry(path,{depth:.055,bevelEnabled:false,steps:1});
    geom.rotateX(Math.PI/2); // extrusion vers le bas, plan dans le repère X/Z
    const mesh=new THREE.Mesh(geom,tread);
    mesh.position.y=top;
    mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
    const [a,b]=front,low=y+(number-1)*rise,high=top-.055;
    const face=new THREE.BufferGeometry();
    face.setAttribute('position',new THREE.Float32BufferAttribute([
      a.x,low,a.z, b.x,low,b.z, b.x,high,b.z,
      a.x,low,a.z, b.x,high,b.z, a.x,high,a.z
    ],3));
    face.computeVertexNormals();
    const panel=new THREE.Mesh(face,riser);
    panel.castShadow=true;panel.receiveShadow=true;g.add(panel);
    const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
    const lip=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,len,7),nosing);
    lip.position.set((a.x+b.x)/2,top+.004,(a.z+b.z)/2);
    lip.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(dx,0,dz).normalize());
    g.add(lip);
  }

  // 1 à 5 : départ du côté droit, première volée allant VERS LA GAUCHE.
  for(let i=0;i<5;i++){
    const xr=xRight-i*run, xl=xr-run;
    addStep([pt(xl,zTop),pt(xr,zTop),pt(xr,zMid),pt(xl,zMid)],i+1,
      [pt(xl,zTop),pt(xl,zMid)]);
  }

  // 6 à 13 : balancement à gauche, rayons issus du même pivot que sur le plan.
  // Les coins réels du rectangle sont insérés dans les éventails pour couvrir
  // la totalité de la trémie, sans petits triangles manquants.
  function edge(theta){
    const dx=-Math.sin(theta),dz=-Math.cos(theta),eps=1e-8;
    const t=Math.min(
      dx < -eps ? (xPivot-xLeft)/(-dx) : Infinity,
      dz < -eps ? (zMid-zTop)/(-dz) : Infinity,
      dz > eps ? (zBottom-zMid)/dz : Infinity
    );
    return pt(xPivot+t*dx,zMid+t*dz);
  }
  const corners=[
    {angle:Math.atan2(xPivot-xLeft,zMid-zTop),p:pt(xLeft,zTop)},
    {angle:Math.PI-Math.atan2(xPivot-xLeft,zBottom-zMid),p:pt(xLeft,zBottom)}
  ];
  for(let i=0;i<8;i++){
    const a=i*Math.PI/8,b=(i+1)*Math.PI/8;
    const outline=[pt(xPivot,zMid),edge(a)];
    for(const corner of corners)if(corner.angle>a+1e-8&&corner.angle<b-1e-8)outline.push(corner.p);
    const front=edge(b);
    outline.push(front);
    addStep(outline,6+i,[pt(xPivot,zMid),front]);
  }

  // 14 à 18 : volée de retour parallèle en partie BASSE du plan.
  // Elle remonte jusqu'au plancher de l'étage, à droite de la trémie.
  for(let i=0;i<5;i++){
    const xl=xPivot+i*run,xr=xl+run;
    addStep([pt(xl,zMid),pt(xr,zMid),pt(xr,zBottom),pt(xl,zBottom)],14+i,
      [pt(xr,zMid),pt(xr,zBottom)]);
  }

  // Rampes fines sur les deux bords intérieurs des volées (aucun faux palier).
  function rail(points){
    for(let k=0;k<points.length;k++){
      const p=points[k];
      trimLine(g,[p.x,p.base,p.z],[p.x,p.base+.78,p.z],steel);
      if(k) {
        const q=points[k-1];
        trimLine(g,[q.x,q.base+.78,q.z],[p.x,p.base+.78,p.z],steel);
      }
    }
  }
  const railGoingUp=Array.from({length:5},(_,i)=>({
    x:xRight-(i+.50)*run,z:zMid-.055,base:y+(i+1)*rise
  }));
  // Au premier étage, la rampe de la montée suivante part depuis le palier,
  // sans grille posée en travers de l'entrée de cette volée.
  if(y>1)railGoingUp.unshift({
    x:xRight+.07,z:zMid-.055,base:y
  });
  rail(railGoingUp);
  const railComingUp=Array.from({length:5},(_,i)=>({
    x:xPivot+(i+.50)*run,z:zMid+.055,base:y+(14+i)*rise
  }));
  // La main courante accompagne la dernière marche jusqu'au couloir.
  // L'extrémité est dans l'axe de séparation des deux volées, et non devant elles.
  if(y<1)railComingUp.push({
    x:xRight+.07,z:zMid+.055,base:y+h
  });
  rail(railComingUp);
  // Raccord de hauteur avec le parquet : bande de finition encastrée dans
  // le bord du couloir, avec un nez discret, sans faux palier ni ressaut.
  if(y<1){
    cube(g,xRight-.045,y+h-.026,zMid+.09,.255,.044,zBottom-zMid-.17,mat.wood,false);
    cube(g,xRight-.045,y+h+.013,zMid+.09,.025,.008,zBottom-zMid-.17,nosing,false);
  } else {
    cube(g,xRight-.035,y+h-.045,zMid+.08,.13,.045,zBottom-zMid-.15,mat.wood,false);
  }
}

// WC du rez-de-jardin : volume habillé sous les marches balancées.
// Photo de référence : parquet chêne, WC suspendu au fond, lave-mains à
// gauche et tableau électrique sur le mur droit. La porte reste ouverte en
// coupe pour permettre de voir les équipements depuis la maquette.
// Le plafond est l'intrados incliné de l'escalier, et non une dalle plate.
function underStairToilet(parent,x,z,y){
  // Pivot local de 90° autour du centre des WC : la porte anciennement côté
  // z positif s'ouvre maintenant vers x positif, en direction de l'escalier.
  // Tout le volume pivote ensemble (sol, cloisons, sous-face, WC, vasque,
  // compteur), sans déplacer les marches déjà conformes au plan.
  const pivotX=x+.49, pivotZ=z+1.395;
  const orientation=new THREE.Group();
  orientation.name='WC sous escalier - orientation tournee 90 degres vers lescalier';
  orientation.position.set(pivotX,0,pivotZ);
  orientation.rotation.y=Math.PI/2;
  parent.add(orientation);
  const g=new THREE.Group();
  g.name='WC avec entree laterale vers escalier';
  g.position.set(-pivotX,0,-pivotZ);
  orientation.add(g);
  const za=z+1.00,zb=z+1.79;
  const wallWhite=new THREE.MeshStandardMaterial({color:'#f4f3ef',roughness:.94,side:THREE.DoubleSide});
  const oak=new THREE.MeshStandardMaterial({map:canvasTexture('wood'),color:'#bd8d5f',roughness:.83});
  const joint=new THREE.MeshStandardMaterial({color:'#896647',roughness:1});
  const porcelain=new THREE.MeshStandardMaterial({color:'#fcfcfa',roughness:.29});
  const chrome=new THREE.MeshStandardMaterial({color:'#abb4b8',metalness:.78,roughness:.23});
  const panelGrey=new THREE.MeshStandardMaterial({color:'#d5d9d7',roughness:.75});
  const panelInk=new THREE.MeshStandardMaterial({color:'#586260',roughness:.82});
  const meterGreen=new THREE.MeshStandardMaterial({color:'#d4df16',roughness:.47});

  // Lames de parquet miel dans l'axe de la petite pièce, avec plinthes chêne.
  cube(g,x+.083,y+.013,za+.02,.778,.04,zb-za-.04,oak,false);
  for(let i=1;i<5;i++){
    cube(g,x+.083+i*.153,y+.053,za+.025,.003,.0015,zb-za-.05,joint,false);
  }
  cube(g,x+.085,y+.055,za+.072,.044,.068,zb-za-.115,oak,false);
  cube(g,x+.81,y+.055,za+.072,.038,.068,zb-za-.115,oak,false);
  cube(g,x+.085,y+.055,za+.065,.76,.068,.035,oak,false);

  // Murs latéraux en coupe : l'ouverture d'accès du côté z=zb reste libre.
  cube(g,x+.068,y,za,.058,1.18,zb-za,wallWhite);
  cube(g,x+.837,y,za,.055,.94,zb-za,wallWhite);
  cube(g,x+.068,y,zb-.052,.070,1.25,.052,wallWhite);
  cube(g,x+.817,y,zb-.052,.073,1.08,.052,wallWhite);
  cube(g,x+.145,y+.038,zb-.020,.66,.020,.048,oak,false);

  // Pignon arrière en pente : la ligne supérieure suit le tournant.
  const wallBack=new THREE.BufferGeometry();
  wallBack.setAttribute('position',new THREE.Float32BufferAttribute([
    x+.115,y,za+.024, x+.854,y,za+.024, x+.854,y+1.15,za+.024,
    x+.115,y,za+.024, x+.854,y+1.15,za+.024, x+.115,y+1.94,za+.024
  ],3));
  wallBack.computeVertexNormals();
  const back=new THREE.Mesh(wallBack,wallWhite);
  back.receiveShadow=true;g.add(back);

  // Sous-face de l'escalier, vue seulement d'en dessous : elle ne cache pas
  // les marches ni les appareils quand on regarde la scène depuis le dessus.
  // Au fond elle s'abaisse vers le tableau; elle remonte près de la porte.
  const a=[x+.115,y+1.94,za+.035],b=[x+.854,y+1.15,za+.035];
  const c=[x+.115,y+2.14,zb-.055],d=[x+.854,y+1.91,zb-.055];
  const soffitGeometry=new THREE.BufferGeometry();
  soffitGeometry.setAttribute('position',new THREE.Float32BufferAttribute([
    ...a,...b,...c, ...b,...d,...c
  ],3));
  soffitGeometry.computeVertexNormals();
  const soffit=new THREE.Mesh(soffitGeometry,new THREE.MeshStandardMaterial({
    color:'#f5f4f1',roughness:.96,side:THREE.FrontSide
  }));
  soffit.castShadow=false;soffit.receiveShadow=true;g.add(soffit);

  // WC suspendu à fond arrondi ; abattant annulaire et ouverture foncée.
  const bowl=new THREE.Mesh(new THREE.SphereGeometry(1,28,16),porcelain);
  bowl.scale.set(.182,.176,.240);
  bowl.position.set(x+.491,y+.372,za+.306);
  bowl.castShadow=true;bowl.receiveShadow=true;g.add(bowl);
  cube(g,x+.347,y+.33,za+.076,.285,.176,.232,porcelain);
  const waterOpening=new THREE.Mesh(new THREE.CircleGeometry(.135,32),
    new THREE.MeshStandardMaterial({color:'#a9b3b0',roughness:.65,side:THREE.DoubleSide}));
  waterOpening.rotation.x=-Math.PI/2;
  waterOpening.scale.set(1,1.27,1);
  waterOpening.position.set(x+.491,y+.542,za+.332);
  g.add(waterOpening);
  const seat=new THREE.Mesh(new THREE.TorusGeometry(.149,.018,10,32),porcelain);
  seat.rotation.x=-Math.PI/2;
  seat.scale.set(1,1.25,1);
  seat.position.set(x+.491,y+.555,za+.332);
  seat.castShadow=true;g.add(seat);
  cube(g,x+.345,y+.590,za+.083,.292,.025,.050,porcelain,false);

  // Commande de chasse à deux boutons encastrée au-dessus de la cuvette.
  cube(g,x+.357,y+.904,za+.081,.273,.145,.020,porcelain,false);
  for(const [xx,radius] of [[x+.441,.039],[x+.546,.026]]){
    const button=new THREE.Mesh(new THREE.CircleGeometry(radius,24),chrome);
    button.position.set(xx,y+.976,za+.105);g.add(button);
    const middle=new THREE.Mesh(new THREE.CircleGeometry(radius*.83,24),porcelain);
    middle.position.set(xx,y+.976,za+.107);g.add(middle);
  }

  // Petite grille de ventilation ronde dans le pignon, au-dessus à gauche.
  const vent=new THREE.Mesh(new THREE.CircleGeometry(.067,26),porcelain);
  vent.position.set(x+.280,y+1.50,za+.052);g.add(vent);
  const ventRing=new THREE.Mesh(new THREE.TorusGeometry(.054,.009,7,28),chrome);
  ventRing.position.set(x+.280,y+1.50,za+.057);g.add(ventRing);
  for(let k=0;k<3;k++)
    cube(g,x+.244,y+1.476+k*.016,za+.060,.073,.006,.005,panelInk,false);

  // Lave-mains rectangulaire compact à gauche, posé sur un meuble blanc.
  cube(g,x+.140,y+.064,za+.426,.232,.672,.307,porcelain);
  cube(g,x+.130,y+.737,za+.408,.290,.068,.332,porcelain);
  cube(g,x+.154,y+.805,za+.444,.226,.003,.243,wallWhite,false);
  cube(g,x+.362,y+.348,za+.471,.010,.245,.013,chrome,false);
  cube(g,x+.196,y+.819,za+.474,.020,.102,.020,chrome,false);
  cube(g,x+.197,y+.910,za+.473,.092,.016,.018,chrome,false);
  cube(g,x+.286,y+.870,za+.482,.018,.045,.017,chrome,false);
  // Poignée de tiroir horizontale à la manière du meuble photographié.
  cube(g,x+.352,y+.547,za+.485,.019,.017,.214,chrome,false);
  // Brosse WC et petit porte-rouleau discrets, proches du lave-mains.
  cyl(g,x+.220,y+.069,za+.309,.038,.132,chrome,18);
  cube(g,x+.128,y+.699,za+.316,.100,.016,.018,chrome,false);
  cyl(g,x+.170,y+.681,za+.340,.033,.042,porcelain,20);

  // Tableau électrique blanc sur le mur de droite, avec rangées de disjoncteurs.
  // Le relief des interrupteurs et les repères colorés évitent le bloc uni.
  cube(g,x+.785,y+.216,za+.337,.045,1.18,.397,porcelain,false);
  cube(g,x+.773,y+.251,za+.354,.020,1.105,.365,wallWhite,false);
  for(let row=0;row<5;row++){
    const yy=y+.330+row*.200;
    cube(g,x+.763,yy,za+.368,.011,.145,.328,panelGrey,false);
    cube(g,x+.753,yy+.011,za+.376,.007,.015,.308,row===2?meterGreen:panelInk,false);
    for(let k=0;k<7;k++){
      const zz=za+.382+k*.043;
      cube(g,x+.750,yy+.049,zz,.009,.082,.034,porcelain,false);
      cube(g,x+.742,yy+.094,zz+.010,.011,.028,.015,panelInk,false);
    }
  }
  // Boîtier de compteur vert-jaune caractéristique de la photo.
  cube(g,x+.737,y+1.430,za+.546,.084,.255,.175,meterGreen,false);
  cube(g,x+.724,y+1.523,za+.573,.015,.087,.119,panelInk,false);
  cube(g,x+.718,y+1.540,za+.586,.008,.061,.092,panelGrey,false);
  cube(g,x+.724,y+1.458,za+.613,.012,.028,.040,chrome,false);
}
// Garde-corps entourant uniquement les bords libres des trémies aux étages.
function shaftRail(g,x0,z0,x1,z1,y){
  const length=Math.hypot(x1-x0,z1-z0),count=Math.max(2,Math.ceil(length/.23));
  for(let k=0;k<=count;k++){
    const t=k/count;
    cube(g,x0+(x1-x0)*t-.014,y,z0+(z1-z0)*t-.014,.028,.89,.028,mat.dark,false);
  }
  trimLine(g,[x0,y+.89,z0],[x1,y+.89,z1],mat.dark);
}
for(const floor of [1,2]){
  const yy=floor===1?2.72:5.42;
  // Au 1er étage, les deux volées sont accessibles depuis le couloir
  // par le bord x=2.18 : PAS de barrière devant la première marche.
  // Au 2e étage seulement, la partie haute est fermée par un garde-corps
  // puisqu'aucun autre escalier n'y démarre.
  if(floor===2){
    shaftRail(levels[floor].architecture,2.18,3.43,2.18,4.38,yy);
  }
  shaftRail(levels[floor].architecture,.12,5.36,1.03,5.36,yy);
}

// Rez-de-chaussée : chambre réelle jouxtant les WC sous escalier.
groundBedroom(levels[0].furniture,.05);
stairs(levels[0].architecture,.04,3.40,.05);
underStairToilet(levels[0].architecture,.04,3.40,.05);
bed(levels[1].furniture,.85,.65,1.88,2.03,y1,mat.linen);
wardrobe(levels[1].furniture,.2,2.68,y1,1.05);
sofa(levels[1].furniture,4.47,2.30,y1);
dining(levels[1].furniture,5.15,4.61,y1);
// Mobilier et décoration supplémentaires inspirés des photographies.
cube(levels[1].furniture,4.48,y1+.03,5.48,1.08,.43,.53,mat.wood);
cube(levels[1].furniture,4.50,y1+.46,5.50,1.04,.06,.48,mat.linen);
cyl(levels[1].furniture,4.32,y1+.03,5.85,.10,.41,mat.glassClear,12);
for(let k=0;k<5;k++)trimLine(levels[1].furniture,[4.32,y1+.33,5.85],[4.18+k*.045,y1+.96+(k%2)*.13,5.82],mat.wood);
cyl(levels[1].furniture,7.91,y1+.02,5.76,.10,1.34,mat.wood,10);
cube(levels[1].furniture,7.66,y1+1.34,5.52,.51,.32,.50,mat.linen,false);
// Suspension bois au-dessus du coin repas, avec cinq ampoules.
cube(levels[1].furniture,5.35,y1+2.25,4.92,1.36,.06,.09,mat.wood,false);
for(let i=0;i<5;i++){
 const px=5.47+i*.28;
 trimLine(levels[1].furniture,[px,y1+2.24,4.96],[px,y1+1.63,4.96],mat.dark);
 cyl(levels[1].furniture,px,y1+1.56,4.96,.06,.14,mat.terracotta2,10);
}
cube(levels[1].furniture,7.64,y1+.28,1.28,.11,1.15,1.65,mat.wood);
cube(levels[1].furniture,7.64,y1+.75,1.48,.06,.87,1.25,mat.dark,false);
kitchen(levels[1].furniture,y1);
stairs(levels[1].architecture,.04,3.40,y1);
// Loggia children's toys / shelves, following the photos.
cabinet(levels[1].furniture,-3.82,y1+.02,6.12,1.08,.72,.45,mat.white);
for(let i=0;i<3;i++)cube(levels[1].furniture,-3.71+i*.31,y1+.75,6.3,.24,.21,.24,i===1?mat.pink:mat.mint);
cube(levels[1].furniture,5.1,y1,7.15,1.6,.65,.38,mat.white);

bath(levels[2].furniture,.25,.36,y2);
vanity(levels[2].furniture,.35,2.53,y2);
toilet(levels[2].furniture,.8,5.60,y2);
bed(levels[2].furniture,4.62,.52,2.70,1.94,y2,mat.linen);
wardrobe(levels[2].furniture,7.37,.26,y2,.70);
bed(levels[2].furniture,4.55,3.98,1.56,2.08,y2,mat.pink);
bureau(levels[2].furniture,6.6,4.17,y2);
wardrobe(levels[2].furniture,7.5,5.48,y2,.62);

// --- Pitched Mediterranean roof: real slope, projecting eaves, individual tile rows. ---
function roofY(z){return 8.87 - .105*z;}
function roofQuad(g,x0,x1,z0,z1,m){
  const verts=new Float32Array([x0,roofY(z0),z0,x1,roofY(z0),z0,x1,roofY(z1),z1,x0,roofY(z0),z0,x1,roofY(z1),z1,x0,roofY(z1),z1]);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(verts,3));geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,m);mesh.material.side=THREE.DoubleSide;mesh.receiveShadow=true;mesh.castShadow=true;g.add(mesh);
}
roofQuad(roof,-.28,8.74,-.39,7.10,mat.terracotta);
// Long, rounded ceramic tile ridges follow the slope and alternate warm colors.
for(let x=-.23,k=0;x<8.76;x+=.225,k++){
  trimLine(roof,[x,roofY(-.33)+.057,-.33],[x,roofY(7.08)+.057,7.08],k%4===0?mat.terracotta2:mat.terracotta);
}
for(let z=-.30;z<7.1;z+=.41){trimLine(roof,[-.20,roofY(z)+.016,z],[8.70,roofY(z)+.016,z],mat.terracotta2)}
// Facia and gutters.
trimLine(roof,[-.35,roofY(7.13)-.06,7.14],[8.76,roofY(7.13)-.06,7.14],mat.white);
for(const x of [.08,8.38]){trimLine(levels[2].trim,[x,8.11,7.1],[x,5.3,7.1],mat.white)}

// Toitures basses des loggias et bandeau de tuiles au-dessus des baies de la rue.
// La toiture principale est plus haute, sur le seul bloc de 8,47 × 6,83 m.
cube(roof,-4.35,5.30,5.48,4.49,.16,3.54,mat.stone,false);
cube(roof,-4.38,5.45,5.45,4.54,.045,3.64,mat.terracotta,false);
cube(roof,3.93,5.30,6.68,4.66,.16,2.40,mat.stone,false);
cube(roof,3.89,5.45,6.65,4.73,.045,2.48,mat.terracotta,false);
cube(roof,-4.42,5.40,8.97,13.06,.12,.19,mat.warmwhite,false);
for(let x=-4.32;x<8.58;x+=.28){
  const lip=new THREE.Mesh(new THREE.CylinderGeometry(.066,.066,.27,8),mat.terracotta2);
  lip.rotation.z=Math.PI/2;lip.position.set(x,5.49,9.08);roof.add(lip);
}
// Encadrements et enduit autour du balcon, d'après la photographie de façade.
cube(levels[1].trim,4.27,y1+2.44,8.89,4.05,.16,.28,mat.stone,false);
cube(levels[1].trim,.83,y1+2.18,8.88,2.63,.075,.25,mat.white,false);

// --- Géologie : maison et piscine taillées dans un flanc rocheux. ---
// Les différents niveaux sont posés dans la roche : aucune pelouse à la cote
// des garages. Les strates sont des triangles à facettes, non des murs verts.
const rockColors=['#8d8478','#aaa092','#b6a99a','#9d9183','#7c796f','#c0b1a0'].map(c=>new THREE.Color(c));
const rockFacets=new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,flatShading:true,side:THREE.DoubleSide});
function fracturedSurface(group, grid){
  const positions=[],colors=[];
  function triangle(a,b,c,i){
    const shade=rockColors[(i+rockColors.length*10)%rockColors.length];
    for(const p of [a,b,c]){
      positions.push(p[0],p[1],p[2]);
      colors.push(shade.r,shade.g,shade.b);
    }
  }
  for(let i=0;i<grid.length-1;i++)for(let j=0;j<grid[i].length-1;j++){
    const a=grid[i][j],b=grid[i+1][j],c=grid[i][j+1],d=grid[i+1][j+1];
    triangle(a,b,c,(i*7+j*11)%6);
    triangle(b,d,c,(i*13+j*5+2)%6);
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
  geo.computeVertexNormals();
  const mesh=new THREE.Mesh(geo,rockFacets);
  mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);
}
// Talus rocheux montant derrière le mur nord de la maison et la terrasse haute.
// L'arête basse reste hors des pièces et hors du bassin.
function rockBank(x0,x1,frontZ,backZ,frontY,backY,segments){
  const grid=[];
  for(let i=0;i<=segments;i++){
    const column=[],x=x0+(x1-x0)*i/segments;
    for(let j=0;j<=5;j++){
      const t=j/5;
      const edge=(i===0||i===segments)?0:Math.sin(i*2.17+j*1.81)*.12;
      const rough=j===0?0:Math.sin(i*1.37+j*2.41)*.12;
      column.push([x+edge,frontY+(backY-frontY)*Math.pow(t,.90)+rough,frontZ+(backZ-frontZ)*t+(j===0?0:Math.cos(i*1.7+j*2.0)*.10)]);
    }
    grid.push(column);
  }
  fracturedSurface(exterior,grid);
}
// Faces éclatées du soubassement creusé (face est et face côté rue).
function rockCutFace(axis,at,from,to,bottom,top){
  const cols=Math.ceil((to-from)/.55),grid=[];
  for(let i=0;i<=cols;i++){
    const column=[],v=from+(to-from)*i/cols;
    for(let j=0;j<=5;j++){
      const t=j/5;
      const offset=Math.sin(i*1.94+j*2.12)*.075;
      const y=bottom+(top-bottom)*t;
      column.push(axis==='x'?[at+offset,y,v]:[v,y,at+offset]);
    }
    grid.push(column);
  }
  fracturedSurface(exterior,grid);
}
// Le terrain naturel est de la pierre continue sous le bâtiment et la piscine.
cube(exterior,-7,-.34,-5,28,.32,22,mat.bedrock,false);
rockBank(-6.87,8.34,-.36,-4.91,-.02,1.85,27);
rockBank(8.38,17.07,-2.32,-4.90,y1-.19,y1+1.10,16);
rockBank(-6.91,-4.59,8.77,-4.88,-.02,1.70,7);

// Cour et accès sur rue, au niveau bas de la maison.
cube(exterior,-6.6,-.08,8.85,16,.12,6.40,mat.concrete,false);

// Le terrassement rocheux porte intégralement la terrasse supérieure.
const rockBaseY=-.24,terraceUnderside=y1-.17;
function rockFoundation(x,z,w,d,top=terraceUnderside){
  cube(exterior,x,rockBaseY,z,w,top-rockBaseY,d,mat.bedrock,false);
}
// La terrasse du PREMIER ÉTAGE forme une continuité autour de la maison.
// Elle s'appuie sur la roche à l'ouest et à l'arrière, mais couvre les garages
// sans remplir leur volume intérieur de roche. Les coordonnées sont celles du
// plan : y1 = dalle des pièces de vie et de la piscine.
const terraceWalkways=[
  // Passage arrière continu : raccorde le côté ouest à la terrasse piscine.
  {x:-6.50,z:-2.10,w:14.97,d:2.10,foundation:true},
  // Passage latéral ouest, au-dessus de la roche, jusque devant la loggia.
  {x:-6.50,z:0,w:2.02,d:9.65,foundation:true},
  // Toit accessible du premier garage : le garage reste VIDE en dessous.
  {x:-4.48,z:0,w:4.48,d:5.59,foundation:false},
  // Retour côté rue, à la cote du premier étage (dalle en porte-à-faux).
  {x:-4.48,z:8.90,w:12.95,d:.75,foundation:false}
];
for(const deck of terraceWalkways){
  if(deck.foundation)rockFoundation(deck.x,deck.z,deck.w,deck.d);
  cube(exterior,deck.x,y1-.17,deck.z,deck.w,.23,deck.d,mat.tile,false);
}
// Chape porteuse au-dessus du garage : pas de terre et pas de roche à l'intérieur.
cube(exterior,-4.48,y1-.28,0,4.48,.11,5.59,mat.concrete,false);
// Retour de la terrasse au-dessus de la rue (façade d'entrée préservée).
cube(exterior,-4.48,y1-.29,8.90,12.95,.12,.75,mat.concrete,false);
// Parois de roche laissées visibles au-dessous du pourtour de la terrasse.
rockCutFace('x',-6.52,-2.10,9.65,rockBaseY,terraceUnderside);
rockCutFace('z',-2.12,-6.50,8.47,rockBaseY,terraceUnderside);
rockCutFace('z',9.67,-6.50,-4.48,rockBaseY,terraceUnderside);

// Les quatre blocs de soubassement bordent la piscine excavée.
// Ils ne débordent pas dans la réservation du bassin.
rockFoundation(8.47,-2.10,8.60,2.22);
rockFoundation(8.47,.12,1.04,4.30);
rockFoundation(13.38,.12,3.69,4.30);
rockFoundation(8.47,4.42,8.60,4.73);
// Roche au fond de la fouille, sous le bassin.
rockFoundation(9.51,.12,3.87,4.30,y1-1.12);
rockCutFace('x',17.07,-2.1,9.15,rockBaseY,terraceUnderside);
rockCutFace('z',9.15,8.47,17.07,rockBaseY,terraceUnderside);

// Les dalles côté piscine se raccordent aux nouveaux cheminements : une
// terrasse minérale CONTINUE autour du bâtiment, jamais une pelouse en bas.
// Dallage supérieur en quatre surfaces qui laissent une vraie excavation.
cube(exterior,8.47,y1-.17,-2.1,8.6,.23,2.22,mat.tile,false);
cube(exterior,8.47,y1-.17,.12,1.04,.23,4.30,mat.tile,false);
cube(exterior,13.38,y1-.17,.12,3.69,.23,4.30,mat.tile,false);
cube(exterior,8.47,y1-.17,4.42,8.6,.23,4.73,mat.tile,false);
cube(exterior,16.82,y1-.16,-2.10,.23,1.42,11.2,mat.stucco);
cube(exterior,8.6,y1-.04,-2.08,8.2,.07,.2,mat.warmwhite,false);

// Bassin creusé DANS la roche : fond, parois revêtues et eau abaissée sous
// les margelles ; on voit la profondeur depuis la visite en surplomb.
cube(exterior,9.70,y1-1.12,.33,3.48,.08,3.87,mat.poolLiner,false);
cube(exterior,9.70,y1-1.09,.33,.09,1.12,3.87,mat.poolLiner,false);
cube(exterior,13.09,y1-1.09,.33,.09,1.12,3.87,mat.poolLiner,false);
cube(exterior,9.79,y1-1.09,.33,3.30,1.12,.09,mat.poolLiner,false);
cube(exterior,9.79,y1-1.09,4.11,3.30,1.12,.09,mat.poolLiner,false);
cube(exterior,9.72,y1-.37,.35,3.44,.05,3.83,mat.water,false);
for(const [x,z,w,d] of [
  [9.51,.12,3.87,.21],[9.51,4.21,3.87,.21],
  [9.51,.33,.19,3.88],[13.19,.33,.19,3.88]
])cube(exterior,x,y1+.01,z,w,.065,d,mat.white,false);
// Reflets limités à la surface réellement encastrée.
const rippleMat=new THREE.MeshBasicMaterial({color:'#c8f9f3',transparent:true,opacity:.38,depthWrite:false});
for(let i=0;i<9;i++){
  const wave=new THREE.Mesh(new THREE.TorusGeometry(.30+i*.019,.009,4,24,Math.PI*.9),rippleMat);
  wave.rotation.x=-Math.PI/2;
  wave.position.set(10.15+(i%3)*.95,y1-.305,1.05+(i%4)*.78);
  exterior.add(wave);
}
// Clôture de sécurité conservée à la cote du sol de terrasse.
for(const [x0,z0,x1,z1] of [[9.20,-.17,13.66,-.17],[9.20,4.68,13.66,4.68],[9.20,-.17,9.20,4.68],[13.66,-.17,13.66,4.68]]){
  const length=Math.hypot(x1-x0,z1-z0),n=Math.ceil(length/.26);
  for(let i=0;i<=n;i++){
    const t=i/n;
    cube(exterior,x0+(x1-x0)*t,y1+.02,z0+(z1-z0)*t,.028,.95,.028,mat.white,false);
  }
  trimLine(exterior,[x0,y1+.96,z0],[x1,y1+.96,z1],mat.white);
  trimLine(exterior,[x0,y1+.16,z0],[x1,y1+.16,z1],mat.white);
}
// Garde-corps et murets sur les nouvelles limites exposées de la terrasse.
// Ils suivent le pourtour extérieur, à distance des fenêtres et portes.
function terraceParapet(x,z,w,d){
  cube(exterior,x,y1+.06,z,w,.33,d,mat.stone,false);
  cube(exterior,x-.02,y1+.39,z-.02,w+.04,.065,d+.04,mat.white,false);
}
function terraceGuard(x0,z0,x1,z1){
  const n=Math.ceil(Math.hypot(x1-x0,z1-z0)/.24);
  for(let i=0;i<=n;i++){
    const t=i/n;
    cube(exterior,x0+(x1-x0)*t,y1+.45,z0+(z1-z0)*t,.035,.61,.035,mat.green,false);
  }
  trimLine(exterior,[x0,y1+1.07,z0],[x1,y1+1.07,z1],mat.green);
}
terraceParapet(-6.63,-2.10,.17,11.75); // bord de falaise, côté ouest
terraceGuard(-6.55,-2.00,-6.55,9.48);
terraceParapet(-6.50,9.53,14.97,.16); // côté rue, premier étage
// Le parapet suit uniquement la limite : il ne traverse pas le toit des garages.
terraceParapet(-6.50,-2.19,14.97,.17); // retour arrière
// Ancien rectangle de faux gazon supprimé : le dallage continue autour du bassin.
cube(exterior,14.22,y1+.02,-2.12,.21,1.53,5.22,mat.stucco);
cube(exterior,8.46,y1+.01,8.92,8.6,.83,.18,mat.stucco);
for(let x=8.62;x<16.94;x+=.23)cube(exterior,x,y1+.79,9.14,.035,.67,.035,mat.green,false);
trimLine(exterior,[8.55,y1+1.48,9.15],[17.01,y1+1.48,9.15],mat.green);

// Rue et avaloir (pas de jardin au rez-de-jardin).
for(let x=-5.7;x<4.8;x+=1.48)cube(exterior,x,.068,10.5,.85,.012,.085,mat.warmwhite,false);
for(let i=0;i<9;i++)cube(exterior,4.02+i*.13,.05,10.38,.048,.012,.86,mat.dark,false);
function plant(g,x,z,y,s=.95){
  cyl(g,x,y,z,.08*s,.9*s,mat.bark,7);
  for(let k=0;k<5;k++){
    const a=k*2.4;
    sphere(g,x+Math.cos(a)*.3*s,y+.96*s+(k%2)*.27*s,z+Math.sin(a)*.34*s,.53*s,k%2===0?mat.tree:mat.tree2);
  }
}
// Végétation décorative UNIQUEMENT en bacs sur la terrasse, pas en pleine terre.
for(const [x,z,s] of [[15.48,-.91,.80]]){
  cube(exterior,x-.35,y1+.06,z-.35,.70,.39,.70,mat.stone);
  plant(exterior,x,z,y1+.42,s);
}
cube(exterior,9.10,y1+.06,-2.02,7.67,.39,.42,mat.stone);
for(let x=9.30;x<16.55;x+=.58)sphere(exterior,x,y1+.49,-1.81,.29,mat.tree2);
// Mobilier de terrasse conservé.
for(const x of [14.4,15.4]){
  cube(exterior,x,y1+.20,5.57,.58,.09,1.31,mat.dark);
  cube(exterior,x,y1+.24,6.58,.57,.37,.08,mat.dark);
}

// --- Propriété voisine À L'EST : maison EN CONTRE-HAUT, hors de la terrasse. ---
// Le trait jaune des annotations s'arrête au mur x=17.07. La surface à droite
// (marquée en rouge) appartient à un autre bâti sur une parcelle plus élevée.
// Volumétrie volontairement schématique : aucune ouverture/cote voisine attestée.
const neighborProperty=new THREE.Group();
neighborProperty.name='Contexte : maison voisine en contre-haut (indicatif)';
scene.add(neighborProperty);
const neighborLevel=y1+2.12;  // le terrain voisin domine la plage de piscine
const neighborGround=new THREE.MeshStandardMaterial({color:'#b9aa97',roughness:1});
const neighborWall=new THREE.MeshStandardMaterial({color:'#d7c5ac',roughness:.98});
const neighborRoof=new THREE.MeshStandardMaterial({color:'#a76b4d',roughness:.94,side:THREE.DoubleSide});
const neighborTrim=new THREE.MeshStandardMaterial({color:'#f0e9db',roughness:.83});
// Sol de la parcelle voisine : aucun dallage/aucune terrasse ne traverse la limite.
cube(neighborProperty,17.49,rockBaseY,-5.05,12.6,neighborLevel-rockBaseY,14.7,mat.bedrock,false);
cube(neighborProperty,17.49,neighborLevel-.11,-5.05,12.6,.13,14.7,neighborGround,false);
// Mur de soutènement privatif, plus haut que le muret de notre piscine.
cube(neighborProperty,17.49,y1-.12,-2.17,.32,neighborLevel-y1+.27,11.32,mat.stone,false);
cube(neighborProperty,17.46,neighborLevel+.10,-2.17,.38,.12,11.32,neighborTrim,false);
// Maison voisine établie sur cette parcelle surélevée, en retrait de la piscine.
const nx=19.15,nz=-4.20,nw=8.20,nd=5.80,wallH=2.72;
const eave=neighborLevel+wallH,ridge=eave+1.20,mid=nx+nw/2;
cube(neighborProperty,nx,neighborLevel,nz,nw,wallH,nd,neighborWall,false);
cube(neighborProperty,nx-.16,neighborLevel-.11,nz-.15,nw+.32,.17,nd+.30,neighborTrim,false);
// Pignon et deux pans de tuiles ; les deux pans sont bien visibles en rotation.
function neighborTriangle(vertices,material=neighborRoof){
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices.flat(),3));
  geo.computeVertexNormals();
  const face=new THREE.Mesh(geo,material);
  face.castShadow=true;face.receiveShadow=true;neighborProperty.add(face);
}
for(const z of [nz,nz+nd])neighborTriangle([
  [nx,eave,z],[mid,ridge,z],[nx+nw,eave,z]
],neighborWall);
const roofFront=nz-.38,roofBack=nz+nd+.38;
for(const [edge,center] of [[nx-.35,mid],[nx+nw+.35,mid]]){
  neighborTriangle([
    [edge,eave,roofFront],[center,ridge,roofFront],[center,ridge,roofBack],
    [edge,eave,roofFront],[center,ridge,roofBack],[edge,eave,roofBack]
  ]);
  // Jointures discrètes donnant la lecture d'une toiture en tuiles.
  for(let k=1;k<16;k++){
    const t=k/16,x=edge+(center-edge)*t,y=eave+(ridge-eave)*t+.014;
    trimLine(neighborProperty,[x,y,roofFront],[x,y,roofBack],neighborRoof);
  }
}
trimLine(neighborProperty,[mid,ridge+.03,roofFront],[mid,ridge+.03,roofBack],neighborRoof);
// Fenêtres schématiques sur la façade visible, sans prétendre reproduire le voisin.
const neighborGlass=new THREE.MeshStandardMaterial({color:'#657a78',roughness:.25,metalness:.08});
for(const wx of [20.20,24.44]){
  cube(neighborProperty,wx,neighborLevel+.88,nz+nd+.013,1.48,1.21,.07,neighborTrim,false);
  cube(neighborProperty,wx+.10,neighborLevel+.98,nz+nd+.086,1.28,1.01,.024,neighborGlass,false);
  cube(neighborProperty,wx+.71,neighborLevel+.96,nz+nd+.115,.045,1.04,.038,neighborTrim,false);
  cube(neighborProperty,wx-.06,neighborLevel+.84,nz+nd+.02,1.60,.075,.16,neighborTrim,false);
}
// La maison voisine se masque en vue des étages pour ne pas occulter la visite intérieure.

// --- Room selection / photo references ---
const rooms = [
  [{id:'garage1',name:'Garage 1',area:'35,3 m²',desc:'Garage sans voiture, avec rangement et établi en fond de pièce.',x:-4.3,z:.2,w:4.1,d:8.28,photo:'02-garage-entree.jpg'},
   {id:'chambre-rdc',name:'Chambre du rez-de-chaussée',area:'11,8 m² (plan)',desc:'Chambre située à côté du WC sous escalier, avec parquet chêne, portes vertes, fenêtre à volets, lit double, rideaux écrus, commode et suspension en rotin. Surface du plan indicative.',x:.14,z:.15,w:3.75,d:2.8,photo:'13-chambre-bureau.jpg'},
   {id:'garage2',name:'Garage 2',area:'22,7 m²',desc:'Second garage, sans voiture, avec espace atelier.',x:4.20,z:.16,w:3.99,d:5.76,photo:'02-garage-entree.jpg'},
   {id:'escalier-rdc',name:'Escalier demi-tournant gauche',area:'Marches dans 2,13 × 1,77 m (plan)',desc:'Départ en haut à droite du plan, cinq marches vers la gauche, huit marches tournantes à gauche, puis cinq marches vers la droite jusqu’à l’étage. Pas de palier.',x:1.09,z:3.49,w:1.05,d:.83,photo:'04-entree.jpg'},
   {id:'wc-sous-escalier',name:'WC sous l’escalier',area:'Dimensions indicatives',desc:'WC pivotés de 90° sous la pente de l’escalier, porte tournée vers l’escalier ; parquet chêne, cuvette suspendue, lave-mains et tableau électrique.',x:.14,z:4.43,w:.79,d:.75,photo:'06-wc-rdc.jpg'},
   {id:'loggia0',name:'Loggia',area:'8,5 m²',desc:'Loggia au rez-de-chaussée.',x:4.2,z:6.15,w:4.0,d:2.38,photo:'02-garage-entree.jpg'}],
  [{id:'chambre1',name:'Chambre 1',area:'13,2 m²',desc:'Chambre du premier étage, parquet et fenêtre sur l’extérieur.',x:.15,z:.15,w:3.65,d:3.18,photo:'13-chambre-bureau.jpg'},
   {id:'entree',name:'Entrée / distribution',area:'5,5 m²',desc:'Palier de distribution entre les pièces, contigu à la cage d’escalier.',x:2.25,z:3.63,w:1.57,d:2.04,photo:'04-entree.jpg'},
   {id:'escalier',name:'Escalier demi-tournant gauche',area:'Marches dans 2,13 × 1,77 m (plan)',desc:'Deux volées parallèles et tournant balancé à gauche. Départ à droite en haut du plan ; WC sous le tournant au rez-de-chaussée.',x:.09,z:3.46,w:2.07,d:1.85,photo:'04-entree.jpg'},
   {id:'cuisine',name:'Cuisine',area:'9,2 m²',desc:'Cuisine aux façades anthracite et plan de travail aspect bois.',x:.15,z:6.09,w:3.65,d:2.65,photo:'16-cuisine.jpg'},
   {id:'sejour',name:'Salon / salle à manger',area:'24,4 m²',desc:'Pièce de vie claire, mur vert sauge, coin repas et canapé.',x:4.18,z:.15,w:4.10,d:6.02,photo:'12-sejour.jpg'},
   {id:'loggia1',name:'Loggia vitrée',area:'12,3 m²',desc:'Pièce vitrée donnant sur l’extérieur, utilisée comme espace de jeux.',x:-4.07,z:5.72,w:3.95,d:2.98,photo:'05-loggia.jpg'},
   {id:'loggia2',name:'Loggia',area:'7,5 m²',desc:'Loggia au niveau des pièces de vie.',x:4.17,z:6.5,w:4.10,d:2.20,photo:'05-loggia.jpg'}],
  [{id:'sdb',name:'Salle de bains',area:'7,6 m²',desc:'Baignoire, vasque, grande faïence grège.',x:.17,z:.15,w:2.18,d:3.14,photo:'08-salle-de-bains.jpg'},
   {id:'couloir',name:'Couloir',area:'10,1 m²',desc:'Couloir desservant les chambres et la salle de bains.',x:2.66,z:.17,w:1.20,d:6.37,photo:'04-entree.jpg'},
   {id:'chambre2',name:'Chambre 2',area:'11,9 m²',desc:'Chambre avec lit double et rangements.',x:4.19,z:.16,w:4.07,d:3.07,photo:'14-chambre-parentale.jpg'},
   {id:'chambre3',name:'Chambre 3',area:'12,4 m²',desc:'Chambre lumineuse avec mobilier enfant.',x:4.19,z:3.55,w:4.07,d:3.08,photo:'10-chambre-rose.jpg'},
   {id:'rangement',name:'Pièce / WC',area:'Surface non précisée',desc:'Petit espace près de la cage d’escalier.',x:.13,z:5.40,w:2.18,d:1.26,photo:'07-wc-etage.jpg'}]
];
function labelTexture(s){
  const c=document.createElement('canvas');c.width=512;c.height=128;
  const ctx=c.getContext('2d');ctx.fillStyle='rgba(23,55,44,.95)';ctx.beginPath();ctx.roundRect(4,7,504,110,28);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='bold 36px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(s,256,64,458);
  return new THREE.CanvasTexture(c);
}
for(let i=0;i<rooms.length;i++){
  const yy=i===0?.065:i===1?y1+.045:y2+.045;
  for(const r of rooms[i]){
    const surface=new THREE.Mesh(new THREE.PlaneGeometry(r.w,r.d),new THREE.MeshBasicMaterial({color:'#6f9a7d',transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));
    surface.rotation.x=-Math.PI/2;surface.position.set(r.x+r.w/2,yy,r.z+r.d/2);surface.userData.room=r;levels[i].hotspots.add(surface);
    const marker=new THREE.Sprite(new THREE.SpriteMaterial({map:labelTexture(r.name),transparent:true,depthTest:false,depthWrite:false}));
    marker.position.set(r.x+r.w/2,yy+1.72,r.z+r.d/2);
    marker.scale.set(Math.min(2.27,Math.max(1.25,r.w*.55)),.46,1);levels[i].labels.add(marker);
  }
}
const floorNames={all:'Vue extérieure',0:'Rez-de-jardin',1:'Premier étage',2:'Deuxième étage'};
const descriptions={all:'Sélectionnez un niveau pour voir les murs en coupe et l’aménagement intérieur.',0:'Chambre meublée au parquet chêne près des WC sous escalier, avec garages encaissés dans la roche et sans jardin au niveau bas. La terrasse et la piscine se trouvent au niveau supérieur.',1:'Escalier demi-tournant gauche, accès libre entre les deux volées, raccord de palier en parquet, séjour, cuisine et loggias.',2:'Deux chambres, salle de bains, WC et couloir.'};
let activeFloor='all',selected=null,roofOn=true,furnished=true,overhead=false,motion=null;
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
function tweenTo(pos,target,duration=730){motion={start:performance.now(),duration,fromP:camera.position.clone(),toP:pos.clone(),fromT:controls.target.clone(),toT:target.clone()};}
function updateMotion(t){if(!motion)return;const q=Math.min(1,(t-motion.start)/motion.duration);const e=q*q*(3-2*q);camera.position.lerpVectors(motion.fromP,motion.toP,e);controls.target.lerpVectors(motion.fromT,motion.toT,e);if(q>=1)motion=null;}
renderer.domElement.addEventListener('pointerdown',()=>{motion=null});
function showRoom(r){
  selected=r||null;
  roomName.textContent=r?.name||floorNames[activeFloor];
  roomDetail.textContent=r?.desc||descriptions[activeFloor];
  roomArea.textContent=r?.area||'';
  roomPhoto.hidden=!r?.photo;
  if(r?.photo){roomPhoto.src=`assets/photos/${r.photo}`;roomPhoto.alt=`Photographie de référence : ${r.name}`;roomPhoto.dataset.title=r.name;}
  for(let i=0;i<levels.length;i++)for(const mesh of levels[i].hotspots.children){
    const chosen=mesh.userData.room?.id===r?.id && i===Number(activeFloor);
    mesh.material.opacity=chosen?.22:0;
  }
  document.querySelector('#btn-focus').disabled=!r;
}
function renderVisibility(){
  const all=activeFloor==='all',idx=Number(activeFloor);
  levels.forEach((l,i)=>{
    l.walls.visible=all;
    l.architecture.visible=all||i===idx||i===idx-1;
    l.cut.visible=!all&&i===idx;
    l.slab.visible=all||i<=idx;
    l.furniture.visible=furnished&&(all||i===idx);
    l.labels.visible=!all&&i===idx&&!overhead;
    l.hotspots.visible=!all&&i===idx;
    l.trim.visible=all||i===idx;
  });
  roof.visible=all&&roofOn;
  // Exterior grounds continue to frame the building in plan view.
  exterior.visible=true;
  neighborProperty.visible=all;
  roofButton.setAttribute('aria-pressed',String(roofOn));
  furnitureButton.setAttribute('aria-pressed',String(furnished));
  furnitureButton.textContent=furnished?'🛋 Masquer les meubles':'🛋 Afficher les meubles';
  topButton.setAttribute('aria-pressed',String(overhead));
}
function chooseFloor(f){
  activeFloor=String(f);overhead=false;showRoom(null);renderVisibility();
  document.querySelectorAll('.floor-option').forEach(btn=>{const active=btn.dataset.floor===activeFloor;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
  floorCaption.textContent=activeFloor==='all'?'Vue extérieure · volumes & extérieurs':`${floorNames[activeFloor]} · architecture en coupe`;
  labelHint.textContent=activeFloor==='all'?'Choisissez un étage pour visiter l’intérieur':'Cliquez sur une pièce pour découvrir sa photo';
  if(activeFloor==='all')tweenTo(new THREE.Vector3(25,17,26),new THREE.Vector3(4,4,4.2));
  else {const y=activeFloor==='0'?.3:activeFloor==='1'?y1:y2;tweenTo(new THREE.Vector3(18,y+12,19),new THREE.Vector3(3.3,y+.35,4.35));}
}
function chooseRoom(id){const r=rooms[Number(activeFloor)]?.find(r=>r.id===id);if(r)showRoom(r);}
function focusStairs(){
  chooseFloor(0);
  showRoom(rooms[0].find(r=>r.id==='escalier-rdc'));
  tweenTo(new THREE.Vector3(4.8,6.1,7.9),new THREE.Vector3(1.11,1.30,4.32),900);
}
function focusRoom(){if(!selected||activeFloor==='all')return;const y=activeFloor==='0'?0:activeFloor==='1'?y1:y2;const x=selected.x+selected.w/2,z=selected.z+selected.d/2;tweenTo(new THREE.Vector3(x+Math.min(3.6,selected.w*1.05),y+3.5,z+Math.min(3.2,selected.d*1.12)),new THREE.Vector3(x,y+.65,z),850);}
renderer.domElement.addEventListener('click',e=>{
  if(activeFloor==='all')return;
  const rect=renderer.domElement.getBoundingClientRect();
  pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);
  raycaster.setFromCamera(pointer,camera);
  const hit=raycaster.intersectObjects(levels[Number(activeFloor)].hotspots.children)[0];
  if(hit)showRoom(hit.object.userData.room);
});
document.querySelectorAll('.floor-option').forEach(btn=>btn.addEventListener('click',()=>chooseFloor(btn.dataset.floor)));
document.querySelector('#btn-reset').addEventListener('click',()=>chooseFloor('all'));
roofButton.addEventListener('click',()=>{roofOn=!roofOn;renderVisibility()});
furnitureButton.addEventListener('click',()=>{furnished=!furnished;renderVisibility()});
topButton.addEventListener('click',()=>{overhead=!overhead;renderVisibility();const idx=Number(activeFloor);const y=activeFloor==='all'?4:idx===0?.15:idx===1?y1:y2;const target=new THREE.Vector3(activeFloor==='all'?4.3:2.9,y,4);tweenTo(overhead?new THREE.Vector3(target.x+.04,y+22,target.z+.05):new THREE.Vector3(18,y+12,19),target);});
document.querySelector('#btn-focus').addEventListener('click',focusRoom);
document.querySelector('#btn-stairs').addEventListener('click',focusStairs);
roomPhoto.addEventListener('click',()=>{const dialog=document.querySelector('#lightbox');document.querySelector('#lightbox-image').src=roomPhoto.src;document.querySelector('#lightbox-image').alt=roomPhoto.alt;document.querySelector('#lightbox-caption').textContent=roomPhoto.dataset.title||'';if(!dialog.open)dialog.showModal();});

const observer=new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)});observer.observe(host);
function animate(t){requestAnimationFrame(animate);if(!document.hidden){updateMotion(t);controls.update();renderer.render(scene,camera)}}
const loading=document.querySelector('#viewer-loading');if(loading)loading.remove();
renderVisibility();showRoom(null);requestAnimationFrame(animate);
window.houseViewer={chooseFloor,chooseRoom,focusRoom,focusStairs};window.dispatchEvent(new Event('house-viewer-ready'));