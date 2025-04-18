import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";


// Remove from cart
export async function POST(req:NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const {productId} = await req.json();
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        session.user.id,
        { $pull: { cart: productId } },
        { new: true }
      );
  
      if (!updatedUser) {
        return Response.json({ error: "User not found" }, { status: 404 });
      }
  
      return Response.json(
        { message: "Product removed from cart", cart: updatedUser.cart },
        { status: 200 }
      );
    } catch (error) {
      return Response.json({ message: "Internal Server Error"+ error}, { status: 500 });
    }
  }
