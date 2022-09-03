import Link from "next/link";
import PublicLayout from "@/components/layout/public";

export default function Home() {
  return (
    <PublicLayout>
      <div>
        <p className="text-3xl font-bold underline">Hello world!</p>
        <Link href="/login">
          <button className="w-full py-2 flex justify-center rounded-lg font-bold bg-black-shade-3 mt-2 text-gray-text dynamicTranss">
            Connect
          </button>
        </Link>
      </div>
    </PublicLayout>
  );
}
