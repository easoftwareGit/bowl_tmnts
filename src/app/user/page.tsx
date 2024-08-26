import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { User } from "@/components/users/userFromClient";
import { LoginButton, LogoutButton } from "@/components/auth";
import UserNavBar from "@/components/navBar/userNavBar";


export default async function Hello() {
  const session = await getServerSession(authOptions)

  return (
    <div>
      <UserNavBar />
      {/* <LoginButton />
      <LogoutButton />
      <h2>Server</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client</h2>
      <User /> */}
    </div>
  );
}