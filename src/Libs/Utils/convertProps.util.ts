import { ValueObject } from '@Libs/ddd/ValueObject.base';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertPropsToObject(props: any): any {
  const propsCopy = { ...props };

  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[`${prop}`])) {
      propsCopy[`${prop}`] = (propsCopy[`${prop}`] as Array<unknown>).map((item) => {
        return convertToPlainObject(item);
      });
    }
    propsCopy[`${prop}`] = convertToPlainObject(propsCopy[`${prop}`]);
  }

  return propsCopy;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertToPlainObject(item: any): unknown {
  if (ValueObject.isValueObject(item)) {
    return item.unpack();
  }

  return item;
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
