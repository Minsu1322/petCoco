import Link from "next/link";

const NotLogInView = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-3xl mb-4">산책 메이트</h1>
    <p className="mb-4">산책 메이트를 이용하려면 로그인이 필요합니다.</p>
    <Link href="/login" className="bg-mainColor text-white px-4 py-2 rounded">
      로그인하기
    </Link>
  </div>
  )
}

export default NotLogInView