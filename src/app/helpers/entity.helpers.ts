import { Dictionary } from '@ngrx/entity';

export function getEntityById<T>([entityMap, id]: [Dictionary<T>, string | number | undefined]): T | undefined {
  return id ? entityMap[id] : undefined;
}

let correlationId = 0;

export function nextCorrelationId(): number {
  return correlationId++;
}
