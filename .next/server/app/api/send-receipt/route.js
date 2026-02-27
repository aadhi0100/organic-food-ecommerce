"use strict";(()=>{var e={};e.id=781,e.ids=[781],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},92048:e=>{e.exports=require("fs")},55315:e=>{e.exports=require("path")},404:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>g,patchFetch:()=>x,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>u});var o={};r.r(o),r.d(o,{POST:()=>p});var i=r(49303),a=r(88716),s=r(60670),n=r(87070);async function p(e){try{let{email:t,orderDetails:o,items:i,total:a}=await e.json(),s=`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .item { border-bottom: 1px solid #ddd; padding: 10px 0; }
    .total { font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 20px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 Organic Food Store</h1>
      <p>Order Receipt</p>
    </div>
    <div class="content">
      <h2>Order #${o.orderId}</h2>
      <p><strong>Date:</strong> ${new Date().toLocaleDateString("en-IN")}</p>
      <p><strong>Customer:</strong> ${o.customerName}</p>
      
      <h3>Items Purchased:</h3>
      ${i.map(e=>`
        <div class="item">
          <strong>${e.name}</strong><br>
          Quantity: ${e.quantity} \xd7 ₹${e.price} = ₹${(e.quantity*e.price).toFixed(2)}
        </div>
      `).join("")}
      
      <div class="total">
        <p>Subtotal: ₹${o.subtotal.toFixed(2)}</p>
        <p>Tax (18%): ₹${o.tax.toFixed(2)}</p>
        <p>Delivery: ₹${o.delivery.toFixed(2)}</p>
        <p style="font-size: 24px;">Total: ₹${a.toFixed(2)}</p>
      </div>
    </div>
    <div class="footer">
      <p>Thank you for shopping with us!</p>
      <p>For support, contact: support@organicfood.com</p>
    </div>
  </div>
</body>
</html>
    `,p=r(92048),d=r(55315),c=d.join(process.cwd(),"data","receipts",`receipt_${o.orderId}.html`);return p.existsSync(d.join(process.cwd(),"data","receipts"))||p.mkdirSync(d.join(process.cwd(),"data","receipts"),{recursive:!0}),p.writeFileSync(c,s),console.log(`Receipt generated for ${t}`),n.NextResponse.json({success:!0,message:"Receipt generated successfully",receiptPath:c})}catch(e){return n.NextResponse.json({error:"Failed to generate receipt"},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/send-receipt/route",pathname:"/api/send-receipt",filename:"route",bundlePath:"app/api/send-receipt/route"},resolvedPagePath:"D:\\ecommerce\\organic-food-app\\src\\app\\api\\send-receipt\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:l}=d,g="/api/send-receipt/route";function x(){return(0,s.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:u})}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972],()=>r(404));module.exports=o})();