import Link from "next/link";

import { Button } from "@/pages.components/index";
import { Heading } from "@/components/heading";

export default function Home() {
  return (
    <div>
      <Heading variant="h1">Hello world!</Heading>
      <Link href="/login">
        <Button>Connect</Button>
      </Link>
    </div>
  );
}
