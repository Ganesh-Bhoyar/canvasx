// // app/room/[slug]/page.tsx
// import Board from "../../../components/board";

// type Props = {
//   params: {
//     slug: string;
//   };
// };

// /**
//  * This function tells Next.js which pages to build at build time.
//  * It MUST return an array of objects, where each object has a key
//  * that matches the dynamic segment name (in this case, 'slug').
//  */
// // export async function generateStaticParams() {
// //   // Replace this with your actual API call to fetch all rooms
// //   const res = await fetch('http://localhost:3001/api/v1/rooms');
// //   const rooms = await res.json();

// //   // Ensure you are mapping over the result and returning the correct format
// //   return rooms.map((room: { slug: string }) => ({
// //     slug: room.slug,
// //   }));
// // }


// // Your page component is correct as it is.
// export default async function CanvasPage({ params: { slug } }: Props) {
//    const room=await slug
//   return (
//     <div className="overflow-hidden overflow-y-hidden">
//       {slug}
//       <Board slug={room} />
//     </div>
//   );
// }

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Board from "../../../components/board";

// Note: No 'Props' type is needed from the server anymore.

export default function CanvasPage() {
  // 1. Get params using the hook. It might be null initially.
  const params = useParams();
  const slug = params?.slug as string; // Assert type if you're sure it exists

  // You would typically have a loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      // If you need to fetch data based on the slug, you do it here.
      setIsLoading(false);
    }
  }, [slug]);

  if (isLoading || !slug) {
    return <div>Loading Room...</div>; // Show a loading state until the slug is available
  }

  return (
    <div className="overflow-hidden overflow-y-hidden">
      Room Slug: {slug}
      <Board slug={slug} />
    </div>
  );
}