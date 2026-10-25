import { useEffect } from "react";
import { useTypesLegalActSearch } from "../../hooks/useTypesLegalActSearch";

export default function ApiSingleLegalAct({
  config,
}: {
  config: Record<string, string>;
}) {
  const searchParams = new URLSearchParams(config);

  const { data, loading, error, getData } =
    useTypesLegalActSearch(searchParams);

  useEffect(() => {
    void getData();
  }, [getData]);

  if (loading) return <p>Pobieranie…</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <ul>
      {data?.items.map((item) => (
        <li key={item.ELI}>{item.title}</li>
      ))}
    </ul>
  );
}
