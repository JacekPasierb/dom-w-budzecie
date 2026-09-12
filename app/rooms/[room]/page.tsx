import { notFound } from "next/navigation";
import { RoomDetail } from "@/components/RoomDetail/RoomDetail";
import { ROOMS, type Room } from "@/types/expense";

function isRoom(value: string): value is Room {
  return (ROOMS as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return ROOMS.map((room) => ({ room }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room } = await params;
  if (!isRoom(room)) notFound();
  return <RoomDetail room={room} />;
}
