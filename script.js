
const products=[
 {id:1,name:'Button Mushrooms',cat:'Button',price:150,img:'button-mushroom.jpg',desc:'Tender, earthy and versatile button mushrooms.'},
 {id:2,name:'Oyster Mushrooms',cat:'Oyster',price:150,img:'oyster-mushroom.jpg',desc:'Fresh Korgajja oyster mushrooms with delicate texture.'},
 {id:3,name:'Milky Mushrooms',cat:'Milky',price:150,img:'milky-mushroom.jpg',desc:'Creamy, tender milky mushrooms for delicious cooking.'},
 {id:4,name:'Pink Oyster Mushrooms',cat:'Pink',price:150,img:'pink-oyster.jpg',desc:'Beautiful pink oyster mushrooms with rich flavor.'},
 {id:5,name:'Blue Oyster Mushrooms',cat:'Blue',price:150,img:'blue-oyster.jpg',desc:'Premium blue oyster mushrooms, freshly harvested.'}
];
let cart=JSON.parse(localStorage.getItem('korgajja-cart')||'[]');
let currentFilter='All';

function card(p){
 return `<article class="card" data-name="${p.name.toLowerCase()}">
   <div class="pic"><button class="heart" onclick="toggleHeart(this)">♡</button><img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"></div>
   <h3>${p.name}</h3><div><span class="price">₹${p.price.toFixed(2)}</span><span class="old">₹${(p.price+30).toFixed(2)}</span></div>
   <div class="stars">★★★★★ <span style="color:#999">(12)</span></div><div class="meta">${p.desc}</div>
   <div class="card-bottom"><span style="font-size:9px;color:#777">500 g pack</span><button class="add" onclick="addToCart(${p.id})">Add to Cart</button></div>
 </article>`
}
function render(list=products){
 const filtered=list.filter(p=>currentFilter==='All'||p.cat===currentFilter);
 document.getElementById('productGrid').innerHTML=filtered.length?filtered.map(card).join(''):`<div class="empty" style="grid-column:1/-1">No products found in this category.</div>`;
 document.getElementById('popularGrid').innerHTML=products.slice(2,8).map(card).join('');
}
function filterProducts(filter,el){
 currentFilter=filter;
 document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
 if(el) el.classList.add('active');
 else document.querySelector('.tab').classList.add('active');
 render();
}
function addToCart(id){
 const found=cart.find(x=>x.id===id);
 if(found) found.qty++; else cart.push({id,qty:1});
 saveCart(); updateCart(); toast('Added fresh mushrooms to your cart');
}
function saveCart(){localStorage.setItem('korgajja-cart',JSON.stringify(cart))}
function updateCart(){
 document.getElementById('cartBadge').textContent=cart.reduce((s,x)=>s+x.qty,0);
 const list=document.getElementById('cartList');
 if(!cart.length){list.innerHTML='<div class="empty">Your cart is empty.<br>Add some fresh Korgajja mushrooms from the shop.</div>';document.getElementById('cartTotal').textContent='₹0.00';return}
 list.innerHTML=cart.map(item=>{
  const p=products.find(x=>x.id===item.id);
  return `<div class="cart-item"><div class="cart-thumb"><img src="${p.img}" alt=""></div><div style="flex:1"><h4>${p.name}</h4><p>₹${p.price.toFixed(2)} · ${item.qty} pack${item.qty>1?'s':''}</p><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><b>${item.qty}</b><button onclick="changeQty(${p.id},1)">+</button></div></div><b>₹${(p.price*item.qty).toFixed(2)}</b></div>`
 }).join('');
 const total=cart.reduce((s,x)=>{const p=products.find(p=>p.id===x.id);return s+p.price*x.qty},0);
 document.getElementById('cartTotal').textContent='₹'+total.toFixed(2);
}
function changeQty(id,delta){
 const x=cart.find(x=>x.id===id);if(!x)return;x.qty+=delta;if(x.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();updateCart()
}
function openCart(){document.getElementById('drawer').classList.add('open');document.getElementById('overlay').classList.add('open')}
function closeCart(){document.getElementById('drawer').classList.remove('open');document.getElementById('overlay').classList.remove('open')}
function toggleHeart(btn){btn.classList.toggle('active');btn.textContent=btn.classList.contains('active')?'♥':'♡'}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),1800)}
function checkout(){if(!cart.length){toast('Your cart is empty');return}toast('Checkout demo — connect your payment flow here')}
document.getElementById('cartBtn').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
document.getElementById('overlay').onclick=closeCart;
document.getElementById('accountBtn').onclick=()=>toast('Korgajja customer account is ready to connect');
document.getElementById('searchInput').addEventListener('input',e=>{
 const q=e.target.value.toLowerCase().trim();
 currentFilter='All';
 document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));document.querySelector('.tab').classList.add('active');
 render(products.filter(p=>p.name.toLowerCase().includes(q)));
});
render();updateCart();
