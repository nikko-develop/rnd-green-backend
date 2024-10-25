export class Guard {
  public static isEmpty(value: unknown): boolean {
    if (typeof value === 'undefined' || value === null) {
      return true;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return false;
    }

    if (value === '') {
      return true;
    }

    if (value instanceof Date) {
      return false;
    }

    if (value instanceof Map) {
      return false;
    }

    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return true;
      }
      if (value.every((item) => Guard.isEmpty(item))) {
        return true;
      }
    }

    return false;
  }

  public static isPositive(value: number): boolean {
    return this.isInRange(value, 0);
  }

  public static isInRange(value: number, min?: number, max?: number) {
    if (!min && !max) {
      return false;
    }

    if (min && !max) {
      return value >= min;
    }

    if (max && !min) {
      return value <= max;
    }

    if (max && min) return value >= min && value <= max;

    return false;
  }
}
