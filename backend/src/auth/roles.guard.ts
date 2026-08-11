import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    if (!user || !requiredRoles.includes(user.role)) {
      return false;
    }

    // IP Whitelisting for Administrators
    if (user.role === 'ADMINISTRATOR') {
      const settings = await this.prisma.globalSettings.findUnique({ where: { id: 'singleton' } });
      if (settings?.adminIpWhitelist) {
        const allowedIps = settings.adminIpWhitelist.split(',').map(ip => ip.trim());
        const clientIp = request.ip || request.connection.remoteAddress;
        
        // Basic check: if whitelist has entries, client IP must be in it
        if (allowedIps.length > 0 && !allowedIps.includes(clientIp)) {
          console.warn(`[Security] Blocked Admin access from unauthorized IP: ${clientIp}`);
          throw new ForbiddenException('Access denied from this IP address');
        }
      }
    }

    return true;
  }
}
