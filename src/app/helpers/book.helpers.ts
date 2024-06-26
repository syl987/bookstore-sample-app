import { ValidationErrors } from '@angular/forms';

import { BookCondition, BookDTO } from '../models/book.models';

/**
 * Collect publish user book errors as `ValidationErrors` object.
 *
 * Should match the respective form validators.
 */
export function getPublishUserBookValidationErrors(book: BookDTO): ValidationErrors {
  let errors = {};

  if (book.description == null) {
    errors = { ...errors, description: { required: true } };
  }
  if (book.description != null && book.description.length < 24) {
    errors = { ...errors, description: { minlength: 24 } };
  }
  if (book.description != null && book.description.length > 254) {
    errors = { ...errors, description: { maxlength: 254 } };
  }
  if (book.condition == null) {
    errors = { ...errors, condition: { required: true } };
  }
  if (book.price == null) {
    errors = { ...errors, price: { required: true } };
  }
  if (book.price != null && book.price < 0) {
    errors = { ...errors, price: { min: 0 } };
  }
  if (book.price != null && book.price > 500) {
    errors = { ...errors, price: { max: 500 } };
  }
  return errors;
}

const bookConditionOrder = Object.values(BookCondition);

/**
 * Compare published books by 1. condition (desc) and 2. price (asc).
 */
export function comparePublishedBooks(book1: BookDTO, book2: BookDTO): number {
  return bookConditionOrder.indexOf(book1.condition!) - bookConditionOrder.indexOf(book2.condition!) || book1.price! - book2.price!;
}
