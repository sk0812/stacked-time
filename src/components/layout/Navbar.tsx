import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link href="/" className="text-2xl font-bold text-primary">
            TimeStack
          </Link>
        </div>
        <div className="flex-none">
          <Link href="/login" className="btn btn-primary">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
