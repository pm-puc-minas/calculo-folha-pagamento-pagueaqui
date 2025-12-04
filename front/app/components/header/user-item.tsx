'use client';

import { useAuth } from '@/app/context/authContext';
import { SignOut, User } from '@phosphor-icons/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { NavItem } from '../aside/nav-item';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Skeleton } from '../ui/skeleton';

export function UserHeaderItem() {
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !user) {
        return (
            <div className="flex items-center w-fit gap-2">
                <Skeleton className="size-8 rounded-full shrink-0" />
                <div className="space-y-1 w-28 mr-2">
                    <Skeleton className="h-3.5 w-full" />
                    <Skeleton className="h-2.5 w-2/3" />
                </div>
                <Skeleton className="size-2 rounded-full" />
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex ml-0. bg-transparent hover:bg-neutral-950/5 transition-colors duration-300 p-1 rounded-lg border-none items-center w-fit gap-2">
                    <div className="size-8 rounded-full bg-[#F8F9FA] flex items-center justify-center">
                        <User className="size-4" />
                    </div>
                    <div className="text-start font-medium mr-2">
                        <p className="text-sm text-[#343A40]">{user.name}</p>
                        <p className="text-xs text-[#868E96]">{user.role}</p>
                    </div>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36">
                <NavItem href="/myProfile" name="Perfil" icon={User} />
                <div>
                    <NavItem href="/signout" name="Sair" icon={SignOut} />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
