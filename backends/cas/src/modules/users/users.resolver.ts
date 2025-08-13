import {
  Resolver,
  Query,
  Mutation,
  Args,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { User } from '@prisma/client';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UpdatePasswordInput } from './dto/update-password.input';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { AuthService } from '../auth/auth.service';
import { SuccessResponse } from '../common/dto/success-response.dto';
import { FilterUserInput } from './dto/filter-user-input';
import { PaginationInput } from '../common/dto/pagination.input';
import { PaginationEntity } from '../common/entities/pagination.entity';
import { AdminGuard } from '../common/guard/admin.guard';
import { AuthGuard } from '../common/guard/auth.guard';

@ObjectType()
export class UserPagination extends PaginationEntity<UserEntity> {
  @Field(() => [UserEntity])
  data: UserEntity[];
}

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => UserEntity)
  @UseGuards(AdminGuard) //Note: comment this line if needed
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
    @CurrentUser() user: User,
  ) {
    return this.userService.create(createUserInput, user);
  }

  @Mutation(() => UserEntity)
  @UseGuards(AdminGuard)
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    const { id, ...rest } = updateUserInput;
    return this.userService.update(id, rest, user);
  }

  @Mutation(() => UserEntity)
  @UseGuards(AdminGuard)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.userService.remove(id);
  }

  @Mutation(() => UserEntity)
  @UseGuards(AdminGuard)
  async softDeleteUser(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.userService.softDeleteUser(id, user);
  }

  @Mutation(() => UserEntity)
  @UseGuards(AdminGuard)
  async restoreUser(@Args('id', { type: () => String }) id: string) {
    return await this.userService.restoreUser(id);
  }

  @Query(() => UserPagination, { name: 'users' })
  @UseGuards(AdminGuard)
  findAll(
    @Args('filter', { type: () => FilterUserInput, nullable: true })
    filter?: FilterUserInput,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.userService.findAll(filter, pagination, search);
  }

  @Query(() => UserEntity, { name: 'user' })
  @UseGuards(AdminGuard)
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.userService.findOne(id);
  }

  // for users

  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async changePassword(
    @CurrentUser() user: User,
    @Args('input') input: UpdatePasswordInput,
  ): Promise<SuccessResponse> {
    const result = await this.userService.updatePassword(
      user.id,
      input.password,
    );
    return {
      success: result.success,
      message: 'Successful',
    };
  }

  @Query(() => UserEntity)
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }
}
