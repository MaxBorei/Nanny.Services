import { useIsFetching } from "@tanstack/react-query";
import Loader from "../Loader/Loader";

export default function GlobalLoader() {
  const fetching = useIsFetching();

  const isLoading = fetching > 0;

  if (!isLoading) return null;

  return <Loader message="Loading..." />;
}
