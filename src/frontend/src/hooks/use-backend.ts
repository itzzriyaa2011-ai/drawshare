import { useActor } from "@caffeineai/core-infrastructure";
import { type backendInterface, createActor } from "../backend";

export function useBackend(): {
  actor: backendInterface | null;
  isFetching: boolean;
} {
  const { actor, isFetching } = useActor(createActor);
  return { actor: actor as backendInterface | null, isFetching };
}
