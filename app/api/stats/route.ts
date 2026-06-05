import {auth} from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const session = await auth.api.getSession({
        headers: req.headers,
    })
    if(!session){
        return new Response(JSON.stringify({error: "Unauthorized"}), {status: 401})
    }
    const user = session.user

    const stats = await prisma.dailyStats.findMany({
        where: {
            userId: user?.id
        },
        select:{
            id: true,
            date: true,
            commits: true,
            pullRequests: true,
            issues: true,
            prs_merged: true,
            createdAt: true,
        }
    })

    return new Response(JSON.stringify({stats}), {status: 200})

}