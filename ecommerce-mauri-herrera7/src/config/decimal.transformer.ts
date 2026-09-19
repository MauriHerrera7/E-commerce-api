import { ValueTransformer } from 'typeorm';

/** PostgreSQL returns numeric columns as strings. Convert only at the API boundary
 * after PostgreSQL has preserved the exact stored decimal value. */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number) => value,
  from: (value?: string | number) =>
    value === undefined ? value : Number(value),
};
