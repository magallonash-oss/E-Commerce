/* HIRAYA STUDIO — vanilla JavaScript storefront */
const PRODUCTS = [
  {id:"hs-001",name:"The Solene Dress",category:"dresses",price:2490,tag:"Bestseller",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",description:"An easy, softly structured silhouette with thoughtful details. Made for slow mornings and last-minute plans."},
  {id:"hs-002",name:"Sunday Linen Set",category:"tops",price:1850,tag:"New",image:"https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=85",description:"A breathable everyday layer with a relaxed fit and an understated finish."},
  {id:"hs-003",name:"The Isla Trousers",category:"bottoms",price:2190,tag:"Just in",image:"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=900&q=85",description:"A versatile high-waist trouser designed to move with you from weekday to weekend."},
  {id:"hs-004",name:"Petal Day Dress",category:"dresses",price:2790,tag:"New",image:"https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=900&q=85",description:"A light, romantic dress with a softly defined waist and a little sense of occasion."},
  {id:"hs-005",name:"Everyday Knit Top",category:"tops",price:1290,tag:"Everyday",image:"assets/everyday-knit-top.svg",description:"Your go-to knit: simple, comfortable, and easy to style in more ways than one."},
  {id:"hs-006",name:"Soft Form Shoulder Bag",category:"accessories",price:1690,tag:"Limited",image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85",description:"A quietly polished finishing touch with room for the everyday essentials."},
  {id:"hs-007",name:"The Weekend Maxi",category:"dresses",price:3190,tag:"Bestseller",image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85",description:"A graceful full-length shape that feels just as good as it looks."},
  {id:"hs-008",name:"Sculpted Gold Hoops",category:"accessories",price:790,tag:"Small detail",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85",description:"A sculptural, lightweight pair to finish a look without overthinking it."}
];

const STORAGE = { cart:"hirayaStudio_cart_v1", wishlist:"hirayaStudio_wishlist_v1" };
const money = value => new Intl.NumberFormat("en-PH",{style:"currency",currency:"PHP",maximumFractionDigits:2}).format(value);
const readStorage = (key, fallback) => { try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };

class HirayaStore {
  constructor(){
    this.cart = readStorage(STORAGE.cart,[]);
    this.wishlist = readStorage(STORAGE.wishlist,[]);
    this.category = "all"; this.query = ""; this.sort = "featured";
    this.activeProduct = null;
  }
  persist(){ localStorage.setItem(STORAGE.cart,JSON.stringify(this.cart)); localStorage.setItem(STORAGE.wishlist,JSON.stringify(this.wishlist)); }
  product(id){ return PRODUCTS.find(item=>item.id===id); }
  add(id,size="M"){
    const item=this.cart.find(entry=>entry.id===id && entry.size===size);
    if(item) item.quantity += 1;
    else { const product=this.product(id); if(product) this.cart.push({id,quantity:1,size}); }
    this.persist(); renderAll(); toast("Added to your bag");
  }
  quantity(id,size,delta){
    const item=this.cart.find(entry=>entry.id===id && entry.size===size);
    if(!item)return; item.quantity+=delta;
    if(item.quantity<=0)this.cart=this.cart.filter(entry=>!(entry.id===id&&entry.size===size));
    this.persist(); renderAll();
  }
  remove(id,size){this.cart=this.cart.filter(entry=>!(entry.id===id&&entry.size===size));this.persist();renderAll();toast("Removed from your bag");}
  toggleWish(id){
    this.wishlist=this.wishlist.includes(id)?this.wishlist.filter(item=>item!==id):[...this.wishlist,id];
    this.persist();renderAll();toast(this.wishlist.includes(id)?"Saved to your wishlist":"Removed from wishlist");
  }
  get visibleProducts(){
    let items=PRODUCTS.filter(product=>(this.category==="all"||product.category===this.category)&&
      (product.name+" "+product.description+" "+product.category).toLowerCase().includes(this.query));
    if(this.sort==="price-low")items.sort((a,b)=>a.price-b.price);
    if(this.sort==="price-high")items.sort((a,b)=>b.price-a.price);
    if(this.sort==="name")items.sort((a,b)=>a.name.localeCompare(b.name));
    return items;
  }
  get subtotal(){return this.cart.reduce((sum,item)=>sum+(this.product(item.id)?.price||0)*item.quantity,0);}
}
const store=new HirayaStore();
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];

function productCard(product){
  const liked=store.wishlist.includes(product.id);
  return `<article class="product-card">
    <div class="product-image-wrap" data-product="${product.id}" role="button" tabindex="0" aria-label="View ${product.name}">
      <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='assets/product-fallback.svg';">
      <span class="product-tag">${product.tag}</span>
      <button class="heart-button ${liked?"liked":""}" data-wish="${product.id}" aria-label="${liked?"Remove from":"Add to"} wishlist">${liked?"♥":"♡"}</button>
      <button class="quick-add" data-quick-add="${product.id}">Quick add +</button>
    </div>
    <div class="product-info"><div class="product-meta"><h3 class="product-name">${product.name}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-description">${product.description}</p></div>
  </article>`;
}
function renderProducts(){
  const items=store.visibleProducts;
  $("#product-grid").innerHTML=items.length?items.map(productCard).join(""):`<div class="no-results">Nothing found just yet.<br><small>Try another search or category.</small></div>`;
  $("#results-count").textContent=`Showing ${items.length} ${items.length===1?"piece":"pieces"}`;
  $("#category-filter").value=store.category; $("#sort-select").value=store.sort;
}
function renderCart(){
  const totalQty=store.cart.reduce((sum,item)=>sum+item.quantity,0);
  $("#cart-count").textContent=totalQty; $("#drawer-cart-count").textContent=`(${totalQty})`;
  $("#cart-subtotal").textContent=money(store.subtotal);
  $("#cart-items").innerHTML=store.cart.length?store.cart.map(item=>{
    const p=store.product(item.id); if(!p)return "";
    return `<div class="cart-line"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/product-fallback.svg';"><div><h3 class="line-title">${p.name}</h3><p class="line-sub">Size: ${item.size}<br>${money(p.price)} each</p><div class="line-actions"><div class="qty-control"><button data-qty="-1" data-id="${p.id}" data-size="${item.size}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-qty="1" data-id="${p.id}" data-size="${item.size}" aria-label="Increase quantity">+</button></div><button class="remove-button" data-remove="${p.id}" data-size="${item.size}">Remove</button></div></div><strong class="line-price">${money(p.price*item.quantity)}</strong></div>`;
  }).join(""):`<div class="empty-state">Your bag is waiting for a little something.<button class="text-link" data-shop-now>Explore the collection ↗</button></div>`;
  $("#cart-footer").hidden=!store.cart.length;
}
function renderWishlist(){
  $("#wishlist-count").textContent=store.wishlist.length;
  $("#drawer-wishlist-count").textContent=`(${store.wishlist.length})`;
  const products=store.wishlist.map(id=>store.product(id)).filter(Boolean);
  $("#wishlist-items").innerHTML=products.length?products.map(p=>`<div class="wishlist-line"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/product-fallback.svg';"><div><h3 class="line-title">${p.name}</h3><p class="line-sub">${money(p.price)}</p><div class="line-actions"><button class="remove-button" data-wish="${p.id}">Remove</button><button class="remove-button" data-quick-add="${p.id}">Add to bag</button></div></div></div>`).join(""):`<div class="empty-state">Keep the pieces you love close.<button class="text-link" data-shop-now>Find your favourites ↗</button></div>`;
}
function renderAll(){renderProducts();renderCart();renderWishlist();}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2300);}
function openDrawer(which){closeDrawers();$("#drawer-backdrop").classList.add("open");const drawer=$(which==="cart"?"#cart-drawer":"#wishlist-drawer");drawer.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closeDrawers(){$$(".side-drawer").forEach(drawer=>{drawer.classList.remove("open");drawer.setAttribute("aria-hidden","true");});$("#drawer-backdrop").classList.remove("open");document.body.style.overflow="";}
function openModal(id){closeDrawers();$(id).classList.add("open");document.body.style.overflow="hidden";}
function closeModals(){$$(".modal-backdrop").forEach(modal=>modal.classList.remove("open"));document.body.style.overflow="";}
function showProduct(id){
  const p=store.product(id);if(!p)return;store.activeProduct=p;
  $("#product-modal-content").innerHTML=`<div class="product-modal-layout"><img src="${p.image}" alt="${p.name}" onerror="this.onerror=null;this.src='assets/product-fallback.svg';"><div class="product-modal-copy"><p class="eyebrow">${p.tag} · HIRAYA STUDIO</p><h2 id="modal-product-title">${p.name}</h2><div class="modal-price">${money(p.price)}</div><p>${p.description}</p><label for="product-size">SELECT SIZE</label><select id="product-size"><option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option></select><button class="button button-dark" id="modal-add">Add to bag <span>↗</span></button><button class="text-link" id="modal-wish" style="margin:17px 0 0">♡ Save to wishlist</button></div></div>`;
  $("#modal-add").addEventListener("click",()=>{store.add(p.id,$("#product-size").value);closeModals();});
  $("#modal-wish").addEventListener("click",()=>{store.toggleWish(p.id);$("#modal-wish").textContent=store.wishlist.includes(p.id)?"♥ Saved to wishlist":"♡ Save to wishlist";});
  openModal("#product-modal");
}
function openCheckout(){
  if(!store.cart.length){toast("Your bag is empty");return;}
  $("#checkout-total").textContent=money(store.subtotal);$("#checkout-error").textContent="";openModal("#checkout-modal");
}
function placeOrder(event){
  event.preventDefault();const form=event.currentTarget;
  if(!form.reportValidity())return;
  if(!store.cart.length){$("#checkout-error").textContent="Your bag is empty. Add an item before checking out.";return;}
  const data=new FormData(form);const orderId="HS-"+Date.now().toString().slice(-7);
  const order={id:orderId,customer:data.get("name"),email:data.get("email"),items:store.cart.map(item=>({...item})),total:store.subtotal,payment:data.get("payment"),date:new Date().toISOString()};
  // Demo only: record a local confirmation, never collect or store payment credentials.
  const orders=readStorage("hirayaStudio_demoOrders",[]);orders.push(order);localStorage.setItem("hirayaStudio_demoOrders",JSON.stringify(orders));
  store.cart=[];store.persist();form.reset();closeModals();renderAll();
  $("#order-number").textContent=`ORDER REFERENCE · ${orderId}`;
  $("#confirmation-copy").textContent=`Thank you, ${order.customer}. Your demo order is confirmed. We’ll use the details you provided for this simulated checkout.`;
  openModal("#confirmation-modal");
}
function init(){
  $("#year").textContent=new Date().getFullYear();renderAll();
  $("#product-search").addEventListener("input",e=>{store.query=e.target.value.trim().toLowerCase();renderProducts();});
  $("#category-filter").addEventListener("change",e=>{store.category=e.target.value;renderProducts();});
  $("#sort-select").addEventListener("change",e=>{store.sort=e.target.value;renderProducts();});
  $("#clear-filters").addEventListener("click",()=>{store.category="all";store.query="";store.sort="featured";$("#product-search").value="";renderProducts();});
  $("#search-toggle").addEventListener("click",()=>{location.hash="#shop";$("#product-search").focus();});
  $("#cart-shortcut").addEventListener("click",()=>openDrawer("cart"));
  $("#wishlist-shortcut").addEventListener("click",()=>openDrawer("wishlist"));
  $("#drawer-backdrop").addEventListener("click",closeDrawers);
  $$("[data-close-drawer]").forEach(button=>button.addEventListener("click",closeDrawers));
  $("#checkout-open").addEventListener("click",openCheckout);
  $("#checkout-form").addEventListener("submit",placeOrder);
  $$("[data-close-modal]").forEach(button=>button.addEventListener("click",closeModals));
  $$(".modal-backdrop").forEach(modal=>modal.addEventListener("click",e=>{if(e.target===modal)closeModals();}));
  $("#continue-shopping").addEventListener("click",()=>{closeModals();location.hash="#shop";});
  $("#menu-toggle").addEventListener("click",()=>{const nav=$("#main-nav"),open=nav.classList.toggle("open");$("#menu-toggle").setAttribute("aria-expanded",String(open));});
  $$(".nav-link").forEach(link=>link.addEventListener("click",()=>$("#main-nav").classList.remove("open")));
  $$(".category-card").forEach(card=>card.addEventListener("click",()=>{store.category=card.dataset.category;$("#category-filter").value=store.category;renderProducts();location.hash="#shop";}));
  $("#newsletter-form").addEventListener("submit",e=>{e.preventDefault();const email=$("#newsletter-email").value.trim();if(!email||!$("#newsletter-email").reportValidity())return;const subscribers=readStorage("hirayaStudio_newsletter",[]);if(!subscribers.includes(email)){subscribers.push(email);localStorage.setItem("hirayaStudio_newsletter",JSON.stringify(subscribers));toast("You’re on the list. Thank you!");}else toast("You’re already on the list.");e.target.reset();});
  $("#product-grid").addEventListener("click",handleProductAction);
  $("#cart-items").addEventListener("click",handleCartAction);
  $("#wishlist-items").addEventListener("click",handleWishlistAction);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeDrawers();closeModals();}});
  // Keep the current navigation link visually in sync with the page section.
  const sections=["home","shop","story"].map(id=>document.getElementById(id));
  if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){$$(".nav-link").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+entry.target.id));}}),{rootMargin:"-30% 0px -60% 0px"});sections.forEach(section=>observer.observe(section));}
}
function handleProductAction(event){
  const wish=event.target.closest("[data-wish]");if(wish){event.stopPropagation();store.toggleWish(wish.dataset.wish);return;}
  const add=event.target.closest("[data-quick-add]");if(add){event.stopPropagation();store.add(add.dataset.quickAdd);return;}
  const card=event.target.closest("[data-product]");if(card)showProduct(card.dataset.product);
}
function handleCartAction(event){
  const qty=event.target.closest("[data-qty]");if(qty){store.quantity(qty.dataset.id,qty.dataset.size,Number(qty.dataset.qty));return;}
  const remove=event.target.closest("[data-remove]");if(remove)store.remove(remove.dataset.remove,remove.dataset.size);
  if(event.target.closest("[data-shop-now]")){closeDrawers();location.hash="#shop";}
}
function handleWishlistAction(event){
  const wish=event.target.closest("[data-wish]");if(wish){store.toggleWish(wish.dataset.wish);return;}
  const add=event.target.closest("[data-quick-add]");if(add){store.add(add.dataset.quickAdd);return;}
  if(event.target.closest("[data-shop-now]")){closeDrawers();location.hash="#shop";}
}
document.addEventListener("DOMContentLoaded",init);
