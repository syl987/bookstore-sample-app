import { googleBooksFeature } from './google-books.reducer';

// TODO delete this file, all feature selectors are already defined inside the feature object
// TODO add complex multi-feature selectors here

export const selectGoogleBooksSearchQuery = googleBooksFeature.selectSearchQuery;
export const selectGoogleBooksSearchList = googleBooksFeature.selectSearchList;
export const selectGoogleBooksSearchPending = googleBooksFeature.selectSearchPending;
export const selectGoogleBooksSearchError = googleBooksFeature.selectSearchError;

export const SearchSelectors = {
  selectSearchQuery: googleBooksFeature.selectSearchQuery,
  selectSearchList: googleBooksFeature.selectSearchList,
  selectSearchPending: googleBooksFeature.selectSearchPending,
  selectSearchError: googleBooksFeature.selectSearchError,
};
