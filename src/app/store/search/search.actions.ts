import { createActionGroup, props } from '@ngrx/store';

export const SearchActions = createActionGroup({
  source: 'Search',
  events: {
    'filter': props<{ query: string }>(),

    'apply filter INTERNAL': props<{ query: string }>(),
  },
});
