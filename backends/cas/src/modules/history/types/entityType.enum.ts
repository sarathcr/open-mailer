import { registerEnumType } from '@nestjs/graphql';

export enum EntityType {
  USER = 'USER',
}

registerEnumType(EntityType, {
  name: 'EntityType',
});
