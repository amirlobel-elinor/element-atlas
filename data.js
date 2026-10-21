// Element names and approximate classroom weights, based on the original app.
// See SOURCES.md for conventions and updates.
export const RAW = `H|Hydrogen|1.008|+1,-1
He|Helium|4.003|0
Li|Lithium|6.94|+1
Be|Beryllium|9.012|+2
B|Boron|10.81|+3
C|Carbon|12.011|+4,-4
N|Nitrogen|14.007|-3
O|Oxygen|15.999|-2
F|Fluorine|18.998|-1
Ne|Neon|20.180|0
Na|Sodium|22.990|+1
Mg|Magnesium|24.305|+2
Al|Aluminum|26.982|+3
Si|Silicon|28.085|+4
P|Phosphorus|30.974|-3
S|Sulfur|32.06|-2
Cl|Chlorine|35.45|-1
Ar|Argon|39.948|0
K|Potassium|39.098|+1
Ca|Calcium|40.078|+2
Sc|Scandium|44.956|+3
Ti|Titanium|47.867|+4,+3
V|Vanadium|50.942|+5,+4
Cr|Chromium|51.996|+3,+2
Mn|Manganese|54.938|+2,+7
Fe|Iron|55.845|+3,+2
Co|Cobalt|58.933|+2,+3
Ni|Nickel|58.693|+2
Cu|Copper|63.546|+2,+1
Zn|Zinc|65.38|+2
Ga|Gallium|69.723|+3
Ge|Germanium|72.630|+4
As|Arsenic|74.922|-3
Se|Selenium|78.971|-2
Br|Bromine|79.904|-1
Kr|Krypton|83.798|0
Rb|Rubidium|85.468|+1
Sr|Strontium|87.62|+2
Y|Yttrium|88.906|+3
Zr|Zirconium|91.222|+4
Nb|Niobium|92.906|+5
Mo|Molybdenum|95.95|+6
Tc|Technetium|98|+7
Ru|Ruthenium|101.07|+3
Rh|Rhodium|102.906|+3
Pd|Palladium|106.42|+2
Ag|Silver|107.868|+1
Cd|Cadmium|112.414|+2
In|Indium|114.818|+3
Sn|Tin|118.710|+2,+4
Sb|Antimony|121.760|+3
Te|Tellurium|127.60|-2
I|Iodine|126.904|-1
Xe|Xenon|131.293|0
Cs|Cesium|132.905|+1
Ba|Barium|137.327|+2
La|Lanthanum|138.905|+3
Ce|Cerium|140.116|+3,+4
Pr|Praseodymium|140.908|+3
Nd|Neodymium|144.242|+3
Pm|Promethium|145|+3
Sm|Samarium|150.36|+3
Eu|Europium|151.964|+3,+2
Gd|Gadolinium|157.249|+3
Tb|Terbium|158.925|+3
Dy|Dysprosium|162.500|+3
Ho|Holmium|164.930|+3
Er|Erbium|167.259|+3
Tm|Thulium|168.934|+3
Yb|Ytterbium|173.045|+3,+2
Lu|Lutetium|174.96669|+3
Hf|Hafnium|178.486|+4
Ta|Tantalum|180.948|+5
W|Tungsten|183.84|+6
Re|Rhenium|186.207|+7
Os|Osmium|190.23|+4
Ir|Iridium|192.217|+3,+4
Pt|Platinum|195.084|+2,+4
Au|Gold|196.967|+3,+1
Hg|Mercury|200.592|+2,+1
Tl|Thallium|204.38|+1,+3
Pb|Lead|207.2|+2,+4
Bi|Bismuth|208.980|+3
Po|Polonium|209|+2,+4
At|Astatine|210|-1
Rn|Radon|222|0
Fr|Francium|223|+1
Ra|Radium|226|+2
Ac|Actinium|227|+3
Th|Thorium|232.038|+4
Pa|Protactinium|231.036|+5
U|Uranium|238.029|+6
Np|Neptunium|237|+5
Pu|Plutonium|244|+4
Am|Americium|243|+3
Cm|Curium|247|+3
Bk|Berkelium|247|+3
Cf|Californium|251|+3
Es|Einsteinium|252|+3
Fm|Fermium|257|+3
Md|Mendelevium|258|+3
No|Nobelium|259|+2
Lr|Lawrencium|266|+3
Rf|Rutherfordium|267|+4
Db|Dubnium|268|+5
Sg|Seaborgium|269|+6
Bh|Bohrium|270|+7
Hs|Hassium|277|+8
Mt|Meitnerium|278|
Ds|Darmstadtium|281|
Rg|Roentgenium|282|
Cn|Copernicium|285|
Nh|Nihonium|286|
Fl|Flerovium|289|
Mc|Moscovium|290|
Lv|Livermorium|293|
Ts|Tennessine|294|
Og|Oganesson|294|`;

export const CATEGORIES = {
  alk: {name:'Alkali metals', color:'#f7cbbf'}, ake:{name:'Alkaline earth metals',color:'#ffe2a8'},
  tm:{name:'Transition metals',color:'#bfdaf6'}, pt:{name:'Post-transition metals',color:'#ced9ed'},
  mt:{name:'Metalloids',color:'#d9cff2'}, nm:{name:'Other nonmetals',color:'#c1e5e9'},
  hal:{name:'Halogens',color:'#efc9e8'}, nob:{name:'Noble gases',color:'#d1d0f2'},
  lan:{name:'Lanthanides',color:'#c9dff6'}, act:{name:'Actinides',color:'#e2d1e8'}
};
// Selected common monatomic ions, not an exhaustive list of oxidation states.
const IONS={3:[1],4:[2],7:[-3],8:[-2],9:[-1],11:[1],12:[2],13:[3],15:[-3],16:[-2],17:[-1],19:[1],20:[2],24:[2,3],25:[2],26:[2,3],27:[2,3],28:[2],29:[1,2],30:[2],35:[-1],37:[1],38:[2],47:[1],48:[2],50:[2,4],53:[-1],55:[1],56:[2],82:[2,4]};
const ENDS=[2,10,18,36,54,86,118];
const ISOTOPES=new Set([43,61,...Array.from({length:118-83},(_,i)=>84+i)].filter(z=>![90,91,92].includes(z)));
export const FAMILY_NAMES=['Alkali metals','Alkaline earth metals','Transition metals','Boron group','Carbon group','Pnictogens','Chalcogens','Halogens','Noble gases','Lanthanides','Actinides'];
export const ELEMENTS=RAW.split('\n').map((line,i)=>{
  const [symbol,name,weight]=line.split('|'),z=i+1;
  const period=ENDS.findIndex(n=>z<=n)+1, k=z-(ENDS[period-2]||0);
  let row=period,col;
  if(period===1)col=k===1?1:18;
  else if(period<4)col=k<=2?k:k+10;
  else if(period<6)col=k;
  else if(k<=2)col=k;
  else if(k<=17){row=period+3;col=k;}
  else col=k-14;
  const group=row<=7?col:null;
  const cat=[3,11,19,37,55,87].includes(z)?'alk':[4,12,20,38,56,88].includes(z)?'ake':[9,17,35,53,85,117].includes(z)?'hal':[2,10,18,36,54,86,118].includes(z)?'nob':[5,14,32,33,51,52].includes(z)?'mt':[1,6,7,8,15,16,34].includes(z)?'nm':row===9?'lan':row===10?'act':group>=3&&group<=12?'tm':'pt';
  const family=z===1?'Hydrogen (unique)':cat==='lan'?'Lanthanides':cat==='act'?'Actinides':group===1?FAMILY_NAMES[0]:group===2?FAMILY_NAMES[1]:group<=12?FAMILY_NAMES[2]:FAMILY_NAMES[group-10];
  const valence=z>86?null:z===2?2:group===1?1:group===2?2:group>=13?group-10:null;
  return {z,symbol,name,weight:z===18?'39.95':weight,period,row,col,group,cat,family,valence,ions:IONS[z]||[],isotope:ISOTOPES.has(z)};
});
export const BY_Z=Object.fromEntries(ELEMENTS.map(e=>[e.z,e]));
export const MODES=[
  {id:'map',name:'Find on table',category:'memory',icon:'map',tag:'THE CLASSIC',desc:'A blank table. A name. Find its place.',detail:'Find each element on a blank periodic table. Build the same spatial memory you use in map quizzes.'},
  {id:'name',name:'Name from symbol',category:'memory',icon:'type',tag:'RECALL',desc:'Turn those familiar letters into names.',detail:'Type the full element name from its symbol. British and American spellings both work.'},
  {id:'spot',name:'Name from position',category:'memory',icon:'target',tag:'SPATIAL RECALL',desc:'One highlighted tile. Which element is it?',detail:'Identify a position on the table. Answer with the element name or symbol.'},
  {id:'family',name:'Element families',category:'memory',icon:'layers',tag:'PATTERNS',desc:'Get to know the table’s neighborhoods.',detail:'Choose the family for each element. Group families and broad metal categories are distinguished in Explore.'},
  {id:'match',name:'Family match',category:'memory',icon:'link',tag:'MATCHING GAME',desc:'Connect six elements to their families.',detail:'Select an element, then its family. Keep matching until the board is clear. Your first attempt on each pair is scored.'},
  {id:'number',name:'Atomic numbers',category:'chemistry',icon:'hash',tag:'FOUNDATIONS',desc:'Know the number that defines an element.',detail:'Type the atomic number: the number of protons in the nucleus.'},
  {id:'mass',name:'Atomic weights',category:'chemistry',icon:'scale',tag:'CLASSROOM RECALL',desc:'Practice useful approximate weights.',detail:'Enter a whole-number or decimal approximation. Answers within 0.5 of the displayed reference count. Elements without a standard atomic weight are excluded.'},
  {id:'valence',name:'Valence electrons',category:'chemistry',icon:'atom',tag:'BONDING',desc:'Connect main-group positions to electrons.',detail:'Count valence electrons in neutral main-group atoms through radon. Helium has two; transition and inner-transition metals are excluded.'},
  {id:'ion',name:'Ion charges',category:'chemistry',icon:'bolt',tag:'IONS',desc:'Predict the charges that show up in class.',detail:'Enter one of the listed common monatomic ion charges, such as +2 or 2+. These are selected introductory examples, not all oxidation states.'},
  {id:'period',name:'Periods',category:'chemistry',icon:'rows',tag:'TABLE STRUCTURE',desc:'Place elements in their horizontal rows.',detail:'Type the period, from 1 to 7. The detached lanthanide and actinide rows belong to periods 6 and 7.'},
  {id:'group',name:'Group numbers',category:'chemistry',icon:'columns',tag:'TABLE STRUCTURE',desc:'Learn the table’s 18 vertical groups.',detail:'Type the group number, from 1 to 18. The detached inner-transition series are excluded.'},
  {id:'trends',name:'Periodic trends',category:'connections',icon:'trend',tag:'COMPARE & REASON',desc:'Which atom is larger? Which holds on tighter?',detail:'Compare selected pairs using atomic-radius and first-ionization-energy trends. These pairs avoid minor exceptions. This deck has its own element selection.'},
  {id:'connections',name:'Chemistry connections',category:'connections',icon:'network',tag:'UNDERSTAND WHY',desc:'Link the table to ions, isotopes, and bonds.',detail:'Apply what you know to short chemistry scenarios, with an explanation after every answer. This is a curated concept deck.'},
  {id:'polyatomic',name:'Polyatomic ions',category:'connections',icon:'flask',tag:'CHEMISTRY ESSENTIALS',desc:'Recognize the ions that travel as a team.',detail:'Choose the formula and charge for 12 common polyatomic ions. Formulas use true subscripts and superscripts.'}
];
export const SCOPES=[['20','First 20 · H–Ca'],['36','First 36 · H–Kr'],['54','First 54 · H–Xe'],['main','Main-group elements'],['all','All 118 elements'],['alk','Alkali metals'],['hal','Halogens'],['nob','Noble gases']];
export const CONCEPTS=[
 ['c01','A neutral atom has 17 protons. How many electrons does it have?',['17','18','16','35'],0,'Neutral atoms have equal numbers of protons and electrons.'],
 ['c02','A calcium atom becomes Ca²⁺. What changed?',['It lost 2 electrons','It gained 2 electrons','It lost 2 protons','It gained 2 protons'],0,'Positive charge comes from losing electrons. Calcium keeps its 20 protons.'],
 ['c03','Carbon-12 and carbon-14 differ in their number of…',['Neutrons','Protons','Protons and electrons','Valence shells'],0,'Isotopes share an atomic number but have different neutron counts.'],
 ['c04','Which pair should have the most similar chemistry?',['Na and K','Na and Mg','Na and Ne','Na and Cl'],0,'Sodium and potassium are both group 1 metals, each with one valence electron.'],
 ['c05','Which formula balances Mg²⁺ and Cl⁻?',['MgCl₂','Mg₂Cl','MgCl','Mg₂Cl₃'],0,'One +2 ion needs two −1 ions to make a neutral formula unit.'],
 ['c06','Why is helium in group 18 despite having only two electrons?',['Its first shell is full','It has 8 valence electrons','It has no electrons','It is an alkali metal'],0,'The first shell holds two electrons. Helium already has a filled shell.'],
 ['c07','Which ion has the same electron count as neon?',['Na⁺','Na²⁺','K⁺','Cl⁻'],0,'Na⁺ has 11 − 1 = 10 electrons, matching neutral neon.'],
 ['c08','Why can you not calculate an isotope’s neutron count from a rounded standard atomic weight?',['The weight averages isotopes','The weight equals proton count','Neutrons have no mass','All isotopes have equal mass'],0,'Use the isotope’s mass number minus its atomic number. Standard atomic weight is an average.'],
 ['c09','The elements in one period have the same…',['Period number','Number of protons','Number of valence electrons','Typical ion charge'],0,'A period is a horizontal row. Proton count changes from one element to the next.'],
 ['c10','Which change would turn one element into another?',['Changing the proton count','Gaining one electron','Losing one electron','Changing the neutron count'],0,'Atomic number identifies an element. Changing electrons makes ions; changing neutrons makes isotopes.'],
 ['c11','Iron(III) means that the iron ion has…',['A +3 charge','Three neutrons','A −3 charge','An atomic number of 3'],0,'A Roman numeral specifies the metal’s oxidation state; for a monatomic ion, this equals its charge.'],
 ['c12','Which is a polyatomic ion?',['SO₄²⁻','Na⁺','Cl⁻','Mg²⁺'],0,'Sulfate contains several bonded atoms with an overall charge.'],
 ['c13','Which formula balances Al³⁺ and O²⁻?',['Al₂O₃','Al₃O₂','AlO','AlO₃'],0,'Two +3 ions and three −2 ions give a net charge of zero.'],
 ['c14','A chloride ion, Cl⁻, has how many electrons?',['18','17','16','35'],0,'Chlorine has atomic number 17. A −1 charge means one extra electron.'],
 ['c15','Where do the lanthanides belong in the full table?',['Period 6','Period 8','Group 18','Period 3'],0,'The detached row saves space; it is part of period 6.'],
 ['c16','Which property increases by exactly one between adjacent atomic numbers?',['Proton count','Standard atomic weight','Neutron count','Atomic radius'],0,'Atomic number counts protons. The other quantities do not increase in uniform steps.'],
 ['c17','Which formula correctly uses calcium and nitrate?',['Ca(NO₃)₂','CaNO₃','Ca₂NO₃','CaN₂O₃'],0,'Ca²⁺ requires two nitrate ions. Parentheses keep each NO₃⁻ group intact.'],
 ['c18','A neutral phosphorus atom has how many valence electrons?',['5','15','3','8'],0,'Phosphorus is in group 15. The main-group pattern gives five valence electrons.'],
 ['c19','An atom has 11 protons and 12 neutrons. What is its mass number?',['23','11','12','1'],0,'Mass number is protons plus neutrons: 11 + 12 = 23.'],
 ['c20','Which pair are isotopes of the same element?',['¹²C and ¹³C','¹²C and ¹⁴N','Na and Na⁺','O and O₂'],0,'Both carbon atoms have six protons but different mass numbers.']
].map(([id,prompt,options,answer,explanation])=>({id,prompt,options,answer,explanation}));
export const POLYATOMIC=[
 ['ammonium','NH₄⁺',1],['hydroxide','OH⁻',-1],['nitrate','NO₃⁻',-1],['nitrite','NO₂⁻',-1],
 ['sulfate','SO₄²⁻',-2],['sulfite','SO₃²⁻',-2],['carbonate','CO₃²⁻',-2],['hydrogen carbonate','HCO₃⁻',-1],
 ['phosphate','PO₄³⁻',-3],['acetate','C₂H₃O₂⁻',-1],['permanganate','MnO₄⁻',-1],['chromate','CrO₄²⁻',-2]
];
// [atomic numbers, property, correct atomic number]. Selected comparisons, not a universal rule.
export const TREND_PAIRS=[
 [3,11,'radius',11],[11,19,'radius',19],[4,12,'radius',12],[9,17,'radius',17],[8,16,'radius',16],
 [11,17,'radius',11],[3,9,'radius',3],[12,16,'radius',12],[19,35,'radius',19],
 [3,11,'ionization',3],[11,19,'ionization',11],[4,12,'ionization',4],[9,17,'ionization',9],
 [8,16,'ionization',8],[11,17,'ionization',17],[3,9,'ionization',9],[12,17,'ionization',17],[19,35,'ionization',35]
];
