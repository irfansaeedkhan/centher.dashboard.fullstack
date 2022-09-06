import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p className="text-3xl font-bold text-center">Hello world!</p>
      <Link href="/login">
        <button className="py-2 px-4 block w-max mx-auto rounded-lg font-bold text-yellow-300 bg-black-shade-3 mt-2">
          Connect
        </button>
      </Link>
    </div>
  );
}
