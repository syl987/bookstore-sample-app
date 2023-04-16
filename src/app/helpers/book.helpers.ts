import { ValidationErrors } from '@angular/forms';

import { BookDTO } from '../models/book.models';

export function getPublishUserBookValidationErrors(book: BookDTO): ValidationErrors {
  let errors = {};

  if (book.description == null) {
    errors = { ...errors, description: { required: true } };
  }
  if (book.description != null && book.description.length < 100) {
    errors = { ...errors, description: { minlength: 100 } };
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
  return errors;
}
