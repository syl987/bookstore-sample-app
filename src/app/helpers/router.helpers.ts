import { ActivatedRouteSnapshot, Data, Params } from '@angular/router';

export function collectActivatedRouteSnapshotData(
  snapshot: ActivatedRouteSnapshot | null | undefined,
  accessor: (snapshot: ActivatedRouteSnapshot) => Data | Params,
): ReturnType<typeof accessor> {
  if (!snapshot) {
    return {};
  }
  let result = {};
  while (snapshot.firstChild) {
    snapshot = snapshot.firstChild;
    result = { ...result, ...accessor(snapshot) };
  }
  return result;
}

export function getActivatedRouteSnapshotFragment(snapshot: ActivatedRouteSnapshot | null | undefined): string | null {
  if (!snapshot) {
    return null;
  }
  while (snapshot.firstChild) {
    snapshot = snapshot.firstChild;
  }
  return snapshot.fragment;
}
