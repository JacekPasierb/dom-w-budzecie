import { RoomDetail } from "@/components/RoomDetail/RoomDetail";
import { DEFAULT_ROOMS } from "@/data/defaultRooms";

export const dynamicParams = true;

export function generateStaticParams() {
  return DEFAULT_ROOMS.map((room) => ({ room: room.id }));
}

export default async function RoomPage({
  params,
}: {
  params: Promise<{ room: string }>;
}) {
  const { room } = await params;
  return <RoomDetail room={decodeURIComponent(room)} />;
}
