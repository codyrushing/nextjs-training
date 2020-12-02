import React from 'react';
import Link from 'next/link';

const Page = () => {
  const links = Array(15).fill(0).map(
    (_, index) => <li>
      <Link href="/notes/[id]" as={`/notes/${index}`}>
        <a>Note {index}</a>
      </Link>
    </li>
  );
  return <div>
    <h1>Index page</h1>
    <ul>
      { links }
    </ul>
  </div>
}


export default Page;