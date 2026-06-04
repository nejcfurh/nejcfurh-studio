'use server';

import {
  getListingsByTypePaginated,
  getOfferListingsPaginated,
  type PaginatedListings
} from '@/features/listings/utils/get-listings';

const LOAD_MORE_BATCH = 4;

export const loadMoreOffers = async (
  afterId: string
): Promise<PaginatedListings> => {
  return getOfferListingsPaginated(LOAD_MORE_BATCH, afterId);
};

export const loadMoreSell = async (
  afterId: string
): Promise<PaginatedListings> => {
  return getListingsByTypePaginated('sell', LOAD_MORE_BATCH, afterId);
};

export const loadMoreRent = async (
  afterId: string
): Promise<PaginatedListings> => {
  return getListingsByTypePaginated('rent', LOAD_MORE_BATCH, afterId);
};
