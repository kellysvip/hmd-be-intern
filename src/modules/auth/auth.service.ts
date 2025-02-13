import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { config } from '../../config';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { JwtPayload } from '../../common/constants/types/jwt-payload.type';
import { getCurrentDate } from '../../helpers';

@Injectable({})
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    /**
     * Verify if user is logged in
     * Return the jwt token if yes
     * 
     * @param {number} deviceId - device id of user
     * @param {string} username - username of user
     * @param {string} password - password
     *
     * @return {Promise<object>} the object contains jwt token
     */
    async login(deviceId, dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username,
            },
        });

        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        if (user.loginAttempts > config.MAX_LOGIN_ATTEMPTS) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    isBannedBySystem: true,
                    updatedAt: getCurrentDate(),
                    updatedBy: Buffer.from('system'),
                },
            });
            throw new ForbiddenException(
                'Your account is locked due to more than 5 failed login attempts',
            );
        }

        const deviceCount = await this.prisma.userLoggedDevice.findMany({
            where: {
                userId: user.id,
            },
            distinct: ['deviceId'],
        });

        if (deviceCount.length > config.MAX_DEVICE_SESSIONS) {
            throw new ForbiddenException(
                'You cannot log in on more than 5 devices simultaneously',
            );
        }

        if (user.isBlockedByTenantOwner) {
            throw new ForbiddenException('Account has been blocked by tenant owner');
        }

        if (user.isBannedBySystem) {
            throw new ForbiddenException('Account has been banned by system');
        }

        const overdueInvoices = await this.prisma.paymentInvoice.findMany({
            where: {
                status: 'waiting',
                mustPayDate: {
                    lt: getCurrentDate(),
                },
            },
            select: {
                id: true,
            },
        });

        if (!!overdueInvoices.length) {
            throw new ForbiddenException(
                'Your account is locked due to overdue invoice',
            );
        }

        const pwMatches = await this.verifyPassword(dto.password, user.password);
        if (!pwMatches) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    loginAttempts: {
                        increment: 1,
                    },
                    updatedAt: getCurrentDate(),
                    updatedBy: Buffer.from('system'),
                },
            });

            throw new ForbiddenException('Invalid credentials');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                loginAttempts: 0,
                updatedAt: getCurrentDate(),
                updatedBy: Buffer.from('system'),
            },
        });

        await this.prisma.userLoggedDevice.create({
            data: {
                userId: user.id,
                deviceId,
                createdAt: getCurrentDate(),
                updatedAt: getCurrentDate(),
                createdBy: Buffer.from('system'),
                updatedBy: Buffer.from('system'),
            }
        });

        return this.signToken(user.id, user.username);
    }

    /**
     * Sign JWT token
     * Return the jwt token if yes
     *
     * @param {string} userId   - id of user
     * @param {string} username - username of user
     *
     * @return {string} Access token
     */
    async signToken(
        userId: number,
        username: string,
    ): Promise<{ access_token: string }> {
        const payload: JwtPayload = {
            id: userId,
            username,
        };

        const token = await this.jwtService.signAsync(payload, {
            expiresIn: config.JWT.EXPIRATION,
            secret: config.JWT.SECRET,
        });

        return {
            access_token: token,
        };
    }

    /**
     * Return the comparation between password and hash
     *
     * @param {string} password   - password of user
     * @param {string} hash       - hashed password in database
     *
     * @return {Promise<boolean>} is password correct
     */
    private async verifyPassword(
        password: string,
        hash: string,
    ): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}
