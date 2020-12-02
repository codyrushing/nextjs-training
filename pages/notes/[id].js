import React from 'react'
import { useRouter } from 'next/router'

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  <Link href="/notes">Notes index</Link>

  return <div>Note {id}</div>
}

export default Page