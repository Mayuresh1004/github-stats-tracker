import crypto from 'crypto'
import { prisma } from "../../../../lib/db";


const verifySignature = (secret: string, payload: string, signature: string) => {
    const hmac = crypto.createHmac('sha256', secret)
    const digest = 'sha256=' + hmac.update(payload).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

const handleUserInfo = async (payload:string, action:string) => {
    const parsedPayload = JSON.parse(payload)
    const githubId = parsedPayload.sender.id
    
    const user = await prisma.user.findFirst({
        where: {
            githubId: githubId.toString()
        }
    })

    if(user){
        await prisma.githubEvents.create({
            data:{
                userId: user.id,
                eventType: action,
                payload: parsedPayload,
                processed: false
            }
        })
    }
}

export const POST = async (req: Request) => {
    const secret = process.env.GITHUB_WEBHOOK_SECRET as string
    const body = await req.text()
    const signature = req.headers.get('x-hub-signature-256') as string
    const action = req.headers.get('x-github-event') as string

    

    if (!verifySignature(secret, body, signature)) {
    return new Response("Unauthorized", { status: 401 })
}

    await handleUserInfo(body,action);

    console.log("Webhook body:", body);

    return new Response(JSON.stringify({ message: "Webhook received successfully" }), { status: 200 })

}
