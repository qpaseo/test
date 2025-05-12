import { Metadata } from "next";

//레이아웃 이나 페이지만 metadata를 가질 수 있음
export const metadata: Metadata = {
  title: "Not found | Next.js",
};

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
    </div>
  );
}
