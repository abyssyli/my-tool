import { NewClient } from "./NewClient";

export default async function NewPage({
  searchParams,
}: {
  searchParams?: Promise<{ date?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  return <NewClient presetDate={params?.date} />;
}
