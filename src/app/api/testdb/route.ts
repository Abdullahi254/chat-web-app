import { dbConnect, disconnect } from "@/app/lib/db";

export async function GET() {
    await dbConnect();
    console.log("hit db connect", new Date().getSeconds());
    return Response.json({ messsage: "Hello World! Connection successfull" });
}