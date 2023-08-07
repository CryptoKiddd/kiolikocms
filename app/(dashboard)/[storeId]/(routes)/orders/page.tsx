import BillboardClient from "@/components/billboard/BillboardClient";
import { BillboardColumn } from "@/components/billboard/BillboardColumns";
import OrderClient from "@/components/order/OrderClient";
import { OrderColumn } from "@/components/order/OrderColumns";
import prismadb from "@/lib/prismadb"
import {format} from "date-fns"

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where:{
        storeId:params.storeId
    },
    include:{
      orderItems:{
        include:{
          product:true
        }
      }
    },
    orderBy:{
        createdAt:'desc'
    }
  });

 const formattedOrders:OrderColumn[]= orders.map(item=>({
    id:item.id,
    phone:item.phone,
    address:item.address,
    products:item.orderItems.map(item=>item.product.name).join(", "),
    totalPrice:Number(item.orderItems.reduce((total,item)=>{
      return total + Number(item.product.price)

    },0)),
    isPaid:item.isPaid,
    createdAt:format(item.createdAt,"MMM do, yyy")
 }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
