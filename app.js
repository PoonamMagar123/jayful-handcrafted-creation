const ADMIN_PASSWORD = "jayful123"; // CHANGE THIS before publishing
const WHATSAPP_NUMBER = "919999999999"; // CHANGE THIS to your WhatsApp number

const demoProducts = [
  {id:"p1",name:"Pearl Mangalsutra",price:899,stock:10,category:"Pearl",description:"Elegant handmade pearl mangalsutra.",image:"https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800"},
  {id:"p2",name:"Maharashtrian Saaj",price:1299,stock:8,category:"Traditional",description:"Traditional-inspired statement jewellery.",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800"},
  {id:"p3",name:"Pearl Necklace Set",price:999,stock:12,category:"Necklace",description:"Graceful pearl necklace for special occasions.",image:"https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800"},
  {id:"p4",name:"Temple Jhumka",price:549,stock:15,category:"Earrings",description:"Classic handcrafted jhumka with a festive look.",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800"},
  {id:"p5",name:"Green Pearl Set",price:749,stock:9,category:"Pearl",description:"Green stone and pearl combination set.",image:"https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800"},
  {id:"p6",name:"Bridal Pearl Earrings",price:699,stock:11,category:"Bridal",description:"Statement earrings for bridal and festive styling.",image:"https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800"},
  {id:"p7",name:"Handmade Bracelet",price:399,stock:20,category:"Bracelets",description:"Minimal handmade bracelet for everyday wear.",image:"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800"},
  {id:"p8",name:"Spring Flower Nath",price:349,stock:14,category:"Nath",description:"Delicate floral-inspired Maharashtrian nath.",image:"https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=800"}
];

let products = JSON.parse(localStorage.getItem("jayful_products") || "null") || demoProducts;
let cart = JSON.parse(localStorage.getItem("jayful_cart") || "[]");

const $ = s => document.querySelector(s);
const money = n => "₹" + Number(n).toLocaleString("en-IN");

function saveProducts(){localStorage.setItem("jayful_products",JSON.stringify(products))}
function saveCart(){localStorage.setItem("jayful_cart",JSON.stringify(cart))}
function toast(msg){let t=document.querySelector(".toast");if(!t){t=document.createElement("div");t.className="toast";document.body.appendChild(t)}t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}

function renderCategories(){
  const cats=[...new Set(products.map(p=>p.category).filter(Boolean))].sort();
  $("#categoryFilter").innerHTML='<option value="all">All Categories</option>'+cats.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
}
function renderProducts(){
  const q=$("#searchInput").value.toLowerCase().trim();
  const cat=$("#categoryFilter").value;
  const list=products.filter(p=>(cat==="all"||p.category===cat)&&(!q||(p.name+" "+p.category+" "+p.description).toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.length?list.map(p=>`
    <article class="product-card">
      <div class="product-img">${p.stock<=0?'<span class="tag">SOLD OUT</span>':p.stock<=5?'<span class="tag">LIMITED</span>':''}<img src="${safeUrl(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
      <div class="product-info"><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description||"Handcrafted jewellery.")}</p>
      <div class="price-row"><span class="price">${money(p.price)}</span><button class="add-btn" ${p.stock<=0?"disabled":""} onclick="addToCart('${p.id}')">${p.stock<=0?"Sold Out":"Add to Cart"}</button></div></div>
    </article>`).join(""):'<div class="empty">No jewellery found.</div>';
}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);$("#cartCount").textContent=count;
  if(!cart.length){$("#cartItems").innerHTML='<div class="empty">Your cart is empty.<br>Choose something beautiful ✨</div>';$("#cartTotal").textContent="₹0";return}
  let total=0;
  $("#cartItems").innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);if(!p)return"";total+=p.price*i.qty;return`
    <div class="cart-row"><img src="${safeUrl(p.image)}" alt="">
      <div><h4>${escapeHtml(p.name)}</h4><small>${money(p.price)} × ${i.qty}</small>
      <div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><span>${i.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div></div>
      <button class="remove" onclick="removeCart('${p.id}')">Remove</button>
    </div>`}).join("");
  $("#cartTotal").textContent=money(total);
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||p.stock<=0)return;const i=cart.find(x=>x.id===id);if(i){if(i.qty<p.stock)i.qty++}else cart.push({id,qty:1});saveCart();renderCart();openCart();toast("Added to cart")}
function changeQty(id,d){const i=cart.find(x=>x.id===id),p=products.find(x=>x.id===id);if(!i)return;i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id);else if(p&&i.qty>p.stock)i.qty=p.stock;saveCart();renderCart()}
function removeCart(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#overlay").classList.remove("show")}

function checkout(){
  if(!cart.length){toast("Your cart is empty");return}
  let total=0;
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);total+=p.price*i.qty;return`• ${p.name} × ${i.qty} — ${money(p.price*i.qty)}`}).join("%0A");
  const msg=`Hello JAYFUL Handcrafted Creation!%0A%0AI would like to order:%0A${lines}%0A%0ATotal: ${money(total)}%0A%0AName:%0AAddress:%0A`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`,"_blank");
}

function openAdmin(){$("#adminModal").classList.add("show")}
function closeAdmin(){$("#adminModal").classList.remove("show")}
function loginAdmin(){if($("#adminPassword").value===ADMIN_PASSWORD){$("#adminLogin").classList.add("hidden");$("#adminPanel").classList.remove("hidden");renderAdmin();}else toast("Wrong password")}
function renderAdmin(){
  $("#adminProducts").innerHTML=products.map(p=>`<div class="admin-item"><img src="${safeUrl(p.image)}"><div><h4>${escapeHtml(p.name)}</h4><small>${money(p.price)} • ${escapeHtml(p.category)} • Stock ${p.stock}</small></div><div class="admin-actions"><button onclick="editProduct('${p.id}')">Edit</button><button onclick="deleteProduct('${p.id}')">Delete</button></div></div>`).join("");
}
function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;$("#editId").value=p.id;$("#pName").value=p.name;$("#pPrice").value=p.price;$("#pStock").value=p.stock;$("#pCategory").value=p.category;$("#pImage").value=p.image||"";$("#pDescription").value=p.description||"";$("#productForm").classList.remove("hidden");window.scrollTo({top:document.body.scrollHeight,behavior:"smooth"})}
function newProduct(){["editId","pName","pPrice","pStock","pCategory","pImage","pDescription"].forEach(id=>$("#"+id).value="");$("#pStock").value=10;$("#productForm").classList.remove("hidden")}
function saveProduct(e){e.preventDefault();const id=$("#editId").value||"p"+Date.now();const item={id,name:$("#pName").value.trim(),price:Number($("#pPrice").value),stock:Number($("#pStock").value),category:$("#pCategory").value.trim(),image:$("#pImage").value.trim()||"assets/logo.png",description:$("#pDescription").value.trim()||"Handcrafted jewellery."};const idx=products.findIndex(p=>p.id===id);if(idx>=0)products[idx]=item;else products.unshift(item);saveProducts();renderCategories();renderProducts();renderAdmin();$("#productForm").classList.add("hidden");toast(idx>=0?"Product updated":"Product added")}
function deleteProduct(id){const p=products.find(x=>x.id===id);if(!p||!confirm(`Delete ${p.name}?`))return;products=products.filter(x=>x.id!==id);cart=cart.filter(x=>x.id!==id);saveProducts();saveCart();renderCategories();renderProducts();renderCart();renderAdmin();toast("Product deleted")}
function resetProducts(){if(!confirm("Reset to demo products?"))return;products=[...demoProducts];saveProducts();renderCategories();renderProducts();renderAdmin();toast("Demo products restored")}

function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function safeUrl(v=""){if(v.startsWith("https://")||v.startsWith("http://")||v.startsWith("assets/"))return v;return "assets/logo.png"}

document.addEventListener("DOMContentLoaded",()=>{
  $("#year").textContent=new Date().getFullYear();
  renderCategories();renderProducts();renderCart();
  $("#searchInput").addEventListener("input",renderProducts);$("#categoryFilter").addEventListener("change",renderProducts);
  $("#openCart").onclick=openCart;$("#closeCart").onclick=closeCart;$("#overlay").onclick=closeCart;
  $("#checkoutBtn").onclick=checkout;
  $("#openAdmin").onclick=openAdmin;$("#closeAdmin").onclick=closeAdmin;$("#loginBtn").onclick=loginAdmin;
  $("#newProductBtn").onclick=newProduct;$("#cancelEdit").onclick=()=>$("#productForm").classList.add("hidden");
  $("#productForm").addEventListener("submit",saveProduct);$("#resetProductsBtn").onclick=resetProducts;
  $("#whatsappLink").href=`https://wa.me/${WHATSAPP_NUMBER}`;
  $("#menuBtn").onclick=()=>{document.querySelector(".nav").style.display=document.querySelector(".nav").style.display==="flex"?"none":"flex"};
});
