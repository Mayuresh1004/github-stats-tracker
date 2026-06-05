import { HomeClient } from "@/app/(marketing)/home-client"
import { getDemoProfileUsername } from "@/lib/demo-profile"

export default async function Home() {
  const demoProfileUsername = await getDemoProfileUsername()
  return <HomeClient demoProfileUsername={demoProfileUsername} />
}
