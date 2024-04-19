import { HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { GithubService } from '../../common/helpers/github/github.service';
import { IResponse } from '../../common/interfaces/response.interface';
import { ServiceError } from '../../common/errors/service.error';
import { User } from '../user/entities/user.entity';
import { successResponse } from '../../common/responses/success.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly githubService: GithubService,
    private readonly jwtService: JwtService,
  ) {}

  async github(
    code: string,
    ipAddress: string,
  ): Promise<IResponse | ServiceError> {
    try {
      const user = await this.githubService.getUserByAuthCode(code);

      if (user.status === false) {
        throw new ServiceError(
          'Invalid authentication code',
          HttpStatus.BAD_REQUEST,
        );
      }

      const userExists = await this.userRepository.findOne({
        where: { username: user?.data?.login },
      });

      if (userExists) {
        const { token, expire } = await this.generateToken(userExists.id);

        await this.userRepository.update(userExists._id, {
          ip_address: ipAddress,
        });

        return successResponse({
          status: true,
          message: 'Authenticated successfully',
          data: {
            token,
            expire,
            user: {
              ...userExists,
              _id: undefined,
              metadata: undefined,
            },
          },
        });
      }

      const newUser = this.userRepository.create({
        id: uuidv4(),
        name: user?.data?.name as string,
        username: user?.data?.login,
        avatar_url: user?.data?.avatar_url,
        ip_address: ipAddress,
        metadata: user?.data,
      });
      await this.userRepository.save(newUser);

      const { token, expire } = await this.generateToken(newUser.id);

      return successResponse({
        status: true,
        message: 'Authenticated successfully',
        data: {
          token,
          expire,
          user: {
            ...newUser,
            _id: undefined,
            metadata: undefined,
          },
        },
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'Error occurred while trying to authenticate with Github',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  async getSession(id: string): Promise<IResponse | ServiceError> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new ServiceError('User not found', HttpStatus.NOT_FOUND);
      }

      return successResponse({
        status: true,
        message: 'Auth session',
        data: {
          ...user,
          _id: undefined,
          metadata: undefined,
        },
      });
    } catch (error) {
      if (error instanceof ServiceError) {
        return error.toErrorResponse();
      }

      throw new ServiceError(
        'Error occurred while trying to retrieve user session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ).toErrorResponse();
    }
  }

  private async generateToken(id: string): Promise<{
    token: string;
    expire: number;
  }> {
    const token = this.jwtService.sign({
      sub: id,
    });
    const decoded = this.jwtService.decode(token);

    return {
      token,
      expire: decoded.exp,
    };
  }
}