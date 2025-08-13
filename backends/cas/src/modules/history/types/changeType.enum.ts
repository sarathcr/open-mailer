import { registerEnumType } from '@nestjs/graphql';

export enum ChangeType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
}

registerEnumType(ChangeType, {
  name: 'ChangeType',
});
